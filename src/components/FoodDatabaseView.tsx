import React, { useState, useMemo } from 'react';
import { KaggleFoodItem, GlobalLocationState, PlannedMeal } from '../types';
import { KAGGLE_PROCESSED_FOOD_DATABASE, kagglePipeline } from '../services/kaggle_food_pipeline';
import { CURATED_REGIONAL_RECIPES } from '../data/regional_recipes_db';
import { useLanguage, DualText, DualFoodName } from '../services/language_service';
import { useAppContext } from '../context/AppContext';
import { getRecipeForFood } from '../services/recipe_service';
import { RegionalRecipe } from '../types/recipe';
import { RegionalRecipeDetailModal } from './RegionalRecipeDetailModal';
import { checkFoodAllergies } from '../utils/allergy_checker';
import { FoodAlternativeModal } from './FoodAlternativeModal';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Flame,
  ShieldCheck,
  Tag,
  Info,
  Sparkles,
  ExternalLink,
  MapPin,
  Filter,
  SlidersHorizontal,
  Layers,
  Heart,
  RotateCcw,
  Check,
  Database,
  X,
  ChefHat,
  Clock,
  Utensils,
  ChevronRight,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import { FoodOrderingSection } from './FoodOrderingSection';

export const FoodDatabaseView: React.FC = () => {
  const {
    globalLocation,
    meals,
    selectedDay,
    openAddToPlanModal,
    removeMeal,
    updateMealServings,
    setActiveTab,
    userProfile,
    selectedTrimester
  } = useAppContext();

  const { t, isEnglish } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSafety, setSelectedSafety] = useState<string>('All');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [minProtein, setMinProtein] = useState<number>(0);
  const [minIron, setMinIron] = useState<number>(0);
  const [minCalcium, setMinCalcium] = useState<number>(0);
  const [minFolate, setMinFolate] = useState<number>(0);
  const [prioritizeLocal, setPrioritizeLocal] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [activeModalFood, setActiveModalFood] = useState<KaggleFoodItem | null>(null);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<RegionalRecipe | null>(null);
  const [alternativeTargetFood, setAlternativeTargetFood] = useState<KaggleFoodItem | null>(null);

  const pipelineStats = kagglePipeline.getPipelineStats();

  const categories = [
    'All',
    'Millets & Grains',
    'Pulses & Legumes',
    'Vegetables & Greens',
    'Traditional Dishes',
    'Dairy',
    'Nuts & Seeds',
    'Fruits',
    'Eggs & Poultry',
    'Snacks & Soups'
  ];

  const cuisines = [
    'All',
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Telugu',
    'Maharashtrian',
    'Gujarati',
    'Bengali',
    'Punjabi',
    'North Indian',
    'Pan-Indian'
  ];

  // Dynamically rank and filter dataset based on search, filter, and user's selected location
  const filteredAndRankedFoods = useMemo(() => {
    let list = [...KAGGLE_PROCESSED_FOOD_DATABASE];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.cuisine.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          item.maternalBenefits.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      list = list.filter(
        (item) => item.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    // Safety filter
    if (selectedSafety !== 'All') {
      list = list.filter((item) => item.safetyLevel === selectedSafety);
    }

    // Nutrient minimum filters
    if (minProtein > 0) list = list.filter((item) => item.protein >= minProtein);
    if (minIron > 0) list = list.filter((item) => item.iron >= minIron);
    if (minCalcium > 0) list = list.filter((item) => item.calcium >= minCalcium);
    if (minFolate > 0) list = list.filter((item) => item.folate >= minFolate);

    // Location-based smart re-ranking
    if (prioritizeLocal && globalLocation) {
      const userState = (globalLocation.state || '').toLowerCase();
      const userDistrict = (globalLocation.district || '').toLowerCase();
      const userCity = (globalLocation.city || '').toLowerCase();
      const userVillage = (globalLocation.village || '').toLowerCase();

      list.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        const aState = a.state.toLowerCase();
        const bState = b.state.toLowerCase();
        const aCuisine = a.cuisine.toLowerCase();
        const bCuisine = b.cuisine.toLowerCase();

        // 1. Exact village/district/taluk match
        if (userVillage && a.maternalBenefits.toLowerCase().includes(userVillage)) scoreA += 50;
        if (userVillage && b.maternalBenefits.toLowerCase().includes(userVillage)) scoreB += 50;
        if (userDistrict && (a.state.toLowerCase().includes(userDistrict) || a.cuisine.toLowerCase().includes(userDistrict))) scoreA += 40;
        if (userDistrict && (b.state.toLowerCase().includes(userDistrict) || b.cuisine.toLowerCase().includes(userDistrict))) scoreB += 40;

        // 2. Exact state match
        if (aState === userState || aCuisine === userState || aCuisine.includes(userState)) scoreA += 30;
        if (bState === userState || bCuisine === userState || bCuisine.includes(userState)) scoreB += 30;

        // 3. Region match (South/North/West/East)
        const southStates = ['karnataka', 'tamil nadu', 'kerala', 'andhra pradesh', 'telangana'];
        const isUserSouth = southStates.includes(userState);
        if (isUserSouth && southStates.includes(aState)) scoreA += 15;
        if (isUserSouth && southStates.includes(bState)) scoreB += 15;

        // 4. Safety bonus
        if (a.safetyLevel === 'Safe') scoreA += 10;
        if (b.safetyLevel === 'Safe') scoreB += 10;
        if (a.safetyLevel === 'Avoid') scoreA -= 50;
        if (b.safetyLevel === 'Avoid') scoreB -= 50;

        return scoreB - scoreA;
      });
    }

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedSafety,
    selectedCuisine,
    minProtein,
    minIron,
    minCalcium,
    minFolate,
    prioritizeLocal,
    globalLocation
  ]);

  // Helper to find associated recipe details for a food item
  const getRecipeForFood = (food: KaggleFoodItem) => {
    const directMatch = CURATED_REGIONAL_RECIPES.find(
      (r) =>
        r.recipeId.toLowerCase().includes(food.id.toLowerCase()) ||
        r.traditionalName.toLowerCase().includes(food.name.toLowerCase()) ||
        food.name.toLowerCase().includes(r.traditionalName.toLowerCase())
    );

    if (directMatch) {
      return {
        ingredients: directMatch.ingredients,
        cookingMethod: directMatch.cookingMethod,
        preparationTime: directMatch.preparationTimeMinutes || 25,
        servings: directMatch.servingSize?.servings || 1,
        steps: [
          `Thoroughly sort, rinse, and clean all fresh ingredients under running water.`,
          `Measure and prepare seasonings and main ingredients: ${directMatch.ingredients.map((i) => `${i.name} (${i.quantity}${i.unit})`).join(', ')}.`,
          `Cook according to traditional practice: ${directMatch.cookingMethod}.`,
          `Simmer until fully tender to ensure optimal nutrient bioavailability and easy digestion.`,
          `Serve fresh and warm immediately for best maternal gastric comfort.`
        ],
        notes: directMatch.pregnancyNutritionNotes || []
      };
    }

    // Default authentic procedural steps for standard food items
    return {
      ingredients: food.ingredients.map((ing) => ({
        name: ing,
        quantity: 50,
        unit: 'g'
      })),
      cookingMethod: 'Slow simmered or steamed under hygienic conditions',
      preparationTime: 20,
      servings: 1,
      steps: [
        `Select fresh, grade-A ingredients and wash thoroughly under clean drinking water.`,
        `Preheat cooking vessel on medium heat with a minimal amount of cold-pressed oil or pure ghee.`,
        `Gently cook base ingredients (${food.ingredients.slice(0, 3).join(', ')}) to unlock essential nutrients.`,
        `Simmer with filtered water until tender.`,
        `Season with mild digestive herbs (cumin, curry leaves, ginger) and serve fresh.`
      ],
      notes: [
        `Rich in ${food.tags.slice(0, 2).join(' & ')} to support maternal and fetal development.`,
        `Hygienically prepare and consume warm.`
      ]
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Stats & Location Priority */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Verified ICMR-NIN &amp; Kaggle Indian Maternal Food Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2 flex-wrap">
              <span>🍛 Indian Maternal Nutrition Database</span>
              <span className="text-sm font-bold text-[#523D35] bg-[#EFEFE9] border border-[#959D90]/40 px-3 py-1 rounded-full">
                {filteredAndRankedFoods.length} Foods Available
              </span>
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-3xl">
              Scientifically vetted nutrition facts, local names, pregnancy safety profiles, and step-by-step traditional recipes tailored to your location.
            </p>
          </div>

          {/* Location Smart Priority Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#EFEFE9] p-2 rounded-2xl border border-[#959D90]/40">
            <button
              type="button"
              onClick={() => setPrioritizeLocal(!prioritizeLocal)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                prioritizeLocal
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'bg-[#E8D9CD] text-[#523D35] hover:bg-[#BBA58F]/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Prioritize {globalLocation.state || 'Local'} Cuisines</span>
            </button>
          </div>
        </div>

        {/* 2. Search & Category Filters Bar */}
        <div className="pt-2 border-t border-[#959D90]/30 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#959D90]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('btn.search', 'Search foods, recipes, millets (e.g. Ragi Mudde, Soppu Saaru)...')}
              className="w-full pl-11 pr-4 py-3 bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl text-sm font-medium text-[#223030] placeholder-[#959D90] focus:outline-none focus:ring-2 focus:ring-[#523D35]/30 focus:border-[#523D35] transition"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl text-sm font-semibold text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/30 focus:border-[#523D35] transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Food Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedSafety}
              onChange={(e) => setSelectedSafety(e.target.value)}
              className="w-full px-4 py-3 bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl text-sm font-semibold text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/30 focus:border-[#523D35] transition cursor-pointer"
            >
              <option value="All">All Safety Levels</option>
              <option value="Safe">✓ Safe in Pregnancy</option>
              <option value="Safe in Moderation">⚠️ Safe in Moderation</option>
              <option value="Avoid">⛔ Foods to Avoid</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-3 rounded-2xl border transition cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-[#223030] text-[#EFEFE9] border-[#223030]'
                  : 'bg-[#EFEFE9] text-[#523D35] border-[#959D90]/50 hover:bg-[#BBA58F]/20'
              }`}
              title="Toggle Nutrient Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Nutrient Filter Bar */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-[#959D90]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in">
            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Cuisine Heritage
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cuisines' : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Min Protein (g)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={minProtein || ''}
                onChange={(e) => setMinProtein(Number(e.target.value))}
                placeholder="e.g. 10g"
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Min Iron (mg)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={minIron || ''}
                onChange={(e) => setMinIron(Number(e.target.value))}
                placeholder="e.g. 3mg"
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Min Calcium (mg)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={minCalcium || ''}
                onChange={(e) => setMinCalcium(Number(e.target.value))}
                placeholder="e.g. 150mg"
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setMinProtein(0);
                  setMinIron(0);
                  setMinCalcium(0);
                  setMinFolate(0);
                  setSelectedCuisine('All');
                  setSelectedCategory('All');
                  setSelectedSafety('All');
                  setSearchQuery('');
                }}
                className="w-full p-2 rounded-xl text-xs font-bold text-[#EFEFE9] bg-[#523D35] hover:bg-[#223030] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Food Grid with Dual-Language Names & Add to Plan Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredAndRankedFoods.map((food) => {
          const isAvoid = food.safetyLevel === 'Avoid';
          const isModeration = food.safetyLevel === 'Safe in Moderation';

          // Check if this food is already planned on the CURRENT selected day
          const dayMeal = meals.find(
            (m) =>
              m.day === selectedDay &&
              ((m.foodId && m.foodId === food.id) ||
                m.name.toLowerCase().trim() === food.name.toLowerCase().trim())
          );
          const isAddedOnSelectedDay = !!dayMeal;
          const currentServings = dayMeal?.servings || 1;

          // Check user allergies against this food
          const allergyAlert = checkFoodAllergies(food, userProfile?.allergies || []);

          return (
            <div
              key={food.id}
              className={`bg-[#E8D9CD] rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                isAvoid
                  ? 'border-[#523D35]/40 opacity-90'
                  : allergyAlert.hasAllergy
                  ? 'border-[#523D35] ring-2 ring-[#523D35]/30'
                  : isAddedOnSelectedDay
                  ? 'border-[#523D35] ring-2 ring-[#BBA58F]/40'
                  : 'border-[#959D90]/60 hover:border-[#523D35]'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header Badge Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                        isAvoid
                          ? 'bg-[#523D35] text-[#EFEFE9]'
                          : isModeration
                          ? 'bg-[#BBA58F] text-[#223030]'
                          : 'bg-[#223030] text-[#EFEFE9]'
                      }`}
                    >
                      {isAvoid ? '⛔ Avoid' : isModeration ? '⚠️ Moderation' : '✓ Safe'}
                    </span>
                    <span className="text-[11px] font-semibold text-[#523D35]">
                      {food.category}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#523D35] bg-[#EFEFE9] border border-[#959D90]/30 px-2 py-0.5 rounded-md">
                    {food.cuisine}
                  </span>
                </div>

                {/* ALLERGY ALERT WARNING BANNER */}
                {allergyAlert.hasAllergy && (
                  <div className="bg-[#523D35] text-[#EFEFE9] p-3 rounded-2xl text-xs flex items-start gap-2.5 border border-[#BBA58F]/50 shadow-xs animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-[#BBA58F] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-extrabold uppercase tracking-wider text-[10px] block text-[#BBA58F]">
                        ⚠️ ALLERGY ALERT
                      </span>
                      <p className="text-[11px] leading-relaxed text-[#E8D9CD]">
                        This food contains <span className="font-black text-white">{allergyAlert.matchedAllergens.join(', ')}</span>, which is listed in your allergy profile.
                      </p>
                    </div>
                  </div>
                )}

                {/* Dual Food Name */}
                <div>
                  <DualFoodName
                    foodName={food.name}
                    className="text-base sm:text-lg font-black text-[#223030] leading-tight block hover:text-[#523D35] cursor-pointer transition"
                    miniClassName="text-xs font-semibold text-[#523D35] mt-0.5"
                  />
                  <span className="text-[11px] text-[#523D35] block mt-0.5 font-medium">
                    Standard: {food.servingSize || '1 Serving (~150g)'}
                  </span>
                </div>

                {/* Maternal Benefits or Avoid Reason */}
                <p className="text-xs text-[#523D35] leading-relaxed line-clamp-2">
                  {isAvoid ? (
                    <span className="text-[#523D35] font-bold">
                      ⚠️ Caution: {food.riskExplanation || food.maternalBenefits}
                    </span>
                  ) : (
                    food.maternalBenefits
                  )}
                </p>

                {/* 5. WHY RECOMMENDED SECTION */}
                {!isAvoid && (
                  <div className="bg-[#EFEFE9] rounded-xl p-2.5 border border-[#959D90]/40 text-[11px] text-[#523D35] space-y-1">
                    <span className="font-extrabold text-[#223030] block uppercase tracking-wider text-[9px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#523D35]" />
                      <span>Why Recommended?</span>
                    </span>
                    <p className="leading-snug">
                      {food.whyRecommended ||
                        `This food is recommended because its nutritional profile (${food.calories} kcal, ${food.protein}g protein, ${food.iron}mg iron) directly supports ${selectedTrimester} pregnancy nutrition targets.`}
                    </p>
                  </div>
                )}

                {/* Micro & Macro Nutrients Quick Grid */}
                {!isAvoid && (
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div className="bg-[#EFEFE9] rounded-xl p-2 border border-[#959D90]/40">
                      <span className="text-[9px] text-[#959D90] font-bold block uppercase">
                        Energy
                      </span>
                      <span className="text-xs font-black text-[#223030]">
                        {food.calories}
                      </span>
                      <span className="text-[9px] text-[#523D35] block">kcal</span>
                    </div>
                    <div className="bg-[#EFEFE9] rounded-xl p-2 border border-[#959D90]/40">
                      <span className="text-[9px] text-[#959D90] font-bold block uppercase">
                        Protein
                      </span>
                      <span className="text-xs font-black text-[#223030]">
                        {food.protein}g
                      </span>
                      <span className="text-[9px] text-[#523D35] block">Protein</span>
                    </div>
                    <div className="bg-[#EFEFE9] rounded-xl p-2 border border-[#959D90]/40">
                      <span className="text-[9px] text-[#959D90] font-bold block uppercase">
                        Iron
                      </span>
                      <span className="text-xs font-black text-[#223030]">
                        {food.iron}mg
                      </span>
                      <span className="text-[9px] text-[#523D35] block">Iron</span>
                    </div>
                    <div className="bg-[#EFEFE9] rounded-xl p-2 border border-[#959D90]/40">
                      <span className="text-[9px] text-[#959D90] font-bold block uppercase">
                        Calcium
                      </span>
                      <span className="text-xs font-black text-[#223030]">
                        {food.calcium}mg
                      </span>
                      <span className="text-[9px] text-[#523D35] block">Calcium</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {food.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#EFEFE9] text-[#523D35] border border-[#959D90]/30 rounded-md text-[10px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[#959D90]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveModalFood(food)}
                    className="text-xs font-bold text-[#523D35] hover:text-[#223030] py-1.5 px-2 rounded-xl hover:bg-[#EFEFE9] transition text-left cursor-pointer"
                  >
                    <DualText textKey="btn.viewDetails" fallback="Nutrition & Details" />
                  </button>

                  {/* Find Alternative Button */}
                  <button
                    type="button"
                    onClick={() => setAlternativeTargetFood(food)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#523D35] hover:text-[#223030] bg-[#EFEFE9] hover:bg-[#BBA58F]/30 px-2.5 py-1.5 rounded-xl border border-[#959D90]/50 transition cursor-pointer"
                    title="Find nutritionally similar, allergy-safe alternative foods"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>Find Alternative</span>
                  </button>

                  {(() => {
                    const matchedRecipe = getRecipeForFood(food);
                    if (matchedRecipe) {
                      return (
                        <button
                          type="button"
                          onClick={() => setSelectedRecipeDetail(matchedRecipe)}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-[#223030] bg-[#BBA58F]/40 hover:bg-[#BBA58F]/60 px-2.5 py-1.5 rounded-xl border border-[#959D90]/50 transition cursor-pointer shadow-2xs"
                          title="View complete step-by-step recipe, ingredients, and pregnancy guidance"
                        >
                          <ChefHat className="w-3.5 h-3.5 text-[#523D35]" />
                          <span>📖 View Recipe</span>
                        </button>
                      );
                    }
                    return (
                      <span 
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-[#959D90] px-2 py-1.5 bg-[#EFEFE9] rounded-xl border border-[#959D90]/30"
                        title="Full step-by-step recipe not currently in database"
                      >
                        <ChefHat className="w-3 h-3 text-[#959D90]" />
                        <span>Recipe not available yet</span>
                      </span>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => setActiveModalFood(food)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#523D35] hover:text-[#223030] bg-[#EFEFE9] hover:bg-[#BBA58F]/30 px-2.5 py-1.5 rounded-xl border border-[#959D90]/50 transition cursor-pointer"
                    title="Find or order this food near you"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#523D35]" />
                    <span>Find Near You</span>
                  </button>
                </div>

                {!isAvoid && (
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {isAddedOnSelectedDay && dayMeal ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Serving Controls */}
                        <div className="inline-flex items-center border border-[#523D35] bg-[#EFEFE9] rounded-xl overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => updateMealServings(dayMeal.id, currentServings - 1)}
                            className="px-2 py-1 hover:bg-[#E8D9CD] text-[#223030] font-bold cursor-pointer"
                            title="Decrease servings"
                          >
                            -
                          </button>
                          <span className="px-2 font-black text-[#223030] text-xs whitespace-nowrap">
                            {currentServings} in {dayMeal.category.split(' ')[0]}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateMealServings(dayMeal.id, currentServings + 1)}
                            className="px-2 py-1 hover:bg-[#E8D9CD] text-[#223030] font-bold cursor-pointer"
                            title="Increase servings"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeMeal(dayMeal.id)}
                          className="text-[11px] text-[#523D35] hover:text-[#223030] font-bold px-1 cursor-pointer"
                          title="Remove from meal plan"
                        >
                          <DualText textKey="btn.removeFromMeal" fallback="Remove" />
                        </button>

                        {/* Add to Another Day / Meal */}
                        <button
                          type="button"
                          onClick={() => openAddToPlanModal(food)}
                          className="p-1 text-[#523D35] hover:text-[#223030] text-[10px] font-bold rounded-lg hover:bg-[#EFEFE9] cursor-pointer"
                          title="Add to another day or meal interval"
                        >
                          + Add More
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openAddToPlanModal(food)}
                        className="px-3.5 py-1.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#BBA58F]" />
                        <DualText textKey="btn.addToMeal" fallback="+ Add to Plan" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Complete Food Details & Real Recipe Inspection Modal */}
      {activeModalFood && (() => {
        const recipe = getRecipeForFood(activeModalFood);

        return (
          <div className="fixed inset-0 z-50 bg-[#223030]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#959D90]/30 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        activeModalFood.safetyLevel === 'Avoid'
                          ? 'bg-[#523D35] text-[#EFEFE9]'
                          : activeModalFood.safetyLevel === 'Safe in Moderation'
                          ? 'bg-[#BBA58F] text-[#223030]'
                          : 'bg-[#223030] text-[#EFEFE9]'
                      }`}
                    >
                      ✓ {activeModalFood.safetyLevel} in Pregnancy
                    </span>
                    <span className="text-xs font-bold text-[#523D35]">
                      {activeModalFood.cuisine} Cuisine
                    </span>
                  </div>

                  {/* ALLERGY ALERT IN MODAL */}
                  {(() => {
                    const modalAllergy = checkFoodAllergies(activeModalFood, userProfile?.allergies || []);
                    if (!modalAllergy.hasAllergy) return null;
                    return (
                      <div className="bg-[#523D35] text-[#EFEFE9] p-3 rounded-2xl text-xs flex items-start gap-2.5 border border-[#BBA58F]/50 shadow-xs mb-3">
                        <AlertTriangle className="w-4 h-4 text-[#BBA58F] shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-extrabold uppercase tracking-wider text-[10px] block text-[#BBA58F]">
                            ⚠️ ALLERGY ALERT
                          </span>
                          <p className="text-[11px] leading-relaxed text-[#E8D9CD]">
                            This food contains <span className="font-black text-white">{modalAllergy.matchedAllergens.join(', ')}</span>, which is listed in your allergy profile.
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <DualFoodName
                    foodName={activeModalFood.name}
                    className="text-xl sm:text-2xl font-black text-[#223030]"
                    miniClassName="text-sm font-semibold text-[#523D35] mt-0.5"
                  />
                  <span className="text-xs text-[#523D35] font-medium">
                    Standard Serving: {activeModalFood.servingSize || '1 Serving (~150g)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalFood(null)}
                  className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Complete ICMR Nutrients Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#523D35] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#523D35]" />
                  <span>ICMR-NIN Food Composition Data (IFCT 2017)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">Energy</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.calories}</span>
                    <span className="text-[10px] text-[#523D35] block">kcal</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">Protein</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.protein}g</span>
                    <span className="text-[10px] text-[#523D35] block">Pure Protein</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">Iron</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.iron}mg</span>
                    <span className="text-[10px] text-[#523D35] block">Bioavailable</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">Calcium</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.calcium}mg</span>
                    <span className="text-[10px] text-[#523D35] block">Bone Matrix</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">Folate (B9)</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.folate}µg</span>
                    <span className="text-[10px] text-[#523D35] block">Neural Support</span>
                  </div>
                </div>
              </div>

              {/* Maternal Health Benefits / Clinical Guidelines */}
              <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/50 space-y-2">
                <h3 className="text-xs font-bold text-[#223030] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#523D35]" />
                  <span>Maternal Clinical Rationale &amp; Benefits</span>
                </h3>
                <p className="text-xs text-[#523D35] leading-relaxed">
                  {activeModalFood.maternalBenefits}
                </p>
                {activeModalFood.tags && activeModalFood.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeModalFood.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-[#EFEFE9] border border-[#959D90]/40 text-[10px] font-bold text-[#523D35]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Traditional Cooking Steps & Ingredients */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#523D35] flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-[#523D35]" />
                    <span>Traditional Preparation &amp; Culinary Guidance</span>
                  </h3>
                  {(() => {
                    const matchedRecipe = getRecipeForFood(activeModalFood);
                    if (matchedRecipe) {
                      return (
                        <button
                          type="button"
                          onClick={() => setSelectedRecipeDetail(matchedRecipe)}
                          className="px-3 py-1.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-black rounded-xl shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ChefHat className="w-3.5 h-3.5 text-[#BBA58F]" />
                          <span>📖 View Verified Recipe</span>
                        </button>
                      );
                    }
                    return (
                      <span className="text-[11px] font-semibold text-[#959D90] italic flex items-center gap-1">
                        <ChefHat className="w-3.5 h-3.5 text-[#959D90]" />
                        <span>Recipe not available yet</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#223030] block">Ingredients:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalFood.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-2.5 py-1 rounded-xl bg-[#E8D9CD] text-xs font-semibold text-[#223030] border border-[#959D90]/40"
                      >
                        • {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#223030] block">Method:</span>
                  <ol className="space-y-1.5 list-decimal list-inside text-xs text-[#523D35] leading-relaxed">
                    {recipe.steps.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* 5. Food Ordering & Ingredients Purchase Section */}
              <FoodOrderingSection
                foodName={activeModalFood.name}
                category={activeModalFood.category}
                ingredients={activeModalFood.ingredients}
                tags={activeModalFood.tags}
                location={globalLocation}
              />

              {/* Footer Actions */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-[#959D90]/30">
                <button
                  type="button"
                  onClick={() => {
                    const target = activeModalFood;
                    setActiveModalFood(null);
                    setAlternativeTargetFood(target);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#523D35] bg-[#E8D9CD] hover:bg-[#BBA58F]/30 border border-[#959D90]/40 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                  <span>Find Alternative Food</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalFood(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#523D35] hover:bg-[#E8D9CD] transition cursor-pointer"
                  >
                    Close
                  </button>

                  {activeModalFood.safetyLevel !== 'Avoid' && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = activeModalFood;
                        setActiveModalFood(null);
                        openAddToPlanModal(target);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#BBA58F]" />
                      <span>+ Add to Maternal Meal Plan</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Food Alternative Modal */}
      <FoodAlternativeModal
        targetFood={alternativeTargetFood}
        isOpen={!!alternativeTargetFood}
        onClose={() => setAlternativeTargetFood(null)}
      />

      {/* Complete 21-Point Regional Recipe Detail Modal */}
      <RegionalRecipeDetailModal
        recipe={selectedRecipeDetail}
        isOpen={!!selectedRecipeDetail}
        onClose={() => setSelectedRecipeDetail(null)}
      />
    </div>
  );
};
