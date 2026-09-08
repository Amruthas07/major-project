import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  Calendar, 
  Bell, 
  Settings, 
  ShieldCheck, 
  Check, 
  Sparkles,
  ChevronRight,
  Globe,
  Sliders,
  Scale,
  MapPin,
  Droplets
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: {
    name: string;
    age: number;
    pregnancyWeek: number;
    trimester: number;
    weightKg?: number;
    heightCm?: number;
    state?: string;
    isVegetarian: boolean;
    hasGestationalDiabetes: boolean;
    hasHypertension: boolean;
    targetWaterMl: number;
    language: string;
  };
  onUpdateProfile: (updated: any) => void;
}

const INDIAN_STATES = [
  'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 
  'Kerala', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Rajasthan', 
  'Punjab', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Assam', 'Delhi'
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile
}) => {
  const [profile, setProfile] = useState({
    ...userProfile,
    weightKg: userProfile.weightKg || 58,
    heightCm: userProfile.heightCm || 162,
    state: userProfile.state || 'Karnataka'
  });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* 1. Profile Banner Header */}
      <section className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#523D35] text-[#E8D9CD] flex items-center justify-center text-2xl font-black shadow-xs border border-[#BBA58F]/30">
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'M'}
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-[11px] font-black uppercase tracking-wider border border-[#BBA58F]/30">
            <Sparkles className="w-3 h-3 text-[#BBA58F]" />
            <span>Trimester {profile.trimester} • Week {profile.pregnancyWeek}</span>
          </div>
          <h1 className="text-2xl font-black text-[#223030] mt-1">{profile.name || 'Maternal Profile'}</h1>
          <p className="text-xs text-[#523D35] font-medium">Personalized clinical nutrition targets, region & pregnancy settings</p>
        </div>
      </section>

      {/* 2. Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section: Personal Details */}
        <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-7 border border-[#959D90] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#959D90]/30">
            <User className="w-4 h-4 text-[#523D35]" />
            <h2 className="text-base font-bold text-[#223030]">Personal Details & Demographics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Age</label>
              <input
                type="number"
                min="18"
                max="50"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Home State (for Regional Cuisine)</label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Preferred Language</label>
              <select
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="bn">Bengali (বাংলা)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Pregnancy Stage & Biometrics */}
        <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-7 border border-[#959D90] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#959D90]/30">
            <Calendar className="w-4 h-4 text-[#523D35]" />
            <h2 className="text-base font-bold text-[#223030]">Pregnancy Stage & Biometrics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Pregnancy Week (1–40)</label>
              <input
                type="number"
                min="1"
                max="40"
                value={profile.pregnancyWeek}
                onChange={(e) => {
                  const week = Number(e.target.value);
                  const trim = week <= 12 ? 1 : week <= 27 ? 2 : 3;
                  setProfile({ ...profile, pregnancyWeek: week, trimester: trim });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Current Trimester</label>
              <select
                value={profile.trimester}
                onChange={(e) => setProfile({ ...profile, trimester: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
              >
                <option value={1}>Trimester 1 (Weeks 1–12)</option>
                <option value={2}>Trimester 2 (Weeks 13–27)</option>
                <option value={3}>Trimester 3 (Weeks 28–40)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Pre-Pregnancy Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="35"
                max="150"
                value={profile.weightKg}
                onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#523D35]">Height (cm)</label>
              <input
                type="number"
                min="130"
                max="200"
                value={profile.heightCm}
                onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#959D90] bg-[#EFEFE9] text-xs font-medium text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/20 focus:border-[#523D35] transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Section: Clinical & Dietary Settings */}
        <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-7 border border-[#959D90] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#959D90]/30">
            <Heart className="w-4 h-4 text-[#523D35]" />
            <h2 className="text-base font-bold text-[#223030]">Clinical & Dietary Settings</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/40 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#223030] block">Strict Vegetarian Diet</span>
                <span className="text-[11px] text-[#523D35]">Filter out non-vegetarian dishes and prioritize plant proteins</span>
              </div>
              <input
                type="checkbox"
                checked={profile.isVegetarian}
                onChange={(e) => setProfile({ ...profile, isVegetarian: e.target.checked })}
                className="w-5 h-5 rounded text-[#523D35] focus:ring-[#523D35] border-[#959D90] accent-[#523D35]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/40 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#223030] block">Gestational Diabetes Monitoring (GDM)</span>
                <span className="text-[11px] text-[#523D35]">Strict low glycemic index and fiber-first meal recommendations</span>
              </div>
              <input
                type="checkbox"
                checked={profile.hasGestationalDiabetes}
                onChange={(e) => setProfile({ ...profile, hasGestationalDiabetes: e.target.checked })}
                className="w-5 h-5 rounded text-[#523D35] focus:ring-[#523D35] border-[#959D90] accent-[#523D35]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/40 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#223030] block">Maternal Hypertension / Pre-eclampsia Monitoring</span>
                <span className="text-[11px] text-[#523D35]">Low-sodium (&lt; 1.5g/day) and potassium-rich traditional options</span>
              </div>
              <input
                type="checkbox"
                checked={profile.hasHypertension}
                onChange={(e) => setProfile({ ...profile, hasHypertension: e.target.checked })}
                className="w-5 h-5 rounded text-[#523D35] focus:ring-[#523D35] border-[#959D90] accent-[#523D35]"
              />
            </label>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#523D35]">
              <Check className="w-4 h-4 text-[#523D35]" />
              <span>Profile updated successfully!</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Profile Settings
          </button>
        </div>

      </form>
    </div>
  );
};
