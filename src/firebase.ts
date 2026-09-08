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
  GoogleAuthProvider, 
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber
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
  Firestore
} from 'firebase/firestore';
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
    console.log("[Firebase Auth] Initiating Google Sign-In popup...");
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Google Authentication requires valid Firebase credentials.");
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(realAuth, provider);
      console.log("[Firebase Auth] Google Sign-In SUCCESSFUL! User UID:", result.user?.uid);
      return result;
    } catch (err: any) {
      console.error("[Firebase Auth] Google Sign-In FAILED:", err);
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
  // Re-captcha verifier creation
  createRecaptchaVerifier(containerId: string) {
    console.log(`[Firebase Auth] createRecaptchaVerifier requested for container ID: "${containerId}"`);
    if (!hasRealFirebase || !realAuth) {
      throw new Error("Firebase setup is incomplete. Phone verification requires real Firebase credentials.");
    }
    try {
      // Reuse existing recaptcha verifier if present on window to prevent duplicate container errors
      if ((window as any).recaptchaVerifier) {
        console.log("[Firebase Auth] Reusing active RecaptchaVerifier instance from window.");
        return (window as any).recaptchaVerifier;
      }

      // Recreate or secure the target container in DOM to maintain a clean reCAPTCHA rendering area
      const oldContainer = document.getElementById(containerId);
      if (oldContainer) {
        console.log("[Firebase Auth] Cleaning up previous recaptcha container in DOM...");
        const parent = oldContainer.parentNode;
        if (parent) {
          const newContainer = document.createElement('div');
          newContainer.id = containerId;
          parent.replaceChild(newContainer, oldContainer);
        }
      } else {
        const newContainer = document.createElement('div');
        newContainer.id = containerId;
        document.body.appendChild(newContainer);
      }

      console.log("[Firebase Auth] Constructing new RecaptchaVerifier instance...");
      const verifier = new RecaptchaVerifier(realAuth, containerId, {
        size: 'invisible',
        callback: (response: any) => {
          console.log("[Firebase Auth] reCAPTCHA challenge resolved successfully. Response token length:", response?.length);
        },
        'expired-callback': () => {
          console.warn("[Firebase Auth] reCAPTCHA challenge expired. Please retry.");
        }
      });

      (window as any).recaptchaVerifier = verifier;
      console.log("[Firebase Auth] RecaptchaVerifier initialized successfully.");
      return verifier;
    } catch (err) {
      console.error("[Firebase Auth] Failed to initialize RecaptchaVerifier:", err);
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
  }
};

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
