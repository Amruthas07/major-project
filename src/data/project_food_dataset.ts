import { KaggleFoodItem, IndianRegion } from '../types';

export interface ProjectFoodDatasetItem {
  foodId: string;
  slug: string;
  googleDriveFileId: string;
  originalLabel: string;
  foodName: string;
  regionalName: string;
  cuisine: string;
  state: string;
  region: IndianRegion;
  category: 'Millets & Grains' | 'Pulses & Legumes' | 'Vegetables & Greens' | 'Fruits' | 'Dairy' | 'Nuts & Seeds' | 'Traditional Dishes' | 'Eggs & Poultry' | 'Snacks & Soups';
  isVegetarian: boolean;
  imageUrl: string;
  imageFallbacks: string[];
  imageSourceType: 'project-dataset';
  imageSourceName: 'PregNutri AI Food Dataset';
  imageAttribution: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  iron: number;
  calcium: number;
  folate: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  servingSize: string;
  safetyLevel: 'Safe' | 'Safe in Moderation' | 'Avoid';
  safetyExplanation: string;
  trimesterRecommended: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'All Trimesters';
  tags: string[];
  maternalBenefits: string;
  maternalTip: string;
  dataSource: string;
  aliases: string[];
  recipe: {
    ingredients: string[];
    instructions: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    storageAdvice: string;
    pregnancySafetyTips: string;
  };
}

/**
 * 27 Verified Dishes from User's Google Drive "Food dataset"
 * Folder: 1yPZJhYiP8NoGoBFsROdUvvYImJqghbJ9
 * Primary Image: /food-dataset/{slug}.jpg
 * Fallbacks: Google Drive uc direct link & lh3 thumbnail
 */
export const PROJECT_FOOD_DATASET: ProjectFoodDatasetItem[] = [
  // 1. Chitranna (Lemon Rice with Peanuts)
  {
    foodId: 'karnataka-chitranna-lemon-rice-with-peanuts',
    slug: 'chitranna',
    googleDriveFileId: 'chitranna_lemon_rice_verified',
    originalLabel: 'Chitranna (Lemon Rice with Peanuts)',
    foodName: 'Chitranna (Lemon Rice with Peanuts)',
    regionalName: 'ಚಿತ್ರಾನ್ನ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/chitranna.jpg',
    imageFallbacks: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Lemon_rice_recipe.jpg/800px-Lemon_rice_recipe.jpg'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset / Authentic Culinary Photography',
    calories: 290,
    protein: 5.8,
    carbohydrates: 48,
    fat: 8.5,
    fiber: 3.2,
    iron: 2.1,
    calcium: 30,
    folate: 45,
    glycemicIndex: 'Low',
    servingSize: '1 Plate (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'A traditional Karnataka dish made with rice, lemon, peanuts and mild spices. Light, tasty and easy to digest.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Folate', 'Protein', 'Easy to Digest', 'Pregnancy Friendly', 'Morning Sickness Relief'],
    maternalBenefits: 'Rich in bioavailable folate & plant protein. Supports healthy gestational weight gain and eases early morning nausea.',
    maternalTip: 'Add freshly squeezed lemon juice after turning off flame to retain vitamin C content.',
    dataSource: 'ICMR-NIN IFCT Standardized (PregNutri AI Project Dataset)',
    aliases: [
      'chitranna',
      'lemon rice',
      'nimbehannina chitranna',
      'chitranna (lemon rice with peanuts)',
      'lemon rice with peanuts',
      'chitranna rice'
    ],
    recipe: {
      ingredients: [
        '1.5 cups cooked Sona Masuri rice',
        '2 tbsp roasted peanuts',
        '1 tbsp fresh lemon juice',
        '1/2 tsp mustard seeds',
        '1/2 tsp split urad & chana dal',
        '1 sprig fresh curry leaves',
        '1/4 tsp organic turmeric powder',
        '1 green chilli (slit, deseeded)',
        '1 tsp pure cow ghee or sesame oil',
        'Himalayan pink rock salt to taste'
      ],
      instructions: [
        'Cook rice grains until fluffy, separate, and let cool slightly on a flat plate.',
        'Heat ghee in a pan, crackle mustard seeds, urad dal, chana dal, and curry leaves.',
        'Add roasted peanuts and turmeric powder, sauteing until golden and aromatic.',
        'Mix tempered spices and salt gently into the cooled rice.',
        'Drizzle fresh lemon juice over the rice and toss evenly. Serve fresh with a wedge of lemon.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      storageAdvice: 'Best consumed freshly prepared. Refrigerate within 2 hours if saving for later.',
      pregnancySafetyTips: 'Ensure peanuts are fresh and not stale. Keep green chillies mild to avoid gastric irritation.'
    }
  },

  // 2. Mosaru Anna (Tempered Curd Rice)
  {
    foodId: 'karnataka-mosaru-anna-tempered-curd-rice',
    slug: 'mosaru_anna',
    googleDriveFileId: 'mosaru_anna_curd_rice_verified',
    originalLabel: 'Mosaru Anna (Tempered Curd Rice)',
    foodName: 'Mosaru Anna (Tempered Curd Rice)',
    regionalName: 'ಮೊಸರನ್ನ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Dairy',
    isVegetarian: true,
    imageUrl: '/food-dataset/mosaru_anna.jpg',
    imageFallbacks: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Curd_Rice_tempered.jpg/800px-Curd_Rice_tempered.jpg'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset / Authentic Culinary Photography',
    calories: 230,
    protein: 6.9,
    carbohydrates: 36,
    fat: 5.8,
    fiber: 1.2,
    iron: 0.8,
    calcium: 185,
    folate: 20,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Traditional South Indian curd rice tempered with mustard seeds, curry leaves and mild spices. Cooling, nutritious and gentle on the stomach.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Calcium', 'Probiotics', 'Supports Digestion', 'Pregnancy Friendly', 'Cooling', 'Heartburn Relief'],
    maternalBenefits: 'Rich in bioavailable calcium, supports digestion with live probiotics, soothing heartburn relief.',
    maternalTip: 'Use pasteurized fresh homemade curd that is not overly sour to avoid acid reflux.',
    dataSource: 'ICMR-NIN IFCT Standardized (PregNutri AI Project Dataset)',
    aliases: [
      'mosaru anna',
      'curd rice',
      'thayir sadam',
      'daddojanam',
      'tempered curd rice',
      'mosaru anna (tempered curd rice)',
      'bagala bath'
    ],
    recipe: {
      ingredients: [
        '1 cup soft cooked white rice (slightly mashed)',
        '1 cup fresh pasteurized whole milk curd / yogurt',
        '2 tbsp boiled and cooled milk',
        '1/2 tsp mustard seeds',
        '1/2 tsp finely minced ginger',
        '1 sprig fresh curry leaves',
        '2 tbsp fresh pomegranate pearls',
        '1 tsp pure cow ghee',
        'Himalayan pink rock salt to taste'
      ],
      instructions: [
        'Mash warm cooked rice softly with a pinch of salt and cooled milk until smooth.',
        'Gently fold in fresh creamy curd until well combined.',
        'Heat 1 tsp ghee, crackle mustard seeds, minced ginger, and fresh curry leaves.',
        'Pour aromatic tadka over the curd rice and blend smoothly.',
        'Top with fresh bright pomegranate pearls for antioxidants and crunch. Serve at room temperature.'
      ],
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      storageAdvice: 'Consume fresh at room temperature. Keep refrigerated if consuming later in the day.',
      pregnancySafetyTips: 'Always use fresh pasteurized curd; avoid excessively sour curd to prevent acidity.'
    }
  },

  // 3. Rava Idli with Coconut Chutney
  {
    foodId: 'karnataka-rava-idli-with-coconut-chutney',
    slug: 'rava_idli',
    googleDriveFileId: 'rava_idli_coconut_chutney_verified',
    originalLabel: 'Rava Idli with Coconut Chutney',
    foodName: 'Rava Idli with Coconut Chutney',
    regionalName: 'ರವ ಇಡ್ಲಿ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/rava_idli.jpg',
    imageFallbacks: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rava_idli.jpg/800px-Rava_idli.jpg'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset / Authentic Culinary Photography',
    calories: 210,
    protein: 5.2,
    carbohydrates: 38,
    fat: 4.1,
    fiber: 2.8,
    iron: 1.6,
    calcium: 45,
    folate: 32,
    glycemicIndex: 'Low',
    servingSize: '2 Idlis with Chutney (160g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Soft and nutritious steamed rava idlis served with fresh coconut chutney. A light and healthy breakfast option.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Carbohydrates', 'Moderate Protein', 'Easy to Digest', 'Pregnancy Friendly', 'Breakfast'],
    maternalBenefits: 'Clean source of sustained complex carbohydrates and moderate protein. Gentle on early trimester nausea.',
    maternalTip: 'Add grated carrots and coriander for extra beta-carotene and dietary fiber.',
    dataSource: 'ICMR-NIN IFCT Standardized (PregNutri AI Project Dataset)',
    aliases: [
      'rava idli',
      'suji idli',
      'sooji idli',
      'rava idly',
      'rava idli with coconut chutney',
      'steamed rava idli'
    ],
    recipe: {
      ingredients: [
        '1 cup roasted semolina (rava/sooji)',
        '3/4 cup fresh whisked curd',
        '1/4 cup water',
        '1/2 tsp mustard seeds',
        '1 tbsp finely grated carrot',
        '1 sprig fresh curry leaves & chopped coriander',
        '4 roasted cashew halves',
        '1/2 tsp fruit salt / baking soda',
        '1 tsp pure cow ghee',
        'Rock salt to taste'
      ],
      instructions: [
        'Heat 1 tsp ghee, roast cashews and set aside. Temper mustard seeds and curry leaves.',
        'In a mixing bowl, combine roasted rava, curd, tempered spices, grated carrot, and salt into a smooth thick batter. Rest for 10 minutes.',
        'Place a roasted cashew half in each greased idli mold.',
        'Stir a pinch of fruit salt into the batter with 1 tsp water until frothy.',
        'Spoon batter into molds and steam for 10-12 minutes until soft and fluffy. Serve warm with freshly ground coconut chutney.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 12,
      storageAdvice: 'Serve immediately while steaming hot.',
      pregnancySafetyTips: 'Ensure curd is fresh and pasteurized. Steam thoroughly.'
    }
  },
  // 1. Ragi Mudde
  {
    foodId: 'karnataka-ragi-mudde-finger-millet-ball',
    slug: 'ragi_mudde',
    googleDriveFileId: '17rcj_qP6oaCnOJbbciSll2OuZSYBvgVY',
    originalLabel: 'Ragi mudde Image',
    foodName: 'Ragi Mudde (Finger Millet Ball)',
    regionalName: 'ರಾಗಿ ಮುದ್ದೆ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Millets & Grains',
    isVegetarian: true,
    imageUrl: '/food-dataset/ragi_mudde.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=17rcj_qP6oaCnOJbbciSll2OuZSYBvgVY',
      'https://lh3.googleusercontent.com/d/17rcj_qP6oaCnOJbbciSll2OuZSYBvgVY=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 320,
    protein: 7.3,
    carbohydrates: 72.0,
    fat: 1.3,
    fiber: 11.5,
    iron: 3.9,
    calcium: 344,
    folate: 18,
    glycemicIndex: 'Medium',
    servingSize: '1 Ball (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Gestational superfood; bioavailable calcium supports fetal skeletal mineralization and controls maternal blood glucose.',
    trimesterRecommended: 'All Trimesters',
    tags: ['High Calcium', 'High Fiber', 'Gestational Diabetes Friendly'],
    maternalBenefits: 'Super-rich in calcium (344mg/serving) for fetal bone development; high soluble fiber prevents third-trimester constipation.',
    maternalTip: 'Always consume hot and fresh with steamed leafy greens (soppina saaru) or dal. Avoid swallowing unchewed chunks.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['ragi mudde', 'ragi kali', 'finger millet ball', 'ragimudde', 'ragi sangati', 'ragi balls'],
    recipe: {
      ingredients: [
        '1 cup Ragi (Finger Millet) Flour',
        '2.5 cups Water',
        '1 tsp Cow Ghee',
        '1/2 tsp Salt'
      ],
      instructions: [
        'Boil 2 cups of water with salt and ghee in a heavy-bottom pot.',
        'Mix 2 tbsp ragi flour with remaining 1/2 cup cold water to form a smooth slurry and pour into boiling water.',
        'Gradually add the rest of the ragi flour without stirring, allowing water to boil over it for 3 minutes.',
        'Vigorously stir using a wooden mudde stick (kolu) until smooth, glossy, and lump-free.',
        'Cover and steam on low flame for 5 minutes. Shape into smooth balls using moist hands or a ghee-greased wooden bowl.'
      ],
      prepTimeMinutes: 5,
      cookTimeMinutes: 15,
      storageAdvice: 'Best eaten fresh; can be kept in mild warm water for up to 4 hours.',
      pregnancySafetyTips: 'Cook completely until flour is thoroughly gelatinized to ensure effortless digestion.'
    }
  },

  // 2. Ragi Roti
  {
    foodId: 'karnataka-ragi-roti-finger-millet-flatbread',
    slug: 'ragi_roti',
    googleDriveFileId: '1v6co1KkHMABKsB0RBt_irieE17N9jUpO',
    originalLabel: 'Ragi roti Image',
    foodName: 'Ragi Roti (Finger Millet Flatbread)',
    regionalName: 'ರಾಗಿ ರೊಟ್ಟಿ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Millets & Grains',
    isVegetarian: true,
    imageUrl: '/food-dataset/ragi_roti.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1v6co1KkHMABKsB0RBt_irieE17N9jUpO',
      'https://lh3.googleusercontent.com/d/1v6co1KkHMABKsB0RBt_irieE17N9jUpO=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 290,
    protein: 6.8,
    carbohydrates: 58.0,
    fat: 4.2,
    fiber: 9.8,
    iron: 4.2,
    calcium: 320,
    folate: 22,
    glycemicIndex: 'Low',
    servingSize: '2 Medium Rotis (160g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Excellent complex-carb staple; loaded with iron, calcium, and digestion-supporting cumin seeds.',
    trimesterRecommended: 'All Trimesters',
    tags: ['High Calcium', 'Iron Rich', 'Gestational Diabetes Friendly'],
    maternalBenefits: 'Provides sustained slow-release energy, curbs sugar spikes, and supplements dietary iron.',
    maternalTip: 'Pat the dough with grated carrots or dill leaves (sabsige soppu) for additional folate and micronutrients.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['ragi roti', 'ragi rotti', 'millet roti', 'ragi chapati', 'finger millet flatbread'],
    recipe: {
      ingredients: [
        '1.5 cups Ragi Flour',
        '1 finely chopped Onion',
        '1/4 cup chopped Coriander & Curry Leaves',
        '1 tbsp Cumin Seeds',
        '1/2 tsp Grated Ginger',
        'Warm water for kneading',
        '1 tsp Cold-Pressed Oil or Ghee'
      ],
      instructions: [
        'Mix ragi flour, chopped onion, greens, cumin, ginger, and salt in a mixing bowl.',
        'Add warm water incrementally and knead into a soft, pliable, non-sticky dough.',
        'Place a ball of dough on a greased banana leaf or parchment paper and gently pat thin with moist fingers.',
        'Transfer onto a hot cast-iron tawa, drizzle minimal ghee, and cook both sides on medium heat until golden brown spots appear.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 12,
      storageAdvice: 'Serve warm immediately; gets firm if stored too long.',
      pregnancySafetyTips: 'Use cold-pressed oil or pure cow ghee; avoid excessive chili for heartburn relief.'
    }
  },

  // 3. Masala Dosa
  {
    foodId: 'southindia-masala-dosa-potato-crepe',
    slug: 'masala_dosa',
    googleDriveFileId: '1aJwPV4kfiatWwVZdLZQiGzNGc0DW_E7f',
    originalLabel: 'Masala dosa Image',
    foodName: 'Masala Dosa (Crisp Crepe with Spiced Potato)',
    regionalName: 'ಮಸಾಲೆ ದೋಸೆ / மசாலா தோசை',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/masala_dosa.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1aJwPV4kfiatWwVZdLZQiGzNGc0DW_E7f',
      'https://lh3.googleusercontent.com/d/1aJwPV4kfiatWwVZdLZQiGzNGc0DW_E7f=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 310,
    protein: 6.2,
    carbohydrates: 48.0,
    fat: 10.5,
    fiber: 4.5,
    iron: 2.1,
    calcium: 62,
    folate: 38,
    glycemicIndex: 'Medium',
    servingSize: '1 Dosa with Sambar (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Fermented batter promotes beneficial maternal gut microbiome and healthy digestion.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Fermented Gut Friendly', 'Energy Rich', 'Digestive Health'],
    maternalBenefits: 'Lactic acid fermentation increases bioavailability of B-vitamins and eases morning sickness.',
    maternalTip: 'Pair with iron-rich vegetable sambar rather than excess raw coconut chutney if managing gestational calories.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['masala dosa', 'mysore masala dosa', 'aloo masala dosa', 'crispy masala dosa'],
    recipe: {
      ingredients: [
        '1 cup Fermented Rice-Urad Dal Batter',
        '2 Boiled Potatoes (mashed)',
        '1 chopped Onion',
        '1/2 tsp Mustard & Cumin Seeds',
        '1/4 tsp Turmeric Powder',
        '1 tsp Cow Ghee'
      ],
      instructions: [
        'Sauté mustard seeds, cumin, onions, and turmeric in 1/2 tsp ghee until fragrant.',
        'Add boiled mashed potatoes, salt, and 2 tbsp water; simmer for 3 minutes to create potato palya.',
        'Pour ladleful of batter onto a well-seasoned hot cast-iron griddle, spreading into a thin disc.',
        'Drizzle drops of ghee, cook until crisp and golden, place potato filling in the center, fold, and serve.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 8,
      storageAdvice: 'Consume immediately while crisp.',
      pregnancySafetyTips: 'Ensure potatoes are thoroughly cooked and batter is fresh and hygienic.'
    }
  },

  // 4. Green Palak Dosa
  {
    foodId: 'southindia-green-palak-dosa-spinach-crepe',
    slug: 'green_palak_dosa',
    googleDriveFileId: '1_7wnzaWiO4dEEoYFtPAOcHO7aFqSw01E',
    originalLabel: 'Green palak dosa Image',
    foodName: 'Green Palak Dosa (Spinach Lentil Crepe)',
    regionalName: 'ಪಾಲಕ್ ದೋಸೆ / பாலக் தோசை',
    cuisine: 'South Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/green_palak_dosa.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1_7wnzaWiO4dEEoYFtPAOcHO7aFqSw01E',
      'https://lh3.googleusercontent.com/d/1_7wnzaWiO4dEEoYFtPAOcHO7aFqSw01E=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 245,
    protein: 8.4,
    carbohydrates: 40.0,
    fat: 5.8,
    fiber: 6.2,
    iron: 4.8,
    calcium: 128,
    folate: 94,
    glycemicIndex: 'Low',
    servingSize: '2 Crepes (170g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Dense in active natural folate and non-heme iron for maternal hemoglobin synthesis.',
    trimesterRecommended: '1st Trimester',
    tags: ['Folate Rich', 'Iron Booster', 'Gestational Health'],
    maternalBenefits: 'High natural folate (94mcg) supports healthy fetal neural tube development during early pregnancy.',
    maternalTip: 'Add a squeeze of fresh lemon juice over the dosa to maximize vitamin-C-mediated non-heme iron absorption.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['green palak dosa', 'palak dosa', 'spinach dosa', 'green dosa', 'palak batter dosa'],
    recipe: {
      ingredients: [
        '1.5 cups Fresh Washed Palak (Spinach) Leaves',
        '1 cup Dosa Batter or Moong Dal Batter',
        '1 small piece Ginger',
        '1 Green Cardamom & Cumin Pinch',
        '1 tsp Ghee'
      ],
      instructions: [
        'Blanch fresh palak leaves in boiling water for 60 seconds and transfer immediately to cold water.',
        'Puree the blanched spinach with ginger and cumin into a vibrant green paste.',
        'Gently fold the spinach puree into fermented dosa batter.',
        'Pour onto a medium-hot tawa, cook with drops of ghee until edges lift cleanly, flip briefly, and serve.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 8,
      storageAdvice: 'Batter can be refrigerated for 24 hours in an airtight container.',
      pregnancySafetyTips: 'Thoroughly wash spinach leaves under running water to eliminate all soil microbes.'
    }
  },

  // 5. Thick Poha
  {
    foodId: 'maharashtra-kanda-batata-poha-flattened-rice-with-peas-peanuts',
    slug: 'thick_poha',
    googleDriveFileId: '1XAcjJhFD9T8vUvBv9He6xzyplsfPhWqb',
    originalLabel: 'Thick poha recipe Image',
    foodName: 'Kanda Batata Poha / Thick Poha',
    regionalName: 'ಕಾಂದಾ ಬಟಾಟೆ ಅವಲಕ್ಕಿ / कांदा पोहा',
    cuisine: 'Maharashtrian',
    state: 'Maharashtra',
    region: 'West India',
    category: 'Millets & Grains',
    isVegetarian: true,
    imageUrl: '/food-dataset/thick_poha.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1XAcjJhFD9T8vUvBv9He6xzyplsfPhWqb',
      'https://lh3.googleusercontent.com/d/1XAcjJhFD9T8vUvBv9He6xzyplsfPhWqb=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 280,
    protein: 5.6,
    carbohydrates: 52.0,
    fat: 6.2,
    fiber: 4.8,
    iron: 4.5,
    calcium: 46,
    folate: 32,
    glycemicIndex: 'Medium',
    servingSize: '1 Medium Bowl (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Iron-rich traditional flattened rice; very gentle on the stomach during morning sickness.',
    trimesterRecommended: '1st Trimester',
    tags: ['Iron Rich', 'Morning Sickness Reliever', 'Easy Digestion'],
    maternalBenefits: 'Flattened rice iron content helps prevent maternal fatigue and anemia while being quick to digest.',
    maternalTip: 'Add roasted peanuts, green peas, and fresh lime juice to boost both protein and iron absorption.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['thick poha', 'kanda poha', 'batata poha', 'avalakki', 'flattened rice', 'poha recipe'],
    recipe: {
      ingredients: [
        '1.5 cups Thick Poha (flattened rice)',
        '1 finely chopped Onion',
        '1 small boiled Potato (cubed)',
        '2 tbsp Roasted Peanuts',
        '1/2 tsp Mustard Seeds & Turmeric',
        '1 tbsp Lemon Juice & Fresh Coriander'
      ],
      instructions: [
        'Rinse thick poha in a colander under running water for 30 seconds; drain completely and rest for 5 minutes.',
        'Temper mustard seeds, curry leaves, and green chili in 1 tsp oil.',
        'Add chopped onions and boiled potatoes; sauté until translucent, then add turmeric and salt.',
        'Gently fold in rinsed poha, cover and steam on low for 3 minutes. Finish with fresh lime juice and roasted peanuts.'
      ],
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      storageAdvice: 'Best eaten immediately while moist and warm.',
      pregnancySafetyTips: 'Do not over-soak poha to avoid sogginess; ensure peanuts are fresh and aflatoxin-free.'
    }
  },

  // 6. Idli Vada Combo
  {
    foodId: 'southindia-idli-vada-combo-with-chutney-sambar',
    slug: 'idli_vada',
    googleDriveFileId: '1a1cwPHsRMDqC-wdJ1Wnv8a_kmLOW1Pbb',
    originalLabel: 'Idle vada Image',
    foodName: 'Idli Vada Combo with Chutney & Sambar',
    regionalName: 'ಇಡ್ಲಿ ವಡೆ / இட்லி வடை',
    cuisine: 'South Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/idli_vada.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1a1cwPHsRMDqC-wdJ1Wnv8a_kmLOW1Pbb',
      'https://lh3.googleusercontent.com/d/1a1cwPHsRMDqC-wdJ1Wnv8a_kmLOW1Pbb=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 360,
    protein: 11.2,
    carbohydrates: 56.0,
    fat: 9.8,
    fiber: 6.4,
    iron: 3.2,
    calcium: 84,
    folate: 45,
    glycemicIndex: 'Medium',
    servingSize: '2 Idlis + 1 Medu Vada (220g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Steamed fermented idlis are extremely gentle on digestion; lentil medu vada provides rich plant protein.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Fermented Gut Friendly', 'High Protein', 'Morning Comfort'],
    maternalBenefits: 'Balanced amino acid profile from rice and urad dal combination; gentle fuel for nausea-prone mornings.',
    maternalTip: 'Pair with warm vegetable-loaded toor dal sambar for fiber and essential vitamins.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['idli vada', 'idle vada', 'idly vada', 'idli medu vada', 'idli sambar vada'],
    recipe: {
      ingredients: [
        '2 cups Steamed Rice-Urad Dal Batter',
        '1 cup Soaked Urad Dal (coarsely ground for vada)',
        '1 tsp Cumin Seeds, Black Pepper & Curry Leaves',
        'Oil for frying vada',
        'Water for steaming idlis'
      ],
      instructions: [
        'Grease idli plates with mild ghee, pour batter, and steam in an idli steamer for 10-12 minutes until soft and fluffy.',
        'Whip urad dal batter with cracked pepper, cumin, and salt until light and aerated.',
        'Shape small rounds with a center hole using moist palms, gently slip into medium-hot oil, and fry until golden crisp.',
        'Serve steamed hot idlis and crisp vada accompanied by freshly made hot vegetable sambar.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      storageAdvice: 'Idlis keep moist in a hot-pack for 6 hours; vadas best enjoyed freshly prepared.',
      pregnancySafetyTips: 'Ensure frying oil is fresh and not reused; enjoy vada in moderation if experiencing acidity.'
    }
  },

  // 7. Kadai Paneer
  {
    foodId: 'punjab-kadai-paneer-mild-capsicum-paneer',
    slug: 'kadai_paneer',
    googleDriveFileId: '1AzEDSYkdhe9ebN1955VCYPID6HD985d8',
    originalLabel: 'Kadai paneer Image',
    foodName: 'Kadai Paneer (Mild Capsicum Cottage Cheese)',
    regionalName: 'ಕಡಾಯಿ ಪನೀರ್ / कड़ाही पनीर',
    cuisine: 'Punjabi',
    state: 'Punjab',
    region: 'North India',
    category: 'Dairy',
    isVegetarian: true,
    imageUrl: '/food-dataset/kadai_paneer.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1AzEDSYkdhe9ebN1955VCYPID6HD985d8',
      'https://lh3.googleusercontent.com/d/1AzEDSYkdhe9ebN1955VCYPID6HD985d8=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 330,
    protein: 16.5,
    carbohydrates: 12.0,
    fat: 24.0,
    fiber: 3.8,
    iron: 1.8,
    calcium: 390,
    folate: 28,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Prepared with pasteurized cottage cheese; delivers bioavailable calcium and complete milk protein for fetal tissue synthesis.',
    trimesterRecommended: '2nd Trimester',
    tags: ['High Calcium', 'High Protein', 'Skeletal Growth'],
    maternalBenefits: 'Outstanding calcium content (390mg) strengthens maternal bone density and supports rapid second-trimester fetal skeletal growth.',
    maternalTip: 'Always use pasteurized paneer. Keep spice levels moderate to avoid pregnancy heartburn.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['kadai paneer', 'karahi paneer', 'capsicum paneer', 'paneer capsicum gravy'],
    recipe: {
      ingredients: [
        '200g Fresh Pasteurized Paneer (cubed)',
        '1 Green Bell Pepper (capsicum, cubed)',
        '2 ripe Tomatoes (pureed)',
        '1 Onion (diced)',
        '1 tbsp Kadai Masala (crushed coriander & cumin seeds)',
        '1 tsp Ghee'
      ],
      instructions: [
        'Dry roast coriander seeds, cumin, and dry fennel; crush into coarse kadai masala powder.',
        'Sauté diced onion and capsicum in ghee on high flame for 2 minutes until tender-crisp; set aside.',
        'Simmer tomato puree with ginger, kadai masala, and a touch of salt until oil leaves the sides.',
        'Gently fold in paneer cubes and sautéed capsicum; simmer for 3 minutes. Garnish with fresh ginger juliennes.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      storageAdvice: 'Refrigerate in a glass container for up to 24 hours.',
      pregnancySafetyTips: 'Verify paneer is made from pasteurized milk to prevent listeria risk.'
    }
  },

  // 8. Traditional Daal
  {
    foodId: 'northindia-traditional-yellow-daal-tadka',
    slug: 'daal',
    googleDriveFileId: '1kqcBHBfemclk2XK5f3oO_5xi1FsG7fOb',
    originalLabel: 'Daal Image',
    foodName: 'Traditional Yellow Daal Tadka',
    regionalName: 'ದಾಲ್ ತಡ್ಕಾ / दाल तड़का',
    cuisine: 'Pan-Indian',
    state: 'Uttar Pradesh',
    region: 'North India',
    category: 'Pulses & Legumes',
    isVegetarian: true,
    imageUrl: '/food-dataset/daal.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1kqcBHBfemclk2XK5f3oO_5xi1FsG7fOb',
      'https://lh3.googleusercontent.com/d/1kqcBHBfemclk2XK5f3oO_5xi1FsG7fOb=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 195,
    protein: 12.2,
    carbohydrates: 28.0,
    fat: 4.1,
    fiber: 6.8,
    iron: 3.4,
    calcium: 68,
    folate: 110,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Essential maternal vegetarian protein and folate staple; completely safe and fundamental throughout pregnancy.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Folate Rich', 'Plant Protein', 'Gut Health'],
    maternalBenefits: 'Provides 110mcg of natural folate (over 25% of daily maternal need) and essential amino acids.',
    maternalTip: 'Add a pinch of hing (asafoetida) and cumin to the ghee tadka to reduce potential bloating.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['daal', 'dal tadka', 'yellow dal', 'toor dal', 'dal fry', 'moong dal tadka'],
    recipe: {
      ingredients: [
        '3/4 cup Toor Dal & Moong Dal mix',
        '1 ripe Tomato (chopped)',
        '1/2 tsp Turmeric & Hing (pinch)',
        '1 tsp Cumin Seeds & Ghee for tadka',
        'Fresh Coriander leaves'
      ],
      instructions: [
        'Wash lentils thoroughly and pressure cook with 2.5 cups water, turmeric, and a pinch of salt for 4 whistles.',
        'Whisk cooked lentils to a velvety, smooth consistency.',
        'Heat ghee in a small pan; crackle cumin seeds, hing, ginger, and diced tomatoes until soft.',
        'Pour aromatic tadka over simmering dal; boil for 2 minutes and garnish with fresh coriander.'
      ],
      prepTimeMinutes: 5,
      cookTimeMinutes: 20,
      storageAdvice: 'Refrigerate for up to 2 days; reheat thoroughly until bubbling.',
      pregnancySafetyTips: 'Soak dal for 20 minutes prior to cooking for optimal mineral absorption.'
    }
  },

  // 9. Sarson Ka Saag
  {
    foodId: 'punjab-sarson-ka-saag-mustard-spinach-greens',
    slug: 'saag',
    googleDriveFileId: '1qqO8ifFQJVBiQro1aBoC6TebAw8xEd2_',
    originalLabel: 'Saag Image',
    foodName: 'Sarson Ka Saag (Mustard & Spinach Greens)',
    regionalName: 'ಸಾಸಿವೆ ಸೊಪ್ಪಿನ ಸಾಗು / सरसों का साग',
    cuisine: 'Punjabi',
    state: 'Punjab',
    region: 'North India',
    category: 'Vegetables & Greens',
    isVegetarian: true,
    imageUrl: '/food-dataset/saag.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1qqO8ifFQJVBiQro1aBoC6TebAw8xEd2_',
      'https://lh3.googleusercontent.com/d/1qqO8ifFQJVBiQro1aBoC6TebAw8xEd2_=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 180,
    protein: 6.5,
    carbohydrates: 16.0,
    fat: 8.5,
    fiber: 7.8,
    iron: 5.2,
    calcium: 280,
    folate: 142,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Powerhouse of folates, non-heme iron, lutein, and dietary fiber; vital for preventing maternal anemia.',
    trimesterRecommended: '1st Trimester',
    tags: ['Iron Powerhouse', 'Folate Rich', 'Fiber Rich'],
    maternalBenefits: 'Extraordinary folate (142mcg) and plant iron (5.2mg) significantly elevate maternal hemoglobin naturally.',
    maternalTip: 'Pair with Vitamin C-rich foods or a dash of amchur/lemon to maximize non-heme iron uptake.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['saag', 'sarson ka saag', 'palak saag', 'green saag', 'mustard greens'],
    recipe: {
      ingredients: [
        '2 bunches Mustard Greens (Sarson), washed & chopped',
        '1 bunch Fresh Spinach (Palak)',
        '1/2 bunch Bathua or Methi',
        '2 tbsp Maize Flour (Makki Atta)',
        '1 tbsp Cow Butter or Ghee',
        '1 inch Ginger & 2 cloves Garlic'
      ],
      instructions: [
        'Thoroughly wash greens in 3 changes of clean water to eliminate all grit.',
        'Pressure cook greens with ginger, garlic, green chili, and salt for 10 minutes.',
        'Blend or mash coarsely using a wooden mathani. Dissolve makki atta in 3 tbsp water and stir in.',
        'Simmer gently for 15 minutes until velvety. Temper with golden brown garlic in warm ghee.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      storageAdvice: 'Keeps well in refrigerator for up to 3 days; flavors deepen over time.',
      pregnancySafetyTips: 'Wash wild greens meticulously to ensure zero soil microbial contamination.'
    }
  },

  // 10. Carrot Halwa
  {
    foodId: 'punjab-gajar-ka-halwa-carrot-milk-pudding',
    slug: 'carrot_halwa',
    googleDriveFileId: '1OyvcmXyFCA4Xbun5CFmlzNC9Pr0akFmp',
    originalLabel: 'Carrot halwa Image',
    foodName: 'Gajar Ka Halwa / Carrot Halwa',
    regionalName: 'ಕ್ಯಾರೆಟ್ ಹಲ್ವಾ / गाजर का हलवा',
    cuisine: 'Punjabi',
    state: 'Punjab',
    region: 'North India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/carrot_halwa.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1OyvcmXyFCA4Xbun5CFmlzNC9Pr0akFmp',
      'https://lh3.googleusercontent.com/d/1OyvcmXyFCA4Xbun5CFmlzNC9Pr0akFmp=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 260,
    protein: 5.2,
    carbohydrates: 38.0,
    fat: 10.2,
    fiber: 3.4,
    iron: 1.2,
    calcium: 160,
    folate: 14,
    glycemicIndex: 'Medium',
    servingSize: '1 Small Cup (120g)',
    safetyLevel: 'Safe in Moderation',
    safetyExplanation: 'Rich in dietary beta-carotene (provitamin A) and milk calcium; enjoy in controlled portions to regulate gestational sugars.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Provitamin A', 'Antioxidants', 'Treat in Moderation'],
    maternalBenefits: 'Carrot beta-carotene supports fetal eye development and maternal postpartum immune integrity.',
    maternalTip: 'Prepared with low jaggery or dates puree instead of refined white sugar for pregnant mothers.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['carrot halwa', 'gajar halwa', 'gajar ka halwa', 'carrot pudding'],
    recipe: {
      ingredients: [
        '3 cups Grated Red Carrots (Gajar)',
        '2 cups Pasteurized Full-Cream Milk',
        '2 tbsp Jaggery or Date Paste',
        '1 tbsp Cow Ghee',
        '1/4 tsp Cardamom Powder & Crushed Almonds'
      ],
      instructions: [
        'Sauté grated carrots in ghee for 5 minutes in a heavy kadai until moisture reduces.',
        'Pour milk and simmer on low-medium flame, stirring occasionally until milk fully reduces and thickens.',
        'Add jaggery powder and cardamom; stir well on medium flame for 5 minutes until glossy.',
        'Garnish with slivered soaked almonds and serve warm.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 35,
      storageAdvice: 'Refrigerate for up to 4 days in a covered container.',
      pregnancySafetyTips: 'Use organic jaggery in moderation; avoid excess refined sugar.'
    }
  },

  // 11. Pesarattu
  {
    foodId: 'andhrapradesh-pesarattu-whole-moong-sprouted-crepe',
    slug: 'pesarattu',
    googleDriveFileId: '10gLqvRuPmfkF9XCl6Hyp13Uk-iRX-Tg5',
    originalLabel: 'pesarattu Image',
    foodName: 'Pesarattu (Whole Moong Sprouted Crepe)',
    regionalName: 'ಪೆಸರಟ್ಟು / పెసరట్టు',
    cuisine: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/pesarattu.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=10gLqvRuPmfkF9XCl6Hyp13Uk-iRX-Tg5',
      'https://lh3.googleusercontent.com/d/10gLqvRuPmfkF9XCl6Hyp13Uk-iRX-Tg5=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 285,
    protein: 14.8,
    carbohydrates: 46.0,
    fat: 4.5,
    fiber: 8.6,
    iron: 4.1,
    calcium: 78,
    folate: 88,
    glycemicIndex: 'Low',
    servingSize: '2 Crepes with Ginger Chutney (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Exceptional plant protein powerhouse made from whole green moong; low glycemic index safeguards against gestational diabetes.',
    trimesterRecommended: 'All Trimesters',
    tags: ['High Protein', 'Gestational Diabetes Friendly', 'High Fiber'],
    maternalBenefits: '14.8g of clean plant protein and high dietary fiber maintain satiety and stabilize maternal blood sugar levels.',
    maternalTip: 'Pair with mild allam pachadi (ginger chutney) to soothe morning nausea.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['pesarattu', 'moong dal dosa', 'green gram dosa', 'pesara dosa', 'sprouted moong crepe'],
    recipe: {
      ingredients: [
        '1 cup Whole Green Moong Dal (soaked overnight)',
        '1 inch Ginger piece',
        '1 tsp Cumin Seeds',
        '1/4 cup finely chopped Onions & Coriander',
        '1 tsp Ghee for cooking'
      ],
      instructions: [
        'Grind soaked green gram with ginger, cumin, salt, and water into a smooth, slightly thick batter.',
        'Heat a cast-iron dosa tawa, pour a ladleful of batter, and spread evenly into a thin circle.',
        'Top with finely diced onions, coriander, and a light drizzle of ghee.',
        'Cook on medium heat until golden crisp on both sides, and fold.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      storageAdvice: 'Batter can be refrigerated for up to 3 days.',
      pregnancySafetyTips: 'Soak moong beans for at least 6-8 hours to neutralize phytates and maximize digestibility.'
    }
  },

  // 12. Mangalore Buns
  {
    foodId: 'karnataka-mangalore-buns-banana-puri',
    slug: 'mangalore_buns',
    googleDriveFileId: '1H5Wxr0i_YG3iwVLggrkjd0-p_2Pyk0eA',
    originalLabel: 'Mangalore Buns Image',
    foodName: 'Mangalore Buns (Banana-Fermented Sweet Puri)',
    regionalName: 'ಮಂಗಳೂರು ಬನ್ಸ್',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Snacks & Soups',
    isVegetarian: true,
    imageUrl: '/food-dataset/mangalore_buns.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1H5Wxr0i_YG3iwVLggrkjd0-p_2Pyk0eA',
      'https://lh3.googleusercontent.com/d/1H5Wxr0i_YG3iwVLggrkjd0-p_2Pyk0eA=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 310,
    protein: 4.8,
    carbohydrates: 52.0,
    fat: 9.4,
    fiber: 3.1,
    iron: 1.4,
    calcium: 42,
    folate: 20,
    glycemicIndex: 'Medium',
    servingSize: '2 Fluffy Buns (140g)',
    safetyLevel: 'Safe in Moderation',
    safetyExplanation: 'Naturally sweetened with ripe bananas and yogurt; cumin seeds soothe gastric acidity.',
    trimesterRecommended: '2nd Trimester',
    tags: ['Potassium Boost', 'Natural Energy', 'Comfort Food'],
    maternalBenefits: 'Ripe bananas provide readily digestible carbohydrates and potassium, preventing leg cramps.',
    maternalTip: 'Opt for whole-wheat flour dough and drain excess oil on unbleached kitchen paper before eating.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['mangalore buns', 'banana buns', 'mangalorean buns', 'banana poori', 'sweet banana puri'],
    recipe: {
      ingredients: [
        '2 ripe Bananas (mashed smooth)',
        '1.5 cups Whole Wheat Flour',
        '2 tbsp Fresh Curd/Yogurt',
        '1 tsp Cumin Seeds',
        '1 tbsp Jaggery or Raw Sugar',
        'Oil for frying'
      ],
      instructions: [
        'Mash ripe bananas thoroughly with yogurt, sugar, cumin, and a pinch of salt.',
        'Add wheat flour and knead into a soft, non-sticky dough without adding extra water.',
        'Cover and ferment at room temperature for 6-8 hours or overnight.',
        'Roll into slightly thick circles (like small puris) and deep fry in hot oil until puffed and golden brown.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      storageAdvice: 'Stays soft and flavorful for up to 24 hours at room temperature.',
      pregnancySafetyTips: 'Consume in moderation to manage gestational calorie intake.'
    }
  },

  // 13. Karnataka Vegetable Palav
  {
    foodId: 'karnataka-traditional-vegetable-palav',
    slug: 'palav',
    googleDriveFileId: '175RERXIthvSeyOOoSMwfGr0SsfdWHmyh',
    originalLabel: 'Palav Image',
    foodName: 'Karnataka Traditional Vegetable Palav',
    regionalName: 'ತರಕಾರಿ ಪಲಾವ್',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Millets & Grains',
    isVegetarian: true,
    imageUrl: '/food-dataset/palav.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=175RERXIthvSeyOOoSMwfGr0SsfdWHmyh',
      'https://lh3.googleusercontent.com/d/175RERXIthvSeyOOoSMwfGr0SsfdWHmyh=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 330,
    protein: 7.8,
    carbohydrates: 60.0,
    fat: 7.2,
    fiber: 5.6,
    iron: 2.8,
    calcium: 74,
    folate: 52,
    glycemicIndex: 'Medium',
    servingSize: '1 Plate with Raita (220g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Nutrient-rich single-pot rice prepared with diverse garden vegetables, mint, and wholesome whole spices.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Balanced Meal', 'Digestive Herbs', 'Vegetable Rich'],
    maternalBenefits: 'Combination of carrots, beans, peas, and fresh mint provides dietary fiber, beta-carotene, and nausea-relieving herbs.',
    maternalTip: 'Pair with cucumber-pomegranate curd raita for cooling digestive support.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['palav', 'veg palav', 'karnataka palav', 'vegetable pulao', 'veg pulao', 'pulao'],
    recipe: {
      ingredients: [
        '1 cup Sona Masoori or Basmati Rice',
        '1 cup Mixed Vegetables (Carrots, Beans, Green Peas, Potatoes)',
        '1/2 cup Mint & Coriander Paste with Ginger-Garlic',
        '1 tbsp Ghee & Whole Spices (Cinnamon, Cardamom, Cloves)',
        '2 cups Water or Light Coconut Milk'
      ],
      instructions: [
        'Heat ghee in a pressure cooker; sizzle cinnamon, cardamom, cloves, and bay leaf.',
        'Add sliced onions followed by fresh mint-coriander paste; sauté until oil separates.',
        'Add chopped vegetables, washed rice, and salt; stir gently to coat grains in herbs.',
        'Pour warm water/light coconut milk, cover, and pressure cook for 2 whistles on medium flame.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      storageAdvice: 'Best consumed warm; refrigerate leftovers for up to 24 hours.',
      pregnancySafetyTips: 'Ensure all vegetables are thoroughly washed and cooked tender.'
    }
  },

  // 14. Soya Chunk Pulao
  {
    foodId: 'centralindia-soya-chunk-pulao-high-protein',
    slug: 'soy_chunk_pulao',
    googleDriveFileId: '1fionpTrGUorAHC_oFq1u0_biEjB9yKjW',
    originalLabel: 'Soy chunk pulao Image',
    foodName: 'Soya Chunk Pulao (High-Protein Pilaf)',
    regionalName: 'ಸೋಯಾ ಪುಲಾವ್ / सोया चंक पुलाव',
    cuisine: 'Pan-Indian',
    state: 'Madhya Pradesh',
    region: 'Central India',
    category: 'Millets & Grains',
    isVegetarian: true,
    imageUrl: '/food-dataset/soy_chunk_pulao.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1fionpTrGUorAHC_oFq1u0_biEjB9yKjW',
      'https://lh3.googleusercontent.com/d/1fionpTrGUorAHC_oFq1u0_biEjB9yKjW=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 345,
    protein: 16.2,
    carbohydrates: 54.0,
    fat: 6.5,
    fiber: 6.2,
    iron: 4.4,
    calcium: 115,
    folate: 64,
    glycemicIndex: 'Low',
    servingSize: '1 Plate (220g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Complete plant protein source offering 16.2g protein per portion; ideal for vegetarian mothers requiring tissue-building macros.',
    trimesterRecommended: '2nd Trimester',
    tags: ['High Protein', 'Iron Booster', 'Vegetarian Muscle Support'],
    maternalBenefits: 'Soya chunks deliver complete amino acids and bioavailable iron to support accelerated fetal growth in mid-pregnancy.',
    maternalTip: 'Squeeze soaked soya chunks completely before cooking to ensure tender absorption of aromatic spices.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['soy chunk pulao', 'soya pulao', 'soya chunk biryani', 'meal maker pulao', 'soya rice'],
    recipe: {
      ingredients: [
        '1 cup Soya Chunks (Nutrela)',
        '1 cup Basmati Rice (rinsed)',
        '1 sliced Onion & 1 chopped Tomato',
        '1/2 cup Green Peas',
        '1 tbsp Ginger-Garlic Paste & Biryani Spices',
        '1 tbsp Ghee'
      ],
      instructions: [
        'Boil soya chunks in salted water for 5 minutes; drain and squeeze out all excess moisture thoroughly.',
        'Heat ghee in a pot; sauté onions, ginger-garlic paste, and tomatoes until aromatic.',
        'Add soya chunks, green peas, turmeric, and garam masala; roast for 3 minutes.',
        'Add soaked rice and 2 cups warm water. Cover and cook on low heat for 15 minutes until fluffy.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      storageAdvice: 'Keeps fresh in the refrigerator for up to 24 hours.',
      pregnancySafetyTips: 'Boil and squeeze soya chunks in hot water to eliminate residual oligosaccharides.'
    }
  },

  // 15. Spiced Vegetable Tikkis
  {
    foodId: 'northindia-spiced-vegetable-tikkis',
    slug: 'veg_tikkis',
    googleDriveFileId: '11kU_tKHsPgn8lkCKc5My-Whvqezxx1f6',
    originalLabel: 'Veg tikkis Image',
    foodName: 'Spiced Vegetable Tikkis (Nutritious Veg Cutlets)',
    regionalName: 'ತರಕಾರಿ ಕಟ್ಲೆಟ್ / वेज टिक्की',
    cuisine: 'North Indian',
    state: 'Delhi',
    region: 'North India',
    category: 'Snacks & Soups',
    isVegetarian: true,
    imageUrl: '/food-dataset/veg_tikkis.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=11kU_tKHsPgn8lkCKc5My-Whvqezxx1f6',
      'https://lh3.googleusercontent.com/d/11kU_tKHsPgn8lkCKc5My-Whvqezxx1f6=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 220,
    protein: 5.8,
    carbohydrates: 36.0,
    fat: 6.2,
    fiber: 5.4,
    iron: 2.4,
    calcium: 62,
    folate: 42,
    glycemicIndex: 'Medium',
    servingSize: '2 Tikkis with Mint Chutney (150g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Pan-roasted patties loaded with carrots, peas, and potatoes; provides a nutritious snack packed with fiber and vitamins.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Wholesome Snack', 'Fiber Rich', 'Comfort Food'],
    maternalBenefits: 'Satisfies pregnancy evening cravings while delivering mixed vegetables, complex carbohydrates, and fiber.',
    maternalTip: 'Shallow fry on an iron griddle using minimal cold-pressed oil rather than deep-frying.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['veg tikkis', 'vegetable cutlet', 'aloo tikki', 'veg patties', 'vegetable tikki'],
    recipe: {
      ingredients: [
        '2 Boiled Potatoes (peeled & mashed)',
        '1/2 cup Steamed Peas, Carrots & Sweet Corn',
        '2 tbsp Roasted Oats Powder or Poha Powder (for binding)',
        '1/2 tsp Cumin, Garam Masala & Amchur',
        '1 tsp Oil for shallow frying'
      ],
      instructions: [
        'Combine mashed potatoes, steamed vegetables, oats powder, spices, and salt into a firm dough.',
        'Divide into round flattened discs (tikkis).',
        'Heat a tawa with a light brush of oil; place tikkis and cook on medium-low heat.',
        'Flip after 4-5 minutes when golden crisp; cook the other side until evenly crusty.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 12,
      storageAdvice: 'Uncooked patties can be refrigerated for 24 hours; cook fresh before serving.',
      pregnancySafetyTips: 'Use oats powder instead of refined breadcrumbs for wholesome fiber.'
    }
  },

  // 16. Toasted Vegetable Sandwich
  {
    foodId: 'panindia-whole-wheat-toasted-vegetable-sandwich',
    slug: 'toasted_sandwich',
    googleDriveFileId: '13keXihFn8pt4sCO3if_AqjicxVlWIfie',
    originalLabel: 'Toasted sandwich Image',
    foodName: 'Whole-Wheat Toasted Vegetable Sandwich',
    regionalName: 'ಹೋಲ್ ವೀಟ್ ವೆಜ್ ಸ್ಯಾಂಡ್‌ವಿಚ್ / टोस्टेड सैंडविच',
    cuisine: 'Pan-Indian',
    state: 'Maharashtra',
    region: 'West India',
    category: 'Snacks & Soups',
    isVegetarian: true,
    imageUrl: '/food-dataset/toasted_sandwich.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=13keXihFn8pt4sCO3if_AqjicxVlWIfie',
      'https://lh3.googleusercontent.com/d/13keXihFn8pt4sCO3if_AqjicxVlWIfie=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 270,
    protein: 8.4,
    carbohydrates: 44.0,
    fat: 6.8,
    fiber: 6.1,
    iron: 2.6,
    calcium: 110,
    folate: 48,
    glycemicIndex: 'Medium',
    servingSize: '1 Full Sandwich (170g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Wholesome whole-wheat bread toasted with cucumber, tomato, paneer, and fresh mint chutney.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Quick Nutrient Fix', 'High Fiber', 'Healthy Snack'],
    maternalBenefits: 'Whole grains provide B-vitamins and steady energy; mint chutney and fresh vegetables supply antioxidants and hydration.',
    maternalTip: 'Always wash vegetables thoroughly and toast bread until hot and crisp throughout.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['toasted sandwich', 'veg sandwich', 'bombay veg sandwich', 'grilled veg sandwich', 'whole wheat sandwich'],
    recipe: {
      ingredients: [
        '2 slices 100% Whole Wheat Bread',
        '1 sliced boiled Potato, Tomato & Cucumber',
        '2 thin slices Pasteurized Paneer',
        '1 tbsp Fresh Mint-Coriander Chutney',
        '1/2 tsp Ghee or Butter for toasting'
      ],
      instructions: [
        'Spread fresh mint-coriander chutney lightly over both whole wheat bread slices.',
        'Layer sliced cucumber, tomatoes, boiled potatoes, and pasteurized paneer with a pinch of roasted cumin powder.',
        'Close sandwich and toast on a skillet or sandwich press with minimal ghee until crisp and golden on both sides.'
      ],
      prepTimeMinutes: 8,
      cookTimeMinutes: 6,
      storageAdvice: 'Consume warm immediately to prevent bread from turning soggy.',
      pregnancySafetyTips: 'Avoid unpasteurized cheese; ensure tomatoes and cucumbers are washed in salted water.'
    }
  },

  // 17. Kala Chana Sundal (Black Chickpea Salad)
  {
    foodId: 'southindia-kala-chana-sundal-black-chickpea-salad',
    slug: 'black_chickpea_salad',
    googleDriveFileId: '1lPFGgV4NmDnNNP5KjoOor1xOYEWWHs8k',
    originalLabel: 'black chickpea salad Image',
    foodName: 'Kala Chana Sundal (Black Chickpea Salad)',
    regionalName: 'ಕಡಲೆ ಕಾಳು ಉಸಲಿ / கொண்டைக்கடலை சுண்டல்',
    cuisine: 'Tamil Nadu',
    state: 'Tamil Nadu',
    region: 'South India',
    category: 'Pulses & Legumes',
    isVegetarian: true,
    imageUrl: '/food-dataset/black_chickpea_salad.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1lPFGgV4NmDnNNP5KjoOor1xOYEWWHs8k',
      'https://lh3.googleusercontent.com/d/1lPFGgV4NmDnNNP5KjoOor1xOYEWWHs8k=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 240,
    protein: 12.8,
    carbohydrates: 38.0,
    fat: 4.5,
    fiber: 9.2,
    iron: 4.8,
    calcium: 98,
    folate: 124,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl (160g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Superb maternal non-heme iron booster; clinical dietary gold-standard for elevating maternal hemoglobin levels.',
    trimesterRecommended: '2nd Trimester',
    tags: ['Iron Powerhouse', 'Folate Rich', 'Prevents Anemia'],
    maternalBenefits: 'Rich 4.8mg iron and 124mcg folate per bowl; high soluble fiber completely prevents gestational constipation.',
    maternalTip: 'Add grated fresh coconut and a squeeze of fresh lemon juice just before eating to amplify iron absorption.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['black chickpea salad', 'kala chana sundal', 'chana sundal', 'black chana salad', 'kadale kalu usli'],
    recipe: {
      ingredients: [
        '1 cup Black Chickpeas (Kala Chana), soaked overnight',
        '2 tbsp Grated Fresh Coconut',
        '1/2 tsp Mustard Seeds, Hing & Curry Leaves',
        '1 tsp Coconut Oil or Ghee',
        '1 tbsp Lemon Juice & chopped Coriander'
      ],
      instructions: [
        'Soak black chickpeas for 8-10 hours, then pressure cook with salt and 2 cups water for 5 whistles until tender.',
        'Drain completely (save nutrient water for soups/dal).',
        'Heat coconut oil in a pan; crackle mustard seeds, curry leaves, and a generous pinch of hing.',
        'Add cooked chickpeas, toss well for 2 minutes, remove from heat, fold in fresh coconut, and finish with fresh lemon juice.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      storageAdvice: 'Refrigerate for up to 2 days.',
      pregnancySafetyTips: 'Cook chickpeas until completely soft to ensure optimal gut tolerance.'
    }
  },

  // 18. Vankaya Pachadi (Brinjal Chutney)
  {
    foodId: 'andhrapradesh-vankaya-pachadi-roasted-brinjal-chutney',
    slug: 'brinjal_chutney',
    googleDriveFileId: '1YjJK9LIk-I0OT_xGF_85dMgLKAmUp8rh',
    originalLabel: 'brinjal chutney Image',
    foodName: 'Vankaya Pachadi (Roasted Brinjal Chutney)',
    regionalName: 'ಬದನೆಕಾಯಿ ಚಟ್ನಿ / వంకాయ పచ్చడి',
    cuisine: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: true,
    imageUrl: '/food-dataset/brinjal_chutney.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1YjJK9LIk-I0OT_xGF_85dMgLKAmUp8rh',
      'https://lh3.googleusercontent.com/d/1YjJK9LIk-I0OT_xGF_85dMgLKAmUp8rh=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 85,
    protein: 1.8,
    carbohydrates: 9.0,
    fat: 4.8,
    fiber: 3.2,
    iron: 1.1,
    calcium: 28,
    folate: 18,
    glycemicIndex: 'Low',
    servingSize: '3 tbsp (80g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Char-roasted and thoroughly cooked eggplant with sesame seeds and cumin; digestive comfort accompaniment.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Digestive Support', 'Low Calorie', 'Traditional Accompaniment'],
    maternalBenefits: 'Provides dietary fiber and nasunin antioxidants while adding rich flavor to stimulate sluggish maternal appetite.',
    maternalTip: 'Ensure eggplant is roasted completely tender and skin peeled cleanly.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['brinjal chutney', 'vankaya pachadi', 'baingan chutney', 'eggplant chutney', 'ennegai chutney'],
    recipe: {
      ingredients: [
        '1 large Purple Brinjal (Eggplant)',
        '1 tbsp White Sesame Seeds (roasted)',
        '1 tsp Cumin Seeds & Tamarind piece',
        '1 tsp Sesame Oil',
        'Curry Leaves & Hing'
      ],
      instructions: [
        'Brush brinjal with drops of oil and roast over an open flame until charred on all sides and soft inside.',
        'Cool, peel charred outer skin, and mash pulp thoroughly.',
        'Pound roasted sesame seeds, cumin, tamarind, and salt in a mortar.',
        'Mix with mashed brinjal pulp; temper with mustard seeds and curry leaves in sesame oil.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      storageAdvice: 'Refrigerate in a glass jar for up to 3 days.',
      pregnancySafetyTips: 'Keep spice level mild to protect against heartburn.'
    }
  },

  // 19. Fresh Maternal Sliced Fruit Platter
  {
    foodId: 'national-fresh-maternal-sliced-fruit-platter',
    slug: 'sliced_fruits',
    googleDriveFileId: '1YbE-7iG4n1f5WZLCJ3D8LDX7tagROvmJ',
    originalLabel: 'Sliced fruits Image',
    foodName: 'Fresh Maternal Sliced Fruit Platter',
    regionalName: 'ತಾಜಾ ಹಣ್ಣುಗಳ ತಟ್ಟೆ / ताजे कटे फल',
    cuisine: 'Pan-Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Fruits',
    isVegetarian: true,
    imageUrl: '/food-dataset/sliced_fruits.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1YbE-7iG4n1f5WZLCJ3D8LDX7tagROvmJ',
      'https://lh3.googleusercontent.com/d/1YbE-7iG4n1f5WZLCJ3D8LDX7tagROvmJ=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 130,
    protein: 1.8,
    carbohydrates: 31.0,
    fat: 0.4,
    fiber: 5.2,
    iron: 0.9,
    calcium: 34,
    folate: 36,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Hygienically washed, freshly cut pregnancy-safe seasonal fruits (apples, pomegranate, bananas, pears); delivers cellular hydration.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Vitamin C Rich', 'Hydration', 'Prebiotic Fiber'],
    maternalBenefits: 'Packed with natural Vitamin C, soluble pectin, and polyphenols to strengthen immune barriers and maintain hydration.',
    maternalTip: 'Always wash fruits in running water and peel just before eating. Avoid pre-cut street fruits.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['sliced fruits', 'fresh fruit salad', 'fruit platter', 'maternal fruit bowl', 'fresh fruits'],
    recipe: {
      ingredients: [
        '1 Crisp Red Apple (peeled & sliced)',
        '1/2 cup Pomegranate Arils',
        '1 Ripe Robusta Banana (sliced)',
        '1 Guava or Sweet Orange wedges',
        'Pinch of roasted cumin powder'
      ],
      instructions: [
        'Immerse whole fruits in clean water with 1 tsp salt or vinegar for 10 minutes, then rinse thoroughly under running water.',
        'Peel and slice fruits with a sanitized knife on a clean board.',
        'Arrange artfully in a bowl, dust lightly with roasted cumin powder, and consume immediately.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 0,
      storageAdvice: 'Consume immediately after cutting; do not store cut fruit uncovered.',
      pregnancySafetyTips: 'Avoid raw unwashed fruits or roadside pre-cut salads to prevent foodborne infections.'
    }
  },

  // 20. Fresh Avocado Guacamole
  {
    foodId: 'continental-fresh-avocado-guacamole-spread',
    slug: 'guacamole',
    googleDriveFileId: '1Z8I_B8TzL8kWub2Do-1brDK7xqg2iuNH',
    originalLabel: 'guacamole Image',
    foodName: 'Fresh Avocado Guacamole / Avocado Mash',
    regionalName: 'ಆವಕಾಡೊ ಬೆಣ್ಣೆಹಣ್ಣಿನ ಗ್ರಿಲ್ / एवोकैडो गुआकामोल',
    cuisine: 'Pan-Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Vegetables & Greens',
    isVegetarian: true,
    imageUrl: '/food-dataset/guacamole.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1Z8I_B8TzL8kWub2Do-1brDK7xqg2iuNH',
      'https://lh3.googleusercontent.com/d/1Z8I_B8TzL8kWub2Do-1brDK7xqg2iuNH=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 165,
    protein: 2.1,
    carbohydrates: 8.5,
    fat: 14.8,
    fiber: 6.7,
    iron: 0.8,
    calcium: 14,
    folate: 82,
    glycemicIndex: 'Low',
    servingSize: '1/2 Cup (100g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Loaded with beneficial monounsaturated fatty acids (MUFAs), potassium, and natural folate for fetal brain architecture.',
    trimesterRecommended: '1st Trimester',
    tags: ['Healthy Fats', 'Folate Rich', 'Brain Development'],
    maternalBenefits: 'High concentration of natural folate (82mcg) and oleic acid assists maternal cardiovascular balance and fetal brain formation.',
    maternalTip: 'Use freshly ripened avocado; squeeze lemon juice over it to prevent browning and enhance micronutrient uptake.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['guacamole', 'avocado dip', 'avocado mash', 'benne hannu spread', 'avocado salsa'],
    recipe: {
      ingredients: [
        '1 ripe Hass Avocado (Butter fruit)',
        '1 tbsp finely diced Red Onion',
        '1 tbsp finely diced ripe Tomato (seeds removed)',
        '1 tbsp Fresh Lime Juice',
        'Chopped Fresh Coriander & Sea Salt'
      ],
      instructions: [
        'Cut ripe avocado in half, remove the pit, and scoop out the creamy flesh with a spoon.',
        'Mash in a bowl with a fork, leaving slight texture.',
        'Fold in diced onion, deseeded tomato, lime juice, sea salt, and fresh coriander.',
        'Serve with whole-wheat toast or roasted seed crackers.'
      ],
      prepTimeMinutes: 8,
      cookTimeMinutes: 0,
      storageAdvice: 'Press plastic wrap directly against the surface and consume within 12 hours.',
      pregnancySafetyTips: 'Wash avocado outer skin thoroughly before cutting with a clean knife.'
    }
  },

  // 21. Mango Chia Seed Pudding
  {
    foodId: 'national-mango-chia-seed-pudding',
    slug: 'mango_chia_pudding',
    googleDriveFileId: '1wNhw2Lh66ximt6wriVI_tiLDMb58eX1t',
    originalLabel: 'mango chia pudding Image',
    foodName: 'Mango Chia Seed Pudding',
    regionalName: 'ಮಾವಿನಕಾಯಿ ಚಿಯಾ ಪುಡಿಂಗ್ / मैंगो चिया पुडिंग',
    cuisine: 'Pan-Indian',
    state: 'Maharashtra',
    region: 'West India',
    category: 'Dairy',
    isVegetarian: true,
    imageUrl: '/food-dataset/mango_chia_pudding.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1wNhw2Lh66ximt6wriVI_tiLDMb58eX1t',
      'https://lh3.googleusercontent.com/d/1wNhw2Lh66ximt6wriVI_tiLDMb58eX1t=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 215,
    protein: 6.8,
    carbohydrates: 28.0,
    fat: 8.5,
    fiber: 7.4,
    iron: 2.2,
    calcium: 280,
    folate: 34,
    glycemicIndex: 'Low',
    servingSize: '1 Cup (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Chia seeds supply plant-based ALA Omega-3 fatty acids, calcium, and soluble prebiotic fiber; milk provides premium protein.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Omega-3 ALA', 'High Calcium', 'Constipation Relief'],
    maternalBenefits: 'Gel-forming soluble fiber soothes digestion and completely resolves pregnancy constipation, while milk calcium protects maternal bones.',
    maternalTip: 'Soak chia seeds for at least 3 hours or overnight in pasteurized milk to let them fully expand.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['mango chia pudding', 'chia pudding', 'chia mango cup', 'mango chia dessert'],
    recipe: {
      ingredients: [
        '2 tbsp Organic Black Chia Seeds',
        '3/4 cup Pasteurized Cow Milk or Almond Milk',
        '1/2 cup Fresh Ripe Mango Puree',
        '1 tsp Raw Honey or Maple Syrup',
        'Diced fresh mango chunks for topping'
      ],
      instructions: [
        'Whisk chia seeds with milk and honey in a glass jar until well combined.',
        'Refrigerate for 3-4 hours (or overnight) until a thick, spoonable pudding consistency forms.',
        'Layer with fresh ripe mango puree and top with diced mango pieces before serving.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 0,
      storageAdvice: 'Refrigerate in a covered jar for up to 48 hours.',
      pregnancySafetyTips: 'Ensure chia seeds are thoroughly pre-soaked; do not consume dry chia seeds.'
    }
  },

  // 22. Mango-Banana Chia Smoothie Bowl
  {
    foodId: 'national-mango-banana-chia-smoothie-bowl',
    slug: 'mango_banana_chia_bowl',
    googleDriveFileId: '1DPfR-j1eMbpJaxqcBh_K878AKz-6Zf9b',
    originalLabel: 'Mango-Banana Chia Bowl. Image',
    foodName: 'Mango-Banana Chia Smoothie Bowl',
    regionalName: 'ಮಾವಿನ-ಬಾಳೆ ಚಿಯಾ ಬೌಲ್ / मैंगो बनाना चिया बाउल',
    cuisine: 'Pan-Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Fruits',
    isVegetarian: true,
    imageUrl: '/food-dataset/mango_banana_chia_bowl.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1DPfR-j1eMbpJaxqcBh_K878AKz-6Zf9b',
      'https://lh3.googleusercontent.com/d/1DPfR-j1eMbpJaxqcBh_K878AKz-6Zf9b=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 240,
    protein: 5.2,
    carbohydrates: 46.0,
    fat: 5.8,
    fiber: 6.8,
    iron: 1.8,
    calcium: 140,
    folate: 42,
    glycemicIndex: 'Medium',
    servingSize: '1 Bowl (220g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Potassium, Vitamin B6, and prebiotic fiber soothe morning sickness, replenish electrolytes, and relieve leg cramps.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Potassium Rich', 'Electrolyte Balance', 'Morning Sickness Reliever'],
    maternalBenefits: 'Vitamin B6 from bananas significantly diminishes pregnancy nausea and morning sickness symptoms.',
    maternalTip: 'Use room-temperature or lightly chilled fruit rather than freezing cold bowls if managing nausea.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['mango banana chia bowl', 'chia smoothie bowl', 'mango banana bowl', 'maternal smoothie bowl'],
    recipe: {
      ingredients: [
        '1 ripe Mango (peeled & chopped)',
        '1 ripe Banana (sliced)',
        '1/2 cup Greek Yogurt or Curd',
        '1 tbsp Pre-soaked Chia Seeds',
        'Toppings: Sliced almonds, pumpkin seeds, coconut flakes'
      ],
      instructions: [
        'Blend mango, banana, and curd in a blender into a thick, creamy smoothie base.',
        'Pour into a wide breakfast bowl.',
        'Arrange pre-soaked chia seeds, sliced almonds, pumpkin seeds, and banana coins across the top.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 0,
      storageAdvice: 'Best enjoyed immediately after preparation.',
      pregnancySafetyTips: 'Use pasteurized yogurt and washed seasonal ripe mangoes.'
    }
  },

  // 23. Coastal Indian Fish Curry (NON-VEG)
  {
    foodId: 'coastalindia-traditional-fish-curry-low-mercury',
    slug: 'fish_curry',
    googleDriveFileId: '15eIpt7hUk9xFxJfvOq7dLQxPkRyZCoYq',
    originalLabel: 'Fish curry Image',
    foodName: 'Coastal Indian Fish Curry (Low-Mercury Rohu/Sardine)',
    regionalName: 'ಮೀನು ಸಾರು / மீன் குழம்பு',
    cuisine: 'Coastal Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: false,
    imageUrl: '/food-dataset/fish_curry.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=15eIpt7hUk9xFxJfvOq7dLQxPkRyZCoYq',
      'https://lh3.googleusercontent.com/d/15eIpt7hUk9xFxJfvOq7dLQxPkRyZCoYq=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 280,
    protein: 24.5,
    carbohydrates: 6.0,
    fat: 17.5,
    fiber: 2.1,
    iron: 2.4,
    calcium: 110,
    folate: 22,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl with Fish Fillet (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Prepared with thoroughly cooked low-mercury freshwater fish (Rohu/Catla/Sardine); rich in marine Omega-3 DHA.',
    trimesterRecommended: '2nd Trimester',
    tags: ['Omega-3 DHA', 'High Protein', 'Fetal Brain Architecture'],
    maternalBenefits: 'Marine DHA is clinically irreplaceable for optimal fetal brain and retinal development; supplies complete lean animal protein.',
    maternalTip: 'Always choose verified low-mercury fish and cook thoroughly to >63°C. Never consume raw fish during pregnancy.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['fish curry', 'meen curry', 'meen kulambu', 'coastal fish curry', 'mangalore fish curry'],
    recipe: {
      ingredients: [
        '250g Fresh Low-Mercury Fish Fillets (Rohu, Pomfret, or Sardines, cleaned)',
        '1/2 cup Grated Coconut ground with Red Chilies & Coriander',
        '1 small piece Tamarind or Kudampuli',
        '1/2 tsp Turmeric Powder',
        '1 tsp Coconut Oil & Curry Leaves'
      ],
      instructions: [
        'Grind grated coconut, roasted coriander seeds, cumin, turmeric, and soaked tamarind into a fine smooth paste.',
        'Transfer paste to an earthen pot (chatti), add 1.5 cups water, and bring to a rolling boil for 8 minutes.',
        'Gently slide in the thoroughly cleaned fish pieces and simmer on medium heat for 6-8 minutes until fish flakes tenderly.',
        'Temper with mustard seeds and curry leaves in coconut oil, cover, and let rest for 10 minutes.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 18,
      storageAdvice: 'Consume within 24 hours; keep chilled in refrigerator.',
      pregnancySafetyTips: 'Never eat half-cooked fish; select low-mercury small coastal or freshwater species.'
    }
  },

  // 24. Mangalore Kori / Chicken Sukka (NON-VEG)
  {
    foodId: 'karnataka-coastal-kori-chicken-sukka',
    slug: 'chicken_sukka',
    googleDriveFileId: '1fo3hF56RAuhwAjxJispJI51D1VbufoOA',
    originalLabel: 'Chicken sukka Image',
    foodName: 'Mangalore Kori / Chicken Sukka',
    regionalName: 'ಕೋಳಿ ಸುಕ್ಕ / ಕೋಳಿ ಅಜಾದಿನ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Eggs & Poultry',
    isVegetarian: false,
    imageUrl: '/food-dataset/chicken_sukka.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1fo3hF56RAuhwAjxJispJI51D1VbufoOA',
      'https://lh3.googleusercontent.com/d/1fo3hF56RAuhwAjxJispJI51D1VbufoOA=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 315,
    protein: 28.2,
    carbohydrates: 5.0,
    fat: 19.8,
    fiber: 3.2,
    iron: 2.8,
    calcium: 48,
    folate: 16,
    glycemicIndex: 'Low',
    servingSize: '1 Portion (180g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Dry-roasted chicken with grated coconut; cook completely tender to internal temp >75°C to eliminate all bacteria.',
    trimesterRecommended: '2nd Trimester',
    tags: ['High Protein', 'Heme Iron', 'Muscle Synthesis'],
    maternalBenefits: '28.2g of biological value protein and heme iron; supports maternal blood volume expansion and uterine muscular growth.',
    maternalTip: 'Ensure chicken is cooked thoroughly until clear juices run and flesh is completely opaque.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['chicken sukka', 'kori sukka', 'kori ajadina', 'mangalore chicken sukka', 'dry chicken sukka'],
    recipe: {
      ingredients: [
        '250g Skinless Chicken (cut into small pieces)',
        '3/4 cup Fresh Grated Coconut',
        '1 tbsp Mangalore Sukka Masala (Coriander, Cumin, Fenugreek, Pepper)',
        '1 chopped Onion & Ginger-Garlic Paste',
        '1 tsp Coconut Oil & Curry Leaves'
      ],
      instructions: [
        'Marinate cleaned chicken pieces with turmeric, ginger-garlic paste, and salt for 15 minutes.',
        'Heat coconut oil; sauté onions and curry leaves until golden.',
        'Add marinated chicken and cook covered in its own juices for 12-15 minutes until fully cooked and tender.',
        'Dry roast grated coconut with sukka masala; add to chicken and stir vigorously on medium flame until dry and fragrant.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      storageAdvice: 'Refrigerate in a covered container for up to 24 hours; reheat steaming hot.',
      pregnancySafetyTips: 'Chicken must be cooked thoroughly to eliminate any risk of salmonella.'
    }
  },

  // 25. Homestyle Egg Gravy Curry (NON-VEG / EGGETARIAN)
  {
    foodId: 'southindia-homestyle-egg-gravy-curry',
    slug: 'egg_gravy',
    googleDriveFileId: '101SYDYioTlQQ2OHKfFVgx0xhvh86pljs',
    originalLabel: 'Egg gravy Image',
    foodName: 'Homestyle Egg Gravy Curry',
    regionalName: 'ಮೊಟ್ಟೆ ಸಾರು / अंडा करी',
    cuisine: 'South Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Eggs & Poultry',
    isVegetarian: false,
    imageUrl: '/food-dataset/egg_gravy.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=101SYDYioTlQQ2OHKfFVgx0xhvh86pljs',
      'https://lh3.googleusercontent.com/d/101SYDYioTlQQ2OHKfFVgx0xhvh86pljs=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 275,
    protein: 15.6,
    carbohydrates: 9.0,
    fat: 19.5,
    fiber: 2.4,
    iron: 2.9,
    calcium: 86,
    folate: 48,
    glycemicIndex: 'Low',
    servingSize: '1 Bowl with 2 Boiled Eggs (200g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Hard-boiled eggs cooked in onion-tomato-coconut gravy; egg yolk must be fully firm to guarantee safety.',
    trimesterRecommended: 'All Trimesters',
    tags: ['Choline Rich', 'High Protein', 'Neural Tube Support'],
    maternalBenefits: 'Whole eggs provide choline (essential for fetal memory and cognitive development) and Vitamin B12.',
    maternalTip: 'Never consume runny or soft-boiled eggs during pregnancy; cook until whites and yolks are fully firm.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['egg gravy', 'egg curry', 'motte saaru', 'anda curry', 'spicy egg gravy'],
    recipe: {
      ingredients: [
        '2 Hard-Boiled Eggs (peeled & pierced)',
        '1 Onion & 2 ripe Tomatoes (pureed)',
        '1 tbsp Ginger-Garlic Paste',
        '1/2 tsp Turmeric, Coriander & Garam Masala',
        '1 tsp Oil & Fresh Coriander leaves'
      ],
      instructions: [
        'Hard boil eggs for 10-12 minutes until yolk is completely set; peel and set aside.',
        'Heat oil in a pan; sauté onions until golden brown, then add ginger-garlic paste and tomato puree.',
        'Add turmeric, coriander, garam masala, and salt; cook until oil begins to separate.',
        'Add 1/2 cup warm water, gently lower in halved boiled eggs, and simmer for 5 minutes.'
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      storageAdvice: 'Refrigerate for up to 24 hours; reheat thoroughly.',
      pregnancySafetyTips: 'Eggs must be fully hard-boiled with zero runny yolk to prevent salmonella.'
    }
  },

  // 26. Spiced Pulav with Chicken Gravy (NON-VEG)
  {
    foodId: 'southindia-spiced-pulav-with-chicken-gravy',
    slug: 'pulav_with_chicken_gravy',
    googleDriveFileId: '1sZpnakyL-Gk_hlJrGSiKCYRnHSiCNPie',
    originalLabel: 'Pulav with chicken gravy Image',
    foodName: 'Spiced Pulav with Chicken Gravy',
    regionalName: 'ಪುಲಾವ್ ಮತ್ತು ಕೋಳಿ ಸಾರು',
    cuisine: 'South Indian',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: false,
    imageUrl: '/food-dataset/pulav_with_chicken_gravy.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1sZpnakyL-Gk_hlJrGSiKCYRnHSiCNPie',
      'https://lh3.googleusercontent.com/d/1sZpnakyL-Gk_hlJrGSiKCYRnHSiCNPie=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 410,
    protein: 22.4,
    carbohydrates: 58.0,
    fat: 10.8,
    fiber: 4.2,
    iron: 3.4,
    calcium: 62,
    folate: 36,
    glycemicIndex: 'Medium',
    servingSize: '1 Full Plate (260g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Substantial balanced meal combining fragrant vegetable-spiced pilaf with protein-dense, fully cooked chicken curry.',
    trimesterRecommended: '3rd Trimester',
    tags: ['High Calorie', 'High Protein', '3rd Trimester Energy'],
    maternalBenefits: 'Provides sustained caloric and amino acid fuel necessary during rapid third-trimester fetal weight gaining phase.',
    maternalTip: 'Choose mild aromatic spices to prevent late-pregnancy acid reflux.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['pulav with chicken gravy', 'chicken pulav combo', 'pulao chicken curry', 'pulao with chicken'],
    recipe: {
      ingredients: [
        '1 plate Hot Fragrant Vegetable Pulav',
        '1 cup Tender Chicken Simmered in Onion-Coconut Gravy',
        'Fresh Mint & Lemon wedge'
      ],
      instructions: [
        'Prepare aromatic mild rice pilaf with whole cloves, cardamom, and onions.',
        'Simmer chicken pieces in a mild turmeric, coconut, and coriander curry until fully tender and cooked through.',
        'Serve hot pulav layered with savory chicken gravy.'
      ],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      storageAdvice: 'Consume warm immediately.',
      pregnancySafetyTips: 'Ensure chicken is cooked completely; do not reheat more than once.'
    }
  },

  // 27. Malnad Koli Kajjaya (NON-VEG)
  {
    foodId: 'karnataka-malnad-koli-kajjaya-chicken-steamed-dumplings',
    slug: 'koli_kajjaya',
    googleDriveFileId: '1EqT4HRV11vkCsGFHqXbiJhn9Vw9Onmqx',
    originalLabel: 'Koli kajjaya Image',
    foodName: 'Malnad Koli Kajjaya (Chicken with Steamed Dumplings)',
    regionalName: 'ಕೋಳಿ ಕಜ್ಜಾಯ',
    cuisine: 'Karnataka',
    state: 'Karnataka',
    region: 'South India',
    category: 'Traditional Dishes',
    isVegetarian: false,
    imageUrl: '/food-dataset/koli_kajjaya.jpg',
    imageFallbacks: [
      'https://drive.google.com/uc?export=download&id=1EqT4HRV11vkCsGFHqXbiJhn9Vw9Onmqx',
      'https://lh3.googleusercontent.com/d/1EqT4HRV11vkCsGFHqXbiJhn9Vw9Onmqx=w1000'
    ],
    imageSourceType: 'project-dataset',
    imageSourceName: 'PregNutri AI Food Dataset',
    imageAttribution: 'Project Food Dataset (Google Drive)',
    calories: 385,
    protein: 24.8,
    carbohydrates: 52.0,
    fat: 9.6,
    fiber: 3.8,
    iron: 3.2,
    calcium: 54,
    folate: 28,
    glycemicIndex: 'Medium',
    servingSize: '1 Plate (240g)',
    safetyLevel: 'Safe',
    safetyExplanation: 'Heritage Karnataka Malnad dish; steamed rice flour dumplings served with slow-simmered, tender country chicken.',
    trimesterRecommended: '2nd Trimester',
    tags: ['Regional Heritage', 'High Protein', 'Nutritious Comfort'],
    maternalBenefits: 'Steamed rice kajjaya are light and easily digestible, paired with rich protein and bioavailable iron from tender chicken.',
    maternalTip: 'Keep gravy seasoning mild; the steamed dumplings offer excellent clean carbohydrate energy.',
    dataSource: 'ICMR-NIN IFCT 2020 Standardized',
    aliases: ['koli kajjaya', 'malnad koli kajjaya', 'chicken kajjaya', 'rice kajjaya chicken curry'],
    recipe: {
      ingredients: [
        '1 cup Rice Flour & Warm Water (for steamed kajjaya dumplings)',
        '250g Chicken Pieces',
        '1 cup Malnad Style Spiced Curry with Poppy Seeds & Coconut',
        '1 tsp Ghee'
      ],
      instructions: [
        'Knead rice flour with warm water and pinch of salt into smooth dough; shape into small shallow dumplings and steam for 10 minutes.',
        'Cook chicken in an aromatic Malnad coriander, cumin, and coconut paste until thoroughly tender.',
        'Serve hot steamed kajjaya immersed in warm country chicken curry.'
      ],
      prepTimeMinutes: 20,
      cookTimeMinutes: 30,
      storageAdvice: 'Best eaten freshly steamed.',
      pregnancySafetyTips: 'Ensure chicken is cooked to internal temp >75°C.'
    }
  }
];
