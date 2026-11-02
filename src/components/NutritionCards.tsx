import React, { useState } from 'react';
import { useTranslation } from '../i18n/translations';
import { Sparkles, ShieldCheck, Eye, EyeOff } from 'lucide-react';

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
  const [showVisualReference, setShowVisualReference] = useState(false);

  const cards = [
    {
      key: 'calories',
      label: t('calories'),
      clinicalTag: t('energy', 'Energy & Metabolic Fuel'),
      current: nutritionData.calories,
      target: targets?.calories || 2050,
      unit: 'kcal',
      icon3d: '⚡',
      image: '/assets/aistudio/nutrient_calories.png',
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
      image: '/assets/aistudio/nutrient_protein.png',
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
      image: '/assets/aistudio/nutrient_carbs.png',
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
      image: '/assets/aistudio/nutrient_fibre.png',
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
      image: '/assets/aistudio/nutrient_iron.png',
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
      image: '/assets/aistudio/nutrient_calcium.png',
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
        <div className="flex items-center gap-3 text-xs font-bold text-[#523D35]">
          <button
            type="button"
            onClick={() => setShowVisualReference((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#959D90]/40 text-[#523D35] text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            {showVisualReference ? <EyeOff className="w-3.5 h-3.5 text-[#523D35]" /> : <Eye className="w-3.5 h-3.5 text-[#523D35]" />}
            <span>{showVisualReference ? 'Hide Visual Guide' : 'Visual Guide'}</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#523D35]">
            <ShieldCheck className="w-4 h-4 text-[#523D35]" />
            <span>ICMR-NIN Guidelines</span>
          </div>
        </div>
      </div>

      {/* Visual Reference Guide from Uploaded Dashboard Image */}
      {showVisualReference && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-[#959D90]/40 bg-white p-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-extrabold text-[#523D35] uppercase tracking-wider">
              ICMR-NIN Daily Nutrition Reference Dashboard
            </span>
            <span className="text-[11px] text-[#959D90]">Reference Guide</span>
          </div>
          <img
            src="/assets/aistudio/image_5b0c25da.png"
            alt="ICMR-NIN Maternal Nutrition Target Reference"
            className="w-full h-auto rounded-xl object-contain max-h-[300px] border border-[#959D90]/20"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((item) => {
          const percent = Math.min(Math.round((item.current / item.target) * 100), 100);
          const remaining = Math.max(Number((item.target - item.current).toFixed(1)), 0);

          return (
            <div
              key={item.key}
              className="relative overflow-hidden rounded-2xl p-5 bg-white border border-[#BBA58F]/40 shadow-xs hover:shadow-md hover:border-[#523D35] transition-all group"
            >
              {/* Visual illustration from uploaded nutrition dashboard */}
              <div
                className="absolute top-3.5 right-3.5 w-14 h-10 rounded-xl shadow-xs overflow-hidden border border-[#959D90]/35 bg-white/95 p-1 flex items-center justify-center transform group-hover:scale-105 transition-transform"
                title={`${item.label} Target`}
              >
                <img
                  src={item.image}
                  alt={`${item.label} illustration`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="pr-16">
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
