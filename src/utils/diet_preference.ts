/**
 * Diet Preference and Food Classification Utilities
 * Ensures strict adherence to:
 * - Vegetarian user -> ONLY vegetarian foods
 * - Non-Vegetarian user -> vegetarian + non-vegetarian foods
 * - Pregnancy safety is never overridden
 */

export type DietPreference = 'vegetarian' | 'non-vegetarian' | 'Vegetarian' | 'Non-Vegetarian';
export type FoodDietType = 'vegetarian' | 'non-vegetarian';

/**
 * Normalizes user diet preference to a standard lowercase value ('vegetarian' | 'non-vegetarian')
 */
export function normalizeDietPreference(pref?: string): 'vegetarian' | 'non-vegetarian' {
  if (!pref) return 'vegetarian';
  const clean = pref.toLowerCase().trim();
  if (clean.includes('non')) {
    return 'non-vegetarian';
  }
  return 'vegetarian';
}

/**
 * Resolves the dietType classification for a food item record.
 * Never guesses from food name alone when record metadata is present.
 */
export function getFoodDietType(food: {
  name?: string;
  isVegetarian?: boolean;
  dietType?: string;
  category?: string;
  tags?: string[];
}): FoodDietType {
  if (food.dietType) {
    const dt = food.dietType.toLowerCase().trim();
    if (dt === 'vegetarian' || dt === 'non-vegetarian') {
      return dt;
    }
  }

  if (food.isVegetarian === false) {
    return 'non-vegetarian';
  }

  if (food.isVegetarian === true) {
    return 'vegetarian';
  }

  const cat = (food.category || '').toLowerCase();
  if (
    cat.includes('egg') ||
    cat.includes('poultry') ||
    cat.includes('meat') ||
    cat.includes('fish') ||
    cat.includes('seafood') ||
    cat.includes('non-veg')
  ) {
    return 'non-vegetarian';
  }

  const tags = (food.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes('non-veg') || t.includes('poultry') || t.includes('meat') || t.includes('egg'))) {
    return 'non-vegetarian';
  }

  if (food.name) {
    const n = food.name.toLowerCase();
    if (
      n.includes('chicken') ||
      n.includes('egg') ||
      n.includes('fish') ||
      n.includes('meat') ||
      n.includes('mutton') ||
      n.includes('prawn') ||
      n.includes('crab') ||
      n.includes('poultry') ||
      n.includes('omlet') ||
      n.includes('omelette')
    ) {
      return 'non-vegetarian';
    }
  }

  return 'vegetarian';
}

/**
 * Validates whether a food item is eligible to be viewed or recommended for a given user preference.
 * - Vegetarian user -> ONLY vegetarian foods
 * - Non-Vegetarian user -> vegetarian + non-vegetarian foods
 */
export function isFoodEligibleForDiet(
  food: { name?: string; isVegetarian?: boolean; dietType?: string; category?: string; tags?: string[] },
  userPreference?: string
): boolean {
  const userPref = normalizeDietPreference(userPreference);
  const foodType = getFoodDietType(food);

  if (userPref === 'vegetarian') {
    return foodType === 'vegetarian';
  }

  // Non-vegetarian user is eligible for both vegetarian and non-vegetarian foods
  return true;
}

/**
 * Checks recipe suitability based on diet preference
 */
export function isRecipeEligibleForDiet(
  recipe: { isVegetarian?: boolean; dietType?: string },
  userPreference?: string
): boolean {
  const userPref = normalizeDietPreference(userPreference);
  if (userPref === 'vegetarian') {
    return recipe.isVegetarian !== false && recipe.dietType !== 'non-vegetarian';
  }
  return true;
}

/**
 * Validation check when adding a food item to a meal plan
 */
export function validateFoodAdditionForDiet(
  food: { name?: string; isVegetarian?: boolean; dietType?: string; category?: string; tags?: string[] },
  userPreference?: string
): { allowed: boolean; reason?: string } {
  const userPref = normalizeDietPreference(userPreference);
  const foodType = getFoodDietType(food);

  if (userPref === 'vegetarian' && foodType === 'non-vegetarian') {
    return {
      allowed: false,
      reason: `“${food.name || 'This dish'}” is non-vegetarian and does not match your current Vegetarian diet preference.`
    };
  }

  return { allowed: true };
}
