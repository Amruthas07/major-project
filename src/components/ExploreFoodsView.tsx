import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  ChevronRight,
  Utensils,
  ShieldCheck,
  Info,
  Flame,
  Dumbbell,
  Wheat,
  Apple
} from 'lucide-react';
import { VerifiedFoodImage } from './VerifiedFoodImage';
import { REGIONAL_RECIPES_DATABASE, RegionalRecipe } from '../data/regional_recipes_db';
import { DualFoodName } from '../services/language_service';

interface ExploreFoodsViewProps {
  onSelectRecipe: (recipe: RegionalRecipe) => void;
}

const REGIONS = [
  'All Regions',
  'South',
  'North',
  'West',
  'East',
  'Central',
  'North-East'
];

const STATES_BY_REGION: Record<string, string[]> = {
  'South': ['All States', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'],
  'North': ['All States', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Himachal Pradesh'],
  'West': ['All States', 'Gujarat', 'Maharashtra', 'Goa'],
  'East': ['All States', 'West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
  'Central': ['All States', 'Madhya Pradesh', 'Chhattisgarh'],
  'North-East': ['All States', 'Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Sikkim']
};

export const ExploreFoodsView: React.FC<ExploreFoodsViewProps> = ({ onSelectRecipe }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);

  // Available states based on region
  const availableStates = useMemo(() => {
    if (selectedRegion === 'All Regions') return ['All States'];
    return STATES_BY_REGION[selectedRegion] || ['All States'];
  }, [selectedRegion]);

  // Reset state when region changes
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSelectedState('All States');
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return REGIONAL_RECIPES_DATABASE.filter((recipe) => {
      // Region Match
      if (selectedRegion !== 'All Regions' && recipe.region !== selectedRegion) {
        return false;
      }
      // State Match
      if (selectedState !== 'All States' && recipe.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      // Vegetarian Match
      if (vegetarianOnly && !recipe.isVegetarian) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = recipe.traditionalName.toLowerCase().includes(q);
        const matchesState = recipe.state.toLowerCase().includes(q);
        const matchesCity = (recipe.city || '').toLowerCase().includes(q);
        const matchesDesc = (recipe.englishDescription || '').toLowerCase().includes(q);
        if (!matchesName && !matchesState && !matchesCity && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedRegion, selectedState, vegetarianOnly, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header with Search */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black uppercase tracking-wider border border-pink-100">
                ICMR-NIN Profiled Database
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Indian Food & Regional Cuisine Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic traditional recipes across all 6 Indian geographical zones, optimized for maternal vitality and fetal growth.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes, states, grains (Ragi, Palak)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        {/* 2. Region Pills */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Select Zone</span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={vegetarianOnly}
                onChange={(e) => setVegetarianOnly(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300 accent-pink-600"
              />
              <span className="text-xs font-bold text-slate-700">Vegetarian Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {REGIONS.map((region) => {
              const isActive = selectedRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-xs shadow-pink-200'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {region === 'All Regions' ? region : `${region} India`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. State Selector */}
        {selectedRegion !== 'All Regions' && availableStates.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
            <span className="text-xs text-slate-500 font-bold shrink-0">State:</span>
            {availableStates.map((state) => {
              const isSelected = selectedState === state;
              return (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pink-50 border border-pink-300 text-pink-700 font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Food Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>Showing <strong className="text-slate-900 font-bold">{filteredRecipes.length}</strong> verified traditional dishes</span>
          {selectedRegion !== 'All Regions' && (
            <span className="text-pink-600 font-bold">{selectedRegion} India {selectedState !== 'All States' ? `• ${selectedState}` : ''}</span>
          )}
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mx-auto">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No traditional dishes found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your region filters or search query to find relevant traditional maternal recipes.
            </p>
            <button
              onClick={() => {
                setSelectedRegion('All Regions');
                setSelectedState('All States');
                setSearchQuery('');
                setVegetarianOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((dish) => (
              <div
                key={dish.recipeId}
                onClick={() => onSelectRecipe(dish)}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-pink-300 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                {/* Dish Photo */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <VerifiedFoodImage
                    src={dish.referenceImageUrl}
                    alt={dish.traditionalName}
                    dishName={dish.traditionalName}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-600 text-white shadow-xs">
                      Safe
                    </span>
                  </div>
                  {dish.city && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      <span>{dish.city}, {dish.state}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                      {dish.state} • {dish.region} India
                    </div>
                    <DualFoodName
                      foodName={dish.traditionalName}
                      className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors mt-0.5"
                      miniClassName="text-xs font-semibold text-emerald-700 mt-0.5"
                    />
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {dish.englishDescription}
                    </p>
                  </div>

                  {/* 4 Nutrition Stats */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center bg-slate-50 p-2.5 rounded-2xl">
                    <div>
                      <div className="text-[10px] text-slate-400">Calories</div>
                      <div className="text-xs font-black text-slate-800">{Math.round(dish.nutrition.calories)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Protein</div>
                      <div className="text-xs font-black text-slate-800">{Math.round(dish.nutrition.protein)}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Carbs</div>
                      <div className="text-xs font-black text-slate-800">{Math.round(dish.nutrition.carbohydrates)}g</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Fibre</div>
                      <div className="text-xs font-black text-slate-800">{Math.round(dish.nutrition.fiber)}g</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
