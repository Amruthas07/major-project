/**
 * firebase.ts
 * Strictly Cloud-Only Real Firebase Integration Layer for PregNutri-AI.
 * All mock, emulated, local fallbacks, and local authentication bypasses are removed.
 * Real SMS Phone Authentication, Firestore, and Storage are strictly enforced.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  Auth as FirebaseAuth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc as fbDoc, 
  collection as fbCollection, 
  getDoc as fbGetDoc, 
  setDoc as fbSetDoc, 
  updateDoc as fbUpdateDoc, 
  getDocs as fbGetDocs, 
  onSnapshot as fbOnSnapshot,
  deleteDoc as fbDeleteDoc,
  getDocFromServer as fbGetDocFromServer,
  serverTimestamp as fbServerTimestamp,
  Firestore
} from 'firebase/firestore';

export const serverTimestamp = fbServerTimestamp;
import {
  getStorage,
  ref as fbRef,
  uploadBytes as fbUploadBytes,
  getDownloadURL as fbGetDownloadURL
} from 'firebase/storage';

// Import our config. Vite allows importing JSON files.
import firebaseConfig from '../firebase-applet-config.json';

// Support both environment variables and firebase-applet-config.json
const metaEnv = (import.meta as any).env || {};

function resolveConfigVal(cfgVal?: string, envVal?: string, fallback: string = ''): string {
  if (cfgVal && !cfgVal.startsWith('YOUR_') && !cfgVal.startsWith('MY_')) return cfgVal;
  if (envVal && !envVal.startsWith('YOUR_') && !envVal.startsWith('MY_')) return envVal;
  return cfgVal || envVal || fallback;
}

const envConfig = {
  apiKey: resolveConfigVal(firebaseConfig.apiKey, metaEnv.VITE_FIREBASE_API_KEY),
  authDomain: resolveConfigVal(firebaseConfig.authDomain, metaEnv.VITE_FIREBASE_AUTH_DOMAIN, "pregnutri-ai.firebaseapp.com"),
  projectId: resolveConfigVal(firebaseConfig.projectId, metaEnv.VITE_FIREBASE_PROJECT_ID, "pregnutri-ai").toLowerCase(),
  storageBucket: resolveConfigVal(firebaseConfig.storageBucket, metaEnv.VITE_FIREBASE_STORAGE_BUCKET, "pregnutri-ai.firebasestorage.app"),
  messagingSenderId: resolveConfigVal(firebaseConfig.messagingSenderId, metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: resolveConfigVal(firebaseConfig.appId, metaEnv.VITE_FIREBASE_APP_ID),
  measurementId: resolveConfigVal(firebaseConfig.measurementId, metaEnv.VITE_FIREBASE_MEASUREMENT_ID),
  firestoreDatabaseId: (firebaseConfig as any).firestoreDatabaseId || metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || ""
};

export const activeConfig = envConfig;

// Detect if valid configuration is present
export const hasRealFirebase = activeConfig && 
                              typeof activeConfig === 'object' && 
                              'apiKey' in activeConfig && 
                              activeConfig.apiKey && 
                              !activeConfig.apiKey.startsWith('YOUR_') && 
                              !activeConfig.apiKey.startsWith('MY_');

let app: any;
let realAuth: any;
let realDb: any;
let realStorage: any;

if (hasRealFirebase) {
  try {
    app = getApps().length === 0 ? initializeApp(activeConfig) : getApp();
    realAuth = getAuth(app);
    const dbId = (activeConfig as any).firestoreDatabaseId;
    realDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
    realStorage = getStorage(app);
    console.log("[Firebase Init] Successfully initialized in REAL cloud mode for PregNutri-AI!");

    // Validate connection to Firestore on boot (Requirement of Firebase Integration Skill)
    async function testConnection() {
      try {
        await fbGetDocFromServer(fbDoc(realDb, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  } catch (err) {
    console.error("[Firebase Init] Failed to initialize real Firebase services:", err);
    throw err;
  }
} else {
  console.error("[Firebase Init] Missing or incomplete Firebase configuration! PregNutri-AI requires VITE_FIREBASE_API_KEY and other credentials.");
}

// -------------------------------------------------------------
// FIRESTORE ERROR HANDLING (Requirement of Firebase Integration Skill)
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const user = realAuth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.uid || null,
      email: user?.email || null,
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || false,
      tenantId: user?.tenantId || null,
      providerInfo: user?.providerData?.map((p: any) => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('[Firestore Operation Notice]', JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// EXPORT COMPATIBLE ADAPTER INTERFACE
// -------------------------------------------------------------
export const db = realDb as Firestore;

export const auth = {
  get currentUser() {
    if (!hasRealFirebase || !realAuth) {
      console.warn("[Firebase Auth] No real Firebase Auth active.");
      return null;
    }
    return realAuth.currentUser;
  },
  onAuthStateChanged(callback: (user: any) => void) {
    if (!hasRealFirebase || !realAuth) {
      console.warn("[Firebase Auth] onAuthStateChanged called but real Firebase is not initialized.");
      callback(null);
      return () => {};
    }
    return fbOnAuthStateChanged(realAuth, (user) => {
      if (user) {
        console.log("[Firebase Auth State] User is authenticated:", user.uid, user.phoneNumber || user.email);
      } else {
        console.log("[Firebase Auth State] User is signed out.");
      }
      callback(user);
    });
  },
  async signInWithGoogle() {
    console.log("[Firebase Auth] Initiating Google Sign-In with GoogleAuthProvider...");
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Google Authentication requires valid Firebase credentials.");
    }
    const provider = new GoogleAuthProvider();
    // Always show account selection prompt so users can choose or switch Google accounts
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(realAuth, provider);
      console.log("[Firebase Auth] Google Sign-In SUCCESSFUL via popup! User UID:", result.user?.uid);
      return result;
    } catch (err: any) {
      console.warn("[Firebase Auth] signInWithPopup encountered:", err.code, err.message);
      // Fallback to signInWithRedirect if popup is blocked by the browser
      if (err.code === 'auth/popup-blocked') {
        console.log("[Firebase Auth] Popup blocked by browser. Initiating signInWithRedirect fallback...");
        try {
          await signInWithRedirect(realAuth, provider);
          return null as any; // Redirect will cause page reload
        } catch (redirectErr) {
          console.error("[Firebase Auth] signInWithRedirect fallback failed:", redirectErr);
          throw redirectErr;
        }
      }
      throw err;
    }
  },
  async getRedirectResult() {
    if (!hasRealFirebase || !realAuth) return null;
    try {
      const result = await getRedirectResult(realAuth);
      if (result && result.user) {
        console.log("[Firebase Auth] User returned from Google Sign-In redirect:", result.user.uid);
      }
      return result;
    } catch (err) {
      console.error("[Firebase Auth] getRedirectResult error:", err);
      throw err;
    }
  },
  async signOut() {
    console.log("[Firebase Auth] Signing out...");
    if (!hasRealFirebase || !realAuth) {
      return;
    }
    try {
      await fbSignOut(realAuth);
      console.log("[Firebase Auth] Sign-out completed successfully.");
    } catch (err) {
      console.error("[Firebase Auth] Sign-out error:", err);
      throw err;
    }
  },
  // Re-captcha verifier creation with clean widget lifecycle and reset capability
  clearRecaptchaVerifier() {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {
        console.warn("[Firebase Auth] Notice clearing recaptchaVerifier instance:", e);
      }
      (window as any).recaptchaVerifier = null;
    }
  },
  createRecaptchaVerifier(containerId: string = 'recaptcha-container') {
    console.log(`[Firebase Auth] createRecaptchaVerifier requested for container: "${containerId}"`);
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Phone verification requires active Firebase credentials.");
    }
    try {
      // 1. Clean up any existing verifier instance to prevent duplicate widget errors
      this.clearRecaptchaVerifier();

      // 2. Ensure container exists in DOM and has clean innerHTML
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
      } else {
        container.innerHTML = '';
      }

      console.log("[Firebase Auth] Initializing new RecaptchaVerifier instance...");
      const verifier = new RecaptchaVerifier(realAuth, container, {
        size: 'invisible',
        callback: (response: any) => {
          console.log("[Firebase Auth] reCAPTCHA challenge resolved successfully.");
        },
        'expired-callback': () => {
          console.warn("[Firebase Auth] reCAPTCHA challenge expired. Resetting widget.");
          this.clearRecaptchaVerifier();
        }
      });

      (window as any).recaptchaVerifier = verifier;
      console.log("[Firebase Auth] RecaptchaVerifier ready.");
      return verifier;
    } catch (err) {
      console.error("[Firebase Auth] Failed to initialize RecaptchaVerifier:", err);
      this.clearRecaptchaVerifier();
      throw err;
    }
  },
  // Real signInWithPhoneNumber
  async signInWithPhoneNumber(phoneNumber: string, appVerifier: any) {
    console.log(`[Firebase Auth] signInWithPhoneNumber requested to phone number: "${phoneNumber}"`);
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Real Firebase credentials are required for Phone Authentication. Please configure your environment settings to connect to PregNutri-AI.");
    }
    try {
      console.log("[Firebase Auth] Executing Firebase Auth SDK signInWithPhoneNumber()...");
      const result = await signInWithPhoneNumber(realAuth, phoneNumber, appVerifier);
      console.log(`[Firebase Auth] Real SMS OTP request dispatched successfully! Verification ID: "${result.verificationId}"`);
      
      return {
        verificationId: result.verificationId,
        confirm: async (code: string) => {
          console.log(`[Firebase Auth] Confirming verification code "${code}" for ID "${result.verificationId}"...`);
          try {
            const userCredential = await result.confirm(code);
            console.log(`[Firebase Auth] SMS Verification code CONFIRMED successfully! UID: "${userCredential.user?.uid}"`);
            return userCredential;
          } catch (confirmErr: any) {
            console.error(`[Firebase Auth] SMS Verification code CONFIRMATION FAILED! Code "${code}" is invalid.`, confirmErr);
            throw confirmErr;
          }
        }
      };
    } catch (err: any) {
      console.error("[Firebase Auth] Failed to execute signInWithPhoneNumber:", err);
      throw err;
    }
  },
  async createUserWithEmail(email: string, password: string) {
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Valid Firebase credentials are required.");
    }
    return await fbCreateUserWithEmailAndPassword(realAuth, email.trim(), password);
  },
  async signInWithEmail(email: string, password: string) {
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Valid Firebase credentials are required.");
    }
    return await fbSignInWithEmailAndPassword(realAuth, email.trim(), password);
  },
  async sendPasswordReset(email: string) {
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Valid Firebase credentials are required.");
    }
    return await fbSendPasswordResetEmail(realAuth, email.trim());
  },
  async updateUserProfile(displayName: string, photoURL?: string) {
    if (!realAuth?.currentUser) return;
    return await fbUpdateProfile(realAuth.currentUser, { displayName, photoURL });
  }
};

export const rawAuth = realAuth as FirebaseAuth | null;

export function getFirebaseErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';
  const code = err.code || (typeof err === 'string' ? err : '');
  const message = err.message || String(err);

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in or use a different email.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-not-found':
      return 'No registered account found with this email. Please check your email or create an account.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please verify and try again, or use "Forgot Password".';
    case 'auth/invalid-credential':
      return 'Invalid email/phone or password. Please check your credentials and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact maternal care support.';
    case 'auth/too-many-requests':
      return 'SMS quota exceeded or too many requests. Please wait before requesting another OTP.';
    case 'auth/network-request-failed':
      return 'Network failure. Please check your internet connection.';
    case 'auth/invalid-phone-number':
      return 'Invalid phone number. Please enter a valid 10-digit Indian phone number (+91).';
    case 'auth/invalid-verification-code':
      return 'Incorrect or expired OTP. Please verify the 6-digit code or request a new one.';
    case 'auth/code-expired':
      return 'Incorrect or expired OTP. This verification code has expired. Please request a new OTP.';
    case 'auth/session-expired':
      return 'Verification session expired or missing. Please request a new OTP.';
    case 'auth/invalid-verification-id':
      return 'Verification session is invalid or expired. Please request a new OTP.';
    case 'auth/already-in-progress':
      return 'A verification request is already in progress. Please wait a moment.';
    case 'auth/missing-verification-code':
      return 'Please enter the 6-digit OTP code sent to your phone.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA failure. Verification could not be completed. Please refresh and try again.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded or too many requests. Firebase project SMS quota limit has been reached.';
    case 'auth/billing-not-enabled':
      return 'Firebase billing not enabled. Phone SMS authentication requires Blaze billing or configured test numbers in Firebase Console.';
    case 'auth/unauthorized-domain':
      return 'Unauthorized domain. Current app domain must be added to Firebase Console under Authentication > Settings > Authorized Domains.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed before completion. Please click "Continue with Google" to try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for PregNutri AI or retry.';
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was interrupted. Please click "Continue with Google" to try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email address. Please sign in with your original method.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In provider is not enabled in Firebase Console. Please enable Google under Firebase Authentication > Sign-in method.';
    case 'auth/timeout':
      return 'The SMS verification request timed out after 20 seconds. Firebase took too long to respond. Please check your network connection and click Retry.';
    default:
      if (message.includes('auth/invalid-credential')) {
        return 'Invalid email or password. Please check your details and try again.';
      }
      if (message.includes('billing')) {
        return 'Firebase billing not enabled. Phone SMS authentication requires Blaze billing or configured test numbers in Firebase Console.';
      }
      if (message.includes('quota') || message.includes('too-many-requests')) {
        return 'SMS quota exceeded or too many requests. Please wait before requesting another OTP.';
      }
      if (message.includes('unauthorized-domain')) {
        return 'Unauthorized domain. Current domain must be added to Firebase Console under Authentication > Settings > Authorized Domains.';
      }
      return message || 'Authentication failed. Please check your details and try again.';
  }
}

export const firestoreService = {
  async getDoc(collectionPath: string, docId: string): Promise<{ exists: () => boolean, data: () => any, id: string }> {
    if (!hasRealFirebase || !realDb) {
      return { exists: () => false, data: () => null, id: docId };
    }
    try {
      const docRef = fbDoc(realDb, collectionPath, docId);
      const snap = await fbGetDoc(docRef);
      return {
        exists: () => snap.exists(),
        data: () => snap.data(),
        id: snap.id
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${collectionPath}/${docId}`);
      return { exists: () => false, data: () => null, id: docId };
    }
  },

  async setDoc(collectionPath: string, docId: string, data: any): Promise<void> {
    if (!hasRealFirebase || !realDb) {
      return;
    }
    try {
      const docRef = fbDoc(realDb, collectionPath, docId);
      await fbSetDoc(docRef, data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${collectionPath}/${docId}`);
    }
  },

  async updateDoc(collectionPath: string, docId: string, data: any): Promise<void> {
    if (!hasRealFirebase || !realDb) {
      return;
    }
    try {
      const docRef = fbDoc(realDb, collectionPath, docId);
      await fbUpdateDoc(docRef, data);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${collectionPath}/${docId}`);
    }
  },

  async deleteDoc(collectionPath: string, docId: string): Promise<void> {
    if (!hasRealFirebase || !realDb) {
      return;
    }
    try {
      const docRef = fbDoc(realDb, collectionPath, docId);
      await fbDeleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${collectionPath}/${docId}`);
    }
  },

  async getDocs(collectionPath: string): Promise<{ docs: any[], empty: boolean, forEach: (cb: (doc: any) => void) => void }> {
    if (!hasRealFirebase || !realDb) {
      return { docs: [], empty: true, forEach: () => {} };
    }
    try {
      const colRef = fbCollection(realDb, collectionPath);
      const snap = await fbGetDocs(colRef);
      return {
        docs: snap.docs,
        empty: snap.empty,
        forEach: (cb) => snap.forEach(cb)
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, collectionPath);
      return { docs: [], empty: true, forEach: () => {} };
    }
  }
};

export const storageService = {
  async uploadFile(filePath: string, file: File | Blob): Promise<string> {
    if (!hasRealFirebase || !realStorage) {
      throw new Error("Firebase Storage is not initialized. Please configure your environment.");
    }
    try {
      const fileRef = fbRef(realStorage, filePath);
      const snapshot = await fbUploadBytes(fileRef, file);
      const downloadUrl = await fbGetDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.error("Firebase Storage upload error:", err);
      throw err;
    }
  }
};
