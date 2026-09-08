export type PregnancyTrimester = '1st Trimester' | '2nd Trimester' | '3rd Trimester';

export type IndianRegion = 'South India' | 'North India' | 'West India' | 'East India' | 'Central India' | 'North-East India' | 'National';

export interface GlobalLocationState {
  country: string; // 'India'
  state: string; // e.g. 'Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra', 'Telangana', etc.
  district: string; // e.g. 'Mysuru', 'Coimbatore', 'Bengaluru Urban', etc.
  taluk?: string; // e.g. 'Nanjangud', 'Pollachi', 'Aluva', etc. (Tehsil / Sub-district / Mandal)
  village?: string; // e.g. 'Hullahalli', 'Kadakola', 'Debur', etc.
  townOrVillage?: string; // Village / Town / Gram Panchayat
  city: string; // City / Town / Primary locality identifier
  pincode?: string; // 6-digit postal code e.g. '571301', '641001'
  locality?: string; // Specific neighborhood / Gram Panchayat / Ward
  formattedAddress?: string; // e.g. 'Hullahalli Village, Nanjangud Taluk, Mysuru, Karnataka - 571301'
  latitude: number;
  longitude: number;
  region: IndianRegion;
  cuisineRegion?: string;
  isGpsDetected?: boolean;
  locationType?: 'village' | 'gram_panchayat' | 'town' | 'city' | 'taluk' | 'district';
}

export interface AuthUser {
  id: string;
  name: string;
  emailOrPhone: string;
  hasCompletedProfile: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weeksPregnant: number;
  pregnancyMonth?: number; // 1 to 9
  dueDate: string;
  prePregnancyWeightKg: number; // in kg
  currentWeightKg: number; // in kg
  heightCm: number; // in cm
  bloodGroup: string;
  dietPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  state: string;
  city: string;
  district?: string;
  taluk?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  region?: IndianRegion;
  email?: string;
  mobileNumber?: string;
  mcpCardNumber?: string;
  rchId?: string;
  allergies: string[];
  medicalConditions: string[];
  emergencyContact: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  savedHealthcareFacility?: {
    id?: string;
    name: string;
    address: string;
    phone?: string;
    distanceKm?: number;
    category?: string;
  };
  doctorDetails: {
    name: string;
    hospital: string;
    phone: string;
    nextAppointmentDate: string;
    nextAppointmentTime: string;
  };
  nextDoctorVisit?: {
    date: string;
    time: string;
    doctorName?: string;
    hospitalName?: string;
    phone?: string;
    notes?: string;
    reminderEnabled?: boolean;
  };
  waterIntakeGoalMl?: number;
  waterReminderSettings?: {
    enabled: boolean;
    intervalMinutes: number;
    scheduleType?: '1hour' | '2hours' | 'custom';
  };
  mealReminderSettings?: {
    enabled: boolean;
    breakfast: { enabled: boolean; time: string };
    morningSnack: { enabled: boolean; time: string };
    lunch: { enabled: boolean; time: string };
    eveningSnack: { enabled: boolean; time: string };
    dinner: { enabled: boolean; time: string };
  };
  doctorReminderSettings?: {
    enabled: boolean;
    advanceNotice: '2hours' | '24hours' | '48hours' | '1week';
  };
  healthChecklist?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface MealReminderSettings {
  enabled: boolean;
  breakfast: { enabled: boolean; time: string };
  morningSnack: { enabled: boolean; time: string };
  lunch: { enabled: boolean; time: string };
  eveningSnack: { enabled: boolean; time: string };
  dinner: { enabled: boolean; time: string };
}

export interface DoctorReminderSettings {
  enabled: boolean;
  advanceNotice: '2hours' | '24hours' | '48hours' | '1week';
}

export interface KaggleFoodItem {
  id: string;
  name: string;
  regionalName: string;
  category: 'Millets & Grains' | 'Pulses & Legumes' | 'Vegetables & Greens' | 'Fruits' | 'Dairy' | 'Nuts & Seeds' | 'Traditional Dishes' | 'Eggs & Poultry' | 'Snacks & Soups';
  cuisine: string; // 'Karnataka', 'Tamil Nadu', 'Kerala', 'Telugu', 'Maharashtrian', 'Gujarati', 'Bengali', 'Punjabi', 'North Indian', 'South Indian', 'Pan-Indian'
  country: string; // 'India'
  state: string; // Primary state of origin/staple
  region: IndianRegion;
  ingredients: string[];
  calories: number; // kcal per 100g or standard serving
  protein: number; // in g
  carbohydrates: number; // in g
  fat: number; // in g
  fiber: number; // in g
  iron: number; // in mg
  calcium: number; // in mg
  folate: number; // in mcg
  vitaminA?: number; // in mcg
  vitaminC?: number; // in mg
  vitaminD?: number; // in mcg
  vitaminB6?: number; // in mg
  vitaminB12?: number; // in mcg
  zinc?: number; // in mg
  magnesium?: number; // in mg
  potassium?: number; // in mg
  sodium?: number; // in mg
  glycemicIndex?: 'Low' | 'Medium' | 'High';
  servingSize: string;
  estimatedPrice?: string;
  safetyLevel: 'Safe' | 'Safe in Moderation' | 'Avoid';
  safetyExplanation: string;
  isVegetarian: boolean;
  trimesterRecommended: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'All Trimesters' | string;
  tags: string[];
  maternalBenefits: string;
  maternalTip: string;
  dataSource: string; // 'Kaggle Indian Food & Nutrition Dataset (ICMR-IFCT Standardized)'
  image?: string;
  // Computed ranking & transparency explanation
  recommendationPriority?: 1 | 2 | 3 | 4; // 1: Exact State, 2: Region, 3: Country, 4: General
  whyRecommended?: string;
}

export interface FoodSearchFilters {
  searchQuery: string;
  category: string;
  cuisine: string;
  region: string;
  state: string;
  safetyLevel: string;
  trimester: string;
  dietPreference: string;
  minProtein: number;
  minIron: number;
  minCalcium: number;
  minFolate: number;
  minFiber: number;
  maxCalories: number;
  onlyLocationRelevant: boolean;
}

export interface FoodItemData {
  id: string;
  name: string;
  regionalName?: string;
  category: 'Dairy' | 'Eggs & Poultry' | 'Fruits' | 'Vegetables' | 'Millets & Grains' | 'Legumes & Dals' | 'Nuts & Seeds' | 'Traditional Soups' | 'Snacks';
  image: string;
  description: string;
  maternalTip: string;
  calories: number;
  protein: number; // in g
  iron: number; // in mg
  calcium: number; // in mg
  folate: number; // in mcg
  vitaminC?: number; // in mg
  fiber?: number; // in g
  estimatedPrice: string;
  safetyLevel: 'Safe' | 'Safe in Moderation' | 'Avoid';
  safetyExplanation?: string;
  isVegetarian: boolean;
  trimesterRecommended?: string;
  keyBenefits?: string[];
  tags: ('Protein Rich' | 'Iron Rich' | 'Calcium Rich' | 'Folate Rich' | 'Vitamin Rich' | 'Foods to Avoid')[];
}

export interface PlannedMeal {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  category: 'Breakfast' | 'Mid-Morning Snack' | 'Lunch' | 'Evening Snack' | 'Dinner';
  name: string;
  portion: string;
  calories: number;
  protein: number;
  iron: number;
  calcium: number;
  folate: number;
  isCompleted?: boolean;
  foodId?: string;
  servings?: number;
  unitCalories?: number;
  unitProtein?: number;
  unitIron?: number;
  unitCalcium?: number;
  unitFolate?: number;
}

export interface WelfareScheme {
  id: string;
  title: string;
  shortName: string;
  description: string;
  eligibility: string;
  benefits: string;
  cashAmountHighlight?: string;
  documentsNeeded: string[];
  portalUrl: string;
  category: 'Central Government' | 'State Government' | 'Nutrition Program';
  badgeColor?: string;
}

export type FacilityTypeCategory =
  | 'Government General Hospital'
  | 'District Hospital'
  | 'Primary Health Centre (PHC)'
  | 'Community Health Centre (CHC)'
  | 'Maternity Hospital'
  | 'Medical College Hospital'
  | 'Private Hospital'
  | 'Anganwadi Centre'
  | 'Hospitals'
  | 'Government Health Centres'
  | 'Primary Health Centres'
  | 'Anganwadis'
  | 'Gynecologists'
  | 'Emergency Facilities';

export interface HealthFacility {
  id: string;
  name: string;
  category: FacilityTypeCategory;
  facilityType?: string; // e.g. "Govt Tertiary Maternity Hospital", "Primary Health Centre (PHC)"
  address: string;
  city: string;
  district?: string;
  state?: string;
  distanceKm: number;
  phone: string;
  emergencyPhone?: string;
  doctorInCharge?: string;
  timing: string;
  bedCapacity?: number;
  hasMaternityWard: boolean;
  hasDeliveryRoom?: boolean;
  hasMaternalIcu?: boolean;
  hasNicu?: boolean;
  hasEmergencyServices?: boolean;
  hasCashlessSchemes?: boolean;
  specialties?: string[];
  maternalServices?: string[];
  rating: number;
  lat: number;
  lng: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  safetyAlert?: boolean;
}

export interface OrderProduct {
  id: string;
  name: string;
  category: 'Grocery' | 'Fruits' | 'Protein' | 'Healthy Snacks' | 'Maternal Care' | 'Locally Sourced' | 'Apollo Pharmacy' | 'Maternal Supplements' | string;
  image: string;
  description: string;
  maternalTip: string;
  estimatedPrice?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  weightOrVolume?: string;
  externalLink?: string;
}

export interface WeightRecord {
  week: number;
  weightKg: number;
  date: string;
  bmi: number;
  notes?: string;
}

export type WeightLogEntry = WeightRecord;

export interface ClinicalReport {
  id: string;
  title: string;
  date: string;
  doctor: string;
  facility: string;
  status: 'Normal' | 'Borderline' | 'Attention Needed';
  summary: string;
  parameters: {
    name: string;
    value: string;
    normalRange: string;
    status: 'Normal' | 'Borderline' | 'Elevated' | 'Low';
  }[];
  doctorRemarks: string;
}

export type ClinicalReportItem = ClinicalReport;

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  foodInteractionNote: string;
  isTakenToday: boolean;
  category?: string;
}
