import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  PlannedMeal,
  GlobalLocationState,
  PregnancyTrimester,
  FoodItemData,
  KaggleFoodItem,
  WeightRecord,
  ClinicalReport,
  MedicationItem,
  AuthUser
} from '../types';
import { LoggedMealRecord } from '../nutrition_engine';
import { GlobalLocationService } from '../services/global_location_service';
import { LocationNutritionEngine } from '../services/location_nutrition_engine';
import { authService } from '../services/auth_service';
import {
  INITIAL_USER_PROFILE,
  INITIAL_MEAL_PLAN,
  INITIAL_WEIGHT_RECORDS,
  INITIAL_CLINICAL_REPORTS,
  INITIAL_MEDICATIONS
} from '../data/mockData';
import { NavTabId } from '../components/MainNavigation';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealCategory = 'Breakfast' | 'Mid-Morning Snack' | 'Lunch' | 'Evening Snack' | 'Dinner';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const MEAL_CATEGORIES: MealCategory[] = [
  'Breakfast',
  'Mid-Morning Snack',
  'Lunch',
  'Evening Snack',
  'Dinner'
];

export const MEAL_TIME_RANGES: Record<MealCategory, { time: string; icon: string }> = {
  'Breakfast': { time: '7:00 AM – 9:00 AM', icon: '🌅' },
  'Mid-Morning Snack': { time: '10:30 AM – 11:30 AM', icon: '🍎' },
  'Lunch': { time: '12:30 PM – 2:00 PM', icon: '🍛' },
  'Evening Snack': { time: '4:00 PM – 5:30 PM', icon: '☕' },
  'Dinner': { time: '7:00 PM – 9:00 PM', icon: '🌙' }
};

export interface DayNutritionSummary {
  day: DayOfWeek;
  calories: number;
  protein: number;
  iron: number;
  calcium: number;
  folate: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitC: number;
  vitA: number;
  vitB12: number;
  totalMealCount: number;
  completedMealCount: number;
  mealsByCategory: Record<MealCategory, PlannedMeal[]>;
}

export interface WeeklyNutritionSummary {
  days: Record<DayOfWeek, DayNutritionSummary>;
  weeklyTotalCalories: number;
  weeklyAvgCalories: number;
  weeklyAvgProtein: number;
  weeklyAvgIron: number;
  weeklyAvgCalcium: number;
  weeklyAvgFolate: number;
  totalPlannedMeals: number;
  totalCompletedMeals: number;
}

export interface TrimesterRdaTargets {
  trimester: PregnancyTrimester;
  calories: number;
  protein: number;
  iron: number;
  calcium: number;
  folate: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterMl: number;
  keyNutrients: string[];
}

export interface AddFoodToPlanPayload {
  food: KaggleFoodItem | FoodItemData | {
    id?: string;
    name: string;
    regionalName?: string;
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
    folate: number;
    servingSize?: string;
    image?: string;
  };
  day: DayOfWeek;
  category: MealCategory;
  servings?: number;
  customPortion?: string;
}

interface AppContextType {
  // Navigation
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;

  // User Profile
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  updateUserProfile: (profile: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => void;

  // Global Location
  globalLocation: GlobalLocationState;
  setGlobalLocation: (loc: GlobalLocationState) => void;
  updateLocation: (loc: GlobalLocationState) => void;

  // Trimester & Day Selectors
  selectedTrimester: PregnancyTrimester;
  setSelectedTrimester: (trimester: PregnancyTrimester) => void;
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;

  // Central Meal Plan State
  meals: PlannedMeal[];
  addFoodToPlan: (payload: AddFoodToPlanPayload) => void;
  removeMeal: (mealId: string) => void;
  updateMealServings: (mealId: string, servings: number) => void;
  toggleMealCompleted: (mealId: string) => void;
  clearDayMeals: (day: DayOfWeek) => void;
  regenerateLocationMealPlan: (locationOverride?: GlobalLocationState, trimesterOverride?: PregnancyTrimester) => void;

  // Centralized Nutrition Engine
  getDayNutrition: (day: DayOfWeek) => DayNutritionSummary;
  getSelectedDayNutrition: () => DayNutritionSummary;
  getWeeklyNutrition: () => WeeklyNutritionSummary;
  trimesterRdaTargets: TrimesterRdaTargets;

  // Water Tracker
  waterIntakeMl: number;
  updateWaterIntake: (amountMl: number) => void;
  waterReminderSettings: { enabled: boolean; intervalMinutes: number };
  updateWaterReminder: (settings: { enabled?: boolean; intervalMinutes?: number }) => void;

  // Scanned Food Logs
  loggedMeals: LoggedMealRecord[];
  addLoggedMeal: (meal: LoggedMealRecord) => void;
  deleteLoggedMeal: (mealId: string) => void;

  // Clinical & Vitals
  weightRecords: WeightRecord[];
  addWeightRecord: (record: WeightRecord) => void;
  clinicalReports: ClinicalReport[];
  addClinicalReport: (report: ClinicalReport) => void;
  medications: MedicationItem[];
  toggleMedicationTaken: (id: string) => void;
  addMedication: (med: Omit<MedicationItem, 'id'>) => void;

  // Global "Add to Plan" Modal state
  isAddToPlanModalOpen: boolean;
  modalTargetFood: any | null;
  modalPreselectedDay?: DayOfWeek;
  modalPreselectedCategory?: MealCategory;
  openAddToPlanModal: (food: any, day?: DayOfWeek, category?: MealCategory) => void;
  closeAddToPlanModal: () => void;

  // Profile Modal State
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSmartReminderModalOpen: boolean;
  setIsSmartReminderModalOpen: (open: boolean) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;

  // Auth & Session
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileSetupModalOpen: boolean;
  setIsProfileSetupModalOpen: (open: boolean) => void;
  logout: () => void;
  handleAuthSuccess: (user: AuthUser, needsProfileSetup: boolean) => void;
  saveInitialProfileSetup: (profile: UserProfile, location: GlobalLocationState) => void;

  // Doctor Visit & Health Checklist
  updateDoctorVisit: (visit: NonNullable<UserProfile['nextDoctorVisit']>) => void;
  healthChecklist: { id: string; text: string; completed: boolean }[];
  toggleHealthChecklistItem: (id: string) => void;

  // Global Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage Keys
const STORAGE_KEY_PROFILE = 'pregnutri_user_profile_v3';
const STORAGE_KEY_MEALS = 'pregnutri_central_meals_v3';
const STORAGE_KEY_WATER = 'pregnutri_water_intake_v3';
const STORAGE_KEY_WATER_SETTINGS = 'pregnutri_water_settings_v3';
const STORAGE_KEY_LOGGED_MEALS = 'pregnutri_logged_meals_v3';
const STORAGE_KEY_WEIGHT = 'pregnutri_weight_records_v3';
const STORAGE_KEY_REPORTS = 'pregnutri_reports_v3';
const STORAGE_KEY_MEDS = 'pregnutri_medications_v3';
const STORAGE_KEY_TRIMESTER = 'pregnutri_selected_trimester_v3';
const STORAGE_KEY_DAY = 'pregnutri_selected_day_v3';
const STORAGE_KEY_CHECKLIST = 'pregnutri_health_checklist_v3';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 0. Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const active = authService.getActiveUser();
    if (active) {
      return {
        id: active.id,
        name: active.name,
        emailOrPhone: active.emailOrPhone,
        hasCompletedProfile: active.hasCompletedProfile,
        createdAt: active.createdAt
      };
    }
    return null;
  });

  const isAuthenticated = !!currentUser;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(!currentUser);
  const [isProfileSetupModalOpen, setIsProfileSetupModalOpen] = useState<boolean>(
    !!currentUser && !currentUser.hasCompletedProfile
  );

  // 1. Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');

  // 2. Global Location with synchronization
  const [globalLocation, setGlobalLocation] = useState<GlobalLocationState>(() =>
    GlobalLocationService.getLocation()
  );

  useEffect(() => {
    const unsubscribe = GlobalLocationService.subscribe((newLoc) => {
      setGlobalLocation(newLoc);
    });
    return () => unsubscribe();
  }, []);

  const updateLocation = (newLoc: GlobalLocationState) => {
    GlobalLocationService.setLocation(newLoc);
    setGlobalLocation(newLoc);
  };

  // Helper to sanitize any legacy cached profile from localStorage
  const sanitizeUserProfile = (profile: any): UserProfile => {
    if (!profile || typeof profile !== 'object') return INITIAL_USER_PROFILE;
    const sanitized = { ...INITIAL_USER_PROFILE, ...profile };
    if (
      sanitized.emergencyContact &&
      (sanitized.emergencyContact.includes('98765') ||
        sanitized.emergencyContact.includes('Rahul Sharma') ||
        sanitized.emergencyContact.includes('Family Emergency'))
    ) {
      sanitized.emergencyContact = '';
      sanitized.emergencyContactName = '';
      sanitized.emergencyContactPhone = '';
    }
    if (
      sanitized.doctorDetails?.name &&
      (sanitized.doctorDetails.name.includes('Sunita') || sanitized.doctorDetails.name.includes('Anita') || sanitized.doctorDetails.name.includes('Primary Obstetrician'))
    ) {
      sanitized.doctorDetails = {
        ...sanitized.doctorDetails,
        name: '',
        phone: '',
        hospital: ''
      };
    }
    if (
      sanitized.doctorDetails?.phone &&
      (sanitized.doctorDetails.phone.includes('2670 1122') || sanitized.doctorDetails.phone.includes('94480 12345'))
    ) {
      sanitized.doctorDetails = {
        ...sanitized.doctorDetails,
        phone: ''
      };
    }
    if (
      sanitized.doctorDetails?.hospital &&
      sanitized.doctorDetails.hospital.includes('Apollo')
    ) {
      sanitized.doctorDetails = {
        ...sanitized.doctorDetails,
        hospital: ''
      };
    }
    return sanitized;
  };

  // 3. User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return sanitizeUserProfile(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load profile', e);
    }
    return INITIAL_USER_PROFILE;
  });

  const updateUserProfile = (
    profileUpdate: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)
  ) => {
    setUserProfile((prev) => {
      const updated =
        typeof profileUpdate === 'function'
          ? profileUpdate(prev)
          : { ...prev, ...profileUpdate };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 4. Selected Trimester (synchronized with profile weeks pregnant by default)
  const defaultTrimester = useMemo<PregnancyTrimester>(() => {
    if (userProfile.weeksPregnant <= 12) return '1st Trimester';
    if (userProfile.weeksPregnant <= 27) return '2nd Trimester';
    return '3rd Trimester';
  }, [userProfile.weeksPregnant]);

  const [selectedTrimester, setSelectedTrimesterState] = useState<PregnancyTrimester>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIMESTER);
      if (saved === '1st Trimester' || saved === '2nd Trimester' || saved === '3rd Trimester') {
        return saved;
      }
    } catch (e) {}
    return defaultTrimester;
  });

  const setSelectedTrimester = (trimester: PregnancyTrimester) => {
    setSelectedTrimesterState(trimester);
    try {
      localStorage.setItem(STORAGE_KEY_TRIMESTER, trimester);
    } catch (e) {}
  };

  // 5. Selected Day of the Week (defaults to today's day or Wednesday)
  const getInitialDayOfWeek = (): DayOfWeek => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAY);
      if (saved && DAYS_OF_WEEK.includes(saved as DayOfWeek)) {
        return saved as DayOfWeek;
      }
      const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
      const dayMap: Record<number, DayOfWeek> = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
      };
      return dayMap[dayIndex] || 'Monday';
    } catch (e) {}
    return 'Monday';
  };

  const [selectedDay, setSelectedDayState] = useState<DayOfWeek>(getInitialDayOfWeek);

  const setSelectedDay = (day: DayOfWeek) => {
    setSelectedDayState(day);
    try {
      localStorage.setItem(STORAGE_KEY_DAY, day);
    } catch (e) {}
  };

  // 6. Central Planned Meals (across all 7 days)
  const [meals, setMeals] = useState<PlannedMeal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load meals from storage', e);
    }
    // Generate full, rich 7-day authentic meal schedule tailored to initial location (Karnataka)
    return LocationNutritionEngine.generateLocationMealPlan(
      GlobalLocationService.getLocation(),
      INITIAL_USER_PROFILE.dietPreference,
      '2nd Trimester'
    );
  });

  // Save meals to localStorage whenever updated
  const persistMeals = (updatedMeals: PlannedMeal[]) => {
    setMeals(updatedMeals);
    try {
      localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updatedMeals));
    } catch (e) {}
  };

  // 7. Regenerate location meal plan
  const regenerateLocationMealPlan = (
    locationOverride?: GlobalLocationState,
    trimesterOverride?: PregnancyTrimester
  ) => {
    const loc = locationOverride || globalLocation;
    const trim = trimesterOverride || selectedTrimester;
    const newPlan = LocationNutritionEngine.generateLocationMealPlan(
      loc,
      userProfile.dietPreference,
      trim
    );
    persistMeals(newPlan);
  };

  // 8. Add food to plan (Centralized handler)
  const addFoodToPlan = ({
    food,
    day,
    category,
    servings = 1,
    customPortion
  }: AddFoodToPlanPayload) => {
    const foodId = (food as any).id || `custom-${Date.now()}`;
    const foodName = (food as any).name;
    const foodRegionalName = (food as any).regionalName || '';
    const unitCal = (food as any).calories || 0;
    const unitProt = (food as any).protein || 0;
    const unitIr = (food as any).iron || 0;
    const unitCalc = (food as any).calcium || 0;
    const unitFol = (food as any).folate || 0;
    const portionStr = customPortion || (food as any).servingSize || `${servings} ${servings === 1 ? 'Serving' : 'Servings'}`;

    setMeals((prev) => {
      // Check if food already exists on the EXACT same day and meal category
      const existingIndex = prev.findIndex(
        (m) =>
          m.day === day &&
          m.category === category &&
          ((m.foodId && m.foodId === foodId) ||
            m.name.toLowerCase().trim() === foodName.toLowerCase().trim())
      );

      if (existingIndex >= 0) {
        // Increment servings of existing item
        const existing = prev[existingIndex];
        const newServings = (existing.servings || 1) + servings;
        const baseCal = existing.unitCalories || (existing.calories / (existing.servings || 1));
        const baseProt = existing.unitProtein || (existing.protein / (existing.servings || 1));
        const baseIr = existing.unitIron || (existing.iron / (existing.servings || 1));
        const baseCalc = existing.unitCalcium || (existing.calcium / (existing.servings || 1));
        const baseFol = existing.unitFolate || (existing.folate / (existing.servings || 1));

        const updatedMeal: PlannedMeal = {
          ...existing,
          servings: newServings,
          portion: `${newServings} Servings`,
          calories: Math.round(baseCal * newServings),
          protein: Number((baseProt * newServings).toFixed(1)),
          iron: Number((baseIr * newServings).toFixed(1)),
          calcium: Math.round(baseCalc * newServings),
          folate: Math.round(baseFol * newServings),
          unitCalories: baseCal,
          unitProtein: baseProt,
          unitIron: baseIr,
          unitCalcium: baseCalc,
          unitFolate: baseFol
        };

        const updated = [...prev];
        updated[existingIndex] = updatedMeal;
        try {
          localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }

      // Add new meal item
      const newMeal: PlannedMeal = {
        id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        day,
        category,
        name: foodName,
        portion: portionStr,
        calories: Math.round(unitCal * servings),
        protein: Number((unitProt * servings).toFixed(1)),
        iron: Number((unitIr * servings).toFixed(1)),
        calcium: Math.round(unitCalc * servings),
        folate: Math.round(unitFol * servings),
        isCompleted: false,
        foodId: foodId,
        servings: servings,
        unitCalories: unitCal,
        unitProtein: unitProt,
        unitIron: unitIr,
        unitCalcium: unitCalc,
        unitFolate: unitFol
      };

      const updated = [...prev, newMeal];
      try {
        localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 9. Remove meal
  const removeMeal = (mealId: string) => {
    setMeals((prev) => {
      const updated = prev.filter((m) => m.id !== mealId);
      try {
        localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 10. Update meal servings
  const updateMealServings = (mealId: string, servings: number) => {
    if (servings <= 0) {
      removeMeal(mealId);
      return;
    }
    setMeals((prev) => {
      const updated = prev.map((m) => {
        if (m.id !== mealId) return m;
        const currentServings = m.servings || 1;
        const baseCal = m.unitCalories || (m.calories / currentServings);
        const baseProt = m.unitProtein || (m.protein / currentServings);
        const baseIr = m.unitIron || (m.iron / currentServings);
        const baseCalc = m.unitCalcium || (m.calcium / currentServings);
        const baseFol = m.unitFolate || (m.folate / currentServings);

        return {
          ...m,
          servings,
          portion: `${servings} ${servings === 1 ? 'Serving' : 'Servings'}`,
          calories: Math.round(baseCal * servings),
          protein: Number((baseProt * servings).toFixed(1)),
          iron: Number((baseIr * servings).toFixed(1)),
          calcium: Math.round(baseCalc * servings),
          folate: Math.round(baseFol * servings),
          unitCalories: baseCal,
          unitProtein: baseProt,
          unitIron: baseIr,
          unitCalcium: baseCalc,
          unitFolate: baseFol
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 11. Toggle meal completed
  const toggleMealCompleted = (mealId: string) => {
    setMeals((prev) => {
      const updated = prev.map((m) =>
        m.id === mealId ? { ...m, isCompleted: !m.isCompleted } : m
      );
      try {
        localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 12. Clear day meals
  const clearDayMeals = (day: DayOfWeek) => {
    setMeals((prev) => {
      const updated = prev.filter((m) => m.day !== day);
      try {
        localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 13. Water intake & Reminder settings
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATER);
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 1750;
  });

  const updateWaterIntake = (amountMl: number) => {
    setWaterIntakeMl(amountMl);
    try {
      localStorage.setItem(STORAGE_KEY_WATER, String(amountMl));
    } catch (e) {}
    if (currentUser) {
      authService.saveUserWaterData(currentUser.id, amountMl);
    }
  };

  const [waterReminderSettings, setWaterReminderSettings] = useState<{
    enabled: boolean;
    intervalMinutes: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATER_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { enabled: true, intervalMinutes: 60 };
  });

  const updateWaterReminder = (settings: { enabled?: boolean; intervalMinutes?: number }) => {
    setWaterReminderSettings((prev) => {
      const updated = { ...prev, ...settings };
      try {
        localStorage.setItem(STORAGE_KEY_WATER_SETTINGS, JSON.stringify(updated));
      } catch (e) {}
      if (currentUser) {
        authService.saveUserWaterReminder(currentUser.id, updated);
      }
      return updated;
    });
  };

  // Auth Action Handlers
  const handleAuthSuccess = (user: AuthUser, needsProfileSetup: boolean) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (needsProfileSetup) {
      setIsProfileSetupModalOpen(true);
    } else {
      setIsProfileSetupModalOpen(false);
      // Load user profile & location from account
      const activeAccount = authService.getActiveUser();
      if (activeAccount?.profile) {
        setUserProfile(activeAccount.profile);
        if (activeAccount.location) {
          updateLocation(activeAccount.location);
        }
        if (activeAccount.waterIntakeMl !== undefined) {
          setWaterIntakeMl(activeAccount.waterIntakeMl);
        }
        if (activeAccount.waterReminderSettings) {
          setWaterReminderSettings(activeAccount.waterReminderSettings);
        }
      }
    }
  };

  const saveInitialProfileSetup = (profile: UserProfile, location: GlobalLocationState) => {
    if (currentUser) {
      authService.saveCompleteUserProfile(currentUser.id, profile, location);
      setCurrentUser({ ...currentUser, hasCompletedProfile: true });
    }
    setUserProfile(profile);
    updateLocation(location);
    setIsProfileSetupModalOpen(false);
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  // Next Doctor Visit Updater
  const updateDoctorVisit = (visit: NonNullable<UserProfile['nextDoctorVisit']>) => {
    updateUserProfile((prev) => ({
      ...prev,
      nextDoctorVisit: visit,
      doctorDetails: {
        ...prev.doctorDetails,
        name: visit.doctorName || prev.doctorDetails.name,
        hospital: visit.hospitalName || prev.doctorDetails.hospital,
        nextAppointmentDate: visit.date,
        nextAppointmentTime: visit.time
      }
    }));
  };

  // Health Checklist
  const DEFAULT_HEALTH_CHECKLIST = [
    { id: 'chk-1', text: 'Daily Prenatal Folic Acid & Iron tablet taken', completed: true },
    { id: 'chk-2', text: 'Drank at least 2.5 Litres of safe water', completed: false },
    { id: 'chk-3', text: '30-minute gentle maternal walk or doctor-approved yoga', completed: false },
    { id: 'chk-4', text: 'Consumed calcium & protein snack (Curd / Ragi / Paneer / Egg)', completed: false },
    { id: 'chk-5', text: 'Blood Pressure / Pulse normal & had 8 hours sleep', completed: true }
  ];

  const [healthChecklist, setHealthChecklist] = useState<{ id: string; text: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_HEALTH_CHECKLIST;
  });

  const toggleHealthChecklistItem = (id: string) => {
    setHealthChecklist((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      try {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 14. Scanned Logged Meals
  const [loggedMeals, setLoggedMeals] = useState<LoggedMealRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGGED_MEALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const addLoggedMeal = (meal: LoggedMealRecord) => {
    setLoggedMeals((prev) => {
      const updated = [meal, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_LOGGED_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteLoggedMeal = (mealId: string) => {
    setLoggedMeals((prev) => {
      const updated = prev.filter((m) => m.id !== mealId);
      try {
        localStorage.setItem(STORAGE_KEY_LOGGED_MEALS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 15. Clinical Weight Records
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEIGHT);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WEIGHT_RECORDS;
  });

  const addWeightRecord = (record: WeightRecord) => {
    setWeightRecords((prev) => {
      const updated = [...prev.filter((r) => r.week !== record.week), record].sort(
        (a, b) => a.week - b.week
      );
      try {
        localStorage.setItem(STORAGE_KEY_WEIGHT, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    updateUserProfile({
      currentWeightKg: record.weightKg,
      weeksPregnant: record.week
    });
  };

  // 16. Clinical Reports
  const [clinicalReports, setClinicalReports] = useState<ClinicalReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CLINICAL_REPORTS;
  });

  const addClinicalReport = (report: ClinicalReport) => {
    setClinicalReports((prev) => {
      const updated = [report, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 17. Medications & Supplements
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_MEDICATIONS;
  });

  const toggleMedicationTaken = (id: string) => {
    setMedications((prev) => {
      const updated = prev.map((med) =>
        med.id === id ? { ...med, isTakenToday: !med.isTakenToday } : med
      );
      try {
        localStorage.setItem(STORAGE_KEY_MEDS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addMedication = (med: Omit<MedicationItem, 'id'>) => {
    setMedications((prev) => {
      const updated = [...prev, { ...med, id: `med-${Date.now()}` }];
      try {
        localStorage.setItem(STORAGE_KEY_MEDS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 18. Global Add to Plan Modal state
  const [isAddToPlanModalOpen, setIsAddToPlanModalOpen] = useState<boolean>(false);
  const [modalTargetFood, setModalTargetFood] = useState<any | null>(null);
  const [modalPreselectedDay, setModalPreselectedDay] = useState<DayOfWeek | undefined>(undefined);
  const [modalPreselectedCategory, setModalPreselectedCategory] = useState<MealCategory | undefined>(undefined);

  const openAddToPlanModal = (food: any, day?: DayOfWeek, category?: MealCategory) => {
    setModalTargetFood(food);
    setModalPreselectedDay(day || selectedDay);
    setModalPreselectedCategory(category || 'Breakfast');
    setIsAddToPlanModalOpen(true);
  };

  const closeAddToPlanModal = () => {
    setIsAddToPlanModalOpen(false);
    setModalTargetFood(null);
    setModalPreselectedDay(undefined);
    setModalPreselectedCategory(undefined);
  };

  // 19. Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSmartReminderModalOpen, setIsSmartReminderModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // 20. Trimester ICMR RDA Targets
  const trimesterRdaTargets = useMemo<TrimesterRdaTargets>(() => {
    if (selectedTrimester === '1st Trimester') {
      return {
        trimester: '1st Trimester',
        calories: 2050,
        protein: 60,
        iron: 27,
        calcium: 1000,
        folate: 570,
        carbs: 290,
        fat: 40,
        fiber: 28,
        waterMl: 2500,
        keyNutrients: ['Folate (B9)', 'Bioavailable Iron', 'Vitamin B6', 'Digestible Protein', 'Hydration']
      };
    } else if (selectedTrimester === '3rd Trimester') {
      return {
        trimester: '3rd Trimester',
        calories: 2550,
        protein: 78,
        iron: 27,
        calcium: 1200,
        folate: 570,
        carbs: 360,
        fat: 50,
        fiber: 30,
        waterMl: 2700,
        keyNutrients: ['High Protein', 'Skeletal Calcium', 'Iron & Hemoglobin', 'Magnesium', 'Dietary Fiber']
      };
    }
    // Default 2nd Trimester
    return {
      trimester: '2nd Trimester',
      calories: 2350,
      protein: 68,
      iron: 27,
      calcium: 1000,
      folate: 570,
      carbs: 330,
      fat: 45,
      fiber: 28,
      waterMl: 2500,
      keyNutrients: ['Protein Matrix', 'Iron Stores', 'Bone Calcium', 'Vitamin D & Omega-3', 'Folate']
    };
  }, [selectedTrimester]);

  // 21. Centralized Nutrition Calculation for ANY day
  const getDayNutrition = (day: DayOfWeek): DayNutritionSummary => {
    const dayMeals = meals.filter((m) => m.day === day);

    let calories = 0;
    let protein = 0;
    let iron = 0;
    let calcium = 0;
    let folate = 0;
    let completedCount = 0;

    const mealsByCategory: Record<MealCategory, PlannedMeal[]> = {
      'Breakfast': [],
      'Mid-Morning Snack': [],
      'Lunch': [],
      'Evening Snack': [],
      'Dinner': []
    };

    dayMeals.forEach((m) => {
      calories += Number(m.calories) || 0;
      protein += Number(m.protein) || 0;
      iron += Number(m.iron) || 0;
      calcium += Number(m.calcium) || 0;
      folate += Number(m.folate) || 0;
      if (m.isCompleted) completedCount++;

      if (mealsByCategory[m.category]) {
        mealsByCategory[m.category].push(m);
      } else {
        mealsByCategory['Lunch'].push(m);
      }
    });

    const carbs = Number((protein * 2.8 + dayMeals.length * 20).toFixed(1));
    const fat = Number((protein * 0.6 + dayMeals.length * 4).toFixed(1));
    const fiber = Number((dayMeals.length * 4.5).toFixed(1));
    const vitC = Math.round(dayMeals.length * 12);
    const vitA = Math.round(dayMeals.length * 80);
    const vitB12 = Number((dayMeals.length * 0.4).toFixed(1));

    return {
      day,
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1)),
      iron: Number(iron.toFixed(1)),
      calcium: Math.round(calcium),
      folate: Math.round(folate),
      carbs,
      fat,
      fiber,
      vitC,
      vitA,
      vitB12,
      totalMealCount: dayMeals.length,
      completedMealCount: completedCount,
      mealsByCategory
    };
  };

  const getSelectedDayNutrition = (): DayNutritionSummary => {
    return getDayNutrition(selectedDay);
  };

  // 22. Centralized Weekly Nutrition Calculation
  const getWeeklyNutrition = (): WeeklyNutritionSummary => {
    const daysSummary: Record<DayOfWeek, DayNutritionSummary> = {} as any;
    let totalCal = 0;
    let totalProt = 0;
    let totalIr = 0;
    let totalCalc = 0;
    let totalFol = 0;
    let totalMeals = 0;
    let totalCompleted = 0;

    DAYS_OF_WEEK.forEach((d) => {
      const summary = getDayNutrition(d);
      daysSummary[d] = summary;
      totalCal += summary.calories;
      totalProt += summary.protein;
      totalIr += summary.iron;
      totalCalc += summary.calcium;
      totalFol += summary.folate;
      totalMeals += summary.totalMealCount;
      totalCompleted += summary.completedMealCount;
    });

    return {
      days: daysSummary,
      weeklyTotalCalories: Math.round(totalCal),
      weeklyAvgCalories: Math.round(totalCal / 7),
      weeklyAvgProtein: Number((totalProt / 7).toFixed(1)),
      weeklyAvgIron: Number((totalIr / 7).toFixed(1)),
      weeklyAvgCalcium: Math.round(totalCalc / 7),
      weeklyAvgFolate: Math.round(totalFol / 7),
      totalPlannedMeals: totalMeals,
      totalCompletedMeals: totalCompleted
    };
  };

  const resetAllData = () => {
    localStorage.clear();
    setUserProfile(INITIAL_USER_PROFILE);
    setMeals(INITIAL_MEAL_PLAN);
    setWaterIntakeMl(1750);
    setLoggedMeals([]);
    setWeightRecords(INITIAL_WEIGHT_RECORDS);
    setClinicalReports(INITIAL_CLINICAL_REPORTS);
    setMedications(INITIAL_MEDICATIONS);
    setSelectedTrimester('2nd Trimester');
    setSelectedDay('Monday');
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        updateUserProfile,
        globalLocation,
        setGlobalLocation: updateLocation,
        updateLocation,
        selectedTrimester,
        setSelectedTrimester,
        selectedDay,
        setSelectedDay,
        meals,
        addFoodToPlan,
        removeMeal,
        updateMealServings,
        toggleMealCompleted,
        clearDayMeals,
        regenerateLocationMealPlan,
        getDayNutrition,
        getSelectedDayNutrition,
        getWeeklyNutrition,
        trimesterRdaTargets,
        waterIntakeMl,
        updateWaterIntake,
        waterReminderSettings,
        updateWaterReminder,
        loggedMeals,
        addLoggedMeal,
        deleteLoggedMeal,
        weightRecords,
        addWeightRecord,
        clinicalReports,
        addClinicalReport,
        medications,
        toggleMedicationTaken,
        addMedication,
        isAddToPlanModalOpen,
        modalTargetFood,
        modalPreselectedDay,
        modalPreselectedCategory,
        openAddToPlanModal,
        closeAddToPlanModal,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSmartReminderModalOpen,
        setIsSmartReminderModalOpen,
        isSosModalOpen,
        setIsSosModalOpen,
        currentUser,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileSetupModalOpen,
        setIsProfileSetupModalOpen,
        logout,
        handleAuthSuccess,
        saveInitialProfileSetup,
        updateDoctorVisit,
        healthChecklist,
        toggleHealthChecklistItem,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
