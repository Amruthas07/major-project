import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  ExternalLink,
  Store,
  MapPin,
  Utensils,
  Leaf,
  Search,
  CheckCircle2,
  Info,
  ArrowRight
} from 'lucide-react';
import { GlobalLocationState } from '../types';
import { useLanguage, DualFoodName, FoodSubtitle } from '../services/language_service';

export interface FoodOrderingModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: {
    id?: string;
    name: string;
    regionalName?: string;
    image?: string;
    category?: string;
    cuisine?: string;
    isVegetarian?: boolean;
    ingredients?: string[] | Array<{ name: string; quantity?: number; unit?: string }>;
    state?: string;
    region?: string;
  } | null;
  globalLocation?: GlobalLocationState;
  onNavigateToFullOrdering?: () => void;
}

export function cleanFoodSearchTerm(name: string): string {
  if (!name) return '';
  // Remove parenthetical translations, e.g. "Mosaru Anna (Tempered Curd Rice)" -> "Mosaru Anna" or "Curd Rice"
  // Keep meaningful search terms
  const parts = name.split(/[()]/).map(s => s.trim()).filter(Boolean);
  // Prefer the primary or English part that is most recognizable to delivery apps
  const first = parts[0] || name;
  return first.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function cleanIngredientSearchTerm(ing: string): string {
  if (!ing) return '';
  // Remove quantities or instructions like "1 cup", "finely chopped", "to taste"
  return ing
    .replace(/\b\d+(\.\d+)?\s*(cup|cups|tbsp|tsp|g|gm|kg|ml|pinch|to taste|leaves|cloves|chopped|diced|sliced|roasted)\b/gi, '')
    .replace(/[(),]/g, '')
    .trim();
}

export const FoodOrderingModal: React.FC<FoodOrderingModalProps> = ({
  isOpen,
  onClose,
  food,
  globalLocation,
  onNavigateToFullOrdering
}) => {
  const { t } = useLanguage();
  const [customIngredient, setCustomIngredient] = useState('');

  if (!isOpen || !food) return null;

  const rawFoodName = food.name;
  const primarySearchTerm = cleanFoodSearchTerm(rawFoodName);
  const locationCity = globalLocation?.city || globalLocation?.district || 'Nearby';
  const locationState = globalLocation?.state || 'Local Region';

  // Normalize ingredients array into clean strings
  const ingredientList: string[] = (food.ingredients || []).map(ing => {
    if (typeof ing === 'string') return cleanIngredientSearchTerm(ing);
    if (ing && typeof ing === 'object' && ing.name) return cleanIngredientSearchTerm(ing.name);
    return '';
  }).filter(Boolean);

  const handleOpenSwiggy = (query?: string) => {
    const q = encodeURIComponent(query || primarySearchTerm);
    const url = `https://www.swiggy.com/search?query=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenZomato = (query?: string) => {
    const q = encodeURIComponent(query || primarySearchTerm);
    const url = `https://www.zomato.com/search?q=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenBlinkit = (ingredientName: string) => {
    const q = encodeURIComponent(ingredientName.trim());
    const url = `https://blinkit.com/s/?q=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#EFEFE9] rounded-3xl overflow-hidden shadow-2xl border border-[#959D90]/60 my-4 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 bg-[#223030] text-[#EFEFE9] border-b border-[#959D90]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#523D35] flex items-center justify-center text-[#E8D9CD] border border-[#BBA58F]/40 shadow-xs">
              <ShoppingBag className="w-5 h-5 text-[#BBA58F]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#BBA58F] block">
                {t('ordering.module', 'Food Ordering Module')}
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#EFEFE9] leading-tight">
                {t('ordering.orderExternal', 'Order & Buy Food Externally')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#223030]/80 hover:bg-[#523D35] text-[#EFEFE9] flex items-center justify-center transition cursor-pointer border border-[#959D90]/30"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Target Food Card */}
          <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-4 flex items-center gap-4">
            {food.image ? (
              <img
                src={food.image}
                alt={food.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#959D90]/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[#223030] text-[#E8D9CD] flex items-center justify-center shrink-0">
                <Utensils className="w-8 h-8 opacity-60" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    food.isVegetarian !== false
                      ? 'bg-emerald-800 text-white'
                      : 'bg-rose-800 text-white'
                  }`}
                >
                  {food.isVegetarian !== false ? t('common.veg', 'Vegetarian') : t('common.nonVeg', 'Non-Vegetarian')}
                </span>
                <span className="text-[11px] font-bold text-[#523D35] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#523D35]" />
                  <span>{locationCity}, {locationState}</span>
                </span>
              </div>
              <h3 className="text-base font-black text-[#223030] truncate">
                {food.name}
              </h3>
              <FoodSubtitle
                foodName={food.name}
                regionalName={food.regionalName}
                className="text-xs text-[#523D35] truncate"
              />
            </div>
          </div>

          {/* SECTION A: PREPARED RESTAURANT FOOD (Swiggy & Zomato) */}
          <div className="border border-[#959D90]/60 rounded-2xl p-5 bg-[#EFEFE9] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#523D35]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#223030]">
                  {t('ordering.categoryPrepared', 'Category A: Prepared Restaurant Food')}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                {t('ordering.cookedMeals', 'Cooked Meals')}
              </span>
            </div>

            <p className="text-xs text-[#523D35] leading-relaxed">
              Search authentic, freshly cooked <strong className="text-[#223030]">&ldquo;{primarySearchTerm}&rdquo;</strong> on official delivery platforms near {locationCity}.
            </p>

            {/* Official Swiggy & Zomato Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Swiggy Button */}
              <button
                type="button"
                onClick={() => handleOpenSwiggy()}
                className="group p-3.5 bg-[#FC8019] hover:bg-[#E26A05] text-white rounded-xl font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-sm">{t('ordering.orderSwiggy', 'Order on Swiggy')}</span>
                    <span className="block text-[10px] text-white/90">Search &ldquo;{primarySearchTerm}&rdquo;</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition" />
              </button>

              {/* Zomato Button */}
              <button
                type="button"
                onClick={() => handleOpenZomato()}
                className="group p-3.5 bg-[#E23744] hover:bg-[#C92C38] text-white rounded-xl font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-sm">{t('ordering.orderZomato', 'Order on Zomato')}</span>
                    <span className="block text-[10px] text-white/90">Search &ldquo;{primarySearchTerm}&rdquo;</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            <div className="text-[11px] text-[#523D35] flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-[#523D35] shrink-0" />
              <span>Real-time restaurant listings, current menu prices, and delivery times are directly provided by the official apps.</span>
            </div>
          </div>

          {/* SECTION B: GROCERIES & INGREDIENTS (Blinkit) */}
          <div className="border border-[#959D90]/60 rounded-2xl p-5 bg-[#EFEFE9] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#523D35]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#223030]">
                  {t('ordering.categoryGroceries', 'Category B: Raw Kitchen Ingredients (Groceries)')}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-[#523D35] bg-[#E8D9CD] px-2 py-0.5 rounded-md">
                {t('ordering.quickCommerce', 'Quick Commerce')}
              </span>
            </div>

            <p className="text-xs text-[#523D35] leading-relaxed">
              Prefer cooking at home? Order verified raw staples and ingredients for this dish from <strong>Blinkit</strong> (10-15 minute grocery dark stores):
            </p>

            {/* Ingredients Pills */}
            {ingredientList.length > 0 ? (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold uppercase text-[#523D35] tracking-wider block">
                  {t('ordering.clickIngredient', 'Click any ingredient to search on Blinkit:')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {ingredientList.map((ing, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpenBlinkit(ing)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8CB46] hover:bg-[#E5B834] text-[#1E1E1E] font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer border border-[#D8A720]"
                      title={`Search "${ing}" on Blinkit`}
                    >
                      <Store className="w-3 h-3 text-[#1E1E1E]" />
                      <span>{ing}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-[#1E1E1E]/70" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#523D35] italic">
                Raw ingredients can be searched directly using the input below.
              </div>
            )}

            {/* Custom Ingredient Search on Blinkit */}
            <div className="pt-2 border-t border-[#959D90]/30 space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#523D35] tracking-wider block">
                {t('ordering.categoryGroceries', 'Search Any Grocery or Raw Ingredient on Blinkit:')}
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customIngredient}
                  onChange={e => setCustomIngredient(e.target.value)}
                  placeholder="e.g. Ragi flour, Curd, Mustard seeds, Toor dal..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#E8D9CD] border border-[#959D90]/50 text-xs font-semibold text-[#223030] placeholder-[#523D35]/70 focus:outline-none focus:ring-1 focus:ring-[#223030]"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && customIngredient.trim()) {
                      handleOpenBlinkit(customIngredient);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customIngredient.trim()) {
                      handleOpenBlinkit(customIngredient);
                    }
                  }}
                  disabled={!customIngredient.trim()}
                  className="px-4 py-2 bg-[#F8CB46] hover:bg-[#E5B834] text-[#1E1E1E] font-black text-xs rounded-xl shadow-2xs transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t('ordering.searchBlinkit', 'Search Blinkit')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1E1E1E]" />
                </button>
              </div>
            </div>
          </div>

          {/* Full Food Ordering Page Link */}
          {onNavigateToFullOrdering && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullOrdering();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#223030] hover:text-[#523D35] underline cursor-pointer"
              >
                <span>{t('ordering.fullDirectory', 'Go to Full Food Ordering Directory')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
