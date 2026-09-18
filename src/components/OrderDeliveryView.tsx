import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Search,
  MapPin,
  Utensils,
  Store,
  CheckCircle2,
  Info,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { GlobalLocationState, OrderProduct } from '../types';
import { CURATED_REGIONAL_RECIPES } from '../data/regional_recipes_db';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from '../services/kaggle_food_pipeline';
import { FoodSubtitle } from '../services/language_service';

interface OrderDeliveryViewProps {
  products?: OrderProduct[];
  globalLocation?: GlobalLocationState;
}

interface PreparedFoodItem {
  id: string;
  name: string;
  regionalName?: string;
  category: string;
  cuisine: string;
  image: string;
  isVegetarian: boolean;
  state: string;
  ingredients: string[];
}

interface GroceryIngredientItem {
  id: string;
  name: string;
  category: 'Millets & Flours' | 'Pulses & Dal' | 'Fresh Produce & Dairy' | 'Seeds, Nuts & Healthy Fats';
  benefit: string;
  recommendedPrep?: string;
}

// Clean text for optimal delivery app search query
function cleanForSearch(name: string): string {
  if (!name) return '';
  const parts = name.split(/[()]/).map(s => s.trim()).filter(Boolean);
  const first = parts[0] || name;
  return first.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Curated authentic raw kitchen ingredients for pregnancy nutrition
const CURATED_GROCERY_INGREDIENTS: GroceryIngredientItem[] = [
  // Millets & Flours
  {
    id: 'ing-ragi-flour',
    name: 'Ragi Flour (Finger Millet)',
    category: 'Millets & Flours',
    benefit: 'Highest vegetable source of calcium (344mg/100g) for fetal bone development.',
    recommendedPrep: 'For Ragi Mudde, Ragi Dosa, or Porridge'
  },
  {
    id: 'ing-jowar-flour',
    name: 'Jowar Flour (Sorghum)',
    category: 'Millets & Flours',
    benefit: 'Gluten-free complex carb, regulates gestational insulin spikes.',
    recommendedPrep: 'For traditional Bhakri / Rotla'
  },
  {
    id: 'ing-bajra-flour',
    name: 'Bajra Flour (Pearl Millet)',
    category: 'Millets & Flours',
    benefit: 'Rich in non-heme iron and magnesium, helps combat gestational anemia.',
    recommendedPrep: 'For winter rotis and savory porridge'
  },
  {
    id: 'ing-sharbati-atta',
    name: 'Whole Wheat Sharbati Atta',
    category: 'Millets & Flours',
    benefit: 'High-fiber unrefined grain supporting smooth maternal bowel motility.',
    recommendedPrep: 'For fresh Phulkas and Parathas'
  },
  {
    id: 'ing-rolled-oats',
    name: 'Whole Rolled Oats',
    category: 'Millets & Flours',
    benefit: 'Soluble beta-glucan fiber to stabilize maternal cholesterol and energy.',
    recommendedPrep: 'For morning oatmeal or khichdi'
  },

  // Pulses & Dal
  {
    id: 'ing-toor-dal',
    name: 'Organic Toor Dal (Pigeon Pea)',
    category: 'Pulses & Dal',
    benefit: 'Essential amino acids and folic acid for cellular replication.',
    recommendedPrep: 'For Sambar, Dal Tadka, and Rasam'
  },
  {
    id: 'ing-yellow-moong',
    name: 'Yellow Moong Dal (Split Green Gram)',
    category: 'Pulses & Dal',
    benefit: 'Easiest pulse to digest in pregnancy, prevents bloat and acid reflux.',
    recommendedPrep: 'For comforting Moong Dal Khichdi'
  },
  {
    id: 'ing-chana-dal',
    name: 'Bengal Gram (Chana Dal)',
    category: 'Pulses & Dal',
    benefit: 'Dense vegetable protein and low glycemic index energy.',
    recommendedPrep: 'For tempering, Sundal, and curries'
  },
  {
    id: 'ing-urad-dal',
    name: 'Whole Black Urad Dal',
    category: 'Pulses & Dal',
    benefit: 'High in iron, phosphorus, and zinc for maternal vital blood volume.',
    recommendedPrep: 'For Idli / Dosa batter and Dal Makhani'
  },

  // Fresh Produce & Dairy
  {
    id: 'ing-cow-curd',
    name: 'Desi Cow Milk Curd (Dahi)',
    category: 'Fresh Produce & Dairy',
    benefit: 'Natural probiotics, cooling calcium, prevents heartburn and acidity.',
    recommendedPrep: 'For Mosaru Anna (Curd Rice) and Chaas'
  },
  {
    id: 'ing-paneer',
    name: 'Fresh Malai Paneer',
    category: 'Fresh Produce & Dairy',
    benefit: 'High-density dairy protein and bioavailable calcium for fetal tissue.',
    recommendedPrep: 'For Palak Paneer and light stir-fries'
  },
  {
    id: 'ing-fresh-spinach',
    name: 'Fresh Spinach (Palak)',
    category: 'Fresh Produce & Dairy',
    benefit: 'Folate (Vitamin B9) to protect against neural tube defects.',
    recommendedPrep: 'Wash thoroughly; cook in dal or sabzi'
  },
  {
    id: 'ing-curry-leaves',
    name: 'Tender Curry Leaves (Kadi Patta)',
    category: 'Fresh Produce & Dairy',
    benefit: 'Rich in plant iron and volatile antioxidants for healthy digestion.',
    recommendedPrep: 'For aromatic South Indian tempering'
  },
  {
    id: 'ing-lemons',
    name: 'Fresh Juicy Lemons',
    category: 'Fresh Produce & Dairy',
    benefit: 'Natural Vitamin C to quadruple dietary non-heme iron absorption.',
    recommendedPrep: 'Squeeze over meals or Chitranna'
  },

  // Seeds, Nuts & Healthy Fats
  {
    id: 'ing-flax-seeds',
    name: 'Roasted Flax Seeds (Alsi)',
    category: 'Seeds, Nuts & Healthy Fats',
    benefit: 'Plant-based Omega-3 (ALA) and lignans for fetal nervous system.',
    recommendedPrep: 'Add 1 tsp to curd or smoothies daily'
  },
  {
    id: 'ing-chia-seeds',
    name: 'Raw Chia Seeds',
    category: 'Seeds, Nuts & Healthy Fats',
    benefit: 'Soluble mucilage fiber and calcium to relieve pregnancy constipation.',
    recommendedPrep: 'Soak in water or coconut milk'
  },
  {
    id: 'ing-almonds',
    name: 'Raw California Almonds (Badam)',
    category: 'Seeds, Nuts & Healthy Fats',
    benefit: 'Vitamin E, magnesium, and healthy fats supporting placental health.',
    recommendedPrep: 'Soak overnight, peel skin before eating'
  },
  {
    id: 'ing-cold-pressed-oil',
    name: 'Cold Pressed Groundnut / Sesame Oil',
    category: 'Seeds, Nuts & Healthy Fats',
    benefit: 'Unrefined healthy monounsaturated fatty acids without chemical trans-fats.',
    recommendedPrep: 'For gentle culinary sautéing and tempering'
  }
];

export const OrderDeliveryView: React.FC<OrderDeliveryViewProps> = ({
  products,
  globalLocation
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'prepared' | 'groceries'>('prepared');
  const [preparedSearch, setPreparedSearch] = useState('');
  const [grocerySearch, setGrocerySearch] = useState('');
  const [selectedGroceryGroup, setSelectedGroceryGroup] = useState<string>('All');

  const locationCity = globalLocation?.city || globalLocation?.district || 'Mysuru';
  const locationState = globalLocation?.state || 'Karnataka';

  // Extract authentic prepared dishes from recipes and food dataset
  const preparedDishes: PreparedFoodItem[] = useMemo(() => {
    const list: PreparedFoodItem[] = [];

    // From CURATED_REGIONAL_RECIPES
    CURATED_REGIONAL_RECIPES.forEach(r => {
      list.push({
        id: r.recipeId,
        name: r.nameEnglish || r.traditionalName,
        regionalName: r.traditionalName !== r.nameEnglish ? r.traditionalName : undefined,
        category: r.category || 'Main Course',
        cuisine: r.region ? `${r.region} Indian` : 'Indian',
        image: r.photoUrl || r.referenceImageUrl || '',
        isVegetarian: r.isVegetarian ?? true,
        state: r.state || 'Karnataka',
        ingredients: (r.ingredients || []).map(i => i.name)
      });
    });

    // Add key authentic foods from KAGGLE_PROCESSED_FOOD_DATABASE
    KAGGLE_PROCESSED_FOOD_DATABASE.slice(0, 35).forEach(f => {
      if (!list.some(item => item.name.toLowerCase() === f.name.toLowerCase())) {
        list.push({
          id: f.id,
          name: f.name,
          regionalName: f.regionalName,
          category: f.category,
          cuisine: f.cuisine,
          image: f.image,
          isVegetarian: f.isVegetarian,
          state: f.state || 'Karnataka',
          ingredients: f.ingredients || []
        });
      }
    });

    return list;
  }, []);

  // Filtered Prepared Dishes
  const filteredPreparedDishes = useMemo(() => {
    if (!preparedSearch.trim()) return preparedDishes;
    const q = preparedSearch.toLowerCase().trim();
    return preparedDishes.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        (d.regionalName && d.regionalName.toLowerCase().includes(q)) ||
        d.state.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [preparedDishes, preparedSearch]);

  // Filtered Groceries
  const filteredGroceryIngredients = useMemo(() => {
    let list = CURATED_GROCERY_INGREDIENTS;
    if (selectedGroceryGroup !== 'All') {
      list = list.filter(i => i.category === selectedGroceryGroup);
    }
    if (grocerySearch.trim()) {
      const q = grocerySearch.toLowerCase().trim();
      list = list.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.benefit.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedGroceryGroup, grocerySearch]);

  const handleOpenSwiggy = (dishName: string) => {
    const q = cleanForSearch(dishName);
    const url = `https://www.swiggy.com/search?query=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenZomato = (dishName: string) => {
    const q = cleanForSearch(dishName);
    const url = `https://www.zomato.com/search?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenBlinkit = (ingredientName: string) => {
    const q = cleanForSearch(ingredientName);
    const url = `https://blinkit.com/s/?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInstamart = (ingredientName: string) => {
    const q = cleanForSearch(ingredientName);
    const url = `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <div className="bg-[#EFEFE9] rounded-3xl p-6 sm:p-8 border border-[#959D90]/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D9CD] border border-[#959D90]/50 text-xs font-bold text-[#523D35]">
              <ShoppingBag className="w-3.5 h-3.5 text-[#523D35]" />
              <span>External Food &amp; Grocery Ordering</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#223030] tracking-tight">
              Food Ordering Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#523D35] max-w-3xl">
              Connect directly with official food delivery (Swiggy, Zomato) and quick-grocery services (Blinkit) for authentic prepared meals and raw kitchen ingredients.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E8D9CD] border border-[#959D90]/50 text-xs font-bold text-[#223030] self-start sm:self-center shrink-0">
            <MapPin className="w-4 h-4 text-[#523D35]" />
            <div>
              <span className="block text-[10px] text-[#523D35] uppercase tracking-wider font-extrabold">Delivery Location</span>
              <span>{locationCity}, {locationState}</span>
            </div>
          </div>
        </div>

        {/* Informative Transparency Banner */}
        <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/50 flex items-start gap-3 text-xs text-[#523D35]">
          <Info className="w-4 h-4 text-[#523D35] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#223030] font-bold">Truthful Navigation Notice:</strong> PregNutri AI never shows fake restaurant ratings, artificial discounts, or simulated food prices. Clicking any button dynamically searches the official external service, where real-time menus, live restaurant availability, and delivery fees are displayed directly.
          </p>
        </div>

        {/* 2. Category Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#959D90]/30">
          <button
            type="button"
            onClick={() => setActiveCategoryTab('prepared')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeCategoryTab === 'prepared'
                ? 'bg-[#223030] text-[#EFEFE9] shadow-sm'
                : 'bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] border border-[#959D90]/40'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Category A: Prepared Food (Swiggy &amp; Zomato)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab('groceries')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeCategoryTab === 'groceries'
                ? 'bg-[#223030] text-[#EFEFE9] shadow-sm'
                : 'bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] border border-[#959D90]/40'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Category B: Raw Kitchen Ingredients (Blinkit)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CATEGORY A: PREPARED RESTAURANT FOOD (Swiggy & Zomato)                 */}
      {/* ========================================================================= */}
      {activeCategoryTab === 'prepared' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search & Dynamic Action Bar */}
          <div className="bg-[#EFEFE9] rounded-3xl p-5 sm:p-6 border border-[#959D90]/60 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#523D35]" />
                <input
                  type="text"
                  value={preparedSearch}
                  onChange={e => setPreparedSearch(e.target.value)}
                  placeholder="Search any prepared dish (e.g. Mosaru Anna, Chitranna, Rava Idli, Khichdi, Palak Paneer)..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#E8D9CD] border border-[#959D90]/50 text-xs sm:text-sm font-semibold text-[#223030] placeholder-[#523D35]/70 focus:outline-none focus:ring-1 focus:ring-[#223030]"
                />
              </div>

              {/* Direct Dynamic Buttons for current query */}
              {preparedSearch.trim() && (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenSwiggy(preparedSearch)}
                    className="px-4 py-3 bg-[#FC8019] hover:bg-[#E26A05] text-white font-black text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title={`Search "${cleanForSearch(preparedSearch)}" on Swiggy`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Search on Swiggy</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenZomato(preparedSearch)}
                    className="px-4 py-3 bg-[#E23744] hover:bg-[#C92C38] text-white font-black text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title={`Search "${cleanForSearch(preparedSearch)}" on Zomato`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Search on Zomato</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </button>
                </div>
              )}
            </div>

            {/* Subtext under search */}
            <div className="flex items-center justify-between text-xs text-[#523D35] flex-wrap gap-2">
              <span>Showing {filteredPreparedDishes.length} authentic dishes suitable for maternal nutrition.</span>
              <span className="italic">Click Swiggy or Zomato to open official search for that exact dish.</span>
            </div>
          </div>

          {/* Grid of Authentic Prepared Dishes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPreparedDishes.map(dish => {
              const cleanName = cleanForSearch(dish.name);

              return (
                <div
                  key={dish.id}
                  className="bg-[#EFEFE9] rounded-3xl border border-[#959D90]/60 overflow-hidden shadow-xs hover:border-[#223030] transition flex flex-col justify-between"
                >
                  <div>
                    {/* Dish Photo */}
                    <div className="relative h-44 bg-[#E8D9CD] overflow-hidden">
                      {dish.image ? (
                        <img
                          src={dish.image}
                          alt={dish.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#523D35]">
                          <Utensils className="w-10 h-10 opacity-40" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white ${
                            dish.isVegetarian ? 'bg-emerald-800' : 'bg-rose-800'
                          }`}
                        >
                          {dish.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-bold">
                        {dish.state}
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="p-5 space-y-2.5">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#523D35]">
                          {dish.category} • {dish.cuisine}
                        </span>
                        <h3 className="text-base font-black text-[#223030] leading-snug">
                          {dish.name}
                        </h3>
                        <FoodSubtitle
                          foodName={dish.name}
                          regionalName={dish.regionalName}
                          className="text-xs text-[#523D35] font-medium"
                        />
                      </div>

                      {dish.ingredients && dish.ingredients.length > 0 && (
                        <div className="text-[11px] text-[#523D35] leading-relaxed line-clamp-2">
                          <strong className="text-[#223030]">Key Ingredients: </strong>
                          {dish.ingredients.slice(0, 5).join(', ')}
                          {dish.ingredients.length > 5 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* External Ordering Action Buttons */}
                  <div className="p-5 pt-0 space-y-2 border-t border-[#959D90]/30 mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D35] block pt-3">
                      Order Prepared Meal:
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Swiggy Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenSwiggy(dish.name)}
                        className="py-2.5 px-3 bg-[#FC8019] hover:bg-[#E26A05] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                        title={`Search "${cleanName}" on Swiggy in a new browser tab`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Swiggy</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-white/80" />
                      </button>

                      {/* Zomato Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenZomato(dish.name)}
                        className="py-2.5 px-3 bg-[#E23744] hover:bg-[#C92C38] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                        title={`Search "${cleanName}" on Zomato in a new browser tab`}
                      >
                        <Utensils className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Zomato</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-white/80" />
                      </button>
                    </div>

                    <div className="text-[10px] text-[#523D35] italic text-center truncate" title={`Opens external search for "${cleanName}"`}>
                      Opens search for &ldquo;{cleanName}&rdquo; near {locationCity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CATEGORY B: RAW KITCHEN INGREDIENTS (Blinkit)                           */}
      {/* ========================================================================= */}
      {activeCategoryTab === 'groceries' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Search & Dynamic Blinkit Query Bar */}
          <div className="bg-[#EFEFE9] rounded-3xl p-5 sm:p-6 border border-[#959D90]/60 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#523D35]" />
                <input
                  type="text"
                  value={grocerySearch}
                  onChange={e => setGrocerySearch(e.target.value)}
                  placeholder="Search any raw food or kitchen ingredient (e.g. Ragi flour, Cow curd, Toor dal, Chia seeds)..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#E8D9CD] border border-[#959D90]/50 text-xs sm:text-sm font-semibold text-[#223030] placeholder-[#523D35]/70 focus:outline-none focus:ring-1 focus:ring-[#223030]"
                />
              </div>

              {/* Direct Dynamic Blinkit Button for current query */}
              {grocerySearch.trim() && (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenBlinkit(grocerySearch)}
                    className="px-4 py-3 bg-[#F8CB46] hover:bg-[#E5B834] text-[#1E1E1E] font-black text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs border border-[#D8A720]"
                    title={`Search "${cleanForSearch(grocerySearch)}" on Blinkit (10-15 Min)`}
                  >
                    <Store className="w-4 h-4 text-[#1E1E1E]" />
                    <span>Search on Blinkit</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#1E1E1E]/80" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInstamart(grocerySearch)}
                    className="px-3.5 py-3 bg-[#FC8019] hover:bg-[#E26A05] text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title={`Search "${cleanForSearch(grocerySearch)}" on Swiggy Instamart`}
                  >
                    <span>Instamart</span>
                    <ExternalLink className="w-3 h-3 text-white/80" />
                  </button>
                </div>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-[#959D90]/30">
              {['All', 'Millets & Flours', 'Pulses & Dal', 'Fresh Produce & Dairy', 'Seeds, Nuts & Healthy Fats'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedGroceryGroup(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedGroceryGroup === cat
                      ? 'bg-[#223030] text-[#EFEFE9]'
                      : 'bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] border border-[#959D90]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Curated Raw Ingredients Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGroceryIngredients.map(ing => {
              const cleanName = cleanForSearch(ing.name);

              return (
                <div
                  key={ing.id}
                  className="bg-[#EFEFE9] rounded-3xl border border-[#959D90]/60 p-5 shadow-xs hover:border-[#223030] transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#E8D9CD] text-[#523D35] border border-[#959D90]/40">
                        {ing.category}
                      </span>
                      <span className="text-[10px] font-bold text-[#523D35] flex items-center gap-1">
                        <Store className="w-3 h-3 text-[#523D35]" />
                        <span>Quick Grocery</span>
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#223030] leading-snug">
                      {ing.name}
                    </h3>

                    <p className="text-xs text-[#523D35] leading-relaxed">
                      {ing.benefit}
                    </p>

                    {ing.recommendedPrep && (
                      <div className="text-[11px] font-semibold text-[#223030] bg-[#E8D9CD] p-2.5 rounded-xl border border-[#959D90]/30">
                        <span className="text-[#523D35] block text-[10px] uppercase tracking-wider font-extrabold">Culinary Application:</span>
                        {ing.recommendedPrep}
                      </div>
                    )}
                  </div>

                  {/* Blinkit Quick-Commerce Action */}
                  <div className="space-y-2 pt-2 border-t border-[#959D90]/30">
                    <button
                      type="button"
                      onClick={() => handleOpenBlinkit(ing.name)}
                      className="w-full py-2.5 px-4 bg-[#F8CB46] hover:bg-[#E5B834] text-[#1E1E1E] rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs border border-[#D8A720]"
                      title={`Search "${cleanName}" on Blinkit (10-15 Min delivery)`}
                    >
                      <Store className="w-3.5 h-3.5 text-[#1E1E1E]" />
                      <span>Search on Blinkit (10-15 Min)</span>
                      <ExternalLink className="w-3 h-3 text-[#1E1E1E]/80" />
                    </button>

                    <div className="text-[10px] text-[#523D35] italic text-center">
                      Opens official Blinkit search for &ldquo;{cleanName}&rdquo; near {locationCity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
