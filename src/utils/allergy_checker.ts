/**
 * Centralized Maternal Allergy Verification Engine
 * 
 * Compares user allergies from their Pregnancy Profile against:
 * - Food name & regional name
 * - Ingredients list
 * - Known allergens & tags
 * 
 * Used uniformly across:
 * - Food Explorer
 * - Food Details
 * - Regional Recipes
 * - AI Food Scanner
 * - Meal Planner
 */

export interface AllergyCheckResult {
  hasAllergy: boolean;
  matchedAllergens: string[];
  matchedIngredients: string[];
  warningMessage: string;
}

// Common allergen synonym dictionary for Indian & maternal diet items
const ALLERGEN_KEYWORDS_MAP: Record<string, string[]> = {
  peanut: ['peanut', 'peanuts', 'groundnut', 'groundnuts', 'shengdana', 'kadalai', 'moongphali', 'shenga'],
  dairy: ['milk', 'curd', 'paneer', 'cheese', 'ghee', 'butter', 'dairy', 'yogurt', 'buttermilk', 'cream', 'khoa', 'khoya', 'malai', 'chaas', 'dahi'],
  egg: ['egg', 'eggs', 'anda', 'omelette', 'albumin'],
  gluten: ['wheat', 'atta', 'maida', 'suji', 'semolina', 'gluten', 'rava', 'barley', 'rye'],
  wheat: ['wheat', 'atta', 'maida', 'suji', 'semolina', 'gluten', 'rava'],
  soy: ['soy', 'soya', 'soybean', 'soybeans', 'tofu', 'edamame'],
  mustard: ['mustard', 'sarson', 'rai', 'kadugu', 'avalu'],
  sesame: ['sesame', 'til', 'ellu'],
  nut: ['cashew', 'almond', 'walnut', 'pistachio', 'pista', 'badam', 'kaju', 'akhrot', 'tree nut', 'nuts'],
  fish: ['fish', 'salmon', 'tuna', 'pomfret', 'rohu', 'catla', 'meen', 'machhli', 'seafood'],
  shellfish: ['prawn', 'prawns', 'shrimp', 'crab', 'lobster', 'shellfish', 'clam']
};

export function checkFoodAllergies(
  foodOrRecipe: {
    name?: string;
    regionalName?: string;
    ingredients?: (string | { name: string })[];
    allergens?: string[];
    tags?: string[];
  },
  userAllergies: string[] = []
): AllergyCheckResult {
  if (!userAllergies || userAllergies.length === 0) {
    return {
      hasAllergy: false,
      matchedAllergens: [],
      matchedIngredients: [],
      warningMessage: ''
    };
  }

  const matchedAllergensSet = new Set<string>();
  const matchedIngredientsSet = new Set<string>();

  // Extract names and ingredients
  const foodName = (foodOrRecipe.name || '').toLowerCase();
  const regionalName = (foodOrRecipe.regionalName || '').toLowerCase();

  const ingredientNames: string[] = (foodOrRecipe.ingredients || []).map(item => {
    if (typeof item === 'string') return item.toLowerCase();
    if (item && typeof item === 'object' && item.name) return item.name.toLowerCase();
    return '';
  }).filter(Boolean);

  const allergensList: string[] = (foodOrRecipe.allergens || []).map(a => a.toLowerCase());
  const tagsList: string[] = (foodOrRecipe.tags || []).map(t => t.toLowerCase());

  // Check each allergy specified in user's profile
  userAllergies.forEach(rawAllergy => {
    if (!rawAllergy || typeof rawAllergy !== 'string') return;
    const cleanAllergy = rawAllergy.toLowerCase().trim().replace(/\(.*\)/, '').trim();
    if (!cleanAllergy) return;

    // Expand search keywords using synonym map if available
    let keywords = [cleanAllergy];
    for (const [category, synonyms] of Object.entries(ALLERGEN_KEYWORDS_MAP)) {
      if (cleanAllergy.includes(category) || synonyms.some(s => cleanAllergy.includes(s))) {
        keywords = Array.from(new Set([...keywords, ...synonyms]));
      }
    }

    // 1. Check in food title
    keywords.forEach(kw => {
      if (foodName.includes(kw) || regionalName.includes(kw)) {
        matchedAllergensSet.add(rawAllergy);
        matchedIngredientsSet.add(foodOrRecipe.name || rawAllergy);
      }
    });

    // 2. Check in ingredient items
    ingredientNames.forEach(ing => {
      keywords.forEach(kw => {
        if (ing.includes(kw) || kw.includes(ing)) {
          matchedAllergensSet.add(rawAllergy);
          matchedIngredientsSet.add(ing);
        }
      });
    });

    // 3. Check in allergens & tags
    allergensList.forEach(allg => {
      keywords.forEach(kw => {
        if (allg.includes(kw)) {
          matchedAllergensSet.add(rawAllergy);
        }
      });
    });

    tagsList.forEach(tag => {
      keywords.forEach(kw => {
        if (tag.includes(kw)) {
          matchedAllergensSet.add(rawAllergy);
        }
      });
    });
  });

  const matchedAllergens = Array.from(matchedAllergensSet);
  const matchedIngredients = Array.from(matchedIngredientsSet);
  const hasAllergy = matchedAllergens.length > 0;

  let warningMessage = '';
  if (hasAllergy) {
    warningMessage = `This food or recipe contains ${matchedAllergens.join(', ')}, which is listed in your allergy profile.`;
  }

  return {
    hasAllergy,
    matchedAllergens,
    matchedIngredients,
    warningMessage
  };
}
