import React, { useState } from 'react';
import { UserProfile, PlannedMeal, KaggleFoodItem, GlobalLocationState } from '../types';
import { LocationNutritionEngine } from '../services/location_nutrition_engine';
import { useAppContext } from '../context/AppContext';
import {
  MapPin,
  Sparkles,
  Flame,
  Dna,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  Heart,
  Info,
  Layers,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { NavTabId } from './MainNavigation';
import { DualFoodName, DualText, useLanguage } from '../services/language_service';

interface LocationMaternalNutritionSectionProps {
  profile?: UserProfile;
  globalLocation?: GlobalLocationState;
  onAddMeal?: (meal: Omit<PlannedMeal, 'id'>) => void;
  onSelectTab?: (tabId: NavTabId) => void;
}

export const LocationMaternalNutritionSection: React.FC<LocationMaternalNutritionSectionProps> = ({
  profile: propProfile,
  globalLocation: propLocation,
  onSelectTab: propSelectTab
}) => {
  const {
    userProfile: ctxProfile,
    globalLocation: ctxLocation,
    selectedTrimester,
    openAddToPlanModal,
    setActiveTab
  } = useAppContext();

  const profile = propProfile || ctxProfile;
  const globalLocation = propLocation || ctxLocation;
  const handleSelectTab = propSelectTab || setActiveTab;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get dynamically ranked Kaggle dataset for active Global Location & Trimester
  const rankedResult = LocationNutritionEngine.getRankedFoods(
    globalLocation,
    selectedTrimester,
    profile.dietPreference,
    '',
    selectedCategory,
    'Safe'
  );

  const categories = [
    'All',
    'Millets & Grains',
    'Pulses & Legumes',
    'Vegetables & Greens',
    'Traditional Dishes',
    'Dairy',
    'Eggs & Poultry',
    'Snacks & Soups'
  ];

  return (
    <section className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Location Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#959D90]/30 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#523D35] text-[#E8D9CD]">
              <MapPin className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>{globalLocation.village || globalLocation.city}, {globalLocation.district || ''} ({globalLocation.state})</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8D9CD] text-[#223030]">
              {selectedTrimester} • Week {profile.weeksPregnant}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#223030] tracking-tight">
            Location-Based Maternal Nutrition &amp; Recommended Dishes
          </h2>
          <p className="text-xs sm:text-sm text-[#523D35] max-w-2xl">
            Real food and nutrition dataset dynamically filtered and prioritized for <span className="font-semibold text-[#223030]">{globalLocation.state} ({globalLocation.region})</span> to meet ICMR gestational requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSelectTab('food-database')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold transition shadow-xs whitespace-nowrap self-start md:self-center cursor-pointer"
        >
          <span>Explore Full Database</span>
          <ChevronRight className="w-4 h-4 text-[#BBA58F]" />
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                : 'bg-[#E8D9CD] text-[#523D35] hover:bg-[#BBA58F]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ranked Foods Grid (Top Recommended for this Location) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankedResult.items.slice(0, 6).map((food) => {
          return (
            <div
              key={food.id}
              className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-4 flex flex-col justify-between hover:border-[#523D35] transition shadow-xs"
            >
              <div className="space-y-3">
                {/* Priority & Cuisine Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      food.recommendationPriority === 1
                        ? 'bg-[#523D35] text-[#E8D9CD]'
                        : food.recommendationPriority === 2
                        ? 'bg-[#959D90] text-[#223030]'
                        : 'bg-[#BBA58F] text-[#223030]'
                    }`}
                  >
                    {food.recommendationPriority === 1 && '📍 Local Staple'}
                    {food.recommendationPriority === 2 && '🗺️ Regional'}
                    {food.recommendationPriority === 3 && '🇮🇳 National RDA'}
                    {food.recommendationPriority === 4 && '🥗 Nutritious'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#523D35]">
                    {food.cuisine} Cuisine
                  </span>
                </div>

                {/* Food Title & Regional Name */}
                <div>
                  <DualFoodName
                    foodName={food.name}
                    className="text-sm font-black text-[#223030] leading-snug"
                    miniClassName="text-xs text-[#523D35] font-medium mt-0.5"
                  />
                </div>

                {/* Why Recommended Explanation */}
                {food.whyRecommended && (
                  <div className="bg-[#EFEFE9] border border-[#959D90]/30 rounded-xl p-2.5 text-[11px] text-[#523D35] leading-relaxed">
                    <p>{food.whyRecommended}</p>
                  </div>
                )}

                {/* Nutrient Badges */}
                <div className="grid grid-cols-4 gap-1 text-center pt-1">
                  <div className="bg-[#EFEFE9] rounded-lg p-1.5 border border-[#959D90]/40">
                    <span className="text-[9px] text-[#959D90] font-bold block uppercase">Energy</span>
                    <span className="text-xs font-black text-[#223030]">{food.calories}</span>
                    <span className="text-[9px] text-[#523D35] block">kcal</span>
                  </div>
                  <div className="bg-[#EFEFE9] rounded-lg p-1.5 border border-[#959D90]/40">
                    <span className="text-[9px] text-[#959D90] font-bold block uppercase">Protein</span>
                    <span className="text-xs font-black text-[#223030]">{food.protein}</span>
                    <span className="text-[9px] text-[#523D35] block">g</span>
                  </div>
                  <div className="bg-[#EFEFE9] rounded-lg p-1.5 border border-[#959D90]/40">
                    <span className="text-[9px] text-[#959D90] font-bold block uppercase">Iron</span>
                    <span className="text-xs font-black text-[#223030]">{food.iron}</span>
                    <span className="text-[9px] text-[#523D35] block">mg</span>
                  </div>
                  <div className="bg-[#EFEFE9] rounded-lg p-1.5 border border-[#959D90]/40">
                    <span className="text-[9px] text-[#959D90] font-bold block uppercase">Calcium</span>
                    <span className="text-xs font-black text-[#223030]">{food.calcium}</span>
                    <span className="text-[9px] text-[#523D35] block">mg</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2 border-t border-[#959D90]/30 flex items-center justify-between">
                <span className="text-[11px] text-[#523D35] font-medium">
                  {food.servingSize || '1 Serving (~150g)'}
                </span>
                <button
                  type="button"
                  onClick={() => openAddToPlanModal(food)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                  <span>+ Add to Plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
