import { MaternalArtType } from '../components/Maternal3DArt';
import { PROJECT_FOOD_DATASET } from '../data/project_food_dataset';
import { VERIFIED_FOOD_IMAGE_REGISTRY } from '../data/food_image_registry';

export interface ResolvedMealVisual {
  imageUrl?: string;
  artType: MaternalArtType;
  altText: string;
  sourceType: 'photograph' | '3d-illustration';
  isVegetarian?: boolean;
}

/**
 * Resolves the accurate visual for any meal item or meal interval.
 * Never displays an unrelated dish (e.g. never shows dosa for guava).
 */
export function resolveMealVisual(
  dishName: string = '',
  category: string = '',
  foodId?: string
): ResolvedMealVisual {
  const cleanName = dishName.toLowerCase().trim();
  const cleanCategory = category.toLowerCase().trim();

  // 1. Check exact match in PROJECT_FOOD_DATASET
  const projectItem = PROJECT_FOOD_DATASET.find(p => {
    if (foodId && p.foodId === foodId) return true;
    const pName = p.foodName.toLowerCase();
    const pSlug = p.slug.toLowerCase().replace(/_/g, ' ');
    return cleanName.includes(pSlug) || pName.includes(cleanName) || cleanName.includes(pName);
  });

  if (projectItem && projectItem.imageUrl) {
    return {
      imageUrl: projectItem.imageUrl,
      artType: getCategoryArtType(category),
      altText: projectItem.foodName,
      sourceType: 'photograph',
      isVegetarian: projectItem.isVegetarian
    };
  }

  // 2. Check in VERIFIED_FOOD_IMAGE_REGISTRY
  const registryKeys = Object.keys(VERIFIED_FOOD_IMAGE_REGISTRY);
  for (const key of registryKeys) {
    const entry = VERIFIED_FOOD_IMAGE_REGISTRY[key];
    const matchSlug = key.replace(/_/g, ' ');
    if (
      cleanName.includes(matchSlug) ||
      cleanName.includes(entry.exactDishName.toLowerCase()) ||
      entry.regionalAliases.some(alias => cleanName.includes(alias.toLowerCase()))
    ) {
      return {
        imageUrl: entry.primaryUrl,
        artType: getCategoryArtType(category),
        altText: entry.exactDishName,
        sourceType: 'photograph',
        isVegetarian: entry.isVegetarian
      };
    }
  }

  // 3. Known local files in public/food-dataset/
  const knownLocalFoodMap: Record<string, string> = {
    'dosa': '/food-dataset/masala_dosa.jpg',
    'masala dosa': '/food-dataset/masala_dosa.jpg',
    'green dosa': '/food-dataset/green_palak_dosa.jpg',
    'palak dosa': '/food-dataset/green_palak_dosa.jpg',
    'idli': '/food-dataset/idli_vada.jpg',
    'rava idli': '/food-dataset/rava_idli.jpg',
    'vada': '/food-dataset/idli_vada.jpg',
    'poha': '/food-dataset/thick_poha.jpg',
    'lemon rice': '/food-dataset/chitranna.jpg',
    'chitranna': '/food-dataset/chitranna.jpg',
    'curd rice': '/food-dataset/mosaru_anna.jpg',
    'mosaru anna': '/food-dataset/mosaru_anna.jpg',
    'ragi mudde': '/food-dataset/ragi_mudde.jpg',
    'ragi roti': '/food-dataset/ragi_roti.jpg',
    'pesarattu': '/food-dataset/pesarattu.jpg',
    'dal': '/food-dataset/daal.jpg',
    'daal': '/food-dataset/daal.jpg',
    'kadai paneer': '/food-dataset/kadai_paneer.jpg',
    'paneer': '/food-dataset/kadai_paneer.jpg',
    'saag': '/food-dataset/saag.jpg',
    'palak': '/food-dataset/saag.jpg',
    'fruit': '/food-dataset/sliced_fruits.jpg',
    'fruits': '/food-dataset/sliced_fruits.jpg',
    'banana': '/food-dataset/sliced_fruits.jpg',
    'guava': '/food-dataset/sliced_fruits.jpg',
    'apple': '/food-dataset/sliced_fruits.jpg',
    'sundal': '/food-dataset/black_chickpea_salad.jpg',
    'chana': '/food-dataset/black_chickpea_salad.jpg',
    'salad': '/food-dataset/black_chickpea_salad.jpg',
    'halwa': '/food-dataset/carrot_halwa.jpg',
    'chia': '/food-dataset/mango_chia_pudding.jpg',
    'sandwich': '/food-dataset/toasted_sandwich.jpg',
    'fish': '/food-dataset/fish_curry.jpg',
    'chicken': '/food-dataset/chicken_sukka.jpg',
    'egg': '/food-dataset/egg_gravy.jpg',
    'pulao': '/food-dataset/palav.jpg',
    'pulav': '/food-dataset/palav.jpg'
  };

  for (const [key, path] of Object.entries(knownLocalFoodMap)) {
    if (cleanName.includes(key)) {
      return {
        imageUrl: path,
        artType: getCategoryArtType(category),
        altText: dishName,
        sourceType: 'photograph'
      };
    }
  }

  // 4. Clean food-specific 3D illustrations by interval category
  const defaultArt = getCategoryArtType(category);
  return {
    artType: defaultArt,
    altText: dishName || `${category} visual`,
    sourceType: '3d-illustration'
  };
}

/**
 * Returns the matching 3D art type for any meal category or interval.
 */
export function getCategoryArtType(category: string = ''): MaternalArtType {
  const cat = category.toLowerCase().trim();

  if (cat.includes('break') || cat.includes('morning') && !cat.includes('mid') && !cat.includes('snack')) {
    return 'breakfast-dish';
  }
  if (cat.includes('mid-morning') || (cat.includes('morning') && cat.includes('snack'))) {
    return 'fresh-fruits';
  }
  if (cat.includes('lunch') || cat.includes('noon')) {
    return 'healthy-thali';
  }
  if (cat.includes('evening') || cat.includes('snack')) {
    return 'evening-snack';
  }
  if (cat.includes('dinner') || cat.includes('night') && !cat.includes('bed')) {
    return 'dinner-dish';
  }
  if (cat.includes('bed') || cat.includes('post-dinner') || cat.includes('milk')) {
    return 'bedtime-milk';
  }

  return 'healthy-thali';
}
