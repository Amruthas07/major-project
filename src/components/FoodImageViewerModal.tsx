import React from 'react';
import { KaggleFoodItem } from '../types';
import {
  X,
  ShieldCheck,
  ChefHat,
  Plus,
  Flame,
  Dna,
  Sparkles,
  ExternalLink,
  MapPin,
  Heart,
  Utensils
} from 'lucide-react';
import { DualFoodName, DualText, FoodSubtitle } from '../services/language_service';
import { VerifiedFoodImage } from './VerifiedFoodImage';

interface FoodImageViewerModalProps {
  food: KaggleFoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRecipe?: (food: KaggleFoodItem) => void;
  onAddToPlan?: (food: KaggleFoodItem) => void;
}

export const FoodImageViewerModal: React.FC<FoodImageViewerModalProps> = ({
  food,
  isOpen,
  onClose,
  onViewRecipe,
  onAddToPlan
}) => {
  if (!isOpen || !food) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#EFEFE9] rounded-3xl overflow-hidden shadow-2xl border border-[#959D90]/50 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Image with Badges */}
        <div className="relative w-full h-72 sm:h-80 bg-black shrink-0 overflow-hidden">
          <VerifiedFoodImage
            src={food.image || food.imageUrl}
            alt={food.name}
            dishName={food.name}
            isVegetarian={food.isVegetarian}
            className="w-full h-full object-cover object-center"
            aspectRatio="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Dietary Pill Badge */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                food.isVegetarian
                  ? 'bg-emerald-700/90 text-white border border-emerald-400/40'
                  : 'bg-rose-800/90 text-white border border-rose-400/40'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              {food.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>

          {/* Diet and Regional Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                    food.isVegetarian
                      ? 'bg-emerald-700 text-white'
                      : 'bg-rose-700 text-white'
                  }`}
                >
                  {food.isVegetarian ? '🌱 Pure Vegetarian' : '🍗 Non-Vegetarian'}
                </span>
                <span className="text-xs font-medium text-white/90">
                  📍 {food.state} • {food.cuisine}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                <DualFoodName foodId={food.id} fallbackName={food.name} regionalName={food.regionalName} />
              </h2>
              <FoodSubtitle
                foodName={food.name}
                regionalName={food.regionalName}
                className="text-sm font-semibold text-emerald-300 drop-shadow-xs"
              />
            </div>
            <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/30 shrink-0">
              {food.servingSize || '1 Serving'}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Nutritional Highlights Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#523D35] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#523D35]" />
              Nutritional Highlights (Per Serving)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="bg-[#E8D9CD] p-3 rounded-2xl border border-[#959D90]/40 text-center">
                <span className="text-[10px] font-bold text-[#523D35] block">Calories</span>
                <span className="text-lg font-black text-[#223030]">{food.calories}</span>
                <span className="text-[10px] text-[#523D35] block font-medium">kcal</span>
              </div>
              <div className="bg-[#E8D9CD] p-3 rounded-2xl border border-[#959D90]/40 text-center">
                <span className="text-[10px] font-bold text-[#523D35] block">Protein</span>
                <span className="text-lg font-black text-[#223030]">{food.protein}</span>
                <span className="text-[10px] text-[#523D35] block font-medium">grams</span>
              </div>
              <div className="bg-[#E8D9CD] p-3 rounded-2xl border border-[#959D90]/40 text-center">
                <span className="text-[10px] font-bold text-[#523D35] block">Iron</span>
                <span className="text-lg font-black text-[#223030]">{food.iron}</span>
                <span className="text-[10px] text-[#523D35] block font-medium">mg</span>
              </div>
              <div className="bg-[#E8D9CD] p-3 rounded-2xl border border-[#959D90]/40 text-center">
                <span className="text-[10px] font-bold text-[#523D35] block">Calcium</span>
                <span className="text-lg font-black text-[#223030]">{food.calcium}</span>
                <span className="text-[10px] text-[#523D35] block font-medium">mg</span>
              </div>
              <div className="bg-[#E8D9CD] p-3 rounded-2xl border border-[#959D90]/40 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#523D35] block">Folate</span>
                <span className="text-lg font-black text-[#223030]">{food.folate}</span>
                <span className="text-[10px] text-[#523D35] block font-medium">mcg</span>
              </div>
            </div>
          </div>

          {/* Safety and Maternal Tips */}
          {food.safetyExplanation && (
            <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3.5 text-xs text-[#223030]">
              <span className="font-bold text-[#523D35] block mb-1">
                Clinical Safety Note:
              </span>
              <p className="leading-relaxed">{food.safetyExplanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {onViewRecipe && (
              <button
                onClick={() => {
                  onViewRecipe(food);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm bg-[#523D35] hover:bg-[#3D2D27] text-white shadow-md transition-colors cursor-pointer"
              >
                <ChefHat className="w-4 h-4" />
                View Full Recipe & Prep
              </button>
            )}

            {onAddToPlan && (
              <button
                onClick={() => {
                  onAddToPlan(food);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-sm bg-[#223030] hover:bg-[#152020] text-[#EFEFE9] shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add to Daily Meal Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
