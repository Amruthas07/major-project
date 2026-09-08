import { GlobalLocationState } from '../types';

export type FoodCategoryType = 'COOKED_MEAL' | 'RAW_INGREDIENT';

export type DeliveryPlatformId = 
  | 'swiggy' 
  | 'zomato' 
  | 'swiggy_instamart' 
  | 'blinkit' 
  | 'zepto' 
  | 'bigbasket' 
  | 'local_grocery';

export interface DeliveryPlatform {
  id: DeliveryPlatformId;
  name: string;
  serviceType: 'restaurant' | 'grocery' | 'quick_commerce' | 'local_store';
  badge: string;
  tagline: string;
  description: string;
  actionPrefix: string; // e.g. "Search on" or "Find on"
  neutralActionLabel: string; // e.g. "Search on Swiggy"
  supportsCookedFood: boolean;
  supportsGroceryIngredients: boolean;
  tierCoverage: 'all_regions' | 'metro_and_tier2' | 'nationwide_grocery';
  buildSearchUrl: (query: string, location?: GlobalLocationState) => string;
  appScheme?: string;
}

/**
 * Centralized Configuration of Supported External Ordering & Grocery Delivery Platforms
 * Can be effortlessly updated, expanded, or modified without touching individual UI cards.
 */
export const DELIVERY_PLATFORMS: Record<DeliveryPlatformId, DeliveryPlatform> = {
  swiggy: {
    id: 'swiggy',
    name: 'Swiggy',
    serviceType: 'restaurant',
    badge: 'Cooked Food Delivery',
    tagline: 'Order prepared dishes from local restaurants',
    description: 'Find freshly cooked maternal meals from verified local dining establishments.',
    actionPrefix: 'Search on',
    neutralActionLabel: 'Search on Swiggy',
    supportsCookedFood: true,
    supportsGroceryIngredients: false,
    tierCoverage: 'metro_and_tier2',
    buildSearchUrl: (query: string, location?: GlobalLocationState) => {
      const clean = cleanQueryForSearch(query);
      return `https://www.swiggy.com/search?query=${encodeURIComponent(clean)}`;
    },
    appScheme: 'swiggy://explore?query='
  },

  zomato: {
    id: 'zomato',
    name: 'Zomato',
    serviceType: 'restaurant',
    badge: 'Restaurant Search',
    tagline: 'Search prepared dishes from nearby eateries',
    description: 'Explore verified restaurant kitchens and home-style cooked meal menus.',
    actionPrefix: 'Find on',
    neutralActionLabel: 'Find on Zomato',
    supportsCookedFood: true,
    supportsGroceryIngredients: false,
    tierCoverage: 'metro_and_tier2',
    buildSearchUrl: (query: string, location?: GlobalLocationState) => {
      const clean = cleanQueryForSearch(query);
      return `https://www.zomato.com/search?q=${encodeURIComponent(clean)}`;
    },
    appScheme: 'zomato://search?q='
  },

  swiggy_instamart: {
    id: 'swiggy_instamart',
    name: 'Swiggy Instamart',
    serviceType: 'quick_commerce',
    badge: 'Quick Grocery & Produce',
    tagline: 'Fresh fruits, vegetables, millets & daily staples',
    description: 'Search instant grocery inventory for raw ingredients and fresh fruits.',
    actionPrefix: 'Search on',
    neutralActionLabel: 'Search on Swiggy Instamart',
    supportsCookedFood: false,
    supportsGroceryIngredients: true,
    tierCoverage: 'metro_and_tier2',
    buildSearchUrl: (query: string) => {
      const clean = cleanQueryForSearch(query);
      return `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(clean)}`;
    },
    appScheme: 'swiggy://instamart/search?query='
  },

  blinkit: {
    id: 'blinkit',
    name: 'Blinkit',
    serviceType: 'quick_commerce',
    badge: 'Quick Grocery (10-15 Min)',
    tagline: 'Fresh vegetables, fruits, pulses & flours',
    description: 'Rapid doorstep delivery for kitchen ingredients, grains, and fruits.',
    actionPrefix: 'Search on',
    neutralActionLabel: 'Search on Blinkit',
    supportsCookedFood: false,
    supportsGroceryIngredients: true,
    tierCoverage: 'metro_and_tier2',
    buildSearchUrl: (query: string) => {
      const clean = cleanQueryForSearch(query);
      return `https://blinkit.com/s/?q=${encodeURIComponent(clean)}`;
    },
    appScheme: 'blinkit://search?q='
  },

  zepto: {
    id: 'zepto',
    name: 'Zepto',
    serviceType: 'quick_commerce',
    badge: 'Quick Grocery Delivery',
    tagline: 'Farm-fresh vegetables, dairy, seeds & seasonal fruits',
    description: 'Instant delivery platform for pantry essentials and raw ingredients.',
    actionPrefix: 'Find on',
    neutralActionLabel: 'Find on Zepto',
    supportsCookedFood: false,
    supportsGroceryIngredients: true,
    tierCoverage: 'metro_and_tier2',
    buildSearchUrl: (query: string) => {
      const clean = cleanQueryForSearch(query);
      return `https://www.zeptonow.com/search?query=${encodeURIComponent(clean)}`;
    },
    appScheme: 'zepto://search?query='
  },

  bigbasket: {
    id: 'bigbasket',
    name: 'BigBasket',
    serviceType: 'grocery',
    badge: 'Online Supermarket',
    tagline: 'Wide selection of indigenous grains, pulses & organics',
    description: 'Pan-India comprehensive grocery supermarket for traditional flours & staples.',
    actionPrefix: 'Search on',
    neutralActionLabel: 'Search on BigBasket',
    supportsCookedFood: false,
    supportsGroceryIngredients: true,
    tierCoverage: 'nationwide_grocery',
    buildSearchUrl: (query: string) => {
      const clean = cleanQueryForSearch(query);
      return `https://www.bigbasket.com/ps/?q=${encodeURIComponent(clean)}`;
    },
    appScheme: 'bigbasket://search?q='
  },

  local_grocery: {
    id: 'local_grocery',
    name: 'Local Markets & Stores',
    serviceType: 'local_store',
    badge: 'Local Kirana & Produce',
    tagline: 'Nearby fresh produce vendors, mandis & kirana stores',
    description: 'Find neighborhood grocery stores and farmers markets in your area.',
    actionPrefix: 'Locate near',
    neutralActionLabel: 'Find Nearby Grocery Stores',
    supportsCookedFood: false,
    supportsGroceryIngredients: true,
    tierCoverage: 'all_regions',
    buildSearchUrl: (query: string, location?: GlobalLocationState) => {
      const loc = formatLocationQuery(location);
      const clean = cleanQueryForSearch(query);
      return `https://www.google.com/maps/search/grocery+stores+fresh+fruits+vegetables+${encodeURIComponent(clean)}+near+${encodeURIComponent(loc)}`;
    }
  }
};

/**
 * Helper to strip parenthetical remarks or excess clinical annotations for clean search queries
 */
export function cleanQueryForSearch(query: string): string {
  if (!query) return '';
  return query
    .replace(/\(.*?\)/g, '') // remove brackets e.g. (Finger Millet)
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Format user's active location into a friendly, relevant label
 * E.g., "Hullahalli / Nanjangud" or "Nanjangud, Mysuru" or "Mysuru, Karnataka"
 */
export function formatLocationLabel(location?: GlobalLocationState): {
  shortLocation: string;
  fullLocation: string;
  isSpecific: boolean;
} {
  if (!location) {
    return {
      shortLocation: 'your area',
      fullLocation: 'your current region',
      isSpecific: false
    };
  }

  const parts: string[] = [];
  if (location.village && location.village.trim().length > 0) {
    parts.push(location.village.trim());
  }
  if (location.taluk && location.taluk.trim().length > 0 && location.taluk !== location.village) {
    parts.push(location.taluk.trim());
  }
  if (location.city && location.city.trim().length > 0 && !parts.includes(location.city.trim())) {
    parts.push(location.city.trim());
  }
  if (location.district && location.district.trim().length > 0 && !parts.includes(location.district.trim())) {
    parts.push(location.district.trim());
  }
  if (location.state && location.state.trim().length > 0) {
    parts.push(location.state.trim());
  }

  let shortLocation = 'your area';
  if (location.village && location.taluk) {
    shortLocation = `${location.village} / ${location.taluk}`;
  } else if (location.village && location.district) {
    shortLocation = `${location.village}, ${location.district}`;
  } else if (location.city && location.district && location.city !== location.district) {
    shortLocation = `${location.city}, ${location.district}`;
  } else if (location.city && location.state) {
    shortLocation = `${location.city}, ${location.state}`;
  } else if (location.district && location.state) {
    shortLocation = `${location.district}, ${location.state}`;
  } else if (location.state) {
    shortLocation = location.state;
  }

  const fullLocation = parts.length > 0 ? parts.join(', ') : 'India';

  return {
    shortLocation,
    fullLocation,
    isSpecific: parts.length > 0
  };
}

/**
 * Formats location into search query string for maps or location-aware URL params
 */
export function formatLocationQuery(location?: GlobalLocationState): string {
  if (!location) return 'India';
  const parts = [
    location.village,
    location.taluk,
    location.city,
    location.district,
    location.state
  ].filter(Boolean) as string[];
  
  return parts.length > 0 ? parts.join(' ') : 'India';
}

// Known keywords indicating raw produce / grocery items
const RAW_FOOD_KEYWORDS = [
  'jamun', 'banana', 'apple', 'spinach', 'palak', 'methi', 'drumstick',
  'papaya', 'guava', 'orange', 'pomegranate', 'amla', 'chikoo', 'mango',
  'flour', 'atta', 'ragi', 'millet', 'jowar', 'bajra', 'rice', 'dal',
  'lentils', 'chana', 'rajma', 'moong', 'toor', 'urad', 'soybean',
  'almond', 'walnut', 'cashew', 'seed', 'chia', 'flax', 'sesame',
  'milk', 'curd', 'dahi', 'ghee', 'paneer', 'butter', 'oil',
  'carrot', 'beetroot', 'pumpkin', 'tomato', 'cucumber', 'vegetable',
  'greens', 'leaves', 'ginger', 'garlic', 'turmeric', 'egg'
];

// Known keywords indicating prepared / cooked dishes
const COOKED_DISH_KEYWORDS = [
  'idli', 'dosa', 'bisi bele bath', 'mudde', 'sambar', 'upma', 'khichdi',
  'biryani', 'curry', 'rasam', 'thepla', 'dhokla', 'pongal', 'pulao',
  'kichadi', 'kootu', 'poriyal', 'sabzi', 'dal fry', 'roti', 'paratha',
  'chapati', 'soup', 'stew', 'gravy', 'porridge', 'kanji', 'ladoo',
  'halwa', 'kheer', 'payasam', 'bath', 'thali', 'meal', 'upma'
];

export interface FoodClassificationResult {
  primaryType: FoodCategoryType;
  isCooked: boolean;
  isRawIngredient: boolean;
  readyMealPlatforms: DeliveryPlatform[];
  groceryPlatforms: DeliveryPlatform[];
  formattedSearchTerm: string;
  ingredientsList: string[];
}

/**
 * Intelligent categorization of any food item or recipe based on category, name, ingredients, and tags.
 * Ensures pregnant women are presented with relevant platforms (cooked food delivery vs grocery delivery).
 */
export function classifyFoodForOrdering(food: {
  name: string;
  category?: string;
  ingredients?: Array<string | { name: string }>;
  tags?: string[];
}): FoodClassificationResult {
  const nameLower = (food.name || '').toLowerCase();
  const categoryLower = (food.category || '').toLowerCase();
  const tagsLower = (food.tags || []).map(t => t.toLowerCase()).join(' ');

  // Normalize ingredients list
  const ingredientsList: string[] = (food.ingredients || []).map(ing => {
    if (typeof ing === 'string') return ing.trim();
    if (ing && typeof ing === 'object' && ing.name) return ing.name.trim();
    return '';
  }).filter(Boolean);

  let isCooked = false;
  let isRaw = false;

  // 1. Check Category
  if (categoryLower.includes('traditional dishes') || 
      categoryLower.includes('snacks & soups') || 
      categoryLower.includes('meals')) {
    isCooked = true;
  } else if (
    categoryLower.includes('fruits') ||
    categoryLower.includes('vegetables & greens') ||
    categoryLower.includes('millets & grains') ||
    categoryLower.includes('pulses & legumes') ||
    categoryLower.includes('nuts & seeds') ||
    categoryLower.includes('dairy')
  ) {
    isRaw = true;
  }

  // 2. Check Name Keywords
  const matchesCookedKeyword = COOKED_DISH_KEYWORDS.some(k => nameLower.includes(k));
  const matchesRawKeyword = RAW_FOOD_KEYWORDS.some(k => nameLower.includes(k));

  if (matchesCookedKeyword) {
    isCooked = true;
    isRaw = false; // Disambiguate cooked dish like "Ragi Mudde" over "Ragi"
  } else if (matchesRawKeyword && !isCooked) {
    isRaw = true;
  }

  // Fallback defaults
  if (!isCooked && !isRaw) {
    if (ingredientsList.length > 2) {
      isCooked = true;
    } else {
      isRaw = true;
    }
  }

  const primaryType: FoodCategoryType = isCooked ? 'COOKED_MEAL' : 'RAW_INGREDIENT';

  // Platforms tailored to food type
  const readyMealPlatforms: DeliveryPlatform[] = [
    DELIVERY_PLATFORMS.swiggy,
    DELIVERY_PLATFORMS.zomato
  ];

  const groceryPlatforms: DeliveryPlatform[] = [
    DELIVERY_PLATFORMS.swiggy_instamart,
    DELIVERY_PLATFORMS.blinkit,
    DELIVERY_PLATFORMS.zepto,
    DELIVERY_PLATFORMS.bigbasket,
    DELIVERY_PLATFORMS.local_grocery
  ];

  return {
    primaryType,
    isCooked,
    isRawIngredient: isRaw,
    readyMealPlatforms,
    groceryPlatforms,
    formattedSearchTerm: cleanQueryForSearch(food.name),
    ingredientsList
  };
}

/**
 * Safe navigation function that opens official external app/website search
 * Never claims PregNutri AI sells or delivers food.
 */
export function navigateToExternalPlatform(
  platform: DeliveryPlatform,
  query: string,
  location?: GlobalLocationState
): string {
  const url = platform.buildSearchUrl(query, location);
  
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return url;
}

/**
 * Universal safe external navigation helper
 * Strictly prevents '#', 'javascript:void(0)', and unverified endpoints
 */
export function navigateToExternalUrl(url: string): boolean {
  if (!url || url === '#' || url.startsWith('javascript:') || url === 'undefined') {
    console.warn('Navigation canceled: Invalid or unverified external URL:', url);
    return false;
  }
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }
  return false;
}

export type ItemCategoryKind = 'prepared_food' | 'grocery' | 'pharmacy' | 'maternity_gear';

export interface DeliveryOption {
  providerId: string;
  providerName: string;
  providerType: 'prepared_food' | 'grocery' | 'pharmacy' | 'maternity_gear' | 'local_store';
  destinationUrl: string;
  verifiedOfficialDomain: string;
  badge: string;
  actionLabel: string;
  shortDescription: string;
  theme: {
    buttonBg: string;
    buttonHover: string;
    buttonText: string;
    badgeBg: string;
    badgeText: string;
  };
}

/**
 * Strips clinical annotations, parentheticals, and marketing fluff
 * to construct high-accuracy search queries for external delivery search engines.
 */
export function cleanSearchKeyword(rawName: string): string {
  if (!rawName) return '';
  let cleaned = rawName
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  // Strip brand prefixes or marketing filler if present at the beginning
  cleaned = cleaned
    .replace(/^(Apollo Pharmacy|Apollo 24\|7|Royal|Pure A2|Pure Certified|Grade-A|100%|Organic Stone-Ground|Stone-ground|Certified Organic|Certified Pure|Ergonomic C-Shaped|Roasted|Cold Pressed)\s+/i, '')
    .trim();

  // Strip marketing filler if present at the end
  cleaned = cleaned
    .replace(/\s+(Multi-Micronutrient Pack|Chewables|Healthy Snack Mix|Mongra Saffron \(Kesar\)|Bilona Churned)$/i, '')
    .trim();

  if (cleaned.length < 3) {
    cleaned = rawName.replace(/\(.*?\)/g, '').trim();
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Strictly classifies an item to avoid associating pharmacies with food products
 * or prepared-food restaurant delivery with raw flours/oils/seeds.
 */
export function classifyItemType(item: {
  name: string;
  category?: string;
  description?: string;
  maternalTip?: string;
}): ItemCategoryKind {
  const nameLower = (item.name || '').toLowerCase();
  const categoryLower = (item.category || '').toLowerCase();

  // 1. Pharmacy / Medical Supplements
  const pharmacyKeywords = [
    'apollo pharmacy', 'multivitamin', 'micronutrient', 'folate', 'folic acid',
    'iron & folate', 'calcium & vitamin', 'calcium d3', 'prenatal supplement',
    'chewables', 'tablets', 'capsules', 'supplement pack', 'ifa tablet'
  ];
  if (
    categoryLower.includes('apollo') ||
    categoryLower.includes('pharmacy') ||
    categoryLower.includes('supplement') ||
    categoryLower.includes('medicine') ||
    pharmacyKeywords.some(kw => nameLower.includes(kw))
  ) {
    return 'pharmacy';
  }

  // 2. Maternity Comfort & Gear (pillows, belts, nursing accessories)
  const gearKeywords = ['pillow', 'belt', 'cushion', 'support gear', 'maternity wear', 'nursing pad'];
  if (
    categoryLower.includes('maternal care') && gearKeywords.some(kw => nameLower.includes(kw)) ||
    gearKeywords.some(kw => nameLower.includes(kw))
  ) {
    return 'maternity_gear';
  }

  // 3. Prepared Food / Cooked Dishes
  const cookedKeywords = [
    'idli', 'dosa', 'bisi bele bath', 'mudde', 'sambar', 'upma', 'khichdi',
    'biryani', 'curry', 'rasam', 'thepla', 'dhokla', 'pongal', 'pulao',
    'kichadi', 'kootu', 'poriyal', 'sabzi', 'dal fry', 'roti', 'paratha',
    'chapati', 'soup', 'stew', 'gravy', 'porridge', 'kanji', 'ladoo',
    'halwa', 'kheer', 'payasam', 'bath', 'thali', 'cooked meal'
  ];
  if (
    categoryLower.includes('traditional dishes') ||
    categoryLower.includes('meals') ||
    categoryLower.includes('snacks & soups') ||
    categoryLower.includes('prepared') ||
    cookedKeywords.some(kw => nameLower.includes(kw))
  ) {
    return 'prepared_food';
  }

  // 4. Default: Grocery / Raw Ingredients / Produce / Pantry Staples
  return 'grocery';
}

/**
 * Reusable Delivery Link Generator
 * Determines: Item Type + Food/Product Category + Location + Available Verified Providers
 * Returns strictly valid, verified providers with authentic search destinations.
 */
export function getDeliveryOptions(
  item: {
    name: string;
    category?: string;
    description?: string;
    maternalTip?: string;
    ingredients?: Array<string | { name: string }>;
  },
  location?: GlobalLocationState
): DeliveryOption[] {
  const itemType = classifyItemType(item);
  const keyword = cleanSearchKeyword(item.name);

  const options: DeliveryOption[] = [];

  switch (itemType) {
    case 'prepared_food':
      // 1. Swiggy Restaurant Search
      options.push({
        providerId: 'swiggy',
        providerName: 'Swiggy',
        providerType: 'prepared_food',
        destinationUrl: `https://www.swiggy.com/search?query=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'swiggy.com',
        badge: 'Restaurant Meal',
        actionLabel: 'Search on Swiggy ↗',
        shortDescription: 'Search for freshly prepared dishes from local kitchens on Swiggy.',
        theme: {
          buttonBg: 'bg-[#FC8019] hover:bg-[#e06f12]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#FC8019]/15',
          badgeText: 'text-[#FC8019]'
        }
      });

      // 2. Zomato Restaurant Search
      options.push({
        providerId: 'zomato',
        providerName: 'Zomato',
        providerType: 'prepared_food',
        destinationUrl: `https://www.zomato.com/search?q=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'zomato.com',
        badge: 'Restaurant Dining',
        actionLabel: 'Search on Zomato ↗',
        shortDescription: 'Find home-style meals and restaurant dining options for this dish on Zomato.',
        theme: {
          buttonBg: 'bg-[#CB202D] hover:bg-[#b01a25]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#CB202D]/15',
          badgeText: 'text-[#CB202D]'
        }
      });
      break;

    case 'grocery':
      // 1. Swiggy Instamart (Instant grocery search)
      options.push({
        providerId: 'swiggy_instamart',
        providerName: 'Swiggy Instamart',
        providerType: 'grocery',
        destinationUrl: `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'swiggy.com',
        badge: 'Instant Grocery',
        actionLabel: 'Find on Instamart ↗',
        shortDescription: 'Instant grocery doorstep delivery for pantry staples, flours, fruits and dairy.',
        theme: {
          buttonBg: 'bg-[#FC8019] hover:bg-[#e06f12]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#FC8019]/15',
          badgeText: 'text-[#FC8019]'
        }
      });

      // 2. Blinkit
      options.push({
        providerId: 'blinkit',
        providerName: 'Blinkit',
        providerType: 'grocery',
        destinationUrl: `https://blinkit.com/s/?q=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'blinkit.com',
        badge: 'Quick Grocery',
        actionLabel: 'Find on Blinkit ↗',
        shortDescription: 'Search 10-15 minute grocery inventory for fresh produce and grains on Blinkit.',
        theme: {
          buttonBg: 'bg-[#F4C430] hover:bg-[#e0b020]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-[#223030]',
          badgeBg: 'bg-[#F4C430]/20',
          badgeText: 'text-[#8F6B00]'
        }
      });

      // 3. BigBasket
      options.push({
        providerId: 'bigbasket',
        providerName: 'BigBasket',
        providerType: 'grocery',
        destinationUrl: `https://www.bigbasket.com/ps/?q=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'bigbasket.com',
        badge: 'Supermarket',
        actionLabel: 'Search on BigBasket ↗',
        shortDescription: 'Pan-India comprehensive grocery supermarket for traditional flours & staples.',
        theme: {
          buttonBg: 'bg-[#689F38] hover:bg-[#55842c]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#689F38]/15',
          badgeText: 'text-[#689F38]'
        }
      });

      // 4. Zepto
      options.push({
        providerId: 'zepto',
        providerName: 'Zepto',
        providerType: 'grocery',
        destinationUrl: `https://www.zeptonow.com/search?query=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'zeptonow.com',
        badge: '10-Min Delivery',
        actionLabel: 'Find on Zepto ↗',
        shortDescription: 'Search fresh dairy, nuts, seeds, and kitchen ingredients on Zepto.',
        theme: {
          buttonBg: 'bg-[#8B1874] hover:bg-[#72135f]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#8B1874]/15',
          badgeText: 'text-[#8B1874]'
        }
      });
      break;

    case 'pharmacy':
      // 1. Apollo Pharmacy
      options.push({
        providerId: 'apollo_pharmacy',
        providerName: 'Apollo Pharmacy',
        providerType: 'pharmacy',
        destinationUrl: `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'apollopharmacy.in',
        badge: 'Certified Pharmacy',
        actionLabel: 'Search on Apollo ↗',
        shortDescription: 'Search licensed pharmacy inventory for maternal vitamins, calcium, and iron supplements.',
        theme: {
          buttonBg: 'bg-[#007074] hover:bg-[#005a5d]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#007074]/15',
          badgeText: 'text-[#007074]'
        }
      });

      // 2. Tata 1mg
      options.push({
        providerId: 'tata_1mg',
        providerName: 'Tata 1mg',
        providerType: 'pharmacy',
        destinationUrl: `https://www.1mg.com/search/all?name=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: '1mg.com',
        badge: 'Online Health & Meds',
        actionLabel: 'Search on 1mg ↗',
        shortDescription: 'Order doctor-prescribed prenatal multivitamins and nutritional supplements on Tata 1mg.',
        theme: {
          buttonBg: 'bg-[#FF6F61] hover:bg-[#e85c4e]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#FF6F61]/15',
          badgeText: 'text-[#FF6F61]'
        }
      });
      break;

    case 'maternity_gear':
      // 1. FirstCry
      options.push({
        providerId: 'firstcry',
        providerName: 'FirstCry',
        providerType: 'maternity_gear',
        destinationUrl: `https://www.firstcry.com/search?q=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'firstcry.com',
        badge: 'Maternity Care',
        actionLabel: 'Search on FirstCry ↗',
        shortDescription: 'Dedicated Indian mother & baby platform for maternity support pillows and comfort gear.',
        theme: {
          buttonBg: 'bg-[#FF585D] hover:bg-[#e4464b]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#FF585D]/15',
          badgeText: 'text-[#FF585D]'
        }
      });

      // 2. Amazon India
      options.push({
        providerId: 'amazon_india',
        providerName: 'Amazon India',
        providerType: 'maternity_gear',
        destinationUrl: `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`,
        verifiedOfficialDomain: 'amazon.in',
        badge: 'E-Commerce',
        actionLabel: 'Search on Amazon ↗',
        shortDescription: 'Search certified ergonomic pregnancy pillows and maternal comfort gear on Amazon.',
        theme: {
          buttonBg: 'bg-[#232F3E] hover:bg-[#131921]',
          buttonHover: 'hover:brightness-95',
          buttonText: 'text-white',
          badgeBg: 'bg-[#232F3E]/15',
          badgeText: 'text-[#232F3E]'
        }
      });
      break;
  }

  return options;
}

