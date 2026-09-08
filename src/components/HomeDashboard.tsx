import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplet, 
  Plus, 
  Minus, 
  ArrowRight, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Apple, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  UtensilsCrossed,
  Clock,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { VerifiedFoodImage } from './VerifiedFoodImage';
import { REGIONAL_RECIPES_DATABASE, RegionalRecipe } from '../data/regional_recipes_db';
import { LoggedMealRecord } from '../nutrition_engine';
import { FOOD_DATABASE_ITEMS } from '../foods_db';
import { FoodItem } from '../data';

interface HomeDashboardProps {
  userName: string;
  pregnancyWeek: number;
  trimester: number;
  waterIntakeMl: number;
  waterTargetMl?: number;
  onUpdateWater: (deltaMl: number) => void;
  onResetWater: () => void;
  loggedMeals: LoggedMealRecord[];
  onNavigate: (tab: 'home' | 'explore' | 'tracker' | 'analytics' | 'care' | 'profile') => void;
  onSelectFood: (food: RegionalRecipe) => void;
  onLogMealDirect?: (recipe: RegionalRecipe, slot: string) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_SLOTS = [
  { id: 'Breakfast', label: 'Breakfast', time: '8:00 AM – 9:00 AM', defaultDishIndex: 0 },
  { id: 'Morning Snack', label: 'Mid-Morning Snack', time: '11:00 AM – 11:30 AM', defaultDishIndex: 4 },
  { id: 'Lunch', label: 'Lunch', time: '1:00 PM – 2:30 PM', defaultDishIndex: 1 },
  { id: 'Evening Snack', label: 'Evening Snack', time: '4:30 PM – 5:30 PM', defaultDishIndex: 3 },
  { id: 'Dinner', label: 'Dinner', time: '7:30 PM – 9:00 PM', defaultDishIndex: 2 }
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userName = 'Ammu',
  pregnancyWeek = 24,
  trimester = 2,
  waterIntakeMl = 1500,
  waterTargetMl = 2500,
  onUpdateWater,
  onResetWater,
  loggedMeals = [],
  onNavigate,
  onSelectFood,
  onLogMealDirect
}) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Day navigation for Single-Day Meal Schedule
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const [activeDayIndex, setActiveDayIndex] = useState<number>(todayIndex);
  const activeDayName = DAYS_OF_WEEK[activeDayIndex];

  // Quick Safety search state
  const [safetySearchQuery, setSafetySearchQuery] = useState<string>('');
  const [selectedSafetyFilter, setSelectedSafetyFilter] = useState<'All' | 'Safe' | 'Moderate' | 'Avoid'>('All');

  // Calculate today's logged nutrition sums
  const todayTotals = loggedMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.nutrients?.calories || 0),
      protein: acc.protein + (meal.nutrients?.protein || 0),
      carbs: acc.carbs + (meal.nutrients?.carbohydrates || 0),
      fat: acc.fat + (meal.nutrients?.fat || 0),
      fiber: acc.fiber + (meal.nutrients?.fiber || 0),
      iron: acc.iron + (meal.nutrients?.iron || 0),
      calcium: acc.calcium + (meal.nutrients?.calcium || 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 }
  );

  const targets = {
    calories: 2350,
    protein: 68,
    carbs: 275,
    fiber: 35,
    iron: 27,
    calcium: 1000
  };

  const waterPercent = Math.min(100, Math.round((waterIntakeMl / waterTargetMl) * 100));
  const isWaterComplete = waterIntakeMl >= waterTargetMl;
  const totalGlasses = 10;
  const filledGlasses = Math.min(totalGlasses, Math.floor(waterIntakeMl / 250));

  // Filtered safety foods
  const filteredSafetyFoods = FOOD_DATABASE_ITEMS.filter((item: FoodItem) => {
    const sLevel = item.safetyLevel || 'Safe';
    const sStatus = sLevel === 'Safe' ? 'safe' : sLevel.toLowerCase().includes('moderation') ? 'moderate' : 'avoid';
    
    if (selectedSafetyFilter !== 'All' && sStatus !== selectedSafetyFilter.toLowerCase()) {
      return false;
    }
    if (safetySearchQuery.trim()) {
      const q = safetySearchQuery.toLowerCase();
      const nameEn = (item.name?.en || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const exp = (item.explanation?.en || item.benefits?.en || item.risks?.en || '').toLowerCase();
      return nameEn.includes(q) || cat.includes(q) || exp.includes(q);
    }
    return true;
  }).slice(0, 6);

  const handlePrevDay = () => {
    setActiveDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNextDay = () => {
    setActiveDayIndex((prev) => (prev === 6 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header Greeting & Week Stage */}
      <section id="home-greeting-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Trimester {trimester} • Week {pregnancyWeek}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {greeting}, <span className="text-pink-600">{userName}</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Welcome to your daily maternal nutrition summary. Grounded in ICMR-NIN 2020 guidelines to ensure healthy fetal growth and maternal strength.
          </p>
        </div>

        {/* Quick Stage Status Card */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-700 font-black text-lg shadow-2xs">
            W{pregnancyWeek}
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Daily Stage Focus</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">Iron, Calcium & Folate</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> ICMR-NIN Verified
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Nutrition & Water Intake Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Nutrition Summary */}
        <section id="nutrition-summary-card" className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Today's Nutrition</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  ICMR RDA Target
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Calculated from your logged maternal meals</p>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
            >
              <span>Go to Meal Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Calories */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">Energy</span>
                <Flame className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {Math.round(todayTotals.calories)}
                <span className="text-xs font-normal text-slate-500 ml-1">/ {targets.calories} kcal</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (todayTotals.calories / targets.calories) * 100)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">Protein</span>
                <Dumbbell className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {Math.round(todayTotals.protein)}g
                <span className="text-xs font-normal text-slate-500 ml-1">/ {targets.protein}g</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (todayTotals.protein / targets.protein) * 100)}%` }}
                />
              </div>
            </div>

            {/* Iron */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">Iron</span>
                <Sparkles className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {Math.round(todayTotals.iron || 0)}mg
                <span className="text-xs font-normal text-slate-500 ml-1">/ {targets.iron}mg</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, ((todayTotals.iron || 0) / targets.iron) * 100)}%` }}
                />
              </div>
            </div>

            {/* Dietary Fibre */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold">Fibre</span>
                <Apple className="w-4 h-4 text-pink-600" />
              </div>
              <div className="text-xl font-black text-slate-900">
                {Math.round(todayTotals.fiber)}g
                <span className="text-xs font-normal text-slate-500 ml-1">/ {targets.fiber}g</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (todayTotals.fiber / targets.fiber) * 100)}%` }}
                />
              </div>
            </div>

          </div>

          {loggedMeals.length === 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-600">
                  No meals logged yet today. Track your breakfast or traditional meal with 1 tap.
                </p>
              </div>
              <button
                onClick={() => onNavigate('tracker')}
                className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold hover:bg-pink-700 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                + Log Today's Meal
              </button>
            </div>
          )}
        </section>

        {/* 10-Glass Water Intake Tracker Card */}
        <section id="water-tracker-card" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Hydration Tracker</h2>
              <p className="text-xs text-slate-500 mt-0.5">Target: {waterTargetMl} ml (10 glasses/day)</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* 10-Glass Visual Grid */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">
                {waterIntakeMl} <span className="text-xs font-normal text-slate-500">ml</span>
              </span>
              <span className={`text-xs font-bold ${isWaterComplete ? 'text-emerald-600' : 'text-sky-600'}`}>
                {isWaterComplete ? 'Daily Goal Met! 🎉' : `${waterPercent}% of 2500ml`}
              </span>
            </div>

            {/* Visual Glass Row */}
            <div className="grid grid-cols-5 gap-2 py-1">
              {Array.from({ length: totalGlasses }).map((_, idx) => {
                const isFilled = idx < filledGlasses;
                return (
                  <button
                    key={idx}
                    onClick={() => onUpdateWater(isFilled ? -250 : 250)}
                    title={`Glass ${idx + 1} (250 ml)`}
                    className={`h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                      isFilled
                        ? 'bg-sky-500 border-sky-600 text-white shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-300 hover:border-sky-300 hover:text-sky-400'
                    }`}
                  >
                    <Droplet className={`w-4 h-4 ${isFilled ? 'fill-current' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              id="water-minus-btn"
              onClick={() => onUpdateWater(-250)}
              disabled={waterIntakeMl <= 0}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" /> 250ml
            </button>
            <button
              id="water-plus-btn"
              onClick={() => onUpdateWater(250)}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> 250ml
            </button>
            <button
              id="water-reset-btn"
              onClick={onResetWater}
              title="Reset Hydration"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>

      {/* 3. Single-Day Meal Schedule with Day Navigation */}
      <section id="single-day-meal-schedule" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Header & Day Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Today's Meal Schedule</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black border border-pink-100">
                5 Planned Slots
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Balanced traditional maternal schedule for {activeDayName}
            </p>
          </div>

          {/* Day Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 overflow-x-auto">
              {DAYS_OF_WEEK.map((day, idx) => {
                const isSelected = idx === activeDayIndex;
                const isToday = idx === todayIndex;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-600 text-white shadow-xs'
                        : isToday
                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {day.slice(0, 3)}
                    {isToday && <span className="ml-1 text-[9px] opacity-80">•</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Meal Slots List */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {MEAL_SLOTS.map((slot, index) => {
            const sampleRecipe = REGIONAL_RECIPES_DATABASE[slot.defaultDishIndex % REGIONAL_RECIPES_DATABASE.length];
            return (
              <div
                key={slot.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 flex flex-col justify-between space-y-3 hover:border-pink-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-pink-700">
                      {slot.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{slot.time.split('–')[0]}</span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div 
                      onClick={() => onSelectFood(sampleRecipe)}
                      className="font-bold text-xs text-slate-900 group-hover:text-pink-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {sampleRecipe?.traditionalName || 'Nutritious Meal'}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {sampleRecipe?.state} • {Math.round(sampleRecipe?.nutrition?.calories || 250)} kcal
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    Safe
                  </span>
                  <button
                    onClick={() => {
                      if (onLogMealDirect && sampleRecipe) {
                        onLogMealDirect(sampleRecipe, slot.id);
                      } else {
                        onNavigate('tracker');
                      }
                    }}
                    className="text-[11px] font-bold text-pink-600 hover:text-pink-700 cursor-pointer"
                  >
                    + Log
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 4. Clinical Food Safety Search Engine */}
      <section id="safety-search-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">Pregnancy Food Safety Search</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Check safety status (Safe, Moderate, Avoid) and clinical contraindications
            </p>
          </div>

          {/* Safety Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {(['All', 'Safe', 'Moderate', 'Avoid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedSafetyFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSafetyFilter === st
                    ? st === 'Safe'
                      ? 'bg-emerald-600 text-white'
                      : st === 'Moderate'
                      ? 'bg-amber-600 text-white'
                      : st === 'Avoid'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={safetySearchQuery}
            onChange={(e) => setSafetySearchQuery(e.target.value)}
            placeholder="Search ingredients (e.g. Raw Papaya, Saffron, Ajwain, Fennel, Ragi, Pineapple)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
          />
        </div>

        {/* Safety Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSafetyFoods.map((item: FoodItem) => {
            const sLevel = item.safetyLevel || 'Safe';
            const isSafe = sLevel === 'Safe';
            const isModerate = sLevel.toLowerCase().includes('moderation') || sLevel.toLowerCase().includes('consult');
            const displayName = item.name?.en || Object.values(item.name || {})[0] || 'Food Item';
            const displayNote = item.explanation?.en || item.benefits?.en || item.risks?.en || 'Safe for maternal dietary intake.';

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border bg-white flex flex-col justify-between space-y-3 transition-all hover:shadow-xs"
                style={{
                  borderColor: isSafe ? '#A7F3D0' : isModerate ? '#FDE68A' : '#FECDD3'
                }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{displayName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isSafe
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isModerate
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {sLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {displayNote}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Category: {item.category}</span>
                  <span className="font-bold text-slate-600">{item.calories} kcal/100g</span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 5. Recommended Traditional Indian Foods */}
      <section id="recommended-foods-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Doctor-Vetted Regional Recipes</h2>
            <p className="text-xs text-slate-500 mt-0.5">Authentic Indian dishes tailored to your gestational week</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
          >
            <span>Explore 6-Zone Database</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REGIONAL_RECIPES_DATABASE.slice(0, 3).map((dish) => (
            <div
              key={dish.recipeId}
              onClick={() => onSelectFood(dish)}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-pink-300 transition-all duration-200 cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <VerifiedFoodImage
                  src={dish.referenceImageUrl}
                  alt={dish.traditionalName}
                  dishName={dish.traditionalName}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-600 text-white shadow-xs">
                    Safe
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                    {dish.state} • {dish.region} India
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors mt-0.5 line-clamp-1">
                    {dish.traditionalName}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {dish.englishDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">Calories</div>
                    <div className="text-xs font-black text-slate-900">{Math.round(dish.nutrition.calories)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Protein</div>
                    <div className="text-xs font-black text-slate-900">{Math.round(dish.nutrition.protein)}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Carbs</div>
                    <div className="text-xs font-black text-slate-900">{Math.round(dish.nutrition.carbohydrates)}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Fibre</div>
                    <div className="text-xs font-black text-slate-900">{Math.round(dish.nutrition.fiber)}g</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
