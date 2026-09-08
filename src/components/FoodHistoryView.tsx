import React, { useState } from 'react';
import { 
  Calendar, Clock, Trash2, ChevronRight, Eye, Sparkles, Filter, 
  Flame, Dumbbell, Wheat, Droplets, HeartPulse, X, Camera, AlertCircle
} from 'lucide-react';
import { LoggedMealRecord, DetailedNutrients, MATERNAL_NUTRIENT_METADATA } from '../nutrition_engine';

interface FoodHistoryViewProps {
  loggedMeals: LoggedMealRecord[];
  onDeleteMeal: (mealId: string) => void;
  onOpenScanner: () => void;
  onEditMeal?: (meal: LoggedMealRecord) => void;
  language?: string;
}

export const FoodHistoryView: React.FC<FoodHistoryViewProps> = ({
  loggedMeals = [],
  onDeleteMeal,
  onOpenScanner,
  onEditMeal,
  language = 'en'
}) => {
  const [filterRange, setFilterRange] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('all');
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<LoggedMealRecord | null>(null);
  const [activeNutrientTab, setActiveNutrientTab] = useState<'macros' | 'vitamins' | 'minerals'>('macros');

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const oneWeekAgoStr = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const oneMonthAgoStr = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const filteredMeals = loggedMeals.filter(meal => {
    if (filterRange === 'today') return meal.date === todayStr;
    if (filterRange === 'yesterday') return meal.date === yesterdayStr;
    if (filterRange === 'week') return meal.date >= oneWeekAgoStr;
    if (filterRange === 'month') return meal.date >= oneMonthAgoStr;
    return true;
  }).sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime());

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🥗</span>
            <span>My Food & Nutrition History</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Review all your logged meals, verified portions, and detailed micro-nutrient histories.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-100 flex items-center gap-2 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Scan New Meal</span>
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Meals' },
          { id: 'today', label: 'Today' },
          { id: 'yesterday', label: 'Yesterday' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterRange(filter.id as any)}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition shrink-0 ${
              filterRange === filter.id
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* MEALS LIST */}
      {filteredMeals.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto text-2xl">
            🍽️
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No Logged Meals in this Period</h3>
            <p className="text-xs text-slate-500 mt-1">Snap a photo of your plate or search the database to log your pregnancy nutrition.</p>
          </div>
          <button
            onClick={onOpenScanner}
            className="py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-100 inline-flex items-center gap-2 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Open Food Scanner</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map((meal, mIdx) => (
            <div 
              key={meal.id ? `${meal.id}_${mIdx}` : `meal_${mIdx}`}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {meal.foodImage ? (
                    <img 
                      src={meal.foodImage} 
                      alt={meal.mealType} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                      🍲
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100">
                        {meal.mealType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {meal.time || '12:30 PM'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">
                      {meal.foodNames.join(', ')}
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {meal.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* QUICK MACROS BAR */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Calories</p>
                  <p className="text-xs font-black text-slate-800">{meal.nutrients.calories} kcal</p>
                </div>
                <div className="p-2 bg-blue-50/60 rounded-xl">
                  <p className="text-[10px] text-blue-600 font-bold uppercase">Protein</p>
                  <p className="text-xs font-black text-blue-900">{meal.nutrients.protein}g</p>
                </div>
                <div className="p-2 bg-amber-50/60 rounded-xl">
                  <p className="text-[10px] text-amber-600 font-bold uppercase">Iron</p>
                  <p className="text-xs font-black text-amber-900">{meal.nutrients.iron}mg</p>
                </div>
                <div className="p-2 bg-purple-50/60 rounded-xl">
                  <p className="text-[10px] text-purple-600 font-bold uppercase">Calcium</p>
                  <p className="text-xs font-black text-purple-900">{meal.nutrients.calcium}mg</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Source: {meal.source || 'ICMR-NIN IFCT'}</span>
                <button
                  onClick={() => setSelectedMealForDetail(meal)}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Micro-Nutrients
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL NUTRIENT DETAIL MODAL */}
      {selectedMealForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 text-lg">
                  📊
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {selectedMealForDetail.mealType} Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMealForDetail.date} at {selectedMealForDetail.time}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMealForDetail(null)}
                className="p-2 hover:bg-slate-200/70 rounded-full text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Confirmed Items in this meal */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Foods in this Meal</h4>
                <div className="space-y-1.5">
                  {selectedMealForDetail.items?.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{item.name}</span>
                      <span className="text-pink-600 font-bold">{item.quantity} {item.unit}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-600">{selectedMealForDetail.foodNames.join(', ')}</p>
                  )}
                </div>
              </div>

              {/* TABS FOR MICRONUTRIENTS */}
              <div className="space-y-3">
                <div className="flex gap-2 border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setActiveNutrientTab('macros')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeNutrientTab === 'macros'
                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Macronutrients
                  </button>
                  <button
                    onClick={() => setActiveNutrientTab('vitamins')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeNutrientTab === 'vitamins'
                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Vitamins
                  </button>
                  <button
                    onClick={() => setActiveNutrientTab('minerals')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeNutrientTab === 'minerals'
                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Minerals
                  </button>
                </div>

                {activeNutrientTab === 'vitamins' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { name: 'Vitamin A', val: selectedMealForDetail.nutrients.vitaminA, unit: 'mcg' },
                      { name: 'Thiamine (B1)', val: selectedMealForDetail.nutrients.vitaminB1, unit: 'mg' },
                      { name: 'Riboflavin (B2)', val: selectedMealForDetail.nutrients.vitaminB2, unit: 'mg' },
                      { name: 'Niacin (B3)', val: selectedMealForDetail.nutrients.vitaminB3, unit: 'mg' },
                      { name: 'Pyridoxine (B6)', val: selectedMealForDetail.nutrients.vitaminB6, unit: 'mg' },
                      { name: 'Folate (B9)', val: selectedMealForDetail.nutrients.vitaminB9, unit: 'mcg' },
                      { name: 'Vitamin B12', val: selectedMealForDetail.nutrients.vitaminB12, unit: 'mcg' },
                      { name: 'Vitamin C', val: selectedMealForDetail.nutrients.vitaminC, unit: 'mg' },
                      { name: 'Vitamin D', val: selectedMealForDetail.nutrients.vitaminD, unit: 'mcg' },
                      { name: 'Vitamin E', val: selectedMealForDetail.nutrients.vitaminE, unit: 'mg' },
                      { name: 'Vitamin K', val: selectedMealForDetail.nutrients.vitaminK, unit: 'mcg' }
                    ].map((v, i) => (
                      <div key={i} className="p-2.5 bg-slate-50/80 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">{v.name}</span>
                        <span className="text-slate-800 font-bold">{v.val} {v.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeNutrientTab === 'minerals' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { name: 'Calcium', val: selectedMealForDetail.nutrients.calcium, unit: 'mg' },
                      { name: 'Iron', val: selectedMealForDetail.nutrients.iron, unit: 'mg' },
                      { name: 'Magnesium', val: selectedMealForDetail.nutrients.magnesium, unit: 'mg' },
                      { name: 'Potassium', val: selectedMealForDetail.nutrients.potassium, unit: 'mg' },
                      { name: 'Zinc', val: selectedMealForDetail.nutrients.zinc, unit: 'mg' },
                      { name: 'Phosphorus', val: selectedMealForDetail.nutrients.phosphorus, unit: 'mg' },
                      { name: 'Selenium', val: selectedMealForDetail.nutrients.selenium, unit: 'mcg' },
                      { name: 'Iodine', val: selectedMealForDetail.nutrients.iodine, unit: 'mcg' }
                    ].map((m, i) => (
                      <div key={i} className="p-2.5 bg-slate-50/80 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">{m.name}</span>
                        <span className="text-slate-800 font-bold">{m.val} {m.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeNutrientTab === 'macros' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Calories</span>
                      <span className="text-slate-800 font-bold">{selectedMealForDetail.nutrients.calories} kcal</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Protein</span>
                      <span className="text-slate-800 font-bold">{selectedMealForDetail.nutrients.protein} g</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Carbohydrates</span>
                      <span className="text-slate-800 font-bold">{selectedMealForDetail.nutrients.carbohydrates} g</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Dietary Fiber</span>
                      <span className="text-slate-800 font-bold">{selectedMealForDetail.nutrients.fiber} g</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Fat</span>
                      <span className="text-slate-800 font-bold">{selectedMealForDetail.nutrients.fat} g</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Choline</span>
                      <span className="text-slate-800 font-bold">{selectedMealForDetail.nutrients.choline} mg</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
