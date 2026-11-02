/**
 * State-Based Food Filtering and Regional Validation Engine
 * 
 * Enforces strict, application-wide isolation of food items by Indian State.
 * Ensures zero cross-state leakage (e.g. Karnataka view displays ONLY Karnataka dishes).
 */

import { KaggleFoodItem, IndianRegion } from '../types';

/**
 * Normalizes state names to a canonical standard
 */
export function normalizeStateName(rawState?: string | null): string {
  if (!rawState) return '';
  const s = rawState.trim().toLowerCase();

  if (s.includes('karnataka')) return 'Karnataka';
  if (s.includes('tamil') || s === 'tn') return 'Tamil Nadu';
  if (s.includes('kerala') || s === 'kl') return 'Kerala';
  if (s.includes('telangana') || s === 'ts') return 'Telangana';
  if (s.includes('andhra') || s === 'ap') return 'Andhra Pradesh';
  if (s.includes('puducherry') || s.includes('pondicherry') || s === 'py') return 'Puducherry';
  if (s.includes('maharashtra') || s === 'mh') return 'Maharashtra';
  if (s.includes('gujarat') || s === 'gj') return 'Gujarat';
  if (s.includes('punjab') || s === 'pb') return 'Punjab';
  if (s.includes('bengal') || s === 'wb') return 'West Bengal';
  if (s.includes('odisha') || s.includes('orissa') || s === 'od') return 'Odisha';
  if (s.includes('rajasthan') || s === 'rj') return 'Rajasthan';
  if (s.includes('assam') || s === 'as') return 'Assam';
  if (s.includes('uttar pradesh') || s === 'up') return 'Uttar Pradesh';
  if (s.includes('madhya pradesh') || s === 'mp') return 'Madhya Pradesh';
  if (s.includes('bihar') || s === 'br') return 'Bihar';
  if (s.includes('goa') || s === 'ga') return 'Goa';
  if (s.includes('delhi') || s === 'dl') return 'Delhi';
  if (s.includes('haryana') || s === 'hr') return 'Haryana';
  if (s.includes('kashmir') || s.includes('jammu')) return 'Jammu & Kashmir';
  if (s.includes('himachal')) return 'Himachal Pradesh';
  if (s.includes('uttarakhand')) return 'Uttarakhand';
  if (s.includes('jharkhand')) return 'Jharkhand';
  if (s.includes('chhattisgarh')) return 'Chhattisgarh';
  if (s.includes('tripura')) return 'Tripura';
  if (s.includes('meghalaya')) return 'Meghalaya';
  if (s.includes('manipur')) return 'Manipur';
  if (s.includes('nagaland')) return 'Nagaland';
  if (s.includes('mizoram')) return 'Mizoram';
  if (s.includes('sikkim')) return 'Sikkim';

  return rawState.trim();
}

/**
 * Checks whether a food item strictly belongs to the target state.
 * 
 * Rules:
 * - Empty or missing states never match.
 * - Pan-Indian / 'National' items do not match specific states.
 * - Andhra Pradesh and Telangana are strictly isolated from each other.
 * - Puducherry is isolated from Tamil Nadu and other states.
 */
export function isMatchingState(foodState?: string | null, targetState?: string | null): boolean {
  if (!foodState || !targetState) return false;

  const normTarget = normalizeStateName(targetState);
  const normFood = normalizeStateName(foodState);

  if (!normTarget || !normFood) return false;

  // National / Pan-Indian items are excluded from state-exclusive views
  if (normFood.toLowerCase() === 'national' || normFood.toLowerCase() === 'all' || normFood.toLowerCase() === 'pan-indian') {
    return false;
  }

  // Strict isolation between Andhra Pradesh and Telangana
  if (normTarget === 'Andhra Pradesh') {
    return normFood === 'Andhra Pradesh';
  }
  if (normTarget === 'Telangana') {
    return normFood === 'Telangana';
  }

  // Strict isolation for Puducherry
  if (normTarget === 'Puducherry') {
    return normFood === 'Puducherry';
  }

  return normTarget.toLowerCase() === normFood.toLowerCase();
}

/**
 * Structured Recommendation Item Schema
 */
export interface StructuredFoodRecommendation {
  scheme_or_food_name: string;
  dish_name: string;
  state: string;
  diet_type: 'Veg' | 'Non-Veg' | 'VEGETARIAN' | 'NON-VEGETARIAN';
  category: string;
  image_category?: string;
  image_url: string;
  badge_icon: string;
  benefit_summary: string;
  trimester_suitability: string[];
  benefits: string;
  nutrients?: {
    calories?: number;
    protein_g?: number;
    iron_mg?: number;
    calcium_mg?: number;
    fiber_g?: number;
    folate_mcg?: number;
  };
  image_prompt: string;
}

/**
 * Standardizes a KaggleFoodItem into the clinical structured response format
 */
export function toStructuredRecommendation(item: KaggleFoodItem, userState: string): StructuredFoodRecommendation {
  const normState = normalizeStateName(userState);
  const localName = item.regionalName ? `${item.name} (${item.regionalName})` : item.name;
  
  const trimesters: string[] = [];
  if (item.trimesterRecommended === 'All Trimesters') {
    trimesters.push('1st Trimester', '2nd Trimester', '3rd Trimester');
  } else if (item.trimesterRecommended) {
    trimesters.push(item.trimesterRecommended);
  } else {
    trimesters.push('1st Trimester', '2nd Trimester', '3rd Trimester');
  }

  const primaryNutrient = item.iron >= 3.5 ? 'Iron' : item.calcium >= 200 ? 'Calcium' : item.protein >= 10 ? 'Protein' : 'Fibre';
  const benefitDesc = item.maternalBenefits || 
    `Traditional ${normState} dish rich in ${primaryNutrient} (${item.iron}mg iron, ${item.calcium}mg calcium, ${item.protein}g protein) supporting healthy gestational maternal wellness and fetal growth.`;

  const isVeg = Boolean(item.isVegetarian);
  const dishImageUrl = item.imageUrl || item.image || '/assets/food_crops/karnataka_ragi_mudde.png';

  return {
    scheme_or_food_name: localName,
    dish_name: localName,
    state: normState,
    diet_type: isVeg ? 'Veg' : 'Non-Veg',
    category: item.category || 'Nutritional Meal',
    image_category: 'food',
    image_url: dishImageUrl,
    badge_icon: isVeg ? '🌿' : '🍗',
    benefit_summary: benefitDesc,
    trimester_suitability: trimesters,
    benefits: benefitDesc,
    nutrients: {
      calories: item.calories,
      protein_g: item.protein,
      iron_mg: item.iron,
      calcium_mg: item.calcium,
      fiber_g: item.fiber,
      folate_mcg: item.folate
    },
    image_prompt: `Authentic traditional ${normState} dish ${item.name}, wholesome Indian maternal nutrition presentation, natural lighting`
  };
}

/**
 * Filter foods strictly by user's state and dietary preference
 */
export function getStrictStateFoods(
  allFoods: KaggleFoodItem[],
  userState: string | undefined | null,
  dietPreference: string = 'Vegetarian'
): KaggleFoodItem[] {
  const targetState = userState || 'Karnataka';
  const isVegOnly = dietPreference.toLowerCase().includes('veg') && !dietPreference.toLowerCase().includes('non');

  return allFoods.filter((item) => {
    // 1. Strict state isolation
    if (!isMatchingState(item.state, targetState)) {
      return false;
    }

    // 2. Strict dietary preference matching:
    // If preference == "Veg": Output ONLY 100% Vegetarian dishes. Strictly exclude meat, poultry, fish, seafood, and eggs.
    // If preference == "Non-Veg": Include BOTH traditional non-vegetarian dishes AND vegetarian options.
    if (isVegOnly && !item.isVegetarian) {
      return false;
    }

    return true;
  });
}
