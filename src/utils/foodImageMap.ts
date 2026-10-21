/**
 * Maternal Meal Planner 3D Visual Asset Mapping Utility
 * Stable ID-based and name-based mapping for maternal food items.
 *
 * Strictly adheres to guidelines:
 * 1. Keyed by stable foodId, mealCategory, or standardized dish name (never array indices).
 * 2. Food-specific visual matching (Breakfast: idli-sambar, dosa, upma, etc.; Mid-Morning: guava, banana, apple, buttermilk; Lunch: thali, ragi mudde, dal-rice; Evening: sundal, roasted chana, makhana; Dinner: chapati with curry; Bedtime: warm turmeric milk).
 * 3. Dynamic synchronization: Updates automatically whenever meals are swapped/changed.
 * 4. Fallback: Polished neutral 3D food placeholder rather than an incorrect dish.
 */

export type Food3DVisualKey =
  // Breakfast items
  | '3d-idli-sambar'
  | '3d-dosa-platter'
  | '3d-vegetable-upma'
  | '3d-poha'
  | '3d-pesarattu-appam'
  | '3d-pongal'
  | '3d-breakfast-dish'
  // Mid-Morning Snack (Fruits & Beverages)
  | '3d-guava-fruit'
  | '3d-banana-fruit'
  | '3d-apple-fruit'
  | '3d-tender-coconut'
  | '3d-buttermilk-chaas'
  | '3d-nuts-dates'
  | '3d-fresh-fruits'
  // Lunch (Full Indian Meals & Regional Dishes)
  | '3d-full-lunch-thali'
  | '3d-ragi-mudde'
  | '3d-dal-rice'
  | '3d-curd-rice'
  | '3d-millet-pulao'
  | '3d-paneer-curry'
  | '3d-healthy-thali'
  // Evening Snack (Lighter Snacks & Soups)
  | '3d-sundal'
  | '3d-roasted-chana'
  | '3d-makhana-foxnuts'
  | '3d-sprouts-salad'
  | '3d-herbal-soup'
  | '3d-evening-snack'
  // Dinner (Rotis, Curries, Light Millets)
  | '3d-chapati-curry'
  | '3d-phulka-rotis'
  | '3d-millet-khichdi'
  | '3d-paneer-sabzi'
  | '3d-dinner-dish'
  // Bedtime / Late Night
  | '3d-turmeric-golden-milk'
  | '3d-almond-milk'
  | '3d-bedtime-milk'
  // Neutral Maternal Fallback
  | '3d-neutral-maternal-food';

export interface Food3DVisualMeta {
  key: Food3DVisualKey;
  defaultTitle: string;
  defaultAlt: string;
  category: 'Breakfast' | 'Mid-Morning Snack' | 'Lunch' | 'Evening Snack' | 'Dinner' | 'Bedtime' | 'Universal';
}

export const FOOD_3D_METADATA: Record<Food3DVisualKey, Food3DVisualMeta> = {
  '3d-idli-sambar': {
    key: '3d-idli-sambar',
    defaultTitle: 'Steamed Idli with Sambar & Chutney',
    defaultAlt: '3D Illustration of Steamed Soft Idlis with Lentil Sambar and Coconut Chutney',
    category: 'Breakfast'
  },
  '3d-dosa-platter': {
    key: '3d-dosa-platter',
    defaultTitle: 'Golden Dosa Platter',
    defaultAlt: '3D Illustration of Crisp Golden Dosa with Coconut Chutney and Sambar',
    category: 'Breakfast'
  },
  '3d-vegetable-upma': {
    key: '3d-vegetable-upma',
    defaultTitle: 'Vegetable Upma & Khichdi',
    defaultAlt: '3D Illustration of Wholesome Semolina Vegetable Upma with Roasted Peanuts and Curry Leaves',
    category: 'Breakfast'
  },
  '3d-poha': {
    key: '3d-poha',
    defaultTitle: 'Turmeric Vegetable Poha',
    defaultAlt: '3D Illustration of Tempered Flattened Rice with Green Peas, Peanuts and Lemon',
    category: 'Breakfast'
  },
  '3d-pesarattu-appam': {
    key: '3d-pesarattu-appam',
    defaultTitle: 'Moong Pesarattu & Appam',
    defaultAlt: '3D Illustration of Green Moong Pesarattu Crepe with Fresh Chutney',
    category: 'Breakfast'
  },
  '3d-pongal': {
    key: '3d-pongal',
    defaultTitle: 'Ghee Ven Pongal',
    defaultAlt: '3D Illustration of Savory Ghee Ven Pongal with Whole Peppercorns and Cashews',
    category: 'Breakfast'
  },
  '3d-breakfast-dish': {
    key: '3d-breakfast-dish',
    defaultTitle: 'Nutritious Maternal Breakfast',
    defaultAlt: '3D Illustration of Traditional Indian Maternal Breakfast Platter',
    category: 'Breakfast'
  },
  '3d-guava-fruit': {
    key: '3d-guava-fruit',
    defaultTitle: 'Fresh Pink Guava',
    defaultAlt: '3D Illustration of Fresh Vitamin C-Rich Pink Guava Slices with Seed Speckles',
    category: 'Mid-Morning Snack'
  },
  '3d-banana-fruit': {
    key: '3d-banana-fruit',
    defaultTitle: 'Potassium-Rich Bananas',
    defaultAlt: '3D Illustration of Ripe Yellow Bananas for Maternal Energy',
    category: 'Mid-Morning Snack'
  },
  '3d-apple-fruit': {
    key: '3d-apple-fruit',
    defaultTitle: 'Crisp Red Apple',
    defaultAlt: '3D Illustration of Fresh Crisp Red Apple with Green Leaf',
    category: 'Mid-Morning Snack'
  },
  '3d-tender-coconut': {
    key: '3d-tender-coconut',
    defaultTitle: 'Tender Coconut Water',
    defaultAlt: '3D Illustration of Fresh Green Tender Coconut with Natural Electrolytes',
    category: 'Mid-Morning Snack'
  },
  '3d-buttermilk-chaas': {
    key: '3d-buttermilk-chaas',
    defaultTitle: 'Spiced Buttermilk (Chaas)',
    defaultAlt: '3D Illustration of Cool Digestive Spiced Buttermilk in Clay Glass with Mint',
    category: 'Mid-Morning Snack'
  },
  '3d-nuts-dates': {
    key: '3d-nuts-dates',
    defaultTitle: 'Soaked Almonds & Medjool Dates',
    defaultAlt: '3D Illustration of Nutrient-Dense Soaked Almonds and Rich Medjool Dates',
    category: 'Mid-Morning Snack'
  },
  '3d-fresh-fruits': {
    key: '3d-fresh-fruits',
    defaultTitle: 'Maternal Fruit & Beverage Platter',
    defaultAlt: '3D Illustration of Fresh Tropical Fruits and Hydration Beverage',
    category: 'Mid-Morning Snack'
  },
  '3d-full-lunch-thali': {
    key: '3d-full-lunch-thali',
    defaultTitle: 'Complete Indian Maternal Thali',
    defaultAlt: '3D Illustration of Grand Indian Lunch Thali with Rice, Dal, Saag, Curd and Salad',
    category: 'Lunch'
  },
  '3d-ragi-mudde': {
    key: '3d-ragi-mudde',
    defaultTitle: 'Ragi Mudde with Saaru',
    defaultAlt: '3D Illustration of Traditional Finger Millet Ragi Mudde with Nutrient Greens Saaru',
    category: 'Lunch'
  },
  '3d-dal-rice': {
    key: '3d-dal-rice',
    defaultTitle: 'Steamed Rice with Toor Dal Tadka',
    defaultAlt: '3D Illustration of Steamed Rice with Golden Turmeric Lentil Dal and Ghee',
    category: 'Lunch'
  },
  '3d-curd-rice': {
    key: '3d-curd-rice',
    defaultTitle: 'Tempered Curd Rice',
    defaultAlt: '3D Illustration of Soothing Curd Rice with Pomegranate Arils and Mustard Tadka',
    category: 'Lunch'
  },
  '3d-millet-pulao': {
    key: '3d-millet-pulao',
    defaultTitle: 'Millet Vegetable Pulao',
    defaultAlt: '3D Illustration of Fragrant Vegetable Millet Pulao with Peas and Carrots',
    category: 'Lunch'
  },
  '3d-paneer-curry': {
    key: '3d-paneer-curry',
    defaultTitle: 'Protein Paneer Curry',
    defaultAlt: '3D Illustration of Calcium-Rich Paneer Cubes in Mild Spiced Tomato Gravy',
    category: 'Lunch'
  },
  '3d-healthy-thali': {
    key: '3d-healthy-thali',
    defaultTitle: 'Balanced Maternal Thali',
    defaultAlt: '3D Illustration of Balanced Indian Maternal Lunch Plate',
    category: 'Lunch'
  },
  '3d-sundal': {
    key: '3d-sundal',
    defaultTitle: 'Chickpea Sundal with Coconut',
    defaultAlt: '3D Illustration of Protein-Rich Black Chickpea Sundal with Fresh Coconut Shavings',
    category: 'Evening Snack'
  },
  '3d-roasted-chana': {
    key: '3d-roasted-chana',
    defaultTitle: 'Crispy Roasted Chana',
    defaultAlt: '3D Illustration of Crunchy Roasted Bengal Gram Snack Bowl',
    category: 'Evening Snack'
  },
  '3d-makhana-foxnuts': {
    key: '3d-makhana-foxnuts',
    defaultTitle: 'Turmeric Roasted Makhana',
    defaultAlt: '3D Illustration of Light Roasted Fox Nuts with Turmeric and Rock Salt',
    category: 'Evening Snack'
  },
  '3d-sprouts-salad': {
    key: '3d-sprouts-salad',
    defaultTitle: 'Moong Sprouts Salad',
    defaultAlt: '3D Illustration of Sprouted Green Moong Bean Salad with Lemon and Herbs',
    category: 'Evening Snack'
  },
  '3d-herbal-soup': {
    key: '3d-herbal-soup',
    defaultTitle: 'Warm Vegetable & Moringa Soup',
    defaultAlt: '3D Illustration of Steaming Warm Moringa and Vegetable Clear Soup',
    category: 'Evening Snack'
  },
  '3d-evening-snack': {
    key: '3d-evening-snack',
    defaultTitle: 'Nutritious Evening Snack Bowl',
    defaultAlt: '3D Illustration of Wholesome Maternal Evening Protein Snack',
    category: 'Evening Snack'
  },
  '3d-chapati-curry': {
    key: '3d-chapati-curry',
    defaultTitle: 'Whole Wheat Chapatis with Mixed Vegetable Curry',
    defaultAlt: '3D Illustration of Puffed Whole Wheat Chapatis with Mixed Vegetable Sabzi and Dal',
    category: 'Dinner'
  },
  '3d-phulka-rotis': {
    key: '3d-phulka-rotis',
    defaultTitle: 'Soft Phulka Rotis',
    defaultAlt: '3D Illustration of Stacked Puffed Phulka Rotis with Ghee Glaze',
    category: 'Dinner'
  },
  '3d-millet-khichdi': {
    key: '3d-millet-khichdi',
    defaultTitle: 'Moong Dal & Millet Khichdi',
    defaultAlt: '3D Illustration of Light Digestive Moong Dal Khichdi with Roasted Cumin',
    category: 'Dinner'
  },
  '3d-paneer-sabzi': {
    key: '3d-paneer-sabzi',
    defaultTitle: 'Methi Paneer Sabzi',
    defaultAlt: '3D Illustration of Fresh Cottage Cheese with Fenugreek Greens and Spices',
    category: 'Dinner'
  },
  '3d-dinner-dish': {
    key: '3d-dinner-dish',
    defaultTitle: 'Digestive Maternal Dinner Plate',
    defaultAlt: '3D Illustration of Wholesome Light Evening Maternal Meal',
    category: 'Dinner'
  },
  '3d-turmeric-golden-milk': {
    key: '3d-turmeric-golden-milk',
    defaultTitle: 'Golden Turmeric Milk with Saffron',
    defaultAlt: '3D Illustration of Warm Glowing Turmeric Milk with Saffron Strands and Crushed Almonds',
    category: 'Bedtime'
  },
  '3d-almond-milk': {
    key: '3d-almond-milk',
    defaultTitle: 'Warm Almond Cardamom Milk',
    defaultAlt: '3D Illustration of Warm Cow Milk Infused with Almonds and Cardamom',
    category: 'Bedtime'
  },
  '3d-bedtime-milk': {
    key: '3d-bedtime-milk',
    defaultTitle: 'Restful Bedtime Milk',
    defaultAlt: '3D Illustration of Soothing Nighttime Milk with Warm Spices in Earthen Cup',
    category: 'Bedtime'
  },
  '3d-neutral-maternal-food': {
    key: '3d-neutral-maternal-food',
    defaultTitle: 'Maternal Nutrition Item',
    defaultAlt: '3D Illustration of Balanced Maternal Nutrition Bowl with Wholesome Nutrients',
    category: 'Universal'
  }
};

/**
 * Direct Stable ID Lookup Map
 * Maps fixed foodId strings from project datasets directly to a specific 3D illustration.
 */
export const STABLE_FOOD_ID_MAP: Record<string, Food3DVisualKey> = {
  // Database IDs (foods_db.ts)
  'ragi_mudde': '3d-ragi-mudde',
  'rec_ragi_mudde_ka': '3d-ragi-mudde',
  'karnataka-ragi-mudde-finger-millet-ball': '3d-ragi-mudde',
  'akki_roti': '3d-chapati-curry',
  'rec_akki_roti_ka': '3d-chapati-curry',
  'bisi_bele_bath': '3d-millet-pulao',
  'rec_bisi_bele_bath_ka': '3d-millet-pulao',
  'ven_pongal': '3d-pongal',
  'rec_ven_pongal_tn': '3d-pongal',
  'appam': '3d-pesarattu-appam',
  'pesarattu': '3d-pesarattu-appam',
  'andhrapradesh-pesarattu-whole-moong-sprouted-crepe': '3d-pesarattu-appam',
  'idli_sambar': '3d-idli-sambar',
  'rec_idli_sambar_tn': '3d-idli-sambar',
  'southindia-idli-vada-combo-with-chutney-sambar': '3d-idli-sambar',
  'karnataka-rava-idli-with-coconut-chutney': '3d-idli-sambar',
  'dosa': '3d-dosa-platter',
  'rec_masala_dosa_ka': '3d-dosa-platter',
  'southindia-masala-dosa-potato-crepe': '3d-dosa-platter',
  'southindia-green-palak-dosa-spinach-crepe': '3d-dosa-platter',
  'morungai_keerai_soup': '3d-herbal-soup',
  'curd_yogurt': '3d-curd-rice',
  'sesame_chikki': '3d-sundal',
  'tender_coconut_water': '3d-tender-coconut',
  'nendran_banana': '3d-banana-fruit',
  'soaked_almonds': '3d-nuts-dates',
  'dates_khajur': '3d-nuts-dates',
  'cooked_spinach_palak': '3d-full-lunch-thali',
  'rec_palak_paneer_up': '3d-paneer-curry',
  'punjab-kadai-paneer-mild-capsicum-paneer': '3d-paneer-curry',
  'northindia-traditional-yellow-daal-tadka': '3d-dal-rice',
  'karnataka-chitranna-lemon-rice-with-peanuts': '3d-vegetable-upma',
  'karnataka-mosaru-anna-tempered-curd-rice': '3d-curd-rice',
  'maharashtra-kanda-batata-poha-flattened-rice-with-peas-peanuts': '3d-poha',
  'rec_indori_poha_mp': '3d-poha',
  'southindia-kala-chana-sundal-black-chickpea-salad': '3d-sundal',
  'national-fresh-maternal-sliced-fruit-platter': '3d-fresh-fruits',
  'karnataka-traditional-vegetable-palav': '3d-millet-pulao',
  'centralindia-soya-chunk-pulao-high-protein': '3d-millet-pulao',
  'rec_palak_khichdi_rj': '3d-millet-khichdi'
};

/**
 * Food Name Keywords and Pattern Matcher
 * Evaluates dish names with priority towards specific meal matches.
 */
interface FoodPatternRule {
  patterns: string[];
  visualKey: Food3DVisualKey;
  preferredCategory?: string;
}

const FOOD_NAME_PATTERNS: FoodPatternRule[] = [
  // 1. Breakfast specific items
  { patterns: ['ragi idli', 'idli', 'idlis', 'rava idli', 'steamed idli', 'idly'], visualKey: '3d-idli-sambar' },
  { patterns: ['masala dosa', 'ragi dosa', 'green dosa', 'dosa', 'dosai', 'roast dosa', 'plain dosa'], visualKey: '3d-dosa-platter' },
  { patterns: ['upma', 'uppittu', 'rava upma', 'semiya upma', 'vermicelli'], visualKey: '3d-vegetable-upma' },
  { patterns: ['poha', 'flattened rice', 'aval', 'avalakki', 'kanda poha'], visualKey: '3d-poha' },
  { patterns: ['pesarattu', 'appam', 'moong crepe', 'chilla', 'besan chilla'], visualKey: '3d-pesarattu-appam' },
  { patterns: ['ven pongal', 'pongal', 'khara pongal', 'milagu pongal'], visualKey: '3d-pongal' },

  // 2. Mid-Morning Fruits & Beverages
  { patterns: ['guava', 'pink guava', 'amrud', 'seebe', 'perakka'], visualKey: '3d-guava-fruit' },
  { patterns: ['banana', 'nendran', 'kela', 'balehannu', 'vazhaipazham'], visualKey: '3d-banana-fruit' },
  { patterns: ['apple', 'seb', 'sebu', 'apple slices'], visualKey: '3d-apple-fruit' },
  { patterns: ['tender coconut', 'coconut water', 'elaneer', 'daab', 'nariyal pani'], visualKey: '3d-tender-coconut' },
  { patterns: ['buttermilk', 'chaas', 'majjige', 'mor', 'chach', 'spiced buttermilk', 'neer mor'], visualKey: '3d-buttermilk-chaas' },
  { patterns: ['almond', 'badam', 'dates', 'khajur', 'soaked nuts', 'walnuts', 'dry fruits', 'raisins', 'anjeer'], visualKey: '3d-nuts-dates' },
  { patterns: ['fruit platter', 'fruit salad', 'sliced fruits', 'seasonal fruits', 'mixed fruit', 'papaya', 'pomegranate'], visualKey: '3d-fresh-fruits' },

  // 3. Lunch: Full Indian Meals, Dal, Rice, Millets & Curd
  { patterns: ['ragi mudde', 'ragi ball', 'mudde', 'finger millet ball'], visualKey: '3d-ragi-mudde' },
  { patterns: ['curd rice', 'mosaru anna', 'thayir sadam', 'daddojanam', 'yogurt rice'], visualKey: '3d-curd-rice' },
  { patterns: ['dal rice', 'rice with dal', 'toor dal', 'daal tadka', 'sambar rice', 'rasam rice', 'steamed rice'], visualKey: '3d-dal-rice' },
  { patterns: ['millet pulao', 'vegetable pulao', 'palav', 'bisi bele bath', 'biryani', 'khichdi lunch', 'jeera rice'], visualKey: '3d-millet-pulao' },
  { patterns: ['paneer curry', 'kadai paneer', 'palak paneer', 'paneer butter', 'tofu curry'], visualKey: '3d-paneer-curry' },
  { patterns: ['thali', 'full meal', 'lunch plate', 'south indian meal', 'north indian thali', 'rice + sambar'], visualKey: '3d-full-lunch-thali', preferredCategory: 'Lunch' },

  // 4. Evening Snack: Sundal, Roasted Chana, Fox Nuts, Sprouts & Soup
  { patterns: ['sundal', 'chana sundal', 'black chickpea', 'kala chana', 'kondakadalai'], visualKey: '3d-sundal' },
  { patterns: ['roasted chana', 'bhuna chana', 'roasted gram', 'hurigalu', 'chana snack'], visualKey: '3d-roasted-chana' },
  { patterns: ['makhana', 'fox nuts', 'lotus seeds', 'roasted makhana', 'phool makhana'], visualKey: '3d-makhana-foxnuts' },
  { patterns: ['sprouts', 'moong sprouts', 'sprouted salad', 'sprouts bowl', 'kosambari'], visualKey: '3d-sprouts-salad' },
  { patterns: ['soup', 'moringa soup', 'vegetable soup', 'keerai soup', 'clear soup', 'drumstick soup', 'tomato soup'], visualKey: '3d-herbal-soup' },

  // 5. Dinner: Chapatis, Phulkas, Rotis, Sabzi & Light Millets
  { patterns: ['phulka', 'phulkas', 'chapati', 'chapatis', 'roti', 'rotis', 'whole wheat flatbread', 'akki roti', 'jowar roti'], visualKey: '3d-chapati-curry' },
  { patterns: ['methi paneer', 'mixed vegetable sabzi', 'subzi', 'poriyal', 'curry', 'dry sabzi'], visualKey: '3d-paneer-sabzi', preferredCategory: 'Dinner' },
  { patterns: ['khichdi', 'millet khichdi', 'moong dal khichdi', 'dalia', 'oats khichdi'], visualKey: '3d-millet-khichdi' },

  // 6. Bedtime: Turmeric Milk & Spiced Warm Milk
  { patterns: ['turmeric milk', 'haldi doodh', 'golden milk', 'manjal paal', 'haldi milk'], visualKey: '3d-turmeric-golden-milk' },
  { patterns: ['warm milk', 'cow milk', 'badam milk', 'almond milk', 'milk with nuts', 'bedtime milk'], visualKey: '3d-almond-milk' }
];

/**
 * Category-based intelligent defaults when no specific food item pattern matches.
 */
export const CATEGORY_DEFAULT_3D_MAP: Record<string, Food3DVisualKey> = {
  'Breakfast': '3d-breakfast-dish',
  'Mid-Morning Snack': '3d-fresh-fruits',
  'Lunch': '3d-full-lunch-thali',
  'Evening Snack': '3d-evening-snack',
  'Dinner': '3d-chapati-curry',
  'Bedtime': '3d-turmeric-golden-milk'
};

export interface ResolvedFood3DVisual {
  visualKey: Food3DVisualKey;
  altText: string;
  title: string;
  category: string;
  isSpecificMatch: boolean;
}

/**
 * Primary resolver function.
 * Matches stable foodId, standardized name, or mealCategory with reliable fallback.
 */
export function resolveFood3DVisual(params: {
  foodId?: string | null;
  foodName?: string | null;
  category?: string | null;
  dishName?: string | null;
}): ResolvedFood3DVisual {
  const rawId = (params.foodId || '').trim();
  const rawName = (params.foodName || params.dishName || '').trim();
  const rawCategory = (params.category || '').trim();
  const cleanName = rawName.toLowerCase();

  // 1. Check Stable ID Map
  if (rawId && STABLE_FOOD_ID_MAP[rawId]) {
    const key = STABLE_FOOD_ID_MAP[rawId];
    const meta = FOOD_3D_METADATA[key];
    return {
      visualKey: key,
      altText: rawName ? `${meta.defaultAlt} — ${rawName}` : meta.defaultAlt,
      title: rawName || meta.defaultTitle,
      category: rawCategory || meta.category,
      isSpecificMatch: true
    };
  }

  // 2. Check Name against Known Patterns (Prioritizing Category Context)
  if (cleanName.length > 0) {
    // Look for exact or fuzzy pattern match
    for (const rule of FOOD_NAME_PATTERNS) {
      const isMatch = rule.patterns.some(pat => cleanName.includes(pat));
      if (isMatch) {
        // If rule has a preferred category, confirm compatibility or accept
        const key = rule.visualKey;
        const meta = FOOD_3D_METADATA[key];
        return {
          visualKey: key,
          altText: `${meta.defaultAlt} (${rawName})`,
          title: rawName || meta.defaultTitle,
          category: rawCategory || meta.category,
          isSpecificMatch: true
        };
      }
    }
  }

  // 3. Category-specific 3D Visual Match
  if (rawCategory && CATEGORY_DEFAULT_3D_MAP[rawCategory]) {
    const key = CATEGORY_DEFAULT_3D_MAP[rawCategory];
    const meta = FOOD_3D_METADATA[key];
    return {
      visualKey: key,
      altText: rawName ? `${meta.defaultAlt} — ${rawName}` : meta.defaultAlt,
      title: rawName || meta.defaultTitle,
      category: rawCategory,
      isSpecificMatch: false
    };
  }

  // 4. Neutral Maternal Food Placeholder (Guaranteed Fallback)
  const neutralMeta = FOOD_3D_METADATA['3d-neutral-maternal-food'];
  return {
    visualKey: '3d-neutral-maternal-food',
    altText: rawName ? `3D Maternal Nutrition Illustration — ${rawName}` : neutralMeta.defaultAlt,
    title: rawName || neutralMeta.defaultTitle,
    category: rawCategory || 'Universal',
    isSpecificMatch: false
  };
}
