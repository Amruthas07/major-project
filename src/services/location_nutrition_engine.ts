import { KaggleFoodItem, GlobalLocationState, PregnancyTrimester, PlannedMeal } from '../types';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from './kaggle_food_pipeline';

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

    // Filter by Diet Preference
    if (dietPreference === 'Vegetarian') {
      dataset = dataset.filter(item => item.isVegetarian);
    } else if (dietPreference === 'Vegan') {
      dataset = dataset.filter(item => item.isVegetarian && item.category !== 'Dairy');
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

      const locationPlaceName = location.village || location.townOrVillage || location.city;
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
   */
  public static getTrimesterMealRecommendations(
    trimester: PregnancyTrimester,
    location: GlobalLocationState,
    dietPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' = 'Vegetarian'
  ) {
    const isStateKA = location.state.toLowerCase().includes('karnataka');
    const isStateTN = location.state.toLowerCase().includes('tamil');
    const isStateKL = location.state.toLowerCase().includes('kerala');
    const isStateMH = location.state.toLowerCase().includes('maharashtra');

    if (trimester === '1st Trimester') {
      return {
        trimester: '1st Trimester',
        keyPillars: ['Active Folate (B9)', 'Bioavailable Iron', 'Vitamin B6 (Nausea Relief)', 'Calcium Matrix', 'Hydration Support'],
        clinicalFocus: 'Crucial for neural tube development, embryonic cell division, blood volume expansion, and managing morning sickness.',
        calorieTarget: 2050,
        proteinTarget: 60,
        ironTarget: 27,
        calciumTarget: 1000,
        folateTarget: 570,
        recommendedDishes: isStateKA
          ? [
              { name: 'Steamed Akki Roti with Dill (Sabbasige Soppu) & Grated Carrots', category: 'Breakfast', calories: 280, protein: 6.2, iron: 3.8, calcium: 110, folate: 85, tags: ['High Folate', 'Digestible'] },
              { name: 'Hesaru Kaalu Kosambari (Sprouted Moong Salad with Lemon)', category: 'Mid-Morning Snack', calories: 145, protein: 9.2, iron: 3.5, calcium: 48, folate: 120, tags: ['Vitamin B6', 'Active Folate'] },
              { name: 'Ragi Dosa with Refreshing Mint-Coriander Chutney', category: 'Lunch', calories: 360, protein: 11.2, iron: 5.4, calcium: 320, folate: 95, tags: ['Calcium', 'Iron Rich'] },
              { name: 'Tender Coconut Water & Majjige (Spiced Ginger Buttermilk)', category: 'Evening Snack', calories: 95, protein: 3.8, iron: 1.2, calcium: 140, folate: 25, tags: ['Hydration', 'Electrolytes'] },
              { name: 'Soft Tomato Saar with Steamed Brown Rice & Sautéed Beans', category: 'Dinner', calories: 380, protein: 13.5, iron: 4.8, calcium: 210, folate: 78, tags: ['Easy Digestion', 'Vitamin C'] }
            ]
          : [
              { name: 'Moong Dal Khichdi with Ghee & Lemon', category: 'Breakfast', calories: 290, protein: 9.5, iron: 3.6, calcium: 90, folate: 80, tags: ['High Folate', 'Digestible'] },
              { name: 'Sprouted Moong Chaat with Lemon & Rock Salt', category: 'Mid-Morning Snack', calories: 150, protein: 9.8, iron: 3.8, calcium: 55, folate: 115, tags: ['Vitamin B6', 'Folate Rich'] },
              { name: 'Methi Thepla with Fresh Homemade Curd', category: 'Lunch', calories: 390, protein: 13.5, iron: 5.2, calcium: 280, folate: 110, tags: ['Iron Rich', 'Probiotics'] },
              { name: 'Roasted Fox Nuts (Phool Makhana) + Lemon Water', category: 'Evening Snack', calories: 130, protein: 4.8, iron: 1.9, calcium: 110, folate: 22, tags: ['Low GI', 'Hydration'] },
              { name: 'Soft Palak Dal with Jeera Rice & Ghee', category: 'Dinner', calories: 410, protein: 14.8, iron: 5.6, calcium: 240, folate: 130, tags: ['Folate & Iron', 'Sustained Energy'] }
            ]
      };
    } else if (trimester === '2nd Trimester') {
      return {
        trimester: '2nd Trimester',
        keyPillars: ['High Protein Growth', 'Iron & Hemoglobin Booster', 'Calcium Skeletal Matrix', 'Vitamin D & Omega-3', 'Fiber Synergy'],
        clinicalFocus: 'Peak fetal growth phase, bone calcification, red blood cell synthesis, and preventing maternal gestational constipation.',
        calorieTarget: 2350,
        proteinTarget: 68,
        ironTarget: 27,
        calciumTarget: 1000,
        folateTarget: 570,
        recommendedDishes: isStateKA
          ? [
              { name: 'Authentic Ragi Mudde with Amaranth Soppu Saaru', category: 'Lunch', calories: 460, protein: 15.5, iron: 7.2, calcium: 420, folate: 145, tags: ['High Calcium', 'Iron Booster'] },
              { name: 'Bisi Bele Bath with Sprouted Legumes & Mixed Country Vegetables', category: 'Lunch', calories: 430, protein: 16.2, iron: 5.8, calcium: 210, folate: 125, tags: ['Complex Protein', 'High Fiber'] },
              { name: 'Hesaru Kaalu Usli (Tempered Sprouted Moong with Coconut)', category: 'Mid-Morning Snack', calories: 175, protein: 10.5, iron: 4.1, calcium: 65, folate: 115, tags: ['Plant Protein', 'Iron Rich'] },
              { name: 'Curd Rice with Pomegranate & Roasted Flaxseeds (Omega-3)', category: 'Evening Snack', calories: 220, protein: 8.2, iron: 2.6, calcium: 280, folate: 45, tags: ['Omega-3', 'Calcium'] },
              { name: 'Jowar (Jolada) Roti with Yennegai & Bedtime Turmeric Milk', category: 'Dinner', calories: 440, protein: 16.8, iron: 5.9, calcium: 350, folate: 85, tags: ['Magnesium', 'Bone Strength'] }
            ]
          : [
              { name: 'Palak Paneer with Whole Wheat Phulkas', category: 'Lunch', calories: 470, protein: 20.5, iron: 6.2, calcium: 440, folate: 150, tags: ['High Calcium', 'High Protein'] },
              { name: 'Sprouted Kala Chana Chaat with Tomatoes & Cucumber', category: 'Mid-Morning Snack', calories: 190, protein: 11.2, iron: 4.8, calcium: 90, folate: 130, tags: ['High Iron', 'High Fiber'] },
              { name: 'Mixed Dal Tadka with Brown Rice & Carrot Salad', category: 'Lunch', calories: 450, protein: 17.5, iron: 5.6, calcium: 180, folate: 120, tags: ['Complete Protein', 'Complex Carbs'] },
              { name: 'Walnuts & Almonds Trail Mix + Spiced Chaas', category: 'Evening Snack', calories: 210, protein: 7.8, iron: 2.8, calcium: 220, folate: 50, tags: ['Omega-3 Fatty Acids', 'Probiotics'] },
              { name: 'Multigrain Roti with Paneer Bhurji & Warm Haldi Milk', category: 'Dinner', calories: 460, protein: 19.2, iron: 4.9, calcium: 380, folate: 75, tags: ['Fetal Growth', 'Calcium Support'] }
            ]
      };
    } else {
      // 3rd Trimester Focus
      return {
        trimester: '3rd Trimester',
        keyPillars: ['Tissue Protein Saturation', 'Magnesium for Cramp Relief', 'Dense Skeletal Calcium', 'Dietary Fiber', 'Energy Density'],
        clinicalFocus: 'Final fetal weight gain, fetal lung & brain maturation, maternal stamina for labor, and muscle cramp prevention.',
        calorieTarget: 2550,
        proteinTarget: 78,
        ironTarget: 27,
        calciumTarget: 1200,
        folateTarget: 570,
        recommendedDishes: isStateKA
          ? [
              { name: 'Soft Jolada Roti with Hesaru Kaalu Palya & Cucumber Slices', category: 'Lunch', calories: 480, protein: 18.2, iron: 6.8, calcium: 340, folate: 115, tags: ['Magnesium Rich', 'Sustained Energy'] },
              { name: 'Nutrient-Dense Ragi Porridge (Ganji) with Milk & Almonds', category: 'Breakfast', calories: 340, protein: 12.8, iron: 5.9, calcium: 460, folate: 80, tags: ['Calcium Max', 'Stamina'] },
              { name: 'Mixed Vegetable Kootu with Drumstick (Moringa) & Toor Dal', category: 'Lunch', calories: 420, protein: 16.5, iron: 7.4, calcium: 380, folate: 160, tags: ['Iron Booster', 'Zinc & Folate'] },
              { name: 'Steamed Navane (Foxtail Millet) Pongal with Cow Ghee', category: 'Dinner', calories: 430, protein: 15.4, iron: 5.2, calcium: 210, folate: 95, tags: ['Low GI Energy', 'Easy Digestion'] },
              { name: 'Warm Haldi Badam Milk with Saffron before Bed', category: 'Dinner', calories: 230, protein: 9.5, iron: 2.1, calcium: 360, folate: 35, tags: ['Relaxation', 'Calcium Storage'] }
            ]
          : [
              { name: 'Bajra Roti with Methi Garlic Dal & Pure Ghee', category: 'Lunch', calories: 480, protein: 17.6, iron: 7.2, calcium: 310, folate: 120, tags: ['High Iron', 'Magnesium'] },
              { name: 'Dalia Khichdi with Mixed Vegetables & Paneer', category: 'Dinner', calories: 440, protein: 18.5, iron: 5.8, calcium: 340, folate: 110, tags: ['High Fiber', 'Steady Energy'] },
              { name: 'Rajma Curry with Brown Rice & Kachumber Salad', category: 'Lunch', calories: 490, protein: 21.0, iron: 6.9, calcium: 220, folate: 155, tags: ['High Protein', 'Blood Volume'] },
              { name: 'Roasted Foxnuts (Makhana) + Sesame Jaggery Til Chikki (1 pc)', category: 'Evening Snack', calories: 220, protein: 6.8, iron: 3.9, calcium: 290, folate: 40, tags: ['Natural Calcium', 'Iron'] },
              { name: 'Warm Cardamom Saffron Milk with Crushed Walnuts', category: 'Dinner', calories: 240, protein: 9.8, iron: 2.2, calcium: 370, folate: 38, tags: ['Omega-3 DHA', 'Restful Sleep'] }
            ]
      };
    }
  }

  /**
   * Generate an Authentic Location-Aware & Trimester-Aware 7-Day Meal Plan
   */
  public static generateLocationMealPlan(
    location: GlobalLocationState,
    dietPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' = 'Vegetarian',
    trimester: PregnancyTrimester = '2nd Trimester'
  ): PlannedMeal[] {
    const isStateKA = location.state.toLowerCase().includes('karnataka');
    const isStateTN = location.state.toLowerCase().includes('tamil');
    const isStateKL = location.state.toLowerCase().includes('kerala');
    const isStateMH = location.state.toLowerCase().includes('maharashtra');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const allMeals: PlannedMeal[] = [];

    // 7-day meal templates tailored for Karnataka & South India
    const kaDayTemplates = [
      // Monday
      [
        { category: 'Breakfast', name: 'Steamed Akki Roti with Grated Carrots & Dill (Sabbasige Soppu)', portion: '2 rotis with mild coconut chutney', calories: 280, protein: 6.2, iron: 3.2, calcium: 95, folate: 48, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli (Lightly Steamed Sprouted Moong with Coconut)', portion: '1 bowl (120g)', calories: 155, protein: 9.8, iron: 3.8, calcium: 52, folate: 110, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Nutrient-Dense Soppu Saaru (Amaranth)', portion: '1 ball (150g) + 1 bowl broth + cucumber slices', calories: 440, protein: 14.5, iron: 6.8, calcium: 410, folate: 135, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Phool Makhana) + Spiced Buttermilk (Majjige)', portion: '1 cup roasted makhana + 1 glass buttermilk', calories: 160, protein: 5.6, iron: 2.1, calcium: 150, folate: 28, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Hesaru Kaalu Palya & Warm Haldi Milk', portion: '2 rotis + 1 bowl palya + 1 glass turmeric milk', calories: 420, protein: 15.2, iron: 5.4, calcium: 330, folate: 75, foodId: 'karnataka-jolada-roti' }
      ],
      // Tuesday
      [
        { category: 'Breakfast', name: 'Steamed Idli with Drumstick Leaf (Moringa) Sambar', portion: '3 idlis + 1 cup sambar', calories: 270, protein: 8.9, iron: 4.2, calcium: 180, folate: 65, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Fresh Yelakki Banana + Tender Coconut Water', portion: '1 banana + 1 glass coconut water', calories: 135, protein: 2.1, iron: 1.4, calcium: 40, folate: 35, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Legumes & Mixed Vegetables', portion: '1 plate (250g) + cucumber raita', calories: 460, protein: 16.8, iron: 6.2, calcium: 230, folate: 140, foodId: 'karnataka-bisi-bele-bath' },
        { category: 'Evening Snack', name: 'Kadalekalu Usli (Tempered Bengal Gram with Mustard & Curry Leaves)', portion: '1 cup (140g)', calories: 190, protein: 10.2, iron: 4.1, calcium: 85, folate: 95, foodId: 'karnataka-kadalekalu-usli' },
        { category: 'Dinner', name: 'Ragi Dosa with Mild Tomato Onion Chutney & Bedtime Milk', portion: '2 dosas + chutney + 1 glass milk', calories: 390, protein: 13.8, iron: 5.1, calcium: 340, folate: 68, foodId: 'karnataka-ragi-mudde' }
      ],
      // Wednesday
      [
        { category: 'Breakfast', name: 'Steamed Ragi Idli with Mint Coconut Chutney', portion: '3 idlis + 2 tbsp chutney', calories: 260, protein: 8.5, iron: 3.9, calcium: 240, folate: 55, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad (Kosambari) with Grated Carrot & Lemon', portion: '1 bowl (120g)', calories: 150, protein: 9.5, iron: 3.6, calcium: 50, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Bassaru (Dill & Toor Dal Extract Saaru)', portion: '1 mudde ball + 1 bowl saaru + palya', calories: 450, protein: 15.2, iron: 7.1, calcium: 430, folate: 150, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Curd Bowl with Pomegranate & Crushed Flaxseeds', portion: '1 cup curd + 2 tbsp pomegranate', calories: 180, protein: 8.4, iron: 2.2, calcium: 260, folate: 40, foodId: 'national-pasteurized-curd' },
        { category: 'Dinner', name: 'Chapati with Mixed Vegetable Kootu (Drumstick & Chana Dal) & Milk', portion: '2 chapatis + 1 cup kootu + 1 glass milk', calories: 410, protein: 16.0, iron: 5.8, calcium: 350, folate: 90, foodId: 'tn-keerai-kootu' }
      ],
      // Thursday
      [
        { category: 'Breakfast', name: 'Steamed Foxtail Millet (Navane) Upma with Peas & Carrots', portion: '1 bowl (200g)', calories: 275, protein: 7.8, iron: 3.5, calcium: 70, folate: 52, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Guava Slices with Rock Salt & Majjige (Spiced Buttermilk)', portion: '1 ripe guava + 1 glass buttermilk', calories: 125, protein: 3.6, iron: 2.0, calcium: 140, folate: 45, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Brown Rice with Palak Pappu (Spinach Dal) & Curd', portion: '1 cup rice + 1 cup dal + 1 cup curd', calories: 440, protein: 16.2, iron: 6.4, calcium: 310, folate: 145, foodId: 'telugu-palak-pappu' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Phool Makhana) with Cumin & Ghee', portion: '1 cup (40g)', calories: 150, protein: 4.8, iron: 1.8, calcium: 110, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Jolada Roti with Stuffed Brinjal (Ennegayi) & Turmeric Milk', portion: '2 rotis + 1 bowl ennegayi + 1 glass milk', calories: 430, protein: 15.6, iron: 5.2, calcium: 320, folate: 80, foodId: 'karnataka-jolada-roti' }
      ],
      // Friday
      [
        { category: 'Breakfast', name: 'Davangere Style Akki Roti with Sautéed Ridge Gourd (Heerekai) Chutney', portion: '2 rotis + chutney', calories: 290, protein: 6.8, iron: 3.4, calcium: 105, folate: 50, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Hesaru Kaalu Usli with Squeezed Lemon & Fresh Coconut', portion: '1 cup (130g)', calories: 165, protein: 10.2, iron: 4.0, calcium: 58, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Ragi Mudde with Gongura / Amaranth Leaf Sambar & Boiled Beetroot', portion: '1 ball + 1 bowl sambar + salad', calories: 450, protein: 14.8, iron: 7.5, calcium: 420, folate: 155, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Fresh Seasonal Fruit Bowl with Soaked Almonds (5 pcs)', portion: '1 bowl mixed fruits + almonds', calories: 170, protein: 5.2, iron: 2.1, calcium: 95, folate: 42, foodId: 'yelakki-bananas' },
        { category: 'Dinner', name: 'Soft Whole Wheat Methi Phulka with Paneer Gravy & Bedtime Milk', portion: '2 phulkas + 1 cup paneer + 1 glass milk', calories: 440, protein: 18.2, iron: 5.4, calcium: 390, folate: 85, foodId: 'north-palak-paneer' }
      ],
      // Saturday
      [
        { category: 'Breakfast', name: 'Steamed Ragi Vermicelli (Shavige) Upma with Mixed Veggies', portion: '1 bowl (180g)', calories: 270, protein: 7.2, iron: 4.1, calcium: 210, folate: 48, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Warm Moringa Leaf (Murungai Soppu) Clear Broth', portion: '1 cup (200ml)', calories: 90, protein: 5.1, iron: 6.2, calcium: 270, folate: 80, foodId: 'tn-murungai-keerai-soup' },
        { category: 'Lunch', name: 'Bisi Bele Bath with Sprouted Peas, Beans & Cucumber Salad', portion: '1 plate + raita', calories: 465, protein: 17.2, iron: 6.0, calcium: 220, folate: 135, foodId: 'karnataka-bisi-bele-bath' },
        { category: 'Evening Snack', name: 'Spiced Majjige with Crushed Curry Leaves, Ginger & Asafoetida', portion: '1 tall glass (250ml)', calories: 95, protein: 4.2, iron: 1.1, calcium: 180, folate: 20, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Soft Jolada Roti with Moong Dal Palya & Warm Haldi Milk', portion: '2 rotis + 1 bowl dal + 1 glass milk', calories: 415, protein: 15.0, iron: 5.1, calcium: 325, folate: 72, foodId: 'karnataka-jolada-roti' }
      ],
      // Sunday
      [
        { category: 'Breakfast', name: 'Steamed Akki Roti with Sautéed Fenugreek Greens (Menthya Soppu)', portion: '2 rotis with mild chutney', calories: 285, protein: 7.5, iron: 4.8, calcium: 140, folate: 95, foodId: 'karnataka-akki-roti' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Handful of Roasted Peanuts', portion: '1 glass coconut water + 30g peanuts', calories: 190, protein: 7.6, iron: 2.4, calcium: 55, folate: 60, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Authentic Ragi Mudde with Organic Country Greens Saaru & Curd', portion: '1 mudde ball + 1 bowl saaru + curd', calories: 460, protein: 15.8, iron: 7.0, calcium: 440, folate: 160, foodId: 'karnataka-ragi-mudde' },
        { category: 'Evening Snack', name: 'Konda Kadalai / Chana Sundal with Fresh Grated Coconut', portion: '1 cup (150g)', calories: 205, protein: 11.0, iron: 4.0, calcium: 80, folate: 110, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Ghee & Warm Almond Cardamom Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 410, protein: 15.5, iron: 4.9, calcium: 340, folate: 75, foodId: 'national-pasteurized-milk' }
      ]
    ];

    // Generic Indian template if outside Karnataka
    const genericDayTemplates = [
      // Monday
      [
        { category: 'Breakfast', name: 'Missi Roti (Gram Flour & Wheat Flatbread) with Mint Curd', portion: '2 rotis + 1 cup curd', calories: 280, protein: 11.5, iron: 4.2, calcium: 210, folate: 65, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Banana + Roasted Fox Nuts (Phool Makhana)', portion: '1 banana + 1 cup makhana', calories: 180, protein: 4.5, iron: 2.2, calcium: 125, folate: 35, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Fresh Palak Paneer with Whole Wheat Phulkas & Brown Rice', portion: '1 bowl palak paneer + 2 phulkas', calories: 470, protein: 19.8, iron: 5.9, calcium: 440, folate: 155, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Boiled Sprouted Kala Chana Chaat + Spiced Chaas', portion: '1 cup chana + 1 glass buttermilk', calories: 195, protein: 9.8, iron: 3.6, calcium: 160, folate: 85, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Dalia Vegetable Khichdi + Warm Turmeric Almond Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 380, protein: 14.5, iron: 4.4, calcium: 330, folate: 72, foodId: 'national-pasteurized-milk' }
      ],
      // Tuesday
      [
        { category: 'Breakfast', name: 'Methi Thepla with Fresh Curd & Green Coriander Chutney', portion: '2 theplas + 1 cup curd', calories: 290, protein: 9.8, iron: 4.6, calcium: 230, folate: 75, foodId: 'gujarat-methi-thepla' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Tomato, Cucumber & Lemon', portion: '1 bowl (140g)', calories: 160, protein: 10.2, iron: 3.9, calcium: 60, folate: 120, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Rajma Curry with Brown Rice & Mixed Green Salad', portion: '1 cup rajma + 1 cup rice + salad', calories: 480, protein: 20.2, iron: 6.8, calcium: 190, folate: 160, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) with Rock Salt & Ghee', portion: '1 cup', calories: 150, protein: 4.8, iron: 1.9, calcium: 120, folate: 25, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Whole Wheat Phulka with Lauki Chana Dal & Warm Haldi Milk', portion: '2 phulkas + 1 cup dal + 1 glass milk', calories: 400, protein: 15.8, iron: 5.2, calcium: 340, folate: 80, foodId: 'national-pasteurized-milk' }
      ],
      // Wednesday
      [
        { category: 'Breakfast', name: 'Steamed Poha with Roasted Peanuts, Peas & Fresh Lemon', portion: '1 plate (180g)', calories: 270, protein: 7.8, iron: 4.9, calcium: 70, folate: 48, foodId: 'gujarat-khaman-dhokla' },
        { category: 'Mid-Morning Snack', name: 'Seasonal Apple Slices + 5 Soaked Almonds & 2 Walnuts', portion: '1 apple + nuts', calories: 175, protein: 4.8, iron: 1.8, calcium: 85, folate: 30, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Paneer Bhurji with 2 Whole Wheat Chapatis & Dal', portion: '1 cup paneer bhurji + 2 chapatis + salad', calories: 490, protein: 22.5, iron: 5.6, calcium: 420, folate: 110, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Spiced Chaas (Mint Buttermilk) + Roasted Chana', portion: '1 glass chaas + 1/2 cup chana', calories: 160, protein: 8.4, iron: 2.8, calcium: 190, folate: 45, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Pure Cow Ghee & Bedtime Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 410, protein: 15.2, iron: 4.6, calcium: 335, folate: 78, foodId: 'national-pasteurized-milk' }
      ],
      // Thursday
      [
        { category: 'Breakfast', name: 'Besan Chilla (Gram Flour Pancake) with Paneer Stuffing', portion: '2 chillas + mint chutney', calories: 310, protein: 14.5, iron: 4.8, calcium: 210, folate: 85, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Coconut Water & Handful of Roasted Makhana', portion: '1 glass coconut water + makhana', calories: 140, protein: 3.8, iron: 1.6, calcium: 75, folate: 32, foodId: 'north-roasted-makhana' },
        { category: 'Lunch', name: 'Mixed Dal Tadka with Jeera Brown Rice & Bhindi Masala', portion: '1 cup dal + 1 cup rice + 1 cup bhindi', calories: 450, protein: 16.8, iron: 6.2, calcium: 220, folate: 140, foodId: 'telugu-palak-pappu' },
        { category: 'Evening Snack', name: 'Curd with Pomegranate Seeds & Flaxseed Powder', portion: '1 cup curd + fruits', calories: 185, protein: 8.6, iron: 2.4, calcium: 270, folate: 42, foodId: 'national-pasteurized-curd' },
        { category: 'Dinner', name: 'Jowar / Bajra Roti with Baingan Bharta & Haldi Milk', portion: '2 rotis + 1 bowl bharta + 1 glass milk', calories: 425, protein: 15.4, iron: 5.8, calcium: 340, folate: 85, foodId: 'karnataka-jolada-roti' }
      ],
      // Friday
      [
        { category: 'Breakfast', name: 'Steamed Idli with Sambar & Tomato Chutney', portion: '3 idlis + 1 cup sambar', calories: 270, protein: 8.8, iron: 3.8, calcium: 140, folate: 60, foodId: 'tn-ragi-idli' },
        { category: 'Mid-Morning Snack', name: 'Sprouted Moong Salad with Carrots & Lemon Juice', portion: '1 bowl (130g)', calories: 155, protein: 9.8, iron: 3.7, calcium: 55, folate: 115, foodId: 'karnataka-sprouted-moong-usli' },
        { category: 'Lunch', name: 'Palak Paneer with Whole Wheat Rotis & Cucumber Raita', portion: '1 bowl palak paneer + 2 rotis + raita', calories: 480, protein: 20.8, iron: 6.4, calcium: 450, folate: 155, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Spiced Buttermilk', portion: '1 cup makhana + 1 glass chaas', calories: 165, protein: 5.8, iron: 2.2, calcium: 170, folate: 30, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Vegetable Dalia with Moong Dal & Bedtime Saffron Milk', portion: '1 bowl dalia + 1 glass milk', calories: 395, protein: 14.8, iron: 4.9, calcium: 330, folate: 76, foodId: 'national-pasteurized-milk' }
      ],
      // Saturday
      [
        { category: 'Breakfast', name: 'Oats & Sprouted Moong Cheela with Curd', portion: '2 cheelas + 1 cup curd', calories: 295, protein: 13.2, iron: 4.5, calcium: 210, folate: 78, foodId: 'north-missi-roti' },
        { category: 'Mid-Morning Snack', name: 'Fresh Papaya (ripe, safe) / Guava with Black Salt', portion: '1 bowl fresh seasonal fruit', calories: 120, protein: 2.2, iron: 1.5, calcium: 45, folate: 50, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Chole (Chickpeas Curry) with Brown Rice & Carrot Salad', portion: '1 cup chole + 1 cup rice + salad', calories: 490, protein: 19.5, iron: 6.8, calcium: 240, folate: 165, foodId: 'tn-sundal' },
        { category: 'Evening Snack', name: 'Kala Chana Chaat with Tomatoes, Coriander & Lemon', portion: '1 cup (140g)', calories: 185, protein: 9.5, iron: 3.8, calcium: 85, folate: 90, foodId: 'tn-sundal' },
        { category: 'Dinner', name: 'Whole Wheat Phulkas with Paneer Matar & Warm Haldi Milk', portion: '2 phulkas + 1 cup sabzi + 1 glass milk', calories: 440, protein: 17.8, iron: 5.2, calcium: 360, folate: 82, foodId: 'north-palak-paneer' }
      ],
      // Sunday
      [
        { category: 'Breakfast', name: 'Methi Paratha (Light Oil) with Homemade Curd & Mint Chutney', portion: '2 parathas + 1 cup curd', calories: 330, protein: 11.2, iron: 5.2, calcium: 250, folate: 90, foodId: 'gujarat-methi-thepla' },
        { category: 'Mid-Morning Snack', name: 'Tender Coconut Water & Soaked Walnuts (3 pcs)', portion: '1 glass coconut water + walnuts', calories: 155, protein: 4.2, iron: 1.8, calcium: 65, folate: 38, foodId: 'yelakki-bananas' },
        { category: 'Lunch', name: 'Mixed Dal Tadka with Palak Roti & Beetroot Raita', portion: '1 cup dal + 2 rotis + 1 cup raita', calories: 460, protein: 18.0, iron: 6.5, calcium: 320, folate: 145, foodId: 'north-palak-paneer' },
        { category: 'Evening Snack', name: 'Roasted Fox Nuts (Makhana) + Fresh Buttermilk (Chaas)', portion: '1 cup makhana + 1 glass chaas', calories: 160, protein: 5.6, iron: 2.1, calcium: 160, folate: 28, foodId: 'north-roasted-makhana' },
        { category: 'Dinner', name: 'Moong Dal Khichdi with Cow Ghee & Bedtime Badam Milk', portion: '1 bowl khichdi + 1 glass milk', calories: 415, protein: 15.6, iron: 4.8, calcium: 345, folate: 78, foodId: 'national-pasteurized-milk' }
      ]
    ];

    const templates = isStateKA ? kaDayTemplates : genericDayTemplates;

    days.forEach((dayName, dayIndex) => {
      const dayMeals = templates[dayIndex % templates.length];
      dayMeals.forEach((meal, mealIndex) => {
        // Apply slight nutritional adjustments for 1st vs 2nd vs 3rd Trimester
        const trimesterMultiplier = trimester === '1st Trimester' ? 0.92 : trimester === '3rd Trimester' ? 1.08 : 1.0;

        allMeals.push({
          id: `${location.state.substring(0, 2).toLowerCase()}-${dayName.toLowerCase().substring(0, 3)}-${mealIndex + 1}`,
          day: dayName as any,
          category: meal.category as any,
          name: meal.name,
          portion: meal.portion,
          calories: Math.round(meal.calories * trimesterMultiplier),
          protein: Number((meal.protein * trimesterMultiplier).toFixed(1)),
          iron: Number((meal.iron * trimesterMultiplier).toFixed(1)),
          calcium: Math.round(meal.calcium * trimesterMultiplier),
          folate: Math.round(meal.folate * trimesterMultiplier),
          isCompleted: dayIndex === 0 && mealIndex < 2, // First 2 meals of Monday marked completed for realism
          foodId: meal.foodId
        });
      });
    });

    return allMeals;
  }
}
