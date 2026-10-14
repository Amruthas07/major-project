import React, { useState, useMemo } from 'react';
import {
  Flame,
  Droplets,
  Calendar,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  Edit3,
  Scale,
  Bell,
  Volume2,
  VolumeX,
  Phone,
  Utensils,
  Camera,
  Bot,
  FileBarChart2,
  ChevronRight,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Database
} from 'lucide-react';
import { useAppContext, MealCategory } from '../context/AppContext';
import { useLanguage, DualText, DualFoodName, FoodSubtitle } from '../services/language_service';
import {
  getLocalHour,
  getTimeGreetingKey,
  formatLocalizedWeekday,
  formatLocalizedDate,
  getIndiaDate
} from '../utils/date_utils';
import { NavTabId } from './MainNavigation';
import { WeightRecord, KaggleFoodItem } from '../types';
import { normalizeDietPreference } from '../utils/diet_preference';
import { checkFoodAllergies } from '../utils/allergy_checker';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from '../services/kaggle_food_pipeline';
import { VerifiedFoodImage } from './VerifiedFoodImage';

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
    triggerTestWaterReminder,
    weightRecords,
    addWeightRecord,
    updateDoctorVisit,
    toggleMealCompleted,
    openAddToPlanModal,
    setIsProfileModalOpen,
    setIsSosModalOpen,
    setActiveTab: contextSetActiveTab
  } = useAppContext();

  const handleNavigate = onNavigateTab || contextSetActiveTab;
  const handleEditProfile = onOpenProfile || (() => setIsProfileModalOpen(true));
  const { t, currentLanguageCode } = useLanguage();

  // Modals state
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

  // Time-based polite greeting in selected language
  const greeting = useMemo(() => {
    const hour = getLocalHour();
    const key = getTimeGreetingKey(hour);
    const fallback = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return t(key, fallback);
  }, [t, currentLanguageCode]);

  // Today's nutrition totals from actual planned/logged meals
  const dayNutrition = getSelectedDayNutrition();
  const targetCalories = trimesterRdaTargets.calories;
  const targetProtein = trimesterRdaTargets.protein;
  const targetCarbs = trimesterRdaTargets.carbs;
  const targetFiber = trimesterRdaTargets.fiber;
  const targetIron = trimesterRdaTargets.iron;
  const targetCalcium = trimesterRdaTargets.calcium;
  const targetWaterMl = trimesterRdaTargets.waterMl || 2500;

  // Percentage calculations
  const calPercent = Math.min(100, Math.round((dayNutrition.calories / targetCalories) * 100));
  const protPercent = Math.min(100, Math.round((dayNutrition.protein / targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((dayNutrition.carbs / targetCarbs) * 100));
  const fiberPercent = Math.min(100, Math.round((dayNutrition.fiber / targetFiber) * 100));
  const ironPercent = Math.min(100, Math.round((dayNutrition.iron / targetIron) * 100));
  const calcPercent = Math.min(100, Math.round((dayNutrition.calcium / targetCalcium) * 100));

  // Hydration metrics
  const waterPercent = Math.min(100, Math.round((waterIntakeMl / targetWaterMl) * 100));
  const glassesDrunk = Math.floor(waterIntakeMl / 250);
  const waterLitersDrunk = (waterIntakeMl / 1000).toFixed(1);
  const waterLitersTarget = (targetWaterMl / 1000).toFixed(1);

  // Grouped meals for Today's Meals section
  const breakfastMeals = dayNutrition.mealsByCategory['Breakfast'] || [];
  const lunchMeals = dayNutrition.mealsByCategory['Lunch'] || [];
  const dinnerMeals = dayNutrition.mealsByCategory['Dinner'] || [];
  const snackMeals = [
    ...(dayNutrition.mealsByCategory['Mid-Morning Snack'] || []),
    ...(dayNutrition.mealsByCategory['Evening Snack'] || [])
  ];

  // Curated food recommendations based on profile (location + diet + trimester + allergy check)
  const recommendedFoods = useMemo<KaggleFoodItem[]>(() => {
    const isVeg = normalizeDietPreference(userProfile.dietPreference) === 'vegetarian';
    const userAllergies = userProfile.allergies || [];
    const userState = (globalLocation.state || userProfile.state || 'Karnataka').toLowerCase();
    const userRegion = (globalLocation.region || 'South India').toLowerCase();

    return KAGGLE_PROCESSED_FOOD_DATABASE.filter((item) => {
      // 1. Must be safe for pregnancy
      if (item.safetyLevel !== 'Safe') return false;

      // 2. Strict diet preference match
      if (isVeg && !item.isVegetarian) return false;

      // 3. Exclude any foods containing user allergens
      if (userAllergies.length > 0) {
        const { hasAllergy } = checkFoodAllergies(item, userAllergies);
        if (hasAllergy) return false;
      }

      return true;
    })
      .sort((a, b) => {
        // Prioritize dishes matching the user's home state or region
        const aStateMatch = a.state && a.state.toLowerCase() === userState ? 2 : 0;
        const bStateMatch = b.state && b.state.toLowerCase() === userState ? 2 : 0;
        const aRegionMatch = a.region && a.region.toLowerCase() === userRegion ? 1 : 0;
        const bRegionMatch = b.region && b.region.toLowerCase() === userRegion ? 1 : 0;
        return bStateMatch + bRegionMatch - (aStateMatch + aRegionMatch);
      })
      .slice(0, 4);
  }, [userProfile.dietPreference, userProfile.allergies, globalLocation.state, globalLocation.region]);

  // Doctor visit details
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* 1. WELCOME HEADER (Simple, Clean, Non-Cluttered)         */}
      {/* ======================================================== */}
      <div className="bg-[#223030] border border-[#523D35] rounded-3xl p-6 sm:p-7 text-[#EFEFE9] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-semibold border border-[#BBA58F]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#BBA58F]" />
            <span>
              {t('common.week', 'Week')} {userProfile.weeksPregnant} • {t(selectedTrimester === '1st Trimester' ? 'trimester.1st' : selectedTrimester === '2nd Trimester' ? 'trimester.2nd' : 'trimester.3rd', selectedTrimester)} • {formatLocalizedWeekday(selectedDay, currentLanguageCode, false)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#EFEFE9]">
            {greeting}, {userProfile.name ? userProfile.name.split(' ')[0] : 'Mother'} 🙏
          </h1>

          <p className="text-sm text-[#E8D9CD] max-w-xl">
            {t('dashboard.welcomeSubtitle', 'Here is your nutrition summary for today. Track meals, stay hydrated, and reach your maternal wellness goals.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleEditProfile}
            className="px-4 py-2 rounded-xl bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] border border-[#BBA58F]/40 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#BBA58F]" />
            <span>{t('header.editProfile', 'Edit Profile')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLogWeightModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#E8D9CD] hover:bg-[#BBA58F] text-[#223030] text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-[#523D35]" />
            <span>{t('dashboard.logWeight', '+ Log Weight')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSosModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs border border-red-500"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>{t('sos.title', 'Emergency SOS')}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. QUICK ACTIONS (Compact, Accessible)                   */}
      {/* ======================================================== */}
      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#523D35] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
            <span>{t('dashboard.quickActions', 'Quick Actions')}</span>
          </h2>
          <span className="text-[11px] text-[#523D35] font-medium">{t('dashboard.instantShortcuts', 'Instant shortcuts')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Action 1: Add Meal */}
          <button
            type="button"
            onClick={() => handleNavigate('meal-planner')}
            className="p-3 bg-white hover:bg-[#E8D9CD] border border-[#959D90]/40 rounded-xl flex items-center gap-2.5 transition text-left cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#523D35] text-[#EFEFE9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#223030] block truncate">{t('meal.addMeal', 'Add Meal')}</span>
              <span className="text-[10px] text-[#523D35] block truncate">{t('nav.mealPlanner', 'Meal Planner')}</span>
            </div>
          </button>

          {/* Action 2: Scan Food */}
          <button
            type="button"
            onClick={() => handleNavigate('food-scanner')}
            className="p-3 bg-white hover:bg-[#E8D9CD] border border-[#959D90]/40 rounded-xl flex items-center gap-2.5 transition text-left cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#223030] text-[#EFEFE9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#223030] block truncate">{t('nav.foodScanner', 'Food Scanner')}</span>
              <span className="text-[10px] text-[#523D35] block truncate">Camera / Photo</span>
            </div>
          </button>

          {/* Action 3: Add Water */}
          <button
            type="button"
            onClick={() => updateWaterIntake(waterIntakeMl + 250)}
            className="p-3 bg-white hover:bg-[#E8D9CD] border border-[#959D90]/40 rounded-xl flex items-center gap-2.5 transition text-left cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#223030] block truncate">+250 ml {t('nutrient.water', 'Water')}</span>
              <span className="text-[10px] text-[#523D35] block truncate">{t('dashboard.logGlass', 'Log 1 Glass')}</span>
            </div>
          </button>

          {/* Action 4: AI Assistant */}
          <button
            type="button"
            onClick={() => handleNavigate('ask-ai')}
            className="p-3 bg-white hover:bg-[#E8D9CD] border border-[#959D90]/40 rounded-xl flex items-center gap-2.5 transition text-left cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#523D35] text-[#EFEFE9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#223030] block truncate">{t('ai.assistant', 'AI Assistant')}</span>
              <span className="text-[10px] text-[#523D35] block truncate">{t('nav.askAi', 'Ask Nutrition AI')}</span>
            </div>
          </button>

          {/* Action 5: Reports */}
          <button
            type="button"
            onClick={() => handleNavigate('reports')}
            className="p-3 bg-white hover:bg-[#E8D9CD] border border-[#959D90]/40 rounded-xl flex items-center gap-2.5 transition text-left cursor-pointer group shadow-2xs col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#223030] text-[#EFEFE9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileBarChart2 className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#223030] block truncate">{t('nav.reports', 'Reports')}</span>
              <span className="text-[10px] text-[#523D35] block truncate">{t('reports.weeklyMonthly', 'Weekly & Monthly')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TODAY'S NUTRITION (Simple, Accurate Cards)            */}
      {/* ======================================================== */}
      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#959D90]/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#223030]">
                {t('dashboard.todaysNutrition', "Today's Nutrition")} ({formatLocalizedWeekday(selectedDay, currentLanguageCode, false)})
              </h2>
              <p className="text-[11px] text-[#523D35]">
                {t('planner.calculatedStrictly', 'Calculated from meals planned for')} {formatLocalizedWeekday(selectedDay, currentLanguageCode, false)} vs. ICMR {t(selectedTrimester === '1st Trimester' ? 'trimester.1st' : selectedTrimester === '2nd Trimester' ? 'trimester.2nd' : 'trimester.3rd', selectedTrimester)} RDA
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('meal-planner')}
            className="px-3.5 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>{t('dashboard.openPlanner', 'Open Meal Planner')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BBA58F]" />
          </button>
        </div>

        {/* 4 Core Requested Nutrient Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Calories */}
          <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#223030]">{t('nutrient.calories', 'Calories')}</span>
              <span className="text-[11px] font-bold text-[#523D35]">{calPercent}%</span>
            </div>
            <div className="text-xl font-black text-[#223030]">
              {dayNutrition.calories}{' '}
              <span className="text-xs font-normal text-[#523D35]">/ {targetCalories} kcal</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#523D35] rounded-full transition-all duration-500"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#523D35] block font-medium">
              {Math.max(0, targetCalories - dayNutrition.calories)} kcal {t('dashboard.remainingToday', 'remaining today')}
            </span>
          </div>

          {/* 2. Protein */}
          <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#223030]">{t('nutrient.protein', 'Protein')}</span>
              <span className="text-[11px] font-bold text-[#523D35]">{protPercent}%</span>
            </div>
            <div className="text-xl font-black text-[#223030]">
              {dayNutrition.protein}g{' '}
              <span className="text-xs font-normal text-[#523D35]">/ {targetProtein}g</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#523D35] rounded-full transition-all duration-500"
                style={{ width: `${protPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#523D35] block font-medium">
              {Math.max(0, Number((targetProtein - dayNutrition.protein).toFixed(1)))}g {t('dashboard.remainingToday', 'remaining today')}
            </span>
          </div>

          {/* 3. Carbohydrates */}
          <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#223030]">{t('nutrient.carbs', 'Carbohydrates')}</span>
              <span className="text-[11px] font-bold text-[#523D35]">{carbsPercent}%</span>
            </div>
            <div className="text-xl font-black text-[#223030]">
              {dayNutrition.carbs}g{' '}
              <span className="text-xs font-normal text-[#523D35]">/ {targetCarbs}g</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#523D35] rounded-full transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#523D35] block font-medium">
              {Math.max(0, Number((targetCarbs - dayNutrition.carbs).toFixed(1)))}g {t('dashboard.remainingToday', 'remaining today')}
            </span>
          </div>

          {/* 4. Dietary Fibre */}
          <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#223030]">{t('nutrient.fiber', 'Dietary Fibre')}</span>
              <span className="text-[11px] font-bold text-[#523D35]">{fiberPercent}%</span>
            </div>
            <div className="text-xl font-black text-[#223030]">
              {dayNutrition.fiber}g{' '}
              <span className="text-xs font-normal text-[#523D35]">/ {targetFiber}g</span>
            </div>
            <div className="h-2 w-full bg-[#EFEFE9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#523D35] rounded-full transition-all duration-500"
                style={{ width: `${fiberPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#523D35] block font-medium">
              {Math.max(0, Number((targetFiber - dayNutrition.fiber).toFixed(1)))}g {t('dashboard.remainingToday', 'remaining today')}
            </span>
          </div>
        </div>

        {/* Secondary Micronutrients Strip (Iron & Calcium) */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#959D90]/30 flex items-center justify-between">
            <span className="font-semibold text-[#523D35]">{t('nutrient.iron', 'Iron')} (Fe):</span>
            <span className="font-bold text-[#223030]">
              {dayNutrition.iron} mg / {targetIron} mg ({ironPercent}%)
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#959D90]/30 flex items-center justify-between">
            <span className="font-semibold text-[#523D35]">{t('nutrient.calcium', 'Calcium')} (Ca):</span>
            <span className="font-bold text-[#223030]">
              {dayNutrition.calcium} mg / {targetCalcium} mg ({calcPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TWO-COLUMN: TODAY'S WATER & APPOINTMENT REMINDER      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* TODAY'S WATER                                            */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                <Droplets className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#223030]">{t('dashboard.waterIntake', "Today's Water Intake")}</h2>
                <p className="text-[11px] text-[#523D35]">{t('dashboard.amnioticFluid', 'Amniotic fluid & maternal hydration')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-[#223030]">
                {waterLitersDrunk} L / {waterLitersTarget} L
              </div>
              <span className="text-[10px] text-[#523D35] font-semibold">{waterIntakeMl} ml {t('dashboard.logged', 'logged')}</span>
            </div>
          </div>

          {/* Water Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#523D35]">
              <span>{t('dashboard.progress', 'Progress')}: {glassesDrunk} {t('dashboard.glassesDrunk', 'Glasses Drunk')}</span>
              <span className="font-bold text-[#223030]">{waterPercent}% {t('dashboard.achieved', 'Achieved')}</span>
            </div>
            <div className="h-3 w-full bg-[#E8D9CD] rounded-full overflow-hidden p-0.5 border border-[#959D90]/30">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Add Water Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateWaterIntake(waterIntakeMl + 250)}
                className="py-2.5 px-3 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>+ 250 ml ({t('dashboard.glass', 'Glass')})</span>
              </button>

              <button
                type="button"
                onClick={() => updateWaterIntake(waterIntakeMl + 500)}
                className="py-2.5 px-3 rounded-xl bg-[#523D35] hover:bg-[#523D35]/80 text-[#EFEFE9] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>+ 500 ml ({t('dashboard.bottle', 'Bottle')})</span>
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

          {/* Compact Reminder Settings */}
          <div className="pt-3 border-t border-[#959D90]/30 flex items-center justify-between text-xs gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateWaterReminder({ enabled: !waterReminderSettings.enabled })}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  waterReminderSettings.enabled ? 'bg-emerald-800 text-white' : 'bg-[#959D90] text-[#223030]'
                }`}
              >
                {waterReminderSettings.enabled ? (
                  <>
                    <Bell className="w-3 h-3" />
                    <span>{t('reminder.on', 'Reminder ON')}</span>
                  </>
                ) : (
                  <span>{t('reminder.off', 'Reminder OFF')}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateWaterReminder({ soundEnabled: !waterReminderSettings.soundEnabled })}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-[#959D90]/40 text-[#223030] hover:bg-[#E8D9CD] transition cursor-pointer flex items-center gap-1"
              >
                {waterReminderSettings.soundEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3 text-emerald-700" />
                    <span>{t('reminder.soundOn', 'Sound ON')}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3 text-[#959D90]" />
                    <span>{t('reminder.soundOff', 'Sound OFF')}</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                await triggerTestWaterReminder();
              }}
              className="text-[11px] font-bold text-[#523D35] hover:text-[#223030] hover:underline cursor-pointer"
            >
              {t('reminder.testAlert', 'Test Alert')}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COMPACT APPOINTMENT & VITALS SUMMARY                     */}
        {/* ======================================================== */}
        <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4 text-[#BBA58F]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#223030]">{t('dashboard.ancCheckup', 'Antenatal Checkup')}</h2>
                <p className="text-[11px] text-[#523D35]">{t('dashboard.ancDesc', 'Routine doctor visits & maternal schedule')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDoctorVisitModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3 h-3 text-[#BBA58F]" />
              <span>{activeDoctorVisit.date ? t('action.update', 'Update') : `+ ${t('action.add', 'Add')}`}</span>
            </button>
          </div>

          {activeDoctorVisit.date ? (
            <div className="p-4 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-black text-[#223030]">
                  <Calendar className="w-4 h-4 text-[#523D35]" />
                  <span>{activeDoctorVisit.date}</span>
                  {activeDoctorVisit.time && (
                    <span className="text-xs font-semibold text-[#523D35]">• {activeDoctorVisit.time}</span>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#523D35] text-[#E8D9CD] text-[10px] font-bold">
                  ANC Checkup
                </span>
              </div>

              {(activeDoctorVisit.doctorName || activeDoctorVisit.hospitalName) && (
                <div className="text-xs text-[#523D35] pt-1">
                  {activeDoctorVisit.doctorName && <span className="font-bold text-[#223030]">{activeDoctorVisit.doctorName} </span>}
                  {activeDoctorVisit.hospitalName && <span>({activeDoctorVisit.hospitalName})</span>}
                </div>
              )}

              {isVisitPast && (
                <div className="pt-1 flex items-center gap-1 text-[11px] text-amber-900 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Date has passed. Please schedule your next checkup.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-[#959D90]/30 text-center space-y-2">
              <p className="text-xs text-[#523D35]">No upcoming prenatal checkup currently scheduled.</p>
              <button
                type="button"
                onClick={() => setIsDoctorVisitModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#E8D9CD] text-xs font-bold transition cursor-pointer"
              >
                + Schedule Antenatal Checkup
              </button>
            </div>
          )}

          {/* Compact Vitals Link */}
          <div className="pt-2 border-t border-[#959D90]/30 flex items-center justify-between text-xs text-[#523D35]">
            <span>
              Weight: <strong className="text-[#223030]">{userProfile.currentWeightKg || 60} kg</strong> (Week {userProfile.weeksPregnant})
            </span>
            <button
              type="button"
              onClick={() => handleNavigate('clinical-report')}
              className="font-bold text-[#223030] hover:text-[#523D35] inline-flex items-center gap-1 transition"
            >
              <span>View Full Clinical Report</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#BBA58F]" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. TODAY'S MEALS (Breakfast, Lunch, Dinner, Snacks)      */}
      {/* ======================================================== */}
      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#959D90]/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#523D35] text-[#EFEFE9] flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4 text-[#BBA58F]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#223030]">{t('dashboard.todaysMeals', "Today's Meals")}</h2>
              <p className="text-[11px] text-[#523D35]">
                {dayNutrition.completedMealCount} {t('planner.of', 'of')} {dayNutrition.totalMealCount} {t('dashboard.completedToday', 'meals completed today')} ({formatLocalizedWeekday(selectedDay, currentLanguageCode, false)})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('meal-planner')}
            className="px-3.5 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span>{t('nav.mealPlanner', 'Meal Planner')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BBA58F]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Breakfast */}
          <div className="bg-white rounded-2xl p-4 border border-[#959D90]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#959D90]/20">
                <span className="text-xs font-black text-[#223030]">{t('meal.breakfastSimple', 'Breakfast')}</span>
                <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                  {breakfastMeals.length} {t('meal.itemsPlanned', 'items')}
                </span>
              </div>

              <div className="pt-2.5 space-y-2">
                {breakfastMeals.length > 0 ? (
                  breakfastMeals.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-[#EFEFE9] border border-[#959D90]/30 flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMealCompleted(m.id)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                            m.isCompleted ? 'bg-emerald-700 text-white' : 'border border-[#959D90] bg-white'
                          }`}
                        >
                          {m.isCompleted && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <DualFoodName
                            foodName={m.name}
                            className={`text-xs font-bold block truncate ${
                              m.isCompleted ? 'line-through text-[#959D90]' : 'text-[#223030]'
                            }`}
                          />
                          <span className="text-[10px] text-[#523D35] block truncate">
                            {m.portion} • {m.calories} kcal
                          </span>
                        </div>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#523D35] italic py-2">{t('meal.noItemsPlanned', 'No meals recorded yet.')}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddToPlanModal(null, selectedDay, 'Breakfast')}
              className="w-full py-1.5 px-3 rounded-lg bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('meal.addMeal', 'Add Meal')}</span>
            </button>
          </div>

          {/* Lunch */}
          <div className="bg-white rounded-2xl p-4 border border-[#959D90]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#959D90]/20">
                <span className="text-xs font-black text-[#223030]">{t('meal.lunchSimple', 'Lunch')}</span>
                <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                  {lunchMeals.length} {t('meal.itemsPlanned', 'items')}
                </span>
              </div>

              <div className="pt-2.5 space-y-2">
                {lunchMeals.length > 0 ? (
                  lunchMeals.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-[#EFEFE9] border border-[#959D90]/30 flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMealCompleted(m.id)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                            m.isCompleted ? 'bg-emerald-700 text-white' : 'border border-[#959D90] bg-white'
                          }`}
                        >
                          {m.isCompleted && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <DualFoodName
                            foodName={m.name}
                            className={`text-xs font-bold block truncate ${
                              m.isCompleted ? 'line-through text-[#959D90]' : 'text-[#223030]'
                            }`}
                          />
                          <span className="text-[10px] text-[#523D35] block truncate">
                            {m.portion} • {m.calories} kcal
                          </span>
                        </div>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#523D35] italic py-2">{t('meal.noItemsPlanned', 'No meals recorded yet.')}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddToPlanModal(null, selectedDay, 'Lunch')}
              className="w-full py-1.5 px-3 rounded-lg bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('meal.addMeal', 'Add Meal')}</span>
            </button>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-2xl p-4 border border-[#959D90]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#959D90]/20">
                <span className="text-xs font-black text-[#223030]">{t('meal.dinnerSimple', 'Dinner')}</span>
                <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                  {dinnerMeals.length} {t('meal.itemsPlanned', 'items')}
                </span>
              </div>

              <div className="pt-2.5 space-y-2">
                {dinnerMeals.length > 0 ? (
                  dinnerMeals.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-[#EFEFE9] border border-[#959D90]/30 flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMealCompleted(m.id)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                            m.isCompleted ? 'bg-emerald-700 text-white' : 'border border-[#959D90] bg-white'
                          }`}
                        >
                          {m.isCompleted && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <DualFoodName
                            foodName={m.name}
                            className={`text-xs font-bold block truncate ${
                              m.isCompleted ? 'line-through text-[#959D90]' : 'text-[#223030]'
                            }`}
                          />
                          <span className="text-[10px] text-[#523D35] block truncate">
                            {m.portion} • {m.calories} kcal
                          </span>
                        </div>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#523D35] italic py-2">{t('meal.noItemsPlanned', 'No meals recorded yet.')}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddToPlanModal(null, selectedDay, 'Dinner')}
              className="w-full py-1.5 px-3 rounded-lg bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('meal.addMeal', 'Add Meal')}</span>
            </button>
          </div>

          {/* Snacks */}
          <div className="bg-white rounded-2xl p-4 border border-[#959D90]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#959D90]/20">
                <span className="text-xs font-black text-[#223030]">{t('meal.eveningSnackSimple', 'Snacks')}</span>
                <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                  {snackMeals.length} {t('meal.itemsPlanned', 'items')}
                </span>
              </div>

              <div className="pt-2.5 space-y-2">
                {snackMeals.length > 0 ? (
                  snackMeals.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-[#EFEFE9] border border-[#959D90]/30 flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMealCompleted(m.id)}
                        className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition ${
                            m.isCompleted ? 'bg-emerald-700 text-white' : 'border border-[#959D90] bg-white'
                          }`}
                        >
                          {m.isCompleted && <Check className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <DualFoodName
                            foodName={m.name}
                            className={`text-xs font-bold block truncate ${
                              m.isCompleted ? 'line-through text-[#959D90]' : 'text-[#223030]'
                            }`}
                          />
                          <span className="text-[10px] text-[#523D35] block truncate">
                            {m.portion} • {m.calories} kcal
                          </span>
                        </div>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#523D35] italic py-2">{t('meal.noItemsPlanned', 'No meals recorded yet.')}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAddToPlanModal(null, selectedDay, 'Evening Snack')}
              className="w-full py-1.5 px-3 rounded-lg bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('meal.addMeal', 'Add Meal')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. RECOMMENDED FOR YOU (Personalized, Clean, Max 4)     */}
      {/* ======================================================== */}
      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#959D90]/30">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#523D35]" />
              <h2 className="text-base font-bold text-[#223030]">{t('dashboard.recommendedForYou', 'Recommended For You')}</h2>
            </div>
            <p className="text-[11px] text-[#523D35] mt-0.5">
              {t('dashboard.personalizedFoods', 'Personalized based on your profile:')} {userProfile.dietPreference} • {globalLocation.state || userProfile.state || 'Karnataka'} {t('dashboard.regionalFoods', 'regional foods')} • {selectedTrimester}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('food-database')}
            className="px-3.5 py-1.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <Database className="w-3.5 h-3.5 text-[#BBA58F]" />
            <span>{t('dashboard.viewFoodDatabase', 'View Food Database')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BBA58F]" />
          </button>
        </div>

        {/* 4 Recommended Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl border border-[#959D90]/30 overflow-hidden flex flex-col justify-between shadow-2xs hover:border-[#523D35] transition"
            >
              {/* Image & Safety Tag */}
              <div className="relative aspect-video w-full bg-[#E8D9CD]">
                <VerifiedFoodImage
                  src={food.image}
                  alt={food.name}
                  dishName={food.name}
                  isVegetarian={food.isVegetarian}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t('filter.safe', 'Safe')}</span>
                </span>
                {food.isVegetarian ? (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/95 text-emerald-800 text-[10px] font-bold shadow-xs">
                    🥬 {t('diet.vegetarian', 'Veg')}
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/95 text-amber-900 text-[10px] font-bold shadow-xs">
                    🍗 {t('diet.nonVegetarian', 'Non-Veg')}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#223030] leading-snug line-clamp-1">
                    <DualFoodName foodName={food.name} className="font-black text-[#223030]" />
                  </h3>
                  <div className="text-[10px] text-[#523D35] line-clamp-1">
                    <FoodSubtitle foodName={food.name} regionalName={food.regionalName} />
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#959D90]/20 text-[11px] font-semibold text-[#523D35]">
                    <span>{food.calories} kcal</span>
                    <span>•</span>
                    <span>{food.protein}g {t('nutrient.protein', 'Protein')}</span>
                    <span>•</span>
                    <span>{food.iron}mg {t('nutrient.iron', 'Iron')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openAddToPlanModal(food, selectedDay, 'Lunch')}
                  className="w-full py-1.5 px-3 rounded-xl bg-[#E8D9CD] hover:bg-[#523D35] hover:text-white text-[#223030] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ {t('recipe.addToMealPlan', 'Add to Meal Plan')}</span>
                </button>
              </div>
            </div>
          ))}
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
                <span>{t('dashboard.logWeight', 'Log Current Weight')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLogWeightModalOpen(false)}
                className="text-[#E8D9CD] hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                  {t('profile.currentWeight', 'Current Weight (kg)')}
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
                  {t('profile.pregnancyWeek', 'Pregnancy Week')}
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

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogWeightModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E8D9CD] hover:bg-[#523D35] cursor-pointer"
                >
                  {t('action.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-bold shadow transition cursor-pointer"
                >
                  {t('action.saveWeight', 'Save Weight')}
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
                <span>{t('dashboard.updateCheckup', 'Update Antenatal Checkup')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDoctorVisitModalOpen(false)}
                className="text-[#E8D9CD] hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoctorVisit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#E8D9CD] mb-1">
                    {t('reminder.visitDate', 'Visit Date')}
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
                    {t('reminder.visitTime', 'Visit Time')}
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
                  {t('reminder.doctorName', 'Doctor Name')} ({t('common.optional', 'Optional')})
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
                  {t('reminder.hospitalName', 'Hospital / Health Centre')} ({t('common.optional', 'Optional')})
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
                  {t('reminder.enable24h', 'Enable 24-hour reminder before visit')}
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorVisitModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E8D9CD] hover:bg-[#523D35] cursor-pointer"
                >
                  {t('action.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] text-xs font-bold shadow transition cursor-pointer"
                >
                  {t('action.saveCheckup', 'Save Checkup')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
