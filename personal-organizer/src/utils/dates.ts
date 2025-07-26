/**
 * Date utility functions for the voice-first productivity app
 * Handles formatting, relative time display, and date navigation
 */

export type DateFormat = 'short' | 'medium' | 'long' | 'full';
export type TimeFormat = '12h' | '24h';

/**
 * Format a date according to the specified format
 */
export const formatDate = (
  date: Date,
  format: DateFormat = 'medium',
  locale: string = 'en-US'
): string => {
  const optionsMap: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  };

  const options = optionsMap[format];

  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Format time according to the specified format
 */
export const formatTime = (
  date: Date,
  format: TimeFormat = '12h',
  locale: string = 'en-US'
): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h',
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Format date and time together
 */
export const formatDateTime = (
  date: Date,
  dateFormat: DateFormat = 'medium',
  timeFormat: TimeFormat = '12h',
  locale: string = 'en-US'
): string => {
  return `${formatDate(date, dateFormat, locale)} at ${formatTime(date, timeFormat, locale)}`;
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (
  date: Date,
  baseDate: Date = new Date(),
  locale: string = 'en-US'
): string => {
  const diffMs = date.getTime() - baseDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Use Intl.RelativeTimeFormat for proper localization
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSeconds) < 60) {
    return rtf.format(diffSeconds, 'second');
  } else if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, 'minute');
  } else if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour');
  } else if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffWeeks) < 4) {
    return rtf.format(diffWeeks, 'week');
  } else if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, 'month');
  } else {
    return rtf.format(diffYears, 'year');
  }
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date, baseDate: Date = new Date()): boolean => {
  return (
    date.getDate() === baseDate.getDate() &&
    date.getMonth() === baseDate.getMonth() &&
    date.getFullYear() === baseDate.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: Date, baseDate: Date = new Date()): boolean => {
  const yesterday = new Date(baseDate);
  yesterday.setDate(yesterday.getDate() - 1);
  return isToday(date, yesterday);
};

/**
 * Check if a date is tomorrow
 */
export const isTomorrow = (date: Date, baseDate: Date = new Date()): boolean => {
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isToday(date, tomorrow);
};

/**
 * Check if a date is in the current week
 */
export const isThisWeek = (date: Date, baseDate: Date = new Date()): boolean => {
  const startOfWeek = getStartOfWeek(baseDate);
  const endOfWeek = getEndOfWeek(baseDate);
  return date >= startOfWeek && date <= endOfWeek;
};

/**
 * Get the start of the week (Sunday)
 */
export const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Get the end of the week (Saturday)
 */
export const getEndOfWeek = (date: Date): Date => {
  const end = new Date(date);
  const day = end.getDay();
  const diff = end.getDate() + (6 - day);
  end.setDate(diff);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Get the start of the day
 */
export const getStartOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

/**
 * Get the end of the day
 */
export const getEndOfDay = (date: Date): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add weeks to a date
 */
export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

/**
 * Add months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is overdue (past current time)
 */
export const isOverdue = (date: Date, baseDate: Date = new Date()): boolean => {
  return date.getTime() < baseDate.getTime();
};

/**
 * Get a user-friendly date description
 */
export const getDateDescription = (
  date: Date,
  baseDate: Date = new Date(),
  locale: string = 'en-US'
): string => {
  if (isToday(date, baseDate)) {
    return 'Today';
  } else if (isYesterday(date, baseDate)) {
    return 'Yesterday';
  } else if (isTomorrow(date, baseDate)) {
    return 'Tomorrow';
  } else if (isThisWeek(date, baseDate)) {
    return formatDate(date, 'short', locale);
  } else {
    return formatDate(date, 'medium', locale);
  }
};

/**
 * Parse a date string safely
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Get timezone offset in hours
 */
export const getTimezoneOffset = (date: Date = new Date()): number => {
  return -date.getTimezoneOffset() / 60;
};

/**
 * Convert date to ISO string with timezone
 */
export const toISOStringWithTimezone = (date: Date): string => {
  const offset = getTimezoneOffset(date);
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset).toString().padStart(2, '0');
  const minutes = ((absOffset % 1) * 60).toString().padStart(2, '0');
  
  return date.toISOString().replace('Z', `${sign}${hours}:${minutes}`);
};

/**
 * Get business days between two dates (excluding weekends)
 */
export const getBusinessDaysBetween = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Check if a date falls on a weekend
 */
export const isWeekend = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};

/**
 * Get the next business day
 */
export const getNextBusinessDay = (date: Date): Date => {
  const next = new Date(date);
  do {
    next.setDate(next.getDate() + 1);
  } while (isWeekend(next));
  return next;
};

/**
 * Get the previous business day
 */
export const getPreviousBusinessDay = (date: Date): Date => {
  const prev = new Date(date);
  do {
    prev.setDate(prev.getDate() - 1);
  } while (isWeekend(prev));
  return prev;
};
