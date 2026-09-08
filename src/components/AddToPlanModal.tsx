import React, { useState, useEffect } from 'react';
import {
  useAppContext,
  DAYS_OF_WEEK,
  MEAL_CATEGORIES,
  MEAL_TIME_RANGES,
  DayOfWeek,
  MealCategory
} from '../context/AppContext';
import { useLanguage, DualText, DualFoodName } from '../services/language_service';
import {
  Calendar,
  Clock,
  Flame,
  Dumbbell,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { checkFoodAllergies } from '../utils/allergy_checker';

export const AddToPlanModal: React.FC = () => {
  const {
    isAddToPlanModalOpen,
    closeAddToPlanModal,
    modalTargetFood,
    modalPreselectedDay,
    modalPreselectedCategory,
    addFoodToPlan,
    meals,
    selectedDay,
    setSelectedDay,
    setActiveTab,
    userProfile
  } = useAppContext();

  const { t } = useLanguage();

  const [chosenDay, setChosenDay] = useState<DayOfWeek>(selectedDay);
  const [chosenCategory, setChosenCategory] = useState<MealCategory>('Breakfast');
  const [servings, setServings] = useState<number>(1);
  const [navigateAfterAdd, setNavigateAfterAdd] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [allergenConfirmed, setAllergenConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (isAddToPlanModalOpen) {
      setChosenDay(modalPreselectedDay || selectedDay || 'Monday');
      setChosenCategory(modalPreselectedCategory || 'Breakfast');
      setServings(1);
      setAddedSuccess(false);
      setAllergenConfirmed(false);
    }
  }, [isAddToPlanModalOpen, modalPreselectedDay, modalPreselectedCategory, selectedDay]);

  const allergyCheck = modalTargetFood
    ? checkFoodAllergies(modalTargetFood, userProfile.allergies)
    : { hasAllergy: false, matchedAllergens: [], matchedIngredients: [], warningMessage: '' };

  if (!isAddToPlanModalOpen || !modalTargetFood) return null;

  // Extract food nutrients
  const name = modalTargetFood.name || modalTargetFood.title || 'Selected Dish';
  const regionalName = modalTargetFood.regionalName || '';
  const baseCalories = Number(modalTargetFood.calories) || 0;
  const baseProtein = Number(modalTargetFood.protein) || 0;
  const baseIron = Number(modalTargetFood.iron) || 0;
  const baseCalcium = Number(modalTargetFood.calcium) || 0;
  const baseFolate = Number(modalTargetFood.folate) || 0;
  const servingSize = modalTargetFood.servingSize || '1 Serving (~150g)';
  const cuisine = modalTargetFood.cuisine || modalTargetFood.state || '';
  const safetyLevel = modalTargetFood.safetyLevel || 'Safe';

  // Scaled calculations
  const scaledCalories = Math.round(baseCalories * servings);
  const scaledProtein = Number((baseProtein * servings).toFixed(1));
  const scaledIron = Number((baseIron * servings).toFixed(1));
  const scaledCalcium = Math.round(baseCalcium * servings);
  const scaledFolate = Math.round(baseFolate * servings);

  // Check if item is already added to this specific chosen day and category
  const isAlreadyInSlot = meals.some(
    (m) =>
      m.day === chosenDay &&
      m.category === chosenCategory &&
      ((modalTargetFood.id && m.foodId === modalTargetFood.id) ||
        m.name.toLowerCase().trim() === name.toLowerCase().trim())
  );

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (allergyCheck.hasAllergy && !allergenConfirmed) {
      return;
    }

    addFoodToPlan({
      food: modalTargetFood,
      day: chosenDay,
      category: chosenCategory,
      servings: servings,
      customPortion: `${servings} ${servings === 1 ? 'Serving' : 'Servings'} (${servingSize})`
    });

    // Update the app's selected day so user immediately views their added food
    setSelectedDay(chosenDay);

    setAddedSuccess(true);

    setTimeout(() => {
      closeAddToPlanModal();
      if (navigateAfterAdd) {
        setActiveTab('meal-planner');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAddToPlanModal}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add to Maternal Meal Schedule</span>
          </div>

          <div>
            <DualFoodName
              foodName={name}
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
              miniClassName="text-sm font-semibold text-emerald-700 mt-0.5"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {cuisine && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {cuisine}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                safetyLevel === 'Avoid'
                  ? 'bg-rose-100 text-rose-800'
                  : safetyLevel === 'Safe in Moderation'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              ✓ {safetyLevel} in Pregnancy
            </span>
          </div>
        </div>

        <form onSubmit={handleConfirmAdd} className="space-y-5 pt-4">
          {/* Allergy Warning Banner & Confirmation */}
          {allergyCheck.hasAllergy && (
            <div className="bg-red-50 border border-red-300 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="flex items-start gap-2.5 text-red-800 font-bold">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-sm block">⚠️ Allergy Warning: Contains {allergyCheck.matchedAllergens.join(', ')}</span>
                  <p className="font-normal text-red-700 text-xs mt-0.5 leading-relaxed">
                    Your profile indicates an allergy to <span className="font-bold underline">{allergyCheck.matchedAllergens.join(', ')}</span>. Consuming this during pregnancy may cause severe allergic reactions.
                  </p>
                  {(allergyCheck.matchedIngredients || []).length > 0 && (
                    <div className="mt-1.5 text-[11px]">
                      Conflicting ingredients:{' '}
                      <span className="font-black text-red-950 bg-red-200/80 px-2 py-0.5 rounded border border-red-300">
                        {allergyCheck.matchedIngredients.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 border-t border-red-200 cursor-pointer text-red-900 font-bold text-xs select-none">
                <input
                  type="checkbox"
                  checked={allergenConfirmed}
                  onChange={(e) => setAllergenConfirmed(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <span>Confirm: I understand the allergy risk and still want to add this dish</span>
              </label>
            </div>
          )}

          {/* Step 1: Choose Day */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                1. Select Day of the Week
              </span>
              <span className="text-[11px] font-semibold text-indigo-600">
                {chosenDay}
              </span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = chosenDay === d;
                const count = meals.filter((m) => m.day === d).length;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setChosenDay(d)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-indigo-500'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                    }`}
                  >
                    <span className="text-[11px]">{d.substring(0, 3)}</span>
                    <span
                      className={`text-[9px] px-1 rounded-full ${
                        isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Meal Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                2. Select Meal Category &amp; Interval
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {chosenCategory}
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MEAL_CATEGORIES.map((cat) => {
                const isSelected = chosenCategory === cat;
                const timeInfo = MEAL_TIME_RANGES[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setChosenCategory(cat)}
                    className={`p-2.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{timeInfo.icon}</span>
                      <div>
                        <span className="text-xs font-black block leading-tight">{cat}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {timeInfo.time}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Portion / Servings with live nutrient calculation */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 block">
                  3. Serving Size &amp; Quantity
                </label>
                <span className="text-[11px] text-slate-500">
                  Standard Portion: {servingSize}
                </span>
              </div>

              {/* Servings Counter */}
              <div className="inline-flex items-center border border-slate-300 bg-white rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold text-sm"
                  aria-label="Decrease servings"
                >
                  -
                </button>
                <span className="px-3 text-xs font-black text-slate-900 min-w-[32px] text-center">
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((prev) => prev + 1)}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold text-sm"
                  aria-label="Increase servings"
                >
                  +
                </button>
              </div>
            </div>

            {/* Live Calculated Nutrients Grid */}
            <div className="grid grid-cols-5 gap-1.5 text-center pt-1 border-t border-slate-200/60">
              <div className="bg-white rounded-xl p-1.5 border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Calories</span>
                <span className="text-xs font-black text-slate-900">{scaledCalories}</span>
                <span className="text-[9px] text-slate-500 block">kcal</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Protein</span>
                <span className="text-xs font-black text-indigo-700">{scaledProtein}g</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Iron</span>
                <span className="text-xs font-black text-rose-700">{scaledIron}mg</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Calcium</span>
                <span className="text-xs font-black text-amber-700">{scaledCalcium}mg</span>
              </div>
              <div className="bg-white rounded-xl p-1.5 border border-slate-200/60 shadow-2xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Folate</span>
                <span className="text-xs font-black text-emerald-700">{scaledFolate}µg</span>
              </div>
            </div>
          </div>

          {/* Duplicate / Existing Warning Note */}
          {isAlreadyInSlot && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <span className="font-bold">ℹ️ Note:</span> This dish is already in your {chosenDay} {chosenCategory}. Adding will update your total servings.
            </div>
          )}

          {/* Navigation Option Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="navAfterAdd"
              checked={navigateAfterAdd}
              onChange={(e) => setNavigateAfterAdd(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="navAfterAdd" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Go to Meal Planner schedule after adding
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeAddToPlanModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addedSuccess || (allergyCheck.hasAllergy && !allergenConfirmed)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition ${
                addedSuccess
                  ? 'bg-emerald-700 text-white'
                  : (allergyCheck.hasAllergy && !allergenConfirmed)
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to {chosenDay}!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>
                    Add to {chosenDay} ({chosenCategory})
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
