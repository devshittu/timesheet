import { endOfMonth, isWeekend, subDays, format } from 'date-fns';

/**
 * Get the last N working days (Mon-Fri) of a given month
 * @param date - Any date within the target month
 * @param count - Number of working days to retrieve (default: 5)
 * @returns Array of working day dates, ordered from most recent to oldest
 */
export const getLastWorkingDaysOfMonth = (
  date: Date,
  count: number = 5,
): Date[] => {
  const monthEnd = endOfMonth(date);
  const workingDays: Date[] = [];
  let currentDay = monthEnd;

  // Walk backwards from the end of the month
  while (
    workingDays.length < count &&
    currentDay.getMonth() === monthEnd.getMonth()
  ) {
    if (!isWeekend(currentDay)) {
      workingDays.push(new Date(currentDay));
    }
    currentDay = subDays(currentDay, 1);
  }

  return workingDays;
};

/**
 * Get a specific working day from the end of the month
 * @param date - Any date within the target month
 * @param offset - 0 = last working day, 1 = 2nd-to-last, 2 = 3rd-to-last, etc.
 * @returns The working day date or null if not found
 */
export const getWorkingDayFromEnd = (
  date: Date,
  offset: number = 0,
): Date | null => {
  const workingDays = getLastWorkingDaysOfMonth(date, offset + 1);
  return workingDays[offset] || null;
};

/**
 * Format a payroll deadline date for display
 * @param date - The deadline date
 * @returns Formatted string like "Thursday, October 30th"
 */
export const formatPayrollDeadline = (date: Date): string => {
  return format(date, 'EEEE, MMMM do');
};

/**
 * Format full payroll deadline with time
 * @param date - The deadline date
 * @param year - The year
 * @returns Formatted string like "10.00am Thursday 30th of October, 2025"
 */
export const formatFullPayrollDeadline = (date: Date, year: number): string => {
  const dayName = format(date, 'EEEE');
  const day = format(date, 'do');
  const month = format(date, 'MMMM');
  return `10.00am ${dayName} ${day} of ${month}, ${year}`;
};
