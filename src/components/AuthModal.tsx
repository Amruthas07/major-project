import React, { useState } from 'react';
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
  Baby
} from 'lucide-react';
import { authService } from '../services/auth_service';
import { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAuthSuccess: (user: AuthUser, needsProfileSetup: boolean) => void;
}

type AuthTab = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Form fields
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password specific
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email address or mobile number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.login(emailOrPhone, password);
      setIsLoading(false);

      if (!res.success || !res.account) {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
        return;
      }

      onAuthSuccess(
        {
          id: res.account.id,
          name: res.account.name,
          emailOrPhone: res.account.emailOrPhone,
          hasCompletedProfile: res.account.hasCompletedProfile,
          createdAt: res.account.createdAt
        },
        !res.account.hasCompletedProfile
      );
    }, 250);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter an email address or mobile number.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.signup(name, emailOrPhone, password);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.message || 'Sign up failed. Please try again.');
        return;
      }

      // New user signup always proceeds to First-Time Pregnancy Profile Setup!
      onAuthSuccess(res.user, true);
    }, 250);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetIdentifier.trim()) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.forgotPassword(resetIdentifier, newPassword);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.message || 'Failed to reset password.');
        return;
      }

      setSuccessMsg(res.message || 'Password updated successfully! You can now log in.');
      setTimeout(() => {
        setEmailOrPhone(resetIdentifier);
        setPassword('');
        setActiveTab('login');
        setSuccessMsg(null);
      }, 1500);
    }, 250);
  };

  const handleDemoLogin = () => {
    setEmailOrPhone('amruthaammu571301@gmail.com');
    setPassword('password123');
    setErrorMsg(null);
    setSuccessMsg(null);

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.login('amruthaammu571301@gmail.com', 'password123');
      setIsLoading(false);
      if (res.success && res.account) {
        onAuthSuccess(
          {
            id: res.account.id,
            name: res.account.name,
            emailOrPhone: res.account.emailOrPhone,
            hasCompletedProfile: res.account.hasCompletedProfile,
            createdAt: res.account.createdAt
          },
          !res.account.hasCompletedProfile
        );
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#EFEFE9] rounded-3xl max-w-md w-full shadow-2xl border border-[#523D35]/30 overflow-hidden text-[#223030] animate-in fade-in zoom-in-95">
        {/* Top Header Banner */}
        <div className="bg-[#223030] text-[#EFEFE9] p-6 sm:p-7 relative overflow-hidden border-b border-[#523D35]">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#523D35] border border-[#BBA58F]/40 flex items-center justify-center font-black text-xl text-[#EFEFE9]">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight">
                    PregNutri <span className="text-[#BBA58F]">AI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 uppercase">
                    Care Portal
                  </span>
                </div>
                <p className="text-[11px] text-[#E8D9CD]">Clinical Maternal Nutrition &amp; Care Companion</p>
              </div>
            </div>

            <div className="w-9 h-9 rounded-xl bg-[#523D35]/60 flex items-center justify-center text-[#BBA58F]">
              <Baby className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#523D35]/80 flex items-center justify-between text-xs text-[#E8D9CD]">
            <span>ICMR-NIN Maternal Nutrition</span>
            <span className="flex items-center gap-1 text-[#BBA58F]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Safe</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        {activeTab !== 'forgot' && (
          <div className="grid grid-cols-2 p-2 bg-[#E8D9CD] border-b border-[#959D90]/40">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'text-[#523D35] hover:text-[#223030]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'text-[#523D35] hover:text-[#223030]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="p-6 sm:p-7">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. amrutha@gmail.com or 9876543210"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#223030]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetIdentifier(emailOrPhone);
                      setActiveTab('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-semibold text-[#523D35] hover:text-[#223030] transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#523D35]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to PregNutri AI</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                  </>
                )}
              </button>

              {/* Demo Account Shortcut */}
              <div className="pt-2 border-t border-[#959D90]/30">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] border border-[#959D90]/50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                  <span>One-Click Demo Login (Amrutha • Month 6)</span>
                </button>
                <p className="text-[10px] text-center text-[#523D35] mt-1.5">
                  Instant preview of central pregnancy profile, weight history, and reminders
                </p>
              </div>
            </form>
          )}

          {/* 2. SIGN UP TAB (First-time user flow) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Mother's Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  Mobile Number or Email <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or yourname@gmail.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  Password (min. 6 characters) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#523D35]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-xl border border-[#959D90]/40 text-[11px] text-[#523D35] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#523D35] shrink-0" />
                <span>Next step: You will configure your Pregnancy Month, Trimester, Location &amp; Allergies.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create Account &amp; Setup Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#BBA58F]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD VIEW */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div className="text-left mb-2">
                <h3 className="text-sm font-extrabold text-[#223030]">Reset Your Password</h3>
                <p className="text-[11px] text-[#523D35]">
                  Enter your registered mobile number or email address to set a new password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  Registered Mobile or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or email"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  New Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#959D90] hover:text-[#523D35]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#223030] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#523D35] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white rounded-xl border border-[#959D90]/50 text-xs text-[#223030] placeholder-[#959D90] focus:border-[#523D35] focus:outline-none transition shadow-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="flex-1 py-2.5 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#523D35] font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs rounded-xl transition cursor-pointer shadow-md disabled:opacity-70"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
