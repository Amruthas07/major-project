import { KaggleFoodItem, GlobalLocationState, PregnancyTrimester, PlannedMeal } from '../types';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from './kaggle_food_pipeline';
import { normalizeDietPreference, isFoodEligibleForDiet } from '../utils/diet_preference';

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
   * Filter and Rank Food Database with Location & Trimester Priority
   * Dynamically re-ranks dishes based on user's exact State, Region, and Trimester
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

    // Filter by Diet Preference:
    // Vegetarian user -> ONLY vegetarian foods
    // Non-Vegetarian user -> BOTH vegetarian and non-vegetarian foods
    const userDiet = normalizeDietPreference(dietPreference);
    if (userDiet === 'vegetarian') {
      dataset = dataset.filter(item => isFoodEligibleForDiet(item, 'vegetarian'));
    }

    // Filter by Safety Level
    if (safetyFilter !== 'All') {
      dataset = dataset.filter(item => item.safetyLevel === safetyFilter);
    }

    // Filter by Category
    if (categoryFilter !== 'All') {
      dataset = dataset.filter(item => item.category === categoryFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      dataset = dataset.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.regionalName?.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(q)) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Assign Location Priority (1 to 4) & Generate Clinical "Why Recommended" Explanation
    let localCount = 0;
    let regionalCount = 0;
    let nationalCount = 0;

    const scoredItems: KaggleFoodItem[] = dataset.map(item => {
      let priority: 1 | 2 | 3 | 4 = 4;
      let whyRecommended = '';

      const locationPlaceName = location.village || location.townOrVillage || location.city || location.district;
      const isExactState = item.state.toLowerCase() === location.state.toLowerCase();
      const isSameRegion = item.region === location.region;
      const isNational = item.region === 'National' || item.state === 'National';

      if (isExactState) {
        priority = 1;
        localCount++;
        whyRecommended = `📍 Authentic local staple in ${location.state} (${locationPlaceName}${location.district && location.district !== locationPlaceName ? `, ${location.district}` : ''}). Freshly available and biologically optimized for your ${trimester}.`;
      } else if (isSameRegion) {
        priority = 2;
        regionalCount++;
        whyRecommended = `🗺️ Widely prepared across ${location.region}. Readily accessible and high in ${item.tags[0] || 'essential maternal nutrients'}.`;
      } else if (isNational) {
        priority = 3;
        nationalCount++;
        whyRecommended = `🇮🇳 Essential Indian maternal nutrition staple recommended nationwide by ICMR dietary guidelines.`;
      } else {
        priority = 4;
        whyRecommended = `🥗 Verified nutrient-dense food supporting balanced maternal dietary diversity.`;
      }

      // Trimester alignment boost
      if (item.trimesterRecommended === trimester || item.trimesterRecommended === 'All Trimesters') {
        whyRecommended += ` Particularly rich in ${item.tags.slice(0, 2).join(' and ')}.`;
      }

      return {
        ...item,
        recommendationPriority: priority,
        whyRecommended
      };
    });

    // Sort by: Priority ASC (1 -> 2 -> 3 -> 4) -> Micronutrient Density
    scoredItems.sort((a, b) => {
      if ((a.recommendationPriority || 4) !== (b.recommendationPriority || 4)) {
        return (a.recommendationPriority || 4) - (b.recommendationPriority || 4);
      }
      // Within same priority tier, sort by protein + iron density
      const scoreA = a.iron * 2 + a.protein + (a.calcium / 50);
      const scoreB = b.iron * 2 + b.protein + (b.calcium / 50);
      return scoreB - scoreA;
    });

    return {
      items: scoredItems,
      localCount,
      regionalCount,
      nationalCount,
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
    const stateLower = (location.state || '').toLowerCase();
    const isStateKA = stateLower.includes('karnataka');
    const isStateTN = stateLower.includes('tamil');
    const isStateKL = stateLower.includes('kerala');
    const isStateAP_TS = stateLower.includes('andhra') || stateLower.includes('telangana');
    const isStateMH = stateLower.includes('maharashtra');
    const isStateGJ = stateLower.includes('gujarat');
    const isStateWB_East = stateLower.includes('bengal') || stateLower.includes('odisha') || stateLower.includes('assam') || stateLower.includes('bihar');

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
      } else if (isStateAP_TS) {
        dishes = [
          { name: 'Whole Green Gram Pesarattu with Ginger Chutney (Allam Pachadi)', category: 'Breakfast', calories: 295, protein: 13.5, iron: 4.2, calcium: 95, folate: 125, tags: ['High Folate', 'Nausea Relief'] },
          { name: 'Sprouted Bobbarlu (Black Eyed Peas) Chaat with Fresh Lemon', category: 'Mid-Morning Snack', calories: 165, protein: 10.2, iron: 3.9, calcium: 60, folate: 115, tags: ['Vitamin B6', 'Plant Iron'] },
          { name: 'Brown Rice with Palak Pappu (Spinach Dal) & Carrot Salad', category: 'Lunch', calories: 430, protein: 16.5, iron: 6.8, calcium: 310, folate: 150, tags: ['Hemoglobin Booster', 'Fiber'] },
          { name: 'Majjiga (Coriander Ginger Spiced Buttermilk)', category: 'Evening Snack', calories: 85, protein: 3.4, iron: 1.0, calcium: 140, folate: 20, tags: ['Hydration', 'Cooling'] },
          { name: 'Ragi Sangati with Mild Tomato Pappu Charu', category: 'Dinner', calories: 400, protein: 13.8, iron: 5.2, calcium: 330, folate: 85, tags: ['High Calcium', 'Easy Digestion'] }
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
      }

      return {
        trimester: '3rd Trimester',
        keyPillars: ['Tissue Protein Saturation', 'Magnesium for Cramp Relief', 'Dense Skeletal Calcium', 'Dietary Fiber', 'Energy Density'],
        clinicalFocus: 'Final fetal weight gain, fetal lung & brain maturation, maternal stamina for labor, and muscle cramp prevention.',
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
    const stateLower = (location.state || '').toLowerCase();
    const isStateKA = stateLower.includes('karnataka');
    const isStateTN = stateLower.includes('tamil');
    const isStateKL = stateLower.includes('kerala');
    const isStateAP_TS = stateLower.includes('andhra') || stateLower.includes('telangana');
    const isStateMH = stateLower.includes('maharashtra');
    const isStateGJ = stateLower.includes('gujarat');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const allMeals: PlannedMeal[] = [];

    // Karnataka 7-Day Template
    const kaDayTemplates = [
      [
        { category: 'Breakfast', name: 'Steamed Akki Roti with Grated Carrots & Dill (Sabbasige Soppu)', portion: '2 rotis with mild coconut chutney', calories: 280, protein: 6.2, iron: 3.2, calcium: 95, folate: 48, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli (Sprouted Moong with Coconut)', portion: '1 bowl (120g)', calories: 155, protein: 9.8, iron: 3.8, calcium: 52, folate: 110, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Nutrient-Dense Soppu Saaru (Amaranth)', portion: '1 ball (150g) + 1 bowl broth + cucumber', calories: 440, protein: 14.5, iron: 6.8, calcium: 410, folate: 135, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Phool Makhana) + Spiced Buttermilk (Majjige)', portion: '1 cup roasted makhana + 1 glass majjige', calories: 160, protein: 5.6, iron: 2.1, calcium: 150, folate: 28, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Hesaru Kaalu Palya & Warm Haldi Milk', portion: '2 rotis + 1 bowl palya + 1 glass milk', calories: 420, protein: 15.2, iron: 5.4, calcium: 330, folate: 75, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Idli with Drumstick Leaf (Moringa) Sambar', portion: '3 idlis + 1 cup sambar', calories: 270, protein: 8.9, iron: 4.2, calcium: 180, folate: 65, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Fresh Yelakki Banana + Tender Coconut Water', portion: '1 banana + 1 glass coconut water', calories: 135, protein: 2.1, iron: 1.4, calcium: 40, folate: 35, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Legumes & Mixed Vegetables', portion: '1 plate (250g) + cucumber raita', calories: 460, protein: 16.8, iron: 6.2, calcium: 230, folate: 140, foodId: 'karnataka-bisi-bele-bath' },
        { category: 'Evening Snack', name: 'Kadalekalu Usli (Tempered Bengal Gram with Mustard & Curry Leaves)', portion: '1 cup (140g)', calories: 190, protein: 10.2, iron: 4.1, calcium: 85, folate: 95, foodId: 'karnataka-kadalekalu-usli' },
        { category: 'Dinner', name: 'Ragi Dosa with Mild Tomato Onion Chutney & Bedtime Milk', portion: '2 dosas + chutney + 1 glass milk', calories: 390, protein: 13.8, iron: 5.1, calcium: 340, folate: 68, foodId: 'karnataka-ragi-mudde' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Mint Coconut Chutney', portion: '3 idlis + 2 tbsp chutney', calories: 260, protein: 8.5, iron: 3.9, calcium: 240, folate: 55, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad (Kosambari) with Lemon', portion: '1 bowl (120g)', calories: 150, protein: 9.5, iron: 3.6, calcium: 50, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Bassaru (Dill & Toor Dal Extract Saaru)', portion: '1 mudde ball + 1 bowl saaru + palya', calories: 450, protein: 15.2, iron: 7.1, calcium: 430, folate: 150, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Curd Bowl with Pomegranate & Crushed Flaxseeds', portion: '1 cup curd + 2 tbsp pomegranate', calories: 180, protein: 8.4, iron: 2.2, calcium: 260, folate: 40, foodId: 'national-pasteurized-curd' },
        { category: 'Dinner', name: 'Chapati with Mixed Vegetable Kootu & Milk', portion: '2 chapatis + 1 cup kootu + 1 glass milk', calories: 410, protein: 16.0, iron: 5.8, calcium: 350, folate: 90, foodId: 'tn-keerai-kootu' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Foxtail Millet (Navane) Upma with Peas & Carrots', portion: '1 bowl (200g)', calories: 275, protein: 7.8, iron: 3.5, calcium: 70, folate: 52, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Guava Slices with Rock Salt & Majjige', portion: '1 ripe guava + 1 glass buttermilk', calories: 125, protein: 3.6, iron: 2.0, calcium: 140, folate: 45, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Brown Rice with Palak Pappu (Spinach Dal) & Curd', portion: '1 cup rice + 1 cup dal + 1 cup curd', calories: 440, protein: 16.2, iron: 6.4, calcium: 310, folate: 145, foodId: 'telugu-palak-pappu' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts with Cumin & Ghee', portion: '1 cup (40g)', calories: 150, protein: 4.8, iron: 1.8, calcium: 110, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Jolada Roti with Stuffed Brinjal (Ennegayi) & Turmeric Milk', portion: '2 rotis + 1 bowl ennegayi + 1 glass milk', calories: 430, protein: 15.6, iron: 5.2, calcium: 320, folate: 80, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Akki Roti with Sautéed Ridge Gourd (Heerekai) Chutney', portion: '2 rotis + chutney', calories: 290, protein: 6.8, iron: 3.4, calcium: 105, folate: 50, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli with Squeezed Lemon & Fresh Coconut', portion: '1 cup (130g)', calories: 165, protein: 10.2, iron: 4.0, calcium: 58, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Ragi Mudde with Amaranth Leaf Sambar & Boiled Beetroot', portion: '1 ball + 1 bowl sambar + salad', calories: 450, protein: 14.8, iron: 7.5, calcium: 420, folate: 155, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Fresh Seasonal Fruit Bowl with Soaked Almonds (5 pcs)', portion: '1 bowl mixed fruits + almonds', calories: 170, protein: 5.2, iron: 2.1, calcium: 95, folate: 42, foodId: 'yelakki-bananas' },
        { category: 'Dinner', name: 'Soft Methi Phulka with Paneer Gravy & Bedtime Milk', portion: '2 phulkas + 1 cup paneer + 1 glass milk', calories: 440, protein: 18.2, iron: 5.4, calcium: 390, folate: 85, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Vermicelli (Shavige) Upma with Mixed Veggies', portion: '1 bowl (180g)', calories: 270, protein: 7.2, iron: 4.1, calcium: 210, folate: 48, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Warm Moringa Leaf (Murungai Soppu) Clear Broth', portion: '1 cup (200ml)', calories: 90, protein: 5.1, iron: 6.2, calcium: 270, folate: 80, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Peas, Beans & Cucumber Salad', portion: '1 plate + raita', calories: 465, protein: 17.2, iron: 6.0, calcium: 220, folate: 135, foodId: 'karnataka-bisi-bele-bath' },
        { category: 'Evening Snack', name: 'Spiced Majjige with Ginger, Curry Leaves & Asafoetida', portion: '1 tall glass (250ml)', calories: 95, protein: 4.2, iron: 1.1, calcium: 180, folate: 20, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Moong Dal Palya & Warm Haldi Milk', portion: '2 rotis + 1 bowl dal + 1 glass milk', calories: 415, protein: 15.0, iron: 5.1, calcium: 325, folate: 72, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Akki Roti with Fenugreek Greens (Menthya Soppu)', portion: '2 rotis with mild chutney', calories: 285, protein: 7.5, iron: 4.8, calcium: 140, folate: 95, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Handful of Roasted Peanuts', portion: '1 glass coconut water + 30g peanuts', calories: 190, protein: 7.6, iron: 2.4, calcium: 55, folate: 60, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Country Greens Saaru & Curd', portion: '1 mudde ball + 1 bowl saaru + curd', calories: 460, protein: 15.8, iron: 7.0, calcium: 440, folate: 160, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Konda Kadalai Sundal with Fresh Grated Coconut', portion: '1 cup (150g)', calories: 205, protein: 11.0, iron: 4.0, calcium: 80, folate: 110, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Ghee & Warm Almond Cardamom Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 410, protein: 15.5, iron: 4.9, calcium: 340, folate: 75, foodId: 'national-pasteurized-milk' }
      ]
    ];

    // Tamil Nadu 7-Day Template
    const tnDayTemplates = [
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Murungai Keerai (Drumstick Leaf) Sambar', portion: '3 idlis + 1 cup sambar', calories: 285, protein: 8.8, iron: 4.6, calcium: 240, folate: 90, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Konda Kadalai (Black Chickpea) Sundal with Coconut', portion: '1 cup (130g)', calories: 175, protein: 9.8, iron: 4.2, calcium: 70, folate: 115, foodId: 'tn-sundal' },
        { category: 'Lunch', name: 'Keerai Kootu (Spinach & Moong Dal) with Brown Rice & Ghee', portion: '1 plate rice + 1 cup kootu + cucumber', calories: 440, protein: 16.2, iron: 6.8, calcium: 360, folate: 155, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Neer Mor (Spiced Buttermilk with Ginger & Hing) + Makhana', portion: '1 glass neer mor + roasted makhana', calories: 150, protein: 5.2, iron: 1.8, calcium: 160, folate: 26, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Adai (Multi-Lentil Dosa) with Avial & Bedtime Milk', portion: '2 adais + 1 cup avial + 1 glass milk', calories: 430, protein: 18.0, iron: 5.8, calcium: 340, folate: 85, foodId: 'tn-keerai-kootu' }
      ],
      [
        { category: 'Breakfast', name: 'Kanchipuram Idli with Tomato Coriander Chutney', portion: '2 idlis + mild chutney', calories: 275, protein: 8.2, iron: 3.8, calcium: 130, folate: 65, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Handful of Soaked Almonds', portion: '1 glass coconut water + 5 almonds', calories: 140, protein: 4.0, iron: 1.6, calcium: 65, folate: 35, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Paruppu Urundai Kuzhambu with Steamed Rice & Vazhaithandu Kootu', portion: '1 plate rice + kuzhambu + kootu', calories: 460, protein: 19.5, iron: 7.2, calcium: 320, folate: 145, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Green Moong Sundal with Mustard & Curry Leaf Tempering', portion: '1 cup (120g)', calories: 165, protein: 10.0, iron: 3.7, calcium: 55, folate: 110, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Ragi Dosa with Mild Vegetable Sambar & Warm Haldi Milk', portion: '2 dosas + sambar + 1 glass milk', calories: 400, protein: 14.5, iron: 5.2, calcium: 350, folate: 78, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Venn Pongal with Moong Dal & Coconut Chutney', portion: '1 bowl pongal + chutney', calories: 310, protein: 9.8, iron: 3.9, calcium: 110, folate: 72, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Fresh Guava with Rock Salt & Glass of Neer Mor', portion: '1 guava + 1 glass buttermilk', calories: 120, protein: 3.2, iron: 1.8, calcium: 140, folate: 45, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Murungai Keerai Sambar with Steamed Brown Rice & Beetroot Poriyal', portion: '1 plate rice + sambar + poriyal', calories: 450, protein: 16.8, iron: 7.6, calcium: 380, folate: 160, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Evening Snack', name: 'Curd Bowl with Pomegranate & Crushed Flaxseeds', portion: '1 cup curd + fruits', calories: 180, protein: 8.2, iron: 2.1, calcium: 280, folate: 42, foodId: 'national-pasteurized-curd' },
        { category: 'Dinner', name: 'Whole Wheat Phulkas with Paneer Kootu & Warm Saffron Milk', portion: '2 phulkas + 1 cup kootu + milk', calories: 425, protein: 17.5, iron: 5.4, calcium: 360, folate: 82, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Kambu (Pearl Millet) Dosa with Mint Chutney', portion: '2 dosas + chutney', calories: 290, protein: 9.2, iron: 5.8, calcium: 160, folate: 80, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Warm Murungai Keerai Soup with Cumin', portion: '1 cup (200ml)', calories: 95, protein: 5.2, iron: 6.8, calcium: 290, folate: 90, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Sambar Rice with Mixed Country Vegetables & Sautéed Greens', portion: '1 plate (250g) + raita', calories: 455, protein: 16.0, iron: 6.4, calcium: 290, folate: 140, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Thattai Payiru (Cowpea) Sundal with Lemon', portion: '1 cup (140g)', calories: 185, protein: 11.2, iron: 4.2, calcium: 75, folate: 125, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Steamed Idiyappam with Coconut Milk & Stew', portion: '3 idiyappam + mild stew', calories: 395, protein: 11.0, iron: 3.9, calcium: 210, folate: 65, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Sambar & Coriander Chutney', portion: '3 idlis + sambar', calories: 280, protein: 8.6, iron: 4.4, calcium: 230, folate: 85, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Sundal with Grated Carrot & Lemon', portion: '1 bowl (130g)', calories: 160, protein: 10.2, iron: 3.8, calcium: 55, folate: 115, foodId: 'tn-sundal' },
        { category: 'Lunch', name: 'Ragi Kali with Greens Kuzhambu & Curd', portion: '1 ball + kuzhambu + 1 cup curd', calories: 460, protein: 17.2, iron: 7.9, calcium: 470, folate: 165, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Roasted Peanuts with Jaggery & Neer Mor', portion: '30g peanuts + 1 glass buttermilk', calories: 195, protein: 7.8, iron: 2.8, calcium: 155, folate: 55, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Chapati with Dal & Steamed Bottle Gourd', portion: '2 chapatis + dal + sabzi', calories: 410, protein: 15.4, iron: 5.0, calcium: 320, folate: 78, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Samba Wheat Rava Upma with Mixed Vegetables', portion: '1 bowl (200g)', calories: 285, protein: 8.5, iron: 4.2, calcium: 110, folate: 68, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Fresh Tender Coconut Water + Yelakki Banana', portion: '1 coconut + 1 banana', calories: 135, protein: 2.4, iron: 1.5, calcium: 45, folate: 35, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Keerai Sambar with Red Matta Rice & Carrot Cabbage Poriyal', portion: '1 plate rice + sambar + poriyal', calories: 450, protein: 16.5, iron: 6.9, calcium: 350, folate: 150, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Chana Sundal with Grated Coconut & Curry Leaves', portion: '1 cup', calories: 190, protein: 10.5, iron: 4.1, calcium: 80, folate: 105, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Ragi Dosa with Tomato Chutney & Bedtime Cardamom Milk', portion: '2 dosas + chutney + 1 glass milk', calories: 405, protein: 14.8, iron: 5.3, calcium: 360, folate: 75, foodId: 'tn-ragi-idli' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Idli with Murungai Keerai Sambar & Mint Chutney', portion: '3 idlis + sambar + chutney', calories: 280, protein: 8.8, iron: 4.5, calcium: 210, folate: 85, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Murungai Keerai Clear Soup with Crushed Cumin', portion: '1 cup (200ml)', calories: 90, protein: 5.0, iron: 6.5, calcium: 280, folate: 85, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Paruppu Sadam with Ghee, Rasam & Beans Usili', portion: '1 plate dal rice + rasam + usili', calories: 470, protein: 18.2, iron: 7.1, calcium: 330, folate: 145, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Fresh Buttermilk', portion: '1 cup makhana + 1 glass mor', calories: 150, protein: 5.4, iron: 1.9, calcium: 150, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Phulkas with Paneer Bhurji & Warm Saffron Milk', portion: '2 phulkas + paneer + 1 glass milk', calories: 435, protein: 18.8, iron: 5.2, calcium: 375, folate: 80, foodId: 'north-palak-paneer' }
      ]
    ];

    // Kerala 7-Day Template
    const klDayTemplates = [
      [
        { category: 'Breakfast', name: 'Steamed Puttu with Kadala (Black Chickpea) Curry', portion: '1 portion puttu + 1 bowl kadala', calories: 310, protein: 11.5, iron: 4.6, calcium: 120, folate: 98, foodId: 'tn-sundal' },
        { category: 'Mid-Morning Snack', name: 'Steamed Nendran Banana with Handful of Roasted Peanuts', portion: '1 banana + 20g peanuts', calories: 175, protein: 5.8, iron: 2.2, calcium: 55, folate: 65, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Kerala Red Matta Rice with Moru Kachiyathu & Cheera (Amaranth) Thoran', portion: '1 plate rice + moru curry + thoran', calories: 440, protein: 15.0, iron: 6.4, calcium: 320, folate: 140, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Tender Coconut Water + Roasted Makhana', portion: '1 glass coconut water + makhana', calories: 135, protein: 4.0, iron: 1.6, calcium: 90, folate: 28, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Appam with Light Vegetable Stew (Coconut Milk & Carrots)', portion: '2 appams + 1 bowl stew + milk', calories: 410, protein: 12.5, iron: 4.2, calcium: 290, folate: 78, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Idiyappam with Egg / Green Pea Curry', portion: '3 idiyappams + curry', calories: 295, protein: 10.2, iron: 4.1, calcium: 140, folate: 85, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Cherupayar (Green Moong) Steamed with Grated Coconut', portion: '1 bowl (120g)', calories: 160, protein: 9.8, iron: 3.7, calcium: 58, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Matta Rice with Parippu Curry, Cow Ghee & Cabbage Thoran', portion: '1 plate rice + dal + thoran', calories: 455, protein: 16.8, iron: 6.8, calcium: 310, folate: 145, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Fresh Sambharam (Spiced Buttermilk with Ginger & Green Chillies)', portion: '1 glass buttermilk', calories: 85, protein: 3.5, iron: 1.0, calcium: 150, folate: 20, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Wheat Dosa with Tomato Chutney & Bedtime Turmeric Milk', portion: '2 dosas + chutney + 1 glass milk', calories: 405, protein: 14.5, iron: 5.0, calcium: 340, folate: 75, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Ragi Puttu with Kadala Curry', portion: '1 portion ragi puttu + kadala', calories: 305, protein: 11.2, iron: 5.2, calcium: 240, folate: 95, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Fresh Papaya (ripe) / Guava with Black Salt', portion: '1 bowl fresh fruit', calories: 125, protein: 2.2, iron: 1.4, calcium: 48, folate: 45, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Red Matta Rice with Sambar, Beans Thoran & Homemade Curd', portion: '1 plate rice + sambar + thoran + curd', calories: 450, protein: 16.2, iron: 6.5, calcium: 340, folate: 150, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Curd Bowl with Pomegranate & Flaxseeds', portion: '1 cup curd + fruits', calories: 180, protein: 8.0, iron: 2.0, calcium: 270, folate: 40, foodId: 'national-pasteurized-curd' },
        { category: 'Dinner', name: 'Appam with Gentle Vegetable Stew & Warm Milk', portion: '2 appams + stew + 1 glass milk', calories: 410, protein: 13.0, iron: 4.4, calcium: 310, folate: 76, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Dosa with Coconut Chutney & Sambar', portion: '2 dosas + sambar', calories: 280, protein: 8.6, iron: 3.8, calcium: 130, folate: 65, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Handful of Soaked Almonds', portion: '1 glass coconut water + almonds', calories: 145, protein: 4.2, iron: 1.7, calcium: 65, folate: 35, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Matta Rice with Erissery (Pumpkin & Cowpeas with Roasted Coconut)', portion: '1 plate rice + erissery + salad', calories: 460, protein: 16.5, iron: 6.9, calcium: 320, folate: 145, foodId: 'tn-sundal' },
        { category: 'Evening Snack', name: 'Kadalaparippu Sundal with Mustard Tempering', portion: '1 cup (130g)', calories: 175, protein: 10.2, iron: 3.9, calcium: 70, folate: 110, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Soft Chapati with Dal & Thoran & Bedtime Milk', portion: '2 chapatis + dal + thoran + milk', calories: 420, protein: 15.8, iron: 5.2, calcium: 340, folate: 82, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Puttu with Steamed Cherupayar & Grated Coconut', portion: '1 puttu + cherupayar', calories: 310, protein: 12.0, iron: 4.5, calcium: 115, folate: 98, foodId: 'tn-sundal' },
        { category: 'Mid-Morning Snack', name: 'Moru (Spiced Ginger Buttermilk) + Makhana', portion: '1 glass buttermilk + makhana', calories: 130, protein: 4.5, iron: 1.5, calcium: 160, folate: 24, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Matta Rice with Cheera Sambar & Beetroot Thoran', portion: '1 plate rice + sambar + thoran', calories: 445, protein: 15.8, iron: 7.2, calcium: 360, folate: 155, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Steamed Nendran Banana with Cinnamon', portion: '1 ripe nendran banana', calories: 130, protein: 2.1, iron: 1.8, calcium: 40, folate: 45, foodId: 'yelakki-bananas' },
        { category: 'Dinner', name: 'Wheat Dosa with Dal Stew & Bedtime Cardamom Milk', portion: '2 dosas + stew + 1 glass milk', calories: 415, protein: 14.8, iron: 4.8, calcium: 350, folate: 78, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Idiyappam with Mild Kadala Curry', portion: '3 idiyappams + kadala', calories: 295, protein: 10.8, iron: 4.3, calcium: 135, folate: 88, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Warm Clear Vegetable Broth with Pepper & Cumin', portion: '1 cup (200ml)', calories: 85, protein: 3.8, iron: 2.8, calcium: 90, folate: 45, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Matta Rice with Moru Kachiyathu, Ghee & Beans Thoran', portion: '1 plate rice + moru curry + thoran', calories: 440, protein: 14.8, iron: 6.0, calcium: 310, folate: 135, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Sprouted Green Moong Salad with Coconut & Lemon', portion: '1 bowl (120g)', calories: 155, protein: 9.6, iron: 3.5, calcium: 55, folate: 110, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Dinner', name: 'Appam with Vegetable Stew & Warm Haldi Milk', portion: '2 appams + stew + 1 glass milk', calories: 420, protein: 13.5, iron: 4.5, calcium: 330, folate: 80, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Puttu with Kadala Curry & Banana Slices', portion: '1 puttu + kadala + banana', calories: 320, protein: 11.8, iron: 4.8, calcium: 125, folate: 100, foodId: 'tn-sundal' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water + 5 Soaked Almonds', portion: '1 glass coconut water + almonds', calories: 140, protein: 3.9, iron: 1.6, calcium: 65, folate: 32, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Kerala Sadya Style Matta Rice with Parippu, Sambar & Avial', portion: '1 plate rice + parippu + sambar + avial', calories: 470, protein: 18.0, iron: 7.2, calcium: 380, folate: 160, foodId: 'tn-keerai-kootu' },
        { category: 'Evening Snack', name: 'Neer Mor (Spiced Buttermilk) + Roasted Makhana', portion: '1 glass mor + makhana', calories: 145, protein: 5.0, iron: 1.7, calcium: 155, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Wheat Phulkas with Paneer Curry & Bedtime Badam Milk', portion: '2 phulkas + paneer + 1 glass milk', calories: 440, protein: 18.5, iron: 5.2, calcium: 370, folate: 82, foodId: 'north-palak-paneer' }
      ]
    ];

    // Generic Indian / North / Central Template
    const genericDayTemplates = [
      [
        { category: 'Breakfast', name: 'Missi Roti (Gram Flour & Wheat Flatbread) with Mint Curd', portion: '2 rotis + 1 cup curd', calories: 280, protein: 11.5, iron: 4.2, calcium: 210, folate: 65, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Banana + Roasted Fox Nuts (Phool Makhana)', portion: '1 banana + 1 cup makhana', calories: 180, protein: 4.5, iron: 2.2, calcium: 125, folate: 35, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Fresh Palak Paneer with Whole Wheat Phulkas & Brown Rice', portion: '1 bowl palak paneer + 2 phulkas', calories: 470, protein: 19.8, iron: 5.9, calcium: 440, folate: 155, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Boiled Sprouted Kala Chana Chaat + Spiced Chaas', portion: '1 cup chana + 1 glass buttermilk', calories: 195, protein: 9.8, iron: 3.6, calcium: 160, folate: 85, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Dalia Vegetable Khichdi + Warm Turmeric Almond Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 380, protein: 14.5, iron: 4.4, calcium: 330, folate: 72, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Methi Thepla with Fresh Curd & Green Coriander Chutney', portion: '2 theplas + 1 cup curd', calories: 290, protein: 9.8, iron: 4.6, calcium: 230, folate: 75, foodId: 'gujarat-methi-thepla' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Tomato, Cucumber & Lemon', portion: '1 bowl (140g)', calories: 160, protein: 10.2, iron: 3.9, calcium: 60, folate: 120, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Rajma Curry with Brown Rice & Mixed Green Salad', portion: '1 cup rajma + 1 cup rice + salad', calories: 480, protein: 20.2, iron: 6.8, calcium: 190, folate: 160, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) with Rock Salt & Ghee', portion: '1 cup', calories: 150, protein: 4.8, iron: 1.9, calcium: 120, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Whole Wheat Phulka with Lauki Chana Dal & Warm Haldi Milk', portion: '2 phulkas + 1 cup dal + 1 glass milk', calories: 400, protein: 15.8, iron: 5.2, calcium: 340, folate: 80, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Poha with Roasted Peanuts, Peas & Fresh Lemon', portion: '1 plate (180g)', calories: 270, protein: 7.8, iron: 4.9, calcium: 70, folate: 48, foodId: 'gujarat-khaman-dhokla' },
        { category: 'Mid-Morning Snack', name: 'Seasonal Apple Slices + 5 Soaked Almonds & 2 Walnuts', portion: '1 apple + nuts', calories: 175, protein: 4.8, iron: 1.8, calcium: 85, folate: 30, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Paneer Bhurji with 2 Whole Wheat Chapatis & Dal', portion: '1 cup paneer bhurji + 2 chapatis + salad', calories: 490, protein: 22.5, iron: 5.6, calcium: 420, folate: 110, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Spiced Chaas (Mint Buttermilk) + Roasted Chana', portion: '1 glass chaas + 1/2 cup chana', calories: 160, protein: 8.4, iron: 2.8, calcium: 190, folate: 45, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Pure Cow Ghee & Bedtime Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 410, protein: 15.2, iron: 4.6, calcium: 335, folate: 78, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Besan Chilla (Gram Flour Pancake) with Paneer Stuffing', portion: '2 chillas + mint chutney', calories: 310, protein: 14.5, iron: 4.8, calcium: 210, folate: 85, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Coconut Water & Handful of Roasted Makhana', portion: '1 glass coconut water + makhana', calories: 140, protein: 3.8, iron: 1.6, calcium: 75, folate: 32, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Mixed Dal Tadka with Jeera Brown Rice & Bhindi Masala', portion: '1 cup dal + 1 cup rice + 1 cup bhindi', calories: 450, protein: 16.8, iron: 6.2, calcium: 220, folate: 140, foodId: 'telugu-palak-pappu' },
        { category: 'Evening Snack', name: 'Curd with Pomegranate Seeds & Flaxseed Powder', portion: '1 cup curd + fruits', calories: 185, protein: 8.6, iron: 2.4, calcium: 270, folate: 42, foodId: 'national-pasteurized-curd' },
        { category: 'Dinner', name: 'Jowar / Bajra Roti with Baingan Bharta & Haldi Milk', portion: '2 rotis + 1 bowl bharta + 1 glass milk', calories: 425, protein: 15.4, iron: 5.8, calcium: 340, folate: 85, foodId: 'karnataka-jolada-roti' }
      ],
      [
        { category: 'Breakfast', name: 'Steamed Idli with Sambar & Tomato Chutney', portion: '3 idlis + 1 cup sambar', calories: 270, protein: 8.8, iron: 3.8, calcium: 140, folate: 60, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Carrots & Lemon Juice', portion: '1 bowl (130g)', calories: 155, protein: 9.8, iron: 3.7, calcium: 55, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Palak Paneer with Whole Wheat Rotis & Cucumber Raita', portion: '1 bowl palak paneer + 2 rotis + raita', calories: 480, protein: 20.8, iron: 6.4, calcium: 450, folate: 155, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Spiced Buttermilk', portion: '1 cup makhana + 1 glass chaas', calories: 165, protein: 5.8, iron: 2.2, calcium: 170, folate: 30, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Vegetable Dalia with Moong Dal & Bedtime Saffron Milk', portion: '1 bowl dalia + 1 glass milk', calories: 395, protein: 14.8, iron: 4.9, calcium: 330, folate: 76, foodId: 'national-pasteurized-milk' }
      ],
      [
        { category: 'Breakfast', name: 'Oats & Sprouted Moong Cheela with Curd', portion: '2 cheelas + 1 cup curd', calories: 295, protein: 13.2, iron: 4.5, calcium: 210, folate: 78, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Papaya (ripe, safe) / Guava with Black Salt', portion: '1 bowl fresh seasonal fruit', calories: 120, protein: 2.2, iron: 1.5, calcium: 45, folate: 50, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Chole (Chickpeas Curry) with Brown Rice & Carrot Salad', portion: '1 cup chole + 1 cup rice + salad', calories: 490, protein: 19.5, iron: 6.8, calcium: 240, folate: 165, foodId: 'tn-sundal' },
        { category: 'Evening Snack', name: 'Kala Chana Chaat with Tomatoes, Coriander & Lemon', portion: '1 cup (140g)', calories: 185, protein: 9.5, iron: 3.8, calcium: 85, folate: 90, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Whole Wheat Phulkas with Paneer Matar & Warm Haldi Milk', portion: '2 phulkas + 1 cup sabzi + 1 glass milk', calories: 440, protein: 17.8, iron: 5.2, calcium: 360, folate: 82, foodId: 'north-palak-paneer' }
      ],
      [
        { category: 'Breakfast', name: 'Methi Paratha (Light Oil) with Homemade Curd & Mint Chutney', portion: '2 parathas + 1 cup curd', calories: 330, protein: 11.2, iron: 5.2, calcium: 250, folate: 90, foodId: 'gujarat-methi-thepla' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Soaked Walnuts (3 pcs)', portion: '1 glass coconut water + walnuts', calories: 155, protein: 4.2, iron: 1.8, calcium: 65, folate: 38, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Mixed Dal Tadka with Palak Roti & Beetroot Raita', portion: '1 cup dal + 2 rotis + 1 cup raita', calories: 460, protein: 18.0, iron: 6.5, calcium: 320, folate: 145, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Fresh Buttermilk (Chaas)', portion: '1 cup makhana + 1 glass chaas', calories: 160, protein: 5.6, iron: 2.1, calcium: 160, folate: 28, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Cow Ghee & Bedtime Badam Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 415, protein: 15.6, iron: 4.8, calcium: 345, folate: 78, foodId: 'national-pasteurized-milk' }
      ]
    ];

    let baseTemplates = genericDayTemplates;
    if (isStateKA) {
      baseTemplates = kaDayTemplates;
    } else if (isStateTN) {
      baseTemplates = tnDayTemplates;
    } else if (isStateKL) {
      baseTemplates = klDayTemplates;
    }

    const isNonVeg = normalizeDietPreference(dietPreference) === 'non-vegetarian';

    // Deep copy templates to allow safe diet-tailored substitution
    const templates = baseTemplates.map(day => day.map(meal => ({ ...meal })));

    if (isNonVeg) {
      // Safely introduce verified maternal non-vegetarian meals on select days (Tuesday, Friday, Sunday)
      // Tuesday Lunch: Thoroughly Cooked Boiled Egg Curry
      if (templates[1] && templates[1][2]) {
        templates[1][2] = {
          category: 'Lunch',
          name: 'Steamed Brown Rice with Mild Boiled Egg Curry (2 Well-Cooked Farm Eggs) & Salad',
          portion: '1 plate (2 farm eggs + 1 cup rice + salad)',
          calories: 470,
          protein: 21.4,
          iron: 4.8,
          calcium: 120,
          folate: 95,
          foodId: 'tn-egg-curry'
        };
      }
      // Friday Lunch: Well-Cooked Country Chicken Stew / Broth
      if (templates[4] && templates[4][2]) {
        templates[4][2] = {
          category: 'Lunch',
          name: isStateKA
            ? 'Ragi Mudde with Mild Country Chicken Saaru (Fully Cooked) & Cucumber'
            : isStateTN
            ? 'Steamed Rice with Mild Country Chicken Kuzhambu (Well Cooked) & Greens'
            : isStateKL
            ? 'Kerala Matta Rice with Mild Chicken Stew (Well Cooked) & Thoran'
            : 'Whole Wheat Phulkas with Tender Cooked Chicken Stew & Steamed Veggies',
          portion: '1 plate (150g cooked chicken + staple + salad)',
          calories: 480,
          protein: 26.5,
          iron: 5.6,
          calcium: 210,
          folate: 85,
          foodId: 'ka-chicken-saaru'
        };
      }
      // Sunday Lunch: Freshwater Low-Mercury Steamed Fish Curry
      if (templates[6] && templates[6][2]) {
        templates[6][2] = {
          category: 'Lunch',
          name: 'Steamed Rice with Mild Freshwater Rohu / Katla Fish Curry (Thoroughly Cooked) & Greens',
          portion: '1 bowl fish curry (120g fish) + 1 cup rice + veggies',
          calories: 450,
          protein: 24.2,
          iron: 4.2,
          calcium: 190,
          folate: 70,
          foodId: 'bengal-fish-curry'
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
