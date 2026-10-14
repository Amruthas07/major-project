import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Baby,
  Phone,
  MapPin,
  Check,
  RefreshCw,
  X
} from 'lucide-react';
import { authService } from '../services/auth_service';
import { AuthUser } from '../types';
import { GlobalLocationService } from '../services/global_location_service';
import { StateData } from '../data/india_geographic_hierarchy';
import { useLanguage } from '../services/language_service';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAuthSuccess: (user: AuthUser, needsProfileSetup: boolean) => void;
  canDismiss?: boolean;
}

type AuthTab = 'login' | 'signup' | 'forgot';
type LoginMethod = 'email' | 'phone';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  canDismiss = false
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  // Login Form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Phone OTP fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Registration Form fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPregnancyMonth, setRegPregnancyMonth] = useState<number>(6);
  const [regDietPreference, setRegDietPreference] = useState<'Vegetarian' | 'Non-Vegetarian'>('Vegetarian');
  const [regState, setRegState] = useState<string>('Karnataka');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Forgot password specific
  const [resetEmail, setResetEmail] = useState('');

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Indian States list for dropdown
  const allStates: StateData[] = GlobalLocationService.getInstance().getAllStates();

  // Handle countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Clear messages when switching tabs
  const handleSwitchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);
  };

  // 1. EMAIL & PASSWORD LOGIN
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);

    const emailTrimmed = loginEmail.trim();
    if (!emailTrimmed) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.firebaseLogin(emailTrimmed, loginPassword);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Login failed. Please check your credentials and try again.');
        return;
      }

      setSuccessMsg('Signed in successfully! Loading your pregnancy dashboard...');
      setTimeout(() => {
        onAuthSuccess(res.user!, false);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred during sign-in.');
    }
  };

  // 2. PHONE OTP - SEND OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);

    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.firebaseSendPhoneOtp(cleaned, 'recaptcha-container');
      setIsLoading(false);

      if (!res.success || !res.confirmationResult) {
        setErrorMsg(res.message || 'Unable to send SMS OTP. Please use Email & Password or Google Sign-In.');
        return;
      }

      setConfirmationResult(res.confirmationResult);
      setIsOtpSent(true);
      setResendTimer(30);
      setSuccessMsg(`Real SMS OTP sent to +91 ${cleaned}! Please enter the 6-digit verification code.`);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to dispatch SMS verification. Please try Email & Password.');
    }
  };

  // 2b. PHONE OTP - VERIFY OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanedOtp = otpCode.trim();
    if (!cleanedOtp || cleanedOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP verification code received via SMS.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.firebaseConfirmPhoneOtp(confirmationResult, cleanedOtp);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Invalid OTP code. Please check the SMS and re-enter.');
        return;
      }

      setSuccessMsg('Mobile number verified successfully! Welcome to PregNutri AI.');
      setTimeout(() => {
        onAuthSuccess(res.user!, !res.user!.hasCompletedProfile);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'OTP verification failed. Please check your code or request a new one.');
    }
  };

  // 3. GOOGLE SIGN-IN
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);
    setIsLoading(true);

    try {
      const res = await authService.firebaseGoogleSignIn();
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Google sign-in failed. Please use Email & Password registration.');
        return;
      }

      setSuccessMsg(`Welcome, ${res.user.name}! Connecting your maternal health record...`);
      setTimeout(() => {
        onAuthSuccess(res.user!, false);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Google Sign-In could not be completed.');
    }
  };

  // 4. REGISTRATION / SIGN UP
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPhone) {
      const cleanPhone = regPhone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit Indian mobile number or leave it blank.');
        return;
      }
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter both carefully.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy to create your account.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.firebaseSignUp({
        name: trimmedName,
        email: trimmedEmail,
        password: regPassword,
        phone: regPhone ? regPhone.replace(/\D/g, '') : undefined,
        pregnancyMonth: regPregnancyMonth,
        dietPreference: regDietPreference,
        state: regState
      });
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Registration failed. An account with this email may already exist.');
        return;
      }

      setSuccessMsg('Account created successfully! Initializing your clinical maternal dashboard...');
      setTimeout(() => {
        onAuthSuccess(res.user!, false);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Registration failed. Please check your network connection.');
    }
  };

  // 5. FORGOT PASSWORD
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = resetEmail.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.firebaseSendPasswordReset(trimmedEmail);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      setSuccessMsg(res.message);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to send password reset link.');
    }
  };

  // 6. DEMO ACCOUNT PREVIEW
  const handleDemoLogin = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = authService.login('demo@pregnutri.app', 'demo123');
      setIsLoading(false);
      if (res.success && res.account) {
        setSuccessMsg('Demo Guest account authenticated! Launching platform...');
        setTimeout(() => {
          onAuthSuccess(
            {
              id: res.account!.id,
              name: res.account!.name,
              emailOrPhone: res.account!.emailOrPhone,
              hasCompletedProfile: res.account!.hasCompletedProfile,
              createdAt: res.account!.createdAt
            },
            false
          );
        }, 200);
      }
    }, 200);
  };

  // Trimester label calculation helper
  const getTrimesterBadge = (month: number) => {
    if (month <= 3) return { text: '1st Trimester (Weeks 1-12)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (month <= 6) return { text: '2nd Trimester (Weeks 13-27)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { text: '3rd Trimester (Weeks 28-40)', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
  };

  const trimesterBadge = getTrimesterBadge(regPregnancyMonth);

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Invisible reCAPTCHA container for Firebase Phone Authentication */}
      <div id="recaptcha-container"></div>

      <div className="bg-[#EFEFE9] rounded-3xl max-w-lg w-full shadow-2xl border border-[#523D35]/30 overflow-hidden text-[#223030] my-6 animate-in fade-in zoom-in-95">
        {/* Top Header Banner */}
        <div className="bg-[#223030] text-[#EFEFE9] p-5 sm:p-6 relative overflow-hidden border-b border-[#523D35]">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#523D35] border border-[#BBA58F]/40 flex items-center justify-center font-black text-xl text-[#EFEFE9] shadow-inner">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight">
                    PregNutri <span className="text-[#BBA58F]">AI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 uppercase tracking-wider">
                    Care Portal
                  </span>
                </div>
                <p className="text-[11px] text-[#E8D9CD]">{t('auth.loginSubtitle', 'AI-Powered Maternal Healthcare & Nutrition Support')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#523D35]/60 flex items-center justify-center text-[#BBA58F]">
                <Baby className="w-5 h-5" />
              </div>
              {canDismiss && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-[#523D35]/60 hover:bg-[#523D35] text-[#E8D9CD] transition cursor-pointer"
                  title="Close Dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-[#523D35]/80 flex items-center justify-between text-xs text-[#E8D9CD]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>ICMR-NIN 2020 Maternal Standard</span>
            </span>
            <span className="text-[11px] text-[#BBA58F] font-medium">State-Specific Food Integration</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-[#E8D9CD] border-b border-[#959D90]/40">
          <button
            type="button"
            onClick={() => handleSwitchTab('login')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login' || activeTab === 'forgot'
                ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                : 'text-[#523D35] hover:text-[#223030]'
            }`}
          >
            <span>{t('auth.signIn', 'Sign In')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('signup')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                : 'text-[#523D35] hover:text-[#223030]'
            }`}
          >
            <span>{t('auth.signUp', 'Create Account')}</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Info Notice */}
          {infoNotice && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{infoNotice}</div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: SIGN IN (LOGIN)                                        */}
          {/* ============================================================== */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {/* Method Toggle: Email vs Phone */}
              <div className="flex items-center gap-2 p-1 bg-white/70 rounded-xl border border-[#959D90]/30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-[#523D35] text-[#EFEFE9]'
                      : 'text-[#523D35] hover:text-[#223030]'
                  }`}
                >
                  Email &amp; Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('phone');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                    loginMethod === 'phone'
                      ? 'bg-[#523D35] text-[#EFEFE9]'
                      : 'text-[#523D35] hover:text-[#223030]'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>Indian Mobile (+91)</span>
                </button>
              </div>

              {/* A. EMAIL & PASSWORD LOGIN */}
              {loginMethod === 'email' && (
                <form onSubmit={handleEmailLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#223030] mb-1">
                      {t('auth.emailOrPhone', 'Email Address')}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. mother@pregnutri.app"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#223030]">{t('auth.password', 'Password')}</label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(loginEmail);
                          handleSwitchTab('forgot');
                        }}
                        className="text-[11px] font-semibold text-[#523D35] hover:text-[#223030] transition cursor-pointer"
                      >
                        {t('auth.forgotPassword', 'Forgot Password?')}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#523D35] cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                        <span>{t('common.loading', 'Authenticating...')}</span>
                      </span>
                    ) : (
                      <>
                        <span>{t('auth.signIn', 'Sign In to PregNutri AI')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* B. INDIAN MOBILE OTP LOGIN */}
              {loginMethod === 'phone' && (
                <div className="space-y-3.5">
                  {!isOtpSent ? (
                    <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#223030] mb-1">
                          Indian Mobile Number
                        </label>
                        <div className="flex rounded-xl overflow-hidden border border-[#959D90]/50 shadow-xs bg-white">
                          <span className="bg-[#E8D9CD] px-3.5 py-2.5 text-xs font-bold text-[#523D35] border-r border-[#959D90]/40 flex items-center">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            placeholder="10-digit mobile number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-2.5 text-xs text-[#223030] placeholder-[#959D90] focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-[#523D35] mt-1">
                          A real 6-digit SMS OTP will be dispatched via Firebase Phone Authentication.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || phoneNumber.replace(/\D/g, '').length !== 10}
                        className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                            <span>Verifying &amp; Sending SMS OTP...</span>
                          </span>
                        ) : (
                          <>
                            <Phone className="w-3.5 h-3.5 text-[#BBA58F]" />
                            <span>Send Verification Code (SMS)</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
                        <span>OTP sent to: <strong>+91 {phoneNumber}</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtpSent(false);
                            setOtpCode('');
                            setErrorMsg(null);
                          }}
                          className="text-xs font-bold text-[#523D35] underline hover:text-[#223030] cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#223030] mb-1">
                          Enter 6-Digit SMS Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          placeholder="6-digit OTP code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-[#223030] focus:border-[#523D35] focus:outline-none shadow-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#523D35]">
                        {resendTimer > 0 ? (
                          <span>Resend OTP in {resendTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            disabled={isLoading}
                            className="text-[#523D35] font-bold underline hover:text-[#223030] cursor-pointer"
                          >
                            Resend SMS OTP
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || otpCode.trim().length !== 6}
                        className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                            <span>Verifying OTP Code...</span>
                          </span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#BBA58F]" />
                            <span>Verify Code &amp; Sign In</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#959D90]/40"></div>
                </div>
                <span className="relative bg-[#EFEFE9] px-3 text-[10px] uppercase font-bold text-[#523D35] tracking-wider">
                  Or Connect With
                </span>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 bg-white hover:bg-neutral-50 text-[#223030] border border-[#959D90]/50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Demo Account Shortcut */}
              <div className="pt-2 border-t border-[#959D90]/30">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full py-2 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] border border-[#959D90]/50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                  <span>One-Click Quick Preview (Demo Profile)</span>
                </button>
                <p className="text-[10px] text-center text-[#523D35] mt-1">
                  Instant evaluation preview of full pregnancy tracking, weight records, and reminders
                </p>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-[#523D35]">
                  {t('auth.noAccount', "Don't have an account?")}{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchTab('signup')}
                    className="font-bold text-[#223030] underline hover:text-[#523D35] cursor-pointer"
                  >
                    {t('auth.signUp', 'Create a new account')}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CREATE ACCOUNT (REGISTRATION)                           */}
          {/* ============================================================== */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="text-left mb-1">
                <h3 className="text-sm font-extrabold text-[#223030]">{t('auth.signupTitle', 'New Mother Registration')}</h3>
                <p className="text-[11px] text-[#523D35]">
                  {t('profile.modalSubtitle', 'Create your secure account and personalize your clinical pregnancy nutrition profile.')}
                </p>
              </div>

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  {t('auth.fullName', 'Full Name')} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              {/* 2. Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  {t('auth.emailOrPhone', 'Email Address')} <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. radhika@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              {/* 3. Indian Mobile Number (Optional on signup) */}
              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  {t('profile.emergencyPhone', 'Indian Mobile Number')} (Optional)
                </label>
                <div className="flex rounded-xl overflow-hidden border border-[#959D90]/50 shadow-xs bg-white">
                  <span className="bg-[#E8D9CD] px-3 py-2 text-xs font-bold text-[#523D35] border-r border-[#959D90]/40 flex items-center">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-xs text-[#223030] placeholder-[#959D90] focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    {t('auth.password', 'Password')} <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#523D35] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#523D35] cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    {t('auth.confirmPassword', 'Confirm Password')} <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#523D35] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Clinical Pregnancy Information Header */}
              <div className="pt-2 border-t border-[#959D90]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#523D35] uppercase tracking-wider flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>Pregnancy &amp; Regional Profile</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${trimesterBadge.color}`}>
                    {trimesterBadge.text}
                  </span>
                </div>

                {/* Pregnancy Month Selector */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-[#223030] mb-1.5">
                    Current Pregnancy Month: <strong className="text-[#523D35]">Month {regPregnancyMonth}</strong>
                  </label>
                  <div className="grid grid-cols-9 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setRegPregnancyMonth(m)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                          regPregnancyMonth === m
                            ? 'bg-[#223030] text-[#EFEFE9] border-[#223030] shadow-xs'
                            : 'bg-white text-[#523D35] border-[#959D90]/40 hover:bg-[#E8D9CD]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* State Selection (Guarantees Indian Regional Food Preservation!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-[#223030] mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
                      <span>Indian State <span className="text-rose-600">*</span></span>
                    </label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] focus:border-[#523D35] focus:outline-none shadow-xs"
                    >
                      {allStates.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-[#523D35] mt-0.5">
                      Powers state-specific recipes, maternal foods &amp; welfare schemes.
                    </p>
                  </div>

                  {/* Diet Preference */}
                  <div>
                    <label className="block text-xs font-bold text-[#223030] mb-1">
                      Diet Preference <span className="text-rose-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRegDietPreference('Vegetarian')}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          regDietPreference === 'Vegetarian'
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                            : 'bg-white text-[#523D35] border-[#959D90]/40 hover:bg-[#E8D9CD]'
                        }`}
                      >
                        <span>🥦 Veg</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegDietPreference('Non-Vegetarian')}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          regDietPreference === 'Non-Vegetarian'
                            ? 'bg-[#523D35] text-white border-[#223030] shadow-xs'
                            : 'bg-white text-[#523D35] border-[#959D90]/40 hover:bg-[#E8D9CD]'
                        }`}
                      >
                        <span>🍗 Non-Veg</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Terms & Privacy Acceptance */}
              <div className="p-3 bg-[#E8D9CD] rounded-xl border border-[#959D90]/40 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#223030] focus:ring-[#523D35]"
                  />
                  <span className="text-[11px] text-[#523D35] leading-relaxed">
                    I accept the <strong>Privacy Policy &amp; Terms of Service</strong>. I understand that PregNutri AI aligns with ICMR-NIN Maternal Guidelines and protects clinical health records.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                    <span>Registering Account &amp; Setting Profile...</span>
                  </span>
                ) : (
                  <>
                    <span>{t('auth.signupBtn', 'Register & Launch Dashboard')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-[#523D35]">
                  {t('auth.haveAccount', 'Already have an account?')}{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchTab('login')}
                    className="font-bold text-[#223030] underline hover:text-[#523D35] cursor-pointer"
                  >
                    {t('auth.backToLogin', 'Return to Sign In')}
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* TAB 3: FORGOT PASSWORD                                         */}
          {/* ============================================================== */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-left mb-2">
                <h3 className="text-sm font-extrabold text-[#223030]">{t('auth.forgotTitle', 'Reset Your Password')}</h3>
                <p className="text-[11px] text-[#523D35]">
                  Enter your registered email address. We will send a secure password reset link directly to your inbox.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  {t('auth.emailOrPhone', 'Registered Email Address')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. mother@pregnutri.app"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="flex-1 py-2.5 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#523D35] font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  {t('auth.backToLogin', 'Back to Sign In')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl transition cursor-pointer shadow-md disabled:opacity-70 flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                      <span>{t('common.loading', 'Sending...')}</span>
                    </span>
                  ) : (
                    <span>{t('auth.resetBtn', 'Send Reset Link')}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
