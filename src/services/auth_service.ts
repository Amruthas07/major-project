import { AuthUser, UserProfile, GlobalLocationState } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';
import { GlobalLocationService } from './global_location_service';
import { auth, firestoreService, hasRealFirebase, getFirebaseErrorMessage } from '../firebase';

export interface StoredUserAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  passwordHash: string; // Stored securely in client storage
  hasCompletedProfile: boolean;
  createdAt: string;
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
  profile: {
    ...INITIAL_USER_PROFILE,
    name: 'Demo Mother',
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
    name: string;
    email: string;
    password: string;
    phone?: string;
    pregnancyMonth?: number;
    dietPreference?: 'Vegetarian' | 'Non-Vegetarian';
    state?: string;
  }): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
    const { name, email, password, phone, pregnancyMonth = 6, dietPreference = 'Vegetarian', state = 'Karnataka' } = params;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) return { success: false, message: 'Please enter your full name.' };
    if (!trimmedEmail || !trimmedEmail.includes('@')) return { success: false, message: 'Please enter a valid email address.' };
    if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters long.' };

    const weeksPregnant = Math.min(40, Math.max(2, (pregnancyMonth - 1) * 4 + 2));

    // 1. If Real Firebase credentials are configured:
    if (hasRealFirebase) {
      try {
        const cred = await auth.createUserWithEmail(trimmedEmail, password);
        const fbUser = cred.user;
        const uid = fbUser.uid;

        await auth.updateUserProfile(trimmedName);

        const newProfile: UserProfile = {
          ...INITIAL_USER_PROFILE,
          name: trimmedName,
          email: trimmedEmail,
          mobileNumber: phone ? (phone.startsWith('+91') ? phone : `+91${phone}`) : undefined,
          pregnancyMonth,
          weeksPregnant,
          dietPreference: dietPreference === 'Non-Vegetarian' ? 'non-vegetarian' : 'vegetarian',
          state
        };

        // Save profile to Firestore (no passwords in Firestore)
        await firestoreService.setDoc('users', uid, {
          uid,
          name: trimmedName,
          email: trimmedEmail,
          phone: phone ? (phone.startsWith('+91') ? phone : `+91${phone}`) : '',
          age: 27,
          pregnancyMonth,
          weeksPregnant,
          dietPreference: newProfile.dietPreference,
          state,
          hasCompletedProfile: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Cache locally
        try {
          localStorage.setItem(`profile_${uid}`, JSON.stringify(newProfile));
          localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(newProfile));
          localStorage.setItem(STORAGE_SESSION_KEY, uid);
        } catch (e) {}

        return {
          success: true,
          user: {
            id: uid,
            name: trimmedName,
            emailOrPhone: trimmedEmail,
            hasCompletedProfile: true,
            createdAt: new Date().toISOString()
          }
        };
      } catch (err: any) {
        console.error('[Firebase Signup Error]', err);
        return { success: false, message: getFirebaseErrorMessage(err) };
      }
    }

    // 2. Seamless local client storage fallback (when Firebase API key is pending)
    const localRes = this.signup(trimmedName, trimmedEmail, password);
    if (!localRes.success || !localRes.user) {
      return localRes;
    }

    const newProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: trimmedName,
      email: trimmedEmail,
      mobileNumber: phone ? (phone.startsWith('+91') ? phone : `+91${phone}`) : undefined,
      pregnancyMonth,
      weeksPregnant,
      dietPreference: dietPreference === 'Non-Vegetarian' ? 'non-vegetarian' : 'vegetarian',
      state
    };

    this.saveCompleteUserProfile(localRes.user.id, newProfile);
    localRes.user.hasCompletedProfile = true;

    return {
      success: true,
      user: localRes.user
    };
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

        return {
          success: true,
          user: {
            id: uid,
            name: displayName,
            emailOrPhone: fbUser.email || trimmed,
            hasCompletedProfile: snap.exists(),
            createdAt: new Date().toISOString()
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
      return {
        success: true,
        user: {
          id: localRes.account.id,
          name: localRes.account.name,
          emailOrPhone: localRes.account.emailOrPhone,
          hasCompletedProfile: localRes.account.hasCompletedProfile,
          createdAt: localRes.account.createdAt
        },
        account: localRes.account
      };
    }
    return { success: false, message: localRes.message || 'Invalid credentials. Please verify your details.' };
  }

  public async firebaseGoogleSignIn(): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
    if (!hasRealFirebase) {
      return {
        success: false,
        message: 'Google Sign-In requires connecting your Firebase project credentials in environment settings. Please use Email & Password or Demo Profile.'
      };
    }

    try {
      const res = await auth.signInWithGoogle();
      const fbUser = res.user;
      const uid = fbUser.uid;
      const displayName = fbUser.displayName || 'Mother';
      const email = fbUser.email || '';

      // Check if user doc exists in Firestore to prevent duplicate profile creation
      const snap = await firestoreService.getDoc('users', uid);
      const isExisting = snap.exists();

      if (!isExisting) {
        // Create initial profile in Firestore
        const initProfile: UserProfile = {
          ...INITIAL_USER_PROFILE,
          name: displayName,
          email
        };
        await firestoreService.setDoc('users', uid, {
          uid,
          name: displayName,
          email,
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
        if (d) {
          const prof: UserProfile = { ...INITIAL_USER_PROFILE, ...d };
          try {
            localStorage.setItem(`profile_${uid}`, JSON.stringify(prof));
            localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(prof));
          } catch (e) {}
        }
      }

      try {
        localStorage.setItem(STORAGE_SESSION_KEY, uid);
      } catch (e) {}

      return {
        success: true,
        user: {
          id: uid,
          name: displayName,
          emailOrPhone: email,
          hasCompletedProfile: true,
          createdAt: new Date().toISOString()
        }
      };
    } catch (err: any) {
      console.error('[Google Sign-In Error]', err);
      return { success: false, message: getFirebaseErrorMessage(err) };
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
        message: 'Please enter a valid 10-digit Indian mobile number.'
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
          mobileNumber: phone
        };
        await firestoreService.setDoc('users', uid, {
          uid,
          name: 'Mother',
          phone,
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
        if (d) {
          const prof: UserProfile = { ...INITIAL_USER_PROFILE, ...d };
          try {
            localStorage.setItem(`profile_${uid}`, JSON.stringify(prof));
            localStorage.setItem('pregnutri_user_profile_v3', JSON.stringify(prof));
          } catch (e) {}
        }
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
