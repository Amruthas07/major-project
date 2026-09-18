import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Printer,
  FileBarChart2,
  Apple,
  Droplets,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  Layers,
  ArrowRight,
  TrendingUp,
  Utensils
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useLanguage, DualText } from '../services/language_service';
import { voiceService } from '../services/voice_service';
import { NavTabId } from './MainNavigation';

interface UserReportsViewProps {
  onNavigateTab: (tab: NavTabId) => void;
}

type ReportType = 'weekly' | 'monthly' | 'custom';

export const UserReportsView: React.FC<UserReportsViewProps> = ({ onNavigateTab }) => {
  const {
    userProfile,
    loggedMeals,
    dailyWaterLogs,
    weightRecords,
    currentUser,
    selectedTrimester,
    trimesterRdaTargets
  } = useAppContext();

  const { language, t } = useLanguage();

  // Report Period Selection
  const [reportType, setReportType] = useState<ReportType>('weekly');

  // Offset for Week and Month navigation
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [monthOffset, setMonthOffset] = useState<number>(0);

  // Custom Date Range State (defaults to past 7 days)
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Voice playback state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Daily trend metric toggle (calories vs water hydration)
  const [trendMetric, setTrendMetric] = useState<'calories' | 'water'>('calories');

  useEffect(() => {
    const unsubscribe = voiceService.subscribeSpeaking(setIsSpeaking);
    return () => {
      unsubscribe();
      voiceService.stopSpeaking();
    };
  }, []);

  // Calculate Start and End dates based on selected report type and offset
  const { startDateStr, endDateStr, periodLabel, periodDaysList } = useMemo(() => {
    const today = new Date();

    if (reportType === 'weekly') {
      const end = new Date(today);
      end.setDate(today.getDate() + weekOffset * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);

      const sStr = start.toISOString().split('T')[0];
      const eStr = end.toISOString().split('T')[0];

      // Build daily dates list for the 7 days
      const daysList: string[] = [];
      const curr = new Date(start);
      while (curr <= end) {
        daysList.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
      }

      const label = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

      return {
        startDateStr: sStr,
        endDateStr: eStr,
        periodLabel: label,
        periodDaysList: daysList
      };
    } else if (reportType === 'monthly') {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      const year = targetMonth.getFullYear();
      const month = targetMonth.getMonth();

      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0); // Last day of month

      const sStr = start.toISOString().split('T')[0];
      const eStr = end.toISOString().split('T')[0];

      const daysList: string[] = [];
      const curr = new Date(start);
      while (curr <= end) {
        daysList.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
      }

      const label = targetMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

      return {
        startDateStr: sStr,
        endDateStr: eStr,
        periodLabel: label,
        periodDaysList: daysList
      };
    } else {
      // Custom Range
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const daysList: string[] = [];

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        const curr = new Date(start);
        while (curr <= end) {
          daysList.push(curr.toISOString().split('T')[0]);
          curr.setDate(curr.getDate() + 1);
        }
      }

      const label = `${customStartDate} to ${customEndDate}`;
      return {
        startDateStr: customStartDate,
        endDateStr: customEndDate,
        periodLabel: label,
        periodDaysList: daysList
      };
    }
  }, [reportType, weekOffset, monthOffset, customStartDate, customEndDate]);

  // Filter User's actual recorded meals in this period
  const periodMeals = useMemo(() => {
    return loggedMeals.filter((m) => {
      // If user is authenticated, respect user ID; otherwise respect session
      if (currentUser && m.userId && m.userId !== currentUser.id && m.userId !== 'guest') {
        return false;
      }
      return m.date >= startDateStr && m.date <= endDateStr;
    });
  }, [loggedMeals, startDateStr, endDateStr, currentUser]);

  // Filter User's actual recorded water entries in this period
  const periodWaterLogs = useMemo(() => {
    const logs: { date: string; amountMl: number }[] = [];
    periodDaysList.forEach((d) => {
      const ml = dailyWaterLogs[d];
      if (typeof ml === 'number' && ml > 0) {
        logs.push({ date: d, amountMl: ml });
      }
    });
    return logs;
  }, [dailyWaterLogs, periodDaysList]);

  // Filter User's actual weight entries in this period
  const periodWeightRecords = useMemo(() => {
    return weightRecords.filter((w) => {
      return w.date && w.date >= startDateStr && w.date <= endDateStr;
    });
  }, [weightRecords, startDateStr, endDateStr]);

  // Compute days with actual data
  const daysWithMeals = useMemo(() => {
    return new Set(periodMeals.map((m) => m.date));
  }, [periodMeals]);

  const daysWithWater = useMemo(() => {
    return new Set(periodWaterLogs.map((w) => w.date));
  }, [periodWaterLogs]);

  const allActiveDates = useMemo(() => {
    return new Set([...Array.from(daysWithMeals), ...Array.from(daysWithWater)]);
  }, [daysWithMeals, daysWithWater]);

  const hasActivity = allActiveDates.size > 0;
  const recordedDaysCount = daysWithMeals.size;
  const totalDaysInPeriod = periodDaysList.length || 1;

  // Breakdown by meal types
  const mealTypeCounts = useMemo(() => {
    const counts = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
      Snack: 0
    };
    periodMeals.forEach((m) => {
      if (m.mealType === 'Breakfast') counts.Breakfast++;
      else if (m.mealType === 'Lunch') counts.Lunch++;
      else if (m.mealType === 'Dinner') counts.Dinner++;
      else counts.Snack++;
    });
    return counts;
  }, [periodMeals]);

  // Nutrition Totals and Averages across RECORDED meal days only (NO fake filling!)
  const nutritionStats = useMemo(() => {
    if (recordedDaysCount === 0) {
      return null;
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalIron = 0;
    let totalCalcium = 0;
    let totalFolate = 0;

    periodMeals.forEach((m) => {
      totalCalories += m.nutrients.calories || 0;
      totalProtein += m.nutrients.protein || 0;
      totalCarbs += m.nutrients.carbs || 0;
      totalFat += m.nutrients.fat || 0;
      totalFiber += m.nutrients.fiber || 0;
      totalIron += m.nutrients.iron || 0;
      totalCalcium += m.nutrients.calcium || 0;
      totalFolate += m.nutrients.folate || 0;
    });

    return {
      avgCalories: Math.round(totalCalories / recordedDaysCount),
      avgProtein: Number((totalProtein / recordedDaysCount).toFixed(1)),
      avgCarbs: Math.round(totalCarbs / recordedDaysCount),
      avgFat: Math.round(totalFat / recordedDaysCount),
      avgFiber: Number((totalFiber / recordedDaysCount).toFixed(1)),
      avgIron: Number((totalIron / recordedDaysCount).toFixed(1)),
      avgCalcium: Math.round(totalCalcium / recordedDaysCount),
      avgFolate: Math.round(totalFolate / recordedDaysCount)
    };
  }, [periodMeals, recordedDaysCount]);

  // Water Averages across RECORDED water days only
  const waterStats = useMemo(() => {
    if (periodWaterLogs.length === 0) return null;
    const totalMl = periodWaterLogs.reduce((acc, curr) => acc + curr.amountMl, 0);
    const avgMl = Math.round(totalMl / periodWaterLogs.length);
    return {
      totalMl,
      avgMl,
      avgL: (avgMl / 1000).toFixed(1),
      recordedDays: periodWaterLogs.length
    };
  }, [periodWaterLogs]);

  // Top foods consumed from actual records
  const topFoodsList = useMemo(() => {
    const map = new Map<string, number>();
    periodMeals.forEach((m) => {
      m.foodNames.forEach((name) => {
        const clean = name.trim();
        if (clean) {
          map.set(clean, (map.get(clean) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [periodMeals]);

  // Veg vs Non-Veg Count
  const vegNonVegDistribution = useMemo(() => {
    let vegCount = 0;
    let nonVegCount = 0;

    periodMeals.forEach((m) => {
      let isMealNonVeg = false;
      m.items?.forEach((item) => {
        if (item.category?.toLowerCase().includes('non-veg') || item.category?.toLowerCase().includes('meat') || item.category?.toLowerCase().includes('egg') || item.category?.toLowerCase().includes('fish')) {
          isMealNonVeg = true;
        }
      });
      if (isMealNonVeg) nonVegCount++;
      else vegCount++;
    });

    return { vegCount, nonVegCount };
  }, [periodMeals]);

  // Regional foods identified from user's actual recorded meals
  const regionalFoodsList = useMemo(() => {
    const regionalKeywords = [
      'ragi', 'mudde', 'sambar', 'rasam', 'idli', 'dosa', 'poha', 'upma',
      'khichdi', 'dal', 'chapati', 'roti', 'paratha', 'curd', 'buttermilk',
      'pongal', 'palak', 'methi', 'saag', 'millet', 'payasam', 'kheer',
      'bajra', 'jowar', 'avial', 'poriyal', 'thali'
    ];

    const map = new Map<string, number>();
    periodMeals.forEach((m) => {
      m.foodNames.forEach((name) => {
        const lower = name.toLowerCase();
        if (regionalKeywords.some((kw) => lower.includes(kw))) {
          map.set(name.trim(), (map.get(name.trim()) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [periodMeals]);

  // Food categories distribution from actual meal items recorded
  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>();
    periodMeals.forEach((m) => {
      m.items?.forEach((item) => {
        const cat = item.category || 'Staples & Grains';
        map.set(cat, (map.get(cat) || 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [periodMeals]);

  // Scanner usage count
  const scannerUsageCount = useMemo(() => {
    return periodMeals.filter((m) => m.source === 'Scanner' || m.id.startsWith('scan-')).length;
  }, [periodMeals]);

  // Speech summary script generation in the user's selected language
  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      return;
    }

    const userName = userProfile.name || 'Mother';
    const weekNum = userProfile.weeksPregnant || 24;

    const spokenText = voiceService.buildReportVoiceSummary(
      {
        userName,
        weeksPregnant: weekNum,
        periodLabel,
        hasActivity,
        daysCount: recordedDaysCount,
        mealsCount: periodMeals.length,
        avgCalories: nutritionStats?.avgCalories || 0,
        avgProtein: nutritionStats?.avgProtein || 0,
        avgWaterL: waterStats ? Number(waterStats.avgL) : 0,
        topFoods: topFoodsList.map((f) => f[0])
      },
      language
    );

    voiceService.speak(spokenText, language);
  };

  const handlePrint = () => {
    window.print();
  };

  // Location string strictly read-only from profile
  const locationString = [
    userProfile.village,
    userProfile.taluk,
    userProfile.district,
    userProfile.state
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div id="user-reports-page" className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Bar with Actions */}
      <div className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 border border-[#BBA58F]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#523D35] mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#E8D9CD]/50 text-[#523D35] font-bold">
              📊 {reportType === 'weekly' ? 'Weekly' : reportType === 'monthly' ? 'Monthly' : 'Custom'}
            </span>
            <span>•</span>
            <span className="text-[#959D90] font-medium">{periodLabel}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#223030] tracking-tight flex items-center gap-2">
            <DualText textKey="reports.title" fallback="Your Nutrition & Activity Report" />
          </h1>

          <p className="text-xs sm:text-sm text-[#523D35] mt-1 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#959D90]"></span>
            <DualText textKey="reports.subtitle" fallback="Based on your activity recorded in PregNutri AI" />
          </p>
        </div>

        {/* Action Buttons: Listen & Print */}
        <div className="flex items-center space-x-2 shrink-0 print:hidden">
          <button
            type="button"
            id="report-voice-button"
            onClick={handleToggleVoice}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              isSpeaking
                ? 'bg-[#BA1A1A] text-white animate-pulse ring-2 ring-red-400'
                : 'bg-[#EFEFE9] text-[#223030] hover:bg-[#E8D9CD] border border-[#BBA58F]/40'
            }`}
            title={isSpeaking ? 'Stop speech playback immediately' : 'Read summary aloud in selected language'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span>🔇 {t('reports.stopListening', 'Stop Audio')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#523D35]" />
                <span>🔊 {t('reports.listen', 'Listen to Report')}</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="report-print-button"
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#223030] text-white hover:bg-[#223030]/90 transition-all shadow-xs cursor-pointer"
            title="Print or export as PDF"
          >
            <Printer className="w-4 h-4 text-[#E8D9CD]" />
            <span>{t('reports.print', 'Print / Save Report')}</span>
          </button>
        </div>
      </div>

      {/* 2. Medical Disclaimer & Source Notice Banner */}
      <div className="bg-[#E8D9CD]/35 border border-[#BBA58F]/50 rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#523D35]">
        <Info className="w-4 h-4 text-[#523D35] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#223030]">Notice: </span>
          <span>{t('reports.disclaimer', 'Nutrition tracking comparison based on your recorded activity — not a clinical medical diagnosis.')} </span>
          <span className="font-semibold text-[#523D35]">All data in this report is sourced strictly from your own activity recorded in this application.</span>
        </div>
      </div>

      {/* 3. Read-Only Pregnancy & Maternal Profile Summary Strip */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#BBA58F]/30 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
          <div className="bg-[#EFEFE9]/60 p-3 rounded-xl border border-[#BBA58F]/20">
            <span className="text-[11px] text-[#959D90] uppercase font-bold tracking-wider block">Mother</span>
            <span className="text-sm font-black text-[#223030] block mt-0.5 truncate">{userProfile.name || 'Mother'}</span>
          </div>

          <div className="bg-[#EFEFE9]/60 p-3 rounded-xl border border-[#BBA58F]/20">
            <span className="text-[11px] text-[#959D90] uppercase font-bold tracking-wider block">Pregnancy Stage</span>
            <span className="text-sm font-black text-[#223030] block mt-0.5">
              Week {userProfile.weeksPregnant || 24}
              <span className="text-xs font-medium text-[#523D35] ml-1">({selectedTrimester || '2nd Trimester'})</span>
            </span>
          </div>

          <div className="bg-[#EFEFE9]/60 p-3 rounded-xl border border-[#BBA58F]/20">
            <span className="text-[11px] text-[#959D90] uppercase font-bold tracking-wider block">Diet Preference</span>
            <span className="text-sm font-bold text-[#223030] block mt-0.5 capitalize">
              {userProfile.dietPreference || 'Vegetarian'}
            </span>
          </div>

          <div className="bg-[#EFEFE9]/60 p-3 rounded-xl border border-[#BBA58F]/20">
            <span className="text-[11px] text-[#959D90] uppercase font-bold tracking-wider block">Profile Location</span>
            <span className="text-xs font-semibold text-[#223030] block mt-0.5 truncate" title={locationString || 'Karnataka, India'}>
              {locationString || 'Karnataka, India'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Report Type & Period Navigator */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#BBA58F]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        {/* Switcher: Weekly / Monthly / Custom */}
        <div className="inline-flex p-1 bg-[#EFEFE9] rounded-xl border border-[#BBA58F]/30 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setReportType('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'weekly'
                ? 'bg-[#FFFFFF] text-[#223030] shadow-xs'
                : 'text-[#523D35] hover:text-[#223030]'
            }`}
          >
            📅 {t('reports.weekly', 'Weekly Report')}
          </button>
          <button
            type="button"
            onClick={() => setReportType('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'monthly'
                ? 'bg-[#FFFFFF] text-[#223030] shadow-xs'
                : 'text-[#523D35] hover:text-[#223030]'
            }`}
          >
            📅 {t('reports.monthly', 'Monthly Report')}
          </button>
          <button
            type="button"
            onClick={() => setReportType('custom')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === 'custom'
                ? 'bg-[#FFFFFF] text-[#223030] shadow-xs'
                : 'text-[#523D35] hover:text-[#223030]'
            }`}
          >
            📅 {t('reports.custom', 'Custom Range')}
          </button>
        </div>

        {/* Period Navigation Controls */}
        <div className="flex items-center space-x-2">
          {reportType === 'weekly' && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg bg-[#EFEFE9] hover:bg-[#E8D9CD] text-[#223030] border border-[#BBA58F]/30 cursor-pointer"
                title="Previous Week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  weekOffset === 0
                    ? 'bg-[#E8D9CD] text-[#223030] font-bold'
                    : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#E8D9CD]/60'
                } cursor-pointer`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                disabled={weekOffset >= 0}
                className={`p-1.5 rounded-lg border border-[#BBA58F]/30 ${
                  weekOffset >= 0
                    ? 'opacity-40 cursor-not-allowed bg-[#EFEFE9] text-gray-400'
                    : 'bg-[#EFEFE9] hover:bg-[#E8D9CD] text-[#223030] cursor-pointer'
                }`}
                title="Next Week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg bg-[#EFEFE9] hover:bg-[#E8D9CD] text-[#223030] border border-[#BBA58F]/30 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMonthOffset(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  monthOffset === 0
                    ? 'bg-[#E8D9CD] text-[#223030] font-bold'
                    : 'bg-[#EFEFE9] text-[#523D35] hover:bg-[#E8D9CD]/60'
                } cursor-pointer`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setMonthOffset((prev) => prev + 1)}
                disabled={monthOffset >= 0}
                className={`p-1.5 rounded-lg border border-[#BBA58F]/30 ${
                  monthOffset >= 0
                    ? 'opacity-40 cursor-not-allowed bg-[#EFEFE9] text-gray-400'
                    : 'bg-[#EFEFE9] hover:bg-[#E8D9CD] text-[#223030] cursor-pointer'
                }`}
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {reportType === 'custom' && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <label className="flex items-center gap-1 text-[#523D35]">
                From:
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-[#EFEFE9] border border-[#BBA58F]/40 rounded-lg px-2 py-1 text-xs text-[#223030] font-medium"
                />
              </label>
              <label className="flex items-center gap-1 text-[#523D35]">
                To:
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-[#EFEFE9] border border-[#BBA58F]/40 rounded-lg px-2 py-1 text-xs text-[#223030] font-medium"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 5. Main Content: Empty State vs. Populated Data Report */}
      {!hasActivity ? (
        /* Empty Report State */
        <div className="bg-[#FFFFFF] rounded-2xl p-10 border border-[#BBA58F]/40 shadow-xs text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#EFEFE9] rounded-2xl flex items-center justify-center mx-auto text-[#523D35]">
            <Utensils className="w-8 h-8 text-[#959D90]" />
          </div>

          <h2 className="text-xl font-black text-[#223030]">
            <DualText textKey="reports.noActivityTitle" fallback="No activity recorded yet" />
          </h2>

          <p className="text-sm text-[#523D35] max-w-md mx-auto leading-relaxed">
            <DualText
              textKey="reports.noActivityDesc"
              fallback="Start logging your meals and water intake to generate your personal nutrition report."
            />
          </p>

          <p className="text-xs text-[#959D90] italic">
            Reports in PregNutri AI use strictly your actual logged activity. No generic or fake numbers are ever generated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigateTab('meal-planner')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EFEFE9] text-[#223030] hover:bg-[#E8D9CD] font-bold text-xs sm:text-sm border border-[#BBA58F]/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📅</span>
              <span>{t('reports.goToMealPlanner', 'Go to Meal Planner')}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('food-scanner')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#223030] text-white hover:bg-[#223030]/90 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📷</span>
              <span>{t('reports.logMeal', "Log Today's Meal")}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Populated Authentic User Report */
        <div className="space-y-6">
          {/* Honest Coverage Indicator */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#BBA58F]/40 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8D9CD] flex items-center justify-center text-[#223030] font-black shrink-0">
                {recordedDaysCount}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#223030]">
                  Your report is based on {recordedDaysCount} day{recordedDaysCount === 1 ? '' : 's'} of recorded activity
                </h3>
                <p className="text-xs text-[#523D35]">
                  {recordedDaysCount === totalDaysInPeriod
                    ? 'Activity was logged for all days in this selected period.'
                    : `Activity logged on ${recordedDaysCount} of ${totalDaysInPeriod} days. Unrecorded days are not estimated or faked.`}
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EFEFE9] text-[#523D35] border border-[#BBA58F]/30">
              {recordedDaysCount} / {totalDaysInPeriod} Days Tracked
            </div>
          </div>

          {/* Core Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Meals Logged */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#BBA58F]/30 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#959D90] block">Meals Logged</span>
              <span className="text-2xl font-black text-[#223030] block mt-1">{periodMeals.length}</span>
              <span className="text-[11px] text-[#523D35] mt-0.5 block font-medium">
                {recordedDaysCount > 0 ? `${(periodMeals.length / recordedDaysCount).toFixed(1)} / active day` : '0 meals'}
              </span>
            </div>

            {/* Average Calories */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#BBA58F]/30 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#959D90] block">Daily Calories</span>
              <span className="text-2xl font-black text-[#223030] block mt-1">
                {nutritionStats ? nutritionStats.avgCalories : '—'}
              </span>
              <span className="text-[11px] text-[#523D35] mt-0.5 block font-medium">
                {nutritionStats ? 'kcal / active day' : 'No meal logs'}
              </span>
            </div>

            {/* Average Protein */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#BBA58F]/30 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#959D90] block">Daily Protein</span>
              <span className="text-2xl font-black text-[#223030] block mt-1">
                {nutritionStats ? `${nutritionStats.avgProtein}g` : '—'}
              </span>
              <span className="text-[11px] text-[#523D35] mt-0.5 block font-medium">
                {nutritionStats ? 'per active day' : 'No meal logs'}
              </span>
            </div>

            {/* Average Water */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#BBA58F]/30 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#959D90] block">Daily Water</span>
              <span className="text-2xl font-black text-[#223030] block mt-1">
                {waterStats ? `${waterStats.avgL} L` : '—'}
              </span>
              <span className="text-[11px] text-[#523D35] mt-0.5 block font-medium">
                {waterStats ? `${waterStats.recordedDays} days logged` : 'No water logs'}
              </span>
            </div>

            {/* Diet Pattern */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#BBA58F]/30 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#959D90] block">Diet Pattern</span>
              <span className="text-2xl font-black text-[#223030] block mt-1">
                {periodMeals.length > 0 ? `${vegNonVegDistribution.vegCount}V / ${vegNonVegDistribution.nonVegCount}NV` : '—'}
              </span>
              <span className="text-[11px] text-[#523D35] mt-0.5 block font-medium">
                {periodMeals.length > 0 ? `${vegNonVegDistribution.vegCount} Veg, ${vegNonVegDistribution.nonVegCount} Non-Veg` : 'No meals recorded'}
              </span>
            </div>

            {/* Weight Status */}
            <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#BBA58F]/30 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#959D90] block">Weight Entries</span>
              <span className="text-2xl font-black text-[#223030] block mt-1">
                {periodWeightRecords.length > 0 ? `${periodWeightRecords[periodWeightRecords.length - 1].weightKg} kg` : '—'}
              </span>
              <span className="text-[11px] text-[#523D35] mt-0.5 block font-medium">
                {periodWeightRecords.length > 0 ? `${periodWeightRecords.length} log in period` : 'No weight data'}
              </span>
            </div>
          </div>

          {/* 6. Nutrition Breakdown & Target Comparison */}
          {nutritionStats && (
            <div className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 border border-[#BBA58F]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#223030] flex items-center gap-2">
                    <Apple className="w-5 h-5 text-[#523D35]" />
                    Average Daily Nutrient Intake (Recorded Days Only)
                  </h3>
                  <p className="text-xs text-[#959D90] mt-0.5">
                    Calculated strictly from meals logged on the {recordedDaysCount} active recording days.
                  </p>
                </div>

                <span className="text-[11px] bg-[#EFEFE9] text-[#523D35] px-2.5 py-1 rounded-md font-semibold border border-[#BBA58F]/20">
                  Target: ICMR Guidelines for Pregnancy
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                {/* Calories */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Calories</span>
                    <span className="text-[10px] text-[#959D90]">RDA ~2,300</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgCalories} kcal</div>
                  <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#523D35] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((nutritionStats.avgCalories / 2300) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Protein */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Protein</span>
                    <span className="text-[10px] text-[#959D90]">RDA ~65-70g</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgProtein} g</div>
                  <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#523D35] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((nutritionStats.avgProtein / 68) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Iron */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Iron</span>
                    <span className="text-[10px] text-[#959D90]">RDA ~27mg</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgIron} mg</div>
                  <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#523D35] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((nutritionStats.avgIron / 27) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Calcium */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Calcium</span>
                    <span className="text-[10px] text-[#959D90]">RDA ~1,000mg</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgCalcium} mg</div>
                  <div className="w-full bg-[#BBA58F]/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#523D35] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((nutritionStats.avgCalcium / 1000) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Carbohydrates */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Carbohydrates</span>
                    <span className="text-[10px] text-[#959D90]">Energy</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgCarbs} g</div>
                </div>

                {/* Healthy Fats */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Fats</span>
                    <span className="text-[10px] text-[#959D90]">Lipids</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgFat} g</div>
                </div>

                {/* Dietary Fibre */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Dietary Fibre</span>
                    <span className="text-[10px] text-[#959D90]">Digestion</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgFiber} g</div>
                </div>

                {/* Folate */}
                <div className="p-3.5 bg-[#EFEFE9]/50 rounded-xl border border-[#BBA58F]/20">
                  <div className="flex justify-between items-center text-xs text-[#523D35] font-semibold">
                    <span>Folate</span>
                    <span className="text-[10px] text-[#959D90]">RDA ~570mcg</span>
                  </div>
                  <div className="text-xl font-black text-[#223030] mt-1">{nutritionStats.avgFolate} mcg</div>
                </div>
              </div>
            </div>
          )}

          {/* 7. Meal Distribution & Food Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meal Type Breakdown */}
            <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#523D35]" />
                Meal Distribution (Total: {periodMeals.length})
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
                  <span className="text-[#959D90] font-medium block">Breakfasts</span>
                  <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Breakfast}</span>
                </div>
                <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
                  <span className="text-[#959D90] font-medium block">Lunches</span>
                  <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Lunch}</span>
                </div>
                <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
                  <span className="text-[#959D90] font-medium block">Dinners</span>
                  <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Dinner}</span>
                </div>
                <div className="p-3 bg-[#EFEFE9]/60 rounded-xl">
                  <span className="text-[#959D90] font-medium block">Snacks</span>
                  <span className="text-lg font-black text-[#223030] mt-0.5 block">{mealTypeCounts.Snack}</span>
                </div>
              </div>

              {/* Proportional breakdown bar */}
              {periodMeals.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full h-3 bg-[#EFEFE9] rounded-full overflow-hidden flex">
                    {mealTypeCounts.Breakfast > 0 && (
                      <div
                        className="bg-[#523D35] h-full"
                        style={{ width: `${(mealTypeCounts.Breakfast / periodMeals.length) * 100}%` }}
                        title={`Breakfast: ${mealTypeCounts.Breakfast}`}
                      />
                    )}
                    {mealTypeCounts.Lunch > 0 && (
                      <div
                        className="bg-[#959D90] h-full"
                        style={{ width: `${(mealTypeCounts.Lunch / periodMeals.length) * 100}%` }}
                        title={`Lunch: ${mealTypeCounts.Lunch}`}
                      />
                    )}
                    {mealTypeCounts.Dinner > 0 && (
                      <div
                        className="bg-[#223030] h-full"
                        style={{ width: `${(mealTypeCounts.Dinner / periodMeals.length) * 100}%` }}
                        title={`Dinner: ${mealTypeCounts.Dinner}`}
                      />
                    )}
                    {mealTypeCounts.Snack > 0 && (
                      <div
                        className="bg-[#BBA58F] h-full"
                        style={{ width: `${(mealTypeCounts.Snack / periodMeals.length) * 100}%` }}
                        title={`Snack: ${mealTypeCounts.Snack}`}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#959D90] font-medium">
                    <span>Breakfast</span>
                    <span>Lunch</span>
                    <span>Dinner</span>
                    <span>Snacks</span>
                  </div>
                </div>
              )}
            </div>

            {/* Most Frequently Consumed Foods */}
            <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#523D35]" />
                Most Frequently Consumed Foods
              </h3>

              {topFoodsList.length === 0 ? (
                <div className="text-xs text-[#959D90] italic py-6 text-center">
                  No individual food records found in logged meals.
                </div>
              ) : (
                <div className="space-y-2">
                  {topFoodsList.map(([name, count], idx) => (
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
                        {count} time{count === 1 ? '' : 's'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. Daily Trends Visualizer (when >= 2 days of records exist) */}
          {recordedDaysCount >= 2 ? (
            <div className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 border border-[#BBA58F]/40 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#223030] flex items-center gap-2">
                    <FileBarChart2 className="w-5 h-5 text-[#523D35]" />
                    Daily Activity Trends
                  </h3>
                  <p className="text-xs text-[#959D90] mt-0.5">
                    {trendMetric === 'calories'
                      ? 'Comparing daily recorded calories across the selected period. Unlogged days clearly show "--".'
                      : 'Comparing daily recorded hydration (water in ml) across the selected period. Unlogged days clearly show "--".'}
                  </p>
                </div>

                {/* Trend Metric Toggle */}
                <div className="inline-flex p-1 bg-[#EFEFE9] rounded-xl border border-[#BBA58F]/30 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setTrendMetric('calories')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      trendMetric === 'calories'
                        ? 'bg-[#FFFFFF] text-[#223030] shadow-xs'
                        : 'text-[#523D35] hover:text-[#223030]'
                    }`}
                  >
                    🔥 Calories
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendMetric('water')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      trendMetric === 'water'
                        ? 'bg-[#FFFFFF] text-[#223030] shadow-xs'
                        : 'text-[#523D35] hover:text-[#223030]'
                    }`}
                  >
                    💧 Water (ml)
                  </button>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="pt-3 overflow-x-auto no-scrollbar">
                <div className="min-w-[420px] flex items-end justify-between gap-2 h-44 border-b border-[#BBA58F]/30 pb-2">
                  {periodDaysList.map((dayStr) => {
                    const dayMeals = periodMeals.filter((m) => m.date === dayStr);
                    const dayCal = dayMeals.reduce((acc, m) => acc + (m.nutrients.calories || 0), 0);
                    const dayWater = dailyWaterLogs[dayStr] || 0;

                    const dateObj = new Date(dayStr + 'T00:00:00');
                    const dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                    const dateNum = dateObj.getDate();

                    if (trendMetric === 'calories') {
                      const hasMeals = dayMeals.length > 0;
                      const maxCal = 2800;
                      const barHeightPct = hasMeals ? Math.min(100, Math.max(15, Math.round((dayCal / maxCal) * 100))) : 0;

                      return (
                        <div key={dayStr} className="flex-1 flex flex-col items-center justify-end h-full group">
                          {hasMeals ? (
                            <div className="w-full flex flex-col items-center">
                              <span className="text-[10px] font-bold text-[#223030] mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {dayCal} kcal
                              </span>
                              <div
                                className="w-full max-w-[36px] bg-[#523D35] hover:bg-[#223030] rounded-t-lg transition-all"
                                style={{ height: `${barHeightPct}%` }}
                              />
                            </div>
                          ) : (
                            <div className="w-full max-w-[36px] h-6 border-2 border-dashed border-[#959D90]/40 rounded-t-lg flex items-center justify-center">
                              <span className="text-[8px] text-[#959D90]">--</span>
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-[#223030] mt-2 block">{dayLabel}</span>
                          <span className="text-[9px] text-[#959D90] block">{dateNum}</span>
                        </div>
                      );
                    } else {
                      const hasWater = typeof dailyWaterLogs[dayStr] === 'number' && dailyWaterLogs[dayStr] > 0;
                      const maxWater = 3000;
                      const barHeightPct = hasWater ? Math.min(100, Math.max(15, Math.round((dayWater / maxWater) * 100))) : 0;

                      return (
                        <div key={dayStr} className="flex-1 flex flex-col items-center justify-end h-full group">
                          {hasWater ? (
                            <div className="w-full flex flex-col items-center">
                              <span className="text-[10px] font-bold text-[#223030] mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {(dayWater / 1000).toFixed(1)}L
                              </span>
                              <div
                                className="w-full max-w-[36px] bg-[#959D90] hover:bg-[#223030] rounded-t-lg transition-all"
                                style={{ height: `${barHeightPct}%` }}
                              />
                            </div>
                          ) : (
                            <div className="w-full max-w-[36px] h-6 border-2 border-dashed border-[#959D90]/40 rounded-t-lg flex items-center justify-center">
                              <span className="text-[8px] text-[#959D90]">--</span>
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-[#223030] mt-2 block">{dayLabel}</span>
                          <span className="text-[9px] text-[#959D90] block">{dateNum}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#EFEFE9]/60 rounded-2xl p-4 border border-[#BBA58F]/30 text-center text-xs text-[#523D35]">
              💡 Log meals or water on 2 or more days in this period to unlock daily comparative trend charts.
            </div>
          )}

          {/* Regional Foods & Food Categories Breakdown */}
          {(regionalFoodsList.length > 0 || categoryDistribution.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Regional Foods Recorded */}
              {regionalFoodsList.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                    <span>🌾</span>
                    Regional & Traditional Foods Recorded
                  </h3>
                  <p className="text-xs text-[#959D90]">
                    Staple dishes identified from your actual recorded meals.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {regionalFoodsList.map(([name, count]) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFEFE9] text-[#223030] border border-[#BBA58F]/30"
                      >
                        <span>{name}</span>
                        <span className="w-4 h-4 rounded-full bg-[#E8D9CD] text-[10px] font-bold text-[#523D35] flex items-center justify-center">
                          {count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Category Distribution */}
              {categoryDistribution.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                    <span>🥗</span>
                    Food Category Distribution
                  </h3>
                  <p className="text-xs text-[#959D90]">
                    Breakdown of ingredient groups across your logged meal items.
                  </p>
                  <div className="space-y-2 pt-1">
                    {categoryDistribution.slice(0, 5).map(([cat, count]) => (
                      <div key={cat} className="flex items-center justify-between text-xs p-2 bg-[#EFEFE9]/40 rounded-lg">
                        <span className="font-semibold text-[#223030]">{cat}</span>
                        <span className="text-[#523D35] font-bold">{count} item{count === 1 ? '' : 's'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. Water Intake & Weight Activity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Water Log Detail */}
            <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#523D35]" />
                Hydration Summary
              </h3>

              {waterStats ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#EFEFE9]/50 rounded-xl text-xs">
                    <span className="text-[#523D35] font-semibold">Average Intake on Logged Days:</span>
                    <span className="text-base font-black text-[#223030]">{waterStats.avgL} Litres</span>
                  </div>

                  <p className="text-xs text-[#523D35] leading-relaxed">
                    Hydration data recorded on {waterStats.recordedDays} day{waterStats.recordedDays === 1 ? '' : 's'}. Target during pregnancy is ~2.5 to 3.0 Litres of safe fluids daily.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-[#959D90] italic py-4 text-center">
                  {t('reports.noWater', 'No water intake data recorded in this period.')}
                </div>
              )}
            </div>

            {/* Maternal Weight Activity */}
            <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#BBA58F]/40 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#223030] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#523D35]" />
                Weight Record Activity
              </h3>

              {periodWeightRecords.length > 0 ? (
                <div className="space-y-2">
                  {periodWeightRecords.map((w, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#EFEFE9]/50 rounded-xl text-xs border border-[#BBA58F]/20"
                    >
                      <div>
                        <span className="font-bold text-[#223030]">Week {w.week}</span>
                        <span className="text-[#959D90] ml-2">({w.date})</span>
                      </div>
                      <span className="text-sm font-black text-[#223030]">{w.weightKg} kg</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#959D90] italic py-4 text-center">
                  {t('reports.noWeight', 'No weight data recorded in this period.')}
                </div>
              )}
            </div>
          </div>

          {/* 10. Traceable Data Notice Footnote */}
          <div className="bg-[#EFEFE9]/70 rounded-xl p-4 border border-[#BBA58F]/30 text-xs text-[#523D35] space-y-1">
            <p className="font-bold text-[#223030]">
              Traceable Data Notice:
            </p>
            <p>
              All metrics in this report are calculated exclusively from your logged meals, water logs, and pregnancy profile records inside PregNutri AI. Unrecorded days or missing values are never filled with simulated or artificial numbers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
