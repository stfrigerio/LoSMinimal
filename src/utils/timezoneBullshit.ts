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
 * Get the start of the current day in the local timezone.
 */
export const getStartOfToday = (timeZone?: string): Date => {
    const tz = timeZone || getLocalTimeZone();
    const now = new Date();
    const zonedNow = toZonedTime(now, tz);
    return startOfDay(zonedNow);
};

/**
 * Calculate start and end dates for a period string.
 * Handles formats: YYYY-WW (week), YYYY-MM (month), YYYY-QN (quarter), YYYY (year)
 * @param periodString - Period string (e.g., "2024-W44", "2024-10", "2024-Q4", "2024")
 * @param timeZone - Optional timezone
 * @returns Object with startDate and endDate as Date objects
 */
export const getDateRangeForPeriod = (periodString: string, timeZone?: string): { startDate: Date; endDate: Date } => {
    const tz = timeZone || getLocalTimeZone();
    
    // Weekly format: "2024-W44"
    const weekMatch = periodString.match(/^(\d{4})-W(\d{1,2})$/);
    if (weekMatch) {
        const [, year, week] = weekMatch;
        // Create date for January 4th (this ensures we're in week 1)
        const jan4th = new Date(Date.UTC(parseInt(year), 0, 4));
        // Get the day of week for Jan 4th (1-7, where 1 is Monday, 7 is Sunday)
        const jan4thDay = jan4th.getUTCDay() || 7;
        // Find Monday of week 1 (going backwards from Jan 4th to Monday)
        const week1Start = new Date(jan4th);
        week1Start.setUTCDate(4 - jan4thDay + 1);  // +1 to adjust to Monday
        
        // Calculate start of target week
        const startDate = new Date(week1Start);
        startDate.setUTCDate(week1Start.getUTCDate() + (parseInt(week) - 1) * 7);
        
        // End date is 6 days after start date
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 6);
        
        return {
            startDate: toZoned(startDate, tz),
            endDate: toZoned(endDate, tz)
        };
    }
    
    // Monthly format: "2024-10"
    const monthMatch = periodString.match(/^(\d{4})-(\d{2})$/);
    if (monthMatch) {
        const [, year, month] = monthMatch;
        const startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
        const endDate = new Date(Date.UTC(parseInt(year), parseInt(month), 0));
        
        return {
            startDate: toZoned(startDate, tz),
            endDate: toZoned(endDate, tz)
        };
    }

    // Quarterly format: "2024-Q4"
    const quarterMatch = periodString.match(/^(\d{4})-Q(\d)$/);
    if (quarterMatch) {
        const [, year, quarter] = quarterMatch;
        const startMonth = (parseInt(quarter) - 1) * 3;
        const startDate = new Date(Date.UTC(parseInt(year), startMonth, 1));
        const endDate = new Date(Date.UTC(parseInt(year), startMonth + 3, 0));
        
        return {
            startDate: toZoned(startDate, tz),
            endDate: toZoned(endDate, tz)
        };
    }

    // Yearly format: "2024"
    const yearMatch = periodString.match(/^(\d{4})$/);
    if (yearMatch) {
        const [, year] = yearMatch;
        const startDate = new Date(Date.UTC(parseInt(year), 0, 1));
        const endDate = new Date(Date.UTC(parseInt(year), 11, 31));
        
        return {
            startDate: toZoned(startDate, tz),
            endDate: toZoned(endDate, tz)
        };
    }

    throw new Error(`Invalid period format: ${periodString}`);
};

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

/**
 * Navigate between periods (e.g., days) by adding or subtracting days.
 * @param date - The current date.
 * @param offset - The number of days to add (positive) or subtract (negative).
 * @param timeZone - The timezone identifier.
 */
export const navigateDate = (date: Date, offset: number, timeZone?: string): Date => {
    const tz = timeZone || getLocalTimeZone();
    const zonedDate = toZonedTime(date, tz);
    const newDate = addDays(zonedDate, offset);
    return newDate;
};