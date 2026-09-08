import { DetailedNutrients } from '../nutrition_engine';

export type IndianRegion = 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East';

export const REGIONS_LIST: IndianRegion[] = [
  'North',
  'South',
  'East',
  'West',
  'Central',
  'North-East'
];

export const REGION_TO_STATES: Record<IndianRegion, string[]> = {
  'North': [
    'Jammu & Kashmir',
    'Ladakh',
    'Himachal Pradesh',
    'Punjab',
    'Haryana',
    'Uttarakhand',
    'Uttar Pradesh',
    'Delhi'
  ],
  'South': [
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Andhra Pradesh',
    'Telangana',
    'Puducherry'
  ],
  'East': [
    'West Bengal',
    'Bihar',
    'Jharkhand',
    'Odisha',
    'Andaman & Nicobar Islands'
  ],
  'West': [
    'Maharashtra',
    'Gujarat',
    'Goa',
    'Rajasthan'
  ],
  'Central': [
    'Madhya Pradesh',
    'Chhattisgarh'
  ],
  'North-East': [
    'Assam',
    'Meghalaya',
    'Manipur',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Arunachal Pradesh',
    'Sikkim'
  ]
};

export interface RecipeIngredient {
  id?: string;
  name: string;
  quantity: number;
  unit: 'g' | 'ml' | 'tbsp' | 'tsp' | 'cup' | 'bowl' | 'piece' | 'pinch' | string;
  notes?: string;
  safetyNote?: string;
  foodDatabaseReference?: string;
}

export interface RecipeServingSize {
  totalGrams: number;
  servings: number;
  servingGrams: number;
  servingUnit?: string;
}

export type FoodSafetyLevel = 
  | 'Generally suitable' 
  | 'Use caution' 
  | 'Avoid / consult healthcare professional'
  | 'Safe'
  | 'Moderate'
  | 'Avoid';

export type NutritionDataSourceType = 
  | 'VERIFIED' 
  | 'ESTIMATED' 
  | 'USER_PROVIDED' 
  | 'AI_ASSISTED'
  | 'Government Published'
  | 'ICMR-NIN IFCT 2017'
  | 'National Guidelines'
  | string;

export interface TrimesterSuitabilityInfo {
  firstTrimester: boolean;
  secondTrimester: boolean;
  thirdTrimester: boolean;
  bestSuitedTrimester?: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'All Trimesters' | '2nd & 3rd Trimester' | string;
  maternalBenefits: string;
}

export interface IngredientSafetyAlert {
  ingredient: string;
  level: 'Safe' | 'Moderate' | 'Avoid';
  note: string;
}

export interface NutritionPer100g {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  iron: number;
  calcium: number;
  folate: number;
}

export interface RegionalRecipe {
  recipeId: string;
  foodId?: string; // Connected unique Food ID from Food Database
  region: IndianRegion;
  state: string;
  city?: string;
  cityOrOrigin?: string;
  traditionalName: string;
  recipeName?: string;
  nameEnglish?: string;
  englishName?: string;
  nameLocal?: string;
  localName?: string;
  localScript?: string;
  englishDescription?: string;
  referenceImageUrl: string | null;
  referenceImageSource?: string;
  referenceImageLicense?: string;
  sourceReference?: string;
  photoUrl?: string; // Fallback alias
  imageUrl?: string | null;
  imageAttribution?: string;
  licenseInformation?: string;
  sourceName?: string;
  sourceUrl?: string;
  originalRecipeUrl?: string;
  canReproduceFullRecipe?: boolean;
  cuisine?: string;
  category?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Beverages' | 'Desserts' | 'Traditional Soups' | 'Millets' | 'Main Dish' | string;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Drinks' | 'Desserts' | 'Main course' | 'Side dishes' | string;
  ingredients: RecipeIngredient[];
  preparationSteps?: string[]; // Clear numbered instructions
  servingSize: RecipeServingSize;
  totalRecipeWeight?: number; // in grams
  cookingTimeMinutes?: number;
  preparationTimeMinutes?: number;
  cookingMethod?: string;
  nutrition: DetailedNutrients;
  nutritionPer100g?: NutritionPer100g;
  nutritionStatus: 'Calculated' | 'Estimated' | 'Nutrition data unavailable' | string;
  nutritionSource: string;
  nutritionDataSourceType: NutritionDataSourceType;
  foodSafety: {
    level: FoodSafetyLevel;
    explanation: string;
  };
  safetyClassification?: 'Safe' | 'Moderate' | 'Avoid' | 'Insufficient verified information';
  pregnancySafety?: 'Safe' | 'Moderate / Use Caution' | 'Avoid' | 'Insufficient verified information';
  safetyExplanation?: string;
  trimesterRelevance?: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'All Trimesters' | '2nd & 3rd Trimester' | string;
  ingredientSafetyAlerts?: IngredientSafetyAlert[];
  trimesterSuitability?: TrimesterSuitabilityInfo;
  pregnancyNutritionalBenefits?: string[];
  allergens: string[];
  pregnancyNutritionNotes: string[];
  isVegetarian: boolean;
  isNonVegetarian?: boolean;
  isMilletDish?: boolean;
  isTraditionalFood?: boolean;
  isFestivalFood?: boolean;
  regionalTags?: string[];
  createdBy: string; // 'system' or user uid
  createdAt: string; // ISO date string
  updatedAt: string;
}

export interface UserMealPhotoRecord {
  id: string;
  userId: string;
  date: string;
  time?: string;
  mealType: string;
  recipeId?: string;
  recipeName?: string;
  quantityGrams: number;
  userMealPhotoUrl: string; // Stored separately as the user's actual photo
  photoCapturedAt: string;
  nutritionRecord: DetailedNutrients;
  nutritionDataSourceType: 'USER_PROVIDED';
  notes?: string;
}

