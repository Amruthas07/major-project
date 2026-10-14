import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, Heart, X, Check, Save, Shield, MapPin, AlertTriangle, Plus, Calendar, Scale, Ruler, Utensils, Search, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../services/language_service';
import { normalizeDietPreference } from '../utils/diet_preference';
import { AdministrativeLocationService, AdminLocationEntry } from '../services/administrative_location_service';

interface UserProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

const COMMON_ALLERGIES = [
  'Nuts (Peanuts / Tree Nuts)',
  'Milk & Dairy (Lactose)',
  'Eggs',
  'Seafood & Shellfish',
  'Gluten & Wheat',
  'Soy & Soybeans',
  'Mustard Seeds',
  'Sesame (Til)'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    dietPreference: profile.dietPreference || 'Vegetarian',
    pregnancyMonth: profile.pregnancyMonth || Math.min(9, Math.max(1, Math.floor((profile.weeksPregnant - 1) / 4) + 1)),
    allergies: profile.allergies || []
  });

  // Sync formData whenever modal opens or profile prop changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...profile,
        dietPreference: profile.dietPreference || 'Vegetarian',
        pregnancyMonth: profile.pregnancyMonth || Math.min(9, Math.max(1, Math.floor((profile.weeksPregnant - 1) / 4) + 1)),
        allergies: profile.allergies || []
      });
    }
  }, [isOpen, profile]);

  const [customAllergy, setCustomAllergy] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showManualLocation, setShowManualLocation] = useState(false);

  // Multi-state quick village / taluk suggestions for easy one-tap selection
  const POPULAR_LOCATION_SUGGESTIONS = [
    { label: 'Hullahalli, KA', query: 'Hullahalli' },
    { label: 'Nanjangud, KA', query: 'Nanjangud' },
    { label: 'Pollachi, TN', query: 'Pollachi' },
    { label: 'Aluva, KL', query: 'Aluva' },
    { label: 'Gajwel, TS', query: 'Gajwel' },
    { label: 'Gannavaram, AP', query: 'Gannavaram' },
    { label: 'Baramati, MH', query: 'Baramati' },
    { label: 'Sanand, GJ', query: 'Sanand' },
    { label: 'Mohanlalganj, UP', query: 'Mohanlalganj' },
    { label: 'Bolpur, WB', query: 'Bolpur' }
  ];

  const locationSearchResults = useMemo(() => {
    if (!locationSearchQuery.trim()) return [];
    return AdministrativeLocationService.search(locationSearchQuery).slice(0, 6);
  }, [locationSearchQuery]);

  const applyAdminLocation = (entry: AdminLocationEntry) => {
    setFormData((prev) => ({
      ...prev,
      village: entry.village || '',
      taluk: entry.taluk || '',
      district: entry.district,
      city: entry.district,
      state: entry.state,
      pincode: entry.pincode || prev.pincode
    }));
    setLocationSearchQuery('');
  };

  if (!isOpen) return null;

  const handleMonthChange = (month: number) => {
    const weeks = Math.min(40, Math.max(2, (month - 1) * 4 + 2));
    setFormData((prev) => ({
      ...prev,
      pregnancyMonth: month,
      weeksPregnant: weeks
    }));
  };

  const toggleAllergy = (allergy: string) => {
    const current = formData.allergies || [];
    if (current.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: current.filter((a) => a !== allergy)
      });
    } else {
      setFormData({
        ...formData,
        allergies: [...current, allergy]
      });
    }
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !(formData.allergies || []).includes(trimmed)) {
      setFormData({
        ...formData,
        allergies: [...(formData.allergies || []), trimmed]
      });
      setCustomAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: (formData.allergies || []).filter((a) => a !== allergy)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#EFEFE9] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#523D35]/40 animate-in fade-in zoom-in-95 text-[#223030]">
        {/* Header */}
        <div className="p-6 bg-[#223030] text-[#EFEFE9] border-b border-[#523D35] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#523D35] border border-[#BBA58F]/40 text-[#BBA58F] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#EFEFE9]">{t('profile.modalTitle', 'Pregnancy & Clinical Profile')}</h3>
              <p className="text-xs text-[#E8D9CD]">{t('profile.modalSubtitle', 'Update pregnancy month, weight, location, allergies, and doctor visit')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#523D35]/50 hover:bg-[#523D35] text-[#E8D9CD] hover:text-[#EFEFE9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Section 1: Basic Personal Info */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{t('profile.personalInfo', 'Personal Information')}</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.name', 'Full Name')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none focus:border-[#523D35]"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.age', 'Age (Years)')}</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="55"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none focus:border-[#523D35]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pregnancy Month & Trimester */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-[#959D90]/30">
              <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#523D35]" />
                <span>{t('profile.gestation', 'Pregnancy Month & Gestation')}</span>
              </h4>
              <span className="font-bold text-[#223030] bg-[#E8D9CD] px-2.5 py-0.5 rounded-full text-[11px]">
                {t('timeline.month', 'Month')} {formData.pregnancyMonth || 6} • {t('timeline.week', 'Week')} {formData.weeksPregnant}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                const isSelected = (formData.pregnancyMonth || 6) === m;
                const tri = m <= 3 ? '1st Tri' : m <= 6 ? '2nd Tri' : '3rd Tri';
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMonthChange(m)}
                    className={`py-2 px-1 rounded-xl text-center border transition flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#223030] border-[#523D35] text-[#EFEFE9] font-black shadow-xs'
                        : 'bg-[#E8D9CD] border-[#959D90]/40 text-[#223030] hover:bg-[#BBA58F]/40'
                    }`}
                  >
                    <span className="text-xs font-black">Mo {m}</span>
                    <span className={`text-[8px] ${isSelected ? 'text-[#BBA58F]' : 'text-[#523D35]'}`}>
                      {tri}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.pregnancyWeek', 'Weeks Pregnant')}</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={formData.weeksPregnant}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    const m = Math.min(9, Math.max(1, Math.floor((w - 1) / 4) + 1));
                    setFormData({ ...formData, weeksPregnant: w, pregnancyMonth: m });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.bloodGroup', 'Blood Group')}</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.dueDate', 'Estimated Due Date')}</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vitals (Height & Weight) */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{t('profile.vitals', 'Weight & Physical Vitals')}</span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.height', 'Height (cm)')}</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.currentWeight', 'Current Weight (kg)')}</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeightKg}
                  onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.prePregnancyWeight', 'Pre-Pregnancy Wt (kg)')}</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.prePregnancyWeightKg}
                  onChange={(e) => setFormData({ ...formData, prePregnancyWeightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-bold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Location (Single Source of Truth) */}
          <div className="bg-[#E8D9CD]/50 p-4 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
                <span>{t('profile.locationTitle', 'Location (Single Source of Truth)')}</span>
              </h4>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                {t('common.verified', 'Single Source of Truth')}
              </span>
            </div>
            
            <p className="text-[11px] text-[#523D35] leading-relaxed">
              {t('profile.locationDesc', 'Select your Village or Taluk once. The app automatically determines your Taluk, District, State, and broader region for local foods, recipes, and healthcare schemes.')}
            </p>

            {/* Smart Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-[#523D35] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder={t('profile.locationSearchPlaceholder', 'Search your Village, Town or Taluk...')}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#959D90]/60 text-xs text-[#223030] font-semibold outline-none focus:border-[#223030]"
                />
              </div>

              {/* Autocomplete dropdown */}
              {locationSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#959D90]/50 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-[#959D90]/20 max-h-56 overflow-y-auto">
                  {locationSearchResults.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyAdminLocation(loc)}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#E8D9CD]/60 flex items-center justify-between text-xs transition cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-[#223030]">
                          {loc.village ? `${loc.village} (Village)` : loc.taluk}
                        </span>
                        <span className="text-[11px] text-[#523D35] block">
                          Taluk: {loc.taluk} • District: {loc.district} • {loc.state}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-full">
                        {t('action.select', 'Select')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Suggestions for Rural Users */}
            <div>
              <span className="text-[10px] font-bold text-[#523D35] block mb-1.5 uppercase tracking-wide">
                {t('profile.quickLocation', 'Quick Selection (Tap your area):')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_LOCATION_SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      const match = AdministrativeLocationService.search(item.query)[0];
                      if (match) applyAdminLocation(match);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-[#959D90]/40 text-[#223030] hover:bg-[#223030] hover:text-[#EFEFE9] hover:border-[#223030] transition cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Location Hierarchy Card */}
            <div className="bg-white rounded-xl p-3 border border-[#959D90]/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('profile.verifiedLocation', 'Verified Administrative Location')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="bg-[#EFEFE9] p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-[#523D35] block uppercase">{t('profile.village', 'Village')}</span>
                  <span className="font-bold text-[#223030] truncate block">
                    {formData.village || '—'}
                  </span>
                </div>
                <div className="bg-[#EFEFE9] p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-[#523D35] block uppercase">{t('profile.taluk', 'Taluk')}</span>
                  <span className="font-bold text-[#223030] truncate block">
                    {formData.taluk || formData.city || 'Nanjangud'}
                  </span>
                </div>
                <div className="bg-[#EFEFE9] p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-[#523D35] block uppercase">{t('profile.district', 'District')}</span>
                  <span className="font-bold text-[#223030] truncate block">
                    {formData.district || formData.city || 'Mysuru'}
                  </span>
                </div>
                <div className="bg-[#EFEFE9] p-2 rounded-lg">
                  <span className="text-[10px] font-bold text-[#523D35] block uppercase">{t('profile.state', 'State')}</span>
                  <span className="font-bold text-[#223030] truncate block">
                    {formData.state || 'Karnataka'}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Manual Overrides for any custom locations */}
            <div>
              <button
                type="button"
                onClick={() => setShowManualLocation(!showManualLocation)}
                className="text-xs text-[#523D35] underline font-bold cursor-pointer hover:text-[#223030]"
              >
                {showManualLocation
                  ? t('profile.hideManualLocation', 'Hide detailed manual location inputs')
                  : t('profile.showManualLocation', '+ Enter or adjust location details manually')}
              </button>

              {showManualLocation && (
                <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-[#959D90]/30">
                  <div>
                    <label className="font-bold text-[#523D35] text-xs block mb-1">{t('profile.state', 'State')}</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => {
                        const st = e.target.value;
                        const res = AdministrativeLocationService.resolveHierarchy({ state: st, district: formData.district, taluk: formData.taluk, village: formData.village });
                        setFormData({ ...formData, state: res.state, district: res.district || formData.district });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-xs text-[#223030] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#523D35] text-xs block mb-1">{t('profile.district', 'District')} / {t('profile.city', 'City')}</label>
                    <input
                      type="text"
                      value={formData.district || formData.city}
                      onChange={(e) => {
                        const dst = e.target.value;
                        const res = AdministrativeLocationService.resolveHierarchy({ district: dst, state: formData.state, taluk: formData.taluk, village: formData.village });
                        setFormData({ ...formData, district: dst, city: dst, state: res.state || formData.state });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-xs text-[#223030] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#523D35] text-xs block mb-1">{t('profile.taluk', 'Taluk')} / {t('profile.tehsil', 'Tehsil')}</label>
                    <input
                      type="text"
                      value={formData.taluk || ''}
                      placeholder={t('profile.enterTalukPlaceholder', 'Enter Taluk / Tehsil')}
                      onChange={(e) => {
                        const tlk = e.target.value;
                        const res = AdministrativeLocationService.resolveHierarchy({ taluk: tlk });
                        setFormData({
                          ...formData,
                          taluk: tlk,
                          district: res.district || formData.district,
                          city: res.district || formData.city,
                          state: res.state || formData.state
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-xs text-[#223030] font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#523D35] text-xs block mb-1">{t('profile.village', 'Village')} / {t('profile.town', 'Town')}</label>
                    <input
                      type="text"
                      value={formData.village || ''}
                      placeholder={t('profile.enterVillagePlaceholder', 'Enter Village or Town')}
                      onChange={(e) => {
                        const vlg = e.target.value;
                        const res = AdministrativeLocationService.resolveHierarchy({ village: vlg, taluk: formData.taluk });
                        setFormData({
                          ...formData,
                          village: vlg,
                          taluk: res.taluk || formData.taluk,
                          district: res.district || formData.district,
                          city: res.district || formData.city,
                          state: res.state || formData.state
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-xs text-[#223030] font-semibold outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Diet Preference */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{t('diet.preference') || 'Diet Preference'}</span>
            </h4>
            <p className="text-[11px] text-[#523D35] mb-2 font-medium">
              {t('diet.choosePreference') || 'Choose your food preference'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, dietPreference: 'Vegetarian', isVegetarian: true })}
                className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  normalizeDietPreference(formData.dietPreference) === 'vegetarian'
                    ? 'bg-[#E8D9CD] border-[#223030] shadow-xs'
                    : 'bg-white border-[#959D90]/40 hover:bg-[#EFEFE9]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  normalizeDietPreference(formData.dietPreference) === 'vegetarian' ? 'bg-[#223030] text-white' : 'bg-[#EFEFE9]'
                }`}>
                  🥬
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#223030]">
                      {t('diet.vegetarian') || 'Vegetarian'}
                    </span>
                    {normalizeDietPreference(formData.dietPreference) === 'vegetarian' && (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#523D35] font-semibold mt-0.5 leading-tight">
                    {t('diet.vegetarianDesc') || 'Pure vegetarian & plant-based foods'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, dietPreference: 'Non-Vegetarian', isVegetarian: false })}
                className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  normalizeDietPreference(formData.dietPreference) === 'non-vegetarian'
                    ? 'bg-[#E8D9CD] border-[#223030] shadow-xs'
                    : 'bg-white border-[#959D90]/40 hover:bg-[#EFEFE9]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  normalizeDietPreference(formData.dietPreference) === 'non-vegetarian' ? 'bg-[#223030] text-white' : 'bg-[#EFEFE9]'
                }`}>
                  🍗
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#223030]">
                      {t('diet.nonVegetarian') || 'Non-Vegetarian'}
                    </span>
                    {normalizeDietPreference(formData.dietPreference) === 'non-vegetarian' && (
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-600 text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#523D35] font-semibold mt-0.5 leading-tight">
                    {t('diet.nonVegetarianDesc') || 'Vegetarian + verified safe non-veg'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 6: Allergies */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{t('profile.allergiesTitle', 'Food Allergies & Intolerances')}</span>
            </h4>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {COMMON_ALLERGIES.map((allergy) => {
                const isSelected = (formData.allergies || []).includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#223030] text-[#EFEFE9] border-[#223030]'
                        : 'bg-white text-[#223030] border-[#959D90]/40 hover:bg-[#E8D9CD]'
                    }`}
                  >
                    <span>{allergy}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#BBA58F]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t('profile.addAllergyPlaceholder', 'Add custom allergy...')}
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomAllergy();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#959D90]/50 text-xs text-[#223030] outline-none"
              />
              <button
                type="button"
                onClick={addCustomAllergy}
                className="px-3 py-1.5 bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {t('action.add', 'Add')}
              </button>
            </div>

            {(formData.allergies || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(formData.allergies || []).map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#223030] text-[#EFEFE9] text-[11px] font-semibold"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergy(a)}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Next Doctor Visit & Emergency */}
          <div>
            <h4 className="font-extrabold text-[#223030] text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-[#959D90]/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{t('profile.emergencyTitle', 'Doctor Visit & Emergency Contacts')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.emergencyName', 'Emergency Contact Name (Spouse / Family)')}</label>
                <input
                  type="text"
                  placeholder={t('profile.enterContactNamePlaceholder', 'Enter contact name')}
                  value={formData.emergencyContactName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactName: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.emergencyPhone', 'Emergency Contact Phone')}</label>
                <input
                  type="text"
                  placeholder={t('profile.enterContactPhonePlaceholder', 'Enter emergency contact phone')}
                  value={formData.emergencyContactPhone || formData.emergencyContact || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: e.target.value,
                      emergencyContactPhone: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.doctorName', 'Attending Doctor Name')}</label>
                <input
                  type="text"
                  placeholder={t('profile.enterDoctorNamePlaceholder', "Enter doctor's full name")}
                  value={formData.doctorDetails?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, name: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.doctorPhone', 'Doctor Direct Phone Number')}</label>
                <input
                  type="text"
                  placeholder={t('profile.enterDoctorPhonePlaceholder', "Enter doctor's phone number")}
                  value={formData.doctorDetails?.phone || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, phone: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.hospitalName', 'Hospital / Clinic')}</label>
                <input
                  type="text"
                  placeholder={t('profile.enterHospitalPlaceholder', 'Enter hospital or clinic name')}
                  value={formData.doctorDetails?.hospital || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, hospital: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#523D35] block mb-1">{t('profile.nextVisitDate', 'Next Doctor Visit Date')}</label>
                <input
                  type="date"
                  value={formData.nextDoctorVisit?.date || formData.doctorDetails?.nextAppointmentDate || ''}
                  onChange={(e) => {
                    const d = e.target.value;
                    setFormData({
                      ...formData,
                      doctorDetails: { ...formData.doctorDetails, nextAppointmentDate: d },
                      nextDoctorVisit: {
                        date: d,
                        time: formData.nextDoctorVisit?.time || formData.doctorDetails?.nextAppointmentTime || '10:30 AM',
                        doctorName: formData.doctorDetails?.name || '',
                        hospitalName: formData.doctorDetails?.hospital || ''
                      }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#959D90]/50 text-[#223030] font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-[#959D90]/30 sticky bottom-0 bg-[#EFEFE9] py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#523D35] hover:bg-[#E8D9CD] font-bold cursor-pointer"
            >
              {t('action.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#BBA58F]" />
              <span>{t('profile.saveCentral', 'Save & Update Central Profile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
