import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Droplets,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Heart,
  CalendarCheck,
  Phone,
  Edit3,
  User,
  Scale,
  Bell,
  BellOff,
  Hospital,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Check,
  ShieldAlert,
  Stethoscope,
  Ambulance
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLanguage, DualText } from '../services/language_service';
import { NavTabId } from './MainNavigation';
import { WeightRecord } from '../types';

interface DashboardViewProps {
  onNavigateTab?: (tab: NavTabId) => void;
  onOpenProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, onOpenProfile }) => {
  const {
    userProfile,
    updateUserProfile,
    globalLocation,
    selectedTrimester,
    selectedDay,
    getSelectedDayNutrition,
    trimesterRdaTargets,
    waterIntakeMl,
    updateWaterIntake,
    waterReminderSettings,
    updateWaterReminder,
    weightRecords,
    addWeightRecord,
    updateDoctorVisit,
    healthChecklist,
    toggleHealthChecklistItem,
    setIsProfileModalOpen,
    setIsSmartReminderModalOpen,
    setIsSosModalOpen,
    setActiveTab: contextSetActiveTab
  } = useAppContext();

  const handleNavigate = onNavigateTab || contextSetActiveTab;
  const handleEditProfile = onOpenProfile || (() => setIsProfileModalOpen(true));
  const { t } = useLanguage();

  // Modals inside Dashboard
  const [isLogWeightModalOpen, setIsLogWeightModalOpen] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState<string>(String(userProfile.currentWeightKg || 60));
  const [newWeightWeek, setNewWeightWeek] = useState<number>(userProfile.weeksPregnant || 20);

  const [isDoctorVisitModalOpen, setIsDoctorVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState<string>(
    userProfile.nextDoctorVisit?.date || userProfile.doctorDetails?.nextAppointmentDate || ''
  );
  const [visitTime, setVisitTime] = useState<string>(
    userProfile.nextDoctorVisit?.time || userProfile.doctorDetails?.nextAppointmentTime || '10:30 AM'
  );
  const [visitDoctor, setVisitDoctor] = useState<string>(
    userProfile.nextDoctorVisit?.doctorName || userProfile.doctorDetails?.name || ''
  );
  const [visitHospital, setVisitHospital] = useState<string>(
    userProfile.nextDoctorVisit?.hospitalName || userProfile.doctorDetails?.hospital || ''
  );
  const [visitReminderEnabled, setVisitReminderEnabled] = useState<boolean>(
    userProfile.nextDoctorVisit?.reminderEnabled ?? true
  );

  // Call confirmation state inside dashboard emergency section
  const [confirmCall, setConfirmCall] = useState<{
    number: string;
    title: string;
    subtitle: string;
  } | null>(null);

  // Nutrition calculations from central state
  const dayNutrition = getSelectedDayNutrition();
  const targetCalories = trimesterRdaTargets.calories;
  const targetProtein = trimesterRdaTargets.protein;
  const targetIron = trimesterRdaTargets.iron;
  const targetCalcium = trimesterRdaTargets.calcium;
  const targetFolate = trimesterRdaTargets.folate;
  const targetWaterMl = trimesterRdaTargets.waterMl || 2500;

  // Progress percentages
  const calPercent = Math.min(100, Math.round((dayNutrition.calories / targetCalories) * 100));
  const protPercent = Math.min(100, Math.round((dayNutrition.protein / targetProtein) * 100));
  const ironPercent = Math.min(100, Math.round((dayNutrition.iron / targetIron) * 100));
  const calcPercent = Math.min(100, Math.round((dayNutrition.calcium / targetCalcium) * 100));
  const folPercent = Math.min(100, Math.round((dayNutrition.folate / targetFolate) * 100));

  // Hydration stats
  const waterPercent = Math.min(100, Math.round((waterIntakeMl / targetWaterMl) * 100));
  const glassesDrunk = Math.floor(waterIntakeMl / 250);

  // Pregnancy month calculation
  const calculatedMonth = Math.min(9, Math.max(1, Math.ceil(userProfile.weeksPregnant / 4.33)));
  const pregnancyMonthDisplay = userProfile.pregnancyMonth ? `Month ${userProfile.pregnancyMonth}` : `Month ${calculatedMonth}`;

  // Weight progress calculations
  const sortedWeights = useMemo(() => {
    return [...weightRecords].sort((a, b) => b.week - a.week);
  }, [weightRecords]);

  const currentWeight = userProfile.currentWeightKg || (sortedWeights[0]?.weightKg ?? 60);
  const previousWeight = sortedWeights.length >= 2 ? sortedWeights[1].weightKg : userProfile.prePregnancyWeightKg;
  const prePregnancyWeight = userProfile.prePregnancyWeightKg || currentWeight;
  const totalWeightGain = Number((currentWeight - prePregnancyWeight).toFixed(1));

  // Doctor visit date check
  const activeDoctorVisit = userProfile.nextDoctorVisit || {
    date: userProfile.doctorDetails?.nextAppointmentDate || '',
    time: userProfile.doctorDetails?.nextAppointmentTime || '',
    doctorName: userProfile.doctorDetails?.name || '',
    hospitalName: userProfile.doctorDetails?.hospital || '',
    reminderEnabled: false
  };

  const isVisitPast = useMemo(() => {
    if (!activeDoctorVisit.date) return false;
    const vDate = new Date(activeDoctorVisit.date);
    if (isNaN(vDate.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return vDate < today;
  }, [activeDoctorVisit.date]);

  // Handle saving new weight
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 30 && val < 200) {
      const bmi = Number((val / Math.pow((userProfile.heightCm || 160) / 100, 2)).toFixed(1));
      const rec: WeightRecord = {
        week: newWeightWeek,
        weightKg: val,
        date: new Date().toISOString().split('T')[0],
        bmi: bmi,
        notes: `Week ${newWeightWeek} maternal log`
      };
      addWeightRecord(rec);
      updateUserProfile({
        currentWeightKg: val,
        weeksPregnant: newWeightWeek
      });
      setIsLogWeightModalOpen(false);
    }
  };

  // Handle saving doctor visit
  const handleSaveDoctorVisit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorVisit({
      date: visitDate,
      time: visitTime,
      doctorName: visitDoctor,
      hospitalName: visitHospital,
      reminderEnabled: visitReminderEnabled
    });
    setIsDoctorVisitModalOpen(false);
  };

  // Health checklist completion count
  const completedChecklistCount = healthChecklist.filter((c) => c.completed).length;

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner: Pregnancy Profile & Today's Health Status */}
      <div className="bg-[#223030] border border-[#523D35] rounded-3xl p-6 sm:p-7 text-[#EFEFE9] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>{pregnancyMonthDisplay} • Week {userProfile.weeksPregnant} of 40 • {selectedTrimester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#EFEFE9]">
              Namaste, {userProfile.name.split(' ')[0]} 🙏
            </h1>
            <p className="text-[#E8D9CD] text-xs sm:text-sm leading-relaxed max-w-2xl">
              Fetal development is on track at Week {userProfile.weeksPregnant}. Registered Location: <span className="text-[#BBA58F] font-bold">{globalLocation.village || globalLocation.city}, {globalLocation.district}, {globalLocation.state}</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleEditProfile}
              className="px-4 py-2.5 rounded-xl bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] border border-[#BBA58F]/40 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLogWeightModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>+ Log Weight</span>
            </button>
          </div>
        </div>

        {/* Pregnancy Due Date Progress */}
        <div className="mt-5 pt-4 border-t border-[#523D35]/70 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#E8D9CD] gap-2">
          <span>Target Delivery Date: <strong className="text-[#EFEFE9]">{userProfile.dueDate}</strong></span>
          <div className="flex items-center gap-2">
            <span>Overall Progress:</span>
            <span className="font-bold text-[#BBA58F]">{Math.min(100, Math.round((userProfile.weeksPregnant / 40) * 100))}% (Week {userProfile.weeksPregnant}/40)</span>
          </div>
        </div>
      </div>

      {/* 2. Top Two-Column Grid: Section 1 (Profile Summary) & Section 2 (Weight & Health Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ======================================================== */}
        {/* SECTION 1: PREGNANCY PROFILE SUMMARY                     */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
                  <User className="w-4 h-4 text-[#BBA58F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#223030]">
                    <DualText textKey="dashboard.pregnancyProfile" fallback="Pregnancy Profile" className="text-base font-bold text-[#223030]" miniClassName="text-[11px] text-[#523D35] font-normal" />
                  </h2>
                  <p className="text-[11px] text-[#523D35]">Central clinical demographic information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEditProfile}
                className="px-3 py-1.5 rounded-lg bg-[#E8D9CD] hover:bg-[#BBA58F]/50 text-[#223030] text-xs font-bold border border-[#959D90]/40 flex items-center gap-1 transition cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-[#523D35]" />
                <span>Edit</span>
              </button>
            </div>

            {/* Profile Fields Table / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4">
              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] uppercase font-bold text-[#523D35] tracking-wider block">Mother's Name</span>
                <span className="text-sm font-black text-[#223030] truncate block">{userProfile.name}</span>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] uppercase font-bold text-[#523D35] tracking-wider block">Pregnancy Stage</span>
                <span className="text-sm font-black text-[#223030] block">{pregnancyMonthDisplay}</span>
                <span className="text-[10px] text-[#523D35] font-semibold">{selectedTrimester}</span>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] uppercase font-bold text-[#523D35] tracking-wider block">Current Weight</span>
                <span className="text-sm font-black text-[#223030] block">{currentWeight} kg</span>
                <span className="text-[10px] text-[#523D35]">Pre-preg: {userProfile.prePregnancyWeightKg} kg</span>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] uppercase font-bold text-[#523D35] tracking-wider block">Height &amp; BMI</span>
                <span className="text-sm font-black text-[#223030] block">{userProfile.heightCm} cm</span>
                <span className="text-[10px] text-[#523D35] font-semibold">
                  BMI: {(currentWeight / Math.pow(userProfile.heightCm / 100, 2)).toFixed(1)}
                </span>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30 col-span-2">
                <span className="text-[10px] uppercase font-bold text-[#523D35] tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#523D35]" />
                  <span>Location</span>
                </span>
                <span className="text-xs font-bold text-[#223030] block truncate">
                  {globalLocation.village || globalLocation.townOrVillage || globalLocation.city}, {globalLocation.district}, {globalLocation.state}
                </span>
                <span className="text-[10px] text-[#523D35]">Region: {globalLocation.region || 'South India'}</span>
              </div>
            </div>

            {/* Allergies Highlight */}
            <div className="mt-3 p-3 bg-[#E8D9CD]/70 rounded-2xl border border-[#959D90]/30 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#523D35] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#223030]">Allergies &amp; Dietary Restrictions: </span>
                <span className="text-[#523D35]">
                  {userProfile.allergies && userProfile.allergies.length > 0
                    ? userProfile.allergies.join(', ')
                    : 'None reported (Standard pregnancy diet)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#523D35] flex items-center justify-between border-t border-[#959D90]/20">
            <span>Primary Obstetrician: <strong>{userProfile.doctorDetails?.name || 'Not provided'}</strong></span>
            <span>Blood Group: <strong className="text-[#223030]">{userProfile.bloodGroup || 'O+'}</strong></span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: WEIGHT & HEALTH PROGRESS                      */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
                  <Scale className="w-4 h-4 text-[#BBA58F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#223030]">
                    <DualText textKey="dashboard.weightProgress" fallback="Weight & Health Progress" className="text-base font-bold text-[#223030]" miniClassName="text-[11px] text-[#523D35] font-normal" />
                  </h2>
                  <p className="text-[11px] text-[#523D35]">IOM maternal gestational weight tracking</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogWeightModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3 h-3 text-[#BBA58F]" />
                <span>+ Log Weight</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] font-bold text-[#523D35] uppercase">Current Weight</span>
                <div className="text-xl font-black text-[#223030]">{currentWeight} <span className="text-xs font-normal">kg</span></div>
                <span className="text-[10px] text-[#523D35]">Week {userProfile.weeksPregnant}</span>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] font-bold text-[#523D35] uppercase">Previous Weight</span>
                <div className="text-xl font-black text-[#223030]">{previousWeight} <span className="text-xs font-normal">kg</span></div>
                <span className="text-[10px] text-[#523D35]">Recorded visit</span>
              </div>

              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                <span className="text-[10px] font-bold text-[#523D35] uppercase">Total Gain</span>
                <div className="text-xl font-black text-[#223030]">+{totalWeightGain} <span className="text-xs font-normal">kg</span></div>
                <span className="text-[10px] text-[#523D35]">Since conception</span>
              </div>
            </div>

            {/* Simple Status Message */}
            <div className="mt-4 p-3.5 bg-[#E8D9CD]/80 rounded-2xl border border-[#959D90]/40 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#223030]">Progress Status: </span>
                <span className="text-[#523D35]">
                  +{totalWeightGain} kg healthy gain — within recommended ICMR &amp; IOM maternal range for {selectedTrimester}.
                </span>
              </div>
            </div>

            {/* Recent Recorded History Entries */}
            <div className="mt-3.5 space-y-1.5">
              <span className="text-[10px] font-bold text-[#523D35] uppercase tracking-wider block">Recent Weight Records</span>
              <div className="grid grid-cols-3 gap-2">
                {sortedWeights.slice(0, 3).map((w, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-xl border border-[#959D90]/30 text-xs flex flex-col">
                    <span className="font-bold text-[#223030]">{w.weightKg} kg</span>
                    <span className="text-[10px] text-[#523D35]">Week {w.week} • {w.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="button"
              onClick={() => handleNavigate('clinical-report')}
              className="text-xs font-bold text-[#523D35] hover:text-[#223030] inline-flex items-center gap-1 transition"
            >
              <span>View full clinical report &amp; charts</span>
              <ChevronRight className="w-3 h-3 text-[#BBA58F]" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 7: NUTRITION TARGET SUMMARY                      */}
      {/* ======================================================== */}
      <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#959D90]/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#223030]">Nutrition Target Today ({selectedDay})</h2>
              <p className="text-[11px] text-[#523D35]">Summary calculated from connected Meal Planner vs. ICMR-NIN RDA for {selectedTrimester}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleNavigate('meal-planner')}
            className="px-3.5 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>Open Meal Planner</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BBA58F]" />
          </button>
        </div>

        {/* 5 Core Nutrient Summary Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Calories */}
          <div className="bg-[#E8D9CD] rounded-2xl p-3.5 border border-[#959D90]/30 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#223030]">Calories</span>
              <span className="text-[10px] font-semibold text-[#523D35]">{calPercent}%</span>
            </div>
            <div className="text-lg font-black text-[#223030]">
              {dayNutrition.calories} <span className="text-xs font-normal text-[#523D35]">/ {targetCalories} kcal</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div className="h-full bg-[#523D35] rounded-full transition-all duration-500" style={{ width: `${calPercent}%` }} />
            </div>
            <span className="text-[10px] text-[#523D35] block">{Math.max(0, targetCalories - dayNutrition.calories)} kcal left today</span>
          </div>

          {/* Protein */}
          <div className="bg-[#E8D9CD] rounded-2xl p-3.5 border border-[#959D90]/30 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#223030]">Protein</span>
              <span className="text-[10px] font-semibold text-[#523D35]">{protPercent}%</span>
            </div>
            <div className="text-lg font-black text-[#223030]">
              {dayNutrition.protein}g <span className="text-xs font-normal text-[#523D35]">/ {targetProtein}g</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div className="h-full bg-[#523D35] rounded-full transition-all duration-500" style={{ width: `${protPercent}%` }} />
            </div>
            <span className="text-[10px] text-[#523D35] block">{Math.max(0, Number((targetProtein - dayNutrition.protein).toFixed(1)))}g left today</span>
          </div>

          {/* Iron */}
          <div className="bg-[#E8D9CD] rounded-2xl p-3.5 border border-[#959D90]/30 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#223030]">Iron (Fe)</span>
              <span className="text-[10px] font-semibold text-[#523D35]">{ironPercent}%</span>
            </div>
            <div className="text-lg font-black text-[#223030]">
              {dayNutrition.iron}mg <span className="text-xs font-normal text-[#523D35]">/ {targetIron}mg</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div className="h-full bg-[#523D35] rounded-full transition-all duration-500" style={{ width: `${ironPercent}%` }} />
            </div>
            <span className="text-[10px] text-[#523D35] block">{Math.max(0, Number((targetIron - dayNutrition.iron).toFixed(1)))}mg left today</span>
          </div>

          {/* Calcium */}
          <div className="bg-[#E8D9CD] rounded-2xl p-3.5 border border-[#959D90]/30 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#223030]">Calcium (Ca)</span>
              <span className="text-[10px] font-semibold text-[#523D35]">{calcPercent}%</span>
            </div>
            <div className="text-lg font-black text-[#223030]">
              {dayNutrition.calcium}mg <span className="text-xs font-normal text-[#523D35]">/ {targetCalcium}mg</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div className="h-full bg-[#523D35] rounded-full transition-all duration-500" style={{ width: `${calcPercent}%` }} />
            </div>
            <span className="text-[10px] text-[#523D35] block">{Math.max(0, targetCalcium - dayNutrition.calcium)}mg left today</span>
          </div>

          {/* Folate */}
          <div className="bg-[#E8D9CD] rounded-2xl p-3.5 border border-[#959D90]/30 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#223030]">Folate (B9)</span>
              <span className="text-[10px] font-semibold text-[#523D35]">{folPercent}%</span>
            </div>
            <div className="text-lg font-black text-[#223030]">
              {dayNutrition.folate}µg <span className="text-xs font-normal text-[#523D35]">/ {targetFolate}µg</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div className="h-full bg-[#523D35] rounded-full transition-all duration-500" style={{ width: `${folPercent}%` }} />
            </div>
            <span className="text-[10px] text-[#523D35] block">{Math.max(0, targetFolate - dayNutrition.folate)}µg left today</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#523D35] pt-2 border-t border-[#959D90]/20 gap-2">
          <span>Detailed recipes and complete food safety insights remain organized in the Food Database and Recipe modules.</span>
          <button
            type="button"
            onClick={() => handleNavigate('food-database')}
            className="text-xs font-bold text-[#223030] hover:text-[#523D35] inline-flex items-center gap-1 transition"
          >
            <span>Explore Food Database</span>
            <ChevronRight className="w-3 h-3 text-[#BBA58F]" />
          </button>
        </div>
      </div>

      {/* 3. Middle Two-Column Grid: Section 3 & 4 (Water Intake & Reminder) and Section 5 (Next Doctor Visit) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">

        {/* ======================================================== */}
        {/* SECTIONS 3 & 4: WATER INTAKE & WATER INTAKE REMINDER     */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
                  <Droplets className="w-4 h-4 text-[#BBA58F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#223030]">
                    <DualText textKey="dashboard.waterIntake" fallback="Today's Water Intake" className="text-base font-bold text-[#223030]" miniClassName="text-[11px] text-[#523D35] font-normal" />
                  </h2>
                  <p className="text-[11px] text-[#523D35]">Amniotic fluid maintenance &amp; maternal hydration</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-[#223030]">{waterIntakeMl} ml</div>
                <span className="text-[10px] text-[#523D35]">Goal: {targetWaterMl} ml</span>
              </div>
            </div>

            {/* Water Progress Bar */}
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-xs text-[#523D35]">
                <span>Progress ({glassesDrunk} Glasses Drunk)</span>
                <span className="font-bold text-[#223030]">{waterPercent}% Achieved</span>
              </div>
              <div className="h-3 w-full bg-[#E8D9CD] rounded-full overflow-hidden p-0.5 border border-[#959D90]/30">
                <div
                  className="h-full bg-[#523D35] rounded-full transition-all duration-500"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>

            {/* One-Click Add Water Buttons */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold text-[#523D35] block">Quick Add Water (Persists Immediately)</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateWaterIntake(waterIntakeMl + 250)}
                  className="py-2.5 px-3 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                  <span>+ 250 ml (Glass)</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateWaterIntake(waterIntakeMl + 500)}
                  className="py-2.5 px-3 rounded-xl bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                  <span>+ 500 ml (Bottle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateWaterIntake(Math.max(0, waterIntakeMl - 250))}
                  className="py-2.5 px-3 rounded-xl bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] font-bold text-xs flex items-center justify-center gap-1 transition border border-[#959D90]/40 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>- 250 ml</span>
                </button>
              </div>
            </div>

            {/* SECTION 4: WATER REMINDER SCHEDULE */}
            <div className="mt-5 pt-4 border-t border-[#959D90]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {waterReminderSettings.enabled ? (
                    <Bell className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <BellOff className="w-4 h-4 text-[#959D90]" />
                  )}
                  <span className="text-xs font-bold text-[#223030]">
                    <DualText textKey="water.reminders" fallback="Water Intake Reminder" className="text-xs font-bold text-[#223030]" miniClassName="text-[10px] text-[#523D35] font-normal" />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateWaterReminder({ enabled: !waterReminderSettings.enabled })}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    waterReminderSettings.enabled
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#959D90] text-[#223030]'
                  }`}
                >
                  {waterReminderSettings.enabled ? 'Reminder ON' : 'Reminder OFF'}
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#523D35]">Frequency:</span>
                {[
                  { label: 'Every 1 Hour', mins: 60 },
                  { label: 'Every 2 Hours', mins: 120 },
                  { label: 'Every 3 Hours', mins: 180 },
                  { label: 'Custom (45m)', mins: 45 }
                ].map((sch) => (
                  <button
                    key={sch.mins}
                    type="button"
                    onClick={() => updateWaterReminder({ intervalMinutes: sch.mins, enabled: true })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      waterReminderSettings.intervalMinutes === sch.mins && waterReminderSettings.enabled
                        ? 'bg-[#223030] text-[#EFEFE9] border border-[#BBA58F]/50 shadow-xs'
                        : 'bg-[#E8D9CD] text-[#223030] hover:bg-[#BBA58F]/40 border border-[#959D90]/30'
                    }`}
                  >
                    {sch.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#523D35] italic">
            Saved permanently in your central profile. Values do not reset when switching pages.
          </p>
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: NEXT DOCTOR VISIT                             */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4 text-[#BBA58F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#223030]">
                    <DualText textKey="dashboard.doctorVisit" fallback="Next Doctor Visit" className="text-base font-bold text-[#223030]" miniClassName="text-[11px] text-[#523D35] font-normal" />
                  </h2>
                  <p className="text-[11px] text-[#523D35]">Prenatal checkup schedule &amp; clinic details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDoctorVisitModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3 h-3 text-[#BBA58F]" />
                <span>{activeDoctorVisit.date ? 'Update Visit' : '+ Add Visit'}</span>
              </button>
            </div>

            {/* Visit Details Card */}
            <div className="pt-4 space-y-3">
              {activeDoctorVisit.date ? (
                <>
                  <div className="p-4 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/40 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-black text-[#223030]">
                        <CalendarCheck className="w-4 h-4 text-[#523D35]" />
                        <span>{activeDoctorVisit.date}</span>
                      </div>
                      {activeDoctorVisit.time && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#523D35]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{activeDoctorVisit.time}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-[10px] font-bold">
                        Antenatal Checkup
                      </span>
                    </div>
                  </div>

                  {/* Past Date Alert */}
                  {isVisitPast && (
                    <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Appointment date has passed: </span>
                        <span>Please update your next scheduled antenatal checkup with your obstetrician.</span>
                      </div>
                    </div>
                  )}

                  {/* Doctor & Hospital Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#959D90]/30 space-y-0.5">
                      <span className="text-[10px] font-bold text-[#523D35] uppercase">Doctor Name</span>
                      <div className="font-bold text-[#223030]">{activeDoctorVisit.doctorName || 'Not provided'}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#959D90]/30 space-y-0.5">
                      <span className="text-[10px] font-bold text-[#523D35] uppercase">Hospital / PHC</span>
                      <div className="font-bold text-[#223030]">{activeDoctorVisit.hospitalName || 'Not provided'}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-[#959D90]/40 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8D9CD] text-[#523D35] flex items-center justify-center mx-auto">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#223030]">No upcoming doctor visit scheduled</div>
                    <p className="text-xs text-[#523D35] mt-1 max-w-sm mx-auto">
                      Schedule your regular antenatal checkup (ANC) with your obstetrician or local Primary Health Centre (PHC).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDoctorVisitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs font-bold transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Antenatal Visit</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#523D35] border-t border-[#959D90]/20 flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Reminder: <strong>{activeDoctorVisit.reminderEnabled ? '24h Notice Active' : 'Disabled'}</strong></span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSmartReminderModalOpen(true)}
                className="text-xs font-bold text-[#523D35] hover:text-[#223030] hover:underline cursor-pointer flex items-center gap-1"
                title="Configure smart reminder preferences"
              >
                <Bell className="w-3 h-3 text-[#523D35]" />
                <span>Smart Reminders</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsDoctorVisitModalOpen(true)}
                className="text-xs font-bold text-[#223030] hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Two-Column Grid: Section 6 (Emergency Numbers) and Section 8 (Health Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">

        {/* ======================================================== */}
        {/* SECTION 6: SOS / EMERGENCY                               */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#959D90]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#223030] flex items-center gap-1.5">
                    <span>SOS / Emergency</span>
                  </h2>
                  <p className="text-[11px] text-[#523D35]">
                    Verified Official Emergency Helplines (24x7)
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="dashboard-open-sos-button"
                onClick={() => setIsSosModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition cursor-pointer border border-red-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-0.5"></span>
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Open SOS Modal</span>
              </button>
            </div>

            {/* Emergency Contacts & Helplines List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              {/* 112 - National Emergency Number (Primary) */}
              <div className="p-3 bg-white rounded-xl border-2 border-red-500/80 shadow-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white uppercase">
                      Primary
                    </span>
                    <span className="text-[10px] font-bold text-[#523D35]">24x7 Toll-Free</span>
                  </div>
                  <div className="text-sm font-black text-red-600 mt-0.5">
                    Emergency Number: 112
                  </div>
                  <div className="text-[11px] font-semibold text-[#523D35]">
                    India Emergency Response Support System
                  </div>
                </div>
                <button
                  type="button"
                  id="dashboard-call-112-btn"
                  onClick={() =>
                    setConfirmCall({
                      number: '112',
                      title: 'Emergency Number: 112',
                      subtitle: 'India Emergency Response Support System'
                    })
                  }
                  className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Call 112</span>
                </button>
              </div>

              {/* 108 - Emergency Ambulance */}
              <div className="p-3 bg-white rounded-xl border border-[#959D90]/50 shadow-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                      <Ambulance className="w-3.5 h-3.5" />
                      <span>Ambulance</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#523D35]">24x7 Free</span>
                  </div>
                  <div className="text-sm font-black text-[#223030] mt-0.5">
                    Ambulance: 108
                  </div>
                  <div className="text-[11px] font-semibold text-[#523D35]">
                    Emergency Ambulance Service
                  </div>
                </div>
                <button
                  type="button"
                  id="dashboard-call-108-btn"
                  onClick={() =>
                    setConfirmCall({
                      number: '108',
                      title: 'Ambulance: 108',
                      subtitle: 'Emergency Ambulance Service'
                    })
                  }
                  className="w-full py-1.5 px-3 bg-[#223030] hover:bg-[#523D35] text-white font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Call 108</span>
                </button>
              </div>

              {/* 102 - Patient Transport Service */}
              <div className="p-3 bg-white rounded-xl border border-[#959D90]/50 shadow-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#523D35] uppercase flex items-center gap-1">
                      <Hospital className="w-3.5 h-3.5" />
                      <span>Patient Transport</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#523D35]">JSSK Fleet</span>
                  </div>
                  <div className="text-sm font-black text-[#223030] mt-0.5">
                    Transport: 102
                  </div>
                  <div className="text-[11px] font-semibold text-[#523D35]">
                    Ambulance / Patient Transport Service
                  </div>
                </div>
                <button
                  type="button"
                  id="dashboard-call-102-btn"
                  onClick={() =>
                    setConfirmCall({
                      number: '102',
                      title: 'Patient Transport: 102',
                      subtitle: 'Ambulance / Patient Transport Service (Availability may vary by state)'
                    })
                  }
                  className="w-full py-1.5 px-3 bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Call 102</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#523D35] gap-2 pt-1 border-t border-[#959D90]/30">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Location: {globalLocation.village || globalLocation.townOrVillage || globalLocation.city}, {globalLocation.district ? `${globalLocation.district}, ` : ''}{globalLocation.state}</span>
            </span>
            <span>Emergency numbers trigger the device dialer with user confirmation.</span>
          </div>
        </div>

        {/* Call Confirmation Dialog */}
        {confirmCall && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white rounded-2xl p-5 border-2 border-red-600 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#223030]">Confirm Call</h3>
                <p className="text-sm font-black text-red-600">
                  {confirmCall.title} ({confirmCall.number})
                </p>
                <p className="text-xs text-[#523D35]">{confirmCall.subtitle}</p>
                <p className="text-[11px] text-[#959D90] pt-1">
                  This will open your phone dialer to place the call. Do you want to proceed?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmCall(null)}
                  className="py-2.5 px-3 rounded-xl border border-[#959D90] text-[#223030] text-xs font-bold hover:bg-[#EFEFE9] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const num = confirmCall.number.replace(/[^0-9+]/g, '');
                    setConfirmCall(null);
                    window.location.href = `tel:${num}`;
                  }}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition cursor-pointer"
                >
                  Dial Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 8: HEALTH CHECKLIST                              */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#BBA58F]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#223030]">
                    <DualText textKey="dashboard.checklist" fallback="Daily Health Checklist" className="text-base font-bold text-[#223030]" miniClassName="text-[11px] text-[#523D35] font-normal" />
                  </h2>
                  <p className="text-[11px] text-[#523D35]">Routine maternal prenatal wellness tasks</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#223030] bg-[#E8D9CD] px-2.5 py-1 rounded-full border border-[#959D90]/30">
                {completedChecklistCount} of {healthChecklist.length} Done
              </span>
            </div>

            {/* Checklist Items */}
            <div className="pt-3.5 space-y-2">
              {healthChecklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleHealthChecklistItem(item.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                    item.completed
                      ? 'bg-[#E8D9CD]/80 border-[#959D90]/40 text-[#223030]'
                      : 'bg-white border-[#959D90]/30 text-[#523D35] hover:bg-[#E8D9CD]/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        item.completed ? 'bg-emerald-700 text-white' : 'border border-[#959D90] bg-white'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs font-medium ${item.completed ? 'line-through text-[#523D35]' : 'text-[#223030]'}`}>
                      {item.text}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold ${item.completed ? 'text-emerald-800' : 'text-[#959D90]'}`}>
                    {item.completed ? 'Done' : 'Pending'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs text-[#523D35] flex items-center justify-between border-t border-[#959D90]/20">
            <span>Consistent daily routine ensures optimal fetal growth.</span>
            <span className="font-bold text-[#223030]">
              {Math.round((completedChecklistCount / Math.max(1, healthChecklist.length)) * 100)}% Completed
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: LOG WEIGHT POPUP                                */}
      {/* ======================================================== */}
      {isLogWeightModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#223030] border border-[#523D35] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left text-[#EFEFE9] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#523D35] pb-3">
              <h3 className="text-base font-bold text-[#EFEFE9] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#BBA58F]" />
                <span>Log Current Weight</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLogWeightModalOpen(false)}
                className="text-[#E8D9CD] hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="180"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#523D35] border border-[#BBA58F]/40 text-[#EFEFE9] font-bold text-sm focus:outline-hidden focus:ring-1 focus:ring-[#BBA58F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                  Pregnancy Week
                </label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={newWeightWeek}
                  onChange={(e) => setNewWeightWeek(parseInt(e.target.value) || userProfile.weeksPregnant)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#523D35] border border-[#BBA58F]/40 text-[#EFEFE9] font-bold text-sm focus:outline-hidden focus:ring-1 focus:ring-[#BBA58F]"
                />
              </div>

              <div className="text-[11px] text-[#E8D9CD]/80 bg-[#523D35]/50 p-2.5 rounded-xl border border-[#523D35]">
                Previous recorded weight: <strong className="text-[#EFEFE9]">{previousWeight} kg</strong>. Regular weekly weigh-ins before breakfast give the most accurate maternal trajectory.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogWeightModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E8D9CD] hover:bg-[#523D35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-bold shadow transition cursor-pointer"
                >
                  Save Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD / EDIT NEXT DOCTOR VISIT                    */}
      {/* ======================================================== */}
      {isDoctorVisitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#223030] border border-[#523D35] rounded-3xl p-6 max-w-md w-full shadow-2xl text-left text-[#EFEFE9] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#523D35] pb-3">
              <h3 className="text-base font-bold text-[#EFEFE9] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#BBA58F]" />
                <span>Update Next Doctor Visit</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDoctorVisitModalOpen(false)}
                className="text-[#E8D9CD] hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoctorVisit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#523D35] border border-[#BBA58F]/40 text-[#EFEFE9] font-bold text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                    Visit Time
                  </label>
                  <input
                    type="text"
                    value={visitTime}
                    placeholder="e.g. 10:30 AM"
                    onChange={(e) => setVisitTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#523D35] border border-[#BBA58F]/40 text-[#EFEFE9] font-bold text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                  Doctor Name (Optional)
                </label>
                <input
                  type="text"
                  value={visitDoctor}
                  placeholder="Enter doctor or clinic name"
                  onChange={(e) => setVisitDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#523D35] border border-[#BBA58F]/40 text-[#EFEFE9] font-semibold text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                  Hospital / Health Centre (Optional)
                </label>
                <input
                  type="text"
                  value={visitHospital}
                  placeholder="e.g. District Maternity Hospital"
                  onChange={(e) => setVisitHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#523D35] border border-[#BBA58F]/40 text-[#EFEFE9] font-semibold text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="reminderCheck"
                  checked={visitReminderEnabled}
                  onChange={(e) => setVisitReminderEnabled(e.target.checked)}
                  className="rounded border-[#BBA58F] text-[#523D35]"
                />
                <label htmlFor="reminderCheck" className="text-xs text-[#E8D9CD]">
                  Enable 24-hour reminder before visit
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorVisitModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E8D9CD] hover:bg-[#523D35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-bold shadow transition cursor-pointer"
                >
                  Save Doctor Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
