// src/utils/dateUtils.ts
import {
  addDays,
  addWeeks,
  format,
  parseISO,
  startOfWeek,
  isBefore,
  isAfter,
  isValid,
  getISOWeekYear,
  getISOWeek,
} from 'date-fns';

// Options for consistent week start (Monday)
const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

export const getWeekStartDate = (date: string | Date): Date => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const weekStart = startOfWeek(parsedDate, WEEK_OPTIONS);
  return isValid(weekStart) ? weekStart : startOfWeek(new Date(), WEEK_OPTIONS);
};

export const formatWeek = (date: string | Date): string => {
  const start = getWeekStartDate(date);
  return isValid(start)
    ? format(start, 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');
};

export const formatWeekForInput = (date: string | Date): string => {
  const start = getWeekStartDate(date);
  if (!isValid(start)) {
    const now = new Date();
    return `${getISOWeekYear(now)}-W${getISOWeek(now).toString().padStart(2, '0')}`;
  }
  const isoYear = getISOWeekYear(start);
  const isoWeek = getISOWeek(start);
  return `${isoYear}-W${isoWeek.toString().padStart(2, '0')}`;
};

export const parseWeekFromInput = (weekString: string): Date => {
  if (!weekString || !/^\d{4}-W\d{1,}$/.test(weekString)) {
    return getWeekStartDate(new Date()); // Fallback
  }
  const [yearStr, weekStr] = weekString.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  // Find January 4 of Y
  const jan4 = new Date(year, 0, 4);
  // Find the start of the week containing Jan 4, which is always week 1
  const startOfWeek1 = startOfWeek(jan4, { weekStartsOn: 1 });
  // Add (week - 1) * 7 days
  const targetDate = addDays(startOfWeek1, (week - 1) * 7);
  return targetDate;
};

export const getNextWeek = (date: string | Date): string => {
  const start = getWeekStartDate(date);
  return format(addWeeks(start, 1), 'yyyy-MM-dd');
};

export const getPreviousWeek = (date: string | Date): string => {
  const start = getWeekStartDate(date);
  return format(addWeeks(start, -1), 'yyyy-MM-dd');
};

export const isDateWithinBounds = (
  date: string | Date,
  earliestDate: string,
  latestDate: string,
): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const earliest = parseISO(earliestDate);
  const latest = parseISO(latestDate);
  return (
    isValid(parsedDate) &&
    !isBefore(parsedDate, earliest) &&
    !isAfter(parsedDate, latest)
  );
};
// src/utils/dateUtils.ts
