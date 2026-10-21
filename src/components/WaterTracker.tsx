import React from 'react';
import { useTranslation } from '../i18n/translations';
import { Maternal3DArt } from './Maternal3DArt';
import { Droplets, Plus, ShieldCheck } from 'lucide-react';

export interface WaterTrackerProps {
  waterIntake: number;
  onAddWater: () => void;
  lang?: string;
  maxGoal?: number;
}

export default function WaterTracker({
  waterIntake,
  onAddWater,
  lang = 'en',
  maxGoal = 3000
}: WaterTrackerProps) {
  const { t } = useTranslation(lang);
  const percent = Math.min(Math.round((waterIntake / maxGoal) * 100), 100);
  const glasses = (waterIntake / 250).toFixed(1).replace('.0', '');
  const targetGlasses = (maxGoal / 250).toFixed(0);

  return (
    <div className="bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/30 dark:bg-slate-900/95 rounded-3xl p-6 sm:p-7 shadow-lg border border-cyan-200/80 dark:border-cyan-900/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-5 w-full sm:w-auto relative z-10">
        {/* 3D Hydration Art Badge */}
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-[#E8D9CD]/50 dark:bg-slate-800 border-2 border-cyan-300 dark:border-cyan-700 shadow-md flex items-center justify-center p-1 shrink-0 overflow-hidden group">
          <Maternal3DArt
            type="hydration-glass"
            className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
            alt="3D Maternal Hydration Glass"
          />
          {/* Badge indicator on bottom */}
          <div className="absolute bottom-1 px-1.5 py-0.5 rounded-md bg-cyan-700 text-white text-[9px] font-black">
            {percent}%
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-[#223030] dark:text-slate-100 tracking-tight flex items-center gap-1.5">
              <Droplets className="w-5 h-5 text-cyan-600" />
              <span>{t('waterIntake')}</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
              Maternal Safety
            </span>
          </div>

          <p className="text-xs text-[#523D35] dark:text-slate-300 font-medium">
            {t('hydrationGoal')} • {glasses} / {targetGlasses} glasses
          </p>

          <div className="text-base sm:text-lg font-black text-cyan-700 dark:text-cyan-400 pt-0.5">
            {waterIntake} ml <span className="text-xs text-[#523D35] dark:text-slate-300 font-semibold">/ {maxGoal} ml</span>
          </div>

          {/* 3D Progress Bar */}
          <div className="w-40 sm:w-56 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner mt-1.5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-600 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="w-full sm:w-auto relative z-10 flex flex-col items-center sm:items-end gap-2">
        <button
          type="button"
          onClick={onAddWater}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addWater')}</span>
        </button>
        <span className="text-[11px] text-[#523D35] font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Amniotic fluid & circulation support</span>
        </span>
      </div>
    </div>
  );
}
