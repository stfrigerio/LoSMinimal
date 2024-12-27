import { databaseManagers } from "@/database/tables";
import { parseDate, getISOWeekData } from "@/src/utils/timezoneBullshit";

export const fetchWeeklySummariesForMonth = async (monthDate: string) => {
    const [year, month] = monthDate.split('-');
    const weeklySummaries = [];
    
    for (let week = 1; week <= 5; week++) {
        const weekDate = `${year}-W${week.toString().padStart(2, '0')}`;
        // Get the ISO week data and check if it belongs to the target month
        const date = parseDate(weekDate);
        const weekData = getISOWeekData(date);
        
        // Convert the date to get the actual month (1-12)
        const weekMonth = new Date(weekData.year, 0, 1 + (weekData.week - 1) * 7).getMonth() + 1;
        
        if (weekMonth === parseInt(month)) {
            const summary = await databaseManagers.gpt.getByDate(weekDate);
            if (summary && summary.length > 0) {
                weeklySummaries.push(summary[0]);
            }
        }
    }
    
    return weeklySummaries;
};

export const fetchMonthlySummariesForQuarter = async (quarter: string, year: string) => {
    const monthlySummaries = [];
    for (let month = 1; month <= 3; month++) {
        const monthDate = `${year}-${month.toString().padStart(2, '0')}`;
        const summary = await databaseManagers.gpt.getByDate(monthDate);
        if (summary && summary.length > 0) {
            monthlySummaries.push(summary[0]);
        }
    }
    return monthlySummaries;
};

export const fetchQuarterlySummariesForYear = async (year: string) => {
    const quarterlySummaries = [];
    for (let quarter = 1; quarter <= 4; quarter++) {
        const quarterDate = `${year}-Q${quarter.toString().padStart(2, '0')}`;
        const summary = await databaseManagers.gpt.getByDate(quarterDate);
        if (summary && summary.length > 0) {
            quarterlySummaries.push(summary[0]);
        }
    }
    return quarterlySummaries;
};