import { 
    parseISO, startOfDay, 
    addDays, startOfWeek, 
    startOfMonth, startOfQuarter, 
    startOfYear, isEqual
} from 'date-fns';
import { format as tzFormat, toZonedTime, fromZonedTime } from 'date-fns-tz';

type PeriodType = 'day' | 'week' | 'month' | 'quarter' | 'year';

/**
 * Get the user's local timezone.
 */
export const getLocalTimeZone = (): string => 
    Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Convert a UTC date to a date in the specified timezone.
 * @param date - The Date object to convert.
 * @param timeZone - The timezone identifier.
 */
export const toZoned = (date: Date, timeZone?: string): Date => 
    toZonedTime(date, timeZone || getLocalTimeZone());

/**
 * Convert a zoned date back to UTC.
 * @param date - The Date object to convert.
 * @param timeZone - The timezone identifier of the input date.
 */
export const fromZoned = (date: Date, timeZone?: string): Date => 
    fromZonedTime(date, timeZone || getLocalTimeZone());

/**
 * Parse a date string in ISO format to a Date object.
 * @param dateString - The date string to parse.
 * @param timeZone - Optional timezone to convert the parsed date to.
 */
export const parseDate = (dateString: string, timeZone?: string): Date => 
    timeZone ? toZoned(parseISO(dateString), timeZone) : parseISO(dateString);

/**
 * Format a Date object to a string in the specified format and timezone.
 * @param date - The Date object to format.
 * @param format - The format string (default: 'yyyy-MM-dd').
 * @param timeZone - The timezone identifier (e.g., 'America/New_York').
 */
export const formatDate = (
    date: Date,
    format: string = 'yyyy-MM-dd',
    timeZone?: string
): string => tzFormat(date, format, { timeZone: timeZone || getLocalTimeZone() });

/**
 * Get the start of a period (day, week, month, quarter, year) in the specified timezone.
 * @param date - The reference date.
 * @param period - The period type ('day' | 'week' | 'month' | 'quarter' | 'year').
 * @param timeZone - The timezone identifier.
 */
export const startOfPeriod = (date: Date, period: PeriodType, timeZone?: string): Date => {
    const zonedDate = toZoned(date, timeZone);
    const periodStarts = {
        day: startOfDay,
        week: (d: Date) => startOfWeek(d, { weekStartsOn: 1 }),
        month: startOfMonth,
        quarter: startOfQuarter,
        year: startOfYear
    };
    
    return periodStarts[period](zonedDate);
};

/**
 * Check if two dates are in the same period (day, week, month, quarter, year).
 * @param dateLeft - The first date to compare.
 * @param dateRight - The second date to compare.
 * @param period - The period type to compare by.
 * @param timeZone - The timezone identifier.
 */
export const isSamePeriod = (
    dateLeft: Date, 
    dateRight: Date, 
    period: PeriodType, 
    timeZone?: string
): boolean => isEqual(
    startOfPeriod(dateLeft, period, timeZone),
    startOfPeriod(dateRight, period, timeZone)
);

/**
 * Calculate both ISO week number and ISO week-numbering year based on UTC date.
 * @param date - The Date object in UTC.
 * @returns An object containing the ISO week number and year.
 */
export const getISOWeekData = (date: Date): { week: number; year: number } => {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7; // Sunday is 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    
    return {
        week: Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7),
        year: d.getUTCFullYear()
    };
};