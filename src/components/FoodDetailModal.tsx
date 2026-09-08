import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Apple, 
  Droplet, 
  Clock, 
  Sparkles, 
  Check, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { VerifiedFoodImage } from './VerifiedFoodImage';
import { RegionalRecipe } from '../data/regional_recipes_db';
import { DualFoodName, DualText } from '../services/language_service';
import { FoodOrderingSection } from './FoodOrderingSection';
import { useAppContext } from '../context/AppContext';

interface FoodDetailModalProps {
  recipe: RegionalRecipe | null;
  onClose: () => void;
  onLogDish?: (recipe: RegionalRecipe) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  recipe,
  onClose,
  onLogDish
}) => {
  const { globalLocation } = useAppContext();
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#E8D9CD] w-full max-w-2xl rounded-3xl border border-[#959D90] shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header with Close */}
        <div className="relative aspect-video w-full bg-[#223030]">
          <VerifiedFoodImage
            src={recipe.referenceImageUrl}
            alt={recipe.traditionalName}
            dishName={recipe.traditionalName}
            showAttribution={true}
            sourceLabel={recipe.referenceImageSource}
            licenseLabel={recipe.referenceImageLicense}
            sourceUrl={recipe.sourceReference}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#223030]/80 hover:bg-[#223030] text-[#EFEFE9] flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 shadow-xs">
              Safe in Pregnancy
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Header Titles */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#523D35] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
              <span>{recipe.city ? `${recipe.city}, ` : ''}{recipe.state} • {recipe.region} India</span>
            </div>
            <DualFoodName
              foodName={recipe.traditionalName}
              className="text-2xl font-extrabold text-[#223030] mt-1"
              miniClassName="text-sm font-semibold text-[#523D35] mt-0.5"
            />
            <p className="text-sm text-[#523D35] mt-2 leading-relaxed">
              {recipe.englishDescription}
            </p>
          </div>

          {/* Key Nutrition Breakdown Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#223030] uppercase tracking-wider">
              Nutritional Values (Per Standard Serving)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center text-[#523D35] mb-1">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#523D35]">Calories</div>
                <div className="text-base font-extrabold text-[#223030] mt-0.5">{Math.round(recipe.nutrition.calories)} kcal</div>
              </div>

              <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center text-[#523D35] mb-1">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#523D35]">Protein</div>
                <div className="text-base font-extrabold text-[#223030] mt-0.5">{Math.round(recipe.nutrition.protein)}g</div>
              </div>

              <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center text-[#523D35] mb-1">
                  <Wheat className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#523D35]">Carbohydrates</div>
                <div className="text-base font-extrabold text-[#223030] mt-0.5">{Math.round(recipe.nutrition.carbohydrates)}g</div>
              </div>

              <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center text-[#523D35] mb-1">
                  <Apple className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#523D35]">Dietary Fibre</div>
                <div className="text-base font-extrabold text-[#223030] mt-0.5">{Math.round(recipe.nutrition.fiber)}g</div>
              </div>

            </div>
          </div>

          {/* Health Benefits */}
          {recipe.pregnancyNutritionNotes && recipe.pregnancyNutritionNotes.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-[#223030] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#523D35]" />
                <span>Maternal Health Benefits</span>
              </h3>
              <ul className="space-y-2">
                {recipe.pregnancyNutritionNotes.map((benefit, i) => (
                  <li key={i} className="text-xs text-[#223030] flex items-start gap-2 bg-[#EFEFE9] p-2.5 rounded-xl border border-[#959D90]/40">
                    <Check className="w-3.5 h-3.5 text-[#523D35] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#223030] uppercase tracking-wider">
                Traditional Ingredients
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#EFEFE9] border border-[#959D90]/40 rounded-lg text-xs text-[#223030] font-medium">
                    {ing.name} {ing.quantity ? `(${ing.quantity}${ing.unit || 'g'})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Serving & Cautions */}
          <div className="bg-[#EFEFE9] border border-[#959D90] rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#523D35]">
              <Info className="w-4 h-4" />
              <span>Recommended Serving & Safety Caution</span>
            </div>
            <p className="text-xs text-[#223030] leading-relaxed">
              {recipe.foodSafety?.explanation || 'Ensure ingredients are thoroughly cooked in hygienic conditions. Prepare with moderate pure cow ghee and avoid excessive red chilli powder.'}
            </p>
          </div>

          {/* Location-Aware External Ordering & Ingredients Purchase Section */}
          <FoodOrderingSection
            foodName={recipe.traditionalName}
            category={recipe.category}
            ingredients={recipe.ingredients}
            tags={recipe.regionalTags}
            location={globalLocation}
          />

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#EFEFE9] border-t border-[#959D90]/40 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#959D90]/50 bg-[#E8D9CD] text-xs font-semibold text-[#523D35] hover:text-[#223030] hover:bg-[#BBA58F]/30 transition-colors cursor-pointer"
          >
            Close
          </button>
          {onLogDish && (
            <button
              onClick={() => {
                onLogDish(recipe);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Add to Today's Meals</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
