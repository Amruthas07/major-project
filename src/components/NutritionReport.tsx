import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '../services/language_service';
import { AverageNutrientCard } from './AverageNutrientCard';

export interface NutritionReportProps {
  stats?: {
    avgCalories?: number;
    avgProtein?: number;
    avgCarbs?: number;
    avgFat?: number;
    avgFiber?: number;
    avgIron?: number;
    avgCalcium?: number;
    avgFolate?: number;
  };
  mealTypeCounts?: {
    Breakfast: number;
    Lunch: number;
    Dinner: number;
    Snack: number;
  };
  topFoods?: Array<[string, number]>;
  recordedDaysCount?: number;
  totalMealsCount?: number;
}

export const NutritionReport: React.FC<NutritionReportProps> = ({
  stats,
  mealTypeCounts = { Breakfast: 0, Lunch: 0, Dinner: 0, Snack: 0 },
  topFoods = [],
  recordedDaysCount = 7,
  totalMealsCount = 0
}) => {
  const { t } = useLanguage();
  const totalMeals = totalMealsCount || (mealTypeCounts.Breakfast + mealTypeCounts.Lunch + mealTypeCounts.Dinner + mealTypeCounts.Snack);

  return (
    <div className="space-y-6">
      {/* 1. Average Daily Nutrient Intake */}
      <AverageNutrientCard stats={stats} recordedDaysCount={recordedDaysCount} />

      {/* 2. Meal Distribution & Most Frequently Consumed Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meal Type Breakdown */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#523D35]" />
            <span>{t('mealDistribution', 'Meal Distribution')}</span>
            <span className="text-[#959D90] font-normal">({t('total', 'Total')}: {totalMeals})</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
              <span className="text-[#959D90] font-medium block">{t('meal.breakfast', 'Breakfast')}</span>
              <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Breakfast}</span>
            </div>
            <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
              <span className="text-[#959D90] font-medium block">{t('meal.lunch', 'Lunch')}</span>
              <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Lunch}</span>
            </div>
            <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
              <span className="text-[#959D90] font-medium block">{t('meal.dinner', 'Dinner')}</span>
              <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Dinner}</span>
            </div>
            <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
              <span className="text-[#959D90] font-medium block">{t('meal.snack', 'Snacks')}</span>
              <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Snack}</span>
            </div>
          </div>
        </div>

        {/* Most Frequently Consumed Foods */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#523D35]" />
            <span>{t('mostFrequentlyConsumedFoods', 'Most Frequently Consumed Foods')}</span>
          </h3>

          {topFoods.length === 0 ? (
            <div className="text-xs text-[#959D90] italic py-6 text-center">
              {t('noFoodRecordsFound', 'No individual food records found in logged meals.')}
            </div>
          ) : (
            <div className="space-y-2">
              {topFoods.map(([name, count], idx) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-2.5 bg-[#EFEFE9]/50 rounded-xl text-xs font-medium border border-[#BBA58F]/20"
                >
                  <span className="flex items-center gap-2 text-[#223030] font-semibold truncate">
                    <span className="w-5 h-5 rounded-full bg-[#E8D9CD] flex items-center justify-center text-[10px] font-bold text-[#523D35] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{name}</span>
                  </span>
                  <span className="text-[#523D35] font-bold shrink-0 ml-2">
                    {count} {count === 1 ? t('timeSingle', 'time') : t('times', 'times')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionReport;
