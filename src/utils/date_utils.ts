import { DayOfWeek } from '../context/AppContext';
import { PregnancyTrimester } from '../types';

/**
 * Standard Date and Time utility ensuring robust timezone handling.
 * Locked to India Standard Time ('Asia/Kolkata') as required for Indian Maternal Healthcare.
 */
export function getUserTimeZone(): string {
  return 'Asia/Kolkata';
}

/**
 * Returns India runtime date parts (year, month, day, weekday, hour, minute, dateStr, timeStr)
 */
export function getIndiaDate(dateInput?: Date | string | number): {
  year: number;
  month: number;
  day: number;
  dayOfWeek: DayOfWeek;
  dateStr: string;
  timeStr: string;
  hour: number;
} {
  const d = dateInput
    ? typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput
    : new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const year = parseInt(map.year, 10);
  const month = parseInt(map.month, 10);
  const day = parseInt(map.day, 10);
  const dayOfWeek = (map.weekday as DayOfWeek) || 'Monday';
  const hour = parseInt(map.hour, 10) || 0;
  const minute = parseInt(map.minute, 10) || 0;
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const timeStr = `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;

  return { year, month, day, dayOfWeek, dateStr, timeStr, hour };
}

/**
 * Formats a Date or timestamp as YYYY-MM-DD in the user's local timezone.
 */
export function getLocalDateString(dateInput?: Date | number | string, timeZone?: string): string {
  const tz = timeZone || getUserTimeZone();
  const d = dateInput
    ? typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput
    : new Date();

  if (isNaN(d.getTime())) {
    return getLocalTodayDateString(tz);
  }

  try {
    // 'en-CA' outputs standard ISO format: YYYY-MM-DD
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(d);
  } catch (e) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

/**
 * Returns today's local date string (YYYY-MM-DD)
 */
export function getLocalTodayDateString(timeZone?: string): string {
  const tz = timeZone || getUserTimeZone();
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch (e) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

/**
 * Returns the current day of the week in the user's local timezone
 */
export function getLocalDayOfWeek(dateInput?: Date | number | string, timeZone?: string): DayOfWeek {
  const tz = timeZone || getUserTimeZone();
  const d = dateInput
    ? typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput
    : new Date();

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'long'
    });
    return (formatter.format(d) as DayOfWeek) || 'Monday';
  } catch (e) {
    const dayMap: Record<number, DayOfWeek> = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    };
    return dayMap[d.getDay()] || 'Monday';
  }
}

/**
 * Returns formatted 12-hour time string in user's timezone (e.g. "8:15 AM")
 */
export function getLocalTimeString(dateInput?: Date | number | string, timeZone?: string): string {
  const tz = timeZone || getUserTimeZone();
  const d = dateInput
    ? typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput
    : new Date();

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch (e) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Returns the local hour of the day (0-23)
 */
export function getLocalHour(timeZone?: string): number {
  const tz = timeZone || getUserTimeZone();
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const h = parts.find((p) => p.type === 'hour');
    return h ? parseInt(h.value, 10) : new Date().getHours();
  } catch (e) {
    return new Date().getHours();
  }
}

/**
 * Determines greeting translation key based on local hour
 * Morning: 5:00 - 11:59
 * Afternoon: 12:00 - 16:59
 * Evening: 17:00 - 21:59
 * Night: 22:00 - 4:59
 */
export function getTimeGreetingKey(
  hour: number
): 'greeting.morning' | 'greeting.afternoon' | 'greeting.evening' | 'greeting.night' {
  if (hour >= 5 && hour < 12) return 'greeting.morning';
  if (hour >= 12 && hour < 17) return 'greeting.afternoon';
  if (hour >= 17 && hour < 22) return 'greeting.evening';
  return 'greeting.night';
}

/**
 * Formats a date for human display in user's locale (e.g., "Saturday, 10 October 2026")
 */
export function formatDisplayDate(dateInput?: Date | number | string, locale = 'en-IN', timeZone?: string): string {
  const tz = timeZone || getUserTimeZone();
  const d = dateInput
    ? typeof dateInput === 'string' || typeof dateInput === 'number'
      ? new Date(dateInput)
      : dateInput
    : new Date();

  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return d.toDateString();
  }
}

/**
 * Calculates next water reminder time based on real schedule settings.
 */
export function calculateNextWaterReminder(
  settings: {
    enabled: boolean;
    intervalMinutes: number;
    scheduleType?: '1hour' | '2hours' | '3hours' | 'custom';
    customMinutes?: number;
  },
  lastReminderTimestamp?: number,
  timeZone?: string
): { isEnabled: boolean; nextReminderTime: string; isPast: boolean } {
  if (!settings.enabled) {
    return {
      isEnabled: false,
      nextReminderTime: 'Disabled',
      isPast: false
    };
  }

  const intervalMin = Math.max(15, settings.intervalMinutes || 60);
  const intervalMs = intervalMin * 60 * 1000;
  const now = Date.now();
  const baseTime = lastReminderTimestamp && lastReminderTimestamp <= now ? lastReminderTimestamp : now;
  const targetTime = baseTime + intervalMs;

  const nextDate = new Date(targetTime);
  const timeFormatted = getLocalTimeString(nextDate, timeZone);

  return {
    isEnabled: true,
    nextReminderTime: timeFormatted,
    isPast: targetTime < now
  };
}

/**
 * Pregnancy progression calculator.
 * If user has an estimated due date, computes weeks pregnant from due date (280 days gestation).
 * If no due date is provided, uses the saved weeksPregnant from the profile without fabricating a due date.
 */
export function calculatePregnancyProgression(
  savedWeeks: number,
  dueDateStr?: string
): { weeksPregnant: number; trimester: PregnancyTrimester; isCalculatedFromDueDate: boolean } {
  if (dueDateStr) {
    const due = new Date(dueDateStr);
    if (!isNaN(due.getTime())) {
      const now = new Date();
      // Difference in full days
      const msDiff = due.getTime() - now.getTime();
      const daysRemaining = Math.round(msDiff / (1000 * 60 * 60 * 24));
      // Full gestation = 280 days (40 weeks)
      const calculatedWeeks = Math.max(1, Math.min(42, Math.floor((280 - daysRemaining) / 7)));
      const trimester: PregnancyTrimester =
        calculatedWeeks <= 12 ? '1st Trimester' : calculatedWeeks <= 27 ? '2nd Trimester' : '3rd Trimester';

      return {
        weeksPregnant: calculatedWeeks,
        trimester,
        isCalculatedFromDueDate: true
      };
    }
  }

  const safeWeeks = Math.max(1, Math.min(42, savedWeeks || 20));
  const trimester: PregnancyTrimester =
    safeWeeks <= 12 ? '1st Trimester' : safeWeeks <= 27 ? '2nd Trimester' : '3rd Trimester';

  return {
    weeksPregnant: safeWeeks,
    trimester,
    isCalculatedFromDueDate: false
  };
}

/**
 * Returns the exact YYYY-MM-DD date for a given DayOfWeek within the current calendar week (Monday - Sunday).
 * Uses India Standard Time (Asia/Kolkata) without device-timezone drift.
 */
export function getDateForDayOfWeekInCurrentWeek(
  targetDay: DayOfWeek,
  refDate?: Date | string | number,
  timeZone: string = 'Asia/Kolkata'
): string {
  const indiaNow = getIndiaDate(refDate);
  // Construct UTC baseline from India's year, month, day to do date arithmetic free of device DST/timezone jumps
  const base = new Date(Date.UTC(indiaNow.year, indiaNow.month - 1, indiaNow.day));

  const dayIndexMap: Record<DayOfWeek, number> = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
  };

  const currentMondayOffset = dayIndexMap[indiaNow.dayOfWeek] ?? 0;
  base.setUTCDate(base.getUTCDate() - currentMondayOffset);

  const targetOffset = dayIndexMap[targetDay] ?? 0;
  base.setUTCDate(base.getUTCDate() + targetOffset);

  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, '0');
  const d = String(base.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats a date string or Date object in user's selected language using Asia/Kolkata locale rules.
 */
export function formatLocalizedDate(
  dateInput: Date | string | number,
  langCode: string = 'en',
  options: { includeWeekday?: boolean; short?: boolean } = {}
): string {
  const d = typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)
    ? new Date(`${dateInput}T12:00:00+05:30`)
    : new Date(dateInput);

  const localeMap: Record<string, string> = {
    en: 'en-IN',
    kn: 'kn-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    ur: 'ur-IN',
    as: 'as-IN'
  };

  const locale = localeMap[langCode] || 'en-IN';
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'Asia/Kolkata',
      weekday: options.includeWeekday ? (options.short ? 'short' : 'long') : undefined,
      day: 'numeric',
      month: options.short ? 'short' : 'long',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return d.toDateString();
  }
}

/**
 * Formats a DayOfWeek into the user's selected language.
 */
export function formatLocalizedWeekday(
  day: DayOfWeek,
  langCode: string = 'en',
  short: boolean = false
): string {
  const map: Record<DayOfWeek, Record<string, { full: string; short: string }>> = {
    Monday: {
      en: { full: 'Monday', short: 'Mon' },
      kn: { full: 'ಸೋಮವಾರ', short: 'ಸೋಮ' },
      hi: { full: 'सोमवार', short: 'सोम' },
      ta: { full: 'திங்கட்கிழமை', short: 'திங்கள்' },
      te: { full: 'సోమవారం', short: 'సోమ' },
      ml: { full: 'തിങ്കളാഴ്ച', short: 'തിങ്കൾ' },
      mr: { full: 'सोमवार', short: 'सोम' },
      bn: { full: 'সোমবার', short: 'সোম' },
      gu: { full: 'સોમવાર', short: 'સોમ' },
      pa: { full: 'ਸੋਮਵਾਰ', short: 'ਸੋਮ' },
      or: { full: 'ସୋମବାର', short: 'ସୋମ' },
      ur: { full: 'پیر', short: 'پیر' },
      as: { full: 'সোমবাৰ', short: 'সোম' }
    },
    Tuesday: {
      en: { full: 'Tuesday', short: 'Tue' },
      kn: { full: 'ಮಂಗಳವಾರ', short: 'ಮಂಗಳ' },
      hi: { full: 'मंगलवार', short: 'मंगल' },
      ta: { full: 'செவ்வாய்க்கிழமை', short: 'செவ்வாய்' },
      te: { full: 'మంగళవారం', short: 'మంగళ' },
      ml: { full: 'ചൊവ്വാഴ്ച', short: 'ചൊവ്വ' },
      mr: { full: 'मंगळवार', short: 'मंगळ' },
      bn: { full: 'মঙ্গলবার', short: 'মঙ্গল' },
      gu: { full: 'મંગળવાર', short: 'મંગળ' },
      pa: { full: 'ਮੰਗਲਵਾਰ', short: 'ਮੰਗਲ' },
      or: { full: 'ମଙ୍ଗଳବାର', short: 'ମଙ୍ଗଳ' },
      ur: { full: 'منگل', short: 'منگل' },
      as: { full: 'মঙলবাৰ', short: 'মঙল' }
    },
    Wednesday: {
      en: { full: 'Wednesday', short: 'Wed' },
      kn: { full: 'ಬುಧವಾರ', short: 'ಬುಧ' },
      hi: { full: 'बुधवार', short: 'बुध' },
      ta: { full: 'புதன்கிழமை', short: 'புதன்' },
      te: { full: 'బుధవారం', short: 'బుధ' },
      ml: { full: 'ബുധനാഴ്ച', short: 'ബുധൻ' },
      mr: { full: 'बुधवार', short: 'बुध' },
      bn: { full: 'বুধবার', short: 'বুধ' },
      gu: { full: 'બુધવાર', short: 'બુધ' },
      pa: { full: 'ਬੁੱਧਵਾਰ', short: 'ਬੁੱਧ' },
      or: { full: 'ବୁଧବାର', short: 'ବୁଧ' },
      ur: { full: 'بدھ', short: 'بدھ' },
      as: { full: 'বুধবাৰ', short: 'বুধ' }
    },
    Thursday: {
      en: { full: 'Thursday', short: 'Thu' },
      kn: { full: 'ಗುರುವಾರ', short: 'ಗುರು' },
      hi: { full: 'गुरुवार', short: 'गुरु' },
      ta: { full: 'வியாழக்கிழமை', short: 'வியாழன்' },
      te: { full: 'గురువారం', short: 'గురు' },
      ml: { full: 'വ്യാഴാഴ്ച', short: 'വ്യാഴം' },
      mr: { full: 'गुरुवार', short: 'गुरु' },
      bn: { full: 'বৃহস্পতিবার', short: 'বৃহস্পতি' },
      gu: { full: 'ગુરુવાર', short: 'ગુરુ' },
      pa: { full: 'ਵੀਰਵਾਰ', short: 'ਵੀਰ' },
      or: { full: 'ଗୁରୁବାର', short: 'ଗୁରୁ' },
      ur: { full: 'جمعرات', short: 'جمعرات' },
      as: { full: 'বৃহস্পতিবাৰ', short: 'বৃহস্পতি' }
    },
    Friday: {
      en: { full: 'Friday', short: 'Fri' },
      kn: { full: 'ಶುಕ್ರವಾರ', short: 'ಶುಕ್ರ' },
      hi: { full: 'शुक्रवार', short: 'शुक्र' },
      ta: { full: 'வெள்ளிக்கிழமை', short: 'வெள்ளி' },
      te: { full: 'శుక్రవారం', short: 'శుక్ర' },
      ml: { full: 'വെള്ളിയാഴ്ച', short: 'വെള്ളി' },
      mr: { full: 'शुक्रवार', short: 'शुक्र' },
      bn: { full: 'শুক্রবার', short: 'শুক্র' },
      gu: { full: 'શુક્રવાર', short: 'શુક્ર' },
      pa: { full: 'ਸ਼ੁੱਕਰਵਾਰ', short: 'ਸ਼ੁੱਕਰ' },
      or: { full: 'ଶୁକ୍ରବାର', short: 'ଶੁକ୍ର' },
      ur: { full: 'جمعہ', short: 'جمعہ' },
      as: { full: 'শুক্ৰবাৰ', short: 'শুক্ৰ' }
    },
    Saturday: {
      en: { full: 'Saturday', short: 'Sat' },
      kn: { full: 'ಶನಿವಾರ', short: 'ಶನಿ' },
      hi: { full: 'शनिवार', short: 'शनि' },
      ta: { full: 'சனிக்கிழமை', short: 'சனி' },
      te: { full: 'శనివారం', short: 'శని' },
      ml: { full: 'ശനിയാഴ്ച', short: 'ശനി' },
      mr: { full: 'शनिवार', short: 'शनि' },
      bn: { full: 'শনিবার', short: 'শনি' },
      gu: { full: 'શનિવાર', short: 'શનિ' },
      pa: { full: 'ਸ਼ਨੀਵਾਰ', short: 'ਸ਼ਨੀ' },
      or: { full: 'ଶନିବାର', short: 'ଶନି' },
      ur: { full: 'ہفتہ', short: 'ہفتہ' },
      as: { full: 'শনিবাৰ', short: 'শনি' }
    },
    Sunday: {
      en: { full: 'Sunday', short: 'Sun' },
      kn: { full: 'ಭಾನುವಾರ', short: 'ಭಾನು' },
      hi: { full: 'रविवार', short: 'रवि' },
      ta: { full: 'ஞாயிற்றுக்கிழமை', short: 'ஞாயிறு' },
      te: { full: 'ఆదివారం', short: 'ఆది' },
      ml: { full: 'ഞായറാഴ്ച', short: 'ഞായർ' },
      mr: { full: 'रविवार', short: 'रवि' },
      bn: { full: 'রবিবার', short: 'রবি' },
      gu: { full: 'રવિવાર', short: 'રવિ' },
      pa: { full: 'ਐਤਵਾਰ', short: 'ਐਤ' },
      or: { full: 'ରବିବାର', short: 'ରବି' },
      ur: { full: 'اتوار', short: 'اتوار' },
      as: { full: 'দেওবাৰ', short: 'দেও' }
    }
  };

  const item = map[day]?.[langCode] || map[day]?.en || { full: day, short: day.slice(0, 3) };
  return short ? item.short : item.full;
}

/**
 * Returns the full Monday - Sunday bounds for a week offset.
 */
export function getCurrentWeekBounds(
  refDate?: Date | string | number,
  weekOffset: number = 0,
  timeZone?: string
): { startDateStr: string; endDateStr: string; daysList: string[]; label: string } {
  const tz = timeZone || getUserTimeZone();
  const d = refDate ? (typeof refDate === 'string' || typeof refDate === 'number' ? new Date(refDate) : refDate) : new Date();

  const currentDay = d.getDay();
  const currentMondayOffset = (currentDay + 6) % 7;

  const monday = new Date(d);
  monday.setDate(d.getDate() - currentMondayOffset + (weekOffset * 7));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDateStr = getLocalDateString(monday, tz);
  const endDateStr = getLocalDateString(sunday, tz);

  const daysList: string[] = [];
  const curr = new Date(monday);
  while (curr <= sunday) {
    daysList.push(getLocalDateString(curr, tz));
    curr.setDate(curr.getDate() + 1);
  }

  const label = `${monday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} – ${sunday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return {
    startDateStr,
    endDateStr,
    daysList,
    label
  };
}

/**
 * Returns the full 1st-day to last-day bounds for a month offset.
 */
export function getCurrentMonthBounds(
  refDate?: Date | string | number,
  monthOffset: number = 0,
  timeZone?: string
): { startDateStr: string; endDateStr: string; daysList: string[]; label: string } {
  const tz = timeZone || getUserTimeZone();
  const d = refDate ? (typeof refDate === 'string' || typeof refDate === 'number' ? new Date(refDate) : refDate) : new Date();

  const targetMonth = new Date(d.getFullYear(), d.getMonth() + monthOffset, 1);
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const startDateStr = getLocalDateString(start, tz);
  const endDateStr = getLocalDateString(end, tz);

  const daysList: string[] = [];
  const curr = new Date(start);
  while (curr <= end) {
    daysList.push(getLocalDateString(curr, tz));
    curr.setDate(curr.getDate() + 1);
  }

  const label = targetMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return {
    startDateStr,
    endDateStr,
    daysList,
    label
  };
}
