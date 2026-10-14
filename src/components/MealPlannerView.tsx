import React, { useState } from 'react';
import {
  useAppContext,
  DAYS_OF_WEEK,
  MEAL_CATEGORIES,
  MEAL_TIME_RANGES,
  DayOfWeek,
  MealCategory
} from '../context/AppContext';
import { PlannedMeal, FoodItemData, GlobalLocationState, PregnancyTrimester } from '../types';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from '../services/kaggle_food_pipeline';
import { LocationNutritionEngine } from '../services/location_nutrition_engine';
import { useLanguage, DualText, DualFoodName } from '../services/language_service';
import {
  getDateForDayOfWeekInCurrentWeek,
  formatLocalizedDate,
  formatLocalizedWeekday,
  getIndiaDate
} from '../utils/date_utils';
import {
  CalendarCheck,
  Plus,
  Trash2,
  CheckCircle2,
  CheckCircle,
  Flame,
  Check,
  Clock,
  Sparkles,
  Edit2,
  Save,
  X,
  MapPin,
  RotateCcw,
  Dumbbell,
  HeartPulse,
  Info,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ChefHat,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { getRecipeForFood } from '../services/recipe_service';
import { RegionalRecipe } from '../types/recipe';
import { RegionalRecipeDetailModal } from './RegionalRecipeDetailModal';
import { WeeklyNutritionSummaryView } from './WeeklyNutritionSummaryView';
import { checkFoodAllergies } from '../utils/allergy_checker';
import { normalizeDietPreference, isFoodEligibleForDiet, validateFoodAdditionForDiet } from '../utils/diet_preference';

export const MealPlannerView: React.FC = () => {
  const {
    meals,
    selectedDay,
    setSelectedDay,
    selectedTrimester,
    setSelectedTrimester,
    globalLocation,
    userProfile,
    addFoodToPlan,
    removeMeal,
    updateMealServings,
    toggleMealCompleted,
    clearDayMeals,
    regenerateLocationMealPlan,
    getSelectedDayNutrition,
    trimesterRdaTargets,
    openAddToPlanModal
  } = useAppContext();

  const { t, currentLanguageCode } = useLanguage();

  // Sub-view toggle: Daily Meal Schedule vs 7-Day Weekly Summary
  const [activePlannerView, setActivePlannerView] = useState<'daily' | 'weekly-summary'>('daily');

  // Modal State for adding custom food
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCategory, setCustomCategory] = useState<MealCategory>('Breakfast');
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<RegionalRecipe | null>(null);
  const [selectedKaggleId, setSelectedKaggleId] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [portion, setPortion] = useState('1 Serving');
  const [calories, setCalories] = useState(250);
  const [protein, setProtein] = useState(10);
  const [iron, setIron] = useState(3.5);
  const [calcium, setCalcium] = useState(150);
  const [folate, setFolate] = useState(60);

  // Selected Day Nutrition
  const dayNutrition = getSelectedDayNutrition();

  const userDietPref = normalizeDietPreference(userProfile.dietPreference);

  // Clinical recommendations for active trimester & location
  const trimesterPlanInfo = LocationNutritionEngine.getTrimesterMealRecommendations(
    selectedTrimester,
    globalLocation,
    userDietPref
  );

  // Eligible foods for Quick Pick based on user diet preference
  const eligibleKaggleFoods = React.useMemo(() => {
    return KAGGLE_PROCESSED_FOOD_DATABASE.filter((f) =>
      isFoodEligibleForDiet(f, userDietPref)
    );
  }, [userDietPref]);

  // Percentage calculations against RDA
  const calPercent = Math.min(100, Math.round((dayNutrition.calories / trimesterRdaTargets.calories) * 100));
  const protPercent = Math.min(100, Math.round((dayNutrition.protein / trimesterRdaTargets.protein) * 100));
  const ironPercent = Math.min(100, Math.round((dayNutrition.iron / trimesterRdaTargets.iron) * 100));
  const calcPercent = Math.min(100, Math.round((dayNutrition.calcium / trimesterRdaTargets.calcium) * 100));
  const folPercent = Math.min(100, Math.round((dayNutrition.folate / trimesterRdaTargets.folate) * 100));

  // Category title translation helper
  const getCategoryTitle = (cat: MealCategory | string) => {
    switch (cat) {
      case 'Breakfast':
        return t('meal.breakfastSimple', 'Breakfast');
      case 'Mid-Morning':
      case 'Mid-Morning Snack':
        return t('meal.midMorningSimple', 'Mid-Morning Snack');
      case 'Lunch':
        return t('meal.lunchSimple', 'Lunch');
      case 'Evening Snack':
        return t('meal.eveningSnackSimple', 'Evening Snack');
      case 'Dinner':
        return t('meal.dinnerSimple', 'Dinner');
      default:
        return cat;
    }
  };

  // Trimester title translation helper
  const getTrimesterTitle = (trim: PregnancyTrimester) => {
    if (trim === '1st Trimester') return t('trimester.1st', '1st Trimester');
    if (trim === '2nd Trimester') return t('trimester.2nd', '2nd Trimester');
    return t('trimester.3rd', '3rd Trimester');
  };

  // Handle selecting from dropdown in custom modal
  const handleDropdownSelect = (foodId: string) => {
    setSelectedKaggleId(foodId);
    const item = KAGGLE_PROCESSED_FOOD_DATABASE.find((f) => f.id === foodId);
    if (item) {
      setCustomName(item.name);
      setCalories(item.calories);
      setProtein(item.protein);
      setIron(item.iron);
      setCalcium(item.calcium);
      setFolate(item.folate);
      setPortion(item.servingSize || '1 Serving (~150g)');
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    // Strict Diet Preference Validation
    const dietCheck = validateFoodAdditionForDiet(
      customName.trim(),
      userDietPref
    );
    if (!dietCheck.allowed) {
      alert(
        `⚠️ DIET PREFERENCE NOTICE:\n\n${dietCheck.reason}\n\nYour profile is set to Vegetarian. Please select a vegetarian food or switch your diet preference in your Profile.`
      );
      return;
    }

    addFoodToPlan({
      food: {
        id: selectedKaggleId || undefined,
        name: customName.trim(),
        calories,
        protein,
        iron,
        calcium,
        folate,
        servingSize: portion
      },
      day: selectedDay,
      category: customCategory,
      servings: 1
    });

    setShowCustomModal(false);
    setSelectedKaggleId('');
    setCustomName('');
    setCalories(250);
    setProtein(10);
    setIron(3.5);
    setCalcium(150);
    setFolate(60);
    setPortion('1 Serving');
  };

  const todayIndiaDay = getIndiaDate().dayOfWeek;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Controls, Trimester Switcher & View Mode Toggle */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90]/50 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>{t('planner.title', 'Personalized Maternal Meal Planner')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2 flex-wrap">
              <span>🗓️ {activePlannerView === 'weekly-summary' ? t('planner.weeklyTitle', '7-Day Maternal Nutrition Summary & Compliance') : t('planner.schedule', 'Maternal Meal Schedule')}</span>
              <span className="text-sm font-bold text-[#523D35] bg-[#EFEFE9] border border-[#959D90]/40 px-3 py-1 rounded-full">
                📍 {globalLocation.village || globalLocation.city}, {globalLocation.state}
              </span>
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-3xl leading-relaxed">
              {t('planner.desc', 'Plan and log all 5 daily pregnancy meal intervals to guarantee optimal micro and macronutrient distribution without maternal blood sugar spikes.')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <button
              type="button"
              onClick={() => setActivePlannerView(activePlannerView === 'weekly-summary' ? 'daily' : 'weekly-summary')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                activePlannerView === 'weekly-summary'
                  ? 'bg-[#523D35] text-[#EFEFE9] border-[#523D35]'
                  : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] border-[#959D90]/50'
              }`}
              title="Toggle between Daily Meal Schedule and 7-Day Comprehensive Summary"
            >
              <BarChart3 className="w-4 h-4 text-[#BBA58F]" />
              <span>{activePlannerView === 'weekly-summary' ? t('planner.viewDaily', 'View Daily Planner') : `📊 ${t('planner.viewSummary', '7-Day Nutrition Summary')}`}</span>
            </button>

            <button
              type="button"
              onClick={() => regenerateLocationMealPlan()}
              className="px-3.5 py-2.5 rounded-xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] text-xs font-bold border border-[#959D90]/50 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              title={`Regenerate authentic meal plan for ${globalLocation.state} (${selectedTrimester})`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{t('planner.autoPlan', 'Auto-Plan for')} {globalLocation.state}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCustomCategory('Breakfast');
                setShowCustomModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#BBA58F]" />
              <span>{t('planner.addFood', '+ Add Food Item')}</span>
            </button>
          </div>
        </div>

        {/* Trimester Selector Tabs */}
        <div className="pt-2 border-t border-[#959D90]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#523D35] uppercase">{t('planner.trimesterFocus', 'Trimester Focus:')}</span>
            {(['1st Trimester', '2nd Trimester', '3rd Trimester'] as PregnancyTrimester[]).map((tVal) => (
              <button
                key={tVal}
                type="button"
                onClick={() => setSelectedTrimester(tVal)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedTrimester === tVal
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#BBA58F]/40'
                }`}
              >
                {getTrimesterTitle(tVal)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#523D35] uppercase">{t('planner.diet', 'Diet:')}</span>
            {userDietPref === 'vegetarian' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-800 text-white text-xs font-black shadow-xs">
                <span>{t('planner.pureVeg', '🥬 Pure Vegetarian')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-900 text-white text-xs font-black shadow-xs">
                <span>{t('planner.nonVeg', '🍗 Vegetarian & Non-Veg')}</span>
              </span>
            )}
          </div>

          <div className="text-xs font-semibold text-[#223030] bg-[#EFEFE9] px-3 py-1.5 rounded-xl border border-[#959D90]/40">
            {t('planner.rdaTargets', 'ICMR RDA Targets:')} <span className="font-extrabold">{trimesterRdaTargets.calories} kcal</span> • <span className="font-extrabold">{trimesterRdaTargets.protein}g {t('nutrient.protein', 'Protein')}</span> • <span className="font-extrabold">{trimesterRdaTargets.iron}mg {t('nutrient.iron', 'Iron')}</span>
          </div>
        </div>

        {/* 7-Day Selector Pills with Live Counts AND Real Current Week Calendar Dates */}
        <div className="pt-2 border-t border-[#959D90]/30">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              const count = meals.filter((m) => m.day === day).length;
              const dateStr = getDateForDayOfWeekInCurrentWeek(day);
              const formattedWeekday = formatLocalizedWeekday(day, currentLanguageCode, true);
              const formattedDate = formatLocalizedDate(dateStr, currentLanguageCode, { short: true });
              const isToday = todayIndiaDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-md ring-2 ring-[#523D35]/50'
                      : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/20 text-[#523D35] border border-[#959D90]/50'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-extrabold flex items-center gap-1">
                      <span>{formattedWeekday}</span>
                      {isToday && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-black tracking-wide">
                          {t('common.today', 'Today')}
                        </span>
                      )}
                    </span>
                    <span className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-[#BBA58F]' : 'text-[#959D90]'}`}>
                      {formattedDate}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black ml-1 ${
                      isSelected
                        ? 'bg-[#523D35] text-[#EFEFE9]'
                        : count > 0
                        ? 'bg-[#BBA58F] text-[#223030] font-extrabold'
                        : 'bg-[#E8D9CD] text-[#959D90]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activePlannerView === 'weekly-summary' ? (
        <WeeklyNutritionSummaryView onBack={() => setActivePlannerView('daily')} />
      ) : (
        <>
          {/* 2. Live Nutrition Summary for the Selected Day */}
      <div className="bg-[#223030] rounded-3xl p-6 sm:p-8 text-[#EFEFE9] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#959D90]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#523D35] text-[#BBA58F] flex items-center justify-center font-black">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#EFEFE9]">
                {formatLocalizedWeekday(selectedDay, currentLanguageCode, false)} {t('planner.nutritionSummaryFor', 'Nutrition Summary')} ({dayNutrition.totalMealCount} {t('planner.mealsPlanned', 'Meals Planned')})
              </h2>
              <p className="text-xs text-[#959D90]">
                {t('planner.calculatedStrictly', 'Calculated strictly from meals planned for')} <span className="text-[#BBA58F] font-bold">{formatLocalizedWeekday(selectedDay, currentLanguageCode, false)}</span> vs. ICMR {getTrimesterTitle(selectedTrimester)} RDA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActivePlannerView('weekly-summary')}
              className="text-xs px-3 py-1 rounded-full bg-[#523D35] hover:bg-[#BBA58F] text-[#E8D9CD] hover:text-[#223030] border border-[#BBA58F]/30 font-extrabold transition cursor-pointer flex items-center gap-1.5"
              title="Open full 7-day maternal nutrition summary & consistency report"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t('planner.sevenDayTrends', '7-Day Trends')}</span>
            </button>
            {dayNutrition.totalMealCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`${t('planner.clearDayMeals', 'Clear')} ${dayNutrition.totalMealCount} (${formatLocalizedWeekday(selectedDay, currentLanguageCode, false)})?`)) {
                    clearDayMeals(selectedDay);
                  }
                }}
                className="text-[11px] font-bold text-[#BBA58F] hover:text-[#E8D9CD] hover:underline px-2 py-1 cursor-pointer"
              >
                {t('planner.clearDayMeals', 'Clear Day Meals')}
              </button>
            )}
            <span className="text-xs px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 font-extrabold">
              {dayNutrition.completedMealCount} {t('planner.of', 'of')} {dayNutrition.totalMealCount} {t('planner.eaten', 'Eaten')}
            </span>
          </div>
        </div>

        {/* 5 Core Nutrient Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Energy */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">{t('nutrient.calories', 'Calories')}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#E8D9CD]">{dayNutrition.calories}</span>
              <span className="text-xs text-[#959D90]">/ {trimesterRdaTargets.calories} kcal</span>
            </div>
            <div className="w-full bg-[#959D90]/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#BBA58F] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#959D90] block">{calPercent}% {t('planner.rdaPercent', 'of RDA')}</span>
          </div>

          {/* Protein */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">{t('nutrient.protein', 'Protein')}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#E8D9CD]">{dayNutrition.protein}</span>
              <span className="text-xs text-[#959D90]">/ {trimesterRdaTargets.protein}g</span>
            </div>
            <div className="w-full bg-[#959D90]/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#BBA58F] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${protPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#959D90] block">{protPercent}% {t('planner.rdaPercent', 'of RDA')}</span>
          </div>

          {/* Iron */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">{t('nutrient.iron', 'Iron')}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#E8D9CD]">{dayNutrition.iron}</span>
              <span className="text-xs text-[#959D90]">/ {trimesterRdaTargets.iron}mg</span>
            </div>
            <div className="w-full bg-[#959D90]/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#BBA58F] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${ironPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#959D90] block">{ironPercent}% {t('planner.rdaPercent', 'of RDA')}</span>
          </div>

          {/* Calcium */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">{t('nutrient.calcium', 'Calcium')}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#E8D9CD]">{dayNutrition.calcium}</span>
              <span className="text-xs text-[#959D90]">/ {trimesterRdaTargets.calcium}mg</span>
            </div>
            <div className="w-full bg-[#959D90]/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#BBA58F] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${calcPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#959D90] block">{calcPercent}% {t('planner.rdaPercent', 'of RDA')}</span>
          </div>

          {/* Folate */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">{t('nutrient.folate', 'Folate (B9)')}</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#E8D9CD]">{dayNutrition.folate}</span>
              <span className="text-xs text-[#959D90]">/ {trimesterRdaTargets.folate}µg</span>
            </div>
            <div className="w-full bg-[#959D90]/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#BBA58F] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${folPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#959D90] block">{folPercent}% {t('planner.rdaPercent', 'of RDA')}</span>
          </div>
        </div>

        {/* Clinical Guidance Banner */}
        <div className="bg-[#523D35]/60 rounded-2xl p-4 border border-[#959D90]/40 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-[#BBA58F] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#EFEFE9] block mb-0.5">
              {getTrimesterTitle(selectedTrimester)} {t('planner.maternalFocus', 'Maternal Focus')} ({globalLocation.state}):
            </span>
            <p className="text-[#E8D9CD] leading-relaxed">
              {trimesterPlanInfo.clinicalFocus} Prioritizing authentic {globalLocation.state} dishes like {trimesterPlanInfo.recommendedDishes.slice(0, 3).map(d => d.name.split('(')[0]).join(', ')}.
            </p>
          </div>
        </div>
      </div>

      {/* 3. The 5 Maternal Meal Interval Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2">
            <span>{t('planner.fiveIntervalsFor', '5 Maternal Meal Intervals for')} </span>
            <span className="text-[#523D35]">{formatLocalizedWeekday(selectedDay, currentLanguageCode, false)}</span>
          </h2>
          <span className="text-xs font-semibold text-[#523D35]">
            {t('planner.fiveIntervalsTarget', 'Target: 5 timed meals to stabilize glycemic & fetal nutrient supply')}
          </span>
        </div>

        <div className="space-y-5">
          {MEAL_CATEGORIES.map((category) => {
            const timeInfo = MEAL_TIME_RANGES[category];
            const slotMeals = dayNutrition.mealsByCategory[category] || [];

            const slotCalories = slotMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
            const slotProtein = Number(slotMeals.reduce((sum, m) => sum + (m.protein || 0), 0).toFixed(1));
            const slotIron = Number(slotMeals.reduce((sum, m) => sum + (m.iron || 0), 0).toFixed(1));
            const slotCalcium = Math.round(slotMeals.reduce((sum, m) => sum + (m.calcium || 0), 0));

            return (
              <div
                key={category}
                className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-7 border border-[#959D90]/60 shadow-xs space-y-4 transition hover:border-[#523D35]"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#959D90]/30 pb-3.5">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl p-2 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/40 shadow-xs">
                      {timeInfo.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-[#223030] tracking-tight">
                          {getCategoryTitle(category)}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFEFE9] text-[#523D35] font-bold">
                          {timeInfo.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#523D35] mt-0.5">
                        {slotMeals.length === 0 ? t('meal.noItemsPlanned', 'No items planned yet') : `${slotMeals.length} ${t('meal.itemsPlanned', 'items planned')}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Slot Nutrients Badge */}
                    {slotMeals.length > 0 && (
                      <div className="flex items-center space-x-2 text-xs bg-[#EFEFE9] px-3 py-1.5 rounded-xl border border-[#959D90]/40">
                        <span className="font-extrabold text-[#223030]">{slotCalories} kcal</span>
                        <span className="text-[#959D90]">•</span>
                        <span className="font-bold text-[#523D35]">{slotProtein}g P</span>
                        <span className="text-[#959D90]">•</span>
                        <span className="font-bold text-[#523D35]">{slotIron}mg Fe</span>
                        <span className="text-[#959D90]">•</span>
                        <span className="font-bold text-[#523D35]">{slotCalcium}mg Ca</span>
                      </div>
                    )}

                    {/* Add Item to this Category */}
                    <button
                      type="button"
                      onClick={() => {
                        setCustomCategory(category);
                        setShowCustomModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] text-xs font-bold border border-[#959D90]/50 flex items-center gap-1 transition shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#523D35]" />
                      <span>{t('meal.addMeal', 'Add Meal')} ({getCategoryTitle(category)})</span>
                    </button>
                  </div>
                </div>

                {/* Meals List */}
                {slotMeals.length > 0 ? (
                  <div className="space-y-3">
                    {slotMeals.map((meal) => {
                      return (
                        <div
                          key={meal.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            meal.isCompleted
                              ? 'bg-[#EFEFE9]/80 border-[#523D35]/60 text-[#523D35]'
                              : 'bg-[#EFEFE9] border-[#959D90]/50 hover:border-[#523D35] text-[#223030]'
                          }`}
                        >
                          {/* Left: Checkbox + Dual Food Name + Portion */}
                          <div className="flex items-start space-x-3.5">
                            <button
                              type="button"
                              onClick={() => toggleMealCompleted(meal.id)}
                              className={`mt-1 w-6 h-6 rounded-xl flex items-center justify-center border transition cursor-pointer ${
                                meal.isCompleted
                                  ? 'bg-[#223030] border-[#223030] text-[#EFEFE9] shadow-xs'
                                  : 'border-[#959D90] bg-[#E8D9CD] hover:border-[#523D35]'
                              }`}
                              title={meal.isCompleted ? t('meal.markNotConsumed', 'Mark as not eaten') : t('meal.markConsumed', 'Mark as eaten')}
                            >
                              {meal.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>

                            <div>
                              <DualFoodName
                                foodName={meal.name}
                                regionalName={meal.regionalName}
                                className={`text-sm font-extrabold tracking-tight ${
                                  meal.isCompleted ? 'line-through text-[#523D35]' : 'text-[#223030]'
                                }`}
                                miniClassName="text-xs font-semibold text-[#523D35] mt-0.5"
                              />
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-[#523D35] font-medium">
                                  {t('planner.portion', 'Portion')}: {meal.portion}
                                </span>
                                {meal.isCompleted && (
                                  <span className="text-[10px] font-extrabold text-[#E8D9CD] bg-[#523D35] px-2 py-0.5 rounded-md">
                                    {t('planner.consumed', '✓ Consumed')}
                                  </span>
                                )}
                                {(() => {
                                  const matchedRecipe = getRecipeForFood(meal.foodId || meal.name);
                                  if (!matchedRecipe) return null;
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedRecipeDetail(matchedRecipe)}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#523D35] hover:text-[#223030] bg-[#E8D9CD] hover:bg-[#BBA58F]/40 px-2 py-0.5 rounded-lg border border-[#959D90]/40 transition cursor-pointer"
                                      title="View complete recipe and preparation guidance"
                                    >
                                      <ChefHat className="w-3 h-3 text-[#523D35]" />
                                      <span>{t('planner.viewRecipe', 'View Recipe')}</span>
                                    </button>
                                  );
                                })()}
                              </div>

                              {/* Planned Meal Allergy Conflict Warning */}
                              {(() => {
                                const allergyCheck = checkFoodAllergies(
                                  { name: meal.name, regionalName: meal.name },
                                  userProfile.allergies
                                );
                                if (!allergyCheck.hasAllergy) return null;
                                return (
                                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-100 text-red-950 border border-red-300 text-[11px] font-extrabold">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                    <span>{t('planner.allergyAlert', '⚠️ Allergy Alert: Contains')} {allergyCheck.matchedAllergens.join(', ')}</span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Right: Servings adjuster + Nutrients + Delete */}
                          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-[#959D90]/30">
                            {/* Quantity Servings Counter */}
                            <div className="inline-flex items-center border border-[#959D90]/60 bg-[#E8D9CD] rounded-xl overflow-hidden shadow-xs text-xs">
                              <button
                                type="button"
                                onClick={() => updateMealServings(meal.id, (meal.servings || 1) - 1)}
                                className="px-2.5 py-1 text-[#523D35] hover:bg-[#BBA58F]/30 font-bold cursor-pointer"
                                title="Decrease servings"
                              >
                                -
                              </button>
                              <span className="px-2 font-black text-[#223030] min-w-[28px] text-center">
                                {meal.servings || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateMealServings(meal.id, (meal.servings || 1) + 1)}
                                className="px-2.5 py-1 text-[#523D35] hover:bg-[#BBA58F]/30 font-bold cursor-pointer"
                                title="Increase servings"
                              >
                                +
                              </button>
                            </div>

                            {/* Nutrients Pills */}
                            <div className="flex items-center gap-1 text-[11px]">
                              <span className="px-2 py-1 bg-[#E8D9CD] border border-[#959D90]/40 rounded-lg font-black text-[#223030]">
                                {meal.calories} kcal
                              </span>
                              <span className="px-2 py-1 bg-[#E8D9CD] border border-[#959D90]/40 rounded-lg font-bold text-[#523D35]">
                                {meal.protein}g P
                              </span>
                              <span className="px-2 py-1 bg-[#E8D9CD] border border-[#959D90]/40 rounded-lg font-bold text-[#523D35]">
                                {meal.iron}mg Fe
                              </span>
                              <span className="px-2 py-1 bg-[#E8D9CD] border border-[#959D90]/40 rounded-lg font-bold text-[#523D35]">
                                {meal.calcium}mg Ca
                              </span>
                              <span className="px-2 py-1 bg-[#E8D9CD] border border-[#959D90]/40 rounded-lg font-bold text-[#523D35]">
                                {meal.folate}µg Fol
                              </span>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeMeal(meal.id)}
                              className="p-1.5 text-[#959D90] hover:text-[#523D35] hover:bg-[#BBA58F]/20 rounded-xl transition cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty state for category with suggested recommendations */
                  <div className="p-4 rounded-2xl bg-[#EFEFE9] border border-dashed border-[#959D90]/60 text-center space-y-2">
                    <p className="text-xs text-[#523D35] font-medium">
                      {t('planner.noFoodsScheduled', 'No foods scheduled for')} {formatLocalizedWeekday(selectedDay, currentLanguageCode, false)} ({getCategoryTitle(category)}).
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-[#523D35]">
                        {t('planner.suggestedFor', 'Suggested for')} {globalLocation.state}:
                      </span>
                      {trimesterPlanInfo.recommendedDishes
                        .filter(
                          (d) =>
                            (d.category === category || slotMeals.length === 0) &&
                            isFoodEligibleForDiet({ name: d.name }, userDietPref)
                        )
                        .slice(0, 2)
                        .map((rec) => (
                          <button
                            key={rec.name}
                            type="button"
                            onClick={() => {
                              addFoodToPlan({
                                food: {
                                  name: rec.name,
                                  calories: rec.calories,
                                  protein: rec.protein,
                                  iron: rec.iron,
                                  calcium: rec.calcium,
                                  folate: rec.folate
                                },
                                day: selectedDay,
                                category: category,
                                servings: 1
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#E8D9CD] border border-[#959D90]/50 hover:border-[#523D35] hover:text-[#223030] text-[11px] font-bold text-[#523D35] transition flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-[#523D35]" />
                            <DualFoodName foodName={rec.name} className="text-[11px] font-bold text-[#523D35]" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* 4. Custom Food Item Add Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-[#223030]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#EFEFE9] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#959D90] animate-in fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-[#959D90]/30 pb-3">
              <div>
                <h3 className="text-lg font-black text-[#223030]">{t('planner.addCustomItem', 'Add Meal Item to')} {formatLocalizedWeekday(selectedDay, currentLanguageCode, false)}</h3>
                <p className="text-xs text-[#523D35]">
                  {t('planner.verifiedDatabase', 'Add from verified maternal food database')} ({userDietPref === 'vegetarian' ? t('planner.pureVeg', '🥬 Pure Vegetarian Only') : t('planner.nonVeg', '🍗 Vegetarian & Non-Veg')})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustom} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="text-xs font-bold text-[#223030] block mb-1">{t('planner.mealCategory', 'Meal Category')}</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as MealCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030] outline-none cursor-pointer"
                >
                  {MEAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {MEAL_TIME_RANGES[cat].icon} {getCategoryTitle(cat)} ({MEAL_TIME_RANGES[cat].time})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Pick from ICMR Database */}
              <div>
                <label className="text-xs font-bold text-[#223030] block mb-1">
                  {t('planner.quickSelect', 'Quick Select from Database')} ({globalLocation.state} • {userDietPref === 'vegetarian' ? '🥬' : '🍗'})
                </label>
                <select
                  value={selectedKaggleId}
                  onChange={(e) => handleDropdownSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-semibold text-[#223030] outline-none cursor-pointer"
                >
                  <option value="">-- {t('planner.quickSelect', 'Quick Select from Database')} ({eligibleKaggleFoods.length}) --</option>
                  {eligibleKaggleFoods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.cuisine} • {f.calories} kcal • {f.protein}g • {f.iron}mg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Name */}
              <div>
                <label className="text-xs font-bold text-[#223030] block mb-1">{t('planner.foodItemName', 'Food Item Name')} *</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Steamed Ragi Idli with Sambar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030] outline-none"
                />
              </div>

              {/* Portion */}
              <div>
                <label className="text-xs font-bold text-[#223030] block mb-1">{t('planner.portionSize', 'Portion Size (e.g. 1 Katori, 2 Idlis, 1 Glass)')}</label>
                <input
                  type="text"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                  placeholder="e.g., 2 Idlis + 1 cup sambar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-medium text-[#223030] outline-none"
                />
              </div>

              {/* Nutrients Row */}
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">{t('nutrient.calories', 'Calories')}</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">{t('nutrient.protein', 'Protein')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">{t('nutrient.iron', 'Iron')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={iron}
                    onChange={(e) => setIron(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">{t('nutrient.calcium', 'Calcium')}</label>
                  <input
                    type="number"
                    value={calcium}
                    onChange={(e) => setCalcium(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">{t('nutrient.folate', 'Folate')}</label>
                  <input
                    type="number"
                    value={folate}
                    onChange={(e) => setFolate(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#959D90]/30">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#523D35] hover:bg-[#E8D9CD] cursor-pointer"
                >
                  {t('planner.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-black shadow-xs cursor-pointer"
                >
                  {t('planner.addToSchedule', 'Add to Meal Schedule')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Complete 21-Point Regional Recipe Detail Modal */}
      <RegionalRecipeDetailModal
        recipe={selectedRecipeDetail}
        isOpen={!!selectedRecipeDetail}
        onClose={() => setSelectedRecipeDetail(null)}
      />
    </div>
  );
};
