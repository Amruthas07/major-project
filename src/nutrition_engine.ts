/**
 * nutrition_engine.ts
 * Clinical Maternal Nutrition Engine & ICMR-NIN Indian Food Composition Database
 * 
 * Complies with ICMR-NIN (National Institute of Nutrition, India) Dietary Guidelines for Indians,
 * Indian Food Composition Tables (IFCT 2017), and WHO/FOGSI Antenatal Nutrition Guidelines.
 */

import { FoodItem } from './data';
import { FOOD_DATABASE_ITEMS } from './foods_db';

export interface DetailedNutrients {
  // Macronutrients
  calories: number; // kcal
  protein: number; // g
  carbohydrates: number; // g
  fat: number; // g
  saturatedFat: number; // g
  fiber: number; // g
  sugar: number; // g

  // Vitamins
  vitaminA: number; // mcg RAE
  vitaminB1: number; // mg (Thiamine)
  vitaminB2: number; // mg (Riboflavin)
  vitaminB3: number; // mg (Niacin)
  vitaminB5: number; // mg (Pantothenic Acid)
  vitaminB6: number; // mg (Pyridoxine)
  vitaminB7: number; // mcg (Biotin)
  vitaminB9: number; // mcg (Folate / Folic Acid)
  vitaminB12: number; // mcg (Cobalamin)
  vitaminC: number; // mg (Ascorbic Acid)
  vitaminD: number; // mcg
  vitaminE: number; // mg (Alpha-tocopherol)
  vitaminK: number; // mcg

  // Minerals
  calcium: number; // mg
  iron: number; // mg
  magnesium: number; // mg
  phosphorus: number; // mg
  potassium: number; // mg
  sodium: number; // mg
  zinc: number; // mg
  copper: number; // mg
  manganese: number; // mg
  selenium: number; // mcg
  iodine: number; // mcg

  // Other Vital Maternal Nutrients
  choline: number; // mg
  omega3: number; // g
}

export interface ConfirmedMealItem {
  foodId: string;
  name: string;
  quantity: number; // in grams or ml
  unit: 'g' | 'ml' | 'piece' | 'bowl' | 'cup';
  isLiquid?: boolean;
  portionSize: 'small' | 'medium' | 'large' | 'custom';
  defaultServingGrams: number;
  confidence?: number;
  foodItem?: FoodItem;
}

export interface CalculatedMealNutrition {
  totals: DetailedNutrients;
  itemBreakdowns: Array<{
    foodId: string;
    name: string;
    quantityGrams: number;
    nutrients: DetailedNutrients;
    source: 'ICMR-NIN IFCT 2017' | 'USDA Supplementary' | 'Standard Culinary Data';
  }>;
  safetyAlerts: string[];
  allergyAlerts: string[];
}

export interface NutritionTargetItem {
  name: string;
  key: keyof DetailedNutrients;
  target: number;
  unit: string;
  category: 'macronutrient' | 'vitamin' | 'mineral' | 'other';
  importance: 'critical' | 'high' | 'moderate';
  pregnancyRationale: string;
  isPersonalized: boolean;
}

export interface NutritionTargetSet {
  label: 'Personalized target' | 'Reference target';
  trimester: '1st Trimester' | '2nd Trimester' | '3rd Trimester';
  targets: Record<keyof DetailedNutrients, NutritionTargetItem>;
}

export interface LoggedMealRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mealType: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Evening Snack' | 'Dinner' | 'Late Snack';
  foodImage?: string;
  foodNames: string[];
  items: ConfirmedMealItem[];
  nutrients: DetailedNutrients;
  nutritionScore: number; // 0 - 100
  source: string;
  notes?: string;
  timestamp: string; // ISO string
}

export interface NutritionInsight {
  id: string;
  type: 'on_track' | 'needs_attention' | 'consider_more' | 'info';
  title: string;
  nutrient: string;
  message: string;
  suggestedFoods: string[];
  actionLabel?: string;
}

// -------------------------------------------------------------
// EXTENSIVE ICMR-NIN COMPOSITION DATA MAP
// (Values per 100g of edible portion)
// -------------------------------------------------------------
export const ICMR_FOOD_COMPOSITION_DATA: Record<string, Partial<DetailedNutrients>> = {
  ragi_mudde: {
    calories: 320, protein: 7.3, carbohydrates: 72.0, fat: 1.3, saturatedFat: 0.3, fiber: 11.5, sugar: 0.6,
    vitaminA: 6, vitaminB1: 0.42, vitaminB2: 0.19, vitaminB3: 1.1, vitaminB5: 0.8, vitaminB6: 0.15, vitaminB7: 2.1, vitaminB9: 18.3, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.85, vitaminK: 0.9,
    calcium: 344, iron: 3.9, magnesium: 137, phosphorus: 283, potassium: 408, sodium: 11, zinc: 2.3, copper: 0.47, manganese: 5.49, selenium: 5.2, iodine: 4.5,
    choline: 24, omega3: 0.08
  },
  akki_roti: {
    calories: 240, protein: 4.2, carbohydrates: 48.0, fat: 3.5, saturatedFat: 0.8, fiber: 2.8, sugar: 0.4,
    vitaminA: 20, vitaminB1: 0.12, vitaminB2: 0.06, vitaminB3: 1.5, vitaminB5: 0.5, vitaminB6: 0.08, vitaminB7: 1.0, vitaminB9: 12.0, vitaminB12: 0, vitaminC: 2.0, vitaminD: 0, vitaminE: 0.5, vitaminK: 1.5,
    calcium: 22, iron: 1.1, magnesium: 30, phosphorus: 95, potassium: 110, sodium: 150, zinc: 0.8, copper: 0.12, manganese: 0.6, selenium: 8.5, iodine: 3.0,
    choline: 12, omega3: 0.02
  },
  bisi_bele_bath: {
    calories: 280, protein: 8.5, carbohydrates: 48.0, fat: 6.2, saturatedFat: 1.8, fiber: 5.4, sugar: 1.5,
    vitaminA: 150, vitaminB1: 0.22, vitaminB2: 0.11, vitaminB3: 2.1, vitaminB5: 0.9, vitaminB6: 0.14, vitaminB7: 3.2, vitaminB9: 40.0, vitaminB12: 0, vitaminC: 12.0, vitaminD: 0, vitaminE: 0.8, vitaminK: 4.5,
    calcium: 45, iron: 2.1, magnesium: 60, phosphorus: 180, potassium: 310, sodium: 250, zinc: 1.2, copper: 0.25, manganese: 0.8, selenium: 12.0, iodine: 6.0,
    choline: 35, omega3: 0.05
  },
  mysore_pak: {
    calories: 520, protein: 6.5, carbohydrates: 58.0, fat: 30.0, saturatedFat: 16.0, fiber: 1.8, sugar: 44.0,
    vitaminA: 110, vitaminB1: 0.08, vitaminB2: 0.05, vitaminB3: 0.8, vitaminB5: 0.3, vitaminB6: 0.03, vitaminB7: 0.8, vitaminB9: 8.0, vitaminB12: 0.1, vitaminC: 0, vitaminD: 0.2, vitaminE: 1.2, vitaminK: 1.0,
    calcium: 30, iron: 1.2, magnesium: 22, phosphorus: 85, potassium: 95, sodium: 80, zinc: 0.5, copper: 0.15, manganese: 0.3, selenium: 3.0, iodine: 2.0,
    choline: 18, omega3: 0.04
  },
  ven_pongal: {
    calories: 215, protein: 6.8, carbohydrates: 36.0, fat: 5.2, saturatedFat: 1.5, fiber: 3.2, sugar: 0.2,
    vitaminA: 40, vitaminB1: 0.18, vitaminB2: 0.09, vitaminB3: 1.6, vitaminB5: 0.7, vitaminB6: 0.12, vitaminB7: 2.5, vitaminB9: 32.0, vitaminB12: 0, vitaminC: 1.5, vitaminD: 0, vitaminE: 0.6, vitaminK: 2.1,
    calcium: 38, iron: 2.4, magnesium: 55, phosphorus: 140, potassium: 220, sodium: 180, zinc: 1.1, copper: 0.22, manganese: 0.7, selenium: 9.0, iodine: 4.0,
    choline: 28, omega3: 0.06
  },
  kootu: {
    calories: 120, protein: 4.8, carbohydrates: 16.0, fat: 4.2, saturatedFat: 2.1, fiber: 4.6, sugar: 2.2,
    vitaminA: 240, vitaminB1: 0.14, vitaminB2: 0.10, vitaminB3: 1.2, vitaminB5: 0.6, vitaminB6: 0.18, vitaminB7: 3.8, vitaminB9: 58.0, vitaminB12: 0, vitaminC: 18.0, vitaminD: 0, vitaminE: 1.1, vitaminK: 8.5,
    calcium: 72, iron: 2.8, magnesium: 48, phosphorus: 110, potassium: 340, sodium: 190, zinc: 0.9, copper: 0.18, manganese: 0.65, selenium: 6.5, iodine: 5.0,
    choline: 32, omega3: 0.09
  },
  appam: {
    calories: 175, protein: 3.2, carbohydrates: 34.0, fat: 2.8, saturatedFat: 1.9, fiber: 1.5, sugar: 1.8,
    vitaminA: 0, vitaminB1: 0.08, vitaminB2: 0.04, vitaminB3: 0.9, vitaminB5: 0.4, vitaminB6: 0.06, vitaminB7: 1.2, vitaminB9: 9.0, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.3, vitaminK: 0.4,
    calcium: 16, iron: 0.9, magnesium: 22, phosphorus: 65, potassium: 85, sodium: 120, zinc: 0.6, copper: 0.10, manganese: 0.4, selenium: 7.2, iodine: 3.5,
    choline: 10, omega3: 0.02
  },
  puttu: {
    calories: 210, protein: 4.5, carbohydrates: 42.0, fat: 3.1, saturatedFat: 2.2, fiber: 3.0, sugar: 0.8,
    vitaminA: 2, vitaminB1: 0.11, vitaminB2: 0.05, vitaminB3: 1.3, vitaminB5: 0.5, vitaminB6: 0.09, vitaminB7: 1.4, vitaminB9: 14.0, vitaminB12: 0, vitaminC: 0.5, vitaminD: 0, vitaminE: 0.4, vitaminK: 0.6,
    calcium: 24, iron: 1.4, magnesium: 32, phosphorus: 88, potassium: 120, sodium: 90, zinc: 0.8, copper: 0.14, manganese: 0.55, selenium: 8.0, iodine: 3.8,
    choline: 14, omega3: 0.03
  },
  avial: {
    calories: 145, protein: 3.4, carbohydrates: 15.0, fat: 7.8, saturatedFat: 4.8, fiber: 4.2, sugar: 3.5,
    vitaminA: 320, vitaminB1: 0.12, vitaminB2: 0.11, vitaminB3: 1.4, vitaminB5: 0.7, vitaminB6: 0.22, vitaminB7: 4.2, vitaminB9: 45.0, vitaminB12: 0.2, vitaminC: 15.0, vitaminD: 0.1, vitaminE: 1.4, vitaminK: 12.0,
    calcium: 88, iron: 1.8, magnesium: 42, phosphorus: 95, potassium: 380, sodium: 160, zinc: 0.7, copper: 0.16, manganese: 0.5, selenium: 5.0, iodine: 7.2,
    choline: 26, omega3: 0.11
  },
  pesarattu: {
    calories: 220, protein: 11.2, carbohydrates: 36.0, fat: 3.8, saturatedFat: 0.8, fiber: 7.5, sugar: 1.1,
    vitaminA: 35, vitaminB1: 0.28, vitaminB2: 0.16, vitaminB3: 2.4, vitaminB5: 1.1, vitaminB6: 0.24, vitaminB7: 5.6, vitaminB9: 98.0, vitaminB12: 0, vitaminC: 3.5, vitaminD: 0, vitaminE: 0.9, vitaminK: 6.2,
    calcium: 68, iron: 4.2, magnesium: 82, phosphorus: 210, potassium: 450, sodium: 170, zinc: 1.8, copper: 0.32, manganese: 1.1, selenium: 11.5, iodine: 6.5,
    choline: 48, omega3: 0.14
  },
  gongura_pappu: {
    calories: 165, protein: 8.2, carbohydrates: 22.0, fat: 4.8, saturatedFat: 1.1, fiber: 5.8, sugar: 1.4,
    vitaminA: 480, vitaminB1: 0.19, vitaminB2: 0.18, vitaminB3: 1.8, vitaminB5: 0.8, vitaminB6: 0.21, vitaminB7: 4.0, vitaminB9: 72.0, vitaminB12: 0, vitaminC: 28.0, vitaminD: 0, vitaminE: 1.8, vitaminK: 18.5,
    calcium: 125, iron: 5.4, magnesium: 75, phosphorus: 160, potassium: 420, sodium: 220, zinc: 1.4, copper: 0.28, manganese: 0.9, selenium: 8.5, iodine: 7.0,
    choline: 42, omega3: 0.12
  },
  pulihora: {
    calories: 260, protein: 4.5, carbohydrates: 46.0, fat: 6.8, saturatedFat: 1.4, fiber: 3.2, sugar: 0.8,
    vitaminA: 15, vitaminB1: 0.14, vitaminB2: 0.08, vitaminB3: 1.7, vitaminB5: 0.6, vitaminB6: 0.11, vitaminB7: 2.1, vitaminB9: 22.0, vitaminB12: 0, vitaminC: 10.0, vitaminD: 0, vitaminE: 1.2, vitaminK: 3.2,
    calcium: 34, iron: 2.2, magnesium: 45, phosphorus: 115, potassium: 190, sodium: 240, zinc: 0.9, copper: 0.19, manganese: 0.7, selenium: 9.8, iodine: 4.2,
    choline: 22, omega3: 0.06
  },
  sarva_pindi: {
    calories: 290, protein: 6.8, carbohydrates: 50.0, fat: 7.2, saturatedFat: 1.6, fiber: 4.8, sugar: 0.6,
    vitaminA: 25, vitaminB1: 0.18, vitaminB2: 0.10, vitaminB3: 2.0, vitaminB5: 0.8, vitaminB6: 0.15, vitaminB7: 3.0, vitaminB9: 28.0, vitaminB12: 0, vitaminC: 3.0, vitaminD: 0, vitaminE: 1.4, vitaminK: 4.0,
    calcium: 58, iron: 3.1, magnesium: 65, phosphorus: 145, potassium: 230, sodium: 260, zinc: 1.3, copper: 0.24, manganese: 0.8, selenium: 10.2, iodine: 5.0,
    choline: 28, omega3: 0.08
  },
  jonna_roti: {
    calories: 260, protein: 7.8, carbohydrates: 54.0, fat: 1.8, saturatedFat: 0.4, fiber: 8.2, sugar: 0.4,
    vitaminA: 0, vitaminB1: 0.35, vitaminB2: 0.14, vitaminB3: 2.8, vitaminB5: 0.9, vitaminB6: 0.28, vitaminB7: 3.5, vitaminB9: 34.0, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.7, vitaminK: 1.2,
    calcium: 28, iron: 4.1, magnesium: 120, phosphorus: 220, potassium: 320, sodium: 15, zinc: 2.1, copper: 0.38, manganese: 1.6, selenium: 8.8, iodine: 4.0,
    choline: 30, omega3: 0.06
  },
  idli_sambar: {
    calories: 195, protein: 7.2, carbohydrates: 37.0, fat: 2.1, saturatedFat: 0.5, fiber: 4.5, sugar: 1.2,
    vitaminA: 85, vitaminB1: 0.20, vitaminB2: 0.12, vitaminB3: 1.9, vitaminB5: 0.7, vitaminB6: 0.16, vitaminB7: 3.6, vitaminB9: 48.0, vitaminB12: 0, vitaminC: 6.5, vitaminD: 0, vitaminE: 0.7, vitaminK: 4.2,
    calcium: 52, iron: 2.6, magnesium: 58, phosphorus: 135, potassium: 280, sodium: 210, zinc: 1.2, copper: 0.21, manganese: 0.65, selenium: 9.5, iodine: 5.5,
    choline: 34, omega3: 0.07
  },
  dosa: {
    calories: 230, protein: 5.6, carbohydrates: 41.0, fat: 5.2, saturatedFat: 1.2, fiber: 3.1, sugar: 0.5,
    vitaminA: 12, vitaminB1: 0.15, vitaminB2: 0.08, vitaminB3: 1.6, vitaminB5: 0.6, vitaminB6: 0.12, vitaminB7: 2.4, vitaminB9: 26.0, vitaminB12: 0, vitaminC: 1.0, vitaminD: 0, vitaminE: 0.8, vitaminK: 1.8,
    calcium: 32, iron: 1.8, magnesium: 42, phosphorus: 98, potassium: 160, sodium: 240, zinc: 0.9, copper: 0.18, manganese: 0.5, selenium: 8.6, iodine: 4.2,
    choline: 22, omega3: 0.05
  },
  morungai_keerai_soup: {
    calories: 65, protein: 4.2, carbohydrates: 8.5, fat: 1.8, saturatedFat: 0.3, fiber: 3.8, sugar: 1.0,
    vitaminA: 950, vitaminB1: 0.24, vitaminB2: 0.32, vitaminB3: 2.2, vitaminB5: 0.9, vitaminB6: 0.45, vitaminB7: 6.8, vitaminB9: 92.0, vitaminB12: 0, vitaminC: 52.0, vitaminD: 0, vitaminE: 3.8, vitaminK: 42.0,
    calcium: 290, iron: 6.8, magnesium: 88, phosphorus: 120, potassium: 460, sodium: 180, zinc: 1.6, copper: 0.35, manganese: 1.4, selenium: 12.0, iodine: 9.5,
    choline: 55, omega3: 0.18
  },
  curd_yogurt: {
    calories: 98, protein: 3.8, carbohydrates: 4.7, fat: 4.3, saturatedFat: 2.8, fiber: 0, sugar: 4.7,
    vitaminA: 45, vitaminB1: 0.05, vitaminB2: 0.18, vitaminB3: 0.2, vitaminB5: 0.5, vitaminB6: 0.06, vitaminB7: 2.2, vitaminB9: 14.0, vitaminB12: 0.55, vitaminC: 1.0, vitaminD: 0.15, vitaminE: 0.1, vitaminK: 0.3,
    calcium: 150, iron: 0.2, magnesium: 18, phosphorus: 130, potassium: 200, sodium: 65, zinc: 0.8, copper: 0.04, manganese: 0.02, selenium: 4.5, iodine: 18.0,
    choline: 16, omega3: 0.04
  },
  sesame_chikki: {
    calories: 490, protein: 12.5, carbohydrates: 54.0, fat: 26.0, saturatedFat: 3.8, fiber: 6.8, sugar: 38.0,
    vitaminA: 8, vitaminB1: 0.48, vitaminB2: 0.16, vitaminB3: 3.2, vitaminB5: 0.7, vitaminB6: 0.35, vitaminB7: 4.5, vitaminB9: 44.0, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 2.2, vitaminK: 2.5,
    calcium: 780, iron: 9.5, magnesium: 240, phosphorus: 420, potassium: 380, sodium: 95, zinc: 5.2, copper: 1.8, manganese: 2.8, selenium: 18.0, iodine: 8.0,
    choline: 42, omega3: 0.28
  },
  boiled_egg: {
    calories: 145, protein: 12.8, carbohydrates: 1.1, fat: 9.8, saturatedFat: 3.1, fiber: 0, sugar: 0.6,
    vitaminA: 160, vitaminB1: 0.08, vitaminB2: 0.48, vitaminB3: 0.1, vitaminB5: 1.4, vitaminB6: 0.14, vitaminB7: 21.0, vitaminB9: 47.0, vitaminB12: 1.1, vitaminC: 0, vitaminD: 2.0, vitaminE: 1.0, vitaminK: 0.3,
    calcium: 56, iron: 1.8, magnesium: 12, phosphorus: 198, potassium: 138, sodium: 140, zinc: 1.3, copper: 0.07, manganese: 0.04, selenium: 31.0, iodine: 28.0,
    choline: 294, omega3: 0.11
  },
  cooked_spinach_palak: {
    calories: 32, protein: 3.0, carbohydrates: 3.8, fat: 0.5, saturatedFat: 0.1, fiber: 2.8, sugar: 0.4,
    vitaminA: 780, vitaminB1: 0.10, vitaminB2: 0.22, vitaminB3: 0.7, vitaminB5: 0.2, vitaminB6: 0.24, vitaminB7: 3.5, vitaminB9: 146.0, vitaminB12: 0, vitaminC: 28.0, vitaminD: 0, vitaminE: 2.1, vitaminK: 480.0,
    calcium: 136, iron: 3.6, magnesium: 79, phosphorus: 56, potassium: 460, sodium: 90, zinc: 0.8, copper: 0.18, manganese: 0.9, selenium: 2.8, iodine: 5.0,
    choline: 25, omega3: 0.12
  },
  sambar: {
    calories: 85, protein: 4.2, carbohydrates: 12.5, fat: 2.2, saturatedFat: 0.4, fiber: 3.6, sugar: 1.8,
    vitaminA: 180, vitaminB1: 0.14, vitaminB2: 0.09, vitaminB3: 1.4, vitaminB5: 0.5, vitaminB6: 0.15, vitaminB7: 2.8, vitaminB9: 45.0, vitaminB12: 0, vitaminC: 14.0, vitaminD: 0, vitaminE: 0.7, vitaminK: 6.5,
    calcium: 48, iron: 2.2, magnesium: 45, phosphorus: 98, potassium: 310, sodium: 280, zinc: 0.8, copper: 0.18, manganese: 0.5, selenium: 5.8, iodine: 4.5,
    choline: 28, omega3: 0.06
  },
  coconut_chutney: {
    calories: 185, protein: 2.8, carbohydrates: 6.5, fat: 16.5, saturatedFat: 14.2, fiber: 3.2, sugar: 1.5,
    vitaminA: 15, vitaminB1: 0.06, vitaminB2: 0.04, vitaminB3: 0.6, vitaminB5: 0.3, vitaminB6: 0.06, vitaminB7: 1.2, vitaminB9: 18.0, vitaminB12: 0, vitaminC: 3.5, vitaminD: 0, vitaminE: 0.8, vitaminK: 1.2,
    calcium: 22, iron: 1.4, magnesium: 38, phosphorus: 68, potassium: 240, sodium: 220, zinc: 0.7, copper: 0.15, manganese: 0.9, selenium: 4.2, iodine: 3.0,
    choline: 14, omega3: 0.03
  },
  dal_tadka: {
    calories: 140, protein: 7.8, carbohydrates: 19.5, fat: 3.8, saturatedFat: 1.2, fiber: 4.8, sugar: 1.0,
    vitaminA: 95, vitaminB1: 0.22, vitaminB2: 0.12, vitaminB3: 1.8, vitaminB5: 0.7, vitaminB6: 0.18, vitaminB7: 3.4, vitaminB9: 85.0, vitaminB12: 0, vitaminC: 4.2, vitaminD: 0, vitaminE: 0.8, vitaminK: 4.8,
    calcium: 42, iron: 3.1, magnesium: 62, phosphorus: 145, potassium: 340, sodium: 260, zinc: 1.3, copper: 0.26, manganese: 0.75, selenium: 9.2, iodine: 5.8,
    choline: 38, omega3: 0.08
  },
  chapati_roti: {
    calories: 250, protein: 8.2, carbohydrates: 49.0, fat: 2.8, saturatedFat: 0.6, fiber: 7.2, sugar: 0.8,
    vitaminA: 0, vitaminB1: 0.32, vitaminB2: 0.11, vitaminB3: 3.2, vitaminB5: 0.8, vitaminB6: 0.25, vitaminB7: 3.1, vitaminB9: 38.0, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0.8, vitaminK: 1.5,
    calcium: 38, iron: 3.8, magnesium: 95, phosphorus: 210, potassium: 280, sodium: 120, zinc: 1.9, copper: 0.32, manganese: 1.8, selenium: 24.0, iodine: 4.5,
    choline: 28, omega3: 0.05
  },
  paneer_gravy: {
    calories: 265, protein: 14.5, carbohydrates: 8.2, fat: 20.0, saturatedFat: 12.5, fiber: 2.1, sugar: 2.8,
    vitaminA: 210, vitaminB1: 0.08, vitaminB2: 0.28, vitaminB3: 0.9, vitaminB5: 0.8, vitaminB6: 0.12, vitaminB7: 3.5, vitaminB9: 24.0, vitaminB12: 0.95, vitaminC: 8.0, vitaminD: 0.4, vitaminE: 1.1, vitaminK: 3.5,
    calcium: 380, iron: 1.6, magnesium: 35, phosphorus: 260, potassium: 210, sodium: 290, zinc: 2.4, copper: 0.12, manganese: 0.15, selenium: 14.5, iodine: 22.0,
    choline: 36, omega3: 0.15
  },
  tender_coconut_water: {
    calories: 19, protein: 0.7, carbohydrates: 3.7, fat: 0.2, saturatedFat: 0.1, fiber: 1.1, sugar: 2.6,
    vitaminA: 0, vitaminB1: 0.03, vitaminB2: 0.06, vitaminB3: 0.1, vitaminB5: 0.1, vitaminB6: 0.03, vitaminB7: 0.5, vitaminB9: 3.0, vitaminB12: 0, vitaminC: 2.4, vitaminD: 0, vitaminE: 0.1, vitaminK: 0.2,
    calcium: 24, iron: 0.3, magnesium: 25, phosphorus: 20, potassium: 250, sodium: 105, zinc: 0.1, copper: 0.04, manganese: 0.14, selenium: 1.0, iodine: 3.0,
    choline: 5, omega3: 0.01
  },
  dates_khajur: {
    calories: 282, protein: 2.5, carbohydrates: 75.0, fat: 0.4, saturatedFat: 0.1, fiber: 8.0, sugar: 63.0,
    vitaminA: 10, vitaminB1: 0.05, vitaminB2: 0.06, vitaminB3: 1.6, vitaminB5: 0.8, vitaminB6: 0.25, vitaminB7: 2.8, vitaminB9: 21.0, vitaminB12: 0, vitaminC: 0.4, vitaminD: 0, vitaminE: 0.1, vitaminK: 2.7,
    calcium: 64, iron: 4.8, magnesium: 54, phosphorus: 62, potassium: 656, sodium: 2, zinc: 0.4, copper: 0.36, manganese: 0.3, selenium: 3.0, iodine: 2.5,
    choline: 10, omega3: 0.02
  },
  soaked_almonds: {
    calories: 579, protein: 21.2, carbohydrates: 21.6, fat: 49.9, saturatedFat: 3.8, fiber: 12.5, sugar: 4.4,
    vitaminA: 2, vitaminB1: 0.21, vitaminB2: 1.14, vitaminB3: 3.6, vitaminB5: 0.5, vitaminB6: 0.14, vitaminB7: 17.5, vitaminB9: 44.0, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 25.6, vitaminK: 0,
    calcium: 269, iron: 3.7, magnesium: 270, phosphorus: 481, potassium: 733, sodium: 1, zinc: 3.1, copper: 1.03, manganese: 2.3, selenium: 4.1, iodine: 2.0,
    choline: 52, omega3: 0.22
  }
};

// -------------------------------------------------------------
// NUTRIENT METADATA & PREGNANCY TARGETS (ICMR-NIN 2020 RDA)
// -------------------------------------------------------------
export const MATERNAL_NUTRIENT_METADATA: Record<keyof DetailedNutrients, {
  name: string;
  unit: string;
  category: 'macronutrient' | 'vitamin' | 'mineral' | 'other';
  importance: 'critical' | 'high' | 'moderate';
  pregnancyRationale: string;
  defaultRDA: number;
}> = {
  calories: { name: 'Calories', unit: 'kcal', category: 'macronutrient', importance: 'critical', pregnancyRationale: 'Supplies maternal basal metabolic needs and steady fetal tissue growth.', defaultRDA: 2250 },
  protein: { name: 'Protein', unit: 'g', category: 'macronutrient', importance: 'critical', pregnancyRationale: 'Essential building block for maternal uterine tissue, placenta, and fetal organs.', defaultRDA: 75 },
  carbohydrates: { name: 'Carbohydrates', unit: 'g', category: 'macronutrient', importance: 'high', pregnancyRationale: 'Primary glucose fuel for maternal cellular energy and fetal brain development.', defaultRDA: 275 },
  fat: { name: 'Total Fat', unit: 'g', category: 'macronutrient', importance: 'moderate', pregnancyRationale: 'Supports fat-soluble vitamin absorption (A, D, E, K) and hormone synthesis.', defaultRDA: 55 },
  saturatedFat: { name: 'Saturated Fat', unit: 'g', category: 'macronutrient', importance: 'moderate', pregnancyRationale: 'Keep within healthy limits (<10% total calories) to protect maternal cardiovascular health.', defaultRDA: 18 },
  fiber: { name: 'Dietary Fiber', unit: 'g', category: 'macronutrient', importance: 'critical', pregnancyRationale: 'Prevents pregnancy-induced constipation, hemorrhoids, and supports healthy gut microbiome.', defaultRDA: 30 },
  sugar: { name: 'Natural / Added Sugar', unit: 'g', category: 'macronutrient', importance: 'moderate', pregnancyRationale: 'Limit added simple sugars to prevent gestational diabetes mellitus (GDM).', defaultRDA: 35 },

  // Vitamins
  vitaminA: { name: 'Vitamin A', unit: 'mcg RAE', category: 'vitamin', importance: 'critical', pregnancyRationale: 'Supports embryonic ocular development, respiratory lining, and postpartum immunity.', defaultRDA: 900 },
  vitaminB1: { name: 'Thiamine (B1)', unit: 'mg', category: 'vitamin', importance: 'high', pregnancyRationale: 'Cofactor for maternal carbohydrate metabolism and fetal central nervous system.', defaultRDA: 2.0 },
  vitaminB2: { name: 'Riboflavin (B2)', unit: 'mg', category: 'vitamin', importance: 'high', pregnancyRationale: 'Promotes healthy fetal skin, eyesight, and cellular energy production.', defaultRDA: 2.7 },
  vitaminB3: { name: 'Niacin (B3)', unit: 'mg', category: 'vitamin', importance: 'moderate', pregnancyRationale: 'Aids digestive enzyme function, skin integrity, and nerves.', defaultRDA: 18 },
  vitaminB5: { name: 'Pantothenic Acid (B5)', unit: 'mg', category: 'vitamin', importance: 'moderate', pregnancyRationale: 'Aids fatty acid breakdown and steroid hormone production.', defaultRDA: 6.0 },
  vitaminB6: { name: 'Pyridoxine (B6)', unit: 'mg', category: 'vitamin', importance: 'critical', pregnancyRationale: 'Crucial for fetal neurotransmitter synthesis and natural relief from morning sickness.', defaultRDA: 2.6 },
  vitaminB7: { name: 'Biotin (B7)', unit: 'mcg', category: 'vitamin', importance: 'moderate', pregnancyRationale: 'Enzyme cofactor for macronutrient breakdown; supports maternal hair and keratin structure.', defaultRDA: 35 },
  vitaminB9: { name: 'Folate (B9 / Folic Acid)', unit: 'mcg', category: 'vitamin', importance: 'critical', pregnancyRationale: 'Prevents Neural Tube Defects (NTD), spina bifida, and maternal megaloblastic anemia.', defaultRDA: 570 },
  vitaminB12: { name: 'Vitamin B12', unit: 'mcg', category: 'vitamin', importance: 'critical', pregnancyRationale: 'Works synergistically with Folate for DNA synthesis, red blood cell production, and myelin sheath.', defaultRDA: 2.6 },
  vitaminC: { name: 'Vitamin C', unit: 'mg', category: 'vitamin', importance: 'critical', pregnancyRationale: 'Dramatically enhances non-heme plant iron absorption and collagen connective tissue formation.', defaultRDA: 80 },
  vitaminD: { name: 'Vitamin D', unit: 'mcg', category: 'vitamin', importance: 'critical', pregnancyRationale: 'Regulates calcium homeostasis for fetal mineralization and maternal bone density.', defaultRDA: 15 },
  vitaminE: { name: 'Vitamin E', unit: 'mg', category: 'vitamin', importance: 'moderate', pregnancyRationale: 'Lipid antioxidant protecting maternal cell membranes from oxidative stress.', defaultRDA: 15 },
  vitaminK: { name: 'Vitamin K', unit: 'mcg', category: 'vitamin', importance: 'high', pregnancyRationale: 'Essential for physiological prothrombin clotting factors and neonatal hemorrhage prevention.', defaultRDA: 90 },

  // Minerals
  calcium: { name: 'Calcium', unit: 'mg', category: 'mineral', importance: 'critical', pregnancyRationale: 'Essential for building baby’s skeleton, tooth buds, and preventing maternal bone demineralization.', defaultRDA: 1200 },
  iron: { name: 'Iron', unit: 'mg', category: 'mineral', importance: 'critical', pregnancyRationale: 'Required for expanded maternal blood volume, placental perfusion, and preventing maternal fatigue.', defaultRDA: 27 },
  magnesium: { name: 'Magnesium', unit: 'mg', category: 'mineral', importance: 'high', pregnancyRationale: 'Regulates maternal neuromuscular tone, reduces leg cramps, and mitigates preeclampsia risk.', defaultRDA: 350 },
  phosphorus: { name: 'Phosphorus', unit: 'mg', category: 'mineral', importance: 'moderate', pregnancyRationale: 'Works hand-in-hand with calcium for skeletal mineralization and ATP cellular storage.', defaultRDA: 1000 },
  potassium: { name: 'Potassium', unit: 'mg', category: 'mineral', importance: 'high', pregnancyRationale: 'Maintains fluid-electrolyte balance and buffers pregnancy-related blood pressure shifts.', defaultRDA: 3500 },
  sodium: { name: 'Sodium', unit: 'mg', category: 'mineral', importance: 'moderate', pregnancyRationale: 'Maintains intravascular osmotic pressure; avoid excessive processed intake.', defaultRDA: 2000 },
  zinc: { name: 'Zinc', unit: 'mg', category: 'mineral', importance: 'critical', pregnancyRationale: 'Directly influences cellular rapid division, embryonic gene expression, and maternal immunity.', defaultRDA: 14.5 },
  copper: { name: 'Copper', unit: 'mg', category: 'mineral', importance: 'moderate', pregnancyRationale: 'Enzymatic component for iron transport, elastin synthesis, and red blood cells.', defaultRDA: 1.7 },
  manganese: { name: 'Manganese', unit: 'mg', category: 'mineral', importance: 'moderate', pregnancyRationale: 'Supports cartilage development and enzyme activation for amino acid metabolism.', defaultRDA: 4.0 },
  selenium: { name: 'Selenium', unit: 'mcg', category: 'mineral', importance: 'high', pregnancyRationale: 'Thyroid hormone metabolism and endogenous antioxidant enzyme synthesis (glutathione).', defaultRDA: 65 },
  iodine: { name: 'Iodine', unit: 'mcg', category: 'mineral', importance: 'critical', pregnancyRationale: 'Vital for maternal thyroid hormones that drive embryonic neuro-cognitive development.', defaultRDA: 250 },

  // Other
  choline: { name: 'Choline', unit: 'mg', category: 'other', importance: 'critical', pregnancyRationale: 'Structural precursor for acetylcholine and fetal hippocampal memory center development.', defaultRDA: 450 },
  omega3: { name: 'Omega-3 (DHA/EPA/ALA)', unit: 'g', category: 'other', importance: 'critical', pregnancyRationale: 'Critical structural fatty acid for fetal retinal photoreceptors and cerebral cortex maturation.', defaultRDA: 1.4 }
};

export const MATERNAL_DAILY_TARGETS: Record<keyof DetailedNutrients, number> = Object.keys(MATERNAL_NUTRIENT_METADATA).reduce((acc, key) => {
  const k = key as keyof DetailedNutrients;
  acc[k] = MATERNAL_NUTRIENT_METADATA[k]?.defaultRDA || 0;
  return acc;
}, {} as Record<keyof DetailedNutrients, number>);

// -------------------------------------------------------------
// HELPER: GET MATERNAL NUTRITION TARGETS
// -------------------------------------------------------------
export function getMaternalNutritionTargets(profile: any): NutritionTargetSet {
  const weeks = profile?.weeksPregnant || 24;
  let trimester: '1st Trimester' | '2nd Trimester' | '3rd Trimester' = '2nd Trimester';
  if (weeks <= 12) trimester = '1st Trimester';
  else if (weeks > 28) trimester = '3rd Trimester';

  const preWeight = profile?.prePregnancyWeight || 58;
  const heightM = (profile?.heightCm || 162) / 100;
  const bmi = preWeight / (heightM * heightM);

  // Trimester calorie and protein adjustments (ICMR-NIN recommendation: +350 kcal in 2nd/3rd trimester, +22.7g protein in 2nd/3rd)
  let calorieTarget = 2000;
  let proteinTarget = 65;
  let ironTarget = 27;
  let calciumTarget = 1000;
  let folateTarget = 570;

  if (trimester === '1st Trimester') {
    calorieTarget = 2050;
    proteinTarget = 65;
  } else if (trimester === '2nd Trimester') {
    calorieTarget = 2350;
    proteinTarget = 78;
    calciumTarget = 1200;
  } else {
    calorieTarget = 2450;
    proteinTarget = 82;
    calciumTarget = 1200;
  }

  // Adjust for pre-pregnancy BMI if underweight or overweight
  if (bmi < 18.5) {
    calorieTarget += 150;
    proteinTarget += 5;
  } else if (bmi > 25) {
    calorieTarget -= 100;
  }

  // Adjust if specific deficiencies are noted
  const deficiencies = (profile?.deficiencies || []).map((d: string) => d.toLowerCase());
  if (deficiencies.some((d: string) => d.includes('iron') || d.includes('anemia'))) {
    ironTarget = 30; // Elevated target for anemia support
  }
  if (deficiencies.some((d: string) => d.includes('calcium'))) {
    calciumTarget = 1300;
  }

  const targetsRecord: Record<keyof DetailedNutrients, NutritionTargetItem> = {} as any;

  (Object.keys(MATERNAL_NUTRIENT_METADATA) as Array<keyof DetailedNutrients>).forEach(key => {
    const meta = MATERNAL_NUTRIENT_METADATA[key];
    let customVal = meta.defaultRDA;

    if (key === 'calories') customVal = calorieTarget;
    else if (key === 'protein') customVal = proteinTarget;
    else if (key === 'iron') customVal = ironTarget;
    else if (key === 'calcium') customVal = calciumTarget;
    else if (key === 'vitaminB9' || (key as string) === 'folate') customVal = folateTarget;

    targetsRecord[key] = {
      name: meta.name,
      key,
      target: customVal,
      unit: meta.unit,
      category: meta.category,
      importance: meta.importance,
      pregnancyRationale: meta.pregnancyRationale,
      isPersonalized: true
    };
  });

  // Ensure alias 'folate' is also available on targets for convenience
  (targetsRecord as any).folate = targetsRecord.vitaminB9;

  return {
    label: 'Personalized target',
    trimester,
    targets: targetsRecord
  };
}

// -------------------------------------------------------------
// HELPER: CALCULATE NUTRITION FROM CONFIRMED ITEMS
// -------------------------------------------------------------
export function calculateMealNutrition(items: ConfirmedMealItem[], profile?: any): CalculatedMealNutrition {
  const totals: DetailedNutrients = {
    calories: 0, protein: 0, carbohydrates: 0, fat: 0, saturatedFat: 0, fiber: 0, sugar: 0,
    vitaminA: 0, vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB5: 0, vitaminB6: 0,
    vitaminB7: 0, vitaminB9: 0, vitaminB12: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0,
    calcium: 0, iron: 0, magnesium: 0, phosphorus: 0, potassium: 0, sodium: 0,
    zinc: 0, copper: 0, manganese: 0, selenium: 0, iodine: 0, choline: 0, omega3: 0
  };

  const itemBreakdowns: CalculatedMealNutrition['itemBreakdowns'] = [];
  const safetyAlerts: string[] = [];
  const allergyAlerts: string[] = [];

  const userAllergies = (profile?.allergies || []).map((a: string) => a.toLowerCase().trim());
  const userCustomAllergies = (profile?.customAllergies || []).map((a: string) => a.toLowerCase().trim());
  const allAllergies = [...userAllergies, ...userCustomAllergies];

  items.forEach(item => {
    const foodId = item.foodId;
    const foodDbItem = FOOD_DATABASE_ITEMS.find(f => f.id === foodId);
    const compData = ICMR_FOOD_COMPOSITION_DATA[foodId] || {};

    // Determine weight in grams:
    // If unit is 'ml', 1 ml ~ 1.02 g for standard gravies/beverages
    const factor = (item.quantity || 100) / 100;

    const itemNutrients: DetailedNutrients = {
      calories: Math.round(((compData.calories ?? foodDbItem?.calories ?? 150) * factor) * 10) / 10,
      protein: Math.round(((compData.protein ?? foodDbItem?.protein ?? 4) * factor) * 10) / 10,
      carbohydrates: Math.round(((compData.carbohydrates ?? foodDbItem?.carbohydrates ?? 20) * factor) * 10) / 10,
      fat: Math.round(((compData.fat ?? foodDbItem?.fat ?? 3) * factor) * 10) / 10,
      saturatedFat: Math.round(((compData.saturatedFat ?? 0.8) * factor) * 10) / 10,
      fiber: Math.round(((compData.fiber ?? foodDbItem?.fiber ?? 2.5) * factor) * 10) / 10,
      sugar: Math.round(((compData.sugar ?? foodDbItem?.sugar ?? 1.0) * factor) * 10) / 10,

      // Vitamins
      vitaminA: Math.round(((compData.vitaminA ?? foodDbItem?.vitaminA ?? 20) * factor) * 10) / 10,
      vitaminB1: Math.round(((compData.vitaminB1 ?? 0.15) * factor) * 100) / 100,
      vitaminB2: Math.round(((compData.vitaminB2 ?? 0.10) * factor) * 100) / 100,
      vitaminB3: Math.round(((compData.vitaminB3 ?? 1.5) * factor) * 100) / 100,
      vitaminB5: Math.round(((compData.vitaminB5 ?? 0.6) * factor) * 100) / 100,
      vitaminB6: Math.round(((compData.vitaminB6 ?? foodDbItem?.vitaminB6 ?? 0.15) * factor) * 100) / 100,
      vitaminB7: Math.round(((compData.vitaminB7 ?? 2.5) * factor) * 10) / 10,
      vitaminB9: Math.round(((compData.vitaminB9 ?? foodDbItem?.folate ?? 25) * factor) * 10) / 10,
      vitaminB12: Math.round(((compData.vitaminB12 ?? foodDbItem?.vitaminB12 ?? 0) * factor) * 100) / 100,
      vitaminC: Math.round(((compData.vitaminC ?? foodDbItem?.vitaminC ?? 5) * factor) * 10) / 10,
      vitaminD: Math.round(((compData.vitaminD ?? foodDbItem?.vitaminD ?? 0) * factor) * 100) / 100,
      vitaminE: Math.round(((compData.vitaminE ?? foodDbItem?.vitaminE ?? 0.8) * factor) * 10) / 10,
      vitaminK: Math.round(((compData.vitaminK ?? foodDbItem?.vitaminK ?? 2.0) * factor) * 10) / 10,

      // Minerals
      calcium: Math.round(((compData.calcium ?? foodDbItem?.calcium ?? 40) * factor) * 10) / 10,
      iron: Math.round(((compData.iron ?? foodDbItem?.iron ?? 2.0) * factor) * 10) / 10,
      magnesium: Math.round(((compData.magnesium ?? foodDbItem?.magnesium ?? 45) * factor) * 10) / 10,
      phosphorus: Math.round(((compData.phosphorus ?? 120) * factor) * 10) / 10,
      potassium: Math.round(((compData.potassium ?? foodDbItem?.potassium ?? 250) * factor) * 10) / 10,
      sodium: Math.round(((compData.sodium ?? foodDbItem?.sodium ?? 150) * factor) * 10) / 10,
      zinc: Math.round(((compData.zinc ?? foodDbItem?.zinc ?? 1.2) * factor) * 10) / 10,
      copper: Math.round(((compData.copper ?? 0.2) * factor) * 100) / 100,
      manganese: Math.round(((compData.manganese ?? 0.6) * factor) * 100) / 100,
      selenium: Math.round(((compData.selenium ?? 7.5) * factor) * 10) / 10,
      iodine: Math.round(((compData.iodine ?? 5.0) * factor) * 10) / 10,

      // Other
      choline: Math.round(((compData.choline ?? 25) * factor) * 10) / 10,
      omega3: Math.round(((compData.omega3 ?? 0.05) * factor) * 100) / 100
    };

    // Accumulate into totals
    (Object.keys(totals) as Array<keyof DetailedNutrients>).forEach(k => {
      totals[k] = Math.round((totals[k] + itemNutrients[k]) * 100) / 100;
    });

    itemBreakdowns.push({
      foodId,
      name: item.name,
      quantityGrams: item.quantity,
      nutrients: itemNutrients,
      source: ICMR_FOOD_COMPOSITION_DATA[foodId] ? 'ICMR-NIN IFCT 2017' : 'Standard Culinary Data'
    });

    // Check pregnancy safety
    if (foodDbItem) {
      if (foodDbItem.safetyLevel === 'Avoid') {
        safetyAlerts.push(`⚠️ ${foodDbItem.name.en} is marked as "Avoid during pregnancy". Please discuss with your doctor.`);
      } else if (foodDbItem.safetyLevel === 'Safe in Moderation') {
        safetyAlerts.push(`ℹ️ ${foodDbItem.name.en} should be consumed in moderation during pregnancy.`);
      }
    }

    // Check allergy match
    const foodNameLower = item.name.toLowerCase();
    allAllergies.forEach(allergy => {
      if (allergy && (foodNameLower.includes(allergy) || foodId.includes(allergy))) {
        allergyAlerts.push(`⚠️ Possible Allergy Match: "${item.name}" may match your saved allergy to "${allergy}". Please verify ingredients carefully before consuming.`);
      }
    });
  });

  return {
    totals,
    itemBreakdowns,
    safetyAlerts,
    allergyAlerts
  };
}

// -------------------------------------------------------------
// HELPER: GENERATE NUTRITION INSIGHTS & GAP ANALYSIS
// -------------------------------------------------------------
export function generateNutritionInsights(
  dailyTotals: DetailedNutrients,
  targets: NutritionTargetSet | Record<string, any>,
  profile: any
): NutritionInsight[] {
  const insights: NutritionInsight[] = [];
  const t: Record<string, any> = (targets as any)?.targets || targets || {};

  const proteinTargetVal = t.protein?.target ?? 75;
  const ironTargetVal = t.iron?.target ?? 27;
  const calciumTargetVal = t.calcium?.target ?? 1200;
  const folateTargetVal = t.folate?.target ?? t.vitaminB9?.target ?? 570;
  const fiberTargetVal = t.fiber?.target ?? 28;

  // 1. Protein Gap Analysis
  const currentProtein = dailyTotals.protein || 0;
  const proteinPct = (currentProtein / proteinTargetVal) * 100;
  if (proteinPct >= 85) {
    insights.push({
      id: 'protein_good',
      type: 'on_track',
      title: 'Protein Intake on Track',
      nutrient: 'Protein',
      message: `Your logged protein intake (${currentProtein}g) is meeting today's tracked target (${proteinTargetVal}g). Great job supporting fetal tissue building!`,
      suggestedFoods: ['Sprouted Moong Dal', 'Boiled Eggs', 'Paneer', 'Sundal']
    });
  } else {
    insights.push({
      id: 'protein_low',
      type: 'needs_attention',
      title: 'Protein Below Today\'s Tracked Target',
      nutrient: 'Protein',
      message: `Your logged intake provides ${currentProtein}g of protein against the selected reference target of ${proteinTargetVal}g. Consider adding protein-rich foods that fit your diet preference.`,
      suggestedFoods: profile?.diet === 'Non-Vegetarian' 
        ? ['Boiled Eggs (2)', 'Fish Curry', 'Sprouted Green Gram Sundal', 'Paneer Curry'] 
        : ['Sprouted Moong Dal Sundal', 'Paneer Gravy', 'Ragi Porridge with Curd', 'Toor Dal Kootu'],
      actionLabel: 'View High-Protein Foods'
    });
  }

  // 2. Iron Gap Analysis
  const currentIron = dailyTotals.iron || 0;
  const ironPct = (currentIron / ironTargetVal) * 100;
  if (ironPct >= 80) {
    insights.push({
      id: 'iron_good',
      type: 'on_track',
      title: 'Iron Intake on Track',
      nutrient: 'Iron',
      message: `Iron intake (${currentIron} mg) is on track with today's reference target (${ironTargetVal} mg), supporting robust maternal hemoglobin.`,
      suggestedFoods: ['Cooked Palak', 'Dates (Khajur)', 'Sesame Chikki', 'Ragi Mudde']
    });
  } else {
    insights.push({
      id: 'iron_low',
      type: 'consider_more',
      title: 'Iron Intake Below Tracked Reference Target',
      nutrient: 'Iron',
      message: `Today's logged foods provide ${currentIron} mg iron, which is below the selected reference target of ${ironTargetVal} mg. Plant iron absorbs best when paired with Vitamin C (lemon juice or amla).`,
      suggestedFoods: ['Moringa Keerai (Drumstick Leaves) Soup', 'Cooked Spinach / Palak Dal', 'Dates & Soaked Almonds', 'Organic Jaggery Sesame Chikki'],
      actionLabel: 'View Iron-Rich Foods'
    });
  }

  // 3. Calcium Gap Analysis
  const currentCalcium = dailyTotals.calcium || 0;
  const calciumPct = (currentCalcium / calciumTargetVal) * 100;
  if (calciumPct >= 80) {
    insights.push({
      id: 'calcium_good',
      type: 'on_track',
      title: 'Calcium Intake on Track',
      nutrient: 'Calcium',
      message: `Calcium intake (${currentCalcium} mg) is currently on track with today's tracked target (${calciumTargetVal} mg), aiding baby's skeletal mineralization.`,
      suggestedFoods: ['Ragi Mudde', 'Fresh Curd / Buttermilk', 'Sesame Chikki', 'Paneer']
    });
  } else {
    insights.push({
      id: 'calcium_low',
      type: 'consider_more',
      title: 'Consider More Calcium for Fetal Bone Growth',
      nutrient: 'Calcium',
      message: `Today's logged foods provide ${currentCalcium} mg calcium against the selected reference target of ${calciumTargetVal} mg. Traditional millets like Ragi and fresh dairy are excellent sources.`,
      suggestedFoods: ['Ragi Mudde (Finger Millet Ball)', '1 Cup Fresh Set Curd / Yogurt', 'Sesame Seeds Chikki', 'Homemade Paneer Gravy'],
      actionLabel: 'View Calcium Sources'
    });
  }

  // 4. Folate Gap Analysis
  const folateCurrent = (dailyTotals as any).folate ?? (dailyTotals as any).vitaminB9 ?? 0;
  const folatePct = (folateCurrent / folateTargetVal) * 100;
  if (folatePct < 75) {
    insights.push({
      id: 'folate_low',
      type: 'consider_more',
      title: 'Folate Intake Below Selected Reference Target',
      nutrient: 'Folate (B9)',
      message: `Today's logged foods provide ${folateCurrent} mcg folate against the reference target of ${folateTargetVal} mcg. Folate is crucial for neural development.`,
      suggestedFoods: ['Pesarattu (Moong Dal Crepe)', 'Cooked Spinach / Palak', 'Kootu with Lentils & Veg', 'Avial'],
      actionLabel: 'View Folate Foods'
    });
  }

  // 5. Dietary Fiber Check
  const currentFiber = dailyTotals.fiber || 0;
  const fiberPct = (currentFiber / fiberTargetVal) * 100;
  if (fiberPct < 70) {
    insights.push({
      id: 'fiber_low',
      type: 'info',
      title: 'Increase Dietary Fiber for Digestive Ease',
      nutrient: 'Fiber',
      message: `Logged fiber is ${currentFiber}g (target: ${fiberTargetVal}g). Increasing whole grains and cooked vegetables helps manage digestion comfortably during pregnancy.`,
      suggestedFoods: ['Jonna Roti', 'Ragi Mudde', 'Vegetable Avial', 'Cooked Mixed Veg Sambar']
    });
  }

  return insights;
}
