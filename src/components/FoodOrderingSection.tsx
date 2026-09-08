import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  MapPin, 
  Utensils, 
  Apple, 
  Store, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GlobalLocationState } from '../types';
import { 
  classifyFoodForOrdering, 
  formatLocationLabel, 
  navigateToExternalPlatform, 
  DELIVERY_PLATFORMS, 
  DeliveryPlatform 
} from '../services/foodOrderingService';

interface FoodOrderingSectionProps {
  foodName: string;
  category?: string;
  ingredients?: Array<string | { name: string; quantity?: number; unit?: string }>;
  tags?: string[];
  location?: GlobalLocationState;
  variant?: 'modal' | 'card' | 'embedded';
  className?: string;
}

export const FoodOrderingSection: React.FC<FoodOrderingSectionProps> = ({
  foodName,
  category,
  ingredients = [],
  tags = [],
  location,
  variant = 'modal',
  className = ''
}) => {
  const [showIngredientsList, setShowIngredientsList] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Classify food item dynamically
  const classification = classifyFoodForOrdering({
    name: foodName,
    category,
    ingredients,
    tags
  });

  const locationInfo = formatLocationLabel(location);

  // Extract clean ingredient names
  const cleanIngredients = ingredients.map(ing => {
    if (typeof ing === 'string') return ing.trim();
    if (ing && typeof ing === 'object' && ing.name) return ing.name.trim();
    return '';
  }).filter(Boolean);

  const handlePlatformClick = (platform: DeliveryPlatform, queryOverride?: string) => {
    const query = queryOverride || selectedIngredient || classification.formattedSearchTerm;
    
    // Trigger external navigation
    navigateToExternalPlatform(platform, query, location);

    // Provide immediate user feedback inside app
    setToastMessage(`Opening ${platform.name} search for "${query}" near ${locationInfo.shortLocation}...`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={`rounded-3xl border border-[#959D90] bg-[#E8D9CD] p-5 sm:p-6 space-y-4 shadow-xs ${className}`}>
      
      {/* 1. Header with Location Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#959D90]/40 pb-3.5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#523D35] uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-[#523D35]" />
            <span>Find or Order This Food</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#223030] mt-0.5 flex items-center gap-1.5">
            <span>Find {classification.formattedSearchTerm} near {locationInfo.shortLocation}</span>
          </h3>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EFEFE9] border border-[#959D90]/50 text-[11px] font-bold text-[#523D35] self-start sm:self-center">
          <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
          <span className="truncate max-w-[200px]" title={locationInfo.fullLocation}>
            {locationInfo.fullLocation}
          </span>
        </div>
      </div>

      {/* 2. Neutral Informative Notice */}
      <div className="flex items-center justify-between gap-2 text-xs text-[#523D35] bg-[#EFEFE9] p-3 rounded-2xl border border-[#959D90]/30">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#523D35] shrink-0" />
          <p className="text-[11px] leading-snug">
            {classification.isCooked 
              ? 'Looking for this prepared dish from local kitchens or raw ingredients to cook at home?' 
              : 'Looking for farm-fresh fruits, vegetables or pantry staples from nearby grocery platforms?'}
          </p>
        </div>
        <span className="text-[10px] font-black uppercase text-[#959D90] shrink-0 hidden sm:inline">
          External Navigation
        </span>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3 bg-[#223030] text-[#EFEFE9] rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#BBA58F]" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-[#BBA58F]">Opening in new tab</span>
        </div>
      )}

      {/* 3. READY-TO-EAT / COOKED DISH ORDERING */}
      {classification.isCooked && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#223030] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#523D35]" />
              <span>Prepared Meal Delivery Platforms</span>
            </span>
            <span className="text-[10px] font-bold text-[#523D35]">Restaurant &amp; Dining</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classification.readyMealPlatforms.map(platform => (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformClick(platform)}
                className="p-3.5 rounded-2xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 border border-[#959D90]/60 transition-all flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#223030]">
                      {platform.neutralActionLabel}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#523D35] group-hover:text-[#223030] transition-colors" />
                  </div>
                  <p className="text-[11px] text-[#523D35] font-medium">
                    {platform.tagline}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-[#523D35] text-[#E8D9CD] text-[10px] font-black tracking-wide shrink-0">
                  Search
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. RECIPE INGREDIENT ORDERING & GROCERY PLATFORMS */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#223030] flex items-center gap-1.5">
            <Apple className="w-3.5 h-3.5 text-[#523D35]" />
            <span>
              {classification.isCooked 
                ? 'Cook at Home: Buy Recipe Ingredients' 
                : 'Raw Food & Grocery Delivery Options'}
            </span>
          </span>

          {cleanIngredients.length > 0 && (
            <button
              type="button"
              onClick={() => setShowIngredientsList(!showIngredientsList)}
              className="text-xs font-black text-[#523D35] hover:text-[#223030] flex items-center gap-1 cursor-pointer underline"
            >
              <span>{showIngredientsList ? 'Hide Ingredients' : 'View Ingredients List'}</span>
              {showIngredientsList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Collapsible Ingredients Breakdown */}
        {showIngredientsList && cleanIngredients.length > 0 && (
          <div className="bg-[#EFEFE9] rounded-2xl p-4 border border-[#959D90]/50 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#223030]">
                Select an ingredient to search specifically:
              </span>
              {selectedIngredient && (
                <button
                  type="button"
                  onClick={() => setSelectedIngredient(null)}
                  className="text-[10px] font-bold text-[#523D35] hover:underline"
                >
                  Reset selection
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {cleanIngredients.map((ing, idx) => {
                const isSelected = selectedIngredient === ing;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIngredient(isSelected ? null : ing)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-[#223030] text-[#EFEFE9] shadow-xs' 
                        : 'bg-[#E8D9CD] text-[#223030] hover:bg-[#BBA58F]/40 border border-[#959D90]/40'
                    }`}
                  >
                    <span>{ing}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#BBA58F]" />}
                  </button>
                );
              })}
            </div>

            {selectedIngredient && (
              <p className="text-[11px] text-[#523D35] font-semibold bg-[#E8D9CD] p-2 rounded-xl">
                Targeting ingredient: <strong className="text-[#223030]">"{selectedIngredient}"</strong>. Click any grocery app below to search for this item.
              </p>
            )}
          </div>
        )}

        {/* Supported Grocery Delivery Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {classification.groceryPlatforms.slice(0, 4).map(platform => (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformClick(platform)}
              className="p-3 rounded-2xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 border border-[#959D90]/60 transition-all flex flex-col justify-between group cursor-pointer text-left space-y-1.5"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-[#223030]">
                  {platform.neutralActionLabel}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#523D35] group-hover:text-[#223030]" />
              </div>
              <p className="text-[10px] text-[#523D35] leading-tight line-clamp-2">
                {platform.tagline}
              </p>
              <span className="text-[10px] font-bold text-[#523D35] pt-0.5 flex items-center gap-1">
                <span>Search</span>
                <ArrowRight className="w-3 h-3 text-[#523D35]" />
              </span>
            </button>
          ))}
        </div>

        {/* Local Store & Market Finder (crucial for taluk/rural areas like Hullahalli / Nanjangud) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => handlePlatformClick(DELIVERY_PLATFORMS.local_grocery)}
            className="w-full p-3 rounded-2xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 border border-[#959D90]/60 transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#523D35]" />
              <div className="text-left">
                <span className="text-xs font-bold text-[#223030] block">
                  Find Nearby Grocery Stores &amp; Produce Markets
                </span>
                <span className="text-[10px] text-[#523D35]">
                  Search local mandis, vegetable vendors and kirana stores near {locationInfo.shortLocation} on Maps
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#523D35] group-hover:text-[#223030]" />
          </button>
        </div>
      </div>

      {/* 5. Safe Recommendation Platform Disclaimer */}
      <div className="pt-2 border-t border-[#959D90]/30 text-[10px] text-[#523D35] leading-relaxed">
        <p>
          * <strong>Transparency Note:</strong> PregNutri AI is an educational maternal nutrition guide and does not sell, prepare, or deliver food items. All links open official external food and grocery applications to search for available dishes or ingredients near your location. Availability, pricing, and hygiene certifications are managed directly by external providers.
        </p>
      </div>

    </div>
  );
};
