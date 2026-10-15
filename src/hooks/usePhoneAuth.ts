import { useState, useCallback, useRef, useEffect } from 'react';
import { auth, rawAuth, getFirebaseErrorMessage, hasRealFirebase } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

export interface UsePhoneAuthReturn {
  confirmationResult: ConfirmationResult | null;
  isOtpSent: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  verificationId: string | null;
  formattedPhone: string;
  resendTimer: number;
  sendOtp: (
    phoneNumber: string,
    containerId?: string
  ) => Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string; errorCode?: string }>;
  verifyOtp: (
    otpCode: string
  ) => Promise<{ success: boolean; userCredential?: any; error?: string; errorCode?: string }>;
  resetPhoneAuth: () => void;
  clearRecaptcha: () => void;
}

export function formatIndianPhoneNumber(phoneNumber: string): {
  valid: boolean;
  formatted: string;
  cleanDigits: string;
  error?: string;
} {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      valid: false,
      formatted: '',
      cleanDigits: '',
      error: 'Please enter a valid 10-digit Indian mobile number.'
    };
  }

  let cleaned = phoneNumber.replace(/\D/g, '');

  // Strip leading 0 if 11 digits (e.g. 09876543210)
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // Strip leading 91 if 12 digits (e.g. 919876543210)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }

  // Mobile number must be exactly 10 digits
  if (cleaned.length !== 10) {
    return {
      valid: false,
      formatted: '',
      cleanDigits: '',
      error: 'Invalid phone number length. Indian mobile numbers must be 10 digits (+91).'
    };
  }

  // Indian mobile numbers must start with 6, 7, 8, or 9 per DoT regulations
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      formatted: '',
      cleanDigits: '',
      error: 'Invalid Indian mobile number. Valid Indian mobile numbers begin with 6, 7, 8, or 9.'
    };
  }

  return {
    valid: true,
    formatted: `+91${cleaned}`,
    cleanDigits: cleaned
  };
}

export function usePhoneAuth(): UsePhoneAuthReturn {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [formattedPhone, setFormattedPhone] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(0);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const clearRecaptcha = useCallback(() => {
    if (verifierRef.current) {
      try {
        verifierRef.current.clear();
      } catch (e) {
        console.warn('[usePhoneAuth] Notice clearing verifierRef:', e);
      }
      verifierRef.current = null;
    }
    auth.clearRecaptchaVerifier();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, [clearRecaptcha]);

  const sendOtp = useCallback(
    async (
      phoneNumber: string,
      containerId: string = 'recaptcha-container'
    ): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string; errorCode?: string }> => {
      setError(null);
      setErrorCode(null);

      // Prevent duplicate concurrent requests
      if (isLoading) {
        const err = 'A verification request is already in progress. Please wait.';
        setError(err);
        setErrorCode('auth/already-in-progress');
        return { success: false, error: err, errorCode: 'auth/already-in-progress' };
      }

      // Enforce cooldown if timer is active
      if (resendTimer > 0) {
        const err = `Please wait ${resendTimer}s before requesting another SMS OTP.`;
        setError(err);
        setErrorCode('auth/too-many-requests');
        return { success: false, error: err, errorCode: 'auth/too-many-requests' };
      }

      // Validate Indian phone number in E.164 format
      const validation = formatIndianPhoneNumber(phoneNumber);
      if (!validation.valid) {
        const err = validation.error || 'Invalid phone number format. Please provide a valid 10-digit Indian phone number (+91).';
        setError(err);
        setErrorCode('auth/invalid-phone-number');
        setIsOtpSent(false);
        setConfirmationResult(null);
        return { success: false, error: err, errorCode: 'auth/invalid-phone-number' };
      }

      const cleanPhone = validation.formatted;
      setFormattedPhone(cleanPhone);
      setIsLoading(true);

      // Clear any previous confirmation result while new request is dispatched
      setIsOtpSent(false);
      setConfirmationResult(null);

      let timeoutTimer: NodeJS.Timeout | null = null;

      try {
        if (!hasRealFirebase || !rawAuth) {
          throw new Error('Firebase Authentication is not configured with active credentials. Please check Firebase configuration.');
        }

        // Clean up any stale verifier before creating a fresh one
        clearRecaptcha();

        // Ensure container element exists in DOM
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        } else {
          container.innerHTML = '';
        }

        // Initialize RecaptchaVerifier
        const verifier = new RecaptchaVerifier(rawAuth, container, {
          size: 'invisible',
          callback: () => {
            console.log('[usePhoneAuth] reCAPTCHA challenge resolved successfully.');
          },
          'expired-callback': () => {
            console.warn('[usePhoneAuth] reCAPTCHA challenge expired. Resetting widget.');
            clearRecaptcha();
          }
        });

        verifierRef.current = verifier;

        console.log(`[usePhoneAuth] Requesting SMS OTP via Firebase signInWithPhoneNumber to ${cleanPhone}...`);

        // Reasonable loading timeout (20 seconds) to guarantee the indicator never hangs indefinitely
        const SMS_TIMEOUT_MS = 20000;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutTimer = setTimeout(() => {
            const timeoutError: any = new Error(
              'The SMS verification request timed out after 20 seconds. Firebase took too long to dispatch SMS. Please check network connectivity and click Retry.'
            );
            timeoutError.code = 'auth/timeout';
            reject(timeoutError);
          }, SMS_TIMEOUT_MS);
        });

        const result = await Promise.race([
          signInWithPhoneNumber(rawAuth, cleanPhone, verifier),
          timeoutPromise
        ]);

        if (timeoutTimer) clearTimeout(timeoutTimer);

        // Only after Firebase successfully returns confirmationResult:
        console.log('[usePhoneAuth] SMS OTP dispatched successfully by Firebase! Verification ID:', result.verificationId);
        setConfirmationResult(result);
        setIsOtpSent(true);
        setErrorCode(null);
        setResendTimer(60); // 60s cooldown for SMS OTP
        return { success: true, confirmationResult: result };
      } catch (err: any) {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        console.warn('[usePhoneAuth] Phone authentication notice:', err?.code || err?.message || err);
        clearRecaptcha();
        setIsOtpSent(false);
        setConfirmationResult(null);

        const code = err?.code || (err?.message?.includes('billing') ? 'auth/billing-not-enabled' : 'auth/unknown');
        setErrorCode(code);
        const friendlyMessage = getFirebaseErrorMessage(err);
        setError(friendlyMessage);
        return { success: false, error: friendlyMessage, errorCode: code };
      } finally {
        // ALWAYS ensure loading state stops on success, failure, or timeout
        setIsLoading(false);
      }
    },
    [clearRecaptcha, isLoading, resendTimer]
  );

  const verifyOtp = useCallback(
    async (
      otpCode: string
    ): Promise<{ success: boolean; userCredential?: any; error?: string; errorCode?: string }> => {
      setError(null);
      setErrorCode(null);
      const cleanCode = (otpCode || '').trim();

      if (!cleanCode || cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
        const err = 'Please enter the valid 6-digit OTP code received via SMS.';
        setError(err);
        setErrorCode('auth/invalid-verification-code');
        return { success: false, error: err, errorCode: 'auth/invalid-verification-code' };
      }

      if (!confirmationResult) {
        const err = 'Verification session expired or missing. Please request a new OTP.';
        setError(err);
        setErrorCode('auth/session-expired');
        return { success: false, error: err, errorCode: 'auth/session-expired' };
      }

      setIsLoading(true);
      let verifyTimer: NodeJS.Timeout | null = null;
      try {
        console.log(`[usePhoneAuth] Verifying code with Firebase confirmationResult...`);

        const VERIFY_TIMEOUT_MS = 20000;
        const timeoutPromise = new Promise<never>((_, reject) => {
          verifyTimer = setTimeout(() => {
            const timeoutError: any = new Error(
              'OTP verification timed out after 20 seconds. Please check your network connection and try again.'
            );
            timeoutError.code = 'auth/timeout';
            reject(timeoutError);
          }, VERIFY_TIMEOUT_MS);
        });

        const userCredential = await Promise.race([
          confirmationResult.confirm(cleanCode),
          timeoutPromise
        ]);

        if (verifyTimer) clearTimeout(verifyTimer);

        console.log('[usePhoneAuth] Firebase OTP confirmed successfully! UID:', userCredential.user?.uid);
        setErrorCode(null);
        return { success: true, userCredential };
      } catch (err: any) {
        if (verifyTimer) clearTimeout(verifyTimer);
        console.warn('[usePhoneAuth] OTP confirmation notice:', err?.code || err?.message || err);
        const code = err?.code || '';
        setErrorCode(code);
        // If code expired or session expired, invalidate existing confirmation result
        if (code === 'auth/code-expired' || code === 'auth/session-expired' || code === 'auth/invalid-verification-id') {
          setConfirmationResult(null);
          setIsOtpSent(false);
        }
        const friendlyMessage = getFirebaseErrorMessage(err);
        setError(friendlyMessage);
        return { success: false, error: friendlyMessage, errorCode: code };
      } finally {
        setIsLoading(false);
      }
    },
    [confirmationResult]
  );

  const resetPhoneAuth = useCallback(() => {
    clearRecaptcha();
    setConfirmationResult(null);
    setIsOtpSent(false);
    setError(null);
    setErrorCode(null);
    setIsLoading(false);
    setResendTimer(0);
    setFormattedPhone('');
  }, [clearRecaptcha]);

  return {
    confirmationResult,
    isOtpSent,
    isLoading,
    error,
    errorCode,
    verificationId: confirmationResult?.verificationId || null,
    formattedPhone,
    resendTimer,
    sendOtp,
    verifyOtp,
    resetPhoneAuth,
    clearRecaptcha
  };
}
