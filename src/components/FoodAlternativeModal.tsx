import React from 'react';
import { KaggleFoodItem, PlannedMeal } from '../types';
import { useAppContext } from '../context/AppContext';
import { findFoodAlternatives, FoodAlternativeResult } from '../utils/food_alternatives';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from '../services/kaggle_food_pipeline';
import { X, ArrowRight, ShieldCheck, Sparkles, MapPin, Plus, Check } from 'lucide-react';
import { DualFoodName } from '../services/language_service';

interface FoodAlternativeModalProps {
  targetFood: {
    id?: string;
    name: string;
    category?: string;
    calories?: number;
    protein?: number;
    iron?: number;
    calcium?: number;
    folate?: number;
    ingredients?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative?: (altFood: KaggleFoodItem) => void;
}

export const FoodAlternativeModal: React.FC<FoodAlternativeModalProps> = ({
  targetFood,
  isOpen,
  onClose,
  onSelectAlternative
}) => {
  const { userProfile, globalLocation, selectedTrimester, openAddToPlanModal } = useAppContext();

  if (!isOpen || !targetFood) return null;

  const alternatives: FoodAlternativeResult[] = findFoodAlternatives(
    targetFood,
    KAGGLE_PROCESSED_FOOD_DATABASE,
    userProfile,
    globalLocation,
    selectedTrimester
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#223030]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#959D90]/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Smart Food Substitution</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#223030] tracking-tight">
              Alternatives for {targetFood.name}
            </h2>
            <p className="text-xs text-[#523D35] mt-1">
              These alternatives provide similar nutrients and may be easier to find in your region.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original food recap */}
        <div className="bg-[#E8D9CD] p-3.5 rounded-2xl border border-[#959D90]/40 flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#523D35] font-bold uppercase tracking-wider block">
              Original Recommended Food
            </span>
            <span className="font-extrabold text-[#223030] text-sm">{targetFood.name}</span>
            {targetFood.category && (
              <span className="text-xs text-[#523D35] ml-2">({targetFood.category})</span>
            )}
          </div>
          <div className="text-right font-medium text-[#523D35] text-[11px]">
            <span>Filter Active: </span>
            <span className="font-bold text-[#223030]">
              {userProfile.allergies && userProfile.allergies.length > 0
                ? 'Allergy-Safe (No ' + userProfile.allergies.join(', ') + ')'
                : 'Safe for ' + selectedTrimester}
            </span>
          </div>
        </div>

        {/* Alternatives list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#523D35] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#523D35]" />
              <span>Recommended Safe Alternatives ({alternatives.length} Found)</span>
            </h3>
            <span className="text-[11px] text-[#523D35]">
              📍 Prioritizing {globalLocation.state} availability
            </span>
          </div>

          {alternatives.length === 0 ? (
            <div className="bg-[#E8D9CD] p-6 rounded-2xl text-center text-xs text-[#523D35]">
              No direct regional alternatives found with the current strict filters. Please check all food categories in Food Explorer.
            </div>
          ) : (
            <div className="space-y-3.5">
              {alternatives.map((item, idx) => {
                const food = item.food;
                return (
                  <div
                    key={food.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#E8D9CD] border border-[#959D90]/60 hover:border-[#523D35] transition shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#223030] text-[#EFEFE9] font-black">
                            ✓ {food.safetyLevel}
                          </span>
                          <span className="text-xs font-bold text-[#523D35] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#523D35]" />
                            {food.cuisine} Cuisine
                          </span>
                        </div>

                        <DualFoodName
                          foodName={food.name}
                          className="text-base font-black text-[#223030]"
                          miniClassName="text-xs font-semibold text-[#523D35]"
                        />
                        <p className="text-xs text-[#523D35] mt-1 leading-relaxed">
                          {item.similarityReason}
                        </p>

                        {/* Explicit Why It's a Good Alternative Badges */}
                        {item.nutritionalHighlights && item.nutritionalHighlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.nutritionalHighlights.map((hl, hIdx) => (
                              <span
                                key={hIdx}
                                className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30"
                              >
                                ✓ {hl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectAlternative) {
                              onSelectAlternative(food);
                            }
                            onClose();
                            openAddToPlanModal(food);
                          }}
                          className="px-3.5 py-2 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                          <span>+ Add to Plan</span>
                        </button>
                      </div>
                    </div>

                    {/* Nutrient badges & local note */}
                    <div className="pt-2 border-t border-[#959D90]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-[#EFEFE9] text-[#223030] font-black rounded-lg border border-[#959D90]/40 text-[11px]">
                          {food.calories} kcal
                        </span>
                        <span className="px-2 py-0.5 bg-[#EFEFE9] text-[#523D35] font-bold rounded-lg border border-[#959D90]/40 text-[11px]">
                          {food.protein}g Protein
                        </span>
                        <span className="px-2 py-0.5 bg-[#EFEFE9] text-[#523D35] font-bold rounded-lg border border-[#959D90]/40 text-[11px]">
                          {food.iron}mg Iron
                        </span>
                        <span className="px-2 py-0.5 bg-[#EFEFE9] text-[#523D35] font-bold rounded-lg border border-[#959D90]/40 text-[11px]">
                          {food.calcium}mg Calcium
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-[#523D35] italic">
                        {item.localRelevance}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-[#959D90]/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#523D35] hover:bg-[#E8D9CD] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
