import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Filter,
  ChefHat,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Dumbbell,
  Wheat,
  Plus,
  Check,
  ExternalLink,
  Sparkles,
  Info,
  Calendar,
  Clock,
  X
} from 'lucide-react';
import { useAppContext, DayOfWeek, MealCategory, DAYS_OF_WEEK, MEAL_CATEGORIES } from '../context/AppContext';
import { RegionalRecipe } from '../types/recipe';
import {
  getAllCentralizedRecipes,
  getRecipesByLocation
} from '../services/recipe_service';
import { DualFoodName, DualText } from '../services/language_service';
import { RegionalRecipeDetailModal } from './RegionalRecipeDetailModal';
import { VerifiedFoodImage } from './VerifiedFoodImage';

export const RecipesView: React.FC = () => {
  const {
    globalLocation,
    userProfile,
    meals,
    addFoodToPlan,
    selectedDay,
    setSelectedDay
  } = useAppContext();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedTrimester, setSelectedTrimester] = useState<string>('all');
  const [selectedSafety, setSelectedSafety] = useState<string>('all');
  const [selectedNutrientFocus, setSelectedNutrientFocus] = useState<string>('all');
  const [myRegionFirst, setMyRegionFirst] = useState<boolean>(true);
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);
  const [allergySafeOnly, setAllergySafeOnly] = useState<boolean>(false);

  // Active Recipe Modal
  const [activeRecipeModal, setActiveRecipeModal] = useState<RegionalRecipe | null>(null);

  // Quick Add To Meal Plan Modal for a specific recipe
  const [recipeToPlanModal, setRecipeToPlanModal] = useState<RegionalRecipe | null>(null);
  const [targetCategory, setTargetCategory] = useState<MealCategory>('Lunch');
  const [targetDay, setTargetDay] = useState<DayOfWeek>(selectedDay || 'Monday');
  const [addedSuccessRecipeId, setAddedSuccessRecipeId] = useState<string | null>(null);

  // User's saved allergies from profile
  const userAllergies = useMemo(() => {
    return (userProfile?.allergies || []).map(a => a.toLowerCase().trim());
  }, [userProfile?.allergies]);

  // Base location-prioritized recipes
  const baseRecipes = useMemo(() => {
    if (myRegionFirst) {
      return getRecipesByLocation(globalLocation);
    }
    return getAllCentralizedRecipes();
  }, [globalLocation, myRegionFirst]);

  // Extract all unique states available in the catalog
  const availableStates = useMemo(() => {
    const statesSet = new Set<string>();
    getAllCentralizedRecipes().forEach(r => {
      if (selectedRegion === 'all' || r.region.toLowerCase() === selectedRegion.toLowerCase()) {
        if (r.state) statesSet.add(r.state);
      }
    });
    return Array.from(statesSet).sort();
  }, [selectedRegion]);

  // Filtered & Ranked Recipes
  const filteredRecipes = useMemo(() => {
    return baseRecipes.filter(recipe => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = recipe.traditionalName.toLowerCase().includes(q);
        const matchEng = (recipe.nameEnglish || '').toLowerCase().includes(q);
        const matchLocal = (recipe.nameLocal || '').toLowerCase().includes(q);
        const matchState = recipe.state.toLowerCase().includes(q);
        const matchCuisine = (recipe.cuisine || '').toLowerCase().includes(q);
        const matchDesc = (recipe.englishDescription || '').toLowerCase().includes(q);
        const matchIng = recipe.ingredients.some(ing => ing.name.toLowerCase().includes(q));

        if (!matchName && !matchEng && !matchLocal && !matchState && !matchCuisine && !matchDesc && !matchIng) {
          return false;
        }
      }

      // 2. Region Filter
      if (selectedRegion !== 'all' && recipe.region.toLowerCase() !== selectedRegion.toLowerCase()) {
        return false;
      }

      // 3. State Filter
      if (selectedState !== 'all' && recipe.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // 4. Meal Type Filter
      if (selectedMealType !== 'all') {
        const m = selectedMealType.toLowerCase();
        const recMeal = (recipe.mealType || recipe.category || '').toLowerCase();
        if (m === 'millets' && !recipe.isMilletDish && !recMeal.includes('millet')) return false;
        if (m === 'traditional' && !recipe.isTraditionalFood) return false;
        if (m !== 'millets' && m !== 'traditional' && !recMeal.includes(m)) return false;
      }

      // 5. Trimester Filter
      if (selectedTrimester !== 'all') {
        const t = selectedTrimester.toLowerCase();
        const rel = (recipe.trimesterRelevance || '').toLowerCase();
        const suit = (recipe.trimesterSuitability?.bestSuitedTrimester || '').toLowerCase();
        if (!rel.includes('all') && !rel.includes(t) && !suit.includes(t)) {
          return false;
        }
      }

      // 6. Safety Filter
      if (selectedSafety !== 'all') {
        const s = selectedSafety.toLowerCase();
        const recSafe = (recipe.pregnancySafety || recipe.foodSafety?.level || '').toLowerCase();
        if (s === 'safe' && !recSafe.includes('safe')) return false;
        if (s === 'moderate' && !recSafe.includes('moderate') && !recSafe.includes('caution')) return false;
      }

      // 7. Nutritional Focus Filter
      if (selectedNutrientFocus !== 'all') {
        const nut = recipe.nutrition;
        if (selectedNutrientFocus === 'iron' && (nut.iron || 0) < 3.0) return false;
        if (selectedNutrientFocus === 'calcium' && (nut.calcium || 0) < 150) return false;
        if (selectedNutrientFocus === 'protein' && (nut.protein || 0) < 10) return false;
        if (selectedNutrientFocus === 'folate' && (nut.vitaminB9 || 0) < 50) return false;
        if (selectedNutrientFocus === 'fiber' && (nut.fiber || 0) < 5.0) return false;
      }

      // 8. Vegetarian Filter
      if (vegetarianOnly && !recipe.isVegetarian) {
        return false;
      }

      // 9. Allergy Safe Filter
      if (allergySafeOnly && userAllergies.length > 0) {
        const hasAllergyMatch = (recipe.allergens || []).some(allergen => {
          const aLower = allergen.toLowerCase();
          return userAllergies.some(userA => aLower.includes(userA) || userA.includes(aLower));
        });
        if (hasAllergyMatch) return false;
      }

      return true;
    });
  }, [
    baseRecipes,
    searchQuery,
    selectedRegion,
    selectedState,
    selectedMealType,
    selectedTrimester,
    selectedSafety,
    selectedNutrientFocus,
    vegetarianOnly,
    allergySafeOnly,
    userAllergies
  ]);

  // Check if a recipe has been added to the currently selected day
  const isRecipeInMealPlan = (recipe: RegionalRecipe): boolean => {
    return meals.some(m => {
      const matchDay = m.day === (selectedDay || 'Monday');
      const matchId = m.foodId === recipe.recipeId || m.foodId === recipe.foodId;
      const matchName = m.name.toLowerCase() === recipe.traditionalName.toLowerCase() ||
        (recipe.nameEnglish && m.name.toLowerCase() === recipe.nameEnglish.toLowerCase());
      return matchDay && (matchId || Boolean(matchName));
    });
  };

  // Check allergen match for a recipe against user profile
  const checkRecipeAllergens = (recipe: RegionalRecipe) => {
    if (!userAllergies || userAllergies.length === 0) return { hasAllergy: false, matched: [] };
    const matched: string[] = [];
    (recipe.allergens || []).forEach(allergen => {
      const aLower = allergen.toLowerCase();
      userAllergies.forEach(userA => {
        if (aLower.includes(userA) || userA.includes(aLower)) {
          matched.push(allergen);
        }
      });
    });
    return { hasAllergy: matched.length > 0, matched };
  };

  // Handle adding recipe directly or via modal to Meal Planner
  const handleConfirmAddToPlan = () => {
    if (!recipeToPlanModal) return;

    const recipe = recipeToPlanModal;
    addFoodToPlan({
      food: {
        id: recipe.recipeId,
        name: recipe.traditionalName,
        regionalName: recipe.nameLocal || recipe.nameEnglish,
        calories: Math.round(recipe.nutrition.calories || 0),
        protein: Number((recipe.nutrition.protein || 0).toFixed(1)),
        iron: Number((recipe.nutrition.iron || 0).toFixed(1)),
        calcium: Math.round(recipe.nutrition.calcium || 0),
        folate: Math.round(recipe.nutrition.vitaminB9 || 0),
        servingSize: `${recipe.servingSize?.servingGrams || 200}g`,
        image: recipe.referenceImageUrl || recipe.photoUrl || undefined
      },
      day: targetDay,
      category: targetCategory,
      servings: 1
    });

    setAddedSuccessRecipeId(recipe.recipeId);
    setTimeout(() => {
      setAddedSuccessRecipeId(null);
    }, 2500);

    setRecipeToPlanModal(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner with Location Awareness */}
      <div className="bg-[#223030] text-[#EFEFE9] rounded-3xl p-6 sm:p-8 shadow-md border border-[#523D35]/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] text-xs font-bold uppercase tracking-wider border border-[#BBA58F]/30">
              <ChefHat className="w-4 h-4 text-[#BBA58F]" />
              <span>Verified Regional Recipe Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              <DualText textKey="nav.recipes" fallback="Regional Food Recipes" />
            </h1>
            <p className="text-sm text-[#E8D9CD] max-w-2xl leading-relaxed">
              Authentic Indian culinary heritage for maternal health. Formulated from ICMR-NIN IFCT standards, Poshan Abhiyaan guidelines, and verified recipe archives.
            </p>
          </div>

          {/* Location prioritization badge */}
          <div className="bg-[#EFEFE9] text-[#223030] rounded-2xl p-3.5 border border-[#959D90]/50 shadow-xs flex items-start gap-3 max-w-xs shrink-0">
            <MapPin className="w-5 h-5 text-[#523D35] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block text-[#523D35] uppercase tracking-wider text-[10px]">
                Active Location Priority
              </span>
              <span className="font-extrabold text-[#223030] block text-sm">
                {globalLocation?.village ? `${globalLocation.village}, ` : ''}
                {globalLocation?.city || globalLocation?.district || 'Mysuru'}, {globalLocation?.state || 'Karnataka'}
              </span>
              <span className="text-[11px] text-[#523D35] block mt-0.5">
                Local dishes dynamically prioritized
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Multifaceted Filtering Controls */}
      <div className="bg-[#E8D9CD] border border-[#959D90]/60 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#523D35] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by name, ingredient, state, cuisine (e.g., Ragi, Saaru, Kadala, Thepla)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#EFEFE9] border border-[#959D90]/60 text-[#223030] placeholder-[#523D35]/70 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#223030] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#523D35] hover:text-[#223030] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown and Option Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Region Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#523D35] mb-1">
              Indian Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedState('all');
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/60 text-xs font-semibold text-[#223030] focus:outline-none focus:ring-1 focus:ring-[#223030] cursor-pointer"
            >
              <option value="all">All Regions</option>
              <option value="North">North India</option>
              <option value="South">South India</option>
              <option value="West">West India</option>
              <option value="East">East India</option>
              <option value="Central">Central India</option>
              <option value="North-East">North-East India</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#523D35] mb-1">
              State / Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/60 text-xs font-semibold text-[#223030] focus:outline-none focus:ring-1 focus:ring-[#223030] cursor-pointer"
            >
              <option value="all">All States ({availableStates.length})</option>
              {availableStates.map(stateName => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>

          {/* Meal Type Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#523D35] mb-1">
              Meal & Category
            </label>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/60 text-xs font-semibold text-[#223030] focus:outline-none focus:ring-1 focus:ring-[#223030] cursor-pointer"
            >
              <option value="all">All Meal Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks & Savouries</option>
              <option value="Drinks">Drinks & Beverages</option>
              <option value="Millets">Millet Dishes (Ragi/Jowar/Bajra)</option>
              <option value="Traditional">Traditional Heritage Dishes</option>
            </select>
          </div>

          {/* Trimester Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#523D35] mb-1">
              Pregnancy Trimester
            </label>
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/60 text-xs font-semibold text-[#223030] focus:outline-none focus:ring-1 focus:ring-[#223030] cursor-pointer"
            >
              <option value="all">All Trimesters</option>
              <option value="1st">1st Trimester (Folate & Nausea relief)</option>
              <option value="2nd">2nd Trimester (Protein & Iron build)</option>
              <option value="3rd">3rd Trimester (Calcium & Blood expansion)</option>
            </select>
          </div>

          {/* Safety Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#523D35] mb-1">
              Safety Status
            </label>
            <select
              value={selectedSafety}
              onChange={(e) => setSelectedSafety(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/60 text-xs font-semibold text-[#223030] focus:outline-none focus:ring-1 focus:ring-[#223030] cursor-pointer"
            >
              <option value="all">All Verified Statuses</option>
              <option value="safe">✓ Safe in Pregnancy</option>
              <option value="moderate">⚠ Moderate / Caution</option>
            </select>
          </div>

          {/* Nutritional Focus Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#523D35] mb-1">
              Nutritional Focus
            </label>
            <select
              value={selectedNutrientFocus}
              onChange={(e) => setSelectedNutrientFocus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#EFEFE9] border border-[#959D90]/60 text-xs font-semibold text-[#223030] focus:outline-none focus:ring-1 focus:ring-[#223030] cursor-pointer"
            >
              <option value="all">All Nutrients</option>
              <option value="iron">High Iron (≥ 3 mg)</option>
              <option value="calcium">High Calcium (≥ 150 mg)</option>
              <option value="protein">High Protein (≥ 10 g)</option>
              <option value="folate">High Folate (≥ 50 mcg)</option>
              <option value="fiber">High Fiber (≥ 5 g)</option>
            </select>
          </div>
        </div>

        {/* Toggles: Region Priority, Vegetarian & Allergy Safe */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#959D90]/40">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-[#223030] cursor-pointer">
              <input
                type="checkbox"
                checked={myRegionFirst}
                onChange={(e) => setMyRegionFirst(e.target.checked)}
                className="w-4 h-4 rounded text-[#223030] focus:ring-[#223030] cursor-pointer accent-[#223030]"
              />
              <span>📍 My Region First ({globalLocation?.state || 'Local'})</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-[#223030] cursor-pointer">
              <input
                type="checkbox"
                checked={vegetarianOnly}
                onChange={(e) => setVegetarianOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#223030] focus:ring-[#223030] cursor-pointer accent-[#223030]"
              />
              <span>Pure Vegetarian Only</span>
            </label>

            {userAllergies.length > 0 && (
              <label className="inline-flex items-center gap-2 text-xs font-bold text-[#523D35] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allergySafeOnly}
                  onChange={(e) => setAllergySafeOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#523D35] focus:ring-[#523D35] cursor-pointer accent-[#523D35]"
                />
                <span>Exclude My Allergies ({userAllergies.join(', ')})</span>
              </label>
            )}
          </div>

          <div className="text-xs font-bold text-[#523D35]">
            Showing <span className="text-[#223030] font-black">{filteredRecipes.length}</span> authentic recipes
          </div>
        </div>
      </div>

      {/* 3. Recipe Cards Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-[#E8D9CD] rounded-3xl p-10 text-center border border-[#959D90]/50 space-y-3">
          <ChefHat className="w-10 h-10 text-[#523D35] mx-auto" />
          <h3 className="text-base font-extrabold text-[#223030]">No recipes match your filter criteria</h3>
          <p className="text-xs text-[#523D35] max-w-md mx-auto">
            Try resetting your search query or selecting "All States" to view verified recipes across all regions of India.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('all');
              setSelectedState('all');
              setSelectedMealType('all');
              setSelectedTrimester('all');
              setSelectedSafety('all');
              setSelectedNutrientFocus('all');
              setMyRegionFirst(true);
              setVegetarianOnly(false);
              setAllergySafeOnly(false);
            }}
            className="px-4 py-2 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => {
            const isAdded = isRecipeInMealPlan(recipe);
            const allergenCheck = checkRecipeAllergens(recipe);
            const isSafe = (recipe.pregnancySafety || recipe.foodSafety?.level || '') === 'Safe';

            return (
              <div
                key={recipe.recipeId}
                className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Header */}
                  <div className="relative aspect-video w-full bg-[#223030] overflow-hidden">
                    <VerifiedFoodImage
                      src={recipe.referenceImageUrl || recipe.photoUrl || null}
                      alt={recipe.traditionalName}
                      dishName={recipe.traditionalName}
                      showAttribution={true}
                      sourceLabel={recipe.referenceImageSource || recipe.sourceName}
                      licenseLabel={recipe.referenceImageLicense}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />

                    {/* Safety Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase shadow-xs ${
                          isSafe
                            ? 'bg-[#223030] text-[#EFEFE9]'
                            : 'bg-[#523D35] text-[#E8D9CD]'
                        }`}
                      >
                        ✓ {recipe.pregnancySafety || 'Safe in Pregnancy'}
                      </span>
                    </div>

                    {/* Meal / Millet Tag */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      {recipe.isMilletDish && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#BBA58F] text-[#223030] shadow-xs">
                          🌾 Millet
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFEFE9] text-[#523D35] shadow-xs">
                        {recipe.mealType || recipe.category || 'Traditional'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-3">
                    {/* Origin & State */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#523D35]">
                      <MapPin className="w-3.5 h-3.5 text-[#523D35] shrink-0" />
                      <span>{recipe.city ? `${recipe.city}, ` : ''}{recipe.state} • {recipe.region} India</span>
                    </div>

                    {/* Recipe Names */}
                    <div>
                      <DualFoodName
                        foodName={recipe.traditionalName}
                        className="text-lg font-black text-[#223030] leading-snug group-hover:text-[#523D35] transition"
                        miniClassName="text-xs font-semibold text-[#523D35] mt-0.5"
                      />
                      {recipe.nameEnglish && recipe.nameEnglish !== recipe.traditionalName && (
                        <p className="text-xs text-[#523D35] font-medium mt-0.5">
                          {recipe.nameEnglish}
                        </p>
                      )}
                    </div>

                    {/* Allergy Alert Warning */}
                    {allergenCheck.hasAllergy && (
                      <div className="bg-[#523D35] text-[#EFEFE9] p-2.5 rounded-xl text-xs flex items-start gap-2 border border-[#BBA58F]/40 shadow-xs">
                        <AlertTriangle className="w-4 h-4 text-[#BBA58F] shrink-0 mt-0.5" />
                        <div className="space-y-0.5 text-[11px] leading-tight">
                          <span className="font-extrabold uppercase text-[10px] block text-[#BBA58F]">
                            ⚠️ Contains Allergen
                          </span>
                          <p>Matches your saved allergy: <span className="font-bold text-white">{allergenCheck.matched.join(', ')}</span></p>
                        </div>
                      </div>
                    )}

                    {/* Short Description */}
                    <p className="text-xs text-[#523D35] line-clamp-2 leading-relaxed">
                      {recipe.englishDescription}
                    </p>

                    {/* Nutrition Micro-Grid */}
                    <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
                      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-xl p-1.5">
                        <span className="text-[9px] text-[#523D35] block font-bold">Calories</span>
                        <span className="text-xs font-black text-[#223030]">{Math.round(recipe.nutrition.calories)}</span>
                        <span className="text-[9px] text-[#523D35] block">kcal</span>
                      </div>
                      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-xl p-1.5">
                        <span className="text-[9px] text-[#523D35] block font-bold">Protein</span>
                        <span className="text-xs font-black text-[#223030]">{recipe.nutrition.protein}g</span>
                        <span className="text-[9px] text-[#523D35] block">Protein</span>
                      </div>
                      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-xl p-1.5">
                        <span className="text-[9px] text-[#523D35] block font-bold">Iron</span>
                        <span className="text-xs font-black text-[#223030]">{recipe.nutrition.iron}mg</span>
                        <span className="text-[9px] text-[#523D35] block">Iron</span>
                      </div>
                      <div className="bg-[#EFEFE9] border border-[#959D90]/40 rounded-xl p-1.5">
                        <span className="text-[9px] text-[#523D35] block font-bold">Calcium</span>
                        <span className="text-xs font-black text-[#223030]">{recipe.nutrition.calcium}mg</span>
                        <span className="text-[9px] text-[#523D35] block">Calcium</span>
                      </div>
                    </div>

                    {/* Source Attribution Tag */}
                    <div className="text-[10px] text-[#523D35] font-medium flex items-center justify-between pt-1">
                      <span>Source: <strong className="text-[#223030]">{recipe.sourceName || 'ICMR-NIN IFCT'}</strong></span>
                      {recipe.originalRecipeUrl && (
                        <a
                          href={recipe.originalRecipeUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[#223030] hover:text-[#523D35] font-bold flex items-center gap-1 hover:underline"
                        >
                          <span>Original</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-[#EFEFE9] border-t border-[#959D90]/40 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveRecipeModal(recipe)}
                    className="px-3 py-2 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 border border-[#959D90]/50 rounded-xl text-xs font-bold text-[#223030] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ChefHat className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>📖 View Recipe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipeToPlanModal(recipe)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isAdded || addedSuccessRecipeId === recipe.recipeId
                        ? 'bg-[#523D35] text-[#EFEFE9]'
                        : 'bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9]'
                    }`}
                  >
                    {isAdded || addedSuccessRecipeId === recipe.recipeId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#BBA58F]" />
                        <span>✓ Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                        <span>+ Add to Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full 21-Point Recipe Detail Inspection Modal */}
      {activeRecipeModal && (
        <RegionalRecipeDetailModal
          recipe={activeRecipeModal}
          isOpen={Boolean(activeRecipeModal)}
          onClose={() => setActiveRecipeModal(null)}
          userProfile={userProfile}
        />
      )}

      {/* 5. Add to Meal Planner Day & Category Picker Modal */}
      {recipeToPlanModal && (
        <div className="fixed inset-0 z-50 bg-[#223030]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 border-b border-[#959D90]/30 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#523D35] block">
                  Add Recipe to Meal Plan
                </span>
                <h3 className="text-lg font-black text-[#223030]">
                  {recipeToPlanModal.traditionalName}
                </h3>
              </div>
              <button
                onClick={() => setRecipeToPlanModal(null)}
                className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select Day */}
            <div>
              <label className="block text-xs font-bold text-[#523D35] uppercase tracking-wider mb-1.5">
                Target Day
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setTargetDay(day)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      targetDay === day
                        ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                        : 'bg-[#E8D9CD] text-[#523D35] hover:bg-[#BBA58F]/40'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Meal Category */}
            <div>
              <label className="block text-xs font-bold text-[#523D35] uppercase tracking-wider mb-1.5">
                Meal Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {MEAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTargetCategory(cat)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      targetCategory === cat
                        ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                        : 'bg-[#E8D9CD] text-[#523D35] hover:bg-[#BBA58F]/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrients to be logged */}
            <div className="bg-[#E8D9CD] p-3 rounded-2xl border border-[#959D90]/40 space-y-1">
              <span className="text-[10px] font-bold text-[#523D35] uppercase tracking-wider block">
                Daily Nutrition Impact (1 Serving)
              </span>
              <div className="flex items-center justify-between text-xs font-black text-[#223030]">
                <span>{Math.round(recipeToPlanModal.nutrition.calories)} kcal</span>
                <span>• {recipeToPlanModal.nutrition.protein}g Protein</span>
                <span>• {recipeToPlanModal.nutrition.iron}mg Iron</span>
                <span>• {recipeToPlanModal.nutrition.calcium}mg Calcium</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRecipeToPlanModal(null)}
                className="px-4 py-2 bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#523D35] text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddToPlan}
                className="px-5 py-2 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                <span>Confirm & Add to Meal Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
