import React, { useState } from 'react';
import { PROJECT_FOOD_DATASET, ProjectFoodDatasetItem } from '../data/project_food_dataset';
import { DualFoodName, FoodSubtitle } from '../services/language_service';
import {
  Database,
  CheckCircle2,
  Search,
  ExternalLink,
  ChefHat,
  Filter,
  Eye,
  ShieldCheck,
  Flame,
  Dna,
  X,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { KaggleFoodItem } from '../types';

interface ProjectFoodDatasetExplorerProps {
  onSelectFood?: (foodItem: KaggleFoodItem) => void;
  onViewRecipe?: (foodItem: KaggleFoodItem) => void;
  onClose?: () => void;
}

export const ProjectFoodDatasetExplorer: React.FC<ProjectFoodDatasetExplorerProps> = ({
  onSelectFood,
  onViewRecipe,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dietFilter, setDietFilter] = useState<'All' | 'Veg' | 'NonVeg'>('All');
  const [selectedItem, setSelectedItem] = useState<ProjectFoodDatasetItem | null>(null);

  const filteredItems = PROJECT_FOOD_DATASET.filter(item => {
    const matchesSearch =
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDiet =
      dietFilter === 'All'
        ? true
        : dietFilter === 'Veg'
        ? item.isVegetarian
        : !item.isVegetarian;

    return matchesSearch && matchesDiet;
  });

  const handlePreview = (item: ProjectFoodDatasetItem) => {
    const kaggleItem: KaggleFoodItem = {
      id: item.foodId,
      name: item.foodName,
      regionalName: item.regionalName,
      category: item.category,
      cuisine: item.cuisine,
      country: 'India',
      state: item.state,
      region: item.region,
      ingredients: item.recipe.ingredients,
      calories: item.calories,
      protein: item.protein,
      carbohydrates: item.carbohydrates,
      fat: item.fat,
      fiber: item.fiber,
      iron: item.iron,
      calcium: item.calcium,
      folate: item.folate,
      glycemicIndex: item.glycemicIndex,
      servingSize: item.servingSize,
      safetyLevel: item.safetyLevel,
      safetyExplanation: item.safetyExplanation,
      isVegetarian: item.isVegetarian,
      trimesterRecommended: item.trimesterRecommended,
      tags: item.tags,
      maternalBenefits: item.maternalBenefits,
      maternalTip: item.maternalTip,
      dataSource: 'ICMR-NIN IFCT Standardized (PregNutri AI Project Dataset)',
      image: item.imageUrl,
      imageSource: 'Project Food Dataset',
      imageSourceType: 'project-dataset',
      recipe: {
        ingredients: item.recipe.ingredients,
        instructions: item.recipe.instructions,
        prepTimeMinutes: item.recipe.prepTimeMinutes,
        cookTimeMinutes: item.recipe.cookTimeMinutes,
        storageAdvice: item.recipe.storageAdvice,
        pregnancySafetyTips: item.recipe.pregnancySafetyTips
      }
    };

    if (onSelectFood) {
      onSelectFood(kaggleItem);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="bg-[#E8D9CD] rounded-3xl border border-[#959D90]/50 p-5 sm:p-7 shadow-lg space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#523D35]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#523D35] text-white rounded-xl">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-[#223030]">
              PregNutri AI Food Dataset Explorer
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-xs font-black">
              27/27 Mapped
            </span>
          </div>
          <p className="text-xs text-[#523D35] mt-1">
            Verified primary dishes loaded directly from your Google Drive food images folder. All images mapped locally without external stock photos.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-center p-2 rounded-xl bg-[#523D35]/10 hover:bg-[#523D35]/20 text-[#523D35] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Control Bar: Search & Diet Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#523D35]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search among 27 verified dataset foods..."
            className="w-full pl-10 pr-4 py-2 bg-[#EFEFE9] rounded-xl border border-[#959D90]/60 text-xs text-[#223030] placeholder-[#523D35]/60 focus:outline-hidden focus:ring-2 focus:ring-[#523D35]"
          />
        </div>

        {/* Diet Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#EFEFE9] p-1 rounded-xl border border-[#959D90]/50 text-xs">
          <button
            onClick={() => setDietFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              dietFilter === 'All'
                ? 'bg-[#523D35] text-white'
                : 'text-[#523D35] hover:bg-[#E8D9CD]'
            }`}
          >
            All ({PROJECT_FOOD_DATASET.length})
          </button>
          <button
            onClick={() => setDietFilter('Veg')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              dietFilter === 'Veg'
                ? 'bg-emerald-700 text-white'
                : 'text-[#523D35] hover:bg-[#E8D9CD]'
            }`}
          >
            Veg (22)
          </button>
          <button
            onClick={() => setDietFilter('NonVeg')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              dietFilter === 'NonVeg'
                ? 'bg-rose-700 text-white'
                : 'text-[#523D35] hover:bg-[#E8D9CD]'
            }`}
          >
            Non-Veg (5)
          </button>
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.foodId}
            className="bg-[#EFEFE9] rounded-2xl border border-[#959D90]/50 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            {/* Image Thumbnail with Overlay */}
            <div
              className="relative h-40 bg-black cursor-pointer overflow-hidden"
              onClick={() => handlePreview(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.foodName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Status Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs">
                <CheckCircle2 className="w-3 h-3" />
                Mapped & Active
              </div>

              {/* Diet Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    item.isVegetarian
                      ? 'bg-emerald-800 text-white'
                      : 'bg-rose-800 text-white'
                  }`}
                >
                  {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                </span>
              </div>

              {/* Bottom Labels */}
              <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold truncate">
                {item.state} • {item.cuisine}
              </div>
            </div>

            {/* Info Body */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#223030] leading-snug">
                  {item.foodName}
                </h3>
                <FoodSubtitle
                  foodName={item.foodName}
                  regionalName={item.regionalName}
                  className="text-[11px] font-medium text-emerald-800 truncate"
                />
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#523D35] bg-[#E8D9CD] px-2 py-1 rounded-md overflow-hidden text-ellipsis">
                  <FileCode className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.imageUrl}</span>
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="grid grid-cols-3 gap-1 text-center bg-[#E8D9CD]/50 p-1.5 rounded-xl text-[10px] font-bold text-[#523D35]">
                <div>
                  <span className="block text-[#223030] font-black">{item.calories}</span>
                  <span>kcal</span>
                </div>
                <div>
                  <span className="block text-[#223030] font-black">{item.protein}g</span>
                  <span>protein</span>
                </div>
                <div>
                  <span className="block text-[#223030] font-black">{item.iron}mg</span>
                  <span>iron</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handlePreview(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-[#523D35] hover:bg-[#3D2D27] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
                {onViewRecipe && (
                  <button
                    onClick={() => {
                      handlePreview(item);
                    }}
                    className="flex items-center justify-center p-1.5 bg-[#223030] hover:bg-[#152020] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="View Recipe"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
