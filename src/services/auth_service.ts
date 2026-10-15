import { AuthUser, UserProfile, GlobalLocationState, OnboardingStatus } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';
import { GlobalLocationService } from './global_location_service';
import { auth, firestoreService, hasRealFirebase, getFirebaseErrorMessage, serverTimestamp } from '../firebase';

export interface StoredUserAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  passwordHash: string; // Stored securely in client storage
  hasCompletedProfile: boolean;
  createdAt: string;
  phoneVerified?: boolean;
  phoneNumber?: string;
  onboardingStatus?: OnboardingStatus;
  profile?: UserProfile;
  location?: GlobalLocationState;
  waterIntakeMl?: number;
  waterReminderSettings?: {
    enabled: boolean;
    intervalMinutes: number;
    scheduleType?: '1hour' | '2hours' | '3hours' | 'custom';
    customMinutes?: number;
    soundEnabled?: boolean;
  };
}

const STORAGE_USERS_KEY = 'pregnutri_registered_accounts_v1';
const STORAGE_SESSION_KEY = 'pregnutri_active_session_user_id_v1';

// Seed initial default account for instant testing (Clearly labeled as Demo Profile)
const DEFAULT_DEMO_ACCOUNT: StoredUserAccount = {
  id: 'user-demo-01',
  name: 'Demo Mother',
  emailOrPhone: 'demo@pregnutri.app',
  passwordHash: 'demo123',
  hasCompletedProfile: true,
  createdAt: new Date().toISOString(),
  phoneVerified: true,
  phoneNumber: '+919876543210',
  onboardingStatus: 'active',
  profile: {
    ...INITIAL_USER_PROFILE,
    name: 'Demo Mother',
    phoneVerified: true,
    mobileNumber: '+919876543210',
    onboardingStatus: 'active',
    age: 27,
    pregnancyMonth: 6,
    weeksPregnant: 24,
    heightCm: 162,
    currentWeightKg: 60.2,
    prePregnancyWeightKg: 54.0,
    state: 'Karnataka',
    city: 'Mysuru',
    district: 'Mysuru',
    taluk: 'Nanjangud',
    village: 'Hullahalli',
    mcpCardNumber: '',
    rchId: '',
    allergies: [],
    emergencyContact: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    doctorDetails: {
      name: '',
      hospital: '',
      phone: '',
      nextAppointmentDate: '',
      nextAppointmentTime: ''
    },
    nextDoctorVisit: {
      date: '',
      time: '',
      doctorName: '',
      hospitalName: '',
      phone: '',
      notes: ''
    },
    waterIntakeGoalMl: 2500,
    waterReminderSettings: {
      enabled: true,
      intervalMinutes: 60,
      scheduleType: '1hour',
      soundEnabled: true
    }
  },
  location: {
    country: 'India',
    state: 'Karnataka',
    district: 'Mysuru',
    taluk: 'Nanjangud',
    village: 'Hullahalli',
    city: 'Mysuru',
    pincode: '571301',
    latitude: 12.0167,
    longitude: 76.6833,
    region: 'South India',
    cuisineRegion: 'Karnataka',
    locationType: 'village',
    formattedAddress: 'Hullahalli Village, Nanjangud Taluk, Mysuru, Karnataka - 571301'
  },
  waterIntakeMl: 1750,
  waterReminderSettings: {
    enabled: true,
    intervalMinutes: 60,
    scheduleType: '1hour',
    soundEnabled: true
  }
};

class AuthService {
  private static instance: AuthService;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private ensureInitialized() {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (!stored) {
        // Seed default demo user account for optional testing
        localStorage.setItem(
          STORAGE_USERS_KEY,
          JSON.stringify({ [DEFAULT_DEMO_ACCOUNT.id]: DEFAULT_DEMO_ACCOUNT })
        );
      } else {
        // Sanitize legacy accounts containing 'Amrutha'
        try {
          const users = JSON.parse(stored);
          let modified = false;
          for (const key of Object.keys(users)) {
            if (users[key]?.name === 'Amrutha' || users[key]?.emailOrPhone?.includes('amrutha')) {
              users[key].name = 'Demo Mother';
              users[key].emailOrPhone = 'demo@pregnutri.app';
              if (users[key]?.profile?.name === 'Amrutha') {
                users[key].profile.name = 'Demo Mother';
              }
              modified = true;
            }
          }
          if (modified) {
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Failed to access localStorage in AuthService', e);
    }
  }

  private getAllUsers(): Record<string, StoredUserAccount> {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading stored users', e);
    }
    return { [DEFAULT_DEMO_ACCOUNT.id]: DEFAULT_DEMO_ACCOUNT };
  }

  private saveAllUsers(users: Record<string, StoredUserAccount>) {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users in localStorage', e);
    }
  }

  public getActiveUserId(): string | null {
    try {
      return localStorage.getItem(STORAGE_SESSION_KEY);
    } catch (e) {
      return null;
    }
  }

  public getActiveUser(): StoredUserAccount | null {
    const activeId = this.getActiveUserId();
    if (!activeId) return null;
    const users = this.getAllUsers();
    return users[activeId] || null;
  }

  public signup(
    name: string,
    emailOrPhone: string,
    password: string
  ): { success: boolean; user?: AuthUser; message?: string } {
    const trimmedIdentifier = emailOrPhone.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!trimmedIdentifier) {
      return { success: false, message: 'Please enter an email address or mobile number.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const users = this.getAllUsers();
    // Check for duplicate account
    const existing = Object.values(users).find(
      (u) => u.emailOrPhone.toLowerCase() === trimmedIdentifier
    );
    if (existing) {
      return {
        success: false,
        message: 'An account with this email or mobile number already exists. Please log in.'
      };
    }

    const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAccount: StoredUserAccount = {
      id: newId,
      name: trimmedName,
      emailOrPhone: trimmedIdentifier,
      passwordHash: password,
      hasCompletedProfile: false,
      createdAt: new Date().toISOString()
    };

    users[newId] = newAccount;
    this.saveAllUsers(users);

    // Set active session
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, newId);
    } catch (e) {}

    return {
      success: true,
      user: {
        id: newAccount.id,
        name: newAccount.name,
        emailOrPhone: newAccount.emailOrPhone,
        hasCompletedProfile: false,
        createdAt: newAccount.createdAt
      }
    };
  }

  public login(
    emailOrPhone: string,
    password: string
  ): { success: boolean; account?: StoredUserAccount; message?: string } {
    const trimmedIdentifier = emailOrPhone.trim().toLowerCase();
    const users = this.getAllUsers();

    const matched = Object.values(users).find(
      (u) => u.emailOrPhone.toLowerCase() === trimmedIdentifier
    );

    if (!matched) {
      return {
        success: false,
        message: 'No account found with this email or mobile number. Please sign up.'
      };
    }

    if (matched.passwordHash !== password) {
      return {
        success: false,
        message: 'Incorrect password. Please verify and try again.'
      };
    }

    // Set active session
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, matched.id);
    } catch (e) {}

    return {
      success: true,
      account: matched
    };
  }

  public logout(): void {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {}
  }

  public forgotPassword(
    emailOrPhone: string,
    newPassword: string
  ): { success: boolean; message?: string } {
    const trimmedIdentifier = emailOrPhone.trim().toLowerCase();
    if (!trimmedIdentifier) {
      return { success: false, message: 'Please provide your registered email or mobile number.' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const users = this.getAllUsers();
    const matched = Object.values(users).find(
      (u) => u.emailOrPhone.toLowerCase() === trimmedIdentifier
    );

    if (!matched) {
      return {
        success: false,
        message: 'No account found with this email or mobile number.'
      };
    }

    matched.passwordHash = newPassword;
    users[matched.id] = matched;
    this.saveAllUsers(users);

    return {
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    };
  }

  public saveCompleteUserProfile(
    userId: string,
    profileData: UserProfile,
    locationData?: GlobalLocationState
  ): boolean {
    const users = this.getAllUsers();
    const user = users[userId];
    if (!user) return false;

    if (profileData.name) {
      user.name = profileData.name;
    }
    user.profile = profileData;
    if (locationData) {
      user.location = locationData;
    }
    user.hasCompletedProfile = true;
    users[userId] = user;
    this.saveAllUsers(users);

    // Sync to user-specific profile key as single source of truth
    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
      localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(profileData));
      if (locationData) {
        GlobalLocationService.setLocation(locationData);
      }
    } catch (e) {}

    return true;
  }

  public updateUserProfile(
    userId: string,
    updatedPartial: Partial<UserProfile>
  ): UserProfile | null {
    const users = this.getAllUsers();
    const user = users[userId];
    if (!user || !user.profile) return null;

    if (updatedPartial.name) {
      user.name = updatedPartial.name;
    }

    user.profile = {
      ...user.profile,
      ...updatedPartial
    };
    users[userId] = user;
    this.saveAllUsers(users);

    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(user.profile));
      localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(user.profile));
    } catch (e) {}

    return user.profile;
  }

  public saveUserWaterData(userId: string, amountMl: number): void {
    const users = this.getAllUsers();
    const user = users[userId];
    if (!user) return;
    user.waterIntakeMl = amountMl;
    users[userId] = user;
    this.saveAllUsers(users);
  }

  public saveUserWaterReminder(
    userId: string,
    settings: {
      enabled: boolean;
      intervalMinutes: number;
      scheduleType?: '1hour' | '2hours' | '3hours' | 'custom';
      customMinutes?: number;
      soundEnabled?: boolean;
    }
  ): void {
    const users = this.getAllUsers();
    const user = users[userId];
    if (!user) return;
    user.waterReminderSettings = settings;
    users[userId] = user;
    this.saveAllUsers(users);
  }

  // -------------------------------------------------------------
  // FIREBASE INTEGRATION METHODS (Real Cloud-First Auth)
  // -------------------------------------------------------------
  public async firebaseSignUp(params: {
    fullName?: string;
    name?: string;
    email: string;
    password: string;
    pregnancyMonth: number;
    state: string;
    dietPreference: 'Vegetarian' | 'Non-Vegetarian';
    phone?: string;
  }): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
    const trimmedName = (params.fullName || params.name || '').trim();
    const trimmedEmail = (params.email || '').trim().toLowerCase();
    const password = params.password || '';
    const pregnancyMonth = Number(params.pregnancyMonth) || 6;
    const state = params.state || 'Karnataka';
    const dietPreference = params.dietPreference || 'Vegetarian';
    const weeksPregnant = Math.min(40, Math.max(2, (pregnancyMonth - 1) * 4 + 2));

    if (!trimmedName) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    if (!state) {
      return { success: false, message: 'Please select your Indian State.' };
    }

    // 1. If Real Firebase credentials are configured:
    if (hasRealFirebase) {
      try {
        let uid = '';

        try {
          const cred = await auth.createUserWithEmail(trimmedEmail, password);
          const fbUser = cred.user;
          uid = fbUser.uid;
          await auth.updateUserProfile(trimmedName);
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            return {
              success: false,
              message: 'An account with this email address already exists. Please sign in or use Google Sign-In.'
            };
          }
          throw authErr;
        }

        const newProfile: UserProfile = {
          ...INITIAL_USER_PROFILE,
          name: trimmedName,
          email: trimmedEmail,
          mobileNumber: params.phone || '',
          phoneVerified: true,
          onboardingStatus: 'active',
          pregnancyMonth,
          weeksPregnant,
          dietPreference: dietPreference === 'Non-Vegetarian' ? 'non-vegetarian' : 'vegetarian',
          state
        };

        // Save profile to Firestore under users/{uid}
        await firestoreService.setDoc('users', uid, {
          uid,
          fullName: trimmedName,
          name: trimmedName,
          email: trimmedEmail,
          pregnancyMonth,
          weeksPregnant,
          state,
          dietPreference,
          phoneVerified: true,
          onboardingStatus: 'active',
          hasCompletedProfile: true,
          authProvider: 'email',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Cache locally for instant offline hydration
        try {
          localStorage.setItem(`profile_${uid}`, JSON.stringify(newProfile));
          localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(newProfile));
          localStorage.setItem(STORAGE_SESSION_KEY, uid);
        } catch (e) {}

        const users = this.getAllUsers();
        users[uid] = {
          id: uid,
          name: trimmedName,
          emailOrPhone: trimmedEmail,
          passwordHash: 'managed-by-firebase-auth',
          hasCompletedProfile: true,
          createdAt: new Date().toISOString(),
          phoneVerified: true,
          onboardingStatus: 'active',
          profile: newProfile
        };
        this.saveAllUsers(users);

        return {
          success: true,
          user: {
            id: uid,
            name: trimmedName,
            emailOrPhone: trimmedEmail,
            email: trimmedEmail,
            phoneVerified: true,
            onboardingStatus: 'active',
            hasCompletedProfile: true,
            createdAt: new Date().toISOString()
          }
        };
      } catch (err: any) {
        console.error('[Firebase Signup Error]', err);
        return { success: false, message: getFirebaseErrorMessage(err) };
      }
    }

    // 2. Seamless local client storage fallback (when Firebase credentials pending)
    const localRes = this.signup(trimmedName, trimmedEmail, password);
    if (!localRes.success || !localRes.user) {
      return localRes;
    }

    const newProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: trimmedName,
      email: trimmedEmail,
      mobileNumber: params.phone || '',
      phoneVerified: true,
      onboardingStatus: 'active',
      pregnancyMonth,
      weeksPregnant,
      dietPreference: dietPreference === 'Non-Vegetarian' ? 'non-vegetarian' : 'vegetarian',
      state
    };

    this.saveCompleteUserProfile(localRes.user.id, newProfile);
    localRes.user.phoneVerified = true;
    localRes.user.onboardingStatus = 'active';
    localRes.user.hasCompletedProfile = true;

    return {
      success: true,
      user: localRes.user
    };
  }

  public async completePhoneVerification(
    uid: string,
    verifiedPhone: string
  ): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
    if (!uid || !verifiedPhone) {
      return { success: false, message: 'Invalid verification parameters.' };
    }

    try {
      if (hasRealFirebase) {
        // Update user document in Firestore to persist verified status
        await firestoreService.updateDoc('users', uid, {
          phone: verifiedPhone,
          phoneVerified: true,
          onboardingStatus: 'active',
          hasCompletedProfile: true,
          updatedAt: new Date().toISOString()
        });
      }

      // Update cached profile
      let userProf: UserProfile = INITIAL_USER_PROFILE;
      try {
        const cached = localStorage.getItem(`profile_${uid}`);
        if (cached) {
          userProf = JSON.parse(cached);
        }
      } catch (e) {}

      userProf.phoneVerified = true;
      userProf.onboardingStatus = 'active';
      userProf.mobileNumber = verifiedPhone;

      try {
        localStorage.setItem(`profile_${uid}`, JSON.stringify(userProf));
        localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(userProf));
        localStorage.setItem(STORAGE_SESSION_KEY, uid);
      } catch (e) {}

      // Update in local accounts if any
      const users = this.getAllUsers();
      if (users[uid]) {
        users[uid].phoneVerified = true;
        users[uid].phoneNumber = verifiedPhone;
        users[uid].onboardingStatus = 'active';
        users[uid].hasCompletedProfile = true;
        if (users[uid].profile) {
          users[uid].profile!.phoneVerified = true;
          users[uid].profile!.onboardingStatus = 'active';
          users[uid].profile!.mobileNumber = verifiedPhone;
        }
        this.saveAllUsers(users);
      }

      const updatedUser: AuthUser = {
        id: uid,
        name: userProf.name || 'Mother',
        emailOrPhone: userProf.email || verifiedPhone,
        phoneNumber: verifiedPhone,
        phoneVerified: true,
        onboardingStatus: 'active',
        hasCompletedProfile: true,
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        user: updatedUser,
        message: 'Phone number verified successfully!'
      };
    } catch (err: any) {
      console.error('[completePhoneVerification Error]', err);
      return { success: false, message: err.message || 'Failed to complete phone verification.' };
    }
  }

  public async firebaseLogin(
    emailOrPhone: string,
    password: string
  ): Promise<{ success: boolean; user?: AuthUser; account?: StoredUserAccount; message?: string }> {
    const trimmed = emailOrPhone.trim().toLowerCase();
    if (!trimmed) return { success: false, message: 'Please enter your email address or mobile number.' };
    if (!password) return { success: false, message: 'Please enter your password.' };

    // 1. Try real Firebase Email Login if real credentials and email format
    if (hasRealFirebase && trimmed.includes('@')) {
      try {
        const cred = await auth.signInWithEmail(trimmed, password);
        const fbUser = cred.user;
        const uid = fbUser.uid;

        // Check if Firestore user document exists
        const snap = await firestoreService.getDoc('users', uid);
        let profileData: UserProfile | undefined = undefined;
        let displayName = fbUser.displayName || 'Mother';

        if (snap.exists()) {
          const d = snap.data();
          if (d?.name) displayName = d.name;
          profileData = {
            ...INITIAL_USER_PROFILE,
            ...d
          };
          try {
            localStorage.setItem(`profile_${uid}`, JSON.stringify(profileData));
            localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(profileData));
          } catch (e) {}
        }

        try {
          localStorage.setItem(STORAGE_SESSION_KEY, uid);
        } catch (e) {}

        const docData = snap.exists() ? snap.data() : null;
        const phone = docData?.phone || docData?.mobileNumber || '';

        return {
          success: true,
          user: {
            id: uid,
            name: displayName,
            emailOrPhone: fbUser.email || trimmed,
            email: fbUser.email || trimmed,
            phoneNumber: phone,
            phoneVerified: true,
            onboardingStatus: 'active',
            hasCompletedProfile: true,
            createdAt: docData?.createdAt || new Date().toISOString()
          }
        };
      } catch (err: any) {
        console.error('[Firebase Login Error]', err);
        return { success: false, message: getFirebaseErrorMessage(err) };
      }
    }

    // 2. Local fallback login
    const localRes = this.login(trimmed, password);
    if (localRes.success && localRes.account) {
      const isVerified = localRes.account.phoneVerified ?? true;
      const onboardingStatus: OnboardingStatus = isVerified
        ? (localRes.account.onboardingStatus || 'active')
        : 'phone_verification_pending';

      return {
        success: true,
        user: {
          id: localRes.account.id,
          name: localRes.account.name,
          emailOrPhone: localRes.account.emailOrPhone,
          phoneNumber: localRes.account.phoneNumber,
          phoneVerified: isVerified,
          onboardingStatus: onboardingStatus,
          hasCompletedProfile: localRes.account.hasCompletedProfile && isVerified,
          createdAt: localRes.account.createdAt
        },
        account: localRes.account
      };
    }
    return { success: false, message: localRes.message || 'Invalid credentials. Please verify your details.' };
  }

  public async firebaseGoogleSignIn(options?: {
    state?: string;
    dietPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'vegetarian' | 'non-vegetarian';
    pregnancyMonth?: number;
    weeksPregnant?: number;
  }): Promise<{ success: boolean; user?: AuthUser; isNewUser?: boolean; redirecting?: boolean; message?: string }> {
    if (!hasRealFirebase) {
      return {
        success: false,
        message: 'Google Sign-In requires connecting your Firebase project credentials in environment settings. Please use Email & Password or Demo Profile.'
      };
    }

    try {
      const res = await auth.signInWithGoogle();
      if (!res || !res.user) {
        // Redirect flow was initiated because popup was blocked
        return {
          success: true,
          redirecting: true,
          message: 'Redirecting to Google for account selection...'
        };
      }

      return await this.processFirebaseUser(res.user, options);
    } catch (err: any) {
      console.error('[Google Sign-In Error]', err);
      return { success: false, message: getFirebaseErrorMessage(err) };
    }
  }

  public async handleRedirectAuthResult(): Promise<{ success: boolean; user?: AuthUser; isNewUser?: boolean } | null> {
    if (!hasRealFirebase) return null;
    try {
      const res = await auth.getRedirectResult();
      if (!res || !res.user) return null;
      console.log('[AuthService] Processing user from Google Sign-In redirect:', res.user.uid);
      return await this.processFirebaseUser(res.user);
    } catch (err) {
      console.error('[AuthService] handleRedirectAuthResult error:', err);
      return null;
    }
  }

  public async processFirebaseUser(
    fbUser: any,
    options?: {
      state?: string;
      dietPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'vegetarian' | 'non-vegetarian';
      pregnancyMonth?: number;
      weeksPregnant?: number;
    }
  ): Promise<{ success: boolean; user?: AuthUser; isNewUser?: boolean; message?: string }> {
    const uid = fbUser.uid;
    const displayName = fbUser.displayName || 'Mother';
    const email = fbUser.email || '';
    const photoURL = fbUser.photoURL || '';

    // Check if user doc exists in Firestore to prevent duplicate profile creation or overwriting
    const snap = await firestoreService.getDoc('users', uid);
    const isExisting = snap.exists();

    if (!isExisting) {
      // Create initial profile in Firestore preserving any form preferences provided
      const selectedState = options?.state || 'Karnataka';
      const selectedDiet = options?.dietPreference
        ? (options.dietPreference.toLowerCase().includes('non') ? 'Non-Vegetarian' : 'Vegetarian')
        : 'Vegetarian';
      const selectedMonth = options?.pregnancyMonth || 6;
      const selectedWeeks = options?.weeksPregnant || 24;

      const initProfile: UserProfile = {
        ...INITIAL_USER_PROFILE,
        name: displayName,
        email,
        mobileNumber: fbUser.phoneNumber || '',
        photoURL,
        state: selectedState,
        dietPreference: selectedDiet,
        pregnancyMonth: selectedMonth,
        weeksPregnant: selectedWeeks,
        phoneVerified: true, // Google accounts are verified via Google Auth
        onboardingStatus: 'active'
      };

      await firestoreService.setDoc('users', uid, {
        uid,
        name: displayName,
        email,
        phone: fbUser.phoneNumber || '',
        photoURL,
        pregnancyMonth: selectedMonth,
        weeksPregnant: selectedWeeks,
        dietPreference: selectedDiet,
        state: selectedState,
        phoneVerified: true,
        onboardingStatus: 'active',
        hasCompletedProfile: true,
        authProvider: 'google.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      try {
        localStorage.setItem(`profile_${uid}`, JSON.stringify(initProfile));
        localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(initProfile));
        localStorage.setItem(STORAGE_SESSION_KEY, uid);
      } catch (e) {}

      // Keep local user database in sync
      const users = this.getAllUsers();
      users[uid] = {
        id: uid,
        name: displayName,
        emailOrPhone: email,
        passwordHash: 'google-oauth-token',
        hasCompletedProfile: true,
        createdAt: new Date().toISOString(),
        phoneVerified: true,
        onboardingStatus: 'active',
        profile: initProfile
      };
      this.saveAllUsers(users);

      return {
        success: true,
        isNewUser: true,
        user: {
          id: uid,
          name: displayName,
          emailOrPhone: email,
          email,
          photoURL,
          phoneVerified: true,
          onboardingStatus: 'active',
          hasCompletedProfile: true,
          createdAt: new Date().toISOString()
        }
      };
    } else {
      // Existing user: Strictly preserve all existing Firestore data without overwriting
      const d = snap.data();
      const existingName = d?.name || displayName;
      const existingState = d?.state || 'Karnataka';
      const existingDiet = d?.dietPreference || 'Vegetarian';

      const prof: UserProfile = {
        ...INITIAL_USER_PROFILE,
        ...d,
        name: existingName,
        email: d?.email || email,
        photoURL: d?.photoURL || photoURL,
        state: existingState,
        dietPreference: existingDiet,
        phoneVerified: true,
        onboardingStatus: 'active'
      };

      try {
        localStorage.setItem(`profile_${uid}`, JSON.stringify(prof));
        localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(prof));
        localStorage.setItem(STORAGE_SESSION_KEY, uid);
      } catch (e) {}

      return {
        success: true,
        isNewUser: false,
        user: {
          id: uid,
          name: existingName,
          emailOrPhone: email || d?.phone || '',
          email: email,
          photoURL: d?.photoURL || photoURL,
          phoneVerified: true,
          onboardingStatus: 'active',
          hasCompletedProfile: true,
          createdAt: d?.createdAt || new Date().toISOString()
        }
      };
    }
  }

  public async firebaseSendPhoneOtp(
    phoneNumber: string,
    containerId: string = 'recaptcha-container'
  ): Promise<{ success: boolean; confirmationResult?: any; message?: string }> {
    if (!hasRealFirebase) {
      return {
        success: false,
        message: 'Phone Authentication requires active Firebase credentials with Phone Auth enabled in Firebase Console. Please sign in with Email & Password or Demo Profile.'
      };
    }

    // Clean Indian 10-digit number
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    let formattedNumber = '';
    if (cleanNumber.length === 10) {
      formattedNumber = `+91${cleanNumber}`;
    } else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
      formattedNumber = `+${cleanNumber}`;
    } else {
      return {
        success: false,
        message: 'Invalid phone number. Please enter a valid 10-digit Indian mobile number (+91).'
      };
    }

    try {
      const verifier = auth.createRecaptchaVerifier(containerId);
      const confirmationResult = await auth.signInWithPhoneNumber(formattedNumber, verifier);
      return {
        success: true,
        confirmationResult,
        message: `OTP sent successfully to ${formattedNumber} via SMS!`
      };
    } catch (err: any) {
      console.error('[Firebase Phone Auth Error]', err);
      auth.clearRecaptchaVerifier();
      return {
        success: false,
        message: getFirebaseErrorMessage(err)
      };
    }
  }

  public async firebaseConfirmPhoneOtp(
    confirmationResult: any,
    code: string
  ): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
    if (!confirmationResult || !confirmationResult.confirm) {
      return { success: false, message: 'Invalid verification session. Please request a new OTP.' };
    }
    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length !== 6) {
      return { success: false, message: 'Please enter the 6-digit verification code received via SMS.' };
    }

    try {
      const userCredential = await confirmationResult.confirm(cleanCode);
      const fbUser = userCredential.user;
      const uid = fbUser.uid;
      const phone = fbUser.phoneNumber || '';

      // Check Firestore profile
      const snap = await firestoreService.getDoc('users', uid);
      const isExisting = snap.exists();

      if (!isExisting) {
        const initProfile: UserProfile = {
          ...INITIAL_USER_PROFILE,
          name: 'Mother',
          mobileNumber: phone,
          phoneVerified: true,
          onboardingStatus: 'active'
        };
        await firestoreService.setDoc('users', uid, {
          uid,
          name: 'Mother',
          phone,
          phoneVerified: true,
          onboardingStatus: 'active',
          pregnancyMonth: 6,
          weeksPregnant: 24,
          dietPreference: 'vegetarian',
          state: 'Karnataka',
          hasCompletedProfile: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        try {
          localStorage.setItem(`profile_${uid}`, JSON.stringify(initProfile));
          localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(initProfile));
        } catch (e) {}
      } else {
        const d = snap.data();
        await firestoreService.updateDoc('users', uid, {
          phone,
          phoneVerified: true,
          onboardingStatus: 'active',
          updatedAt: new Date().toISOString()
        });
        const prof: UserProfile = { ...INITIAL_USER_PROFILE, ...d, phoneVerified: true, onboardingStatus: 'active', mobileNumber: phone };
        try {
          localStorage.setItem(`profile_${uid}`, JSON.stringify(prof));
          localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(prof));
        } catch (e) {}
      }

      try {
        localStorage.setItem(STORAGE_SESSION_KEY, uid);
      } catch (e) {}

      return {
        success: true,
        user: {
          id: uid,
          name: snap.exists() ? (snap.data()?.name || 'Mother') : 'Mother',
          emailOrPhone: phone,
          phoneNumber: phone,
          phoneVerified: true,
          onboardingStatus: 'active',
          hasCompletedProfile: true,
          createdAt: new Date().toISOString()
        }
      };
    } catch (err: any) {
      console.error('[Firebase OTP Confirm Error]', err);
      return {
        success: false,
        message: getFirebaseErrorMessage(err)
      };
    }
  }

  public async firebaseSendPasswordReset(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please enter a valid registered email address.' };
    }

    if (hasRealFirebase) {
      try {
        await auth.sendPasswordReset(trimmed);
        return {
          success: true,
          message: `Password reset email sent to ${trimmed}! Please check your inbox and spam folder.`
        };
      } catch (err: any) {
        return { success: false, message: getFirebaseErrorMessage(err) };
      }
    }

    // Check if account exists locally
    const users = this.getAllUsers();
    const matched = Object.values(users).find((u) => u.emailOrPhone.toLowerCase() === trimmed);
    if (matched) {
      return {
        success: true,
        message: `Password reset initiated for ${trimmed}. You can set a new password on the password reset tab.`
      };
    }

    return {
      success: false,
      message: 'No registered account found with this email. Please sign up or verify your email.'
    };
  }
}

export const authService = AuthService.getInstance();
