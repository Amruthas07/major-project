import { DetailedNutrients } from '../nutrition_engine';
import { RecipeIngredient, RecipeServingSize, RegionalRecipe, FoodSafetyLevel } from '../types/recipe';

// Unit conversion helper to grams/ml
export function convertUnitToGrams(quantity: number, unit: string, ingredientName: string): number {
  const name = ingredientName.toLowerCase();
  const u = unit.toLowerCase();

  if (u === 'g' || u === 'gram' || u === 'grams') return quantity;
  if (u === 'ml' || u === 'milliliter') return quantity; // Approx 1g/ml for water/broth
  if (u === 'kg') return quantity * 1000;
  if (u === 'l' || u === 'liter' || u === 'litre') return quantity * 1000;
  if (u === 'pinch') return quantity * 1;
  if (u === 'tsp' || u === 'teaspoon') return quantity * 5;
  if (u === 'tbsp' || u === 'tablespoon') return quantity * 15;
  if (u === 'cup') return quantity * 150; // Standard Indian culinary cup ~150g flour/200ml liquid
  if (u === 'bowl') return quantity * 200;

  if (u === 'piece' || u === 'pieces') {
    if (name.includes('egg')) return quantity * 50;
    if (name.includes('banana')) return quantity * 100;
    if (name.includes('apple') || name.includes('orange')) return quantity * 150;
    if (name.includes('chilli') || name.includes('clove') || name.includes('cardamom')) return quantity * 3;
    if (name.includes('onion') || name.includes('potato') || name.includes('tomato')) return quantity * 80;
    if (name.includes('roti') || name.includes('chapati') || name.includes('idli')) return quantity * 40;
    return quantity * 30; // default piece weight
  }

  return quantity;
}

// Extensive verified IFCT 2017 & culinary ingredient composition dataset (per 100g)
export const INGREDIENT_COMPOSITION_DATA: Record<string, Partial<DetailedNutrients>> = {
  // Grains, Millets & Flours
  'ragi': { calories: 320, protein: 7.3, carbohydrates: 72.0, fat: 1.3, saturatedFat: 0.3, fiber: 11.5, calcium: 344, iron: 3.9, magnesium: 137, phosphorus: 283, potassium: 408, zinc: 2.3, vitaminB1: 0.42, vitaminB9: 18.3, choline: 24, omega3: 0.08 },
  'ragi flour': { calories: 320, protein: 7.3, carbohydrates: 72.0, fat: 1.3, saturatedFat: 0.3, fiber: 11.5, calcium: 344, iron: 3.9, magnesium: 137, phosphorus: 283, potassium: 408, zinc: 2.3, vitaminB1: 0.42, vitaminB9: 18.3, choline: 24, omega3: 0.08 },
  'finger millet': { calories: 320, protein: 7.3, carbohydrates: 72.0, fat: 1.3, saturatedFat: 0.3, fiber: 11.5, calcium: 344, iron: 3.9, magnesium: 137, phosphorus: 283, potassium: 408, zinc: 2.3, vitaminB1: 0.42, vitaminB9: 18.3, choline: 24, omega3: 0.08 },
  'rice': { calories: 350, protein: 6.8, carbohydrates: 78.0, fat: 0.6, saturatedFat: 0.15, fiber: 1.3, calcium: 10, iron: 0.8, magnesium: 25, phosphorus: 105, potassium: 85, zinc: 1.1, vitaminB1: 0.07, vitaminB9: 8.0, choline: 6, omega3: 0.01 },
  'rice flour': { calories: 350, protein: 6.0, carbohydrates: 79.0, fat: 0.8, saturatedFat: 0.2, fiber: 1.4, calcium: 10, iron: 0.7, magnesium: 24, phosphorus: 98, potassium: 76, zinc: 0.8, vitaminB1: 0.06, vitaminB9: 6.0, choline: 5, omega3: 0.01 },
  'wheat flour': { calories: 340, protein: 11.0, carbohydrates: 70.0, fat: 1.7, saturatedFat: 0.3, fiber: 10.5, calcium: 34, iron: 3.8, magnesium: 125, phosphorus: 300, potassium: 360, zinc: 2.5, vitaminB1: 0.40, vitaminB9: 44.0, choline: 32, omega3: 0.07 },
  'atta': { calories: 340, protein: 11.0, carbohydrates: 70.0, fat: 1.7, saturatedFat: 0.3, fiber: 10.5, calcium: 34, iron: 3.8, magnesium: 125, phosphorus: 300, potassium: 360, zinc: 2.5, vitaminB1: 0.40, vitaminB9: 44.0, choline: 32, omega3: 0.07 },
  'jowar': { calories: 334, protein: 10.4, carbohydrates: 67.7, fat: 1.9, saturatedFat: 0.4, fiber: 9.7, calcium: 25, iron: 4.1, magnesium: 133, phosphorus: 222, potassium: 274, zinc: 2.2, vitaminB1: 0.38, vitaminB9: 39.0, choline: 28, omega3: 0.06 },
  'bajra': { calories: 361, protein: 11.6, carbohydrates: 67.5, fat: 5.0, saturatedFat: 1.0, fiber: 11.5, calcium: 42, iron: 8.0, magnesium: 137, phosphorus: 296, potassium: 307, zinc: 3.1, vitaminB1: 0.33, vitaminB9: 45.0, choline: 34, omega3: 0.12 },
  'oats': { calories: 389, protein: 16.9, carbohydrates: 66.3, fat: 6.9, saturatedFat: 1.2, fiber: 10.6, calcium: 54, iron: 4.7, magnesium: 177, phosphorus: 523, potassium: 429, zinc: 4.0, vitaminB1: 0.76, vitaminB9: 56.0, choline: 40, omega3: 0.11 },
  'poha': { calories: 346, protein: 6.6, carbohydrates: 77.0, fat: 1.2, saturatedFat: 0.3, fiber: 2.8, calcium: 20, iron: 20.0, magnesium: 40, phosphorus: 145, potassium: 110, zinc: 1.2, vitaminB1: 0.14, vitaminB9: 16.0, choline: 12, omega3: 0.02 },
  'suji': { calories: 360, protein: 10.5, carbohydrates: 73.0, fat: 1.0, saturatedFat: 0.2, fiber: 3.5, calcium: 16, iron: 1.2, magnesium: 45, phosphorus: 135, potassium: 185, zinc: 1.0, vitaminB1: 0.28, vitaminB9: 25.0, choline: 14, omega3: 0.03 },
  'semolina': { calories: 360, protein: 10.5, carbohydrates: 73.0, fat: 1.0, saturatedFat: 0.2, fiber: 3.5, calcium: 16, iron: 1.2, magnesium: 45, phosphorus: 135, potassium: 185, zinc: 1.0, vitaminB1: 0.28, vitaminB9: 25.0, choline: 14, omega3: 0.03 },
  'sattu': { calories: 385, protein: 22.5, carbohydrates: 64.0, fat: 5.2, saturatedFat: 0.8, fiber: 14.0, calcium: 95, iron: 7.5, magnesium: 140, phosphorus: 320, potassium: 650, zinc: 3.5, vitaminB1: 0.42, vitaminB9: 68.0, choline: 55, omega3: 0.15 },

  // Pulses, Lentils & Legumes
  'toor dal': { calories: 343, protein: 22.3, carbohydrates: 60.4, fat: 1.7, saturatedFat: 0.4, fiber: 15.0, calcium: 73, iron: 5.2, magnesium: 102, phosphorus: 304, potassium: 1120, zinc: 2.7, vitaminB1: 0.45, vitaminB9: 103.0, choline: 45, omega3: 0.09 },
  'arhar dal': { calories: 343, protein: 22.3, carbohydrates: 60.4, fat: 1.7, saturatedFat: 0.4, fiber: 15.0, calcium: 73, iron: 5.2, magnesium: 102, phosphorus: 304, potassium: 1120, zinc: 2.7, vitaminB1: 0.45, vitaminB9: 103.0, choline: 45, omega3: 0.09 },
  'moong dal': { calories: 348, protein: 24.0, carbohydrates: 59.8, fat: 1.2, saturatedFat: 0.3, fiber: 16.3, calcium: 75, iron: 4.4, magnesium: 127, phosphorus: 326, potassium: 843, zinc: 2.8, vitaminB1: 0.47, vitaminB9: 140.0, choline: 52, omega3: 0.12 },
  'green gram': { calories: 348, protein: 24.0, carbohydrates: 59.8, fat: 1.2, saturatedFat: 0.3, fiber: 16.3, calcium: 75, iron: 4.4, magnesium: 127, phosphorus: 326, potassium: 843, zinc: 2.8, vitaminB1: 0.47, vitaminB9: 140.0, choline: 52, omega3: 0.12 },
  'urad dal': { calories: 341, protein: 25.2, carbohydrates: 58.9, fat: 1.4, saturatedFat: 0.3, fiber: 18.3, calcium: 154, iron: 7.5, magnesium: 130, phosphorus: 385, potassium: 983, zinc: 3.5, vitaminB1: 0.42, vitaminB9: 144.0, choline: 58, omega3: 0.14 },
  'black gram': { calories: 341, protein: 25.2, carbohydrates: 58.9, fat: 1.4, saturatedFat: 0.3, fiber: 18.3, calcium: 154, iron: 7.5, magnesium: 130, phosphorus: 385, potassium: 983, zinc: 3.5, vitaminB1: 0.42, vitaminB9: 144.0, choline: 58, omega3: 0.14 },
  'chana dal': { calories: 360, protein: 20.8, carbohydrates: 59.8, fat: 5.6, saturatedFat: 0.6, fiber: 15.3, calcium: 56, iron: 5.3, magnesium: 115, phosphorus: 312, potassium: 870, zinc: 2.6, vitaminB1: 0.48, vitaminB9: 125.0, choline: 48, omega3: 0.10 },
  'chickpeas': { calories: 364, protein: 19.3, carbohydrates: 60.6, fat: 6.0, saturatedFat: 0.6, fiber: 17.4, calcium: 105, iron: 6.2, magnesium: 115, phosphorus: 366, potassium: 875, zinc: 3.4, vitaminB1: 0.48, vitaminB9: 186.0, choline: 65, omega3: 0.14 },
  'kabuli chana': { calories: 364, protein: 19.3, carbohydrates: 60.6, fat: 6.0, saturatedFat: 0.6, fiber: 17.4, calcium: 105, iron: 6.2, magnesium: 115, phosphorus: 366, potassium: 875, zinc: 3.4, vitaminB1: 0.48, vitaminB9: 186.0, choline: 65, omega3: 0.14 },
  'rajma': { calories: 333, protein: 22.9, carbohydrates: 60.0, fat: 1.3, saturatedFat: 0.3, fiber: 15.2, calcium: 140, iron: 6.7, magnesium: 140, phosphorus: 410, potassium: 1406, zinc: 2.8, vitaminB1: 0.52, vitaminB9: 130.0, choline: 60, omega3: 0.18 },
  'kidney beans': { calories: 333, protein: 22.9, carbohydrates: 60.0, fat: 1.3, saturatedFat: 0.3, fiber: 15.2, calcium: 140, iron: 6.7, magnesium: 140, phosphorus: 410, potassium: 1406, zinc: 2.8, vitaminB1: 0.52, vitaminB9: 130.0, choline: 60, omega3: 0.18 },

  // Dairy
  'milk': { calories: 65, protein: 3.3, carbohydrates: 4.8, fat: 3.6, saturatedFat: 2.2, fiber: 0, calcium: 120, iron: 0.1, magnesium: 12, phosphorus: 95, potassium: 150, sodium: 50, zinc: 0.4, vitaminA: 38, vitaminB2: 0.18, vitaminB12: 0.45, vitaminD: 0.1, choline: 14 },
  'curd': { calories: 98, protein: 3.8, carbohydrates: 4.7, fat: 4.3, saturatedFat: 2.8, fiber: 0, calcium: 150, iron: 0.2, magnesium: 18, phosphorus: 130, potassium: 200, sodium: 65, zinc: 0.8, vitaminA: 45, vitaminB2: 0.18, vitaminB12: 0.55, vitaminD: 0.15, choline: 16 },
  'yogurt': { calories: 98, protein: 3.8, carbohydrates: 4.7, fat: 4.3, saturatedFat: 2.8, fiber: 0, calcium: 150, iron: 0.2, magnesium: 18, phosphorus: 130, potassium: 200, sodium: 65, zinc: 0.8, vitaminA: 45, vitaminB2: 0.18, vitaminB12: 0.55, vitaminD: 0.15, choline: 16 },
  'paneer': { calories: 265, protein: 18.3, carbohydrates: 3.4, fat: 20.8, saturatedFat: 12.8, fiber: 0, calcium: 480, iron: 0.4, magnesium: 28, phosphorus: 310, potassium: 110, sodium: 22, zinc: 2.7, vitaminA: 190, vitaminB2: 0.25, vitaminB12: 0.85, vitaminD: 0.3, choline: 32 },
  'ghee': { calories: 900, protein: 0, carbohydrates: 0, fat: 99.5, saturatedFat: 62.0, fiber: 0, calcium: 0, iron: 0, vitaminA: 350, vitaminE: 2.8, vitaminK: 8.6 },
  'butter': { calories: 717, protein: 0.9, carbohydrates: 0.1, fat: 81.1, saturatedFat: 51.4, fiber: 0, calcium: 24, iron: 0.1, vitaminA: 684, vitaminE: 2.3 },

  // Vegetables & Greens
  'spinach': { calories: 23, protein: 2.9, carbohydrates: 3.6, fat: 0.4, saturatedFat: 0.1, fiber: 2.2, calcium: 99, iron: 2.7, magnesium: 79, phosphorus: 49, potassium: 558, sodium: 79, zinc: 0.5, vitaminA: 469, vitaminC: 28.1, vitaminK: 483, vitaminB9: 194, choline: 19 },
  'palak': { calories: 23, protein: 2.9, carbohydrates: 3.6, fat: 0.4, saturatedFat: 0.1, fiber: 2.2, calcium: 99, iron: 2.7, magnesium: 79, phosphorus: 49, potassium: 558, sodium: 79, zinc: 0.5, vitaminA: 469, vitaminC: 28.1, vitaminK: 483, vitaminB9: 194, choline: 19 },
  'moringa': { calories: 64, protein: 9.4, carbohydrates: 8.3, fat: 1.4, saturatedFat: 0.3, fiber: 4.0, calcium: 440, iron: 8.2, magnesium: 147, phosphorus: 112, potassium: 337, zinc: 1.6, vitaminA: 756, vitaminC: 51.7, vitaminB9: 40.0, choline: 45 },
  'drumstick leaves': { calories: 64, protein: 9.4, carbohydrates: 8.3, fat: 1.4, saturatedFat: 0.3, fiber: 4.0, calcium: 440, iron: 8.2, magnesium: 147, phosphorus: 112, potassium: 337, zinc: 1.6, vitaminA: 756, vitaminC: 51.7, vitaminB9: 40.0, choline: 45 },
  'drumstick': { calories: 37, protein: 2.1, carbohydrates: 8.5, fat: 0.2, fiber: 3.2, calcium: 30, iron: 0.8, magnesium: 45, phosphorus: 50, potassium: 260, vitaminC: 141.0, vitaminA: 40 },
  'fenugreek leaves': { calories: 49, protein: 4.4, carbohydrates: 6.0, fat: 0.9, fiber: 3.5, calcium: 395, iron: 3.7, magnesium: 60, phosphorus: 51, potassium: 500, vitaminA: 645, vitaminC: 52.0, vitaminB9: 84.0 },
  'methi': { calories: 49, protein: 4.4, carbohydrates: 6.0, fat: 0.9, fiber: 3.5, calcium: 395, iron: 3.7, magnesium: 60, phosphorus: 51, potassium: 500, vitaminA: 645, vitaminC: 52.0, vitaminB9: 84.0 },
  'mustard greens': { calories: 27, protein: 2.9, carbohydrates: 4.7, fat: 0.4, fiber: 3.2, calcium: 115, iron: 1.6, magnesium: 32, phosphorus: 58, potassium: 384, vitaminA: 525, vitaminC: 70.0, vitaminK: 497 },
  'sarson': { calories: 27, protein: 2.9, carbohydrates: 4.7, fat: 0.4, fiber: 3.2, calcium: 115, iron: 1.6, magnesium: 32, phosphorus: 58, potassium: 384, vitaminA: 525, vitaminC: 70.0, vitaminK: 497 },
  'bathua': { calories: 32, protein: 3.7, carbohydrates: 4.2, fat: 0.6, fiber: 3.8, calcium: 280, iron: 4.2, magnesium: 55, phosphorus: 70, potassium: 450, vitaminA: 610, vitaminC: 45.0, vitaminB9: 75.0 },
  'gongura': { calories: 28, protein: 2.4, carbohydrates: 4.8, fat: 0.5, fiber: 3.2, calcium: 180, iron: 4.8, magnesium: 45, phosphorus: 60, potassium: 380, vitaminA: 450, vitaminC: 38.0, vitaminB9: 60.0 },
  'sorrel leaves': { calories: 28, protein: 2.4, carbohydrates: 4.8, fat: 0.5, fiber: 3.2, calcium: 180, iron: 4.8, magnesium: 45, phosphorus: 60, potassium: 380, vitaminA: 450, vitaminC: 38.0, vitaminB9: 60.0 },
  'dill leaves': { calories: 43, protein: 3.5, carbohydrates: 7.0, fat: 1.1, fiber: 2.1, calcium: 208, iron: 6.6, magnesium: 55, phosphorus: 66, potassium: 738, vitaminA: 386, vitaminC: 85.0, vitaminB9: 150.0 },
  'sabbasige': { calories: 43, protein: 3.5, carbohydrates: 7.0, fat: 1.1, fiber: 2.1, calcium: 208, iron: 6.6, magnesium: 55, phosphorus: 66, potassium: 738, vitaminA: 386, vitaminC: 85.0, vitaminB9: 150.0 },
  'curry leaves': { calories: 108, protein: 6.1, carbohydrates: 18.7, fat: 1.0, fiber: 6.4, calcium: 830, iron: 0.9, magnesium: 44, phosphorus: 57, potassium: 600, vitaminA: 1260, vitaminC: 4.0, vitaminB9: 93.0 },
  'coriander leaves': { calories: 23, protein: 2.1, carbohydrates: 3.7, fat: 0.5, fiber: 2.8, calcium: 67, iron: 1.8, magnesium: 26, phosphorus: 48, potassium: 521, vitaminA: 337, vitaminC: 27.0, vitaminB9: 62.0 },
  'carrot': { calories: 41, protein: 0.9, carbohydrates: 9.6, fat: 0.2, fiber: 2.8, calcium: 33, iron: 0.3, magnesium: 12, phosphorus: 35, potassium: 320, vitaminA: 835, vitaminC: 5.9, vitaminK: 13.2 },
  'beetroot': { calories: 43, protein: 1.6, carbohydrates: 9.6, fat: 0.2, fiber: 2.8, calcium: 16, iron: 0.8, magnesium: 23, phosphorus: 40, potassium: 325, vitaminB9: 109.0, vitaminC: 4.9 },
  'potato': { calories: 77, protein: 2.0, carbohydrates: 17.5, fat: 0.1, fiber: 2.2, calcium: 12, iron: 0.8, magnesium: 23, phosphorus: 57, potassium: 421, vitaminC: 19.7, vitaminB6: 0.3 },
  'tomato': { calories: 18, protein: 0.9, carbohydrates: 3.9, fat: 0.2, fiber: 1.2, calcium: 10, iron: 0.3, magnesium: 11, phosphorus: 24, potassium: 237, vitaminA: 42, vitaminC: 13.7, vitaminB9: 15.0 },
  'onion': { calories: 40, protein: 1.1, carbohydrates: 9.3, fat: 0.1, fiber: 1.7, calcium: 23, iron: 0.2, magnesium: 10, phosphorus: 29, potassium: 146, vitaminC: 7.4, vitaminB9: 19.0 },
  'ginger': { calories: 80, protein: 1.8, carbohydrates: 17.8, fat: 0.8, fiber: 2.0, calcium: 16, iron: 0.6, magnesium: 43, phosphorus: 34, potassium: 415, vitaminC: 5.0 },
  'garlic': { calories: 149, protein: 6.4, carbohydrates: 33.1, fat: 0.5, fiber: 2.1, calcium: 181, iron: 1.7, magnesium: 25, phosphorus: 153, potassium: 401, zinc: 1.2, vitaminC: 31.2, vitaminB6: 1.2 },
  'green chilli': { calories: 40, protein: 1.9, carbohydrates: 8.8, fat: 0.4, fiber: 1.5, calcium: 14, iron: 1.0, magnesium: 23, phosphorus: 43, potassium: 322, vitaminA: 59, vitaminC: 143.7 },
  'capsicum': { calories: 20, protein: 0.9, carbohydrates: 4.6, fat: 0.2, fiber: 1.7, calcium: 10, iron: 0.4, magnesium: 12, phosphorus: 20, potassium: 211, vitaminA: 18, vitaminC: 80.4 },
  'bottle gourd': { calories: 14, protein: 0.6, carbohydrates: 3.4, fat: 0.1, fiber: 1.2, calcium: 26, iron: 0.2, magnesium: 11, phosphorus: 13, potassium: 150, vitaminC: 10.1 },
  'lauki': { calories: 14, protein: 0.6, carbohydrates: 3.4, fat: 0.1, fiber: 1.2, calcium: 26, iron: 0.2, magnesium: 11, phosphorus: 13, potassium: 150, vitaminC: 10.1 },
  'ridge gourd': { calories: 16, protein: 0.8, carbohydrates: 3.7, fat: 0.1, fiber: 1.5, calcium: 18, iron: 0.4, magnesium: 14, phosphorus: 26, potassium: 160, vitaminC: 12.0 },
  'ash gourd': { calories: 13, protein: 0.4, carbohydrates: 3.0, fat: 0.2, fiber: 0.8, calcium: 19, iron: 0.4, magnesium: 10, phosphorus: 12, potassium: 110, vitaminC: 13.0 },
  'pumpkin': { calories: 26, protein: 1.0, carbohydrates: 6.5, fat: 0.1, fiber: 0.5, calcium: 21, iron: 0.8, magnesium: 12, phosphorus: 44, potassium: 340, vitaminA: 426, vitaminC: 9.0 },
  'kaddu': { calories: 26, protein: 1.0, carbohydrates: 6.5, fat: 0.1, fiber: 0.5, calcium: 21, iron: 0.8, magnesium: 12, phosphorus: 44, potassium: 340, vitaminA: 426, vitaminC: 9.0 },
  'raw banana': { calories: 89, protein: 1.1, carbohydrates: 22.8, fat: 0.3, fiber: 2.6, calcium: 15, iron: 0.6, magnesium: 27, phosphorus: 22, potassium: 358, vitaminB6: 0.4, vitaminC: 8.7 },
  'plantain': { calories: 89, protein: 1.1, carbohydrates: 22.8, fat: 0.3, fiber: 2.6, calcium: 15, iron: 0.6, magnesium: 27, phosphorus: 22, potassium: 358, vitaminB6: 0.4, vitaminC: 8.7 },
  'yam': { calories: 118, protein: 1.5, carbohydrates: 27.9, fat: 0.2, fiber: 4.1, calcium: 17, iron: 0.5, magnesium: 21, phosphorus: 55, potassium: 816, vitaminC: 17.1 },
  'colocasia': { calories: 112, protein: 1.5, carbohydrates: 26.5, fat: 0.2, fiber: 4.1, calcium: 43, iron: 0.6, magnesium: 33, phosphorus: 84, potassium: 591, vitaminC: 4.5 },
  'arbi': { calories: 112, protein: 1.5, carbohydrates: 26.5, fat: 0.2, fiber: 4.1, calcium: 43, iron: 0.6, magnesium: 33, phosphorus: 84, potassium: 591, vitaminC: 4.5 },
  'elephant yam': { calories: 118, protein: 1.5, carbohydrates: 27.9, fat: 0.2, fiber: 4.1, calcium: 50, iron: 0.8, magnesium: 25, phosphorus: 60, potassium: 800, vitaminC: 15.0 },
  'chenai': { calories: 118, protein: 1.5, carbohydrates: 27.9, fat: 0.2, fiber: 4.1, calcium: 50, iron: 0.8, magnesium: 25, phosphorus: 60, potassium: 800, vitaminC: 15.0 },
  'lotus stem': { calories: 74, protein: 2.6, carbohydrates: 17.2, fat: 0.1, fiber: 4.9, calcium: 45, iron: 1.2, magnesium: 23, phosphorus: 100, potassium: 556, zinc: 0.4, vitaminC: 44.0, vitaminB9: 13.0 },
  'nadru': { calories: 74, protein: 2.6, carbohydrates: 17.2, fat: 0.1, fiber: 4.9, calcium: 45, iron: 1.2, magnesium: 23, phosphorus: 100, potassium: 556, zinc: 0.4, vitaminC: 44.0, vitaminB9: 13.0 },
  'bamboo shoot': { calories: 27, protein: 2.6, carbohydrates: 5.2, fat: 0.3, fiber: 2.2, calcium: 13, iron: 0.5, magnesium: 14, phosphorus: 59, potassium: 533, zinc: 1.1, vitaminB1: 0.15, vitaminC: 4.0, vitaminB9: 7.0 },

  // Coconut, Nuts, Seeds & Oils
  'grated coconut': { calories: 354, protein: 3.3, carbohydrates: 15.2, fat: 33.5, saturatedFat: 29.7, fiber: 9.0, calcium: 14, iron: 2.4, magnesium: 32, phosphorus: 113, potassium: 356, zinc: 1.1, copper: 0.43, manganese: 1.5, selenium: 10.1, choline: 12, omega3: 0.04 },
  'coconut': { calories: 354, protein: 3.3, carbohydrates: 15.2, fat: 33.5, saturatedFat: 29.7, fiber: 9.0, calcium: 14, iron: 2.4, magnesium: 32, phosphorus: 113, potassium: 356, zinc: 1.1, copper: 0.43, manganese: 1.5, selenium: 10.1, choline: 12, omega3: 0.04 },
  'coconut oil': { calories: 890, protein: 0, carbohydrates: 0, fat: 99.0, saturatedFat: 86.5, fiber: 0, vitaminE: 0.11, vitaminK: 0.5 },
  'mustard oil': { calories: 884, protein: 0, carbohydrates: 0, fat: 100.0, saturatedFat: 11.6, fiber: 0, vitaminE: 34.0, omega3: 6.0 },
  'sesame oil': { calories: 884, protein: 0, carbohydrates: 0, fat: 100.0, saturatedFat: 14.2, fiber: 0, vitaminE: 1.4, vitaminK: 13.6 },
  'groundnut oil': { calories: 884, protein: 0, carbohydrates: 0, fat: 100.0, saturatedFat: 16.9, fiber: 0, vitaminE: 15.7 },
  'sesame seeds': { calories: 573, protein: 17.7, carbohydrates: 23.4, fat: 49.7, saturatedFat: 7.0, fiber: 11.8, calcium: 975, iron: 14.6, magnesium: 351, phosphorus: 629, potassium: 468, zinc: 7.8, copper: 4.08, manganese: 2.46, selenium: 34.4, vitaminB1: 0.79, vitaminB9: 97.0, choline: 25, omega3: 0.38 },
  'til': { calories: 573, protein: 17.7, carbohydrates: 23.4, fat: 49.7, saturatedFat: 7.0, fiber: 11.8, calcium: 975, iron: 14.6, magnesium: 351, phosphorus: 629, potassium: 468, zinc: 7.8, copper: 4.08, manganese: 2.46, selenium: 34.4, vitaminB1: 0.79, vitaminB9: 97.0, choline: 25, omega3: 0.38 },
  'peanuts': { calories: 567, protein: 25.8, carbohydrates: 16.1, fat: 49.2, saturatedFat: 6.8, fiber: 8.5, calcium: 92, iron: 4.6, magnesium: 168, phosphorus: 376, potassium: 705, zinc: 3.3, vitaminB1: 0.64, vitaminB3: 12.1, vitaminB9: 240.0, vitaminE: 8.3, choline: 52, omega3: 0.05 },
  'groundnuts': { calories: 567, protein: 25.8, carbohydrates: 16.1, fat: 49.2, saturatedFat: 6.8, fiber: 8.5, calcium: 92, iron: 4.6, magnesium: 168, phosphorus: 376, potassium: 705, zinc: 3.3, vitaminB1: 0.64, vitaminB3: 12.1, vitaminB9: 240.0, vitaminE: 8.3, choline: 52, omega3: 0.05 },
  'almonds': { calories: 579, protein: 21.2, carbohydrates: 21.6, fat: 49.9, saturatedFat: 3.8, fiber: 12.5, calcium: 269, iron: 3.7, magnesium: 270, phosphorus: 481, potassium: 733, zinc: 3.1, vitaminE: 25.6, vitaminB2: 1.14, vitaminB9: 44.0, choline: 52, omega3: 0.22 },
  'cashews': { calories: 553, protein: 18.2, carbohydrates: 30.2, fat: 43.8, saturatedFat: 7.8, fiber: 3.3, calcium: 37, iron: 6.7, magnesium: 292, phosphorus: 593, potassium: 660, zinc: 5.8, copper: 2.2, manganese: 1.6, vitaminB1: 0.42, vitaminB9: 25.0, choline: 61, omega3: 0.06 },
  'walnuts': { calories: 654, protein: 15.2, carbohydrates: 13.7, fat: 65.2, saturatedFat: 6.1, fiber: 6.7, calcium: 98, iron: 2.9, magnesium: 158, phosphorus: 346, potassium: 441, zinc: 3.1, copper: 1.58, manganese: 3.4, selenium: 4.9, vitaminB6: 0.54, vitaminB9: 98.0, vitaminE: 0.7, choline: 39, omega3: 9.08 },
  'chia seeds': { calories: 486, protein: 16.5, carbohydrates: 42.1, fat: 30.7, saturatedFat: 3.3, fiber: 34.4, calcium: 631, iron: 7.7, magnesium: 335, phosphorus: 860, potassium: 407, zinc: 4.6, copper: 0.92, manganese: 2.7, selenium: 55.2, vitaminB1: 0.62, vitaminB3: 8.8, vitaminB9: 49.0, choline: 78, omega3: 17.8 },
  'flaxseeds': { calories: 534, protein: 18.3, carbohydrates: 28.9, fat: 42.2, saturatedFat: 3.7, fiber: 27.3, calcium: 255, iron: 5.7, magnesium: 392, phosphorus: 642, potassium: 813, zinc: 4.3, copper: 1.22, manganese: 2.48, selenium: 25.4, vitaminB1: 1.64, vitaminB9: 87.0, choline: 78, omega3: 22.8 },

  // Sweeteners & Spices
  'jaggery': { calories: 383, protein: 0.4, carbohydrates: 98.0, fat: 0.1, fiber: 0, calcium: 80, iron: 11.0, magnesium: 160, phosphorus: 40, potassium: 1050, sodium: 30, zinc: 0.3, copper: 0.15, manganese: 0.2 },
  'gur': { calories: 383, protein: 0.4, carbohydrates: 98.0, fat: 0.1, fiber: 0, calcium: 80, iron: 11.0, magnesium: 160, phosphorus: 40, potassium: 1050, sodium: 30, zinc: 0.3, copper: 0.15, manganese: 0.2 },
  'dates': { calories: 282, protein: 2.5, carbohydrates: 75.0, fat: 0.4, fiber: 8.0, calcium: 64, iron: 4.8, magnesium: 54, phosphorus: 62, potassium: 656, zinc: 0.4, vitaminB9: 21.0 },
  'khajur': { calories: 282, protein: 2.5, carbohydrates: 75.0, fat: 0.4, fiber: 8.0, calcium: 64, iron: 4.8, magnesium: 54, phosphorus: 62, potassium: 656, zinc: 0.4, vitaminB9: 21.0 },
  'tamarind': { calories: 239, protein: 2.8, carbohydrates: 62.5, fat: 0.6, fiber: 5.1, calcium: 74, iron: 2.8, magnesium: 92, phosphorus: 113, potassium: 628, sodium: 28, vitaminC: 3.5, vitaminB1: 0.43, vitaminB9: 14.0 },
  'imli': { calories: 239, protein: 2.8, carbohydrates: 62.5, fat: 0.6, fiber: 5.1, calcium: 74, iron: 2.8, magnesium: 92, phosphorus: 113, potassium: 628, sodium: 28, vitaminC: 3.5, vitaminB1: 0.43, vitaminB9: 14.0 },
  'mustard seeds': { calories: 508, protein: 26.1, carbohydrates: 28.1, fat: 36.2, fiber: 12.2, calcium: 266, iron: 9.2, magnesium: 370, phosphorus: 730, potassium: 738, zinc: 6.1, selenium: 208.0 },
  'cumin seeds': { calories: 375, protein: 17.8, carbohydrates: 44.2, fat: 22.3, fiber: 10.5, calcium: 931, iron: 66.4, magnesium: 366, phosphorus: 499, potassium: 1788, zinc: 4.8 },
  'jeera': { calories: 375, protein: 17.8, carbohydrates: 44.2, fat: 22.3, fiber: 10.5, calcium: 931, iron: 66.4, magnesium: 366, phosphorus: 499, potassium: 1788, zinc: 4.8 },
  'turmeric': { calories: 354, protein: 7.8, carbohydrates: 64.9, fat: 9.9, fiber: 21.1, calcium: 182, iron: 41.4, magnesium: 193, phosphorus: 268, potassium: 2525, zinc: 4.3, vitaminC: 25.9 },
  'haldi': { calories: 354, protein: 7.8, carbohydrates: 64.9, fat: 9.9, fiber: 21.1, calcium: 182, iron: 41.4, magnesium: 193, phosphorus: 268, potassium: 2525, zinc: 4.3, vitaminC: 25.9 },
  'black pepper': { calories: 251, protein: 10.4, carbohydrates: 64.0, fat: 3.3, fiber: 25.3, calcium: 443, iron: 9.7, magnesium: 171, phosphorus: 158, potassium: 1329, zinc: 1.3 },
  'salt': { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sodium: 38758, iodine: 3000 },
  'water': { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, calcium: 2, magnesium: 1, potassium: 1, sodium: 1 },

  // Non-Veg (Eggs & Fish - highly relevant to coastal/regional Indian cuisines)
  'egg': { calories: 145, protein: 12.8, carbohydrates: 1.1, fat: 9.8, saturatedFat: 3.1, fiber: 0, calcium: 56, iron: 1.8, magnesium: 12, phosphorus: 198, potassium: 138, sodium: 140, zinc: 1.3, vitaminA: 160, vitaminB2: 0.48, vitaminB12: 1.1, vitaminD: 2.0, vitaminB9: 47.0, choline: 294, omega3: 0.11 },
  'fish': { calories: 120, protein: 20.0, carbohydrates: 0, fat: 4.5, saturatedFat: 1.1, fiber: 0, calcium: 35, iron: 1.2, magnesium: 30, phosphorus: 210, potassium: 380, sodium: 70, zinc: 1.0, vitaminA: 25, vitaminB12: 2.8, vitaminD: 4.5, iodine: 45.0, choline: 65, omega3: 0.85 },
  'mutton': { calories: 240, protein: 20.5, carbohydrates: 0, fat: 17.5, saturatedFat: 7.5, fiber: 0, calcium: 15, iron: 2.5, magnesium: 22, phosphorus: 190, potassium: 310, sodium: 75, zinc: 4.5, vitaminB12: 2.2, choline: 80, omega3: 0.15 },
  'chicken': { calories: 165, protein: 24.5, carbohydrates: 0, fat: 7.2, saturatedFat: 2.1, fiber: 0, calcium: 14, iron: 1.3, magnesium: 26, phosphorus: 220, potassium: 320, sodium: 70, zinc: 1.8, vitaminB12: 0.35, choline: 75, omega3: 0.08 }
};

// Match an ingredient name to our composition dataset
export function findIngredientNutrition(name: string): Partial<DetailedNutrients> | null {
  const normalized = name.toLowerCase().trim();
  
  // Exact match
  if (INGREDIENT_COMPOSITION_DATA[normalized]) {
    return INGREDIENT_COMPOSITION_DATA[normalized];
  }

  // Key substring matching
  const keys = Object.keys(INGREDIENT_COMPOSITION_DATA);
  for (const k of keys) {
    if (normalized.includes(k) || k.includes(normalized)) {
      return INGREDIENT_COMPOSITION_DATA[k];
    }
  }

  // Multi-word token matching
  const tokens = normalized.split(/\s+/);
  for (const token of tokens) {
    if (token.length > 2 && INGREDIENT_COMPOSITION_DATA[token]) {
      return INGREDIENT_COMPOSITION_DATA[token];
    }
  }

  return null;
}

// Calculate complete DetailedNutrients for a list of ingredients and serving size
export function calculateRecipeNutrition(
  ingredients: RecipeIngredient[],
  servingSize: RecipeServingSize
): {
  totalNutrients: DetailedNutrients;
  perServingNutrients: DetailedNutrients;
  status: 'Calculated' | 'Estimated' | 'Nutrition data unavailable';
} {
  const blankNutrients: DetailedNutrients = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    saturatedFat: 0,
    fiber: 0,
    sugar: 0,
    vitaminA: 0,
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB3: 0,
    vitaminB5: 0,
    vitaminB6: 0,
    vitaminB7: 0,
    vitaminB9: 0,
    vitaminB12: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0,
    zinc: 0,
    copper: 0,
    manganese: 0,
    selenium: 0,
    iodine: 0,
    choline: 0,
    omega3: 0
  };

  if (!ingredients || ingredients.length === 0) {
    return {
      totalNutrients: { ...blankNutrients },
      perServingNutrients: { ...blankNutrients },
      status: 'Nutrition data unavailable'
    };
  }

  let matchedCount = 0;
  const total = { ...blankNutrients };

  ingredients.forEach(ing => {
    const grams = convertUnitToGrams(ing.quantity || 0, ing.unit || 'g', ing.name);
    const comp = findIngredientNutrition(ing.name);

    if (comp) {
      matchedCount++;
      const factor = grams / 100;
      (Object.keys(blankNutrients) as Array<keyof DetailedNutrients>).forEach(k => {
        if (comp[k] !== undefined && comp[k] !== null) {
          total[k] += (comp[k] as number) * factor;
        }
      });
    }
  });

  const servings = Math.max(1, servingSize.servings || 1);
  const perServing: DetailedNutrients = { ...blankNutrients };

  (Object.keys(blankNutrients) as Array<keyof DetailedNutrients>).forEach(k => {
    const val = total[k] / servings;
    // Round neatly based on nutrient magnitude
    if (k === 'calories' || k === 'calcium' || k === 'potassium' || k === 'phosphorus' || k === 'sodium') {
      perServing[k] = Math.round(val);
      total[k] = Math.round(total[k]);
    } else if (k === 'protein' || k === 'carbohydrates' || k === 'fat' || k === 'saturatedFat' || k === 'fiber' || k === 'iron' || k === 'magnesium' || k === 'zinc' || k === 'vitaminC' || k === 'choline') {
      perServing[k] = Math.round(val * 10) / 10;
      total[k] = Math.round(total[k] * 10) / 10;
    } else {
      perServing[k] = Math.round(val * 100) / 100;
      total[k] = Math.round(total[k] * 100) / 100;
    }
  });

  let status: 'Calculated' | 'Estimated' | 'Nutrition data unavailable' = 'Calculated';
  if (matchedCount === 0) {
    status = 'Nutrition data unavailable';
  } else if (matchedCount < ingredients.length) {
    status = 'Estimated';
  }

  return {
    totalNutrients: total,
    perServingNutrients: perServing,
    status
  };
}

// Generate clinical maternal notes from recipe nutrients without false diagnoses
export function generatePregnancyNutritionNotes(
  nutrients: DetailedNutrients,
  traditionalName: string,
  profile?: any
): string[] {
  const notes: string[] = [];

  // Iron note
  if (nutrients.iron >= 3.5) {
    notes.push(`🟢 High plant/dietary iron source: Provides ${nutrients.iron} mg iron per serving, supporting maternal hemoglobin synthesis.`);
  } else if (nutrients.iron >= 1.5) {
    notes.push(`🟢 Moderate iron source: Provides ${nutrients.iron} mg of iron per serving.`);
  }

  // Calcium note
  if (nutrients.calcium >= 200) {
    notes.push(`🟢 Rich calcium content: Supplies ${nutrients.calcium} mg calcium per serving, aiding baby's skeletal mineralization.`);
  } else if (nutrients.calcium >= 80) {
    notes.push(`🟢 Good source of calcium: Supplies ${nutrients.calcium} mg calcium per serving.`);
  }

  // Protein note
  if (nutrients.protein >= 10) {
    notes.push(`🟢 Excellent protein source: Provides ${nutrients.protein}g protein per serving to support fetal tissue development.`);
  } else if (nutrients.protein >= 5) {
    notes.push(`🟡 Moderate protein source: Delivers ${nutrients.protein}g protein per serving.`);
  }

  // Folate note
  const folateVal = nutrients.vitaminB9 || 0;
  if (folateVal >= 50) {
    notes.push(`🟢 Rich in Folate (B9): Contains ${folateVal} mcg folate per serving for early neural development.`);
  }

  // Fiber note
  if (nutrients.fiber >= 5) {
    notes.push(`🟢 High dietary fiber (${nutrients.fiber}g/serving): Helps maintain gut motility and prevent pregnancy constipation.`);
  }

  // Vitamin C synergy note
  if (nutrients.vitaminC >= 15 && nutrients.iron >= 1.5) {
    notes.push(`✨ Synergy Benefit: Natural Vitamin C (${nutrients.vitaminC} mg) in this dish enhances the absorption of its dietary iron.`);
  }

  // Omega-3 note
  if (nutrients.omega3 >= 0.2) {
    notes.push(`🧠 Brain & Retina Growth: Delivers ${nutrients.omega3}g of maternal Omega-3 fatty acids.`);
  }

  // Choline note
  if (nutrients.choline >= 40) {
    notes.push(`🧬 Choline Support: Provides ${nutrients.choline} mg choline for fetal cognitive development.`);
  }

  if (notes.length === 0) {
    notes.push(`ℹ️ Provides ${nutrients.calories} kcal energy with balanced regional carbohydrates and micronutrients.`);
  }

  return notes;
}

// Allergy checking against user profile
export function checkRecipeAllergies(
  recipe: Partial<RegionalRecipe>,
  userAllergies: string[] = []
): string[] {
  if (!userAllergies || userAllergies.length === 0) return [];
  const alerts: string[] = [];

  const recipeIngredientNames = (recipe.ingredients || []).map(i => i.name.toLowerCase());
  const recipeAllergens = (recipe.allergens || []).map(a => a.toLowerCase());
  const recipeName = (recipe.traditionalName || '').toLowerCase();

  userAllergies.forEach(allergy => {
    const aLower = allergy.toLowerCase().trim();
    if (!aLower) return;

    const matchedInIngredients = recipeIngredientNames.some(ing => ing.includes(aLower) || aLower.includes(ing));
    const matchedInAllergens = recipeAllergens.some(allg => allg.includes(aLower) || aLower.includes(allg));
    const matchedInName = recipeName.includes(aLower);

    if (matchedInIngredients || matchedInAllergens || matchedInName) {
      alerts.push(`⚠️ Allergy Alert: This recipe contains or may contain an ingredient matching "${allergy}" saved in your profile. Please review the ingredients carefully before consuming.`);
    }
  });

  return alerts;
}

// Pregnancy Food Safety evaluator
export function evaluateRecipeFoodSafety(
  recipeName: string,
  ingredients: RecipeIngredient[] = [],
  cookingMethod: string = ''
): { level: FoodSafetyLevel; explanation: string } {
  const nameLower = recipeName.toLowerCase();
  const ingNames = ingredients.map(i => i.name.toLowerCase()).join(' ');

  // Risky items in pregnancy
  if (nameLower.includes('raw papaya') || ingNames.includes('raw papaya') || ingNames.includes('unripe papaya')) {
    return {
      level: 'Avoid / consult healthcare professional',
      explanation: 'Unripe / raw papaya contains papain and latex which can trigger uterine contractions. Safe only when fully ripe or thoroughly cooked upon doctor approval.'
    };
  }

  if (nameLower.includes('unpasteurized') || ingNames.includes('raw milk') || ingNames.includes('unpasteurized')) {
    return {
      level: 'Avoid / consult healthcare professional',
      explanation: 'Unpasteurized dairy products carry a risk of Listeria monocytogenes bacteria. Always use pasteurized and boiled milk/curd.'
    };
  }

  if (nameLower.includes('deep fried') || nameLower.includes('excessive spice') || nameLower.includes('high sugar')) {
    return {
      level: 'Use caution',
      explanation: 'High oil or sugar content. Consume in moderation if managing gestational hypertension, acid reflux, or gestational diabetes.'
    };
  }

  if (nameLower.includes('street') || nameLower.includes('raw sprout') || ingNames.includes('raw sprouts')) {
    return {
      level: 'Use caution',
      explanation: 'Sprouts should always be well-steamed or cooked during pregnancy to prevent bacterial contamination.'
    };
  }

  return {
    level: 'Generally suitable',
    explanation: 'Traditional cooked meal prepared with fresh ingredients. Wholesome and suitable for antenatal maternal diets.'
  };
}
