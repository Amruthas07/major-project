import React, { useState, useMemo } from 'react';
import { KaggleFoodItem, GlobalLocationState, PlannedMeal } from '../types';
import { KAGGLE_PROCESSED_FOOD_DATABASE, kagglePipeline } from '../services/kaggle_food_pipeline';
import { CURATED_REGIONAL_RECIPES } from '../data/regional_recipes_db';
import { useLanguage, DualText, DualFoodName, FoodSubtitle, DualIngredient } from '../services/language_service';
import { useAppContext } from '../context/AppContext';
import { getRecipeForFood as getCentralizedRecipe } from '../services/recipe_service';
import { RegionalRecipe } from '../types/recipe';
import { RegionalRecipeDetailModal } from './RegionalRecipeDetailModal';
import { checkFoodAllergies } from '../utils/allergy_checker';
import { FoodAlternativeModal } from './FoodAlternativeModal';
import { FoodOrderingModal } from './FoodOrderingModal';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Flame,
  ShieldCheck,
  Tag,
  Info,
  Sparkles,
  ExternalLink,
  MapPin,
  Filter,
  SlidersHorizontal,
  Layers,
  Heart,
  RotateCcw,
  Check,
  Database,
  X,
  ChefHat,
  Clock,
  Utensils,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  Bone,
  Dumbbell,
  Leaf,
  Activity,
  Droplets,
  Wheat
} from 'lucide-react';
import { FoodOrderingSection } from './FoodOrderingSection';
import { FoodImageViewerModal } from './FoodImageViewerModal';
import { VerifiedFoodImage } from './VerifiedFoodImage';
import { normalizeDietPreference, isFoodEligibleForDiet, getFoodDietType } from '../utils/diet_preference';
import { VoiceListenButton, VoiceSearchButton } from './VoiceButton';
import { voiceService } from '../services/voice_service';

export const FoodDatabaseView: React.FC = () => {
  const {
    globalLocation,
    meals,
    selectedDay,
    openAddToPlanModal,
    removeMeal,
    updateMealServings,
    setActiveTab,
    userProfile,
    selectedTrimester
  } = useAppContext();

  const { t, isEnglish, currentLanguageCode, tCategory, tIngredient } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSafety, setSelectedSafety] = useState<string>('All');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [filterAreaFoodsOnly, setFilterAreaFoodsOnly] = useState<boolean>(false);
  const [selectedTrimesterFilter, setSelectedTrimesterFilter] = useState<string>('All');
  const [minProtein, setMinProtein] = useState<number>(0);
  const [minIron, setMinIron] = useState<number>(0);
  const [minCalcium, setMinCalcium] = useState<number>(0);
  const [minFolate, setMinFolate] = useState<number>(0);
  const [prioritizeLocal, setPrioritizeLocal] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [activeModalFood, setActiveModalFood] = useState<KaggleFoodItem | null>(null);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<RegionalRecipe | null>(null);
  const [alternativeTargetFood, setAlternativeTargetFood] = useState<KaggleFoodItem | null>(null);
  const [viewerFood, setViewerFood] = useState<KaggleFoodItem | null>(null);
  const [recipeNoticeFood, setRecipeNoticeFood] = useState<string | null>(null);
  const [orderingFood, setOrderingFood] = useState<KaggleFoodItem | null>(null);

  // Swiggy food search query generator
  const getSwiggySearchTerm = (foodName: string): string => {
    if (!foodName) return '';
    let clean = foodName.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
    clean = clean.replace(/ with .*$/i, '').trim();
    return clean || foodName.trim();
  };

  const handleOrderOnSwiggy = (food: KaggleFoodItem) => {
    const searchTerm = getSwiggySearchTerm(food.name);
    const swiggyUrl = `https://www.swiggy.com/search?query=${encodeURIComponent(searchTerm)}`;
    window.open(swiggyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewRecipe = (food: KaggleFoodItem) => {
    const matchedRecipe = getCentralizedRecipe(food);
    if (matchedRecipe) {
      setSelectedRecipeDetail(matchedRecipe);
    } else {
      setRecipeNoticeFood(food.name);
    }
  };

  // Nutritional benefit indicators matching reference healthcare UI
  type BenefitIconType = 'leaf' | 'dumbbell' | 'activity' | 'heart' | 'bone' | 'droplet' | 'sparkles' | 'wheat';

  interface NutrientIndicator {
    prefix: string;
    label: string;
    iconType: BenefitIconType;
  }

  const getNutritionalIndicators = (food: KaggleFoodItem): NutrientIndicator[] => {
    const indicators: NutrientIndicator[] = [];

    // 1. Folate
    if ((food.folate || 0) >= 40) {
      indicators.push({ prefix: 'Rich in', label: 'Folate', iconType: 'leaf' });
    } else if ((food.folate || 0) >= 20) {
      indicators.push({ prefix: 'Source of', label: 'Folate', iconType: 'leaf' });
    }

    // 2. Calcium
    if ((food.calcium || 0) >= 100) {
      indicators.push({ prefix: 'Rich in', label: 'Calcium', iconType: 'bone' });
    } else if ((food.calcium || 0) >= 40) {
      indicators.push({ prefix: 'Source of', label: 'Calcium', iconType: 'bone' });
    }

    // 3. Iron
    if ((food.iron || 0) >= 2.2) {
      indicators.push({ prefix: 'Rich in', label: 'Iron', iconType: 'droplet' });
    } else if ((food.iron || 0) >= 1.2) {
      indicators.push({ prefix: 'Source of', label: 'Iron', iconType: 'droplet' });
    }

    // 4. Protein
    if ((food.protein || 0) >= 10) {
      indicators.push({ prefix: 'High', label: 'Protein', iconType: 'dumbbell' });
    } else if ((food.protein || 0) >= 5) {
      indicators.push({ prefix: 'Good', label: 'Protein', iconType: 'dumbbell' });
    } else if ((food.protein || 0) >= 2.5) {
      indicators.push({ prefix: 'Moderate', label: 'Protein', iconType: 'dumbbell' });
    }

    // 5. Probiotics
    if (/curd|yogurt|mosaru|dahi|buttermilk|ferment/i.test(food.name) || food.tags?.some(t => /probiotic/i.test(t))) {
      indicators.push({ prefix: 'Good', label: 'Probiotics', iconType: 'sparkles' });
    }

    // 6. Digestion / Gut comfort
    if (
      /curd|mosaru|idli|khichdi|chitranna|porridge|rice|soup|rasam|kanji/i.test(food.name) ||
      food.tags?.some(t => /digest|nausea|soothing|cooling/i.test(t))
    ) {
      const isCurd = /curd|mosaru/i.test(food.name);
      indicators.push({
        prefix: isCurd ? 'Supports' : 'Easy to',
        label: isCurd ? 'Digestion' : 'Digest',
        iconType: 'activity'
      });
    }

    // 7. Carbohydrates
    if ((food.carbohydrates || 0) >= 30) {
      indicators.push({ prefix: 'Source of', label: 'Carbohydrates', iconType: 'wheat' });
    }

    // 8. Pregnancy Friendly
    if (food.safetyLevel === 'Safe') {
      indicators.push({ prefix: 'Pregnancy', label: 'Friendly', iconType: 'heart' });
    } else if (food.safetyLevel === 'Safe in Moderation') {
      indicators.push({ prefix: 'Portion', label: 'Control', iconType: 'heart' });
    }

    // Deduplicate by label
    const seen = new Set<string>();
    const unique: NutrientIndicator[] = [];
    for (const item of indicators) {
      if (!seen.has(item.label)) {
        seen.add(item.label);
        unique.push(item);
      }
      if (unique.length >= 4) break;
    }

    if (unique.length < 4 && !seen.has('Friendly')) {
      unique.push({ prefix: 'Pregnancy', label: 'Friendly', iconType: 'heart' });
      seen.add('Friendly');
    }
    if (unique.length < 4 && !seen.has('Folate') && !seen.has('Iron')) {
      unique.push({ prefix: 'Vital', label: 'Nutrients', iconType: 'leaf' });
    }

    const items = unique.slice(0, 4);
    if (isEnglish) return items;

    const nutrientLabels: Record<string, Record<string, string>> = {
      Folate: { hi: 'फोलेट', kn: 'ಫೋಲೇಟ್', ta: 'ஃபோலேட்', te: 'ఫోలేట్', ml: 'ഫോളേറ്റ്', mr: 'फोलेट', bn: 'ফোলেট', gu: 'ફોલેટ', pa: 'ਫੋਲੇਟ', or: 'ଫୋଲେଟ୍' },
      Calcium: { hi: 'कैल्शियम', kn: 'ಕ್ಯಾಲ್ಸಿಯಂ', ta: 'கால்சியம்', te: 'కాల్షియం', ml: 'കാൽസ്യം', mr: 'कॅल्शियम', bn: 'ক্যালসিয়াম', gu: 'કેલ્શિયમ', pa: 'ਕੈਲਸ਼ੀਅਮ', or: 'କ୍ୟାଲସିୟମ୍' },
      Iron: { hi: 'आयरन', kn: 'ಕಬ್ಬಿಣಾಂಶ', ta: 'இரும்புச்சத்து', te: 'ఐరన్', ml: 'ഇരുമ്പ്', mr: 'लोह', bn: 'আয়রন', gu: 'આયર્ન', pa: 'ਆਇਰਨ', or: 'ଲୁହା' },
      Protein: { hi: 'प्रोटीन', kn: 'ಪ್ರೋಟೀನ್', ta: 'புரதம்', te: 'ప్రోటీన్', ml: 'പ്രോട്ടീൻ', mr: 'प्रथिने', bn: 'প্রোটিন', gu: 'પ્રોટીન', pa: 'ਪ੍ਰੋਟੀਨ', or: 'ପ୍ରୋଟିନ୍' },
      Probiotics: { hi: 'प्रोबायोटिक्स', kn: 'ಪ್ರೋಬಯಾಟಿಕ್ಸ್', ta: 'புரோபயாடிக்குகள்', te: 'ప్రోబయోటిక్స్', ml: 'പ്രോബയോട്ടിക്സ്', mr: 'प्रोबायोटिक्स', bn: 'প্রোবায়োটিক', gu: 'પ્રોબાયોટિક્સ', pa: 'ਪ੍ਰੋਬਾਇਓਟਿਕਸ', or: 'ପ୍ରୋବାୟୋଟିକ୍ସ' },
      Digestion: { hi: 'पाचन', kn: 'ಜೀರ್ಣಕ್ರಿಯೆ', ta: 'செரிமானம்', te: 'జీర్ణక్రియ', ml: 'ദഹനം', mr: 'पचन', bn: 'হজম', gu: 'પાચન', pa: 'ਪਾਚਨ', or: 'ହଜମ' },
      Digest: { hi: 'पाचन सुलभ', kn: 'ಸುಲಭ ಜೀರ್ಣ', ta: 'செரிக்கும்', te: 'సులభ జీర్ణం', ml: 'എളുപ്പം ദഹിക്കുന്നത്', mr: 'सहज पचणारे', bn: 'সহজে হজমযোগ্য', gu: 'સરળ પાચન', pa: 'ਸੌਖਾ ਪਚਣ ਵਾਲਾ', or: 'ସହଜ ହଜମ' },
      Carbohydrates: { hi: 'कार्ब्स', kn: 'ಕಾರ್ಬೋಹೈಡ್ರೇಟ್', ta: 'கார்போஹைட்ரேட்', te: 'కార్బోహైడ్రేట్లు', ml: 'കാർബോഹൈഡ്രേറ്റ്', mr: 'कर्बोदके', bn: 'কার্বোহাইড্রেট', gu: 'કાર્બોહાઇડ્રેટ', pa: 'ਕਾਰਬੋਹਾਈਡ੍ਰੇਟ', or: 'କାର୍ବୋହାଇଡ୍ରେଟ୍' },
      Friendly: { hi: 'अनुकूल', kn: 'ಹಿತಕರ', ta: 'ஏற்றது', te: 'అనుకూలం', ml: 'അനുയോജ്യം', mr: 'अनुकूल', bn: 'অনুকূল', gu: 'અનુકૂળ', pa: 'ਅਨੁਕੂਲ', or: 'ଅନୁକୂଳ' },
      Control: { hi: 'नियंत्रण', kn: 'ನಿಯಂತ್ರಣ', ta: 'கட்டுப்பாடு', te: 'నియంత్రణ', ml: 'നിയന്ത്രണം', mr: 'नियंत्रण', bn: 'নিয়ন্ত্রণ', gu: 'નિયંત્રણ', pa: 'ਨਿਯੰਤਰਣ', or: 'ନିୟନ୍ତ୍ରଣ' },
      Nutrients: { hi: 'पोषक तत्व', kn: 'ಪೋಷಕಾಂಶಗಳು', ta: 'ஊட்டச்சத்துக்கள்', te: 'పోషకాలు', ml: 'പോഷകങ്ങൾ', mr: 'पोषक घटक', bn: 'পুষ্টি উপাদান', gu: 'પોષક તત્વો', pa: 'ਪੌਸ਼ਟਿਕ ਤੱਤ', or: 'ପୋଷକ ତତ୍ତ୍ୱ' }
    };
    const prefixLabels: Record<string, Record<string, string>> = {
      'Rich in': { hi: 'भरपूर', kn: 'ಉತ್ತಮ ಪ್ರಮಾಣ', ta: 'நிறைந்தது', te: 'సమృద్ధిగా', ml: 'ധാരാളം', mr: 'भरपूर', bn: 'সমৃদ্ধ', gu: 'ભરપૂર', pa: 'ਭਰਪੂਰ', or: 'ଭରପୂର' },
      'Source of': { hi: 'उत्तम स्रोत', kn: 'ಮೂಲ', ta: 'ஆதாரம்', te: 'మూలం', ml: 'സ്രോതസ്സ്', mr: 'स्रोत', bn: 'উৎস', gu: 'સ્ત્રોત', pa: 'ਸਰੋਤ', or: 'ଉତ୍ସ' },
      'High': { hi: 'उच्च', kn: 'ಅಧಿಕ', ta: 'அதிக', te: 'అధిక', ml: 'കൂടുതൽ', mr: 'उच्च', bn: 'উচ্চ', gu: 'ઉચ્ચ', pa: 'ਉੱਚ', or: 'ଉଚ୍ଚ' },
      'Good': { hi: 'अच्छा', kn: 'ಉತ್ತಮ', ta: 'நல்ல', te: 'మంచి', ml: 'നല്ല', mr: 'चांगले', bn: 'ভালো', gu: 'સારું', pa: 'ਚੰਗਾ', or: 'ଭଲ' },
      'Moderate': { hi: 'मध्यम', kn: 'ಸಾಧಾರಣ', ta: 'மிதமான', te: 'మితమైన', ml: 'മിതമായ', mr: 'मध्यम', bn: 'মাঝারি', gu: 'મધ્યમ', pa: 'ਦਰਮਿਆਨਾ', or: 'ମଧ୍ୟମ' },
      'Supports': { hi: 'सहायक', kn: 'ಸಹಾಯಕ', ta: 'ஆதரிக்கிறது', te: 'తోడ్పడుతుంది', ml: 'സഹായിക്കുന്നു', mr: 'मदत करते', bn: 'সহায়ক', gu: 'મદદરૂપ', pa: 'ਮਦਦਗਾਰ', or: 'ସହାୟକ' },
      'Easy to': { hi: 'सरल', kn: 'ಸುಲಭ', ta: 'சுலபமான', te: 'సులభమైన', ml: 'എളുപ്പമുള്ള', mr: 'सोपे', bn: 'সহজ', gu: 'સરળ', pa: 'ਆਸਾਨ', or: 'ସହਜ' },
      'Pregnancy': { hi: 'गर्भावस्था', kn: 'ಗರ್ಭಿಣಿ', ta: 'கர்ப்பகால', te: 'గర్భధారణ', ml: 'ഗർഭകാല', mr: 'गरोदरपण', bn: 'গর্ভাবস্থা', gu: 'ગર્ભાવસ્થા', pa: 'ਗਰਭ ਅਵਸਥਾ', or: 'ଗର୍ଭାବସ୍ଥା' },
      'Portion': { hi: 'मात्रा', kn: 'ಪ್ರಮಾಣ', ta: 'அளவு', te: 'మోతాదు', ml: 'അളവ്', mr: 'प्रमाण', bn: 'পরিমাণ', gu: 'ભાગ', pa: 'ਮਾਤਰਾ', or: 'ଅଂଶ' },
      'Vital': { hi: 'आवश्यक', kn: 'ಅಗತ್ಯ', ta: 'அவசிய', te: 'ముఖ్యమైన', ml: 'അത്യാവശ്യ', mr: 'महत्त्वाचे', bn: 'প্রয়োজনীয়', gu: 'આવશ્યક', pa: 'ਜ਼ਰੂਰੀ', or: 'ଆବଶ୍ୟକ' }
    };

    return items.map((it) => ({
      ...it,
      label: nutrientLabels[it.label]?.[currentLanguageCode] || it.label,
      prefix: prefixLabels[it.prefix]?.[currentLanguageCode] || it.prefix
    }));
  };

  const getFoodLocalizedDescription = (food: KaggleFoodItem, lang: string): string => {
    if (!food) return '';
    if (!lang || lang === 'en') {
      return food.safetyExplanation || food.maternalBenefits;
    }

    const safeMap: Record<string, string> = {
      hi: 'आईसीएमआर-एनआईएन मानकों के अनुसार गर्भावस्था में सुरक्षित और पौष्टिक। यह माँ और भ्रूण के विकास में सहायक है।',
      kn: 'ಐಸಿಎಂಆರ್ ಮಾರ್ಗಸೂಚಿಗಳಂತೆ ಗರ್ಭಿಣಿಯರಿಗೆ ಸುರಕ್ಷಿತ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಪೌಷ್ಟಿಕ ಆಹಾರ. ತಾಯಿ ಹಾಗೂ ಶಿಶುವಿನ ಆರೋಗ್ಯಕ್ಕೆ ಹಿತಕರ.',
      ta: 'ஐசிஎம்ஆர் வழிகாட்டுதலின்படி கர்ப்ப காலத்தில் பாதுகாப்பானது மற்றும் அத்தியாவசிய ஊட்டச்சத்துக்கள் நிறைந்தது.',
      te: 'గర్భధారణ సమయంలో ఐసీఎమ్మార్ మార్గదర్శకాల ప్రకారం అత్యంత సురక్షితమైనది మరియు బలవర్ధకమైనది.',
      ml: 'ഗർഭകാലത്ത് സുരക്ഷിതവും അമ്മയ്ക്കും കുഞ്ഞിനും ഗുണകരവുമായ പോഷകാഹാരം.',
      mr: 'गरोदरपणात सुरक्षित आणि आई व बाळाच्या विकासासाठी पोषक आहार.',
      bn: 'গর্ভাবস্থায় নিরাপদ এবং মা ও শিশুর জন্য পুষ্টিকর খাদ্য।',
      gu: 'ગર્ભાવસ્થામાં સુરક્ષિત અને માતા તેમજ શિશુના વિકાસ માટે પૌષ્ટિક આહાર.',
      pa: 'ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਅਤੇ ਮਾਂ ਤੇ ਬੱਚੇ ਲਈ ਪੌਸ਼ਟਿਕ ਖੁਰਾਕ।',
      or: 'ଗର୍ଭାବସ୍ଥାରେ ସୁରକ୍ଷିତ ଏବଂ ମାଆ ଓ ଶିଶୁ ପାଇଁ ପୁଷ୍ଟିକର ଆହାର।'
    };

    const modMap: Record<string, string> = {
      hi: 'गर्भावस्था में इसे सीमित मात्रा में और अच्छी तरह पकाकर ही खाना चाहिए।',
      kn: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಈ ಆಹಾರವನ್ನು ಹಿತ-ಮಿತವಾಗಿ ಮತ್ತು ಸರಿಯಾಗಿ ಬೇಯಿಸಿ ಮಾತ್ರ ಸೇವಿಸಿ.',
      ta: 'கர்ப்ப காலத்தில் அளவோடு மற்றும் நன்றாக சமைத்து உண்ண வேண்டும்.',
      te: 'గర్భధారణ సమయంలో మితంగా మరియు శుభ్రంగా వండుకుని తీసుకోవాలి.',
      ml: 'ഗർഭകാലത്ത് മിതമായ അളവിൽ നന്നായി വേവിച്ച് മാത്രം കഴിക്കുക.',
      mr: 'गरोदरपणात मर्यादित प्रमाणात आणि योग्य शिजवून सेवन करावे.',
      bn: 'গর্ভাবস্থায় পরিমিত পরিমাণে এবং ভালোভাবে রান্না করে খাওয়া উচিত।',
      gu: 'ગર્ભાવસ્થા દરમિયાન મર્યાદિત માત્રામાં જ સેવન કરવું.',
      pa: 'ਗਰਭ ਅਵਸਥਾ ਦੌਰਾਨ ਸੀਮਤ ਮਾਤਰਾ ਵਿੱਚ ਹੀ ਖਾਣਾ ਚਾਹੀਦਾ ਹੈ।',
      or: 'ଗର୍ଭାବସ୍ଥାରେ ଏହାକୁ ସୀମିତ ପରିମାଣରେ ଖାଇବା ଉଚିତ।'
    };

    const avoidMap: Record<string, string> = {
      hi: '⚠️ गर्भावस्था में इस आहार से परहेज करने की सलाह दी जाती है।',
      kn: '⚠️ ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಈ ಆಹಾರವನ್ನು ಸೇವಿಸಬಾರದು.',
      ta: '⚠️ கர்ப்ப காலத்தில் இந்த உணவைத் தவிர்ப்பது நல்லது.',
      te: '⚠️ గర్భధారణ సమయంలో ఈ ఆహారాన్ని నివారించండి.',
      ml: '⚠️ ഗർഭകാലത്ത് ഈ ഭക്ഷണം ഒഴിവാക്കുക.',
      mr: '⚠️ गरोदरपणात हा आहार टाळण्याचा सल्ला दिला जातो.',
      bn: '⚠️ গর্ভাবস্থায় এই খাবার এড়িয়ে চলার পরামর্শ দেওয়া হয়।',
      gu: '⚠️ ગર્ભાવસ્થા દરમિયાન આ ખોરાક ટાળવો.',
      pa: '⚠️ ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਇਸ ਭੋਜਨ ਤੋਂ ਪਰਹੇਜ਼ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।',
      or: '⚠️ ଗର୍ଭାବସ୍ଥାରେ ଏହି ଖାଦ୍ୟ ଖାଇବା ଅନୁଚିତ।'
    };

    if (food.safetyLevel === 'Avoid') {
      return avoidMap[lang] || avoidMap.hi;
    }
    if (food.safetyLevel === 'Safe in Moderation') {
      return modMap[lang] || modMap.hi;
    }
    return safeMap[lang] || safeMap.hi || (food.safetyExplanation || food.maternalBenefits);
  };

  const renderBenefitIcon = (iconType: BenefitIconType) => {
    switch (iconType) {
      case 'leaf':
        return <Leaf className="w-4 h-4" />;
      case 'dumbbell':
        return <Dumbbell className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'heart':
        return <Heart className="w-4 h-4" />;
      case 'bone':
        return <Bone className="w-4 h-4" />;
      case 'droplet':
        return <Droplets className="w-4 h-4" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'wheat':
        return <Wheat className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const pipelineStats = kagglePipeline.getPipelineStats();

  const regions = [
    'All',
    'South India',
    'North India',
    'West India',
    'East India',
    'Central India',
    'North-East India',
    'Pan-Indian'
  ];

  const states = [
    'All',
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Andhra Pradesh',
    'Telangana',
    'Maharashtra',
    'Gujarat',
    'Rajasthan',
    'Punjab',
    'Uttar Pradesh',
    'West Bengal',
    'Odisha',
    'Assam',
    'Madhya Pradesh',
    'Bihar'
  ];

  const categories = [
    'All',
    'Millets & Grains',
    'Pulses & Legumes',
    'Vegetables & Greens',
    'Traditional Dishes',
    'Dairy',
    'Nuts & Seeds',
    'Fruits',
    'Eggs & Poultry',
    'Snacks & Soups'
  ];

  const cuisines = [
    'All',
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Telugu',
    'Maharashtrian',
    'Gujarati',
    'Bengali',
    'Punjabi',
    'North Indian',
    'Pan-Indian'
  ];

  // Dynamically rank and filter dataset based on search, filter, and user's selected location
  const filteredAndRankedFoods = useMemo(() => {
    let list = [...KAGGLE_PROCESSED_FOOD_DATABASE];

    // Strict Diet Preference filtering:
    // The user selects diet preference once inside Edit Profile.
    // Food Database automatically respects that saved preference.
    const userDiet = normalizeDietPreference(userProfile?.dietPreference);
    list = list.filter((item) => isFoodEligibleForDiet(item, userDiet));

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.cuisine.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          item.maternalBenefits.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      list = list.filter(
        (item) => item.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    // Safety filter
    if (selectedSafety !== 'All') {
      list = list.filter((item) => item.safetyLevel === selectedSafety);
    }

    // Area foods filter (using single source of truth profile location)
    if (filterAreaFoodsOnly) {
      const userState = (userProfile?.state || globalLocation.state || 'Karnataka').toLowerCase();
      const userRegion = (globalLocation.region || 'South India').toLowerCase().replace(' india', '');
      list = list.filter(
        (item) =>
          (item.state && item.state.toLowerCase() === userState) ||
          (item.region && item.region.toLowerCase().includes(userRegion)) ||
          (item.cuisine && item.cuisine.toLowerCase().includes(userState))
      );
    }

    // Trimester recommendation filter
    if (selectedTrimesterFilter !== 'All') {
      list = list.filter((item) => {
        const suit = (item.trimesterSuitability || item.trimesterRecommended || '').toLowerCase();
        if (!suit || suit.includes('all')) return true;
        if (selectedTrimesterFilter === '1st Trimester' && suit.includes('1st')) return true;
        if (selectedTrimesterFilter === '2nd Trimester' && suit.includes('2nd')) return true;
        if (selectedTrimesterFilter === '3rd Trimester' && suit.includes('3rd')) return true;
        return false;
      });
    }

    // Nutrient minimum filters
    if (minProtein > 0) list = list.filter((item) => item.protein >= minProtein);
    if (minIron > 0) list = list.filter((item) => item.iron >= minIron);
    if (minCalcium > 0) list = list.filter((item) => item.calcium >= minCalcium);
    if (minFolate > 0) list = list.filter((item) => item.folate >= minFolate);

    // Location-based smart re-ranking
    if (prioritizeLocal && globalLocation) {
      const userState = (globalLocation.state || '').toLowerCase();
      const userDistrict = (globalLocation.district || '').toLowerCase();
      const userCity = (globalLocation.city || '').toLowerCase();
      const userVillage = (globalLocation.village || '').toLowerCase();

      list.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        const aState = a.state.toLowerCase();
        const bState = b.state.toLowerCase();
        const aCuisine = a.cuisine.toLowerCase();
        const bCuisine = b.cuisine.toLowerCase();

        // 1. Exact village/district/taluk match
        if (userVillage && a.maternalBenefits.toLowerCase().includes(userVillage)) scoreA += 50;
        if (userVillage && b.maternalBenefits.toLowerCase().includes(userVillage)) scoreB += 50;
        if (userDistrict && (a.state.toLowerCase().includes(userDistrict) || a.cuisine.toLowerCase().includes(userDistrict))) scoreA += 40;
        if (userDistrict && (b.state.toLowerCase().includes(userDistrict) || b.cuisine.toLowerCase().includes(userDistrict))) scoreB += 40;

        // 2. Exact state match
        if (aState === userState || aCuisine === userState || aCuisine.includes(userState)) scoreA += 30;
        if (bState === userState || bCuisine === userState || bCuisine.includes(userState)) scoreB += 30;

        // 3. Region match (South/North/West/East)
        const southStates = ['karnataka', 'tamil nadu', 'kerala', 'andhra pradesh', 'telangana'];
        const isUserSouth = southStates.includes(userState);
        if (isUserSouth && southStates.includes(aState)) scoreA += 15;
        if (isUserSouth && southStates.includes(bState)) scoreB += 15;

        // 4. Safety bonus
        if (a.safetyLevel === 'Safe') scoreA += 10;
        if (b.safetyLevel === 'Safe') scoreB += 10;
        if (a.safetyLevel === 'Avoid') scoreA -= 50;
        if (b.safetyLevel === 'Avoid') scoreB -= 50;

        return scoreB - scoreA;
      });
    }

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedSafety,
    selectedCuisine,
    filterAreaFoodsOnly,
    selectedTrimesterFilter,
    minProtein,
    minIron,
    minCalcium,
    minFolate,
    prioritizeLocal,
    userProfile?.dietPreference,
    userProfile?.state,
    globalLocation
  ]);

  // Helper to find associated recipe details for a food item modal
  const getModalRecipeDetails = (food: KaggleFoodItem) => {
    const regionalRecipe = getCentralizedRecipe(food);
    if (regionalRecipe) {
      return {
        regionalRecipe,
        ingredients: regionalRecipe.ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit
        })),
        cookingMethod: regionalRecipe.cookingMethod || 'Traditional slow cooking',
        preparationTime: regionalRecipe.preparationTimeMinutes || 20,
        servings: regionalRecipe.servingSize?.servings || 1,
        steps: regionalRecipe.instructions || [
          `Select fresh, grade-A ingredients and wash thoroughly under clean drinking water.`,
          `Gently cook base ingredients to unlock bioavailable nutrients.`,
          `Simmer until fully tender to ensure optimal maternal gastric comfort.`,
          `Serve fresh and warm immediately.`
        ],
        notes: regionalRecipe.pregnancyNutritionNotes || []
      };
    }

    return {
      regionalRecipe: null,
      ingredients: food.ingredients.map((ing) => ({
        name: typeof ing === 'string' ? ing : (ing as any).name,
        quantity: undefined,
        unit: undefined
      })),
      cookingMethod: undefined,
      preparationTime: undefined,
      servings: 1,
      steps: [],
      notes: []
    };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Stats & Location Priority */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Verified ICMR-NIN &amp; Kaggle Indian Maternal Food Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight flex items-center gap-2 flex-wrap">
              <span>🍛 Indian Maternal Nutrition Database</span>
              <span className="text-sm font-bold text-[#523D35] bg-[#EFEFE9] border border-[#959D90]/40 px-3 py-1 rounded-full">
                {filteredAndRankedFoods.length} Foods Available
              </span>
            </h1>
            <p className="text-sm text-[#523D35] mt-1 max-w-3xl">
              Scientifically vetted nutrition facts, local names, pregnancy safety profiles, and step-by-step traditional recipes tailored to your location.
            </p>
          </div>

          {/* Location Smart Priority Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#EFEFE9] p-2 rounded-2xl border border-[#959D90]/40">
            <button
              type="button"
              onClick={() => setPrioritizeLocal(!prioritizeLocal)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                prioritizeLocal
                  ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                  : 'bg-[#E8D9CD] text-[#523D35] hover:bg-[#BBA58F]/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#BBA58F]" />
              <span>Prioritize {globalLocation.state || 'Local'} Cuisines</span>
            </button>
          </div>
        </div>

        {/* 2. Search & Category Filters Bar */}
        <div className="pt-2 border-t border-[#959D90]/30 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#959D90]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('btn.search', 'Search foods, recipes, millets (e.g. Ragi Mudde, Soppu Saaru)...')}
              className="w-full pl-11 pr-12 py-3 bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl text-sm font-medium text-[#223030] placeholder-[#959D90] focus:outline-none focus:ring-2 focus:ring-[#523D35]/30 focus:border-[#523D35] transition"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <VoiceSearchButton onSearchQueryChange={(query) => setSearchQuery(query)} />
            </div>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl text-sm font-semibold text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/30 focus:border-[#523D35] transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? t('filter.allCategories', 'All Food Categories') : tCategory(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedSafety}
              onChange={(e) => setSelectedSafety(e.target.value)}
              className="w-full px-4 py-3 bg-[#EFEFE9] border border-[#959D90]/50 rounded-2xl text-sm font-semibold text-[#223030] focus:outline-none focus:ring-2 focus:ring-[#523D35]/30 focus:border-[#523D35] transition cursor-pointer"
            >
              <option value="All">{t('filter.allSafety', 'All Safety Levels')}</option>
              <option value="Safe">✓ {t('filter.safe', 'Safe in Pregnancy')}</option>
              <option value="Safe in Moderation">⚠️ {t('filter.moderate', 'Safe in Moderation')}</option>
              <option value="Avoid">⛔ {t('filter.avoid', 'Foods to Avoid')}</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-3 rounded-2xl border transition cursor-pointer ${
                showAdvancedFilters
                  ? 'bg-[#223030] text-[#EFEFE9] border-[#223030]'
                  : 'bg-[#EFEFE9] text-[#523D35] border-[#959D90]/50 hover:bg-[#BBA58F]/20'
              }`}
              title="Toggle Nutrient Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Nutrient Filter Bar */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-[#959D90]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-in fade-in">
            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Cuisine Heritage
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cuisines' : c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Min Protein (g)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={minProtein || ''}
                onChange={(e) => setMinProtein(Number(e.target.value))}
                placeholder="e.g. 10g"
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Min Iron (mg)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={minIron || ''}
                onChange={(e) => setMinIron(Number(e.target.value))}
                placeholder="e.g. 3mg"
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#523D35] block mb-1">
                Min Calcium (mg)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={minCalcium || ''}
                onChange={(e) => setMinCalcium(Number(e.target.value))}
                placeholder="e.g. 150mg"
                className="w-full p-2 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl text-xs font-semibold text-[#223030]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setMinProtein(0);
                  setMinIron(0);
                  setMinCalcium(0);
                  setMinFolate(0);
                  setSelectedCuisine('All');
                  setSelectedCategory('All');
                  setSelectedSafety('All');
                  setSearchQuery('');
                }}
                className="w-full p-2 rounded-xl text-xs font-bold text-[#EFEFE9] bg-[#523D35] hover:bg-[#223030] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Location & Trimester Filter Strip (Single Source of Truth from Profile) */}
        <div className="pt-3 border-t border-[#959D90]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Passive Profile Location Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFEFE9] border border-[#959D90]/40 rounded-xl font-bold text-[#223030]">
              <MapPin className="w-3.5 h-3.5 text-[#523D35]" />
              <span className="text-[#523D35] font-medium text-[11px]">Your Area:</span>
              <span className="text-xs">
                {userProfile?.village ? `${userProfile.village}, ` : ''}
                {userProfile?.district || userProfile?.city || 'Mysuru'}, {userProfile?.state || 'Karnataka'}
              </span>
            </div>

            {/* Quick Area Filter Toggle */}
            <div className="inline-flex rounded-xl bg-[#E8D9CD] p-0.5 border border-[#959D90]/40">
              <button
                type="button"
                onClick={() => setFilterAreaFoodsOnly(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  !filterAreaFoodsOnly
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'text-[#523D35] hover:text-[#223030]'
                }`}
              >
                All Indian Foods
              </button>
              <button
                type="button"
                onClick={() => setFilterAreaFoodsOnly(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterAreaFoodsOnly
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'text-[#523D35] hover:text-[#223030]'
                }`}
              >
                Foods from your area ({userProfile?.state || 'Karnataka'})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#523D35] shrink-0 text-[11px]">
              Trimester:
            </span>
            <select
              value={selectedTrimesterFilter}
              onChange={(e) => setSelectedTrimesterFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#EFEFE9] border border-[#959D90]/50 rounded-xl font-bold text-[#223030] text-xs shrink-0 cursor-pointer focus:outline-none"
            >
              <option value="All">All Trimesters</option>
              <option value="1st Trimester">1st Trimester</option>
              <option value="2nd Trimester">2nd Trimester</option>
              <option value="3rd Trimester">3rd Trimester</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Food Grid with Dual-Language Names & Add to Plan Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredAndRankedFoods.map((food) => {
          const isAvoid = food.safetyLevel === 'Avoid';
          const isModeration = food.safetyLevel === 'Safe in Moderation';

          // Check if this food is already planned on the CURRENT selected day
          const dayMeal = meals.find(
            (m) =>
              m.day === selectedDay &&
              ((m.foodId && m.foodId === food.id) ||
                m.name.toLowerCase().trim() === food.name.toLowerCase().trim())
          );
          const isAddedOnSelectedDay = !!dayMeal;
          const currentServings = dayMeal?.servings || 1;

          // Check user allergies against this food
          const allergyAlert = checkFoodAllergies(food, userProfile?.allergies || []);

          return (
            <div
              key={food.id}
              className="bg-[#EFEFE9] rounded-3xl overflow-hidden border border-[#959D90]/40 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              {/* Top Dish Photo Banner */}
              <div
                className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#223030]/10 cursor-pointer group"
                onClick={() => setActiveModalFood(food)}
                title="Click to view complete nutrition details"
              >
                <VerifiedFoodImage
                  src={food.image || food.imageUrl}
                  alt={food.name}
                  dishName={food.name}
                  isVegetarian={food.isVegetarian}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  aspectRatio="auto"
                />

                {/* Top-Left Vegetarian / Non-Vegetarian Pill */}
                <div className="absolute top-3 left-3 z-10">
                  {getFoodDietType(food) === 'vegetarian' ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#0E5838] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      <Leaf className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{t('diet.vegetarian') || 'VEGETARIAN'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-[#8B1D1D] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      <Utensils className="w-3.5 h-3.5 text-rose-200" />
                      <span>{t('diet.nonVegetarian') || 'NON-VEGETARIAN'}</span>
                    </span>
                  )}
                </div>

                {/* Bottom-Right State and Area Pill */}
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#E8E1D7]/95 text-[#223030] text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs border border-white/40">
                    <MapPin className="w-3 h-3 text-[#523D35]" />
                    <span>{food.state || 'Karnataka'}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div
                          onClick={() => setActiveModalFood(food)}
                          className="cursor-pointer hover:opacity-85 transition"
                        >
                          <DualFoodName
                            foodName={food.name}
                            regionalName={food.regionalName}
                            className="text-xl sm:text-2xl font-bold text-[#1E2B26] leading-snug"
                            miniClassName="text-xs font-semibold text-[#523D35] mt-0.5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <VoiceListenButton food={food} size="sm" />
                      <button
                        type="button"
                        onClick={() => openAddToPlanModal(food)}
                        className="p-1.5 rounded-xl bg-[#D4DDD6]/60 hover:bg-[#D4DDD6] text-[#1E3A34] transition cursor-pointer"
                        title="Add to Maternal Meal Plan"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[#4E5C56] leading-relaxed line-clamp-2">
                    {getFoodLocalizedDescription(food, currentLanguageCode)}
                  </p>
                </div>

                {/* 4 Health/Nutritional Benefit Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-t border-[#959D90]/25">
                  {getNutritionalIndicators(food).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#D4DDD6] text-[#1E3A34] flex items-center justify-center shrink-0">
                        {renderBenefitIcon(item.iconType)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] sm:text-[11px] text-[#55645E] font-medium leading-none">
                          {item.prefix}
                        </span>
                        <span className="text-[11px] sm:text-[12px] text-[#1E3A34] font-bold leading-tight mt-0.5 whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons Row: View Details | View Recipe | Order Food */}
                <div className="space-y-1.5 pt-2 border-t border-[#959D90]/25">
                  <div className="grid grid-cols-3 gap-2">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setActiveModalFood(food)}
                      className="bg-[#1E3A34] hover:bg-[#152B26] text-white text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="View complete nutrition breakdown, safety & ICMR data"
                    >
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <DualText fallback="View Details" className="whitespace-nowrap text-white" />
                    </button>

                    {/* View Recipe Button */}
                    <button
                      type="button"
                      onClick={() => handleViewRecipe(food)}
                      className="bg-[#523D35] hover:bg-[#3D2D27] text-white text-xs font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="View authentic recipe ingredients and preparation steps"
                    >
                      <ChefHat className="w-3.5 h-3.5 shrink-0" />
                      <DualText fallback="View Recipe" className="whitespace-nowrap text-white" />
                    </button>

                    {/* Order Food Button */}
                    <button
                      type="button"
                      onClick={() => setOrderingFood(food)}
                      className="bg-[#BBA58F] hover:bg-[#A8927C] text-[#223030] text-xs font-black py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      title="Open Food Ordering to order prepared food on Swiggy/Zomato or buy raw ingredients on Blinkit"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-[#223030]" />
                      <DualText fallback="Order Food" className="whitespace-nowrap text-[#223030] font-black" />
                    </button>
                  </div>

                  {/* Subtext below action buttons */}
                  <div className="text-right">
                    <span className="text-[11px] text-[#55645E] font-medium italic">
                      External delivery &amp; grocery options (Swiggy, Zomato, Blinkit)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Complete Food Details & Real Recipe Inspection Modal */}
      {activeModalFood && (() => {
        const recipe = getModalRecipeDetails(activeModalFood);

        return (
          <div className="fixed inset-0 z-50 bg-[#223030]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
              {/* Hero Image Banner with Verified Attribution */}
              <div className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 h-52 sm:h-64 overflow-hidden rounded-t-3xl bg-black group">
                <VerifiedFoodImage
                  src={activeModalFood.image || activeModalFood.imageUrl}
                  alt={activeModalFood.name}
                  dishName={activeModalFood.name}
                  isVegetarian={activeModalFood.isVegetarian}
                  className="w-full h-full object-cover"
                  aspectRatio="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Diet Type Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {getFoodDietType(activeModalFood) === 'vegetarian' ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#0E5838] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      <Leaf className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{t('diet.vegetarian') || 'VEGETARIAN'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-[#8B1D1D] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      <Utensils className="w-3.5 h-3.5 text-rose-200" />
                      <span>{t('diet.nonVegetarian') || 'NON-VEGETARIAN'}</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalFood(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#959D90]/30 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        activeModalFood.safetyLevel === 'Avoid'
                          ? 'bg-[#523D35] text-[#EFEFE9]'
                          : activeModalFood.safetyLevel === 'Safe in Moderation'
                          ? 'bg-[#BBA58F] text-[#223030]'
                          : 'bg-[#223030] text-[#EFEFE9]'
                      }`}
                    >
                      ✓ {activeModalFood.safetyLevel} in Pregnancy
                    </span>
                    <span className="text-xs font-bold text-[#523D35]">
                      {activeModalFood.cuisine} Cuisine
                    </span>
                  </div>

                  {/* ALLERGY ALERT IN MODAL */}
                  {(() => {
                    const modalAllergy = checkFoodAllergies(activeModalFood, userProfile?.allergies || []);
                    if (!modalAllergy.hasAllergy) return null;
                    return (
                      <div className="bg-[#523D35] text-[#EFEFE9] p-3 rounded-2xl text-xs flex items-start gap-2.5 border border-[#BBA58F]/50 shadow-xs mb-3">
                        <AlertTriangle className="w-4 h-4 text-[#BBA58F] shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-extrabold uppercase tracking-wider text-[10px] block text-[#BBA58F]">
                            ⚠️ ALLERGY ALERT
                          </span>
                          <p className="text-[11px] leading-relaxed text-[#E8D9CD]">
                            This food contains <span className="font-black text-white">{modalAllergy.matchedAllergens.join(', ')}</span>, which is listed in your allergy profile.
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-2 flex-wrap">
                    <DualFoodName
                      foodName={activeModalFood.name}
                      regionalName={activeModalFood.regionalName}
                      className="text-xl sm:text-2xl font-black text-[#223030]"
                      miniClassName="text-sm font-semibold text-[#523D35] mt-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <VoiceListenButton food={activeModalFood} variant="modal" />
                    <span className="text-xs text-[#523D35] font-medium">
                      Standard Serving: {activeModalFood.servingSize || '1 Serving (~150g)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    voiceService.stopSpeaking();
                    setActiveModalFood(null);
                  }}
                  className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Complete ICMR Nutrients Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#523D35] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#523D35]" />
                  <span>ICMR-NIN Food Composition Data (IFCT 2017)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">{t('nutrient.calories', 'Energy')}</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.calories}</span>
                    <span className="text-[10px] text-[#523D35] block">kcal</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">{t('nutrient.protein', 'Protein')}</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.protein}g</span>
                    <span className="text-[10px] text-[#523D35] block">{t('nutrient.protein', 'Protein')}</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">{t('nutrient.iron', 'Iron')}</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.iron}mg</span>
                    <span className="text-[10px] text-[#523D35] block">Fe</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">{t('nutrient.calcium', 'Calcium')}</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.calcium}mg</span>
                    <span className="text-[10px] text-[#523D35] block">Ca</span>
                  </div>
                  <div className="bg-[#E8D9CD] border border-[#959D90]/40 rounded-2xl p-2.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">{t('nutrient.folate', 'Folate (B9)')}</span>
                    <span className="text-base font-black text-[#223030]">{activeModalFood.folate}µg</span>
                    <span className="text-[10px] text-[#523D35] block">B9</span>
                  </div>
                </div>
              </div>

              {/* Maternal Health Benefits / Clinical Guidelines */}
              <div className="bg-[#E8D9CD] rounded-2xl p-4 border border-[#959D90]/50 space-y-2">
                <h3 className="text-xs font-bold text-[#223030] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#523D35]" />
                  <span>Maternal Clinical Rationale &amp; Benefits</span>
                </h3>
                <p className="text-xs text-[#523D35] leading-relaxed">
                  {getFoodLocalizedDescription(activeModalFood, currentLanguageCode)}
                </p>
                {activeModalFood.tags && activeModalFood.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeModalFood.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-[#EFEFE9] border border-[#959D90]/40 text-[10px] font-bold text-[#523D35]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Food Category, Region & Ingredients Section (Focused strictly on understanding the food) */}
              <div className="bg-[#E8D9CD]/50 rounded-2xl p-4 sm:p-5 border border-[#959D90]/50 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#EFEFE9] p-2.5 rounded-xl border border-[#959D90]/30">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">
                      {t('common.category', 'Category')}
                    </span>
                    <span className="font-bold text-[#223030] text-xs">
                      {tCategory(activeModalFood.category)}
                    </span>
                  </div>
                  <div className="bg-[#EFEFE9] p-2.5 rounded-xl border border-[#959D90]/30">
                    <span className="text-[10px] text-[#523D35] font-bold block uppercase">
                      {t('common.region', 'Region & State')}
                    </span>
                    <span className="font-bold text-[#223030] text-xs">
                      {activeModalFood.state || activeModalFood.cuisine || 'Pan-India'}
                    </span>
                  </div>
                </div>

                {/* Ingredients of Food */}
                {activeModalFood.ingredients && activeModalFood.ingredients.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#223030] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#523D35]" />
                        <span>{t('recipe.ingredients', 'Ingredients')}</span>
                      </span>
                      <span className="text-[11px] font-normal text-[#523D35]">
                        ({activeModalFood.ingredients.length} items)
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 bg-[#EFEFE9] p-3 rounded-xl border border-[#959D90]/30">
                      {activeModalFood.ingredients.map((ing, idx) => {
                        const ingName = typeof ing === 'string' ? ing : (ing as any).name;
                        return (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-[#E8D9CD] border border-[#959D90]/40 rounded-lg text-xs font-semibold text-[#223030]"
                          >
                            {tIngredient(ingName).primary}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recipe Link / Availability Status */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-[#959D90]/30">
                  <span className="text-xs font-semibold text-[#523D35] flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-[#523D35]" />
                    <span>{t('recipe.recipe', 'Recipe Status')}:</span>
                  </span>

                  {recipe.regionalRecipe ? (
                    <button
                      type="button"
                      onClick={() => {
                        const targetRecipe = recipe.regionalRecipe;
                        setActiveModalFood(null);
                        setSelectedRecipeDetail(targetRecipe);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#523D35] hover:bg-[#223030] text-[#EFEFE9] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#BBA58F]" />
                      <span>{t('recipe.viewFullRecipe', 'Open Recipe Page ↗')}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-[#523D35] bg-[#EFEFE9] px-2.5 py-1 rounded-lg border border-[#959D90]/30">
                      {t('recipe.notAvailable', 'Recipe not available')}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Actions (Focused strictly on food understanding and adding to plan; NO food-ordering or recipe actions) */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-[#959D90]/30">
                <button
                  type="button"
                  onClick={() => {
                    const target = activeModalFood;
                    setActiveModalFood(null);
                    setAlternativeTargetFood(target);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#523D35] bg-[#E8D9CD] hover:bg-[#BBA58F]/30 border border-[#959D90]/40 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#523D35]" />
                  <span>{t('food.findAlternative', 'Find Alternative Food')}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalFood(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#523D35] hover:bg-[#E8D9CD] transition cursor-pointer"
                  >
                    {t('common.close', 'Close')}
                  </button>

                  {activeModalFood.safetyLevel !== 'Avoid' && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = activeModalFood;
                        setActiveModalFood(null);
                        openAddToPlanModal(target);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition bg-[#223030] hover:bg-[#523D35] text-[#EFEFE9] cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#BBA58F]" />
                      <span>{t('recipe.addToMealPlan', 'Add to Maternal Meal Plan')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Food Alternative Modal */}
      <FoodAlternativeModal
        targetFood={alternativeTargetFood}
        isOpen={!!alternativeTargetFood}
        onClose={() => setAlternativeTargetFood(null)}
      />

      {/* Complete 21-Point Regional Recipe Detail Modal */}
      <RegionalRecipeDetailModal
        recipe={selectedRecipeDetail}
        isOpen={!!selectedRecipeDetail}
        onClose={() => setSelectedRecipeDetail(null)}
      />

      {/* 5. Food Image Viewer Modal (Full size photo + dataset info + recipe trigger) */}
      <FoodImageViewerModal
        food={viewerFood}
        isOpen={Boolean(viewerFood)}
        onClose={() => setViewerFood(null)}
        onViewRecipe={(food) => {
          const recipe = getModalRecipeDetails(food);
          if (recipe) {
            setSelectedRecipeDetail(recipe);
          } else {
            setActiveModalFood(food);
          }
        }}
        onAddToPlan={(food) => {
          openAddToPlanModal(food);
        }}
      />
      {/* 6. Recipe Notice Modal (Shown if verified recipe is not yet published) */}
      {recipeNoticeFood && (
        <div className="fixed inset-0 z-50 bg-[#223030]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#EFEFE9] border border-[#959D90] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-[#523D35]">
                <ChefHat className="w-5 h-5 text-[#523D35]" />
                <h3 className="text-base font-black text-[#223030]">Verified Recipe Status</h3>
              </div>
              <button
                type="button"
                onClick={() => setRecipeNoticeFood(null)}
                className="w-8 h-8 rounded-full bg-[#E8D9CD] hover:bg-[#BBA58F]/40 text-[#223030] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#523D35] leading-relaxed">
              A clinical, step-by-step verified maternal recipe for <strong className="text-[#223030]">{recipeNoticeFood}</strong> is currently being validated by our regional clinical nutritionists to ensure pregnancy safety standards. The complete nutritional breakdown and ICMR IFCT data can still be reviewed in <strong className="text-[#223030]">View Details</strong>.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setRecipeNoticeFood(null)}
                className="px-4 py-2 bg-[#1E3A34] hover:bg-[#152B26] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Dedicated Food Ordering Modal (Swiggy, Zomato, Blinkit) */}
      <FoodOrderingModal
        isOpen={Boolean(orderingFood)}
        onClose={() => setOrderingFood(null)}
        food={orderingFood ? {
          id: orderingFood.id,
          name: orderingFood.name,
          regionalName: orderingFood.regionalName,
          image: orderingFood.image,
          category: orderingFood.category,
          cuisine: orderingFood.cuisine,
          isVegetarian: orderingFood.isVegetarian,
          ingredients: orderingFood.ingredients,
          state: orderingFood.state,
          region: orderingFood.region
        } : null}
        globalLocation={globalLocation}
        onNavigateToFullOrdering={() => {
          setOrderingFood(null);
          setActiveTab('order-delivery');
        }}
      />
    </div>
  );
};
