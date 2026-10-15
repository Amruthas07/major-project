import React, { useState } from 'react';
import {
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
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';
import { authService } from '../services/auth_service';
import { AuthUser } from '../types';
import { GlobalLocationService } from '../services/global_location_service';
import { StateData } from '../data/india_geographic_hierarchy';
import { useLanguage } from '../services/language_service';
import { getFirebaseErrorMessage } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAuthSuccess: (user: AuthUser, needsProfileSetup: boolean) => void;
  canDismiss?: boolean;
  pendingUser?: AuthUser | null;
}

type AuthTab = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  canDismiss = false
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Sign In Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Create Account Form state
  // [Personal Details]
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // [Pregnancy & Regional Profile]
  const [regPregnancyMonth, setRegPregnancyMonth] = useState<number>(6);
  const [regState, setRegState] = useState<string>('Karnataka');
  const [regDietPreference, setRegDietPreference] = useState<'Vegetarian' | 'Non-Vegetarian'>('Vegetarian');

  // [Consent & Terms]
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Forgot password
  const [resetEmail, setResetEmail] = useState('');

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Indian States & UTs list for dropdown
  const allStates: StateData[] = GlobalLocationService.getInstance().getAllStates();

  if (!isOpen) return null;

  // Clear messages when switching tabs
  const handleSwitchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);
  };

  // -------------------------------------------------------------
  // 1. EMAIL & PASSWORD LOGIN
  // -------------------------------------------------------------
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;
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

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Login failed. Please check your credentials and try again.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Signed in successfully! Loading your pregnancy dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(res.user!, false);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      console.error('[Login Error]', err);
      setErrorMsg(getFirebaseErrorMessage(err));
    }
  };

  // -------------------------------------------------------------
  // 2. CREATE ACCOUNT (REGISTRATION)
  // -------------------------------------------------------------
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim();

    // 1. Check for missing required fields
    if (!trimmedName) {
      setErrorMsg('Full Name is required. Please enter your name.');
      return;
    }
    if (trimmedName.length < 2) {
      setErrorMsg('Full Name must be at least 2 characters long.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMsg('Email Address is required.');
      return;
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // 3. Validate password strength/length (minimum 6 characters)
    if (!regPassword) {
      setErrorMsg('Password is required.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // 4. Ensure password === confirmPassword
    if (!regConfirmPassword) {
      setErrorMsg('Please confirm your password.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both passwords match exactly.');
      return;
    }

    // 5. Regional & Pregnancy Profile validation
    if (!regState) {
      setErrorMsg('Please select your Indian State.');
      return;
    }
    if (!regPregnancyMonth || regPregnancyMonth < 1 || regPregnancyMonth > 9) {
      setErrorMsg('Please select your current pregnancy month (1 to 9).');
      return;
    }

    // 6. Check Terms & Conditions checkbox
    if (!termsAccepted) {
      setErrorMsg('Please agree to the Privacy Policy and Terms of Service to create your account.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.firebaseSignUp({
        fullName: trimmedName,
        email: trimmedEmail,
        password: regPassword,
        pregnancyMonth: regPregnancyMonth,
        state: regState,
        dietPreference: regDietPreference
      });

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Registration failed. Please check your details and try again.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg(`Account created successfully! Welcome, ${trimmedName}. Loading your dashboard...`);
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(res.user!, false);
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      console.error('[Registration Error]', err);
      setErrorMsg(getFirebaseErrorMessage(err));
    }
  };

  // -------------------------------------------------------------
  // 3. CONTINUE WITH GOOGLE (POPUP WITH REDIRECT FALLBACK)
  // -------------------------------------------------------------
  const handleGoogleSignIn = async (options?: { preserveRegistrationFields?: boolean }) => {
    if (isLoading || isGoogleLoading) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoNotice(null);
    setIsGoogleLoading(true);

    try {
      const signInOptions = options?.preserveRegistrationFields
        ? {
            state: regState,
            dietPreference: regDietPreference,
            pregnancyMonth: regPregnancyMonth,
            weeksPregnant: Math.min(36, regPregnancyMonth * 4)
          }
        : undefined;

      const res = await authService.firebaseGoogleSignIn(signInOptions);

      if (res.redirecting) {
        setInfoNotice('Redirecting to Google for account selection...');
        return;
      }

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Google sign-in could not be completed. Please try again.');
        setIsGoogleLoading(false);
        return;
      }

      setSuccessMsg(`Welcome, ${res.user.name}! Connecting your maternal health record...`);
      setTimeout(() => {
        setIsGoogleLoading(false);
        onAuthSuccess(res.user!, res.isNewUser ?? false);
      }, 350);
    } catch (err: any) {
      setIsGoogleLoading(false);
      console.error('[Google Sign-In Error]', err);
      const code = err?.code ? ` (${err.code})` : '';
      const msg = getFirebaseErrorMessage(err);
      setErrorMsg(`${msg}${code}`);
    }
  };

  // -------------------------------------------------------------
  // 4. FORGOT PASSWORD
  // -------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
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

      setSuccessMsg(res.message || 'Password reset link sent! Please check your inbox.');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to send password reset link.');
    }
  };

  // -------------------------------------------------------------
  // 5. EVALUATION DEMO PROFILE PREVIEW
  // -------------------------------------------------------------
  const handleDemoLogin = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = authService.login('demo@pregnutri.app', 'demo123');
      setIsLoading(false);
      if (res.success && res.account) {
        setSuccessMsg('Demo Guest account authenticated! Launching dashboard...');
        setTimeout(() => {
          onAuthSuccess(
            {
              id: res.account!.id,
              name: res.account!.name,
              emailOrPhone: res.account!.emailOrPhone,
              phoneVerified: true,
              onboardingStatus: 'active',
              hasCompletedProfile: res.account!.hasCompletedProfile,
              createdAt: res.account!.createdAt
            },
            false
          );
        }, 200);
      }
    }, 200);
  };

  // Trimester badge helper
  const getTrimesterBadge = (month: number) => {
    if (month <= 3) return { text: '1st Trimester (Weeks 1-12)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (month <= 6) return { text: '2nd Trimester (Weeks 13-27)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { text: '3rd Trimester (Weeks 28-40)', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
  };

  const trimesterBadge = getTrimesterBadge(regPregnancyMonth);

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
          {/* Error Message Banner */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-800 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}

          {/* Special Authorized Domain Notice if encountered */}
          {(errorMsg?.includes('auth/unauthorized-domain') || errorMsg?.includes('Unauthorized domain')) && (
            <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <h4 className="font-bold text-amber-900">Authorized Domain Notice (auth/unauthorized-domain)</h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This domain needs to be in your Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn()}
                      disabled={isLoading || isGoogleLoading}
                      className="px-3.5 py-1.5 bg-[#223030] hover:bg-[#523D35] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGoogleLoading ? 'animate-spin' : ''}`} />
                      <span>Retry Sign-In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-[#523D35] border border-amber-300 rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      Reload Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Info Notice Banner */}
          {infoNotice && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{infoNotice}</div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: SIGN IN (EMAIL & PASSWORD + GOOGLE)                     */}
          {/* ============================================================== */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-3.5">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#223030] mb-1">
                    {t('auth.emailOrPhone', 'Email Address')} <span className="text-rose-600">*</span>
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

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#223030]">
                      {t('auth.password', 'Password')} <span className="text-rose-600">*</span>
                    </label>
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

                {/* Submit Sign In */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                      <span>{t('common.loading', 'Authenticating...')}</span>
                    </span>
                  ) : (
                    <>
                      <span>{t('auth.signIn', 'Sign In')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                    </>
                  )}
                </button>
              </form>

              {/* Visual Divider: OR */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#959D90]/40"></div>
                </div>
                <span className="relative bg-[#EFEFE9] px-3 text-xs uppercase font-extrabold text-[#523D35] tracking-wider">
                  OR
                </span>
              </div>

              {/* Official Continue with Google Button */}
              <button
                type="button"
                id="btn-google-login"
                onClick={() => handleGoogleSignIn()}
                disabled={isLoading || isGoogleLoading}
                className="w-full py-3 px-4 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-[#223030] border-2 border-[#523D35]/30 hover:border-[#523D35] font-extrabold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-3 cursor-pointer shadow-xs hover:shadow-md disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#523D35]" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                )}
                <span>{isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
              </button>

              {/* Demo Profile Shortcut (Clean & Subtle) */}
              <div className="pt-2 border-t border-[#959D90]/30">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-2 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] border border-[#959D90]/50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                  <span>One-Click Quick Preview (Demo Profile)</span>
                </button>
              </div>

              {/* Switch to Create Account */}
              <div className="text-center pt-1">
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
            <div className="space-y-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
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

                {/* 3. Password & Confirm Password */}
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
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#523D35] cursor-pointer"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Pregnancy & Regional Profile Section */}
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

                  {/* Pregnancy Month Selector (1 to 9) */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[#223030] mb-1.5">
                      Current Pregnancy Month: <strong className="text-[#523D35]">Month {regPregnancyMonth}</strong> <span className="text-rose-600">*</span>
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

                  {/* State & Diet Preference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
                    {/* Indian State Selection */}
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
                    </div>

                    {/* Diet Preference Segmented Toggle */}
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

                {/* 5. Terms & Privacy Acceptance */}
                <div className="p-3 bg-[#E8D9CD] rounded-xl border border-[#959D90]/40 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#223030] focus:ring-[#523D35]"
                    />
                    <span className="text-[11px] text-[#523D35] leading-relaxed">
                      I agree to the <strong>Privacy Policy</strong> and <strong>Terms of Service</strong>. I understand that PregNutri AI aligns with ICMR-NIN Maternal Guidelines.
                    </span>
                  </label>
                </div>

                {/* Submit Create Account */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BBA58F]" />
                      <span>Creating Maternal Account...</span>
                    </span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                    </>
                  )}
                </button>
              </form>

              {/* Visual Divider: OR */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#959D90]/40"></div>
                </div>
                <span className="relative bg-[#EFEFE9] px-3 text-xs uppercase font-extrabold text-[#523D35] tracking-wider">
                  OR
                </span>
              </div>

              {/* Official Continue with Google Button */}
              <button
                type="button"
                id="btn-google-signup"
                onClick={() => handleGoogleSignIn({ preserveRegistrationFields: true })}
                disabled={isLoading || isGoogleLoading}
                className="w-full py-3 px-4 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-[#223030] border-2 border-[#523D35]/30 hover:border-[#523D35] font-extrabold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-3 cursor-pointer shadow-xs hover:shadow-md disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#523D35]" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                )}
                <span>{isGoogleLoading ? 'Registering with Google...' : 'Continue with Google'}</span>
              </button>

              {/* Switch to Sign In */}
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
            </div>
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
