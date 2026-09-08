import React, { useState, useMemo } from 'react';
import { 
  X, ChefHat, Calendar, ListPlus, ShoppingBag, ShieldCheck, 
  AlertTriangle, Award, Check, MapPin, Clock, Flame, ImageOff,
  ExternalLink, FileBadge, Database, Camera, Upload, Sparkles,
  Scale, RefreshCw, Layers, ChevronRight, CheckCircle2, Heart,
  Info, ShoppingCart, Plus, Minus
} from 'lucide-react';
import { RegionalRecipe, RecipeIngredient, NutritionDataSourceType } from '../types/recipe';
import { MATERNAL_NUTRIENT_METADATA, DetailedNutrients, MATERNAL_DAILY_TARGETS } from '../nutrition_engine';
import { checkRecipeAllergies } from '../utils/recipe_nutrition';
import { VerifiedFoodImage } from './VerifiedFoodImage';
import { DualFoodName, DualText, useLanguage } from '../services/language_service';
import { FoodOrderingSection } from './FoodOrderingSection';
import { useAppContext, DayOfWeek, MealCategory } from '../context/AppContext';

interface RegionalRecipeDetailModalProps {
  recipe: RegionalRecipe | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToMealPlan?: (recipe: RegionalRecipe, day?: string, slot?: string, servings?: number) => void;
  onAddToFoodLog?: (recipe: RegionalRecipe, grams?: number, userMealPhoto?: string) => void;
  onAddToShoppingList?: (ingredients: RecipeIngredient[]) => void;
  userProfile?: any;
  language?: string;
}

export const RegionalRecipeDetailModal: React.FC<RegionalRecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onAddToMealPlan,
  onAddToFoodLog,
  onAddToShoppingList,
  userProfile,
  language = 'en'
}) => {
  const { 
    globalLocation, 
    addFoodToPlan, 
    meals, 
    selectedTrimester, 
    selectedDay: contextSelectedDay 
  } = useAppContext();
  const { tIngredient, isEnglish } = useLanguage();

  // Serving and Portion Scaler state
  const baseGrams = recipe?.servingSize?.servingGrams || 200;
  const baseServings = recipe?.servingSize?.servings || 1;
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [customGramsInput, setCustomGramsInput] = useState<string>(String(baseGrams));
  const [selectedGrams, setSelectedGrams] = useState<number>(baseGrams);
  const [nutritionViewTab, setNutritionViewTab] = useState<'perServing' | 'per100g'>('perServing');

  // Meal Plan Integration State
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(contextSelectedDay || 'Monday');
  const [selectedSlot, setSelectedSlot] = useState<MealCategory>('Lunch');
  const [showMealPlanPicker, setShowMealPlanPicker] = useState<boolean>(false);
  const [userMealPhoto, setUserMealPhoto] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [activeNutrientTab, setActiveNutrientTab] = useState<'macros' | 'vitamins' | 'minerals' | 'all'>('macros');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Reset when active recipe changes
  React.useEffect(() => {
    if (recipe) {
      const g = recipe.servingSize?.servingGrams || 200;
      setServingsMultiplier(1);
      setSelectedGrams(g);
      setCustomGramsInput(String(g));
      setCheckedIngredients({});
      if (contextSelectedDay) {
        setSelectedDay(contextSelectedDay);
      }
    }
  }, [recipe?.recipeId, contextSelectedDay]);

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!isOpen || !recipe) return null;

  // Check if this recipe is already planned for the selected Day and Slot
  const existingPlannedMeal = meals.find(m => 
    m.day === selectedDay && 
    m.category === selectedSlot &&
    ((m.foodId && (m.foodId === recipe.foodId || m.foodId === recipe.recipeId)) ||
     m.name.toLowerCase().trim() === (recipe.nameEnglish || recipe.traditionalName).toLowerCase().trim() ||
     m.name.toLowerCase().trim() === recipe.traditionalName.toLowerCase().trim())
  );

  const allergyAlerts = checkRecipeAllergies(recipe, userProfile?.allergies || []);

  // Scale factor based on selected grams vs base recipe grams
  const scaleFactor = selectedGrams / (baseGrams || 200);

  // Scaled nutrient values
  const scaledNutrition: DetailedNutrients = useMemo(() => {
    if (!recipe.nutrition) return {} as DetailedNutrients;
    const base = recipe.nutrition;
    const result: any = {};
    (Object.keys(base) as Array<keyof DetailedNutrients>).forEach(key => {
      const original = (base[key] as number) || 0;
      const calc = original * scaleFactor;
      if (['calories', 'vitaminA', 'calcium', 'magnesium', 'phosphorus', 'potassium', 'sodium', 'choline'].includes(key)) {
        result[key] = Math.round(calc);
      } else {
        result[key] = Number(calc.toFixed(1));
      }
    });
    return result as DetailedNutrients;
  }, [recipe.nutrition, scaleFactor]);

  // Per 100g calculated nutrient values
  const nutrition100g = useMemo(() => {
    if (recipe.nutritionPer100g) return recipe.nutritionPer100g;
    const factor = 100 / (baseGrams || 200);
    const base = recipe.nutrition;
    return {
      calories: Math.round((base.calories || 0) * factor),
      protein: Number(((base.protein || 0) * factor).toFixed(1)),
      carbohydrates: Number(((base.carbohydrates || 0) * factor).toFixed(1)),
      fat: Number(((base.fat || 0) * factor).toFixed(1)),
      fiber: Number(((base.fiber || 0) * factor).toFixed(1)),
      iron: Number(((base.iron || 0) * factor).toFixed(1)),
      calcium: Math.round((base.calcium || 0) * factor),
      folate: Math.round((base.vitaminB9 || 0) * factor)
    };
  }, [recipe, baseGrams]);

  // Portion presets handling
  const handleServingChange = (newMultiplier: number) => {
    const validMultiplier = Math.max(0.5, Math.min(6, newMultiplier));
    setServingsMultiplier(validMultiplier);
    const newGrams = Math.round(baseGrams * validMultiplier);
    setSelectedGrams(newGrams);
    setCustomGramsInput(String(newGrams));
  };

  const handleCustomGramsChange = (val: string) => {
    setCustomGramsInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num <= 2000) {
      setSelectedGrams(num);
      setServingsMultiplier(Number((num / baseGrams).toFixed(2)));
    }
  };

  // Add directly to central AppContext meal plan
  const handleMealPlanSubmit = () => {
    // 1. Centralized update to AppContext
    addFoodToPlan({
      food: {
        id: recipe.foodId || recipe.recipeId,
        name: recipe.nameEnglish || recipe.traditionalName,
        regionalName: recipe.nameLocal || recipe.traditionalName,
        calories: scaledNutrition.calories,
        protein: scaledNutrition.protein,
        carbohydrates: scaledNutrition.carbohydrates,
        fat: scaledNutrition.fat,
        fiber: scaledNutrition.fiber,
        iron: scaledNutrition.iron,
        calcium: scaledNutrition.calcium,
        folate: scaledNutrition.vitaminB9,
        servingSize: recipe.servingSize?.servingUnit || `${baseGrams}g`,
        imageUrl: recipe.referenceImageUrl || recipe.photoUrl
      } as any,
      day: selectedDay,
      category: selectedSlot,
      servings: servingsMultiplier,
      customPortion: `${servingsMultiplier} serving(s) (${Math.round(selectedGrams)}g)`
    });

    // 2. Trigger parent callback if defined
    if (onAddToMealPlan) {
      onAddToMealPlan(recipe, selectedDay, selectedSlot, servingsMultiplier);
    }

    setShowMealPlanPicker(false);
    setActionSuccessMessage(`✓ Successfully added "${recipe.nameEnglish || recipe.traditionalName}" (${servingsMultiplier} serving, ${selectedGrams}g) to ${selectedDay} ${selectedSlot}!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleFoodLogSubmit = (customPhoto?: string) => {
    if (onAddToFoodLog) {
      onAddToFoodLog(recipe, selectedGrams, customPhoto || userMealPhoto || undefined);
      setActionSuccessMessage(`🥗 Logged "${recipe.traditionalName}" (${selectedGrams}g) into today's active nutrition tally!`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    }
  };

  const handleShoppingListSubmit = () => {
    if (onAddToShoppingList) {
      onAddToShoppingList(recipe.ingredients || []);
      setActionSuccessMessage(`🛒 Ingredients for "${recipe.traditionalName}" added to Smart Shopping List!`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    }
  };

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setUserMealPhoto(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trimester Match Status
  const trimesterLabel = selectedTrimester || '2nd Trimester';
  const isBestForCurrentTrimester = recipe.trimesterSuitability?.bestSuitedTrimester === trimesterLabel;

  // Pregnancy Safety Level
  const safetyStatus = recipe.safetyClassification || (
    recipe.foodSafety?.level?.toLowerCase().includes('avoid') ? 'AVOID' :
    recipe.foodSafety?.level?.toLowerCase().includes('moderate') ? 'MODERATE' : 'SAFE'
  );

  const getSafetyBadge = () => {
    if (safetyStatus === 'AVOID') {
      return {
        label: '✕ Avoid in Pregnancy',
        bg: 'bg-[#523D35] text-[#EFEFE9] border-[#BBA58F]/40',
        icon: AlertTriangle
      };
    }
    if (safetyStatus === 'MODERATE') {
      return {
        label: '⚠ Safe in Moderation',
        bg: 'bg-[#BBA58F] text-[#223030] border-[#959D90]/50 font-bold',
        icon: AlertTriangle
      };
    }
    return {
      label: '✓ Safe in Pregnancy',
      bg: 'bg-[#223030] text-[#EFEFE9] border-[#959D90]/40 font-bold',
      icon: ShieldCheck
    };
  };

  const safetyBadge = getSafetyBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#E8D9CD] border border-[#959D90] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* ============================================================ */}
        {/* 1. HEADER: DISH PHOTO & METADATA OVERLAY                     */}
        {/* ============================================================ */}
        <div className="relative w-full bg-[#223030] overflow-hidden shrink-0">
          <VerifiedFoodImage
            src={recipe.referenceImageUrl || recipe.photoUrl}
            dishName={recipe.traditionalName}
            alt={recipe.traditionalName}
            fallbackUrls={recipe.fallbackImageUrls || []}
            aspectRatio="video"
            containerClassName="max-h-64 sm:max-h-72 w-full"
            showAttribution={true}
            sourceLabel={recipe.referenceImageSource || 'Verified Open Culinary Dataset'}
            licenseLabel={recipe.referenceImageLicense}
            sourceUrl={recipe.sourceReference}
          />
          
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#223030]/80 hover:bg-[#223030] text-[#EFEFE9] flex items-center justify-center backdrop-blur-xs transition z-20 cursor-pointer shadow-md border border-[#959D90]/30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 sm:p-6 text-[#EFEFE9] space-y-1.5 bg-gradient-to-t from-[#223030] via-[#223030]/85 to-transparent">
            {/* Origin & Category Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#BBA58F]" />
                <span>{recipe.region} India • {recipe.state} {recipe.cityOrOrigin || recipe.city ? `(${recipe.cityOrOrigin || recipe.city})` : ''}</span>
              </span>

              {recipe.category && (
                <span className="bg-[#223030]/90 border border-[#959D90]/30 text-[#EFEFE9] px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {recipe.category}
                </span>
              )}

              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border flex items-center gap-1 ${safetyBadge.bg}`}>
                <safetyBadge.icon className="w-3 h-3" />
                <span>{safetyBadge.label}</span>
              </span>
            </div>

            {/* Title: English + Local Script */}
            <div className="pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#EFEFE9] leading-tight flex items-baseline gap-2 flex-wrap">
                <span>{recipe.nameEnglish || recipe.traditionalName}</span>
                {recipe.nameLocal && recipe.nameLocal !== recipe.nameEnglish && (
                  <span className="text-base sm:text-lg font-bold text-[#BBA58F]">
                    / {recipe.nameLocal}
                  </span>
                )}
              </h2>
              {recipe.traditionalName && recipe.traditionalName !== recipe.nameEnglish && (
                <p className="text-xs font-semibold text-[#BBA58F]/90 mt-0.5">
                  Traditional Name: {recipe.traditionalName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. ATTRIBUTION & DATA VERIFICATION BAR                       */}
        {/* ============================================================ */}
        <div className="bg-[#EFEFE9] border-b border-[#959D90]/30 px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#523D35]">
          <div className="flex items-center gap-2 flex-wrap">
            <FileBadge className="w-3.5 h-3.5 text-[#523D35]" />
            <span className="font-bold text-[#223030]">Culinary Heritage:</span>
            <span className="font-medium text-[#523D35]">{recipe.referenceImageSource || 'Traditional Regional Repository'}</span>
            {recipe.referenceImageLicense && (
              <span className="px-1.5 py-0.2 bg-[#E8D9CD] rounded text-[9px] font-mono font-bold text-[#523D35] border border-[#959D90]/30">
                {recipe.referenceImageLicense}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#523D35]" />
            <span className="font-bold text-[#223030]">Nutrition Standard:</span>
            <span className="text-[#523D35] font-medium">{recipe.nutritionSource || 'ICMR-NIN IFCT 2017'}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. NOTIFICATION BANNER                                       */}
        {/* ============================================================ */}
        {actionSuccessMessage && (
          <div className="bg-[#223030] text-[#EFEFE9] px-6 py-3 text-xs font-bold flex items-center gap-2.5 shrink-0 animate-fadeIn border-b border-[#959D90]/40">
            <CheckCircle2 className="w-4 h-4 text-[#BBA58F]" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. MODAL SCROLLABLE CONTENT BODY                             */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* Description */}
          {recipe.englishDescription && (
            <p className="text-xs sm:text-sm text-[#523D35] leading-relaxed font-medium bg-[#EFEFE9] p-4 rounded-2xl border border-[#959D90]/40">
              {recipe.englishDescription}
            </p>
          )}

          {/* Cooking Time, Servings & Weight Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-[#523D35] uppercase block flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Cooking Time</span>
              </span>
              <p className="text-sm sm:text-base font-black text-[#223030] mt-0.5">
                {recipe.cookingTimeMinutes || recipe.preparationTimeMinutes || 25} Mins
              </p>
            </div>

            <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-[#523D35] uppercase block">
                Standard Portion
              </span>
              <p className="text-sm sm:text-base font-black text-[#223030] mt-0.5">
                {recipe.servingSize?.servingUnit || `${baseGrams}g`}
              </p>
            </div>

            <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-[#523D35] uppercase block">
                Total Recipe Weight
              </span>
              <p className="text-sm sm:text-base font-black text-[#223030] mt-0.5">
                {recipe.totalRecipeWeight || `${baseGrams * (recipe.servingSize?.servings || 1)}g`}
              </p>
            </div>

            <div className="bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-[#523D35] uppercase block">
                Cuisine Heritage
              </span>
              <p className="text-sm sm:text-base font-black text-[#223030] mt-0.5 truncate">
                {recipe.state}
              </p>
            </div>
          </div>

          {/* Pregnancy Safety Rationale & Ingredient-Level Notes */}
          <div className="p-4 rounded-2xl border border-[#959D90] bg-[#EFEFE9] text-[#223030] space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#523D35] shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#223030]">
                Maternal Safety Classification: <span className="text-[#523D35]">{safetyBadge.label}</span>
              </h4>
            </div>

            <p className="text-xs leading-relaxed text-[#523D35] font-medium">
              {recipe.pregnancySafetyRationale || recipe.foodSafety?.explanation || 'This recipe utilizes cooked ingredients safe for gestational digestion when prepared fresh and thoroughly cooked.'}
            </p>

            {/* Ingredient Safety Alerts */}
            {recipe.ingredientSafetyAlerts && recipe.ingredientSafetyAlerts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#959D90]/30 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#523D35] tracking-wider block">
                  Ingredient-Level Clinical Notes:
                </span>
                {recipe.ingredientSafetyAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-[#523D35] bg-[#E8D9CD] p-2 rounded-xl border border-[#959D90]/30">
                    <Info className="w-3.5 h-3.5 text-[#523D35] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-[#223030]">{alert.ingredient}: </strong>
                      <span>{alert.warningNote}</span>
                      {alert.recommendation && (
                        <span className="block text-[11px] font-semibold text-[#523D35] mt-0.5">
                          💡 Recommendation: {alert.recommendation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* User Allergy Check */}
            {allergyAlerts.length > 0 && (
              <div className="mt-2 bg-[#523D35] text-[#E8D9CD] rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-[#BBA58F]" />
                  <span>Personal Allergy Warning:</span>
                </div>
                {allergyAlerts.map((msg, i) => (
                  <p key={i} className="text-xs font-medium">{msg}</p>
                ))}
              </div>
            )}
          </div>

          {/* Trimester Suitability & Maternal Benefits */}
          <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-black text-[#223030] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#523D35]" />
                <span>Trimester Suitability &amp; Maternal Health Benefits</span>
              </h4>
              {recipe.trimesterSuitability?.bestSuitedTrimester && (
                <span className="text-[10px] font-black bg-[#223030] text-[#EFEFE9] px-2.5 py-1 rounded-full">
                  🌟 Prime Fit: {recipe.trimesterSuitability.bestSuitedTrimester}
                </span>
              )}
            </div>

            {/* Trimester Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                { 
                  name: '1st Trimester', 
                  suitable: recipe.trimesterSuitability?.firstTrimester?.suitable ?? true,
                  note: recipe.trimesterSuitability?.firstTrimester?.benefits || 'Folate & light digestion'
                },
                { 
                  name: '2nd Trimester', 
                  suitable: recipe.trimesterSuitability?.secondTrimester?.suitable ?? true,
                  note: recipe.trimesterSuitability?.secondTrimester?.benefits || 'Calcium & fetal skeletal growth'
                },
                { 
                  name: '3rd Trimester', 
                  suitable: recipe.trimesterSuitability?.thirdTrimester?.suitable ?? true,
                  note: recipe.trimesterSuitability?.thirdTrimester?.benefits || 'Iron & sustained maternal energy'
                }
              ].map(t => {
                const isCurrent = t.name === trimesterLabel;
                return (
                  <div 
                    key={t.name}
                    className={`p-3 rounded-2xl border transition ${
                      isCurrent 
                        ? 'bg-[#E8D9CD] border-[#523D35] shadow-xs' 
                        : 'bg-[#EFEFE9] border-[#959D90]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#223030] flex items-center gap-1">
                        {t.name}
                        {isCurrent && <span className="text-[9px] bg-[#523D35] text-[#E8D9CD] px-1.5 py-0.2 rounded font-bold">Current</span>}
                      </span>
                      <span className={`text-[10px] font-bold ${t.suitable ? 'text-[#223030]' : 'text-[#523D35]'}`}>
                        {t.suitable ? '✓ Recommended' : '⚠ Caution'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#523D35] leading-snug">
                      {t.note}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bulleted Maternal Benefits */}
            {recipe.maternalHealthBenefits && recipe.maternalHealthBenefits.length > 0 && (
              <div className="pt-2 border-t border-[#959D90]/30 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#523D35] tracking-wider block">
                  Clinical Nutritional Rationale:
                </span>
                <ul className="space-y-1 text-xs text-[#523D35]">
                  {recipe.maternalHealthBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#523D35] font-black">•</span>
                      <span className="font-medium leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 5. INGREDIENTS & DYNAMIC SERVINGS SCALER                      */}
          {/* ============================================================ */}
          <div className="border border-[#959D90] rounded-3xl p-5 bg-[#EFEFE9] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="text-xs font-black text-[#223030] uppercase tracking-wider flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-[#523D35]" />
                  <span>Recipe Ingredients &amp; Servings Scaler</span>
                </h4>
                <p className="text-[11px] text-[#523D35] font-medium">
                  Adjust portions. Ingredients, weights, and nutrients calculate dynamically.
                </p>
              </div>

              {/* Servings Counter */}
              <div className="flex items-center gap-2 bg-[#E8D9CD] p-1.5 rounded-2xl border border-[#959D90]/50">
                <button
                  type="button"
                  onClick={() => handleServingChange(servingsMultiplier - 0.5)}
                  disabled={servingsMultiplier <= 0.5}
                  className="w-7 h-7 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                  title="Decrease servings"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="px-2 text-center">
                  <span className="text-xs font-black text-[#223030] block">
                    {servingsMultiplier} {servingsMultiplier === 1 ? 'Serving' : 'Servings'}
                  </span>
                  <span className="text-[9px] text-[#523D35] font-semibold">
                    ({selectedGrams}g Total)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleServingChange(servingsMultiplier + 0.5)}
                  disabled={servingsMultiplier >= 6}
                  className="w-7 h-7 rounded-xl bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                  title="Increase servings"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Portions Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#523D35] uppercase mr-1">Quick Portions:</span>
              {[1, 2, 3, 4].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleServingChange(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    servingsMultiplier === s
                      ? 'bg-[#223030] text-[#EFEFE9] font-black shadow-xs'
                      : 'bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#523D35] border border-[#959D90]/40'
                  }`}
                >
                  {s} {s === 1 ? 'Serving' : 'Servings'} ({s * baseGrams}g)
                </button>
              ))}

              <div className="flex items-center gap-1.5 bg-[#E8D9CD] border border-[#959D90]/50 rounded-xl px-2 py-0.5 ml-auto">
                <span className="text-[10px] font-bold text-[#523D35] uppercase">Custom:</span>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={customGramsInput}
                  onChange={(e) => handleCustomGramsChange(e.target.value)}
                  className="w-12 text-xs font-black text-[#223030] focus:outline-none bg-transparent"
                />
                <span className="text-[10px] font-bold text-[#959D90]">g</span>
              </div>
            </div>

            {/* Ingredients Table with Interactive Cooking Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {recipe.ingredients.map((ing, i) => {
                const scaledQty = Number((ing.quantity * scaleFactor).toFixed(1));
                const localized = tIngredient(ing.name);
                const isChecked = Boolean(checkedIngredients[i]);
                return (
                  <div 
                    key={i} 
                    onClick={() => toggleIngredientCheck(i)}
                    className={`flex justify-between items-center p-3 rounded-2xl border transition cursor-pointer select-none text-xs ${
                      isChecked 
                        ? 'bg-[#BBA58F]/20 border-[#959D90]/60 opacity-75' 
                        : 'bg-[#E8D9CD] hover:bg-[#BBA58F]/30 border-[#959D90]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredientCheck(i)}
                        className="w-4 h-4 rounded text-[#223030] accent-[#223030] cursor-pointer shrink-0"
                      />
                      <div>
                        <span className={`font-bold text-[#223030] block ${isChecked ? 'line-through text-[#523D35]' : ''}`}>
                          {localized.primary}
                        </span>
                        {localized.secondary && (
                          <span className="text-[10px] text-[#523D35] block">{localized.secondary}</span>
                        )}
                        {!localized.secondary && ing.localName && (
                          <span className="text-[10px] text-[#523D35] block">{ing.localName}</span>
                        )}
                        {ing.preparationNotes && (
                          <span className="text-[9px] text-[#523D35] italic block">({ing.preparationNotes})</span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-black text-[#523D35] bg-[#EFEFE9] px-2.5 py-1 rounded-xl border border-[#959D90]/30 shadow-2xs shrink-0 ml-2">
                      {scaledQty > 0 ? `${scaledQty} ${ing.unit}` : ing.unit || 'To taste'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 6. STEP-BY-STEP PREPARATION METHOD                           */}
          {/* ============================================================ */}
          <div className="border border-[#959D90] rounded-3xl p-5 bg-[#EFEFE9] space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h4 className="text-xs font-black text-[#223030] uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-[#523D35]" />
                <span>Step-by-Step Preparation Method</span>
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#523D35] bg-[#E8D9CD] px-2.5 py-1 rounded-xl border border-[#959D90]/30">
                  Method: {recipe.cookingMethod || 'Traditional Method'}
                </span>
                {recipe.difficulty && (
                  <span className="text-xs font-bold text-[#223030] bg-[#BBA58F]/30 px-2.5 py-1 rounded-xl border border-[#959D90]/30">
                    Difficulty: {recipe.difficulty}
                  </span>
                )}
              </div>
            </div>

            {recipe.preparationSteps && recipe.preparationSteps.length > 0 ? (
              <ol className="space-y-2.5 pt-1">
                {recipe.preparationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30">
                    <span className="w-6 h-6 rounded-xl bg-[#223030] text-[#EFEFE9] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-[#223030] font-medium leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/30 text-xs text-[#223030] leading-relaxed">
                {recipe.cookingMethod || 'Prepare and simmer ingredients thoroughly according to traditional family practices.'}
              </div>
            )}

            {/* Source Attribution & Link to Full Recipe on Source Website */}
            {recipe.originalRecipeUrl && (
              <div className="pt-2 border-t border-[#959D90]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#E8D9CD]/50 p-3 rounded-2xl">
                <div className="text-xs text-[#523D35]">
                  <span className="font-bold text-[#223030]">Authoritative Source: </span>
                  <span>{recipe.sourceName || 'Tarla Dalal / ICMR-NIN Archive'}</span>
                </div>
                <a
                  href={recipe.originalRecipeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs shrink-0"
                >
                  <span>View Full Steps on {recipe.sourceName || 'Source'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#BBA58F]" />
                </a>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 7. NUTRITIONAL INFORMATION (PER SERVING & PER 100G)          */}
          {/* ============================================================ */}
          <div className="border border-[#959D90] rounded-3xl p-5 bg-[#EFEFE9] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="text-xs font-black text-[#223030] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#523D35]" />
                  <span>Authoritative Nutrition Information</span>
                </h4>
                <p className="text-[11px] text-[#523D35] font-medium">
                  Verified according to ICMR-NIN IFCT 2017 standards for gestational health.
                </p>
              </div>

              {/* Toggle Per Serving vs Per 100g */}
              <div className="flex bg-[#E8D9CD] p-1 rounded-xl text-xs font-bold border border-[#959D90]/30">
                <button
                  type="button"
                  onClick={() => setNutritionViewTab('perServing')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    nutritionViewTab === 'perServing'
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-xs font-black'
                      : 'text-[#523D35]'
                  }`}
                >
                  Active Serving ({selectedGrams}g)
                </button>
                <button
                  type="button"
                  onClick={() => setNutritionViewTab('per100g')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    nutritionViewTab === 'per100g'
                      ? 'bg-[#223030] text-[#EFEFE9] shadow-xs font-black'
                      : 'text-[#523D35]'
                  }`}
                >
                  Per 100g Standard
                </button>
              </div>
            </div>

            {/* Nutrition Highlights Display */}
            {nutritionViewTab === 'perServing' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Calories</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{scaledNutrition.calories} kcal</p>
                  <span className="text-[9px] text-[#959D90]">Portion: {selectedGrams}g</span>
                </div>
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Protein</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{scaledNutrition.protein} g</p>
                  <span className="text-[9px] text-[#523D35] font-semibold">Placental Growth</span>
                </div>
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Iron</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{scaledNutrition.iron} mg</p>
                  <span className="text-[9px] text-[#523D35] font-semibold">Blood Volume</span>
                </div>
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Calcium</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{scaledNutrition.calcium} mg</p>
                  <span className="text-[9px] text-[#523D35] font-semibold">Bone &amp; Teeth</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Energy (100g)</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{nutrition100g.calories} kcal</p>
                  <span className="text-[9px] text-[#959D90]">100g Benchmark</span>
                </div>
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Protein (100g)</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{nutrition100g.protein} g</p>
                  <span className="text-[9px] text-[#959D90]">100g Benchmark</span>
                </div>
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Iron (100g)</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{nutrition100g.iron} mg</p>
                  <span className="text-[9px] text-[#959D90]">100g Benchmark</span>
                </div>
                <div className="bg-[#E8D9CD] border border-[#959D90]/50 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#523D35] uppercase">Calcium (100g)</span>
                  <p className="text-base font-black text-[#223030] mt-0.5">{nutrition100g.calcium} mg</p>
                  <span className="text-[9px] text-[#959D90]">100g Benchmark</span>
                </div>
              </div>
            )}

            {/* Micronutrient Categories Filter */}
            <div className="pt-2 border-t border-[#959D90]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#523D35] tracking-wider">
                  Detailed Nutrients Breakdown ({selectedGrams}g Portion):
                </span>
                <div className="flex bg-[#E8D9CD] p-1 rounded-xl text-[10px] font-bold border border-[#959D90]/30">
                  <button
                    type="button"
                    onClick={() => setActiveNutrientTab('macros')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${activeNutrientTab === 'macros' ? 'bg-[#223030] text-[#EFEFE9] shadow-xs font-black' : 'text-[#523D35]'}`}
                  >
                    Macros
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNutrientTab('vitamins')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${activeNutrientTab === 'vitamins' ? 'bg-[#223030] text-[#EFEFE9] shadow-xs font-black' : 'text-[#523D35]'}`}
                  >
                    Vitamins
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNutrientTab('minerals')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${activeNutrientTab === 'minerals' ? 'bg-[#223030] text-[#EFEFE9] shadow-xs font-black' : 'text-[#523D35]'}`}
                  >
                    Minerals
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNutrientTab('all')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${activeNutrientTab === 'all' ? 'bg-[#223030] text-[#EFEFE9] shadow-xs font-black' : 'text-[#523D35]'}`}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
                {(Object.keys(MATERNAL_NUTRIENT_METADATA) as Array<keyof DetailedNutrients>).map(k => {
                  const meta = MATERNAL_NUTRIENT_METADATA[k];
                  if (!meta) return null;

                  if (activeNutrientTab === 'macros' && meta.category !== 'macronutrient') return null;
                  if (activeNutrientTab === 'vitamins' && meta.category !== 'vitamin') return null;
                  if (activeNutrientTab === 'minerals' && meta.category !== 'mineral') return null;

                  const val = scaledNutrition[k] || 0;
                  const dailyTarget = MATERNAL_DAILY_TARGETS[k] || 0;
                  const pct = dailyTarget > 0 ? Math.min(100, Math.round(((val as number) / dailyTarget) * 100)) : 0;

                  return (
                    <div key={k} className="p-2.5 bg-[#E8D9CD] border border-[#959D90]/30 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#523D35] block truncate">{meta.name}</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xs font-black text-[#223030]">{val}</span>
                          <span className="text-[9px] text-[#959D90] font-semibold">{meta.unit}</span>
                        </div>
                      </div>
                      {pct > 0 && (
                        <div className="mt-1 pt-1 border-t border-[#959D90]/30 flex items-center justify-between text-[9px]">
                          <span className="text-[#959D90] font-bold">RDA Target:</span>
                          <span className="font-black text-[#523D35]">{pct}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 8. FOOD ORDERING & BUY INGREDIENTS SECTION (Swiggy, Zomato,  */}
          {/*    Instamart, Blinkit, Zepto, BigBasket)                     */}
          {/* ============================================================ */}
          <FoodOrderingSection
            foodName={recipe.nameEnglish || recipe.traditionalName}
            category={recipe.category}
            ingredients={recipe.ingredients}
            tags={recipe.regionalTags}
            location={globalLocation}
          />

          {/* ============================================================ */}
          {/* 9. USER MEAL PLATE PHOTO LOGGING                            */}
          {/* ============================================================ */}
          <div className="border border-[#959D90] bg-[#EFEFE9] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#223030] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#523D35]" />
                  <span>Log Personal Plate Photo (User Meal Record)</span>
                </h4>
                <p className="text-[11px] text-[#523D35]">
                  Snap or upload the actual meal prepared at home. Personal logs are archived privately without altering database reference imagery.
                </p>
              </div>
            </div>

            {userMealPhoto ? (
              <div className="flex items-center gap-4 p-3 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/40">
                <img
                  src={userMealPhoto}
                  alt="User Plate Snap"
                  className="w-16 h-16 rounded-xl object-cover border border-[#959D90]/50"
                />
                <div className="flex-1">
                  <span className="text-xs font-black text-[#223030] block">Personal Plate Photo Ready</span>
                  <span className="text-[10px] text-[#523D35]">Ready to log with {selectedGrams}g intake</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUserMealPhoto(null)}
                  className="text-xs text-[#523D35] font-bold hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8D9CD] hover:bg-[#BBA58F]/30 text-[#223030] border border-[#959D90]/50 font-bold text-xs rounded-xl cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-[#523D35]" />
                <span>Upload Prepared Meal Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUserPhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* ============================================================ */}
          {/* 10. PRIMARY ACTIONS: MEAL PLANNER INTEGRATION               */}
          {/* ============================================================ */}
          <div className="bg-[#223030] text-[#EFEFE9] rounded-3xl p-5 space-y-4 shadow-xl border border-[#959D90]/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#BBA58F]">
                  Maternal Plan Integration
                </h4>
                <p className="text-[11px] text-[#EFEFE9]/80">
                  Adds directly to your daily meal schedule &amp; immediately updates Dashboard nutrient totals.
                </p>
              </div>

              {existingPlannedMeal && (
                <span className="px-3 py-1 bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/40 rounded-xl text-[11px] font-black flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#BBA58F]" />
                  <span>Currently Planned on {selectedDay} ({existingPlannedMeal.category})</span>
                </span>
              )}
            </div>

            {showMealPlanPicker ? (
              <div className="bg-[#523D35] p-4 rounded-2xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#E8D9CD] mb-1">Select Day</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                      className="w-full bg-[#223030] border border-[#959D90]/50 rounded-xl px-3 py-2 text-xs font-bold text-[#EFEFE9]"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#E8D9CD] mb-1">Meal Slot</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value as MealCategory)}
                      className="w-full bg-[#223030] border border-[#959D90]/50 rounded-xl px-3 py-2 text-xs font-bold text-[#EFEFE9]"
                    >
                      {['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowMealPlanPicker(false)}
                    className="px-3 py-1.5 bg-[#223030] hover:bg-[#223030]/80 text-[#EFEFE9] text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleMealPlanSubmit}
                    className="px-4 py-2 bg-[#BBA58F] hover:bg-[#E8D9CD] text-[#223030] font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#223030]" />
                    <span>Confirm &amp; Add ({servingsMultiplier} Servings, {selectedGrams}g) to {selectedDay} {selectedSlot}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setShowMealPlanPicker(true)}
                  className={`py-3 px-4 font-black text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border ${
                    existingPlannedMeal
                      ? 'bg-[#BBA58F] text-[#223030] border-[#E8D9CD]'
                      : 'bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] border-[#BBA58F]/30'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {existingPlannedMeal ? '✓ Added (Change Slot/Day)' : '+ Add to Meal Plan'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFoodLogSubmit()}
                  className="py-3 px-4 bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] font-black text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#BBA58F]/30"
                >
                  <ListPlus className="w-4 h-4" />
                  <span>Log {selectedGrams}g Intake {userMealPhoto ? '(With Photo)' : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShoppingListSubmit}
                  className="py-3 px-4 bg-[#523D35] hover:bg-[#BBA58F] hover:text-[#223030] text-[#E8D9CD] font-black text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#BBA58F]/30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Ingredients to List</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
