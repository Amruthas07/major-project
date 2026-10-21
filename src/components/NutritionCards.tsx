import React from 'react';
import { useTranslation } from '../i18n/translations';
import { Sparkles, ShieldCheck } from 'lucide-react';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fibre: number;
  iron: number;
  calcium: number;
}

export interface NutritionTargets {
  calories?: number;
  protein?: number;
  carbs?: number;
  fibre?: number;
  iron?: number;
  calcium?: number;
}

export interface NutritionCardsProps {
  nutritionData: NutritionData;
  targets?: NutritionTargets;
  lang?: string;
}

export default function NutritionCards({ nutritionData, targets, lang = 'en' }: NutritionCardsProps) {
  const { t } = useTranslation(lang);

  const cards = [
    {
      key: 'calories',
      label: t('calories'),
      clinicalTag: t('energy', 'Energy & Metabolic Fuel'),
      current: nutritionData.calories,
      target: targets?.calories || 2050,
      unit: 'kcal',
      icon3d: '⚡',
      color: 'from-amber-500 via-orange-500 to-amber-600',
      badgeBg: 'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-amber-500/30'
    },
    {
      key: 'protein',
      label: t('protein'),
      clinicalTag: 'Tissue & Fetal Growth',
      current: nutritionData.protein,
      target: targets?.protein || 80,
      unit: 'g',
      icon3d: '🥛',
      color: 'from-emerald-500 via-teal-500 to-emerald-600',
      badgeBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 text-white shadow-emerald-500/30'
    },
    {
      key: 'carbs',
      label: t('carbs'),
      clinicalTag: 'Whole Grains & Stamina',
      current: nutritionData.carbs,
      target: targets?.carbs || 250,
      unit: 'g',
      icon3d: '🌾',
      color: 'from-blue-500 via-indigo-500 to-blue-600',
      badgeBg: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 text-white shadow-blue-500/30'
    },
    {
      key: 'fibre',
      label: t('fibre'),
      clinicalTag: t('digestion', 'Smooth Digestion & Colon'),
      current: nutritionData.fibre,
      target: targets?.fibre || 30,
      unit: 'g',
      icon3d: '🥗',
      color: 'from-green-600 via-emerald-600 to-teal-700',
      badgeBg: 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white shadow-green-500/30'
    },
    {
      key: 'iron',
      label: t('iron'),
      clinicalTag: 'Hemoglobin & Oxygen Flow',
      current: nutritionData.iron,
      target: targets?.iron || 27,
      unit: 'mg',
      icon3d: '🩸',
      color: 'from-rose-500 via-red-500 to-rose-600',
      badgeBg: 'bg-gradient-to-br from-rose-400 via-red-500 to-rose-600 text-white shadow-rose-500/30'
    },
    {
      key: 'calcium',
      label: t('calcium'),
      clinicalTag: 'Fetal Skeletal Strength',
      current: nutritionData.calcium,
      target: targets?.calcium || 1000,
      unit: 'mg',
      icon3d: '🦴',
      color: 'from-purple-500 via-violet-500 to-purple-600',
      badgeBg: 'bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 text-white shadow-purple-500/30'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-[#EFEFE9]/60 to-[#E8D9CD]/30 rounded-3xl p-6 sm:p-7 shadow-lg border border-[#BBA58F]/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3 border-b border-[#959D90]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#223030] tracking-tight">
              {t('todaysNutrition')}
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 bg-[#523D35] text-[#EFEFE9] rounded-full font-bold uppercase tracking-wider">
              3D Daily Target
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#523D35] font-semibold mt-0.5">
            {t('calculatedFromMeals')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#523D35]">
          <ShieldCheck className="w-4 h-4 text-[#523D35]" />
          <span>ICMR-NIN Maternal Guidelines</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((item) => {
          const percent = Math.min(Math.round((item.current / item.target) * 100), 100);
          const remaining = Math.max(Number((item.target - item.current).toFixed(1)), 0);

          return (
            <div
              key={item.key}
              className="relative overflow-hidden rounded-2xl p-5 bg-white border border-[#BBA58F]/40 shadow-xs hover:shadow-md hover:border-[#523D35] transition-all group"
            >
              {/* 3D Visual Floating Badge with soft lighting */}
              <div
                className={`absolute top-4 right-4 w-12 h-12 rounded-2xl shadow-md flex items-center justify-center text-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-transform cursor-pointer border border-white/60 ${item.badgeBg}`}
              >
                {item.icon3d}
              </div>

              <div className="pr-14">
                <span className="text-xs font-black uppercase tracking-wider text-[#523D35] block">
                  {item.label}
                </span>
                <span className="text-[10px] text-[#523D35] font-bold block truncate">
                  {item.clinicalTag}
                </span>
              </div>

              <div className="mt-3 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-black text-[#223030]">
                  {item.current}
                </span>
                <span className="ml-1.5 text-xs sm:text-sm text-[#523D35] font-semibold">
                  / {item.target} {item.unit}
                </span>
              </div>

              {/* 3D-styled Progress Bar with soft glow */}
              <div className="mt-3 w-full bg-[#EFEFE9] h-3 rounded-full overflow-hidden shadow-inner border border-[#959D90]/20">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500 shadow-sm`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-2.5 flex justify-between items-center text-xs text-[#223030] font-bold">
                <span>{percent}%</span>
                <span className="truncate ml-2 text-[#523D35] text-[11px]">
                  {remaining} {item.unit} {t('remainingToday')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
