import { KaggleFoodItem, GlobalLocationState, PregnancyTrimester, UserProfile } from '../types';
import { checkFoodAllergies } from './allergy_checker';

export interface FoodAlternativeResult {
  food: KaggleFoodItem;
  similarityReason: string;
  nutritionalHighlights: string[];
  localRelevance: string;
  score: number;
}

/**
 * Finds 2 to 4 safe, nutritionally similar, allergy-free, and locally available
 * alternatives for a given food.
 */
export function findFoodAlternatives(
  targetFood: {
    id?: string;
    name: string;
    category?: string;
    calories?: number;
    protein?: number;
    iron?: number;
    calcium?: number;
    folate?: number;
    ingredients?: string[];
  },
  allFoods: KaggleFoodItem[],
  userProfile: Partial<UserProfile> = {},
  location?: GlobalLocationState,
  currentTrimester: PregnancyTrimester = '2nd Trimester'
): FoodAlternativeResult[] {
  if (!allFoods || allFoods.length === 0) return [];

  const targetName = (targetFood.name || '').toLowerCase().trim();
  const targetCategory = targetFood.category || '';
  const targetCalories = targetFood.calories || 200;
  const targetProtein = targetFood.protein || 5;
  const targetIron = targetFood.iron || 2;
  const targetCalcium = targetFood.calcium || 50;
  const targetFolate = targetFood.folate || 40;

  const userAllergies = userProfile.allergies || [];
  const userDiet = userProfile.dietPreference || 'Vegetarian';
  const currentState = (location?.state || userProfile.state || 'Karnataka').toLowerCase();
  const currentRegion = (location?.region || 'South India').toLowerCase();

  const candidates: FoodAlternativeResult[] = [];

  for (const candidate of allFoods) {
    // 1. Skip self
    if (candidate.id === targetFood.id || candidate.name.toLowerCase().trim() === targetName) {
      continue;
    }

    // 2. Strict Safety Filter: Must NOT be 'Avoid'
    if (candidate.safetyLevel === 'Avoid') {
      continue;
    }

    // 3. Strict Allergy Safety Filter: Must NOT trigger any user allergy!
    const allergyCheck = checkFoodAllergies(candidate, userAllergies);
    if (allergyCheck.hasAllergy) {
      continue;
    }

    // 4. Diet preference filter
    if (userDiet === 'Vegetarian' && !candidate.isVegetarian) {
      continue;
    }

    // 5. Score calculation based on:
    // - Category similarity
    // - Micronutrient match (Iron, Calcium, Folate, Protein)
    // - Local regional relevance
    let score = 0;
    const highlights: string[] = [];

    // Category match bonus
    if (candidate.category === targetCategory) {
      score += 40;
    }

    // Regional/Local availability bonus
    const candState = (candidate.state || '').toLowerCase();
    const candRegion = (candidate.region || '').toLowerCase();
    let localNote = 'Widely available across India';

    if (candState.includes(currentState) || currentState.includes(candState)) {
      score += 35;
      localNote = `Staple local food in ${location?.state || userProfile.state || 'your state'}`;
    } else if (candRegion.includes(currentRegion) || currentRegion.includes(candRegion)) {
      score += 20;
      localNote = `Readily available across ${location?.region || 'your region'}`;
    }

    // Trimester suitability bonus & highlight
    const isTrimesterSafe =
      candidate.trimesterRecommended === 'All Trimesters' ||
      candidate.trimesterRecommended === currentTrimester;
    if (isTrimesterSafe) {
      score += 15;
      highlights.push(`Safe for ${currentTrimester}`);
    }

    // Allergy-safe highlight
    if (userAllergies.length > 0) {
      highlights.push(`No ${userAllergies.join(', ')} allergen`);
    }

    // Nutritional profile match
    // Protein similarity
    if (Math.abs((candidate.protein || 0) - targetProtein) <= 4 || (candidate.protein && candidate.protein >= targetProtein * 0.7)) {
      score += 15;
      highlights.push('Similar protein content');
    }

    // Iron similarity
    if (targetIron > 2 && candidate.iron >= targetIron * 0.7) {
      score += 20;
      highlights.push(`Rich iron source (${candidate.iron}mg)`);
    }

    // Calcium similarity
    if (targetCalcium > 70 && candidate.calcium >= targetCalcium * 0.7) {
      score += 15;
      highlights.push(`Bone calcium (${candidate.calcium}mg)`);
    }

    // Folate similarity
    if (targetFolate > 50 && candidate.folate >= targetFolate * 0.7) {
      score += 15;
      highlights.push(`Neural folate (${candidate.folate}µg)`);
    }

    // General fallback highlight if needed
    if (highlights.length === 0) {
      if (candidate.protein >= 8) highlights.push(`Provides ${candidate.protein}g protein`);
      if (candidate.iron >= 3) highlights.push(`Provides ${candidate.iron}mg iron`);
      if (candidate.calcium >= 100) highlights.push(`Provides ${candidate.calcium}mg calcium`);
      if (highlights.length === 0) highlights.push(`Balanced energy (${candidate.calories} kcal)`);
    }

    // Create similarity rationale
    let reason = 'Provides equivalent essential nutrients and gentle maternal digestion.';
    if (candidate.category === targetCategory) {
      reason = `Direct botanical and culinary equivalent in the ${candidate.category} family with similar micro-nutrients.`;
    } else if (highlights.length >= 2) {
      reason = `Matches maternal ${highlights.slice(0, 2).join(' and ')} targets closely.`;
    }

    candidates.push({
      food: candidate,
      similarityReason: reason,
      nutritionalHighlights: highlights.slice(0, 3),
      localRelevance: localNote,
      score
    });
  }

  // Sort descending by calculated score and return top 2 to 4 items
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, 4);
}
