import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Apple, 
  Search,
  CheckCircle2,
  UtensilsCrossed,
  Info,
  Sparkles
} from 'lucide-react';
import { LoggedMealRecord, ConfirmedMealItem } from '../nutrition_engine';
import { FOOD_DATABASE_ITEMS } from '../foods_db';

interface MealTrackerViewProps {
  loggedMeals: LoggedMealRecord[];
  onAddMeal: (meal: LoggedMealRecord) => void;
  onDeleteMeal: (mealId: string) => void;
  onOpenPhotoScanner: () => void;
}

const MEAL_SLOTS: Array<{ id: LoggedMealRecord['mealType']; label: string; time: string }> = [
  { id: 'Breakfast', label: 'Breakfast', time: '8:00 AM – 9:30 AM' },
  { id: 'Morning Snack', label: 'Mid-Morning Snack', time: '11:00 AM – 11:30 AM' },
  { id: 'Lunch', label: 'Lunch', time: '1:00 PM – 2:30 PM' },
  { id: 'Evening Snack', label: 'Evening Snack', time: '4:30 PM – 5:30 PM' },
  { id: 'Dinner', label: 'Dinner', time: '7:30 PM – 9:00 PM' }
];

export const MealTrackerView: React.FC<MealTrackerViewProps> = ({
  loggedMeals,
  onAddMeal,
  onDeleteMeal,
  onOpenPhotoScanner
}) => {
  // Day Selector state: -1 (Yesterday), 0 (Today), 1 (Tomorrow)
  const [dayOffset, setDayOffset] = useState<number>(0);
  
  // Manual Add Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [selectedSlotForAdd, setSelectedSlotForAdd] = useState<LoggedMealRecord['mealType']>('Breakfast');
  const [searchFoodQuery, setSearchFoodQuery] = useState<string>('');
  const [selectedFoodItem, setSelectedFoodItem] = useState<any | null>(null);
  const [portionGrams, setPortionGrams] = useState<number>(150);

  // Date Label
  const displayDate = new Date();
  displayDate.setDate(displayDate.getDate() + dayOffset);
  const dateFormatted = displayDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Calculate daily totals
  const dailyTotals = loggedMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.nutrients?.calories || 0),
      protein: acc.protein + (meal.nutrients?.protein || 0),
      carbs: acc.carbs + (meal.nutrients?.carbohydrates || 0),
      fat: acc.fat + (meal.nutrients?.fat || 0),
      fiber: acc.fiber + (meal.nutrients?.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  // Filter food database for manual selection
  const searchResults = FOOD_DATABASE_ITEMS.filter(f => {
    if (!searchFoodQuery.trim()) return false;
    const name = f.name?.en || '';
    return name.toLowerCase().includes(searchFoodQuery.toLowerCase());
  }).slice(0, 6);

  const handleOpenAdd = (slot: LoggedMealRecord['mealType']) => {
    setSelectedSlotForAdd(slot);
    setSelectedFoodItem(null);
    setSearchFoodQuery('');
    setPortionGrams(150);
    setIsManualModalOpen(true);
  };

  const handleSaveManualMeal = () => {
    if (!selectedFoodItem) return;

    const ratio = portionGrams / 100;
    const calories = Math.round((selectedFoodItem.calories || 150) * ratio);
    const protein = Math.round((selectedFoodItem.protein || 4) * ratio * 10) / 10;
    const carbs = Math.round((selectedFoodItem.carbohydrates || 20) * ratio * 10) / 10;
    const fat = Math.round((selectedFoodItem.fat || 3) * ratio * 10) / 10;
    const fiber = Math.round((selectedFoodItem.fiber || 3) * ratio * 10) / 10;

    const confirmedItem: ConfirmedMealItem = {
      foodId: selectedFoodItem.id,
      name: selectedFoodItem.name?.en || 'Manual Food Item',
      quantity: portionGrams,
      unit: 'g',
      portionSize: portionGrams <= 100 ? 'small' : portionGrams <= 200 ? 'medium' : 'large',
      defaultServingGrams: 100,
      foodItem: selectedFoodItem
    };

    const newMeal: LoggedMealRecord = {
      id: `meal_${Date.now()}`,
      userId: 'user',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      mealType: selectedSlotForAdd,
      foodNames: [confirmedItem.name],
      items: [confirmedItem],
      nutrients: {
        calories,
        protein,
        carbohydrates: carbs,
        fat,
        saturatedFat: Math.round(fat * 0.3 * 10) / 10,
        fiber,
        sugar: 2,
        vitaminA: (selectedFoodItem.vitaminA || 0) * ratio,
        vitaminB1: 0.1,
        vitaminB2: 0.1,
        vitaminB3: 1,
        vitaminB5: 0.5,
        vitaminB6: (selectedFoodItem.vitaminB6 || 0) * ratio,
        vitaminB7: 1,
        vitaminB9: (selectedFoodItem.folate || 0) * ratio,
        vitaminB12: (selectedFoodItem.vitaminB12 || 0) * ratio,
        vitaminC: (selectedFoodItem.vitaminC || 0) * ratio,
        vitaminD: (selectedFoodItem.vitaminD || 0) * ratio,
        vitaminE: (selectedFoodItem.vitaminE || 0) * ratio,
        vitaminK: (selectedFoodItem.vitaminK || 0) * ratio,
        calcium: (selectedFoodItem.calcium || 0) * ratio,
        iron: (selectedFoodItem.iron || 0) * ratio,
        magnesium: (selectedFoodItem.magnesium || 0) * ratio,
        phosphorus: 100,
        potassium: (selectedFoodItem.potassium || 0) * ratio,
        sodium: (selectedFoodItem.sodium || 0) * ratio,
        zinc: (selectedFoodItem.zinc || 0) * ratio,
        copper: 0.1,
        manganese: 0.2,
        selenium: 2,
        iodine: 5,
        choline: 10,
        omega3: 0.05
      },
      nutritionScore: 85,
      source: 'manual'
    };

    onAddMeal(newMeal);
    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Top Header & Day Selector */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daily Meal Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Log your 5 daily meal slots to track calories, protein, and dietary fiber accurately.
            </p>
          </div>

          {/* Day Selector Pill (Prev Day | Today | Next Day) */}
          <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 self-start sm:self-auto">
            <button
              onClick={() => setDayOffset(prev => prev - 1)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800">
              {dayOffset === 0 ? `Today (${dateFormatted})` : dayOffset === -1 ? `Yesterday (${dateFormatted})` : dateFormatted}
            </span>
            <button
              onClick={() => setDayOffset(prev => prev + 1)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Today's Macros Progress Strip */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
              <span>Calories</span>
              <Flame className="w-3.5 h-3.5 text-pink-600" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {Math.round(dailyTotals.calories)} <span className="text-xs font-normal text-slate-500">kcal</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
              <span>Protein</span>
              <Dumbbell className="w-3.5 h-3.5 text-pink-600" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {Math.round(dailyTotals.protein)}g
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
              <span>Carbs</span>
              <Wheat className="w-3.5 h-3.5 text-pink-600" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {Math.round(dailyTotals.carbs)}g
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
            <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
              <span>Fibre</span>
              <Apple className="w-3.5 h-3.5 text-pink-600" />
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {Math.round(dailyTotals.fiber)}g
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5 Structured Meal Slots */}
      <div className="space-y-4">
        {MEAL_SLOTS.map((slot) => {
          const slotMeals = loggedMeals.filter(m => m.mealType === slot.id);

          return (
            <div
              key={slot.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{slot.label}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">({slot.time})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenPhotoScanner}
                    className="p-2 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
                    title="Scan Meal Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenAdd(slot.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Slot Meal Items */}
              {slotMeals.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No items logged for {slot.label.toLowerCase()} yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {slotMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {meal.foodNames?.join(', ') || 'Custom Meal'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {Math.round(meal.nutrients?.calories || 0)} kcal • {meal.nutrients?.protein || 0}g protein • {meal.nutrients?.fiber || 0}g fiber
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteMeal(meal.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Meal Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Add Meal Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Item to {selectedSlotForAdd}</h3>
                <p className="text-xs text-slate-500">Search from Indian food database</p>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Food Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Search Food</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Idli, Ragi Mudde, Dal, Curd..."
                  value={searchFoodQuery}
                  onChange={(e) => setSearchFoodQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                />
              </div>

              {searchResults.length > 0 && !selectedFoodItem && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedFoodItem(item);
                        setSearchFoodQuery(item.name?.en || '');
                      }}
                      className="p-2.5 hover:bg-pink-50 text-xs text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-semibold">{item.name?.en}</span>
                      <span className="text-[10px] text-slate-400">{item.calories} kcal/100g</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Portion Grams */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Serving Size</span>
                <span className="text-pink-600">{portionGrams} grams</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={portionGrams}
                onChange={(e) => setPortionGrams(Number(e.target.value))}
                className="w-full accent-pink-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>50g (Small)</span>
                <span>150g (Standard)</span>
                <span>300g (Full Meal)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveManualMeal}
                disabled={!selectedFoodItem}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Save Meal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
