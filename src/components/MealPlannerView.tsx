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

  const { t } = useLanguage();

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

  // Clinical recommendations for active trimester & location
  const trimesterPlanInfo = LocationNutritionEngine.getTrimesterMealRecommendations(
    selectedTrimester,
    globalLocation,
    userProfile.dietPreference
  );

  // Percentage calculations against RDA
  const calPercent = Math.min(100, Math.round((dayNutrition.calories / trimesterRdaTargets.calories) * 100));
  const protPercent = Math.min(100, Math.round((dayNutrition.protein / trimesterRdaTargets.protein) * 100));
  const ironPercent = Math.min(100, Math.round((dayNutrition.iron / trimesterRdaTargets.iron) * 100));
  const calcPercent = Math.min(100, Math.round((dayNutrition.calcium / trimesterRdaTargets.calcium) * 100));
  const folPercent = Math.min(100, Math.round((dayNutrition.folate / trimesterRdaTargets.folate) * 100));

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

    // Check custom food against user's saved allergy profile
    const allergyCheck = checkFoodAllergies(
      { name: customName.trim() },
      userProfile.allergies
    );
    if (allergyCheck.hasAllergy) {
      const confirmed = confirm(
        `⚠️ ALLERGY WARNING:\n"${customName.trim()}" contains ${allergyCheck.matchedAllergens.join(', ')}, which is in your saved allergy profile.\n\nDo you still want to proceed and add this item?`
      );
      if (!confirmed) return;
    }

    addFoodToPlan({
      food: {
        id: selectedKaggleId || `custom-${Date.now()}`,
        name: customName.trim(),
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        iron: Number(iron) || 0,
        calcium: Number(calcium) || 0,
        folate: Number(folate) || 0,
        servingSize: portion
      },
      day: selectedDay,
      category: customCategory,
      servings: 1,
      customPortion: portion
    });

    setCustomName('');
    setSelectedKaggleId('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Navigation Controls */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Personalized Maternal Meal Planner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2 flex-wrap">
              <span>🗓️ Maternal Meal Schedule</span>
              <span className="text-sm font-bold text-[#523D35] bg-[#EFEFE9] border border-[#959D90]/40 px-3 py-1 rounded-full">
                📍 {globalLocation.village || globalLocation.city}, {globalLocation.state}
              </span>
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-3xl">
              Plan and log all 5 daily pregnancy meal intervals to guarantee optimal micro and macronutrient distribution without maternal blood sugar spikes.
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
              <span>{activePlannerView === 'weekly-summary' ? 'View Daily Planner' : '📊 7-Day Nutrition Summary'}</span>
            </button>

            <button
              type="button"
              onClick={() => regenerateLocationMealPlan()}
              className="px-3.5 py-2.5 rounded-xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#523D35] text-xs font-bold border border-[#959D90]/50 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              title={`Regenerate authentic meal plan for ${globalLocation.state} (${selectedTrimester})`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Auto-Plan for {globalLocation.state}</span>
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
              <span>+ Add Food Item</span>
            </button>
          </div>
        </div>

        {/* Trimester Selector Tabs */}
        <div className="pt-2 border-t border-[#959D90]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#523D35] uppercase">Trimester Focus:</span>
            {(['1st Trimester', '2nd Trimester', '3rd Trimester'] as PregnancyTrimester[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTrimester(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedTrimester === t
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#BBA58F]/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-[#223030] bg-[#EFEFE9] px-3 py-1.5 rounded-xl border border-[#959D90]/40">
            ICMR RDA Targets: <span className="font-extrabold">{trimesterRdaTargets.calories} kcal</span> • <span className="font-extrabold">{trimesterRdaTargets.protein}g Protein</span> • <span className="font-extrabold">{trimesterRdaTargets.iron}mg Iron</span>
          </div>
        </div>

        {/* 7-Day Selector Pills with Live Counts */}
        <div className="pt-2 border-t border-[#959D90]/30">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              const count = meals.filter((m) => m.day === day).length;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-md ring-2 ring-[#523D35]/50'
                      : 'bg-[#EFEFE9] hover:bg-[#BBA58F]/20 text-[#523D35] border border-[#959D90]/50'
                  }`}
                >
                  <span className="text-sm">{day}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
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
                {selectedDay} Nutrition Summary ({dayNutrition.totalMealCount} Meals Planned)
              </h2>
              <p className="text-xs text-[#959D90]">
                Calculated strictly from meals planned for <span className="text-[#BBA58F] font-bold">{selectedDay}</span> vs. ICMR {selectedTrimester} RDA
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
              <span>7-Day Trends</span>
            </button>
            {dayNutrition.totalMealCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Clear all ${dayNutrition.totalMealCount} planned meals for ${selectedDay}?`)) {
                    clearDayMeals(selectedDay);
                  }
                }}
                className="text-[11px] font-bold text-[#BBA58F] hover:text-[#E8D9CD] hover:underline px-2 py-1 cursor-pointer"
              >
                Clear {selectedDay} Meals
              </button>
            )}
            <span className="text-xs px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 font-extrabold">
              {dayNutrition.completedMealCount} of {dayNutrition.totalMealCount} Eaten
            </span>
          </div>
        </div>

        {/* 5 Core Nutrient Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Energy */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">Calories</span>
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
            <span className="text-[10px] font-semibold text-[#959D90] block">{calPercent}% of RDA</span>
          </div>

          {/* Protein */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">Protein</span>
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
            <span className="text-[10px] font-semibold text-[#959D90] block">{protPercent}% of RDA</span>
          </div>

          {/* Iron */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">Iron</span>
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
            <span className="text-[10px] font-semibold text-[#959D90] block">{ironPercent}% of RDA</span>
          </div>

          {/* Calcium */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">Calcium</span>
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
            <span className="text-[10px] font-semibold text-[#959D90] block">{calcPercent}% of RDA</span>
          </div>

          {/* Folate */}
          <div className="bg-[#223030]/90 rounded-2xl p-4 border border-[#959D90]/40 space-y-1.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#959D90] font-bold uppercase tracking-wider block">Folate (B9)</span>
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
            <span className="text-[10px] font-semibold text-[#959D90] block">{folPercent}% of RDA</span>
          </div>
        </div>

        {/* Clinical Guidance Banner */}
        <div className="bg-[#523D35]/60 rounded-2xl p-4 border border-[#959D90]/40 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-[#BBA58F] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#EFEFE9] block mb-0.5">
              {selectedTrimester} Maternal Focus ({globalLocation.state}):
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
            <span>5 Maternal Meal Intervals for {selectedDay}</span>
          </h2>
          <span className="text-xs font-semibold text-[#523D35]">
            Target: 5 timed meals to stabilize glycemic &amp; fetal nutrient supply
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
                          {category}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFEFE9] text-[#523D35] font-bold">
                          {timeInfo.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#523D35] mt-0.5">
                        {slotMeals.length === 0 ? 'No items planned yet' : `${slotMeals.length} item${slotMeals.length > 1 ? 's' : ''} planned`}
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
                      <span>Add to {category}</span>
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
                              title={meal.isCompleted ? 'Mark as not eaten' : 'Mark as eaten'}
                            >
                              {meal.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>

                            <div>
                              <DualFoodName
                                foodName={meal.name}
                                className={`text-sm font-extrabold tracking-tight ${
                                  meal.isCompleted ? 'line-through text-[#523D35]' : 'text-[#223030]'
                                }`}
                                miniClassName="text-xs font-semibold text-[#523D35] mt-0.5"
                              />
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-[#523D35] font-medium">
                                  Portion: {meal.portion}
                                </span>
                                {meal.isCompleted && (
                                  <span className="text-[10px] font-extrabold text-[#E8D9CD] bg-[#523D35] px-2 py-0.5 rounded-md">
                                    ✓ Consumed
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
                                      <span>View Recipe</span>
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
                                    <span>⚠️ Allergy Alert: Contains {allergyCheck.matchedAllergens.join(', ')}</span>
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
                      No foods scheduled for {selectedDay} {category}.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-[#523D35]">
                        Suggested for {globalLocation.state}:
                      </span>
                      {trimesterPlanInfo.recommendedDishes
                        .filter((d) => d.category === category || slotMeals.length === 0)
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
                            <span>{rec.name.split('(')[0]}</span>
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
                <h3 className="text-lg font-black text-[#223030]">Add Meal Item to {selectedDay}</h3>
                <p className="text-xs text-[#523D35]">Add from verified maternal food database or enter custom meal</p>
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
                <label className="text-xs font-bold text-[#223030] block mb-1">Meal Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as MealCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030] outline-none cursor-pointer"
                >
                  {MEAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {MEAL_TIME_RANGES[cat].icon} {cat} ({MEAL_TIME_RANGES[cat].time})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Pick from ICMR Database */}
              <div>
                <label className="text-xs font-bold text-[#223030] block mb-1">
                  Quick Pick from Maternal Food Database ({globalLocation.state})
                </label>
                <select
                  value={selectedKaggleId}
                  onChange={(e) => handleDropdownSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-semibold text-[#223030] outline-none cursor-pointer"
                >
                  <option value="">-- Choose from ICMR Verified Foods --</option>
                  {KAGGLE_PROCESSED_FOOD_DATABASE.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.cuisine} • {f.calories} kcal • {f.protein}g Protein • {f.iron}mg Fe)
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Name */}
              <div>
                <label className="text-xs font-bold text-[#223030] block mb-1">Dish / Food Name *</label>
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
                <label className="text-xs font-bold text-[#223030] block mb-1">Serving Portion</label>
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
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">Iron (mg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={iron}
                    onChange={(e) => setIron(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">Calcium (mg)</label>
                  <input
                    type="number"
                    value={calcium}
                    onChange={(e) => setCalcium(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-xl bg-[#E8D9CD] border border-[#959D90]/60 text-xs font-bold text-[#223030]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#523D35] uppercase block mb-1">Folate (µg)</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-black shadow-xs cursor-pointer"
                >
                  Save to {selectedDay} ({customCategory})
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
