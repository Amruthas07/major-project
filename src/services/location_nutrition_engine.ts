import { KaggleFoodItem, GlobalLocationState, PregnancyTrimester, PlannedMeal } from '../types';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from './kaggle_food_pipeline';
import { normalizeDietPreference, isFoodEligibleForDiet } from '../utils/diet_preference';
import { isMatchingState, normalizeStateName } from '../utils/state_food_filter';

export interface LocationRankingResult {
  items: KaggleFoodItem[];
  localCount: number;
  regionalCount: number;
  nationalCount: number;
  activeLocation: GlobalLocationState;
  trimester: PregnancyTrimester;
}

export class LocationNutritionEngine {
  /**
   * Filter and Rank Food Database with Strict Location & Trimester Priority
   * Enforces 100% strict state isolation: ONLY authentic dishes of user's state.
   */
  public static getRankedFoods(
    location: GlobalLocationState,
    trimester: PregnancyTrimester,
    dietPreference: string = 'Vegetarian',
    searchQuery: string = '',
    categoryFilter: string = 'All',
    safetyFilter: string = 'Safe'
  ): LocationRankingResult {
    let dataset = [...KAGGLE_PROCESSED_FOOD_DATABASE];

    // 1. STRICT STATE ISOLATION: Exclusively include foods verified for the user's active state
    const userTargetState = location.state || 'Karnataka';
    dataset = dataset.filter(item => isMatchingState(item.state, userTargetState));

    // 2. Strict Diet Preference filtering:
    // Vegetarian user -> ONLY 100% vegetarian foods (no meat, poultry, fish, seafood, eggs)
    // Non-Vegetarian user -> BOTH vegetarian and non-vegetarian foods
    const userDiet = normalizeDietPreference(dietPreference);
    if (userDiet === 'vegetarian') {
      dataset = dataset.filter(item => item.isVegetarian);
    }

    // 3. Filter by Safety Level
    if (safetyFilter !== 'All') {
      dataset = dataset.filter(item => item.safetyLevel === safetyFilter);
    }

    // 4. Filter by Category
    if (categoryFilter !== 'All') {
      dataset = dataset.filter(item => item.category === categoryFilter);
    }

    // 5. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      dataset = dataset.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.regionalName?.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(q)) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    const locationPlaceName = location.village || location.townOrVillage || location.city || location.district || userTargetState;

    const scoredItems: KaggleFoodItem[] = dataset.map(item => {
      let whyRecommended = `📍 Authentic traditional staple verified for ${userTargetState} (${locationPlaceName}). Freshly available and biologically optimized for your ${trimester}.`;

      // Trimester alignment boost
      if (item.trimesterRecommended === trimester || item.trimesterRecommended === 'All Trimesters') {
        whyRecommended += ` Particularly rich in ${item.tags.slice(0, 2).join(' and ')}.`;
      }

      return {
        ...item,
        recommendationPriority: 1,
        whyRecommended
      };
    });

    // Sort by Micronutrient Density (iron + protein + calcium)
    scoredItems.sort((a, b) => {
      const scoreA = a.iron * 2 + a.protein + (a.calcium / 50);
      const scoreB = b.iron * 2 + b.protein + (b.calcium / 50);
      return scoreB - scoreA;
    });

    return {
      items: scoredItems,
      localCount: scoredItems.length,
      regionalCount: 0,
      nationalCount: 0,
      activeLocation: location,
      trimester
    };
  }

  /**
   * Helper to derive Trimester from pregnancy weeks
   */
  public static getTrimesterFromWeeks(weeks: number): PregnancyTrimester {
    if (weeks <= 13) return '1st Trimester';
    if (weeks <= 27) return '2nd Trimester';
    return '3rd Trimester';
  }

  /**
   * Trimester Specific Clinical Nutrient Focus & Highlights
   * Dynamically tailored to the user's active Indian state & regional food culture
   */
  public static getTrimesterMealRecommendations(
    trimester: PregnancyTrimester,
    location: GlobalLocationState,
    dietPreference: string = 'Vegetarian'
  ) {
    const isStateKA = isMatchingState(location.state, 'Karnataka');
    const isStateTN = isMatchingState(location.state, 'Tamil Nadu');
    const isStateKL = isMatchingState(location.state, 'Kerala');
    const isStateAP = isMatchingState(location.state, 'Andhra Pradesh');
    const isStateTS = isMatchingState(location.state, 'Telangana');
    const isStatePY = isMatchingState(location.state, 'Puducherry');
    const isStateMH = isMatchingState(location.state, 'Maharashtra');

    if (trimester === '1st Trimester') {
      let dishes = [
        { name: 'Moong Dal Khichdi with Ghee & Lemon', category: 'Breakfast', calories: 290, protein: 9.5, iron: 3.6, calcium: 90, folate: 80, tags: ['High Folate', 'Digestible'] },
        { name: 'Sprouted Moong Chaat with Lemon & Rock Salt', category: 'Mid-Morning Snack', calories: 150, protein: 9.8, iron: 3.8, calcium: 55, folate: 115, tags: ['Vitamin B6', 'Folate Rich'] },
        { name: 'Methi Thepla with Fresh Homemade Curd', category: 'Lunch', calories: 390, protein: 13.5, iron: 5.2, calcium: 280, folate: 110, tags: ['Iron Rich', 'Probiotics'] },
        { name: 'Roasted Fox Nuts (Phool Makhana) + Lemon Water', category: 'Evening Snack', calories: 130, protein: 4.8, iron: 1.9, calcium: 110, folate: 22, tags: ['Low GI', 'Hydration'] },
        { name: 'Soft Palak Dal with Jeera Rice & Ghee', category: 'Dinner', calories: 410, protein: 14.8, iron: 5.6, calcium: 240, folate: 130, tags: ['Folate & Iron', 'Sustained Energy'] }
      ];

      if (isStateKA) {
        dishes = [
          { name: 'Steamed Akki Roti with Dill (Sabbasige Soppu) & Grated Carrots', category: 'Breakfast', calories: 280, protein: 6.2, iron: 3.8, calcium: 110, folate: 85, tags: ['High Folate', 'Digestible'] },
          { name: 'Hesaru Kaalu Kosambari (Sprouted Moong Salad with Lemon)', category: 'Mid-Morning Snack', calories: 145, protein: 9.2, iron: 3.5, calcium: 48, folate: 120, tags: ['Vitamin B6', 'Active Folate'] },
          { name: 'Ragi Dosa with Refreshing Mint-Coriander Chutney', category: 'Lunch', calories: 360, protein: 11.2, iron: 5.4, calcium: 320, folate: 95, tags: ['Calcium', 'Iron Rich'] },
          { name: 'Tender Coconut Water & Majjige (Spiced Ginger Buttermilk)', category: 'Evening Snack', calories: 95, protein: 3.8, iron: 1.2, calcium: 140, folate: 25, tags: ['Hydration', 'Electrolytes'] },
          { name: 'Soft Tomato Saar with Steamed Brown Rice & Sautéed Beans', category: 'Dinner', calories: 380, protein: 13.5, iron: 4.8, calcium: 210, folate: 78, tags: ['Easy Digestion', 'Vitamin C'] }
        ];
      } else if (isStateTN) {
        dishes = [
          { name: 'Steamed Ragi Idli with Murungai Keerai (Drumstick Leaf) Sambar', category: 'Breakfast', calories: 285, protein: 8.8, iron: 4.6, calcium: 240, folate: 90, tags: ['High Folate', 'Iron Booster'] },
          { name: 'Konda Kadalai (Black Chana) Sundal with Coconut & Curry Leaves', category: 'Mid-Morning Snack', calories: 170, protein: 9.5, iron: 3.8, calcium: 65, folate: 115, tags: ['Plant Protein', 'Vitamin B6'] },
          { name: 'Keerai Kootu (Spinach & Moong Dal) with Steamed Brown Rice', category: 'Lunch', calories: 410, protein: 15.2, iron: 6.2, calcium: 340, folate: 140, tags: ['Folate Dense', 'Easy Digestion'] },
          { name: 'Neer Mor (Spiced Buttermilk with Ginger & Curry Leaves)', category: 'Evening Snack', calories: 90, protein: 3.6, iron: 1.1, calcium: 150, folate: 22, tags: ['Hydration', 'Nausea Relief'] },
          { name: 'Paruppu Rasam with Steamed Rice & Sautéed Vazhaithandu (Banana Stem)', category: 'Dinner', calories: 375, protein: 12.8, iron: 4.5, calcium: 190, folate: 75, tags: ['Digestive Comfort', 'Fiber Matrix'] }
        ];
      } else if (isStateKL) {
        dishes = [
          { name: 'Steamed Puttu with Kadala (Black Chickpea) Curry', category: 'Breakfast', calories: 310, protein: 11.2, iron: 4.5, calcium: 110, folate: 95, tags: ['High Folate', 'Sustained Energy'] },
          { name: 'Cherupayar (Sprouted Green Moong) Steamed with Grated Coconut', category: 'Mid-Morning Snack', calories: 160, protein: 9.8, iron: 3.6, calcium: 55, folate: 118, tags: ['Nausea Relief', 'Bioavailable Iron'] },
          { name: 'Kerala Red Matta Rice with Moru Kachiyathu & Cheera (Amaranth) Thoran', category: 'Lunch', calories: 420, protein: 14.5, iron: 5.9, calcium: 290, folate: 130, tags: ['Active Iron', 'Probiotic Care'] },
          { name: 'Tender Elaneer (Coconut Water) with Roasted Makhana', category: 'Evening Snack', calories: 110, protein: 3.2, iron: 1.4, calcium: 80, folate: 28, tags: ['Electrolytes', 'Minerals'] },
          { name: 'Appam with Gentle Vegetable Stew (Coconut Milk & Mild Spices)', category: 'Dinner', calories: 390, protein: 10.8, iron: 3.8, calcium: 180, folate: 72, tags: ['Gentle Stomach', 'Healthy Fats'] }
        ];
      } else if (isStateAP) {
        dishes = [
          { name: 'Whole Green Gram Pesarattu with Ginger Chutney (Allam Pachadi)', category: 'Breakfast', calories: 295, protein: 13.5, iron: 4.2, calcium: 95, folate: 125, tags: ['High Folate', 'Nausea Relief'] },
          { name: 'Sprouted Bobbarlu (Black Eyed Peas) Chaat with Fresh Lemon', category: 'Mid-Morning Snack', calories: 165, protein: 10.2, iron: 3.9, calcium: 60, folate: 115, tags: ['Vitamin B6', 'Plant Iron'] },
          { name: 'Brown Rice with Palak Pappu (Spinach Dal) & Carrot Salad', category: 'Lunch', calories: 430, protein: 16.5, iron: 6.8, calcium: 310, folate: 150, tags: ['Hemoglobin Booster', 'Fiber'] },
          { name: 'Majjiga (Coriander Ginger Spiced Buttermilk)', category: 'Evening Snack', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, tags: ['Hydration', 'Cooling'] },
          { name: 'Ragi Sangati with Mild Tomato Pappu Charu', category: 'Dinner', calories: 400, protein: 13.8, iron: 5.2, calcium: 330, folate: 85, tags: ['High Calcium', 'Easy Digestion'] }
        ];
      } else if (isStateTS) {
        dishes = [
          { name: 'Sarva Pindi (Telangana Lentil & Rice Flatbread) with Mint Chutney', category: 'Breakfast', calories: 290, protein: 11.5, iron: 4.4, calcium: 110, folate: 95, tags: ['Iron Booster', 'Traditional Grain'] },
          { name: 'Makka Gudaalu (Boiled Sweetcorn & Bengal Gram Chaat)', category: 'Mid-Morning Snack', calories: 160, protein: 8.8, iron: 3.6, calcium: 55, folate: 110, tags: ['Fibre Rich', 'Vitamin B6'] },
          { name: 'Jonna Rotte (Sorghum Flatbread) with Menthi Kura Pappu', category: 'Lunch', calories: 425, protein: 15.8, iron: 6.5, calcium: 310, folate: 145, tags: ['High Iron', 'Low GI'] },
          { name: 'Spiced Telangana Majjiga with Curry Leaves & Hing', category: 'Evening Snack', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, tags: ['Hydration', 'Probiotic Care'] },
          { name: 'Pachi Pulusu with Steamed Rice & Toor Dal Mash', category: 'Dinner', calories: 395, protein: 13.2, iron: 4.9, calcium: 220, folate: 85, tags: ['Cooling Digestion', 'Antioxidants'] }
        ];
      } else if (isStatePY) {
        dishes = [
          { name: 'Idli (Puducherry Style) with Fresh Coconut & Tomato Chutney', category: 'Breakfast', calories: 275, protein: 8.4, iron: 3.6, calcium: 120, folate: 80, tags: ['Gentle Stomach', 'Digestible'] },
          { name: 'Creole Spiced Vegetable Broth with Pepper & Herbs', category: 'Mid-Morning Snack', calories: 95, protein: 4.2, iron: 2.8, calcium: 65, folate: 75, tags: ['Hydration', 'Vitamins'] },
          { name: 'Creole Vegetable Ragout with Steamed Rice', category: 'Lunch', calories: 410, protein: 13.8, iron: 5.8, calcium: 290, folate: 135, tags: ['Beta-Carotene', 'Fibre'] },
          { name: 'Tender Coconut Water & Fresh Fruit Bowl', category: 'Evening Snack', calories: 120, protein: 2.5, iron: 1.4, calcium: 70, folate: 35, tags: ['Electrolytes', 'Nausea Relief'] },
          { name: 'Idiyappam with Light Vegetable Stew in Coconut Milk', category: 'Dinner', calories: 385, protein: 10.5, iron: 3.9, calcium: 210, folate: 70, tags: ['Healthy Fats', 'Easy Digestion'] }
        ];
      } else if (isStateMH) {
        dishes = [
          { name: 'Nutrient-Dense Poha with Roasted Peanuts, Curry Leaves & Lemon', category: 'Breakfast', calories: 280, protein: 7.5, iron: 4.8, calcium: 85, folate: 65, tags: ['Iron Booster', 'Digestible'] },
          { name: 'Sprouted Matki (Moth Beans) Usal with Mild Spices & Lemon', category: 'Mid-Morning Snack', calories: 160, protein: 10.5, iron: 4.2, calcium: 58, folate: 120, tags: ['Folate Dense', 'Protein'] },
          { name: 'Jowar Bhakri with Methi Pithla & Cucumber Slices', category: 'Lunch', calories: 420, protein: 15.2, iron: 5.8, calcium: 310, folate: 125, tags: ['Bone Strength', 'Iron & Fiber'] },
          { name: 'Taak (Fresh Spiced Buttermilk) + Roasted Makhana', category: 'Evening Snack', calories: 125, protein: 4.5, iron: 1.6, calcium: 150, folate: 24, tags: ['Probiotic Care', 'Electrolytes'] },
          { name: 'Varan Bhaat with Pure Cow Ghee, Lemon & Steamed French Beans', category: 'Dinner', calories: 395, protein: 13.0, iron: 4.4, calcium: 190, folate: 80, tags: ['Comforting Meal', 'Nutrient Absorption'] }
        ];
      }

      return {
        trimester: '1st Trimester',
        keyPillars: ['Active Folate (B9)', 'Bioavailable Iron', 'Vitamin B6 (Nausea Relief)', 'Calcium Matrix', 'Hydration Support'],
        clinicalFocus: 'Crucial for neural tube development, embryonic cell division, blood volume expansion, and managing morning sickness.',
        calorieTarget: 2050,
        proteinTarget: 60,
        ironTarget: 27,
        calciumTarget: 1000,
        folateTarget: 570,
        recommendedDishes: dishes
      };
    } else if (trimester === '2nd Trimester') {
      let dishes = [
        { name: 'Palak Paneer with Whole Wheat Phulkas', category: 'Lunch', calories: 470, protein: 20.5, iron: 6.2, calcium: 440, folate: 150, tags: ['High Calcium', 'High Protein'] },
        { name: 'Sprouted Kala Chana Chaat with Tomatoes & Cucumber', category: 'Mid-Morning Snack', calories: 190, protein: 11.2, iron: 4.8, calcium: 90, folate: 130, tags: ['High Iron', 'High Fiber'] },
        { name: 'Mixed Dal Tadka with Brown Rice & Carrot Salad', category: 'Lunch', calories: 450, protein: 17.5, iron: 5.6, calcium: 180, folate: 120, tags: ['Complete Protein', 'Complex Carbs'] },
        { name: 'Walnuts & Almonds Trail Mix + Spiced Chaas', category: 'Evening Snack', calories: 210, protein: 7.8, iron: 2.8, calcium: 220, folate: 50, tags: ['Omega-3 Fatty Acids', 'Probiotics'] },
        { name: 'Multigrain Roti with Paneer Bhurji & Warm Haldi Milk', category: 'Dinner', calories: 460, protein: 19.2, iron: 4.9, calcium: 380, folate: 75, tags: ['Fetal Growth', 'Calcium Support'] }
      ];

      if (isStateKA) {
        dishes = [
          { name: 'Authentic Ragi Mudde with Amaranth Soppu Saaru', category: 'Lunch', calories: 460, protein: 15.5, iron: 7.2, calcium: 420, folate: 145, tags: ['High Calcium', 'Iron Booster'] },
          { name: 'Bisi Bele Bath with Sprouted Legumes & Mixed Country Vegetables', category: 'Lunch', calories: 430, protein: 16.2, iron: 5.8, calcium: 210, folate: 125, tags: ['Complex Protein', 'High Fiber'] },
          { name: 'Hesaru Kaalu Usli (Tempered Sprouted Moong with Coconut)', category: 'Mid-Morning Snack', calories: 175, protein: 10.5, iron: 4.1, calcium: 65, folate: 115, tags: ['Plant Protein', 'Iron Rich'] },
          { name: 'Curd Rice with Pomegranate & Roasted Flaxseeds (Omega-3)', category: 'Evening Snack', calories: 220, protein: 8.2, iron: 2.6, calcium: 280, folate: 45, tags: ['Omega-3', 'Calcium'] },
          { name: 'Jowar (Jolada) Roti with Yennegai & Bedtime Turmeric Milk', category: 'Dinner', calories: 440, protein: 16.8, iron: 5.9, calcium: 350, folate: 85, tags: ['Magnesium', 'Bone Strength'] }
        ];
      } else if (isStateTN) {
        dishes = [
          { name: 'Paruppu Urundai Kuzhambu with Red Rice & Murungai Keerai', category: 'Lunch', calories: 460, protein: 19.2, iron: 7.5, calcium: 390, folate: 155, tags: ['High Protein', 'Iron Booster'] },
          { name: 'Venn Pongal with Moong Dal & Pepper-Cumin Ghee Tempering', category: 'Breakfast', calories: 340, protein: 11.5, iron: 3.8, calcium: 140, folate: 85, tags: ['Comforting Energy', 'Digestive Care'] },
          { name: 'Navadhanya Sundal (Nine Legume Mix) with Fresh Coconut', category: 'Mid-Morning Snack', calories: 195, protein: 12.0, iron: 4.9, calcium: 95, folate: 140, tags: ['Multi-Nutrient', 'High Fiber'] },
          { name: 'Curd Rice with Pomegranate, Roasted Mustard & Curry Leaves', category: 'Evening Snack', calories: 215, protein: 8.0, iron: 2.2, calcium: 290, folate: 40, tags: ['Probiotic Care', 'Calcium Matrix'] },
          { name: 'Adai (Multi-Lentil Protein Crepe) with Avial (Mixed Vegetables)', category: 'Dinner', calories: 450, protein: 18.5, iron: 6.0, calcium: 320, folate: 110, tags: ['Fetal Growth', 'Balanced Macro'] }
        ];
      } else if (isStateKL) {
        dishes = [
          { name: 'Kerala Red Matta Rice with Parippu Curry, Ghee & Moringa Poduthu', category: 'Lunch', calories: 470, protein: 17.5, iron: 6.8, calcium: 360, folate: 145, tags: ['Fiber Matrix', 'Active Iron'] },
          { name: 'Steamed Nendran Banana with Handful of Roasted Peanuts', category: 'Mid-Morning Snack', calories: 190, protein: 6.5, iron: 2.8, calcium: 60, folate: 80, tags: ['Natural Energy', 'Potassium'] },
          { name: 'Erissery (Pumpkin & Red Cowpeas with Roasted Coconut)', category: 'Lunch', calories: 380, protein: 13.8, iron: 5.2, calcium: 230, folate: 120, tags: ['Beta-Carotene', 'Plant Protein'] },
          { name: 'Curd with Pomegranate Seeds & Soaked Chia Seeds', category: 'Evening Snack', calories: 180, protein: 7.8, iron: 2.1, calcium: 270, folate: 38, tags: ['Omega-3', 'Gut Microbiome'] },
          { name: 'Steamed Wheat Dosa with Cherupayar Curry & Warm Milk', category: 'Dinner', calories: 420, protein: 16.0, iron: 5.4, calcium: 340, folate: 95, tags: ['Bone Support', 'Restful Sleep'] }
        ];
      } else if (isStateAP) {
        dishes = [
          { name: 'Gongura Pappu with Steamed Brown Rice & Ghee', category: 'Lunch', calories: 460, protein: 17.2, iron: 7.4, calcium: 280, folate: 155, tags: ['High Iron', 'Vitamin C'] },
          { name: 'Upma Pesarattu with Fresh Allam Pachadi', category: 'Breakfast', calories: 330, protein: 14.5, iron: 4.8, calcium: 110, folate: 115, tags: ['Plant Protein', 'Sustained Energy'] },
          { name: 'Senagala Guggillu with Fresh Grated Coconut', category: 'Mid-Morning Snack', calories: 185, protein: 10.8, iron: 4.2, calcium: 75, folate: 120, tags: ['High Fiber', 'Iron Rich'] },
          { name: 'Curd Rice with Pomegranate & Crushed Flaxseeds', category: 'Evening Snack', calories: 210, protein: 8.0, iron: 2.2, calcium: 280, folate: 40, tags: ['Probiotic Care', 'Omega-3'] },
          { name: 'Ragi Sangati with Palakura Pappu (Spinach Dal)', category: 'Dinner', calories: 440, protein: 16.5, iron: 6.8, calcium: 380, folate: 140, tags: ['Calcium Matrix', 'Fetal Growth'] }
        ];
      } else if (isStateTS) {
        dishes = [
          { name: 'Jonna Rotte with Tomato Pappu & Palak', category: 'Lunch', calories: 450, protein: 16.8, iron: 6.9, calcium: 340, folate: 150, tags: ['Mineral Dense', 'Bone Health'] },
          { name: 'Sarva Pindi with Spiced Chana Dal & Sesame Seeds', category: 'Breakfast', calories: 320, protein: 12.2, iron: 5.1, calcium: 160, folate: 95, tags: ['Calcium Rich', 'Tradition'] },
          { name: 'Boiled Anumulu (Field Beans) Chaat with Rock Salt', category: 'Mid-Morning Snack', calories: 170, protein: 10.0, iron: 4.0, calcium: 70, folate: 115, tags: ['Fiber Matrix', 'Folate'] },
          { name: 'Curd Rice with Roasted Mustard & Pomegranate', category: 'Evening Snack', calories: 205, protein: 7.8, iron: 2.0, calcium: 275, folate: 38, tags: ['Digestive Care', 'Probiotics'] },
          { name: 'Sajja Rotte (Pearl Millet Flatbread) with Dal & Haldi Milk', category: 'Dinner', calories: 430, protein: 15.5, iron: 6.2, calcium: 330, folate: 90, tags: ['High Iron', 'Sustained Sleep'] }
        ];
      } else if (isStatePY) {
        dishes = [
          { name: 'Creole Vegetable Ragout with Steamed Red Rice', category: 'Lunch', calories: 440, protein: 14.5, iron: 6.2, calcium: 310, folate: 140, tags: ['Antioxidant Rich', 'Balanced Macro'] },
          { name: 'Appam (Puducherry Style) with Mild Coconut Stew', category: 'Breakfast', calories: 320, protein: 9.8, iron: 3.8, calcium: 160, folate: 85, tags: ['Easy Digestion', 'Healthy Fats'] },
          { name: 'Medu Vada (Puducherry Style) with Herb Chutney', category: 'Mid-Morning Snack', calories: 180, protein: 8.5, iron: 3.2, calcium: 65, folate: 75, tags: ['Protein Source', 'Satiety'] },
          { name: 'Thayir Sadam (Curd Rice) with Pomegranate Seeds', category: 'Evening Snack', calories: 215, protein: 8.2, iron: 2.1, calcium: 280, folate: 42, tags: ['Probiotic Matrix', 'Calcium'] },
          { name: 'Ratatouille with Whole Grain Flatbread & Badam Milk', category: 'Dinner', calories: 420, protein: 15.0, iron: 5.2, calcium: 320, folate: 85, tags: ['Fetal Growth', 'Restful Sleep'] }
        ];
      }

      return {
        trimester: '2nd Trimester',
        keyPillars: ['High Protein Growth', 'Iron & Hemoglobin Booster', 'Calcium Skeletal Matrix', 'Vitamin D & Omega-3', 'Fiber Synergy'],
        clinicalFocus: 'Peak fetal growth phase, bone calcification, red blood cell synthesis, and preventing maternal gestational constipation.',
        calorieTarget: 2350,
        proteinTarget: 68,
        ironTarget: 27,
        calciumTarget: 1000,
        folateTarget: 570,
        recommendedDishes: dishes
      };
    } else {
      // 3rd Trimester Focus
      let dishes = [
        { name: 'Bajra Roti with Methi Garlic Dal & Pure Ghee', category: 'Lunch', calories: 480, protein: 17.6, iron: 7.2, calcium: 310, folate: 120, tags: ['High Iron', 'Magnesium'] },
        { name: 'Dalia Khichdi with Mixed Vegetables & Paneer', category: 'Dinner', calories: 440, protein: 18.5, iron: 5.8, calcium: 340, folate: 110, tags: ['High Fiber', 'Steady Energy'] },
        { name: 'Rajma Curry with Brown Rice & Kachumber Salad', category: 'Lunch', calories: 490, protein: 21.0, iron: 6.9, calcium: 220, folate: 155, tags: ['High Protein', 'Blood Volume'] },
        { name: 'Roasted Foxnuts (Makhana) + Sesame Jaggery Til Chikki (1 pc)', category: 'Evening Snack', calories: 220, protein: 6.8, iron: 3.9, calcium: 290, folate: 40, tags: ['Natural Calcium', 'Iron'] },
        { name: 'Warm Cardamom Saffron Milk with Crushed Walnuts', category: 'Dinner', calories: 240, protein: 9.8, iron: 2.2, calcium: 370, folate: 38, tags: ['Omega-3 DHA', 'Restful Sleep'] }
      ];

      if (isStateKA) {
        dishes = [
          { name: 'Soft Jolada Roti with Hesaru Kaalu Palya & Cucumber Slices', category: 'Lunch', calories: 480, protein: 18.2, iron: 6.8, calcium: 340, folate: 115, tags: ['Magnesium Rich', 'Sustained Energy'] },
          { name: 'Nutrient-Dense Ragi Porridge (Ganji) with Milk & Almonds', category: 'Breakfast', calories: 340, protein: 12.8, iron: 5.9, calcium: 460, folate: 80, tags: ['Calcium Max', 'Stamina'] },
          { name: 'Mixed Vegetable Kootu with Drumstick (Moringa) & Toor Dal', category: 'Lunch', calories: 420, protein: 16.5, iron: 7.4, calcium: 380, folate: 160, tags: ['Iron Booster', 'Zinc & Folate'] },
          { name: 'Steamed Navane (Foxtail Millet) Pongal with Cow Ghee', category: 'Dinner', calories: 430, protein: 15.4, iron: 5.2, calcium: 210, folate: 95, tags: ['Low GI Energy', 'Easy Digestion'] },
          { name: 'Warm Haldi Badam Milk with Saffron before Bed', category: 'Dinner', calories: 230, protein: 9.5, iron: 2.1, calcium: 360, folate: 35, tags: ['Relaxation', 'Calcium Storage'] }
        ];
      } else if (isStateTN) {
        dishes = [
          { name: 'Murungai Keerai (Moringa) Soup with Cumin & Crushed Pepper', category: 'Mid-Morning Snack', calories: 95, protein: 5.4, iron: 7.2, calcium: 310, folate: 95, tags: ['Peak Iron', 'Cramp Prevention'] },
          { name: 'Ragi Kali with Drumstick Sambar & Curd', category: 'Lunch', calories: 470, protein: 16.8, iron: 7.8, calcium: 480, folate: 160, tags: ['Maximum Calcium', 'Stamina'] },
          { name: 'Kambu (Pearl Millet) Dosa with Mint Coriander Chutney', category: 'Breakfast', calories: 330, protein: 11.2, iron: 6.4, calcium: 210, folate: 110, tags: ['High Iron', 'Low Glycemic'] },
          { name: 'Sundal with Sesame Seeds & Roasted Flaxseed Powder', category: 'Evening Snack', calories: 210, protein: 10.5, iron: 4.8, calcium: 280, folate: 105, tags: ['Calcium Boost', 'Healthy Fats'] },
          { name: 'Warm Cow Milk with Saffron, Crushed Badam & Cardamom', category: 'Dinner', calories: 235, protein: 9.6, iron: 2.0, calcium: 370, folate: 35, tags: ['Skeletal Matrix', 'Labor Readiness'] }
        ];
      } else if (isStateKL) {
        dishes = [
          { name: 'Kerala Red Matta Rice with Parippu, Sambar & Avial', category: 'Lunch', calories: 470, protein: 18.0, iron: 7.2, calcium: 380, folate: 160, tags: ['Complete Meal', 'Active Minerals'] },
          { name: 'Steamed Ragi Puttu with Kadala Curry & Ghee', category: 'Breakfast', calories: 340, protein: 12.5, iron: 5.6, calcium: 280, folate: 105, tags: ['Calcium Rich', 'Labor Stamina'] },
          { name: 'Moringa Leaf Broth with Crushed Cumin & Garlic', category: 'Mid-Morning Snack', calories: 90, protein: 4.8, iron: 6.5, calcium: 260, folate: 90, tags: ['Peak Iron', 'Cramp Relief'] },
          { name: 'Cherupayar Steamed with Coconut & Flaxseeds', category: 'Evening Snack', calories: 190, protein: 10.2, iron: 4.0, calcium: 85, folate: 110, tags: ['Bioavailable Iron', 'Healthy Fats'] },
          { name: 'Appam with Light Vegetable Stew & Warm Badam Milk', category: 'Dinner', calories: 415, protein: 14.0, iron: 4.5, calcium: 350, folate: 80, tags: ['Gentle Sleep', 'Bone Support'] }
        ];
      } else if (isStateAP) {
        dishes = [
          { name: 'Ragi Sangati with Ulava Charu (Horse Gram) & Country Greens', category: 'Lunch', calories: 480, protein: 18.5, iron: 7.8, calcium: 440, folate: 160, tags: ['Peak Calcium', 'Hemoglobin'] },
          { name: 'Dibba Rotti with Sesame Jaggery & Chutney', category: 'Breakfast', calories: 340, protein: 11.8, iron: 5.8, calcium: 260, folate: 95, tags: ['Calcium Max', 'Stamina'] },
          { name: 'Murungai Pappu Charu with Steamed Brown Rice & Ghee', category: 'Dinner', calories: 430, protein: 16.0, iron: 7.2, calcium: 360, folate: 150, tags: ['Cramp Relief', 'Fetal Weight'] },
          { name: 'Senagala Guggillu with Sesame Seeds', category: 'Evening Snack', calories: 205, protein: 10.8, iron: 4.6, calcium: 190, folate: 100, tags: ['Plant Iron', 'Healthy Fats'] },
          { name: 'Warm Cow Milk with Turmeric, Saffron & Almonds', category: 'Dinner', calories: 230, protein: 9.5, iron: 2.1, calcium: 360, folate: 35, tags: ['Labor Readiness', 'Rest'] }
        ];
      } else if (isStateTS) {
        dishes = [
          { name: 'Jonna Rotte with Methi Garlic Dal & Desi Cow Ghee', category: 'Lunch', calories: 485, protein: 18.0, iron: 7.4, calcium: 360, folate: 145, tags: ['High Iron', 'Magnesium'] },
          { name: 'Sarva Pindi with Roasted Sesame Seeds & Peanuts', category: 'Breakfast', calories: 335, protein: 12.8, iron: 5.5, calcium: 280, folate: 90, tags: ['Calcium Rich', 'Stamina'] },
          { name: 'Pachi Pulusu with Steamed Rice & Palak Dal', category: 'Dinner', calories: 420, protein: 15.5, iron: 6.8, calcium: 340, folate: 140, tags: ['Digestive Comfort', 'Electrolytes'] },
          { name: 'Makka Gudaalu with Roasted Sesame & Cumin', category: 'Evening Snack', calories: 195, protein: 9.5, iron: 4.0, calcium: 150, folate: 105, tags: ['Fibre Density', 'Healthy Fats'] },
          { name: 'Warm Cardamom Milk with Crushed Badam before Bed', category: 'Dinner', calories: 235, protein: 9.6, iron: 2.0, calcium: 370, folate: 35, tags: ['Restful Sleep', 'Bone Calcification'] }
        ];
      } else if (isStatePY) {
        dishes = [
          { name: 'Creole Vegetable Ragout with Steamed Red Rice & Greens', category: 'Lunch', calories: 460, protein: 16.2, iron: 6.8, calcium: 340, folate: 150, tags: ['Peak Antioxidants', 'Stamina'] },
          { name: 'Puducherry Dosa with Mild Moringa Sambar & Coconut Chutney', category: 'Breakfast', calories: 330, protein: 11.5, iron: 5.2, calcium: 240, folate: 95, tags: ['Iron Booster', 'Easy Energy'] },
          { name: 'Steamed Idiyappam with Sweetened Coconut Extract', category: 'Evening Snack', calories: 210, protein: 6.5, iron: 3.2, calcium: 180, folate: 50, tags: ['Digestive Comfort', 'Hydration'] },
          { name: 'Medu Vada (Puducherry Style) with Herb Dal Soup', category: 'Mid-Morning Snack', calories: 185, protein: 9.0, iron: 3.8, calcium: 90, folate: 85, tags: ['Plant Protein', 'Satiety'] },
          { name: 'Semiya Payasam with Pure Cow Milk & Saffron before Bed', category: 'Dinner', calories: 240, protein: 9.8, iron: 2.2, calcium: 370, folate: 38, tags: ['Calcium Storage', 'Labor Readiness'] }
        ];
      }
      return {
        trimester: '3rd Trimester',
        focus: 'Optimal fetal brain and lung maturation, sustained energy, labor preparation, and rich iron/calcium stores.',
        calorieTarget: 2550,
        proteinTarget: 78,
        ironTarget: 27,
        calciumTarget: 1200,
        folateTarget: 570,
        recommendedDishes: dishes
      };
    }
  }

  /**
   * Generate an Authentic Location-Aware & Trimester-Aware 7-Day Meal Plan
   * Truly dynamically generated according to the user's specific Indian State
   */
  public static generateLocationMealPlan(
    location: GlobalLocationState,
    dietPreference: string = 'Vegetarian',
    trimester: PregnancyTrimester = '2nd Trimester'
  ): PlannedMeal[] {
    const isStateKA = isMatchingState(location.state, 'Karnataka');
    const isStateTN = isMatchingState(location.state, 'Tamil Nadu');
    const isStateKL = isMatchingState(location.state, 'Kerala');
    const isStateAP = isMatchingState(location.state, 'Andhra Pradesh');
    const isStateTS = isMatchingState(location.state, 'Telangana');
    const isStatePY = isMatchingState(location.state, 'Puducherry');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const allMeals: PlannedMeal[] = [];

    // 1. Karnataka 7-Day Template (Exclusively verified Karnataka dishes)
    const kaDayTemplates = [
      [
        { category: 'Breakfast', name: 'Steamed Akki Roti with Grated Carrots & Dill (Sabbasige Soppu)', portion: '2 rotis with mild coconut chutney', calories: 280, protein: 6.2, iron: 3.2, calcium: 95, folate: 48, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli (Sprouted Moong with Coconut)', portion: '1 bowl (120g)', calories: 155, protein: 9.8, iron: 3.8, calcium: 52, folate: 110, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Nutrient-Dense Soppu Saaru (Amaranth)', portion: '1 ball (150g) + 1 bowl broth + cucumber', calories: 440, protein: 14.5, iron: 6.8, calcium: 410, folate: 135, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Kadalekalu Usli (Tempered Bengal Gram with Mustard & Curry Leaves)', portion: '1 cup (140g)', calories: 190, protein: 10.2, iron: 4.1, calcium: 85, folate: 95, foodId: 'karnataka-kadalekalu-usli' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Hesaru Kaalu Palya & Warm Haldi Milk', portion: '2 rotis + 1 bowl palya + 1 glass milk', calories: 420, protein: 15.2, iron: 5.4, calcium: 330, folate: 75, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Davanagere Benne Dosa with Potato Palya', portion: '2 dosas + coconut chutney', calories: 310, protein: 8.2, iron: 3.6, calcium: 140, folate: 60, foodId: 'karnataka-davanagere-benne-dosa' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Kosambari (Sprouted Moong Salad with Lemon)', portion: '1 bowl (120g)', calories: 145, protein: 9.2, iron: 3.5, calcium: 48, folate: 120, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Legumes & Mixed Vegetables', portion: '1 plate (250g) + cucumber raita', calories: 460, protein: 16.8, iron: 6.2, calcium: 230, folate: 140, foodId: 'karnataka-bisi-bele-bath' },
        { category: 'Evening Snack', name: 'Spiced Majjige (Buttermilk) with Ginger & Curry Leaves', portion: '1 tall glass (250ml)', calories: 95, protein: 4.2, iron: 1.1, calcium: 180, folate: 20, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Dinner', name: 'Ragi Dosa with Mild Tomato Onion Chutney & Bedtime Milk', portion: '2 dosas + chutney + 1 glass milk', calories: 390, protein: 13.8, iron: 5.1, calcium: 340, folate: 68, foodId: 'karnataka-ragi-mudde' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Akki Shavige (Rice Vermicelli) with Mild Veggies', portion: '1 bowl (180g)', calories: 270, protein: 7.2, iron: 4.1, calcium: 120, folate: 48, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Yelakki Banana + Tender Coconut Water', portion: '1 banana + 1 glass coconut water', calories: 135, protein: 2.1, iron: 1.4, calcium: 40, folate: 35, foodId: 'karnataka-akki-roti' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Bassaru (Dill & Toor Dal Extract Saaru)', portion: '1 mudde ball + 1 bowl saaru + palya', calories: 450, protein: 15.2, iron: 7.1, calcium: 430, folate: 150, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Kadalekalu Usli with Grated Coconut & Rock Salt', portion: '1 cup (130g)', calories: 180, protein: 9.8, iron: 3.9, calcium: 80, folate: 90, foodId: 'karnataka-kadalekalu-usli' },
        { category: 'Dinner', name: 'Jolada Roti with Country Greens Palya & Milk', portion: '2 rotis + 1 cup palya + 1 glass milk', calories: 410, protein: 16.0, iron: 5.8, calcium: 350, folate: 90, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Foxtail Millet (Navane) Upma with Peas & Carrots', portion: '1 bowl (200g)', calories: 275, protein: 7.8, iron: 3.5, calcium: 70, folate: 52, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli with Squeezed Lemon & Coconut', portion: '1 cup (120g)', calories: 155, protein: 9.6, iron: 3.7, calcium: 50, folate: 110, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Peas, Beans & Cucumber Salad', portion: '1 plate (250g) + raita', calories: 465, protein: 17.2, iron: 6.0, calcium: 220, folate: 135, foodId: 'karnataka-bisi-bele-bath' },
        { category: 'Evening Snack', name: 'Fresh Seasonal Fruit Bowl with Tender Coconut Water', portion: '1 bowl fruits + 1 glass coconut water', calories: 140, protein: 3.0, iron: 1.5, calcium: 60, folate: 35, foodId: 'karnataka-akki-roti' },
        { category: 'Dinner', name: 'Jolada Roti with Stuffed Brinjal (Ennegayi) & Turmeric Milk', portion: '2 rotis + 1 bowl ennegayi + 1 glass milk', calories: 430, protein: 15.6, iron: 5.2, calcium: 320, folate: 80, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Akki Roti with Sautéed Ridge Gourd (Heerekai) Chutney', portion: '2 rotis + chutney', calories: 290, protein: 6.8, iron: 3.4, calcium: 105, folate: 50, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Kosambari with Grated Carrots', portion: '1 cup (130g)', calories: 165, protein: 10.2, iron: 4.0, calcium: 58, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Ragi Mudde with Amaranth Leaf Sambar & Boiled Beetroot', portion: '1 ball + 1 bowl sambar + salad', calories: 450, protein: 14.8, iron: 7.5, calcium: 420, folate: 155, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Kadalekalu Usli with Hing and Curry Leaf Tempering', portion: '1 cup', calories: 185, protein: 10.0, iron: 3.8, calcium: 82, folate: 92, foodId: 'karnataka-kadalekalu-usli' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Moong Dal Palya & Warm Haldi Milk', portion: '2 rotis + 1 bowl dal + 1 glass milk', calories: 415, protein: 15.0, iron: 5.1, calcium: 325, folate: 72, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Chitranna (Lemon Rice with Peanuts & Curry Leaves)', portion: '1 plate (220g)', calories: 330, protein: 7.5, iron: 3.2, calcium: 65, folate: 55, foodId: 'karnataka-chitranna-lemon-rice-with-peanuts' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Handful of Roasted Peanuts', portion: '1 glass coconut water + 25g peanuts', calories: 170, protein: 6.5, iron: 2.0, calcium: 50, folate: 50, foodId: 'karnataka-chitranna-lemon-rice-with-peanuts' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Sopinna Saaru & Cucumber', portion: '1 ball + 1 bowl saaru + salad', calories: 440, protein: 14.5, iron: 7.2, calcium: 430, folate: 150, foodId: 'karnataka_02' },
        { category: 'Evening Snack', name: 'Spiced Majjige with Ginger, Asafoetida & Rock Salt', portion: '1 tall glass (250ml)', calories: 90, protein: 4.0, iron: 1.0, calcium: 175, folate: 18, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Hesaru Kaalu Palya & Bedtime Milk', portion: '2 rotis + 1 bowl palya + 1 glass milk', calories: 420, protein: 15.2, iron: 5.4, calcium: 330, folate: 75, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Akki Roti with Fenugreek Greens (Menthya Soppu)', portion: '2 rotis with mild chutney', calories: 285, protein: 7.5, iron: 4.8, calcium: 140, folate: 95, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli with Grated Coconut & Lemon', portion: '1 bowl (120g)', calories: 150, protein: 9.5, iron: 3.6, calcium: 50, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Legumes & Mixed Vegetables', portion: '1 plate (250g) + cucumber raita', calories: 460, protein: 16.8, iron: 6.2, calcium: 230, folate: 140, foodId: 'karnataka_01' },
        { category: 'Evening Snack', name: 'Kadalekalu Usli with Mustard & Fresh Coconut', portion: '1 cup (140g)', calories: 190, protein: 10.2, iron: 4.1, calcium: 85, folate: 95, foodId: 'karnataka-kadalekalu-usli' },
        { category: 'Dinner', name: 'Mysore Rasam with Steamed Rice, Sautéed Beans & Milk', portion: '1 bowl rasam rice + beans + milk', calories: 405, protein: 13.5, iron: 4.8, calcium: 310, folate: 72, foodId: 'karnataka-akki-roti' }
      ]
    ];

    // 2. Tamil Nadu 7-Day Template (Exclusively verified Tamil Nadu dishes)
    const tnDayTemplates = [
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Murungai Keerai (Drumstick Leaf) Sambar', portion: '3 idlis + 1 cup sambar', calories: 285, protein: 8.8, iron: 4.6, calcium: 240, folate: 90, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Konda Kadalai (Black Chickpea) Sundal with Coconut', portion: '1 cup (130g)', calories: 175, protein: 9.8, iron: 4.2, calcium: 70, folate: 115, foodId: 'tn-sundal' },
        { category: 'Lunch', name: 'Keerai Kootu (Spinach & Moong Dal) with Brown Rice & Ghee', portion: '1 plate rice + 1 cup kootu + cucumber', calories: 440, protein: 16.2, iron: 6.8, calcium: 360, folate: 155, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Neer Mor (Spiced Buttermilk with Ginger & Hing)', portion: '1 tall glass (250ml)', calories: 90, protein: 3.6, iron: 1.1, calcium: 150, folate: 22, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Soft Adai (Multi-Lentil Dosa) with Avial & Bedtime Milk', portion: '2 adais + 1 cup avial + 1 glass milk', calories: 430, protein: 18.0, iron: 5.8, calcium: 340, folate: 85, foodId: 'tn-keerai-kootu' }
      ],
      [
        { category: 'Breakfast', name: 'Venn Pongal with Moong Dal & Coconut Chutney', portion: '1 bowl pongal + chutney', calories: 310, protein: 9.8, iron: 3.9, calcium: 110, folate: 72, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Warm Murungai Keerai Soup with Cumin & Pepper', portion: '1 cup (200ml)', calories: 95, protein: 5.4, iron: 7.2, calcium: 310, folate: 95, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Paruppu Urundai Kuzhambu with Red Rice & Murungai Keerai', portion: '1 plate rice + kuzhambu', calories: 460, protein: 19.2, iron: 7.5, calcium: 390, folate: 155, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Green Moong Sundal with Mustard & Curry Leaf Tempering', portion: '1 cup (120g)', calories: 165, protein: 10.0, iron: 3.7, calcium: 55, folate: 110, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Ragi Dosa with Mild Vegetable Sambar & Warm Haldi Milk', portion: '2 dosas + sambar + 1 glass milk', calories: 400, protein: 14.5, iron: 5.2, calcium: 350, folate: 78, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Kambu (Pearl Millet) Dosa with Mint Coriander Chutney', portion: '2 dosas + chutney', calories: 290, protein: 9.2, iron: 5.8, calcium: 160, folate: 80, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Konda Kadalai Sundal with Fresh Coconut', portion: '1 cup (130g)', calories: 175, protein: 9.8, iron: 4.2, calcium: 70, folate: 115, foodId: 'tn-sundal' },
        { category: 'Lunch', name: 'Ragi Kali with Drumstick Sambar & Curd', portion: '1 kali ball + sambar + curd', calories: 470, protein: 16.8, iron: 7.8, calcium: 480, folate: 160, foodId: 'tamilnadu_01' },
        { category: 'Evening Snack', name: 'Neer Mor with Curry Leaves & Mustard', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.0, calcium: 145, folate: 20, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Steamed Idiyappam with Coconut Milk & Mild Veg Stew', portion: '3 idiyappam + stew', calories: 395, protein: 11.0, iron: 3.9, calcium: 210, folate: 65, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Sambar & Coriander Chutney', portion: '3 idlis + sambar', calories: 280, protein: 8.6, iron: 4.4, calcium: 230, folate: 85, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Murungai Keerai Broth with Crushed Cumin', portion: '1 cup (200ml)', calories: 90, protein: 5.0, iron: 6.8, calcium: 290, folate: 90, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Keerai Sambar with Red Rice & Poriyal', portion: '1 plate rice + sambar + poriyal', calories: 450, protein: 16.5, iron: 6.9, calcium: 350, folate: 150, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Navadhanya Sundal with Grated Coconut', portion: '1 cup', calories: 195, protein: 12.0, iron: 4.9, calcium: 95, folate: 140, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Adai with Avial & Warm Saffron Milk', portion: '2 adais + avial + milk', calories: 435, protein: 18.0, iron: 5.9, calcium: 350, folate: 82, foodId: 'tn-keerai-kootu' }
      ],
      [
        { category: 'Breakfast', name: 'Venn Pongal with Pepper-Cumin Ghee Tempering', portion: '1 bowl + chutney', calories: 310, protein: 9.8, iron: 3.9, calcium: 110, folate: 72, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sundal with Sesame Seeds & Fresh Lemon', portion: '1 bowl', calories: 170, protein: 9.5, iron: 4.0, calcium: 75, folate: 110, foodId: 'tn-sundal' },
        { category: 'Lunch', name: 'Paruppu Sadam with Ghee, Rasam & Beans Usili', portion: '1 plate rice + rasam + usili', calories: 460, protein: 17.5, iron: 6.8, calcium: 320, folate: 145, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Neer Mor (Spiced Buttermilk with Ginger)', portion: '1 tall glass', calories: 90, protein: 3.6, iron: 1.1, calcium: 150, folate: 22, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Ragi Dosa with Tomato Chutney & Bedtime Cardamom Milk', portion: '2 dosas + chutney + milk', calories: 405, protein: 14.8, iron: 5.3, calcium: 360, folate: 75, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Kambu Dosa with Mint Chutney & Sambar', portion: '2 dosas + sambar', calories: 290, protein: 9.2, iron: 5.8, calcium: 160, folate: 80, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Warm Murungai Keerai Soup', portion: '1 cup', calories: 95, protein: 5.4, iron: 7.2, calcium: 310, folate: 95, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Ragi Kali with Keerai Kootu & Curd', portion: '1 kali ball + kootu + curd', calories: 470, protein: 16.8, iron: 7.8, calcium: 480, folate: 160, foodId: 'tamilnadu_01' },
        { category: 'Evening Snack', name: 'Chana Sundal with Coconut & Curry Leaves', portion: '1 cup', calories: 180, protein: 10.2, iron: 4.0, calcium: 80, folate: 105, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Idiyappam with Coconut Milk & Bedtime Milk', portion: '3 idiyappams + milk', calories: 390, protein: 10.8, iron: 3.8, calcium: 240, folate: 65, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Murungai Keerai Sambar', portion: '3 idlis + sambar', calories: 285, protein: 8.8, iron: 4.6, calcium: 240, folate: 90, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sundal with Sesame Seeds & Roasted Flaxseed Powder', portion: '1 cup', calories: 210, protein: 10.5, iron: 4.8, calcium: 280, folate: 105, foodId: 'tn-sundal' },
        { category: 'Lunch', name: 'Paruppu Urundai Kuzhambu with Steamed Red Rice', portion: '1 plate rice + kuzhambu', calories: 460, protein: 19.2, iron: 7.5, calcium: 390, folate: 155, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Neer Mor with Hing & Curry Leaves', portion: '1 glass', calories: 90, protein: 3.6, iron: 1.1, calcium: 150, folate: 22, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Warm Cow Milk with Saffron, Crushed Badam & Cardamom', portion: '1 glass milk + 2 phulkas', calories: 410, protein: 15.5, iron: 4.8, calcium: 370, folate: 70, foodId: 'tn-ragi-idli' }
      ]
    ];

    // 3. Kerala 7-Day Template (Exclusively verified Kerala dishes)
    const klDayTemplates = [
      [
        { category: 'Breakfast', name: 'Steamed Puttu with Kadala (Black Chickpea) Curry', portion: '1 portion puttu + 1 bowl kadala', calories: 310, protein: 11.5, iron: 4.6, calcium: 120, folate: 98, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Steamed Nendran Banana with Handful of Roasted Peanuts', portion: '1 banana + 20g peanuts', calories: 175, protein: 5.8, iron: 2.2, calcium: 55, folate: 65, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Kerala Red Matta Rice with Moru Kachiyathu & Cheera (Amaranth) Thoran', portion: '1 plate rice + moru curry + thoran', calories: 440, protein: 15.0, iron: 6.4, calcium: 320, folate: 140, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Tender Elaneer (Coconut Water) + Roasted Peanuts', portion: '1 glass coconut water + peanuts', calories: 140, protein: 4.5, iron: 1.8, calcium: 75, folate: 32, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Soft Appam with Light Vegetable Stew (Coconut Milk & Carrots)', portion: '2 appams + 1 bowl stew + milk', calories: 410, protein: 12.5, iron: 4.2, calcium: 290, folate: 78, foodId: 'kerala_01' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Idiyappam with Gentle Green Pea & Coconut Curry', portion: '3 idiyappams + curry', calories: 295, protein: 10.2, iron: 4.1, calcium: 140, folate: 85, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Cherupayar (Green Moong) Steamed with Grated Coconut', portion: '1 bowl (120g)', calories: 160, protein: 9.8, iron: 3.7, calcium: 58, folate: 115, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Matta Rice with Parippu Curry, Cow Ghee & Cabbage Thoran', portion: '1 plate rice + dal + thoran', calories: 455, protein: 16.8, iron: 6.8, calcium: 310, folate: 145, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Fresh Sambharam (Spiced Ginger Buttermilk)', portion: '1 glass buttermilk', calories: 85, protein: 3.5, iron: 1.0, calcium: 150, folate: 20, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Wheat Dosa with Tomato Chutney & Bedtime Turmeric Milk', portion: '2 dosas + chutney + 1 glass milk', calories: 405, protein: 14.5, iron: 5.0, calcium: 340, folate: 75, foodId: 'kerala_01' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Puttu with Kadala Curry', portion: '1 portion ragi puttu + kadala', calories: 305, protein: 11.2, iron: 5.2, calcium: 240, folate: 95, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Steamed Nendran Banana with Cinnamon', portion: '1 ripe banana', calories: 130, protein: 2.1, iron: 1.8, calcium: 40, folate: 45, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Red Matta Rice with Sambar, Beans Thoran & Homemade Curd', portion: '1 plate rice + sambar + thoran + curd', calories: 450, protein: 16.2, iron: 6.5, calcium: 340, folate: 150, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Elaneer (Tender Coconut Water)', portion: '1 glass', calories: 95, protein: 2.0, iron: 1.2, calcium: 65, folate: 25, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Appam with Gentle Vegetable Stew & Warm Milk', portion: '2 appams + stew + 1 glass milk', calories: 410, protein: 13.0, iron: 4.4, calcium: 310, folate: 76, foodId: 'kerala_01' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Dosa with Coconut Chutney & Sambar', portion: '2 dosas + sambar', calories: 280, protein: 8.6, iron: 3.8, calcium: 130, folate: 65, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Cherupayar Steamed with Grated Coconut & Lemon', portion: '1 bowl', calories: 155, protein: 9.6, iron: 3.5, calcium: 55, folate: 110, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Matta Rice with Erissery (Pumpkin & Cowpeas with Roasted Coconut)', portion: '1 plate rice + erissery', calories: 460, protein: 16.5, iron: 6.9, calcium: 320, folate: 145, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Fresh Sambharam with Curry Leaves', portion: '1 glass', calories: 85, protein: 3.4, iron: 1.0, calcium: 145, folate: 20, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Wheat Phulkas with Dal & Thoran & Bedtime Milk', portion: '2 phulkas + dal + thoran + milk', calories: 420, protein: 15.8, iron: 5.2, calcium: 340, folate: 82, foodId: 'kerala_01' }
      ],
      [
        { category: 'Breakfast', name: 'Puttu with Steamed Cherupayar & Grated Coconut', portion: '1 puttu + cherupayar', calories: 310, protein: 12.0, iron: 4.5, calcium: 115, folate: 98, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Moringa Leaf Broth with Crushed Cumin & Garlic', portion: '1 cup', calories: 90, protein: 4.8, iron: 6.5, calcium: 260, folate: 90, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Matta Rice with Cheera Sambar & Beetroot Thoran', portion: '1 plate rice + sambar + thoran', calories: 445, protein: 15.8, iron: 7.2, calcium: 360, folate: 155, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Steamed Nendran Banana', portion: '1 banana', calories: 130, protein: 2.1, iron: 1.8, calcium: 40, folate: 45, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Wheat Dosa with Dal Stew & Bedtime Cardamom Milk', portion: '2 dosas + stew + 1 glass milk', calories: 415, protein: 14.8, iron: 4.8, calcium: 350, folate: 78, foodId: 'kerala_01' }
      ],
      [
        { category: 'Breakfast', name: 'Idiyappam with Mild Kadala Curry', portion: '3 idiyappams + kadala', calories: 295, protein: 10.8, iron: 4.3, calcium: 135, folate: 88, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Elaneer (Tender Coconut Water)', portion: '1 glass', calories: 95, protein: 2.0, iron: 1.2, calcium: 65, folate: 25, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Matta Rice with Moru Kachiyathu, Ghee & Beans Thoran', portion: '1 plate rice + moru curry + thoran', calories: 440, protein: 14.8, iron: 6.0, calcium: 310, folate: 135, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Cherupayar Steamed with Coconut', portion: '1 bowl', calories: 155, protein: 9.6, iron: 3.5, calcium: 55, folate: 110, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Appam with Vegetable Stew & Warm Haldi Milk', portion: '2 appams + stew + 1 glass milk', calories: 420, protein: 13.5, iron: 4.5, calcium: 330, folate: 80, foodId: 'kerala_01' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Puttu with Kadala Curry & Banana Slices', portion: '1 puttu + kadala + banana', calories: 320, protein: 11.8, iron: 4.8, calcium: 125, folate: 100, foodId: 'kerala_01' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water with Flesh', portion: '1 glass', calories: 110, protein: 2.5, iron: 1.4, calcium: 70, folate: 30, foodId: 'kerala_01' },
        { category: 'Lunch', name: 'Kerala Sadya Style Matta Rice with Parippu, Sambar & Avial', portion: '1 plate rice + parippu + sambar + avial', calories: 470, protein: 18.0, iron: 7.2, calcium: 380, folate: 160, foodId: 'kerala_01' },
        { category: 'Evening Snack', name: 'Sambharam with Ginger & Curry Leaves', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.0, calcium: 150, folate: 20, foodId: 'kerala_01' },
        { category: 'Dinner', name: 'Wheat Phulkas with Vegetable Stew & Bedtime Badam Milk', portion: '2 phulkas + stew + 1 glass milk', calories: 430, protein: 15.5, iron: 4.9, calcium: 360, folate: 80, foodId: 'kerala_01' }
      ]
    ];

    // 4. Andhra Pradesh 7-Day Template (Exclusively verified Andhra dishes)
    const apDayTemplates = [
      [
        { category: 'Breakfast', name: 'Whole Green Gram Pesarattu with Allam Pachadi', portion: '2 pesarattus + ginger chutney', calories: 295, protein: 13.5, iron: 4.2, calcium: 95, folate: 125, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Bobbarlu (Black Eyed Peas) Chaat with Lemon', portion: '1 bowl (120g)', calories: 165, protein: 10.2, iron: 3.9, calcium: 60, folate: 115, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Brown Rice with Palak Pappu (Spinach Dal) & Carrot Salad', portion: '1 cup rice + 1 cup dal + salad', calories: 430, protein: 16.5, iron: 6.8, calcium: 310, folate: 150, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Majjiga (Coriander Ginger Spiced Buttermilk)', portion: '1 tall glass', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Ragi Sangati with Mild Tomato Pappu Charu & Ghee', portion: '1 sangati ball + charu + milk', calories: 410, protein: 14.2, iron: 5.5, calcium: 340, folate: 85, foodId: 'andhra_01' }
      ],
      [
        { category: 'Breakfast', name: 'Upma Pesarattu with Fresh Coconut Chutney', portion: '2 pesarattus with upma filling', calories: 330, protein: 14.5, iron: 4.8, calcium: 110, folate: 115, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Senagala Guggillu with Fresh Grated Coconut', portion: '1 cup (130g)', calories: 185, protein: 10.8, iron: 4.2, calcium: 75, folate: 120, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Gongura Pappu with Steamed Rice & Pure Cow Ghee', portion: '1 plate rice + dal + ghee', calories: 460, protein: 17.2, iron: 7.4, calcium: 280, folate: 155, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Majjiga with Rock Salt & Asafoetida', portion: '1 glass', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Jonna Rotti with Dal Mash & Warm Haldi Milk', portion: '2 rottis + dal + milk', calories: 420, protein: 15.5, iron: 5.8, calcium: 330, folate: 80, foodId: 'andhra_01' }
      ],
      [
        { category: 'Breakfast', name: 'Dibba Rotti with Sesame Jaggery & Chutney', portion: '1 thick slice + chutney', calories: 320, protein: 10.5, iron: 4.5, calcium: 180, folate: 85, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Lemon & Rock Salt', portion: '1 bowl', calories: 150, protein: 9.8, iron: 3.8, calcium: 55, folate: 115, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Ragi Sangati with Ulava Charu & Country Greens', portion: '1 ball + charu + greens', calories: 480, protein: 18.5, iron: 7.8, calcium: 440, folate: 160, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Senagala Guggillu with Sesame Seeds', portion: '1 cup', calories: 195, protein: 10.5, iron: 4.4, calcium: 110, folate: 100, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Pappu Charu with Steamed Brown Rice & Curd', portion: '1 plate rice + charu + curd', calories: 415, protein: 14.8, iron: 5.2, calcium: 320, folate: 85, foodId: 'andhra_01' }
      ],
      [
        { category: 'Breakfast', name: 'Whole Green Gram Pesarattu with Ginger Chutney', portion: '2 pesarattus', calories: 295, protein: 13.5, iron: 4.2, calcium: 95, folate: 125, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Bobbarlu Chaat with Fresh Lemon', portion: '1 bowl', calories: 165, protein: 10.2, iron: 3.9, calcium: 60, folate: 115, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Brown Rice with Palak Pappu & Beetroot Vepudu', portion: '1 plate rice + dal + vepudu', calories: 445, protein: 16.8, iron: 7.0, calcium: 320, folate: 150, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Majjiga with Ginger & Coriander', portion: '1 glass', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Ragi Sangati with Tomato Pappu & Milk', portion: '1 ball + dal + milk', calories: 420, protein: 15.0, iron: 5.6, calcium: 340, folate: 85, foodId: 'andhra_01' }
      ],
      [
        { category: 'Breakfast', name: 'Upma Pesarattu with Allam Pachadi', portion: '2 pesarattus', calories: 330, protein: 14.5, iron: 4.8, calcium: 110, folate: 115, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Senagala Guggillu with Mustard Tempering', portion: '1 cup', calories: 180, protein: 10.5, iron: 4.0, calcium: 70, folate: 110, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Gongura Pappu with Brown Rice & Curd', portion: '1 plate rice + dal + curd', calories: 450, protein: 16.5, iron: 7.2, calcium: 310, folate: 150, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Majjiga with Rock Salt', portion: '1 glass', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Jonna Rotti with Menthi Pappu & Bedtime Milk', portion: '2 rottis + dal + milk', calories: 425, protein: 15.8, iron: 5.9, calcium: 340, folate: 85, foodId: 'andhra_01' }
      ],
      [
        { category: 'Breakfast', name: 'Dibba Rotti with Gongura Pachadi', portion: '1 thick slice', calories: 315, protein: 10.2, iron: 4.4, calcium: 175, folate: 80, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Bobbarlu Chaat', portion: '1 bowl', calories: 165, protein: 10.2, iron: 3.9, calcium: 60, folate: 115, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Ragi Sangati with Palakura Pappu & Ghee', portion: '1 ball + dal + ghee', calories: 460, protein: 17.0, iron: 7.2, calcium: 420, folate: 155, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Senagala Guggillu with Coconut', portion: '1 cup', calories: 190, protein: 10.8, iron: 4.2, calcium: 75, folate: 115, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Steamed Rice with Tomato Charu, Beans & Milk', portion: '1 plate rice + charu + milk', calories: 410, protein: 14.5, iron: 5.0, calcium: 310, folate: 78, foodId: 'andhra_01' }
      ],
      [
        { category: 'Breakfast', name: 'Whole Green Gram Pesarattu with Upma & Chutney', portion: '2 pesarattus', calories: 330, protein: 14.5, iron: 4.8, calcium: 110, folate: 115, foodId: 'andhra_01' },
        { category: 'Mid-Morning Snack', name: 'Senagala Guggillu with Sesame Seeds', portion: '1 cup', calories: 205, protein: 10.8, iron: 4.6, calcium: 190, folate: 100, foodId: 'andhra_01' },
        { category: 'Lunch', name: 'Brown Rice with Gongura Pappu & Fresh Curd', portion: '1 plate rice + dal + curd', calories: 460, protein: 17.2, iron: 7.4, calcium: 310, folate: 155, foodId: 'andhra_01' },
        { category: 'Evening Snack', name: 'Majjiga with Hing & Ginger', portion: '1 glass', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, foodId: 'andhra_01' },
        { category: 'Dinner', name: 'Ragi Sangati with Ulava Charu & Bedtime Milk', portion: '1 ball + charu + milk', calories: 440, protein: 16.5, iron: 6.8, calcium: 380, folate: 140, foodId: 'andhra_01' }
      ]
    ];

    // 5. Telangana 7-Day Template (Exclusively verified Telangana dishes)
    const tsDayTemplates = [
      [
        { category: 'Breakfast', name: 'Sarva Pindi (Telangana Lentil & Rice Flatbread) with Mint Chutney', portion: '2 pindi discs + chutney', calories: 290, protein: 11.5, iron: 4.4, calcium: 110, folate: 95, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Makka Gudaalu (Boiled Sweetcorn & Bengal Gram Chaat)', portion: '1 bowl (130g)', calories: 160, protein: 8.8, iron: 3.6, calcium: 55, folate: 110, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte (Sorghum Flatbread) with Menthi Kura Pappu', portion: '2 rottis + 1 bowl dal + salad', calories: 425, protein: 15.8, iron: 6.5, calcium: 310, folate: 145, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Spiced Telangana Majjiga with Curry Leaves & Hing', portion: '1 tall glass', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Pachi Pulusu with Steamed Rice & Toor Dal Mash', portion: '1 bowl pulusu + rice + dal', calories: 395, protein: 13.2, iron: 4.9, calcium: 220, folate: 85, foodId: 'telangana_01' }
      ],
      [
        { category: 'Breakfast', name: 'Sarva Pindi with Spiced Chana Dal & Peanuts', portion: '2 discs', calories: 310, protein: 12.0, iron: 4.8, calcium: 130, folate: 90, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Boiled Anumulu (Field Beans) Chaat with Rock Salt', portion: '1 bowl', calories: 170, protein: 10.0, iron: 4.0, calcium: 70, folate: 115, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte with Tomato Pappu & Palak', portion: '2 rottis + dal + salad', calories: 450, protein: 16.8, iron: 6.9, calcium: 340, folate: 150, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Majjiga with Ginger & Coriander', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Sajja Rotte (Pearl Millet Flatbread) with Dal & Haldi Milk', portion: '2 rottis + dal + milk', calories: 430, protein: 15.5, iron: 6.2, calcium: 330, folate: 90, foodId: 'telangana_01' }
      ],
      [
        { category: 'Breakfast', name: 'Sarva Pindi with Roasted Sesame Seeds', portion: '2 discs', calories: 335, protein: 12.8, iron: 5.5, calcium: 280, folate: 90, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Makka Gudaalu with Roasted Sesame & Cumin', portion: '1 bowl', calories: 195, protein: 9.5, iron: 4.0, calcium: 150, folate: 105, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte with Methi Garlic Dal & Desi Cow Ghee', portion: '2 rottis + dal + ghee', calories: 485, protein: 18.0, iron: 7.4, calcium: 360, folate: 145, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Telangana Majjiga with Curry Leaves', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Pachi Pulusu with Steamed Rice & Palak Dal', portion: '1 bowl pulusu + rice + dal', calories: 420, protein: 15.5, iron: 6.8, calcium: 340, folate: 140, foodId: 'telangana_01' }
      ],
      [
        { category: 'Breakfast', name: 'Sarva Pindi with Spiced Dal & Mint Chutney', portion: '2 discs', calories: 290, protein: 11.5, iron: 4.4, calcium: 110, folate: 95, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Boiled Anumulu Chaat with Lemon', portion: '1 bowl', calories: 170, protein: 10.0, iron: 4.0, calcium: 70, folate: 115, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte with Palak Dal & Curd', portion: '2 rottis + dal + curd', calories: 440, protein: 16.5, iron: 6.8, calcium: 330, folate: 145, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Spiced Majjiga', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Sajja Rotte with Mixed Veg Curry & Milk', portion: '2 rottis + sabzi + milk', calories: 420, protein: 15.0, iron: 5.8, calcium: 320, folate: 85, foodId: 'telangana_01' }
      ],
      [
        { category: 'Breakfast', name: 'Sarva Pindi with Peanuts & Chana Dal', portion: '2 discs', calories: 310, protein: 12.0, iron: 4.8, calcium: 130, folate: 90, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Makka Gudaalu Chaat', portion: '1 bowl', calories: 160, protein: 8.8, iron: 3.6, calcium: 55, folate: 110, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte with Menthi Kura Pappu & Ghee', portion: '2 rottis + dal + ghee', calories: 450, protein: 16.5, iron: 6.8, calcium: 320, folate: 145, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Majjiga with Hing', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Pachi Pulusu with Steamed Rice & Dal Mash', portion: '1 bowl + rice + dal', calories: 400, protein: 14.0, iron: 5.2, calcium: 260, folate: 90, foodId: 'telangana_01' }
      ],
      [
        { category: 'Breakfast', name: 'Sarva Pindi with Mint Chutney', portion: '2 discs', calories: 290, protein: 11.5, iron: 4.4, calcium: 110, folate: 95, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Boiled Anumulu Chaat', portion: '1 bowl', calories: 170, protein: 10.0, iron: 4.0, calcium: 70, folate: 115, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte with Tomato Pappu & Desi Ghee', portion: '2 rottis + dal + ghee', calories: 460, protein: 17.0, iron: 7.0, calcium: 330, folate: 145, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Makka Gudaalu', portion: '1 bowl', calories: 160, protein: 8.8, iron: 3.6, calcium: 55, folate: 110, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Sajja Rotte with Vegetable Curry & Haldi Milk', portion: '2 rottis + sabzi + milk', calories: 430, protein: 15.5, iron: 6.0, calcium: 340, folate: 90, foodId: 'telangana_01' }
      ],
      [
        { category: 'Breakfast', name: 'Sarva Pindi with Sesame Seeds & Chutney', portion: '2 discs', calories: 335, protein: 12.8, iron: 5.5, calcium: 280, folate: 90, foodId: 'telangana_01' },
        { category: 'Mid-Morning Snack', name: 'Makka Gudaalu with Cumin & Curry Leaves', portion: '1 bowl', calories: 180, protein: 9.2, iron: 3.9, calcium: 80, folate: 105, foodId: 'telangana_01' },
        { category: 'Lunch', name: 'Jonna Rotte with Methi Garlic Dal & Curd', portion: '2 rottis + dal + curd', calories: 470, protein: 17.5, iron: 7.2, calcium: 350, folate: 150, foodId: 'telangana_01' },
        { category: 'Evening Snack', name: 'Telangana Majjiga', portion: '1 glass', calories: 85, protein: 3.5, iron: 1.1, calcium: 150, folate: 20, foodId: 'telangana_01' },
        { category: 'Dinner', name: 'Warm Cardamom Milk with Crushed Badam & Khichdi', portion: '1 bowl khichdi + milk', calories: 410, protein: 14.8, iron: 5.0, calcium: 360, folate: 80, foodId: 'telangana_01' }
      ]
    ];

    // 6. Puducherry 7-Day Template (Exclusively verified Puducherry dishes)
    const pyDayTemplates = [
      [
        { category: 'Breakfast', name: 'Idli (Puducherry Style) with Herb Chutney', portion: '3 idlis + chutney', calories: 275, protein: 8.4, iron: 3.6, calcium: 120, folate: 80, foodId: 'puducherry_idli' },
        { category: 'Mid-Morning Snack', name: 'Creole Spiced Vegetable Broth', portion: '1 cup', calories: 95, protein: 4.2, iron: 2.8, calcium: 65, folate: 75, foodId: 'puducherry_01' },
        { category: 'Lunch', name: 'Creole Vegetable Ragout with Steamed Red Rice', portion: '1 plate rice + ragout', calories: 440, protein: 14.5, iron: 6.2, calcium: 310, folate: 140, foodId: 'puducherry_01' },
        { category: 'Evening Snack', name: 'Thayir Sadam (Curd Rice) with Pomegranate', portion: '1 bowl', calories: 215, protein: 8.2, iron: 2.1, calcium: 280, folate: 42, foodId: 'puducherry_thayir_sadam' },
        { category: 'Dinner', name: 'Appam (Puducherry Style) with Mild Coconut Stew', portion: '2 appams + stew + milk', calories: 410, protein: 12.0, iron: 4.0, calcium: 290, folate: 75, foodId: 'puducherry_appam' }
      ],
      [
        { category: 'Breakfast', name: 'Dosa (Puducherry Style) with Herb Chutney', portion: '2 dosas + chutney', calories: 285, protein: 8.8, iron: 3.8, calcium: 130, folate: 65, foodId: 'puducherry_dosa' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water', portion: '1 glass', calories: 95, protein: 2.0, iron: 1.2, calcium: 65, folate: 25, foodId: 'puducherry_coconut_rice' },
        { category: 'Lunch', name: 'Puducherry Ratatouille with Steamed Rice', portion: '1 plate rice + ratatouille', calories: 420, protein: 13.5, iron: 5.6, calcium: 290, folate: 135, foodId: 'puducherry_ratatouille' },
        { category: 'Evening Snack', name: 'Medu Vada (Puducherry Style)', portion: '2 vadas + chutney', calories: 220, protein: 9.5, iron: 3.5, calcium: 70, folate: 80, foodId: 'puducherry_medu_vada' },
        { category: 'Dinner', name: 'Steamed Idiyappam with Coconut Milk & Bedtime Milk', portion: '3 idiyappams + milk', calories: 395, protein: 11.0, iron: 3.9, calcium: 240, folate: 65, foodId: 'puducherry_idiyappam' }
      ],
      [
        { category: 'Breakfast', name: 'Pongal (Puducherry Style) with Pepper-Cumin Ghee', portion: '1 bowl', calories: 310, protein: 9.8, iron: 3.9, calcium: 110, folate: 72, foodId: 'puducherry_pongal' },
        { category: 'Mid-Morning Snack', name: 'Creole Spiced Vegetable Broth with Herbs', portion: '1 cup', calories: 95, protein: 4.2, iron: 2.8, calcium: 65, folate: 75, foodId: 'puducherry_01' },
        { category: 'Lunch', name: 'Creole Vegetable Ragout with Steamed Rice & Ghee', portion: '1 plate rice + ragout', calories: 440, protein: 14.5, iron: 6.2, calcium: 310, folate: 140, foodId: 'puducherry_01' },
        { category: 'Evening Snack', name: 'Thayir Sadam with Pomegranate Seeds', portion: '1 cup', calories: 215, protein: 8.2, iron: 2.1, calcium: 280, folate: 42, foodId: 'puducherry_thayir_sadam' },
        { category: 'Dinner', name: 'Puducherry Dosa with Mild Sambar & Warm Milk', portion: '2 dosas + sambar + milk', calories: 405, protein: 14.5, iron: 5.0, calcium: 340, folate: 75, foodId: 'puducherry_dosa' }
      ],
      [
        { category: 'Breakfast', name: 'Appam (Puducherry Style) with Sweetened Coconut Milk', portion: '2 appams + coconut milk', calories: 320, protein: 9.8, iron: 3.8, calcium: 160, folate: 85, foodId: 'puducherry_appam' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water', portion: '1 glass', calories: 95, protein: 2.0, iron: 1.2, calcium: 65, folate: 25, foodId: 'puducherry_coconut_rice' },
        { category: 'Lunch', name: 'Puducherry Ratatouille with Whole Grain Rice', portion: '1 plate rice + ratatouille', calories: 430, protein: 14.0, iron: 5.8, calcium: 300, folate: 140, foodId: 'puducherry_ratatouille' },
        { category: 'Evening Snack', name: 'Medu Vada (Puducherry Style)', portion: '2 vadas', calories: 220, protein: 9.5, iron: 3.5, calcium: 70, folate: 80, foodId: 'puducherry_medu_vada' },
        { category: 'Dinner', name: 'Idiyappam with Light Vegetable Stew in Coconut Milk', portion: '3 idiyappams + stew', calories: 385, protein: 10.5, iron: 3.9, calcium: 210, folate: 70, foodId: 'puducherry_idiyappam' }
      ],
      [
        { category: 'Breakfast', name: 'Idli (Puducherry Style) with Sambar & Chutney', portion: '3 idlis + sambar', calories: 275, protein: 8.4, iron: 3.6, calcium: 120, folate: 80, foodId: 'puducherry_idli' },
        { category: 'Mid-Morning Snack', name: 'Creole Vegetable Broth', portion: '1 cup', calories: 95, protein: 4.2, iron: 2.8, calcium: 65, folate: 75, foodId: 'puducherry_01' },
        { category: 'Lunch', name: 'Creole Vegetable Ragout with Steamed Red Rice', portion: '1 plate rice + ragout', calories: 440, protein: 14.5, iron: 6.2, calcium: 310, folate: 140, foodId: 'puducherry_01' },
        { category: 'Evening Snack', name: 'Thayir Sadam with Mustard Tempering', portion: '1 cup', calories: 215, protein: 8.2, iron: 2.1, calcium: 280, folate: 42, foodId: 'puducherry_thayir_sadam' },
        { category: 'Dinner', name: 'Semiya Payasam with Pure Cow Milk & Saffron', portion: '1 bowl payasam + 2 dosas', calories: 420, protein: 14.0, iron: 4.8, calcium: 360, folate: 75, foodId: 'puducherry_semiya_payasam' }
      ],
      [
        { category: 'Breakfast', name: 'Dosa (Puducherry Style) with Fresh Chutney', portion: '2 dosas + chutney', calories: 285, protein: 8.8, iron: 3.8, calcium: 130, folate: 65, foodId: 'puducherry_dosa' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water', portion: '1 glass', calories: 95, protein: 2.0, iron: 1.2, calcium: 65, folate: 25, foodId: 'puducherry_coconut_rice' },
        { category: 'Lunch', name: 'Puducherry Ratatouille with Steamed Rice & Dal', portion: '1 plate rice + ratatouille + dal', calories: 440, protein: 15.0, iron: 6.0, calcium: 310, folate: 145, foodId: 'puducherry_ratatouille' },
        { category: 'Evening Snack', name: 'Medu Vada (Puducherry Style) with Chutney', portion: '2 vadas', calories: 220, protein: 9.5, iron: 3.5, calcium: 70, folate: 80, foodId: 'puducherry_medu_vada' },
        { category: 'Dinner', name: 'Appam with Coconut Milk & Warm Haldi Milk', portion: '2 appams + milk', calories: 400, protein: 12.5, iron: 4.1, calcium: 310, folate: 75, foodId: 'puducherry_appam' }
      ],
      [
        { category: 'Breakfast', name: 'Pongal (Puducherry Style) with Coconut Chutney', portion: '1 bowl', calories: 310, protein: 9.8, iron: 3.9, calcium: 110, folate: 72, foodId: 'puducherry_pongal' },
        { category: 'Mid-Morning Snack', name: 'Creole Vegetable Broth', portion: '1 cup', calories: 95, protein: 4.2, iron: 2.8, calcium: 65, folate: 75, foodId: 'puducherry_01' },
        { category: 'Lunch', name: 'Creole Vegetable Ragout with Steamed Rice & Ghee', portion: '1 plate rice + ragout', calories: 440, protein: 14.5, iron: 6.2, calcium: 310, folate: 140, foodId: 'puducherry_01' },
        { category: 'Evening Snack', name: 'Thayir Sadam with Pomegranate', portion: '1 cup', calories: 215, protein: 8.2, iron: 2.1, calcium: 280, folate: 42, foodId: 'puducherry_thayir_sadam' },
        { category: 'Dinner', name: 'Idiyappam with Stew & Bedtime Badam Milk', portion: '3 idiyappams + milk', calories: 410, protein: 13.5, iron: 4.5, calcium: 350, folate: 78, foodId: 'puducherry_idiyappam' }
      ]
    ];

    // Generic Indian / North / Central Template
    const genericDayTemplates = [
      [
        { category: 'Breakfast', name: 'Missi Roti (Gram Flour & Wheat Flatbread) with Mint Curd', portion: '2 rotis + 1 cup curd', calories: 280, protein: 11.5, iron: 4.2, calcium: 210, folate: 65, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Banana + Roasted Fox Nuts (Phool Makhana)', portion: '1 banana + 1 cup makhana', calories: 180, protein: 4.5, iron: 2.2, calcium: 125, folate: 35, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Fresh Palak Paneer with Whole Wheat Phulkas & Brown Rice', portion: '1 bowl palak paneer + 2 phulkas', calories: 470, protein: 19.8, iron: 5.9, calcium: 440, folate: 155, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Boiled Sprouted Kala Chana Chaat + Spiced Chaas', portion: '1 cup chana + 1 glass buttermilk', calories: 195, protein: 9.8, iron: 3.6, calcium: 160, folate: 85, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Dalia Vegetable Khichdi + Warm Turmeric Almond Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 380, protein: 14.5, iron: 4.4, calcium: 330, folate: 72, foodId: 'north-missi-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Methi Thepla with Fresh Curd & Green Coriander Chutney', portion: '2 theplas + 1 cup curd', calories: 290, protein: 9.8, iron: 4.6, calcium: 230, folate: 75, foodId: 'gujarat-methi-thepla' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Tomato, Cucumber & Lemon', portion: '1 bowl (140g)', calories: 160, protein: 10.2, iron: 3.9, calcium: 60, folate: 120, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Rajma Curry with Brown Rice & Mixed Green Salad', portion: '1 cup rajma + 1 cup rice + salad', calories: 480, protein: 20.2, iron: 6.8, calcium: 190, folate: 160, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) with Rock Salt & Ghee', portion: '1 cup', calories: 150, protein: 4.8, iron: 1.9, calcium: 120, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Whole Wheat Phulka with Lauki Chana Dal & Warm Haldi Milk', portion: '2 phulkas + 1 cup dal + 1 glass milk', calories: 400, protein: 15.8, iron: 5.2, calcium: 340, folate: 80, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Poha with Roasted Peanuts, Peas & Fresh Lemon', portion: '1 plate (180g)', calories: 270, protein: 7.8, iron: 4.9, calcium: 70, folate: 48, foodId: 'gujarat-khaman-dhokla' },
        { category: 'Mid-Morning Snack', name: 'Seasonal Apple Slices + 5 Soaked Almonds & 2 Walnuts', portion: '1 apple + nuts', calories: 175, protein: 4.8, iron: 1.8, calcium: 85, folate: 30, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Paneer Bhurji with 2 Whole Wheat Chapatis & Dal', portion: '1 cup paneer bhurji + 2 chapatis + salad', calories: 490, protein: 22.5, iron: 5.6, calcium: 420, folate: 110, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Spiced Chaas (Mint Buttermilk) + Roasted Chana', portion: '1 glass chaas + 1/2 cup chana', calories: 160, protein: 8.4, iron: 2.8, calcium: 190, folate: 45, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Pure Cow Ghee & Bedtime Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 410, protein: 15.2, iron: 4.6, calcium: 335, folate: 78, foodId: 'north-missi-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Besan Chilla (Gram Flour Pancake) with Paneer Stuffing', portion: '2 chillas + mint chutney', calories: 310, protein: 14.5, iron: 4.8, calcium: 210, folate: 85, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Coconut Water & Handful of Roasted Makhana', portion: '1 glass coconut water + makhana', calories: 140, protein: 3.8, iron: 1.6, calcium: 75, folate: 32, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Mixed Dal Tadka with Jeera Brown Rice & Bhindi Masala', portion: '1 cup dal + 1 cup rice + 1 cup bhindi', calories: 450, protein: 16.8, iron: 6.2, calcium: 220, folate: 140, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Curd with Pomegranate Seeds & Flaxseed Powder', portion: '1 cup curd + fruits', calories: 185, protein: 8.6, iron: 2.4, calcium: 270, folate: 42, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Jowar / Bajra Roti with Baingan Bharta & Haldi Milk', portion: '2 rotis + 1 bowl bharta + 1 glass milk', calories: 425, protein: 15.4, iron: 5.8, calcium: 340, folate: 85, foodId: 'north-missi-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Poha with Vegetables & Lemon', portion: '1 bowl', calories: 270, protein: 7.8, iron: 4.8, calcium: 70, folate: 48, foodId: 'gujarat-khaman-dhokla' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Carrots & Lemon Juice', portion: '1 bowl (130g)', calories: 155, protein: 9.8, iron: 3.7, calcium: 55, folate: 115, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Palak Paneer with Whole Wheat Rotis & Cucumber Raita', portion: '1 bowl palak paneer + 2 rotis + raita', calories: 480, protein: 20.8, iron: 6.4, calcium: 450, folate: 155, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Spiced Buttermilk', portion: '1 cup makhana + 1 glass chaas', calories: 165, protein: 5.8, iron: 2.2, calcium: 170, folate: 30, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Vegetable Dalia with Moong Dal & Bedtime Saffron Milk', portion: '1 bowl dalia + 1 glass milk', calories: 395, protein: 14.8, iron: 4.9, calcium: 330, folate: 76, foodId: 'north-missi-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Oats & Sprouted Moong Cheela with Curd', portion: '2 cheelas + 1 cup curd', calories: 295, protein: 13.2, iron: 4.5, calcium: 210, folate: 78, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Seasonal Fruit Bowl', portion: '1 bowl fresh seasonal fruit', calories: 120, protein: 2.2, iron: 1.5, calcium: 45, folate: 50, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Chole (Chickpeas Curry) with Brown Rice & Carrot Salad', portion: '1 cup chole + 1 cup rice + salad', calories: 490, protein: 19.5, iron: 6.8, calcium: 240, folate: 165, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Kala Chana Chaat with Tomatoes, Coriander & Lemon', portion: '1 cup (140g)', calories: 185, protein: 9.5, iron: 3.8, calcium: 85, folate: 90, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Whole Wheat Phulkas with Paneer Matar & Warm Haldi Milk', portion: '2 phulkas + 1 cup sabzi + 1 glass milk', calories: 440, protein: 17.8, iron: 5.2, calcium: 360, folate: 82, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Methi Paratha (Light Oil) with Homemade Curd & Mint Chutney', portion: '2 parathas + 1 cup curd', calories: 330, protein: 11.2, iron: 5.2, calcium: 250, folate: 90, foodId: 'gujarat-methi-thepla' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Soaked Walnuts (3 pcs)', portion: '1 glass coconut water + walnuts', calories: 155, protein: 4.2, iron: 1.8, calcium: 65, folate: 38, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Mixed Dal Tadka with Palak Roti & Beetroot Raita', portion: '1 cup dal + 2 rotis + 1 cup raita', calories: 460, protein: 18.0, iron: 6.5, calcium: 320, folate: 145, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Fresh Buttermilk (Chaas)', portion: '1 cup makhana + 1 glass chaas', calories: 160, protein: 5.6, iron: 2.1, calcium: 160, folate: 28, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Cow Ghee & Bedtime Badam Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 415, protein: 15.6, iron: 4.8, calcium: 345, folate: 78, foodId: 'north-missi-roti' }
      ]
    ];

    let baseTemplates = genericDayTemplates;
    if (isStateKA) {
      baseTemplates = kaDayTemplates;
    } else if (isStateTN) {
      baseTemplates = tnDayTemplates;
    } else if (isStateKL) {
      baseTemplates = klDayTemplates;
    } else if (isStateAP) {
      baseTemplates = apDayTemplates;
    } else if (isStateTS) {
      baseTemplates = tsDayTemplates;
    } else if (isStatePY) {
      baseTemplates = pyDayTemplates;
    }

    const isNonVeg = normalizeDietPreference(dietPreference) === 'non-vegetarian';

    // Deep copy templates to allow safe diet-tailored substitution
    const templates = baseTemplates.map(day => day.map(meal => ({ ...meal })));

    if (isNonVeg) {
      // Safely introduce verified maternal non-vegetarian meals on select days (Tuesday, Friday, Sunday)
      // Tuesday Lunch: Thoroughly Cooked Boiled Farm Eggs Curry
      if (templates[1] && templates[1][2]) {
        templates[1][2] = {
          category: 'Lunch',
          name: isStateKA
            ? 'Steamed Rice with Farm Egg Curry (2 Well-Cooked Eggs) & Salad'
            : isStateTN
            ? 'Steamed Rice with Tamil Farm Egg Curry (2 Well-Cooked Eggs) & Salad'
            : isStateKL
            ? 'Kerala Matta Rice with Mild Egg Roast (Thoroughly Cooked) & Thoran'
            : isStateAP
            ? 'Steamed Rice with Andhra Guddu Kura (2 Boiled Eggs) & Salad'
            : isStateTS
            ? 'Steamed Rice with Telangana Kodi Guddu Pulusu & Salad'
            : isStatePY
            ? 'Steamed Rice with Creole Egg Stew & Sautéed Greens'
            : 'Steamed Brown Rice with Mild Boiled Egg Curry & Salad',
          portion: '1 plate (2 farm eggs + 1 cup rice + salad)',
          calories: 470,
          protein: 21.4,
          iron: 4.8,
          calcium: 120,
          folate: 95,
          foodId: isStateKA ? 'karnataka_03' : isStateTN ? 'tamilnadu_02' : isStateKL ? 'kerala_02' : isStateAP ? 'andhra_02' : isStateTS ? 'telangana_02' : 'puducherry_02'
        };
      }
      // Friday Lunch: Well-Cooked Country Chicken Stew / Broth
      if (templates[4] && templates[4][2]) {
        templates[4][2] = {
          category: 'Lunch',
          name: isStateKA
            ? 'Ragi Mudde with Mangalore Chicken Ghee Roast (Fully Cooked) & Cucumber'
            : isStateTN
            ? 'Steamed Rice with Chettinad Pepper Chicken Gravy (Well Cooked) & Greens'
            : isStateKL
            ? 'Kerala Matta Rice with Mild Chicken Stew (Well Cooked) & Thoran'
            : isStateAP
            ? 'Steamed Rice with Andhra Kodi Kura (Well Cooked Country Chicken) & Salad'
            : isStateTS
            ? 'Jonna Rotte with Telangana Kodi Saaru (Tender Cooked Chicken) & Salad'
            : isStatePY
            ? 'Steamed Rice with Creole Spiced Chicken Ragout & Greens'
            : 'Whole Wheat Phulkas with Tender Cooked Chicken Stew & Steamed Veggies',
          portion: '1 plate (150g cooked chicken + staple + salad)',
          calories: 480,
          protein: 26.5,
          iron: 5.6,
          calcium: 210,
          folate: 85,
          foodId: isStateKA ? 'karnataka_03' : isStateTN ? 'tamilnadu_02' : isStateKL ? 'kerala_02' : isStateAP ? 'andhra_02' : isStateTS ? 'telangana_02' : 'puducherry_02'
        };
      }
      // Sunday Lunch: Freshwater Low-Mercury Steamed Fish Curry / Prawn Fry
      if (templates[6] && templates[6][2]) {
        templates[6][2] = {
          category: 'Lunch',
          name: isStateKA
            ? 'Steamed Rice with Mangalore Fish Curry (Low Mercury, Fully Cooked) & Greens'
            : isStateTN
            ? 'Steamed Rice with Meen Kuzhambu (Low Mercury Coastal Fish, Cooked) & Poriyal'
            : isStateKL
            ? 'Kerala Matta Rice with Malabar Fish Curry (Cooked in Coconut Milk) & Avial'
            : isStateAP
            ? 'Steamed Rice with Andhra Royyala Vepudu (Thoroughly Cooked Prawns) & Dal'
            : isStateTS
            ? 'Jonna Rotte with Golichina Mamsam (Tender Cooked Mutton) & Pachi Pulusu'
            : isStatePY
            ? 'Steamed Rice with Puducherry Coconut Fish Fillet (Delicately Cooked) & Greens'
            : 'Steamed Rice with Mild Freshwater Rohu / Katla Fish Curry & Greens',
          portion: '1 bowl fish curry (120g fish) + 1 cup rice + veggies',
          calories: 450,
          protein: 24.2,
          iron: 4.2,
          calcium: 190,
          folate: 70,
          foodId: isStateKA ? 'karnataka_03' : isStateTN ? 'tamilnadu_02' : isStateKL ? 'kerala_02' : isStateAP ? 'andhra_02' : isStateTS ? 'telangana_02' : 'puducherry_02'
        };
      }
    }

    days.forEach((dayName, dayIndex) => {
      const dayMeals = templates[dayIndex % templates.length];
      dayMeals.forEach((meal, mealIndex) => {
        // Apply slight nutritional adjustments for 1st vs 2nd vs 3rd Trimester
        const trimesterMultiplier = trimester === '1st Trimester' ? 0.92 : trimester === '3rd Trimester' ? 1.08 : 1.0;

        allMeals.push({
          id: `${(location.state || 'IN').substring(0, 2).toLowerCase()}-${dayName.toLowerCase().substring(0, 3)}-${mealIndex + 1}`,
          day: dayName as any,
          category: meal.category as any,
          name: meal.name,
          portion: meal.portion,
          calories: Math.round(meal.calories * trimesterMultiplier),
          protein: Number((meal.protein * trimesterMultiplier).toFixed(1)),
          iron: Number((meal.iron * trimesterMultiplier).toFixed(1)),
          calcium: Math.round(meal.calcium * trimesterMultiplier),
          folate: Math.round(meal.folate * trimesterMultiplier),
          isCompleted: dayIndex === 0 && mealIndex < 2,
          foodId: meal.foodId
        });
      });
    });

    return allMeals;
  }
}
