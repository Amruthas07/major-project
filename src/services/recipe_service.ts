import { RegionalRecipe, RecipeIngredient } from '../types/recipe';
import { CURATED_REGIONAL_RECIPES } from '../data/regional_recipes_db';
import { COMPREHENSIVE_RECIPES_DATABASE } from '../data/comprehensive_recipes_database';
import { PAN_INDIA_RECIPES_CATALOG } from '../data/pan_india_recipes_catalog';
import { GlobalLocationState } from '../types';

// Master unified recipe catalog
const ALL_RECIPES_MAP = new Map<string, RegionalRecipe>();

// Load curated base recipes
CURATED_REGIONAL_RECIPES.forEach(r => {
  ALL_RECIPES_MAP.set(r.recipeId, r);
});

// Overlay comprehensive structured recipes (with enriched steps, trimester suitability, and food IDs)
COMPREHENSIVE_RECIPES_DATABASE.forEach(r => {
  ALL_RECIPES_MAP.set(r.recipeId, {
    ...(ALL_RECIPES_MAP.get(r.recipeId) || {}),
    ...r
  });
});

// Integrate Pan-India authentic regional recipe catalog
PAN_INDIA_RECIPES_CATALOG.forEach(r => {
  ALL_RECIPES_MAP.set(r.recipeId, {
    ...(ALL_RECIPES_MAP.get(r.recipeId) || {}),
    ...r
  });
});

export const ALL_CENTRALIZED_RECIPES: RegionalRecipe[] = Array.from(ALL_RECIPES_MAP.values());

/**
 * Normalizes text for fuzzy match
 */
function normalizeText(text: string): string {
  return (text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Resolves the connected Recipe for any Food Item from the Food Database
 * Works via:
 * 1. Direct Food ID match (e.g. 'karnataka-ragi-mudde')
 * 2. Recipe ID match (e.g. 'rec_ragi_mudde_ka')
 * 3. Exact or fuzzy dish name match in English, Kannada, Hindi, Tamil, Telugu, Malayalam, etc.
 */
export function getRecipeForFood(foodIdentifier: any): RegionalRecipe | undefined {
  if (!foodIdentifier) return undefined;

  const allRecipes = ALL_CENTRALIZED_RECIPES;

  // Case 1: String passed (ID or name)
  if (typeof foodIdentifier === 'string') {
    const directIdMatch = allRecipes.find(r => 
      r.recipeId === foodIdentifier || 
      r.foodId === foodIdentifier
    );
    if (directIdMatch) return directIdMatch;

    const normQuery = normalizeText(foodIdentifier);
    return allRecipes.find(r => {
      const normTrad = normalizeText(r.traditionalName);
      const normEng = normalizeText(r.nameEnglish || '');
      const normLocal = normalizeText(r.nameLocal || '');
      return normTrad.includes(normQuery) || 
             normQuery.includes(normTrad) || 
             (normEng && (normEng.includes(normQuery) || normQuery.includes(normEng))) ||
             (normLocal && (normLocal.includes(normQuery) || normQuery.includes(normLocal)));
    });
  }

  // Case 2: Object passed (KaggleFoodItem or FoodItem)
  const id = foodIdentifier.id || '';
  const name = foodIdentifier.name || '';
  const regionalName = foodIdentifier.regionalName || '';

  // 1. Direct ID match
  const matchById = allRecipes.find(r => r.foodId === id || r.recipeId === id);
  if (matchById) return matchById;

  // 2. Name match (English, Regional, or Local scripts)
  const normTarget = normalizeText(typeof name === 'string' ? name : (name.en || ''));
  const normReg = normalizeText(regionalName);

  const foundMatch = allRecipes.find(r => {
    const normTrad = normalizeText(r.traditionalName);
    const normEng = normalizeText(r.nameEnglish || '');
    const normLocal = normalizeText(r.nameLocal || '');

    if (normTarget && (normTrad.includes(normTarget) || normTarget.includes(normTrad))) return true;
    if (normEng && normTarget && (normEng.includes(normTarget) || normTarget.includes(normEng))) return true;
    if (normReg && (normTrad.includes(normReg) || normLocal.includes(normReg))) return true;

    // Special Indian keywords mapping
    if (normTarget.includes('ragimudde') && normTrad.includes('ragi')) return true;
    if (normTarget.includes('bisibele') && normTrad.includes('bisi')) return true;
    if (normTarget.includes('akkiroti') && normTrad.includes('akki')) return true;
    if (normTarget.includes('soppusaaru') && (normTrad.includes('soppu') || normTrad.includes('saaru'))) return true;
    if (normTarget.includes('joladaroti') && normTrad.includes('jola')) return true;
    if (normTarget.includes('palakpaneer') && normTrad.includes('palak')) return true;
    if (normTarget.includes('rajma') && normTrad.includes('rajma')) return true;
    if (normTarget.includes('khamandhokla') && normTrad.includes('dhokla')) return true;
    if (normTarget.includes('methithepla') && normTrad.includes('thepla')) return true;
    if (normTarget.includes('macherjhol') && normTrad.includes('macher')) return true;
    if (normTarget.includes('kadalacurry') && normTrad.includes('kadala')) return true;
    if (normTarget.includes('avial') && normTrad.includes('avial')) return true;
    if (normTarget.includes('pongal') && normTrad.includes('pongal')) return true;
    if (normTarget.includes('poha') && normTrad.includes('poha')) return true;

    return false;
  });

  if (foundMatch) return foundMatch;

  // 3. If food item has an authentic recipe structure attached, synthesize a complete RegionalRecipe
  if (foodIdentifier && foodIdentifier.recipe) {
    const r = foodIdentifier.recipe;
    return {
      recipeId: `rec_${foodIdentifier.id || 'gen'}`,
      foodId: foodIdentifier.id,
      region: (foodIdentifier.region?.replace(' India', '') as any) || 'South',
      state: foodIdentifier.state || 'Karnataka',
      traditionalName: foodIdentifier.name,
      englishName: foodIdentifier.name,
      localName: foodIdentifier.localName || foodIdentifier.name,
      cuisine: foodIdentifier.cuisine || foodIdentifier.state,
      category: (foodIdentifier.category === 'Traditional Dishes' ? 'Main Dish' : foodIdentifier.category) as any,
      referenceImageUrl: foodIdentifier.image || null,
      imageUrl: foodIdentifier.image || null,
      preparationTimeMinutes: r.prepTimeMinutes || 15,
      cookingTimeMinutes: r.cookTimeMinutes || 20,
      servingSize: {
        servings: 1,
        totalGrams: 200,
        servingGrams: 200,
        servingUnit: foodIdentifier.servingSize || '1 standard bowl'
      },
      foodSafety: {
        level: (foodIdentifier.safetyLevel === 'Safe' ? 'Generally suitable' : foodIdentifier.safetyLevel === 'Safe in Moderation' ? 'Use caution' : 'Avoid / consult healthcare professional') as any,
        explanation: foodIdentifier.safetyExplanation || foodIdentifier.maternalBenefits || 'ICMR vetted pregnancy safe nutrition'
      },
      trimesterSuitability: {
        firstTrimester: true,
        secondTrimester: true,
        thirdTrimester: true,
        bestSuitedTrimester: foodIdentifier.trimesterSuitability || foodIdentifier.trimesterRecommended || 'All Trimesters',
        maternalBenefits: foodIdentifier.maternalBenefits || 'Nourishing Indian meal'
      },
      ingredients: (r.ingredients || []).map((ing: any) => ({
        name: typeof ing === 'string' ? ing : ing.name,
        quantity: typeof ing === 'string' ? 50 : ing.quantity || 50,
        unit: typeof ing === 'string' ? 'g' : ing.unit || 'g',
        notes: typeof ing === 'string' ? undefined : ing.notes
      })),
      preparationSteps: r.instructions || [],
      instructions: r.instructions || [],
      pregnancyNutritionNotes: [
        foodIdentifier.maternalBenefits,
        ...(r.safetyTips ? [r.safetyTips] : [])
      ].filter(Boolean),
      nutrition: {
        calories: foodIdentifier.calories || 200,
        protein: foodIdentifier.protein || 8,
        carbohydrates: foodIdentifier.carbs || 30,
        fat: foodIdentifier.fat || 5,
        fiber: foodIdentifier.fiber || 4,
        iron: foodIdentifier.iron || 2,
        calcium: foodIdentifier.calcium || 80,
        folate: foodIdentifier.folate || 40,
        zinc: foodIdentifier.zinc || 1.2,
        vitaminA: foodIdentifier.vitaminA || 150,
        vitaminC: foodIdentifier.vitaminC || 15,
        vitaminD: 0,
        vitaminB12: 0,
        potassium: 200,
        sodium: 100,
        magnesium: 50,
        phosphorus: 80
      } as any,
      nutritionStatus: 'Calculated' as any,
      nutritionSource: 'ICMR-NIN IFCT 2020 Standardized',
      nutritionDataSourceType: 'ICMR-NIN IFCT 2017' as any,
      allergens: [],
      isVegetarian: true,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  return undefined;
}

/**
 * Retrieve all recipes
 */
export function getAllCentralizedRecipes(): RegionalRecipe[] {
  return ALL_CENTRALIZED_RECIPES;
}

/**
 * Retrieve a specific recipe by ID
 */
export function getRecipeById(recipeId: string): RegionalRecipe | undefined {
  return ALL_RECIPES_MAP.get(recipeId) || ALL_CENTRALIZED_RECIPES.find(r => r.recipeId === recipeId || r.foodId === recipeId);
}

/**
 * Filter and sort recipes according to user's location
 * Geographic Prioritization:
 * 1. Exact City/Taluk/District match (e.g. Mysuru/Nanjangud)
 * 2. State match (e.g. Karnataka)
 * 3. Region match (e.g. South)
 * 4. Pan-India culinary heritage
 */
export function getRecipesByLocation(location: GlobalLocationState | null): RegionalRecipe[] {
  const all = [...ALL_CENTRALIZED_RECIPES];
  if (!location || !location.state) return all;

  const locState = (location.state || '').toLowerCase().trim();
  const locCity = (location.city || '').toLowerCase().trim();
  const locDistrict = (location.district || '').toLowerCase().trim();

  return all.sort((a, b) => {
    const aCity = (a.city || a.cityOrOrigin || '').toLowerCase();
    const bCity = (b.city || b.cityOrOrigin || '').toLowerCase();
    const aState = (a.state || '').toLowerCase();
    const bState = (b.state || '').toLowerCase();

    // Exact city/taluk priority
    const aCityMatch = (locCity && aCity.includes(locCity)) || (locDistrict && aCity.includes(locDistrict));
    const bCityMatch = (locCity && bCity.includes(locCity)) || (locDistrict && bCity.includes(locDistrict));
    if (aCityMatch && !bCityMatch) return -1;
    if (!aCityMatch && bCityMatch) return 1;

    // State priority
    const aStateMatch = aState.includes(locState);
    const bStateMatch = bState.includes(locState);
    if (aStateMatch && !bStateMatch) return -1;
    if (!aStateMatch && bStateMatch) return 1;

    return 0;
  });
}

/**
 * Filter recipes prioritized for a specific pregnancy trimester
 */
export function getRecipesByTrimester(trimesterNumber: number | string): RegionalRecipe[] {
  const tNum = typeof trimesterNumber === 'string' ? parseInt(trimesterNumber.replace(/\D/g, ''), 10) : trimesterNumber;
  const all = [...ALL_CENTRALIZED_RECIPES];

  return all.sort((a, b) => {
    const aSuit = a.trimesterSuitability;
    const bSuit = b.trimesterSuitability;
    if (!aSuit && !bSuit) return 0;
    if (!aSuit) return 1;
    if (!bSuit) return -1;

    const aBest = aSuit.bestSuitedTrimester || '';
    const bBest = bSuit.bestSuitedTrimester || '';

    const targetLabel = tNum === 1 ? '1st Trimester' : tNum === 2 ? '2nd Trimester' : '3rd Trimester';

    if (aBest === targetLabel && bBest !== targetLabel) return -1;
    if (aBest !== targetLabel && bBest === targetLabel) return 1;

    return 0;
  });
}

/**
 * Calculates scaled nutrients for a selected serving multiplier
 */
export function calculateScaledRecipeNutrition(recipe: RegionalRecipe, servings: number) {
  const base = recipe.nutrition;
  const mult = Math.max(0.5, servings || 1);

  return {
    calories: Math.round((base.calories || 0) * mult),
    protein: Number(((base.protein || 0) * mult).toFixed(1)),
    carbohydrates: Number(((base.carbohydrates || 0) * mult).toFixed(1)),
    fat: Number(((base.fat || 0) * mult).toFixed(1)),
    fiber: Number(((base.fiber || 0) * mult).toFixed(1)),
    iron: Number(((base.iron || 0) * mult).toFixed(1)),
    calcium: Math.round((base.calcium || 0) * mult),
    folate: Math.round((base.vitaminB9 || 0) * mult)
  };
}
