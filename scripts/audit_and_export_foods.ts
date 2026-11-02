import fs from 'fs';
import path from 'path';
import { KAGGLE_PROCESSED_FOOD_DATABASE } from '../src/services/kaggle_food_pipeline';
import { CURATED_REGIONAL_RECIPES } from '../src/data/regional_recipes_db';
import { FOOD_DATABASE_ITEMS } from '../src/foods_db';
import { regionalFoodDatabase } from '../src/data/foodDatabase';

export interface ExportFoodItem {
  serialNumber: number;
  foodId: string;
  exactFoodName: string;
  regionalName: string;
  stateOrRegion: string;
  cuisine: string;
  mealCategory: string;
  vegetarianOrNonVegetarian: string;
  servingSize: string;
  calories: string | number;
  protein: string;
  carbohydrates: string;
  fat: string;
  fibre: string;
  vitaminsAndMinerals: string;
  pregnancyAndTrimesterSuitability: string;
  recipeDetails: string;
  imageFilenameOrUrl: string;
  dataSource: string;
  recordType: 'Actual Processed Database Record' | 'Hardcoded App Record' | 'Reference Catalog Record';
  sourceFile: string;
  usedInRunningApp: string;
}

const exportItems: ExportFoodItem[] = [];
const nameMap = new Map<string, { id: string; name: string; dataset: string; file: string }[]>();

function recordName(name: string, id: string, dataset: string, file: string) {
  const key = String(name || '').toLowerCase().trim();
  if (!nameMap.has(key)) {
    nameMap.set(key, []);
  }
  nameMap.get(key)!.push({ id, name, dataset, file });
}

let serial = 1;

// ---------------------------------------------------------------------------
// 1. PRIMARY APP DATASET: KAGGLE_PROCESSED_FOOD_DATABASE (623 items)
// Active in Food Database view, Maternal Meal Planner, Clinical Dashboard, Order Delivery
// ---------------------------------------------------------------------------
for (const item of KAGGLE_PROCESSED_FOOD_DATABASE) {
  const micronutrients: string[] = [];
  if (item.iron != null && item.iron !== 0) micronutrients.push(`Iron: ${item.iron} mg`);
  if (item.calcium != null && item.calcium !== 0) micronutrients.push(`Calcium: ${item.calcium} mg`);
  if (item.folate != null && item.folate !== 0) micronutrients.push(`Folate: ${item.folate} mcg`);
  if ((item as any).vitaminC != null && (item as any).vitaminC !== 0) micronutrients.push(`Vit C: ${(item as any).vitaminC} mg`);
  if ((item as any).vitaminA != null && (item as any).vitaminA !== 0) micronutrients.push(`Vit A: ${(item as any).vitaminA} mcg`);

  const trimesterStr = Array.isArray(item.trimesterRecommended)
    ? item.trimesterRecommended.join(', ')
    : (item.trimesterRecommended ? String(item.trimesterRecommended) : 'All Trimesters (T1, T2, T3)');

  let recipeInfo = 'Not available';
  if (item.recipe) {
    const parts: string[] = [];
    if (item.recipe.prepTimeMinutes) parts.push(`Prep: ${item.recipe.prepTimeMinutes}m`);
    if (item.recipe.cookTimeMinutes) parts.push(`Cook: ${item.recipe.cookTimeMinutes}m`);
    if (item.recipe.ingredients && item.recipe.ingredients.length > 0) {
      parts.push(`Ingredients: ${item.recipe.ingredients.slice(0, 5).join(', ')}${item.recipe.ingredients.length > 5 ? '...' : ''}`);
    }
    if (parts.length > 0) recipeInfo = parts.join(' | ');
  }

  recordName(item.name, item.id, 'KAGGLE_PROCESSED_FOOD_DATABASE', 'src/services/kaggle_food_pipeline.ts');

  exportItems.push({
    serialNumber: serial++,
    foodId: item.id || `food_${serial}`,
    exactFoodName: item.name || 'Not available',
    regionalName: item.regionalName || 'Not available',
    stateOrRegion: item.state || item.region || 'Pan-India',
    cuisine: item.cuisine || 'Indian',
    mealCategory: item.category || 'General',
    vegetarianOrNonVegetarian: item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian',
    servingSize: item.servingSize || '1 serving (100g)',
    calories: item.calories != null ? item.calories : 'Not available',
    protein: item.protein != null ? `${item.protein} g` : 'Not available',
    carbohydrates: item.carbohydrates != null ? `${item.carbohydrates} g` : 'Not available',
    fat: item.fat != null ? `${item.fat} g` : 'Not available',
    fibre: item.fiber != null ? `${item.fiber} g` : 'Not available',
    vitaminsAndMinerals: micronutrients.length > 0 ? micronutrients.join('; ') : 'Not available',
    pregnancyAndTrimesterSuitability: `${item.safetyLevel || 'Safe'} (Recommended: ${trimesterStr})`,
    recipeDetails: recipeInfo,
    imageFilenameOrUrl: item.imageUrl || item.image || 'Not available',
    dataSource: item.dataSource || 'ICMR-NIN IFCT 2020 Standardized / Kaggle Dataset',
    recordType: 'Actual Processed Database Record',
    sourceFile: 'src/services/kaggle_food_pipeline.ts (sourced from src/data/kaggle_food_database.ts & src/data/project_food_dataset.ts)',
    usedInRunningApp: 'Yes (Food Database Tab, Maternal Meal Planner, Clinical Dashboard, Order Delivery)'
  });
}

// ---------------------------------------------------------------------------
// 2. HARDCODED CLINICAL SAFETY & SCANNER DATABASE: FOOD_DATABASE_ITEMS (src/foods_db.ts) (28 items)
// Active in Food Scanner AI, Maternal Safety Check View, Meal Tracker, Nutrition Engine
// ---------------------------------------------------------------------------
for (const item of FOOD_DATABASE_ITEMS) {
  const englishName = (item.name && typeof item.name === 'object' && item.name.en) ? item.name.en : String(item.name || item.id);
  const regionalName = (item.name && typeof item.name === 'object' && item.name.kn) ? item.name.kn : 'Not available';

  recordName(englishName, item.id, 'FOOD_DATABASE_ITEMS', 'src/foods_db.ts');

  const micronutrients: string[] = [];
  if (item.iron != null) micronutrients.push(`Iron: ${item.iron} mg`);
  if (item.calcium != null) micronutrients.push(`Calcium: ${item.calcium} mg`);
  if (item.folate != null) micronutrients.push(`Folate: ${item.folate} mcg`);
  if (item.vitaminA != null) micronutrients.push(`Vit A: ${item.vitaminA} mcg`);
  if (item.vitaminC != null) micronutrients.push(`Vit C: ${item.vitaminC} mg`);
  if (item.zinc != null) micronutrients.push(`Zinc: ${item.zinc} mg`);
  if (item.magnesium != null) micronutrients.push(`Magnesium: ${item.magnesium} mg`);

  const primaryState = (item.states && item.states.length > 0) ? item.states.join(', ') : 'Pan-India';
  const explanation = (item.explanation && typeof item.explanation === 'object' && 'en' in (item.explanation as any))
    ? String((item.explanation as any).en)
    : (typeof item.explanation === 'string' ? item.explanation : 'Not available');

  exportItems.push({
    serialNumber: serial++,
    foodId: item.id,
    exactFoodName: englishName,
    regionalName: regionalName,
    stateOrRegion: primaryState,
    cuisine: 'Indian',
    mealCategory: item.category || 'General',
    vegetarianOrNonVegetarian: item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian',
    servingSize: item.servingSize || '100g',
    calories: item.calories != null ? item.calories : 'Not available',
    protein: item.protein != null ? `${item.protein} g` : 'Not available',
    carbohydrates: item.carbohydrates != null ? `${item.carbohydrates} g` : 'Not available',
    fat: item.fat != null ? `${item.fat} g` : 'Not available',
    fibre: item.fiber != null ? `${item.fiber} g` : 'Not available',
    vitaminsAndMinerals: micronutrients.length > 0 ? micronutrients.join('; ') : 'Not available',
    pregnancyAndTrimesterSuitability: `${item.safetyLevel || 'Safe'} (Trimester: ${item.trimester || 'All'}, Best time: ${item.bestTime || 'Any'})`,
    recipeDetails: explanation,
    imageFilenameOrUrl: item.imageUrl || 'Not available',
    dataSource: 'ICMR-NIN Maternal Safety Standard Reference (src/foods_db.ts)',
    recordType: 'Hardcoded App Record',
    sourceFile: 'src/foods_db.ts',
    usedInRunningApp: 'Yes (Food Scanner AI, Maternal Safety Check View, Meal Tracker, Nutrition Engine)'
  });
}

// ---------------------------------------------------------------------------
// 3. CURATED REGIONAL RECIPES DATABASE: CURATED_REGIONAL_RECIPES (src/data/regional_recipes_db.ts) (13 items)
// Active in Regional Recipe Modal in Food Database, Recipe Service, Order Delivery
// ---------------------------------------------------------------------------
for (const item of CURATED_REGIONAL_RECIPES) {
  const englishName = item.traditionalName || item.recipeId;
  const regionalName = (item as any).nameKn || (item as any).nameTa || 'Not available';

  recordName(englishName, item.recipeId, 'CURATED_REGIONAL_RECIPES', 'src/data/regional_recipes_db.ts');

  const micronutrients: string[] = [];
  if (item.nutrition?.iron != null) micronutrients.push(`Iron: ${item.nutrition.iron} mg`);
  if (item.nutrition?.calcium != null) micronutrients.push(`Calcium: ${item.nutrition.calcium} mg`);
  if (item.nutrition?.vitaminB9 != null) micronutrients.push(`Folate (B9): ${item.nutrition.vitaminB9} mcg`);
  if (item.nutrition?.vitaminC != null) micronutrients.push(`Vit C: ${item.nutrition.vitaminC} mg`);
  if (item.nutrition?.vitaminA != null) micronutrients.push(`Vit A: ${item.nutrition.vitaminA} mcg`);

  const servingDesc = item.servingSize?.servingUnit || '1 portion (220g)';
  const ingredientsStr = item.ingredients?.map(i => `${i.name} (${i.quantity}${i.unit})`).slice(0, 5).join(', ') || 'Not available';

  exportItems.push({
    serialNumber: serial++,
    foodId: item.recipeId,
    exactFoodName: englishName,
    regionalName: regionalName,
    stateOrRegion: item.state || 'South India',
    cuisine: item.region ? `${item.region} Indian` : 'South Indian',
    mealCategory: item.category || 'Lunch / Dinner',
    vegetarianOrNonVegetarian: item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian',
    servingSize: servingDesc,
    calories: item.nutrition?.calories != null ? item.nutrition.calories : 'Not available',
    protein: item.nutrition?.protein != null ? `${item.nutrition.protein} g` : 'Not available',
    carbohydrates: item.nutrition?.carbohydrates != null ? `${item.nutrition.carbohydrates} g` : 'Not available',
    fat: item.nutrition?.fat != null ? `${item.nutrition.fat} g` : 'Not available',
    fibre: item.nutrition?.fiber != null ? `${item.nutrition.fiber} g` : 'Not available',
    vitaminsAndMinerals: micronutrients.length > 0 ? micronutrients.join('; ') : 'Not available',
    pregnancyAndTrimesterSuitability: `Safe for pregnancy | ${item.cookingMethod || 'Authentic cooking method'}`,
    recipeDetails: `Prep: ${item.preparationTimeMinutes || 20}m | Key ingredients: ${ingredientsStr}`,
    imageFilenameOrUrl: item.photoUrl || item.referenceImageUrl || 'Not available',
    dataSource: `${item.referenceImageSource || 'PregNutri AI Curated Regional Recipes DB'} (${item.referenceImageLicense || 'CC BY-SA'})`,
    recordType: 'Hardcoded App Record',
    sourceFile: 'src/data/regional_recipes_db.ts',
    usedInRunningApp: 'Yes (Regional Recipe Modal in Food Database, Recipe Service, Order Delivery)'
  });
}

// ---------------------------------------------------------------------------
// 4. REGIONAL FOOD DATABASE: regionalFoodDatabase (src/data/foodDatabase.ts) (13 items)
// Used in Food Image Registry and legacy RegionalFoodDatabaseView
// ---------------------------------------------------------------------------
for (const item of regionalFoodDatabase) {
  const englishName = item.name?.en || item.id;
  const regionalName = item.name?.kn || item.name?.hi || 'Not available';

  recordName(englishName, item.id, 'regionalFoodDatabase', 'src/data/foodDatabase.ts');

  const micronutrients: string[] = [];
  if (item.iron != null) micronutrients.push(`Iron: ${item.iron} mg`);
  if (item.calcium != null) micronutrients.push(`Calcium: ${item.calcium} mg`);

  exportItems.push({
    serialNumber: serial++,
    foodId: item.id,
    exactFoodName: englishName,
    regionalName: regionalName,
    stateOrRegion: item.state || 'Karnataka',
    cuisine: 'South Indian',
    mealCategory: 'Regional Dish',
    vegetarianOrNonVegetarian: item.diet || 'Vegetarian',
    servingSize: '1 serving (150-200g)',
    calories: item.calories != null ? item.calories : 'Not available',
    protein: item.protein != null ? `${item.protein} g` : 'Not available',
    carbohydrates: item.carbs != null ? `${item.carbs} g` : 'Not available',
    fat: 'Not available',
    fibre: item.fibre != null ? `${item.fibre} g` : 'Not available',
    vitaminsAndMinerals: micronutrients.length > 0 ? micronutrients.join('; ') : 'Not available',
    pregnancyAndTrimesterSuitability: 'Safe for pregnancy (ICMR Standard)',
    recipeDetails: item.recipe?.en || 'Not available',
    imageFilenameOrUrl: item.imageUrl || 'Not available',
    dataSource: 'Regional Food Database Reference',
    recordType: 'Hardcoded App Record',
    sourceFile: 'src/data/foodDatabase.ts',
    usedInRunningApp: 'Yes (Food Image Registry fallback, RegionalFoodDatabaseView)'
  });
}

// Duplicates Analysis
const duplicateItems: { name: string; entries: { id: string; dataset: string; file: string }[] }[] = [];
for (const [key, entries] of nameMap.entries()) {
  if (entries.length > 1) {
    duplicateItems.push({ name: entries[0].name, entries });
  }
}

// Region breakdown
const regionBreakdown: Record<string, number> = {};
for (const item of exportItems) {
  const reg = item.stateOrRegion;
  regionBreakdown[reg] = (regionBreakdown[reg] || 0) + 1;
}

// Generate JSON export
const jsonPath = path.join(process.cwd(), 'public', 'exports', 'pregnutri_complete_food_database.json');
fs.writeFileSync(jsonPath, JSON.stringify({
  metadata: {
    title: 'PregNutri AI Complete Food Database Export',
    generatedAt: new Date().toISOString(),
    totalCatalogedRecords: exportItems.length,
    uniqueFoodNamesCount: nameMap.size,
    duplicateEntriesCount: duplicateItems.length,
    sourceFiles: [
      'src/services/kaggle_food_pipeline.ts',
      'src/data/kaggle_food_database.ts',
      'src/data/project_food_dataset.ts',
      'src/foods_db.ts',
      'src/data/regional_recipes_db.ts',
      'src/data/foodDatabase.ts'
    ]
  },
  foods: exportItems
}, null, 2), 'utf-8');

// Generate CSV export
const csvHeaders = [
  'Serial Number',
  'Food ID',
  'Exact Food Name',
  'Regional Name',
  'State or Region',
  'Cuisine',
  'Meal Category',
  'Vegetarian or Non-Vegetarian',
  'Serving Size',
  'Calories',
  'Protein',
  'Carbohydrates',
  'Fat',
  'Fibre',
  'Vitamins and Minerals',
  'Pregnancy and Trimester Suitability',
  'Recipe Details',
  'Image Filename or URL',
  'Data Source',
  'Record Type',
  'Source File',
  'Used in Running App'
];

function sanitizeCsv(val: any): string {
  if (val == null) return '\"Not available\"';
  const str = String(val).replace(/\"/g, '\"\"');
  return `\"${str}\"`;
}

const csvRows = exportItems.map(item => [
  item.serialNumber,
  sanitizeCsv(item.foodId),
  sanitizeCsv(item.exactFoodName),
  sanitizeCsv(item.regionalName),
  sanitizeCsv(item.stateOrRegion),
  sanitizeCsv(item.cuisine),
  sanitizeCsv(item.mealCategory),
  sanitizeCsv(item.vegetarianOrNonVegetarian),
  sanitizeCsv(item.servingSize),
  sanitizeCsv(item.calories),
  sanitizeCsv(item.protein),
  sanitizeCsv(item.carbohydrates),
  sanitizeCsv(item.fat),
  sanitizeCsv(item.fibre),
  sanitizeCsv(item.vitaminsAndMinerals),
  sanitizeCsv(item.pregnancyAndTrimesterSuitability),
  sanitizeCsv(item.recipeDetails),
  sanitizeCsv(item.imageFilenameOrUrl),
  sanitizeCsv(item.dataSource),
  sanitizeCsv(item.recordType),
  sanitizeCsv(item.sourceFile),
  sanitizeCsv(item.usedInRunningApp)
].join(','));

const csvPath = path.join(process.cwd(), 'public', 'exports', 'pregnutri_complete_food_database.csv');
fs.writeFileSync(csvPath, [csvHeaders.join(','), ...csvRows].join('\n'), 'utf-8');

console.log('AUDIT COMPLETED SUCCESSFULLY:');
console.log(`1. Total Cataloged Food Records: ${exportItems.length}`);
console.log(`2. Total Unique Food Items (by normalized name): ${nameMap.size}`);
console.log(`3. Cross-file duplicate pairs/groups: ${duplicateItems.length}`);
console.log(`4. Saved JSON export: ${jsonPath}`);
console.log(`5. Saved CSV export: ${csvPath}`);
console.log('Region Breakdown:', JSON.stringify(regionBreakdown, null, 2));
console.log('Duplicate items summary:');
for (const dup of duplicateItems.slice(0, 10)) {
  console.log(` - \"${dup.name}\": found in ${dup.entries.map(e => e.dataset).join(' & ')}`);
}
