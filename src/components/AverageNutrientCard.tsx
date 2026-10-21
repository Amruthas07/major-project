import React from 'react';
import { Apple } from 'lucide-react';
import { useLanguage } from '../services/language_service';

export interface AverageNutrientCardProps {
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
  recordedDaysCount?: number;
  lang?: string;
}

export const AverageNutrientCard: React.FC<AverageNutrientCardProps> = ({
  stats = {
    avgCalories: 2150,
    avgProtein: 68,
    avgCarbs: 260,
    avgFat: 48,
    avgFiber: 28,
    avgIron: 26,
    avgCalcium: 980,
    avgFolate: 520
  },
  recordedDaysCount = 7
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 border border-[#BBA58F]/40 shadow-xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-[#223030] flex items-center gap-2">
            <Apple className="w-5 h-5 text-[#523D35]" />
            <span>{t('averageDailyNutrientIntake', 'Average Daily Nutrient Intake')}</span>
          </h3>
          <p className="text-xs text-[#523D35]/90 font-medium mt-0.5">
            {t('calculatedStrictlyFromMeals', 'Calculated strictly from meals logged on the active recording days.')}
          </p>
        </div>

        <span className="text-[11px] bg-[#EFEFE9] text-[#523D35] px-2.5 py-1 rounded-md font-semibold border border-[#BBA58F]/20">
          {t('targetIcmrGuidelines', 'Target: ICMR Guidelines for Pregnancy')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
        {/* Calories */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('calories', 'Calories')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('rda', 'RDA')} ~2,300</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgCalories ?? 0} kcal</div>
          <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#523D35] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(((stats.avgCalories ?? 0) / 2300) * 100))}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('protein', 'Protein')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('rda', 'RDA')} ~65-70g</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgProtein ?? 0} g</div>
          <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#523D35] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(((stats.avgProtein ?? 0) / 68) * 100))}%` }}
            />
          </div>
        </div>

        {/* Iron */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('iron', 'Iron')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('rda', 'RDA')} ~27mg</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgIron ?? 0} mg</div>
          <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#523D35] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(((stats.avgIron ?? 0) / 27) * 100))}%` }}
            />
          </div>
        </div>

        {/* Calcium */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('calcium', 'Calcium')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('rda', 'RDA')} ~1,000mg</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgCalcium ?? 0} mg</div>
          <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#523D35] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round(((stats.avgCalcium ?? 0) / 1000) * 100))}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('carbs', 'Carbohydrates')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('energy', 'Energy')}</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgCarbs ?? 0} g</div>
        </div>

        {/* Healthy Fats */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('fats', 'Fats')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('lipids', 'Lipids')}</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgFat ?? 0} g</div>
        </div>

        {/* Dietary Fibre */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('dietaryFibre', 'Dietary Fibre')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('digestion', 'Digestion')}</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgFiber ?? 0} g</div>
        </div>

        {/* Folate */}
        <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
          <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
            <span>{t('folate', 'Folate')}</span>
            <span className="text-[10px] text-[#523D35] font-bold">{t('rda', 'RDA')} ~570mcg</span>
          </div>
          <div className="text-xl font-black text-[#223030] mt-1">{stats.avgFolate ?? 0} mcg</div>
        </div>
      </div>
    </div>
  );
};

export default AverageNutrientCard;
