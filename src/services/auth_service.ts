import { AuthUser, UserProfile, GlobalLocationState } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';
import { GlobalLocationService } from './global_location_service';

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
  waterReminderSettings?: { enabled: boolean; intervalMinutes: number };
}

const STORAGE_USERS_KEY = 'pregnutri_registered_accounts_v1';
const STORAGE_SESSION_KEY = 'pregnutri_active_session_user_id_v1';

// Seed initial default account for instant testing (Clearly labeled as Demo Profile)
const DEFAULT_DEMO_ACCOUNT: StoredUserAccount = {
  id: 'user-demo-01',
  name: 'Demo Profile',
  emailOrPhone: 'demo@pregnutri.app',
  passwordHash: 'demo123',
  hasCompletedProfile: true,
  createdAt: new Date().toISOString(),
  profile: {
    ...INITIAL_USER_PROFILE,
    name: 'Demo Profile',
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
    allergies: ['Peanuts (Mild)'],
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
      intervalMinutes: 60
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
    intervalMinutes: 60
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
        // Seed default demo user account
        localStorage.setItem(
          STORAGE_USERS_KEY,
          JSON.stringify({ [DEFAULT_DEMO_ACCOUNT.id]: DEFAULT_DEMO_ACCOUNT })
        );
        // Default to logged in as demo account on first app launch for immediate preview experience
        if (!localStorage.getItem(STORAGE_SESSION_KEY)) {
          localStorage.setItem(STORAGE_SESSION_KEY, DEFAULT_DEMO_ACCOUNT.id);
        }
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

    user.profile = profileData;
    if (locationData) {
      user.location = locationData;
    }
    user.hasCompletedProfile = true;
    users[userId] = user;
    this.saveAllUsers(users);

    // Also sync to general current profile localStorage keys for backwards compatibility
    try {
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

    user.profile = {
      ...user.profile,
      ...updatedPartial
    };
    users[userId] = user;
    this.saveAllUsers(users);

    try {
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
    settings: { enabled: boolean; intervalMinutes: number }
  ): void {
    const users = this.getAllUsers();
    const user = users[userId];
    if (!user) return;
    user.waterReminderSettings = settings;
    users[userId] = user;
    this.saveAllUsers(users);
  }
}

export const authService = AuthService.getInstance();
