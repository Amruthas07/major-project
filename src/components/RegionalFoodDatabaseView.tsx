import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, ChefHat, MapPin, Sparkles, 
  Calendar, ListPlus, ShieldCheck, AlertTriangle, Eye, 
  Flame, Heart, ArrowRight, Utensils, ImageOff, CheckCircle2
} from 'lucide-react';
import { IndianRegion, REGIONS_LIST, REGION_TO_STATES, RegionalRecipe } from '../types/recipe';
import { VerifiedFoodImage } from './VerifiedFoodImage';

interface RegionalFoodDatabaseViewProps {
  recipes: RegionalRecipe[];
  onOpenAddRecipeModal: () => void;
  onSelectRecipe: (recipe: RegionalRecipe) => void;
  onAddToMealPlan?: (recipe: RegionalRecipe, day?: string, slot?: string) => void;
  onAddToFoodLog?: (recipe: RegionalRecipe, grams?: number) => void;
  language?: string;
  userProfile?: any;
}

export const RegionalFoodDatabaseView: React.FC<RegionalFoodDatabaseViewProps> = ({
  recipes,
  onOpenAddRecipeModal,
  onSelectRecipe,
  onAddToMealPlan,
  onAddToFoodLog,
  language = 'en',
  userProfile
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewTab, setViewTab] = useState<'all' | 'curated' | 'myRecipes'>('all');

  // Available states dynamic list
  const availableStates = useMemo(() => {
    if (selectedRegion === 'All') {
      const allStates: string[] = [];
      Object.values(REGION_TO_STATES).forEach(list => allStates.push(...list));
      return Array.from(new Set(allStates)).sort();
    }
    return REGION_TO_STATES[selectedRegion as IndianRegion] || [];
  }, [selectedRegion]);

  // Handle region change
  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    setSelectedState('All');
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(rec => {
      // View tab filter (all, curated, user-created)
      if (viewTab === 'curated' && rec.createdBy !== 'system') return false;
      if (viewTab === 'myRecipes' && rec.createdBy === 'system') return false;

      // Region filter
      if (selectedRegion !== 'All' && rec.region !== selectedRegion) return false;

      // State filter
      if (selectedState !== 'All' && rec.state !== selectedState) return false;

      // Category filter
      if (selectedCategory !== 'All' && rec.category !== selectedCategory) return false;

      // Search query (traditional name, ingredients, state, city)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = rec.traditionalName.toLowerCase().includes(query);
        const matchesDesc = (rec.englishDescription || '').toLowerCase().includes(query);
        const matchesState = rec.state.toLowerCase().includes(query);
        const matchesCity = (rec.city || '').toLowerCase().includes(query);
        const matchesIngredient = rec.ingredients.some(ing => ing.name.toLowerCase().includes(query));

        if (!matchesName && !matchesDesc && !matchesState && !matchesCity && !matchesIngredient) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, selectedRegion, selectedState, selectedCategory, searchQuery, viewTab]);

  return (
    <div className="space-y-6">

      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black">
            <ChefHat className="w-3.5 h-3.5 text-amber-200" />
            <span>Regional Indian Recipe System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Authentic Regional Maternity Nutrition
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
            Explore authentic traditional dishes from North, South, East, West, Central, and North-East India with verified ICMR-NIN IFCT nutrient profiles and pregnancy safety guidance.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddRecipeModal}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Your Regional Dish</span>
            </button>
            <span className="text-xs text-amber-100 font-bold">
              {recipes.length} Regional Recipes Available
            </span>
          </div>
        </div>

        {/* Decorative background visual icon */}
        <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl font-black pointer-events-none select-none">
          🍲
        </div>
      </div>

      {/* SEARCH & REGIONAL FILTER CONTROLS */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-4">
        
        {/* Search bar & Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search traditional recipe name, ingredients, state (e.g. Ragi Mudde, Sambar, Sattu)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
            <button
              onClick={() => setViewTab('all')}
              className={`px-3.5 py-1.5 rounded-xl transition ${viewTab === 'all' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Recipes ({recipes.length})
            </button>
            <button
              onClick={() => setViewTab('curated')}
              className={`px-3.5 py-1.5 rounded-xl transition ${viewTab === 'curated' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Curated IFCT
            </button>
            <button
              onClick={() => setViewTab('myRecipes')}
              className={`px-3.5 py-1.5 rounded-xl transition ${viewTab === 'myRecipes' ? 'bg-white shadow text-slate-900 font-black' : 'text-slate-600 hover:text-slate-900'}`}
            >
              My Recipes ({recipes.filter(r => r.createdBy !== 'system').length})
            </button>
          </div>
        </div>

        {/* Region Pills Filter */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Filter By Region
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRegionChange('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedRegion === 'All'
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              All Regions
            </button>
            {REGIONS_LIST.map((r) => (
              <button
                key={r}
                onClick={() => handleRegionChange(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedRegion === r
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {r} India
              </button>
            ))}
          </div>
        </div>

        {/* State & Category Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              State Filter {selectedRegion !== 'All' ? `(${selectedRegion} India)` : ''}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="All">All States</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="All">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Traditional Soups">Traditional Soups / Saaru</option>
              <option value="Millets">Millets & Ancient Grains</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
        </div>

      </div>

      {/* RECIPES CARD GRID */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto">
            🥣
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-black text-slate-800">No matching regional recipes found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search filters, or add your favorite traditional home-cooked dish!
            </p>
          </div>
          <button
            onClick={onOpenAddRecipeModal}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Regional Dish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const hasImage = Boolean(recipe.referenceImageUrl && recipe.referenceImageUrl.trim().length > 0);
            return (
              <div
                key={recipe.recipeId}
                className="bg-white border border-[#E2E8F0] hover:border-amber-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Photo & Badge */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <VerifiedFoodImage
                    src={recipe.referenceImageUrl}
                    dishName={recipe.traditionalName}
                    alt={recipe.traditionalName}
                    fallbackUrls={recipe.fallbackImageUrls || []}
                    aspectRatio="video"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    showAttribution={false}
                  />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{recipe.state}</span>
                    </span>
                    {recipe.city && (
                      <span className="bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-extrabold shadow-xs">
                        {recipe.city}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-sm ${
                      recipe.foodSafety?.level === 'Generally suitable'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-slate-900'
                    }`}>
                      {recipe.foodSafety?.level === 'Generally suitable' ? 'Pregnancy Safe' : 'Use Caution'}
                    </span>
                  </div>

                  {recipe.referenceImageUrl && recipe.referenceImageSource && (
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[9px] text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md z-10">
                      <span className="truncate max-w-[170px]">{recipe.referenceImageSource}</span>
                      {recipe.referenceImageLicense && <span className="font-mono text-amber-300 shrink-0">{recipe.referenceImageLicense}</span>}
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {recipe.region} India • {recipe.category || 'Main Dish'}
                      </span>
                      {recipe.nutritionDataSourceType === 'VERIFIED' && (
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>IFCT Verified</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      {recipe.traditionalName}
                    </h3>
                    {recipe.englishDescription && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {recipe.englishDescription}
                      </p>
                    )}
                  </div>

                  {/* Macro & Nutrient Indicators */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                    <div className="bg-slate-50 rounded-xl p-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Calories</span>
                      <span className="text-xs font-black text-slate-800">{recipe.nutrition.calories} kcal</span>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-1.5">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase block">Protein</span>
                      <span className="text-xs font-black text-emerald-900">{recipe.nutrition.protein}g</span>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-1.5">
                      <span className="text-[9px] font-bold text-amber-600 uppercase block">Iron</span>
                      <span className="text-xs font-black text-amber-900">{recipe.nutrition.iron} mg</span>
                    </div>
                  </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onSelectRecipe(recipe)}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Recipe</span>
                  </button>

                  {onAddToMealPlan && (
                    <button
                      onClick={() => onAddToMealPlan(recipe, 'Monday', 'Lunch')}
                      className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition"
                      title="Add to Weekly Meal Plan"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}

                  {onAddToFoodLog && (
                    <button
                      onClick={() => onAddToFoodLog(recipe, recipe.servingSize?.servingGrams || 200)}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition"
                      title="Log as Today's Meal"
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    )}

    </div>
  );
};
