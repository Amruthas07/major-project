import React, { useState } from 'react';
import { useAppContext, DAYS_OF_WEEK, DayOfWeek } from '../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  CalendarCheck,
  Check,
  TrendingUp,
  Info,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  AlertCircle
} from 'lucide-react';

interface WeeklyNutritionSummaryViewProps {
  onBack?: () => void;
}

export const WeeklyNutritionSummaryView: React.FC<WeeklyNutritionSummaryViewProps> = ({ onBack }) => {
  const {
    getWeeklyNutrition,
    trimesterRdaTargets,
    selectedTrimester,
    userProfile,
    waterIntakeMl,
    meals,
    setSelectedDay,
    setActiveTab
  } = useAppContext();

  const weeklyData = getWeeklyNutrition();
  const [activeMetricTrend, setActiveMetricTrend] = useState<'calories' | 'protein' | 'iron' | 'calcium' | 'folate'>('calories');

  // Benchmark target thresholds
  const avgCal = weeklyData.weeklyAvgCalories;
  const avgProt = weeklyData.weeklyAvgProtein;
  const avgIron = weeklyData.weeklyAvgIron;
  const avgCalc = weeklyData.weeklyAvgCalcium;
  const avgFol = weeklyData.weeklyAvgFolate;

  const targetCal = trimesterRdaTargets.calories;
  const targetProt = trimesterRdaTargets.protein;
  const targetIron = trimesterRdaTargets.iron;
  const targetCalc = trimesterRdaTargets.calcium;
  const targetFol = trimesterRdaTargets.folate;

  // Status evaluator helper: "On Track" (>=90%), "Slightly Low" (75-89%), "Needs Attention" (<75%)
  const getStatus = (avg: number, target: number) => {
    const ratio = target > 0 ? avg / target : 1;
    if (ratio >= 0.9) {
      return {
        label: 'On Track',
        color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        badge: 'bg-emerald-600 text-white',
        icon: CheckCircle2
      };
    } else if (ratio >= 0.75) {
      return {
        label: 'Slightly Low',
        color: 'text-amber-900 bg-amber-100 border-amber-300',
        badge: 'bg-amber-600 text-white',
        icon: AlertTriangle
      };
    } else {
      return {
        label: 'Needs Attention',
        color: 'text-rose-900 bg-rose-100 border-rose-300',
        badge: 'bg-rose-600 text-white',
        icon: AlertCircle
      };
    }
  };

  const calStatus = getStatus(avgCal, targetCal);
  const protStatus = getStatus(avgProt, targetProt);
  const ironStatus = getStatus(avgIron, targetIron);
  const calcStatus = getStatus(avgCalc, targetCalc);
  const folStatus = getStatus(avgFol, targetFol);

  // Day-by-day fulfillment checks
  let metCalDays = 0;
  let metProtDays = 0;
  let metIronDays = 0;
  let metCalcDays = 0;
  let metFolDays = 0;

  DAYS_OF_WEEK.forEach((day) => {
    const d = weeklyData.days[day];
    if (d) {
      if (d.calories >= targetCal * 0.85) metCalDays++;
      if (d.protein >= targetProt * 0.85) metProtDays++;
      if (d.iron >= targetIron * 0.85) metIronDays++;
      if (d.calcium >= targetCalc * 0.85) metCalcDays++;
      if (d.folate >= targetFol * 0.85) metFolDays++;
    }
  });

  // Overall Goal Met Days: Day meets at least 3 of 5 main targets
  const daysMeetingGoals: Record<DayOfWeek, boolean> = {} as any;
  let totalGoalMetDays = 0;

  DAYS_OF_WEEK.forEach((day) => {
    const d = weeklyData.days[day];
    if (!d) {
      daysMeetingGoals[day] = false;
      return;
    }
    let hitCount = 0;
    if (d.calories >= targetCal * 0.8) hitCount++;
    if (d.protein >= targetProt * 0.8) hitCount++;
    if (d.iron >= targetIron * 0.8) hitCount++;
    if (d.calcium >= targetCalc * 0.8) hitCount++;
    if (d.folate >= targetFol * 0.8) hitCount++;

    const isMet = hitCount >= 3 || (d.calories >= targetCal * 0.85 && d.protein >= targetProt * 0.85);
    daysMeetingGoals[day] = isMet;
    if (isMet) totalGoalMetDays++;
  });

  // 4. Consistency Score:
  const consistencyPercent = Math.round((totalGoalMetDays / 7) * 100);
  const getConsistencyRating = (pct: number) => {
    if (pct >= 85) return { label: 'Optimal Consistency', desc: 'Outstanding routine supporting healthy maternal and fetal tissue growth.', color: 'text-emerald-700' };
    if (pct >= 65) return { label: 'Good Consistency', desc: 'Strong habit formation; minor adjustments needed on low-intake days.', color: 'text-amber-800' };
    if (pct >= 40) return { label: 'Moderate Consistency', desc: 'Plan adherence fluctuates across weekdays. Try batch meal prep.', color: 'text-orange-800' };
    return { label: 'Needs Improvement', desc: 'Several daily targets missed. Use Food Explorer to schedule nutrient-dense staple meals.', color: 'text-rose-800' };
  };
  const consistencyRating = getConsistencyRating(consistencyPercent);

  // 5. Smart Insights generation based on actual 7-day data
  const smartInsights: string[] = [];

  if (metIronDays < 5) {
    const lowIronDays = 7 - metIronDays;
    smartInsights.push(
      `Iron intake was low on ${lowIronDays} days. Consider adding ragi, drumstick leaves (moringa), spinach, or chickpea sundal to your upcoming meals to protect against maternal anemia.`
    );
  } else {
    smartInsights.push(
      `Great job on iron! You met your maternal iron targets on ${metIronDays} days, providing vital red blood cell volume for ${selectedTrimester}.`
    );
  }

  if (metCalcDays < 5) {
    const lowCalcDays = 7 - metCalcDays;
    smartInsights.push(
      `Calcium was below target on ${lowCalcDays} days. Incorporate curd/yogurt, paneer, ragi porridge, or sesame chikki into morning or evening snack intervals.`
    );
  }

  if (metProtDays < 5) {
    const lowProtDays = 7 - metProtDays;
    smartInsights.push(
      `Protein was slightly low on ${lowProtDays} days. Try pairing dal with quinoa or millets, or adding a boiled egg or sprouted moong bowl at lunch.`
    );
  } else {
    smartInsights.push(
      `Protein intake is well-stabilized (${avgProt}g daily average), efficiently supporting steady fetal organ synthesis.`
    );
  }

  if (smartInsights.length < 3) {
    smartInsights.push(
      `Folate (B9) intake averaged ${avgFol}µg/day against your ${targetFol}µg ICMR goal, essential for nervous system support.`
    );
  }

  // Active Metric Data for Trend Visualization
  const getMetricValueForDay = (day: DayOfWeek, metric: typeof activeMetricTrend) => {
    const d = weeklyData.days[day];
    if (!d) return 0;
    return d[metric] || 0;
  };

  const getMetricTarget = (metric: typeof activeMetricTrend) => {
    switch (metric) {
      case 'calories': return targetCal;
      case 'protein': return targetProt;
      case 'iron': return targetIron;
      case 'calcium': return targetCalc;
      case 'folate': return targetFol;
    }
  };

  const getMetricUnit = (metric: typeof activeMetricTrend) => {
    switch (metric) {
      case 'calories': return 'kcal';
      case 'protein': return 'g';
      case 'iron': return 'mg';
      case 'calcium': return 'mg';
      case 'folate': return 'µg';
    }
  };

  const activeTarget = getMetricTarget(activeMetricTrend);
  const activeUnit = getMetricUnit(activeMetricTrend);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#E8D9CD] rounded-3xl p-6 sm:p-8 border border-[#959D90] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#523D35] text-[#E8D9CD] border border-[#BBA58F]/30 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#BBA58F]" />
            <span>7-Day Nutrition Overview</span>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EFEFE9] hover:bg-[#BBA58F]/30 text-[#223030] text-xs font-bold border border-[#959D90]/50 transition cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4 text-[#523D35]" />
              <span>Back to Daily Planner</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#223030] tracking-tight">
            📊 7-Day Maternal Nutrition Summary
          </h2>
          <p className="text-xs sm:text-sm text-[#523D35] mt-1 max-w-2xl leading-relaxed">
            Consolidated weekly review measuring your daily dietary intake and hydration against ICMR-NIN recommendations for the <strong>{selectedTrimester}</strong>.
          </p>
        </div>
      </div>

      {/* 4. CONSISTENCY SCORE & OVERVIEW CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-[#223030] rounded-3xl p-6 text-[#EFEFE9] border border-[#959D90]/40 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold text-[#959D90] uppercase tracking-wider block">
              Consistency Score
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl font-black text-[#E8D9CD]">{consistencyPercent}%</span>
              <span className="text-xs font-semibold text-[#BBA58F]">
                {totalGoalMetDays} of 7 Days Met Targets
              </span>
            </div>
          </div>

          <div className="bg-[#523D35] p-3.5 rounded-2xl border border-[#BBA58F]/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#E8D9CD]">
              <Award className="w-4 h-4 text-[#BBA58F]" />
              <span>{consistencyRating.label}</span>
            </div>
            <p className="text-[11px] text-[#E8D9CD]/90 leading-snug">
              {consistencyRating.desc}
            </p>
          </div>

          <div className="pt-2 border-t border-[#959D90]/30 flex items-center justify-between text-xs text-[#959D90]">
            <span>Meals Consumed</span>
            <span className="font-extrabold text-[#EFEFE9]">
              {weeklyData.totalCompletedMeals} / {weeklyData.totalPlannedMeals}
            </span>
          </div>
        </div>

        {/* 5. SMART INSIGHTS CARD */}
        <div className="lg:col-span-2 bg-[#EFEFE9] rounded-3xl p-6 border border-[#959D90] space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-[#223030] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#523D35]" />
            <span>Smart Nutrition Insights &amp; Clinical Guidance</span>
          </div>

          <div className="space-y-3">
            {smartInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#E8D9CD] rounded-2xl border border-[#959D90]/40 text-xs text-[#223030] flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-[#523D35] text-[#E8D9CD] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="leading-relaxed font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1 & 2. AVERAGE DAILY INTAKE & TRIMESTER TARGET COMPARISON */}
      <div className="bg-[#EFEFE9] rounded-3xl p-6 sm:p-8 border border-[#959D90] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#959D90]/30 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#223030] tracking-tight">
              1 &amp; 2. Daily Averages vs. {selectedTrimester} ICMR Targets
            </h3>
            <p className="text-xs text-[#523D35]">
              Real-time comparison of average daily nutrients consumed over the past 7 days.
            </p>
          </div>
          <span className="text-xs font-bold text-[#523D35] bg-[#E8D9CD] px-3 py-1 rounded-full border border-[#959D90]/40 self-start sm:self-auto">
            Target Standard: ICMR-NIN RDA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Calories */}
          <div className="bg-[#E8D9CD] p-4.5 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D35]">
                Calories
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${calStatus.color}`}>
                {calStatus.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#223030]">{avgCal}</span>
                <span className="text-xs font-semibold text-[#523D35] ml-1">kcal/day</span>
              </div>
              <span className="text-xs font-bold text-[#523D35]">
                Target: {targetCal} kcal
              </span>
            </div>
            <div className="w-full bg-[#EFEFE9] h-2.5 rounded-full overflow-hidden border border-[#959D90]/30">
              <div
                className="bg-[#523D35] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((avgCal / targetCal) * 100))}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="bg-[#E8D9CD] p-4.5 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D35]">
                Protein
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${protStatus.color}`}>
                {protStatus.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#223030]">{avgProt}</span>
                <span className="text-xs font-semibold text-[#523D35] ml-1">g/day</span>
              </div>
              <span className="text-xs font-bold text-[#523D35]">
                Target: {targetProt} g
              </span>
            </div>
            <div className="w-full bg-[#EFEFE9] h-2.5 rounded-full overflow-hidden border border-[#959D90]/30">
              <div
                className="bg-[#523D35] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((avgProt / targetProt) * 100))}%` }}
              />
            </div>
          </div>

          {/* Iron */}
          <div className="bg-[#E8D9CD] p-4.5 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D35]">
                Iron (Fe)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${ironStatus.color}`}>
                {ironStatus.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#223030]">{avgIron}</span>
                <span className="text-xs font-semibold text-[#523D35] ml-1">mg/day</span>
              </div>
              <span className="text-xs font-bold text-[#523D35]">
                Target: {targetIron} mg
              </span>
            </div>
            <div className="w-full bg-[#EFEFE9] h-2.5 rounded-full overflow-hidden border border-[#959D90]/30">
              <div
                className="bg-[#523D35] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((avgIron / targetIron) * 100))}%` }}
              />
            </div>
          </div>

          {/* Calcium */}
          <div className="bg-[#E8D9CD] p-4.5 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D35]">
                Calcium (Ca)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${calcStatus.color}`}>
                {calcStatus.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#223030]">{avgCalc}</span>
                <span className="text-xs font-semibold text-[#523D35] ml-1">mg/day</span>
              </div>
              <span className="text-xs font-bold text-[#523D35]">
                Target: {targetCalc} mg
              </span>
            </div>
            <div className="w-full bg-[#EFEFE9] h-2.5 rounded-full overflow-hidden border border-[#959D90]/30">
              <div
                className="bg-[#523D35] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((avgCalc / targetCalc) * 100))}%` }}
              />
            </div>
          </div>

          {/* Folate */}
          <div className="bg-[#E8D9CD] p-4.5 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D35]">
                Folate (B9)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${folStatus.color}`}>
                {folStatus.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#223030]">{avgFol}</span>
                <span className="text-xs font-semibold text-[#523D35] ml-1">µg/day</span>
              </div>
              <span className="text-xs font-bold text-[#523D35]">
                Target: {targetFol} µg
              </span>
            </div>
            <div className="w-full bg-[#EFEFE9] h-2.5 rounded-full overflow-hidden border border-[#959D90]/30">
              <div
                className="bg-[#523D35] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((avgFol / targetFol) * 100))}%` }}
              />
            </div>
          </div>

          {/* Hydration / Water */}
          <div className="bg-[#E8D9CD] p-4.5 rounded-2xl border border-[#959D90]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D35]">
                Hydration
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border text-emerald-800 bg-emerald-100 border-emerald-300">
                Daily Logged
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#223030]">{waterIntakeMl}</span>
                <span className="text-xs font-semibold text-[#523D35] ml-1">ml today</span>
              </div>
              <span className="text-xs font-bold text-[#523D35]">
                Target: {trimesterRdaTargets.waterMl} ml
              </span>
            </div>
            <div className="w-full bg-[#EFEFE9] h-2.5 rounded-full overflow-hidden border border-[#959D90]/30">
              <div
                className="bg-[#523D35] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((waterIntakeMl / trimesterRdaTargets.waterMl) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. WEEKLY TRENDS & VISUAL BAR CHART */}
      <div className="bg-[#EFEFE9] rounded-3xl p-6 sm:p-8 border border-[#959D90] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#959D90]/30 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#223030] tracking-tight">
              3. Weekly Trends Across 7 Days
            </h3>
            <p className="text-xs text-[#523D35]">
              Visual breakdown highlighting which days met the recommended targets.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['calories', 'protein', 'iron', 'calcium', 'folate'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setActiveMetricTrend(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                  activeMetricTrend === m
                    ? 'bg-[#223030] text-[#EFEFE9] shadow-xs'
                    : 'bg-[#E8D9CD] text-[#523D35] hover:bg-[#BBA58F]/40 border border-[#959D90]/40'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 7-Day Chart Bars */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2">
          {DAYS_OF_WEEK.map((day) => {
            const val = getMetricValueForDay(day, activeMetricTrend);
            const pct = activeTarget > 0 ? Math.min(130, Math.round((val / activeTarget) * 100)) : 0;
            const metGoal = val >= activeTarget * 0.85;
            const barHeightPct = Math.max(8, Math.min(100, pct));

            return (
              <div key={day} className="flex flex-col items-center space-y-2">
                {/* Met Goal Badge indicator */}
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    metGoal
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-[#E8D9CD] text-[#523D35]'
                  }`}
                  title={metGoal ? 'Goal Met' : 'Below Target'}
                >
                  {metGoal ? '✓ Met' : `${pct}%`}
                </span>

                {/* Bar Container */}
                <div className="w-full bg-[#E8D9CD] h-40 rounded-2xl flex flex-col justify-end p-1.5 border border-[#959D90]/40 relative overflow-hidden">
                  {/* Target reference line at 100% height equivalent */}
                  <div
                    className="absolute left-0 right-0 border-b border-dashed border-[#523D35]/50 z-10"
                    style={{ bottom: '75%' }}
                    title={`Target: ${activeTarget} ${activeUnit}`}
                  />
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      metGoal ? 'bg-[#523D35]' : 'bg-[#BBA58F]'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                {/* Day Label + Value */}
                <div className="text-center">
                  <span className="text-xs font-black text-[#223030] block">
                    {day.slice(0, 3)}
                  </span>
                  <span className="text-[10px] font-bold text-[#523D35] block mt-0.5">
                    {val} {activeUnit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#959D90]/30 text-xs text-[#523D35]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#523D35] inline-block" />
              <span>Target Met (≥85%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#BBA58F] inline-block" />
              <span>Below Target (&lt;85%)</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#223030]">
            Target Line: {activeTarget} {activeUnit} / day
          </span>
        </div>
      </div>
    </div>
  );
};
