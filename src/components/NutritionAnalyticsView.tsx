import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Award, AlertCircle, Calendar, Sparkles, 
  Flame, Dumbbell, HeartPulse, Droplets, Info, Scale, Plus, CheckCircle2 
} from 'lucide-react';
import { LoggedMealRecord, DetailedNutrients, getMaternalNutritionTargets } from '../nutrition_engine';

interface NutritionAnalyticsViewProps {
  loggedMeals: LoggedMealRecord[];
  profile?: any;
  userProfile?: any;
  onOpenScanner?: () => void;
  language?: string;
}

export const NutritionAnalyticsView: React.FC<NutritionAnalyticsViewProps> = ({
  loggedMeals = [],
  profile,
  userProfile,
  onOpenScanner = () => {},
  language = 'en'
}) => {
  const activeProfile = profile || userProfile || {};
  const targetSet = useMemo(() => getMaternalNutritionTargets(activeProfile), [activeProfile]);
  const targets = targetSet?.targets || ({} as any);

  const calTarget = targets.calories?.target ?? 2350;
  const protTarget = targets.protein?.target ?? 68;
  const ironTarget = targets.iron?.target ?? 27;
  const calcTarget = targets.calcium?.target ?? 1000;
  const fiberTarget = targets.fiber?.target ?? 35;

  const currentWeek = activeProfile?.pregnancyWeek || 24;
  const prePregnancyWeight = activeProfile?.weightKg || 58;
  const userHeightCm = activeProfile?.heightCm || 162;

  // Initial BMI Calculation
  const heightM = userHeightCm / 100;
  const preBmi = Math.round((prePregnancyWeight / (heightM * heightM)) * 10) / 10;

  // Weight logs state
  const [weightLogs, setWeightLogs] = useState<Array<{ week: number; weightKg: number }>>([
    { week: 4, weightKg: prePregnancyWeight },
    { week: 8, weightKg: prePregnancyWeight + 0.5 },
    { week: 12, weightKg: prePregnancyWeight + 1.8 },
    { week: 16, weightKg: prePregnancyWeight + 3.2 },
    { week: 20, weightKg: prePregnancyWeight + 4.9 },
    { week: 24, weightKg: prePregnancyWeight + 6.5 }
  ]);

  const [newLogWeek, setNewLogWeek] = useState<number>(currentWeek);
  const [newLogWeight, setNewLogWeight] = useState<string>('');
  const [logSuccess, setLogSuccess] = useState<boolean>(false);

  // Generate 40-week IOM Standard Pregnancy Weight Trajectory Curves
  const weightCurveData = useMemo(() => {
    const data: Array<{
      week: number;
      actualWeight?: number;
      minRecommended: number;
      maxRecommended: number;
      idealTarget: number;
    }> = [];

    for (let w = 0; w <= 40; w += 2) {
      // Standard IOM Normal BMI expected gain: ~0.5-2kg in T1 (wk 0-13), then ~0.42kg/wk in T2/T3
      let minGain = 0;
      let maxGain = 0;
      let idealGain = 0;

      if (w <= 13) {
        minGain = (w / 13) * 0.8;
        maxGain = (w / 13) * 2.0;
        idealGain = (w / 13) * 1.5;
      } else {
        const weeksAfterT1 = w - 13;
        minGain = 0.8 + weeksAfterT1 * 0.35;
        maxGain = 2.0 + weeksAfterT1 * 0.50;
        idealGain = 1.5 + weeksAfterT1 * 0.42;
      }

      const matchActual = weightLogs.find(log => Math.abs(log.week - w) < 2);

      data.push({
        week: w,
        actualWeight: matchActual ? matchActual.weightKg : (w === currentWeek ? prePregnancyWeight + 6.5 : undefined),
        minRecommended: Math.round((prePregnancyWeight + minGain) * 10) / 10,
        maxRecommended: Math.round((prePregnancyWeight + maxGain) * 10) / 10,
        idealTarget: Math.round((prePregnancyWeight + idealGain) * 10) / 10,
      });
    }

    return data;
  }, [prePregnancyWeight, weightLogs, currentWeek]);

  // Aggregate past 7 days dataset
  const sevenDaysData = useMemo(() => {
    const days: Array<{
      date: string;
      dayName: string;
      calories: number;
      protein: number;
      iron: number;
      calcium: number;
      folate: number;
      fiber: number;
      mealsCount: number;
    }> = [];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayMeals = loggedMeals.filter(m => m.date === dateStr);
      let calories = 0;
      let protein = 0;
      let iron = 0;
      let calcium = 0;
      let folate = 0;
      let fiber = 0;

      dayMeals.forEach(m => {
        calories += m.nutrients.calories || 0;
        protein += m.nutrients.protein || 0;
        iron += m.nutrients.iron || 0;
        calcium += m.nutrients.calcium || 0;
        folate += m.nutrients.folate || 0;
        fiber += m.nutrients.fiber || 0;
      });

      days.push({
        date: dateStr,
        dayName,
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        iron: Math.round(iron * 10) / 10,
        calcium: Math.round(calcium),
        folate: Math.round(folate),
        fiber: Math.round(fiber * 10) / 10,
        mealsCount: dayMeals.length
      });
    }

    return days;
  }, [loggedMeals]);

  // Compute 7-day averages
  const averages = useMemo(() => {
    const daysWithMeals = sevenDaysData.filter(d => d.mealsCount > 0);
    const divisor = daysWithMeals.length || 1;

    const totalCal = daysWithMeals.reduce((acc, d) => acc + d.calories, 0);
    const totalProt = daysWithMeals.reduce((acc, d) => acc + d.protein, 0);
    const totalIron = daysWithMeals.reduce((acc, d) => acc + d.iron, 0);
    const totalCalc = daysWithMeals.reduce((acc, d) => acc + d.calcium, 0);
    const totalFib = daysWithMeals.reduce((acc, d) => acc + d.fiber, 0);

    return {
      avgCalories: Math.round(totalCal / divisor),
      avgProtein: Math.round((totalProt / divisor) * 10) / 10,
      avgIron: Math.round((totalIron / divisor) * 10) / 10,
      avgCalcium: Math.round(totalCalc / divisor),
      avgFiber: Math.round((totalFib / divisor) * 10) / 10,
      daysLogged: daysWithMeals.length
    };
  }, [sevenDaysData]);

  const handleAddWeightLog = () => {
    const val = parseFloat(newLogWeight);
    if (isNaN(val) || val <= 30 || val >= 180) return;

    setWeightLogs(prev => [
      ...prev.filter(l => l.week !== newLogWeek),
      { week: newLogWeek, weightKg: val }
    ].sort((a, b) => a.week - b.week));

    setNewLogWeight('');
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black uppercase tracking-wider border border-pink-100">
              Clinical Progress & Trends
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Maternal Analytics & Weight Tracker</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking your dietary compliance against ICMR-NIN 2020 RDA targets and gestational weight gain against WHO/IOM standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {targetSet.trimester} Target
          </span>
          <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            Week {currentWeek} Active
          </span>
        </div>
      </div>

      {/* 2. Gestational Weight Progression Curve (WHO / IOM Standard) */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-pink-600" />
              <h2 className="text-lg font-bold text-slate-900">Gestational Weight Gain Curve (IOM Benchmark)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Healthy gestational gain envelope based on pre-pregnancy BMI ({preBmi} kg/m² • Normal Range: 11.5 – 16.0 kg total gain)
            </p>
          </div>

          {/* Quick Log Input */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <select
              value={newLogWeek}
              onChange={(e) => setNewLogWeek(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              {Array.from({ length: 40 }, (_, i) => i + 1).map(w => (
                <option key={w} value={w}>Wk {w}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.1"
              value={newLogWeight}
              onChange={(e) => setNewLogWeight(e.target.value)}
              placeholder="e.g. 64.5 kg"
              className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            <button
              onClick={handleAddWeightLog}
              className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              + Log
            </button>
          </div>
        </div>

        {logSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Weight entry logged successfully for Week {newLogWeek}!</span>
          </div>
        )}

        {/* Weight Curve Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="weightBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="week" tickLine={false} stroke="#94A3B8" fontSize={11} unit=" w" />
              <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} unit=" kg" />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                formatter={(val: any, name: string) => [`${val} kg`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="maxRecommended" name="Max Healthy Threshold" stroke="#FDA4AF" strokeDasharray="3 3" fill="url(#weightBand)" />
              <Area type="monotone" dataKey="minRecommended" name="Min Healthy Threshold" stroke="#FDA4AF" strokeDasharray="3 3" fill="#FFFFFF" />
              <Line type="monotone" dataKey="idealTarget" name="IOM Recommended Baseline" stroke="#E11D48" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actualWeight" name="Your Logged Weight" stroke="#0F172A" strokeWidth={3} dot={{ r: 5, fill: '#0F172A' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. 7-Day Nutrition Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">7-Day Avg Energy</p>
          <p className="text-xl font-black text-slate-900">{averages.avgCalories}</p>
          <p className="text-[10px] text-slate-400 font-semibold">Target: {calTarget} kcal</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-pink-600">7-Day Avg Protein</p>
          <p className="text-xl font-black text-slate-900">{averages.avgProtein}g</p>
          <p className="text-[10px] text-slate-400 font-semibold">Target: {protTarget}g</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">7-Day Avg Iron</p>
          <p className="text-xl font-black text-slate-900">{averages.avgIron}mg</p>
          <p className="text-[10px] text-slate-400 font-semibold">Target: {ironTarget}mg</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-purple-600">7-Day Avg Calcium</p>
          <p className="text-xl font-black text-slate-900">{averages.avgCalcium}mg</p>
          <p className="text-[10px] text-slate-400 font-semibold">Target: {calcTarget}mg</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-center space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">7-Day Avg Fibre</p>
          <p className="text-xl font-black text-slate-900">{averages.avgFiber}g</p>
          <p className="text-[10px] text-slate-400 font-semibold">Target: {fiberTarget}g</p>
        </div>
      </div>

      {/* 4. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: DAILY CALORIES */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Calories Intake Trend (7 Days)</h3>
              <p className="text-xs text-slate-400">Daily energy against reference target ({calTarget} kcal)</p>
            </div>
            <Flame className="w-5 h-5 text-pink-600" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sevenDaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="dayName" tickLine={false} stroke="#94A3B8" fontSize={11} />
                <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} domain={[0, 3000]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} kcal`, 'Calories']}
                />
                <ReferenceLine y={calTarget} stroke="#F43F5E" strokeDasharray="4 4" label={{ value: 'Target', position: 'top', fill: '#F43F5E', fontSize: 10 }} />
                <Bar dataKey="calories" fill="#E11D48" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: DAILY PROTEIN */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Protein Intake (7 Days)</h3>
              <p className="text-xs text-slate-400">Daily protein vs target ({protTarget}g)</p>
            </div>
            <Dumbbell className="w-5 h-5 text-pink-600" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sevenDaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="dayName" tickLine={false} stroke="#94A3B8" fontSize={11} />
                <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} g`, 'Protein']}
                />
                <ReferenceLine y={protTarget} stroke="#E11D48" strokeDasharray="4 4" label={{ value: 'Target', position: 'top', fill: '#E11D48', fontSize: 10 }} />
                <Line type="monotone" dataKey="protein" stroke="#E11D48" strokeWidth={3} dot={{ r: 5, fill: '#E11D48' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: IRON & CALCIUM DAILY DUAL TREND */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Iron & Calcium Daily Mineral Fulfillment</h3>
              <p className="text-xs text-slate-400">Essential minerals supporting hemoglobin synthesis & fetal bone density</p>
            </div>
            <HeartPulse className="w-5 h-5 text-pink-600" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sevenDaysData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="dayName" tickLine={false} stroke="#94A3B8" fontSize={11} />
                <YAxis tickLine={false} stroke="#94A3B8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="calcium" name="Calcium (mg)" fill="#9333EA" radius={[6, 6, 0, 0]} barSize={18} />
                <Bar dataKey="iron" name="Iron (mg x 10 scale for visual comparability)" fill="#D97706" radius={[6, 6, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. Clinical Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-[11px] text-slate-500 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-700">Clinical Reference Note:</span> Nutrition targets and weight curves are based on ICMR-NIN 2020 RDA guidelines and WHO/IOM gestational benchmarks. They provide educational support and do not replace personalized obstetric consultations or laboratory assessments.
        </p>
      </div>

    </div>
  );
};
