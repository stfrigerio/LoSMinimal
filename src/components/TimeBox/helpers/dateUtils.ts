import { getISOWeekData } from "@/src/utils/timezoneBullshit";

// Helper functions to add at the end of the file
export const getMonthWeeks = (date: Date) => {
    const weekNumbers: number[] = [];
    const dates: Date[] = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    let currentDate = firstDay;
    while (currentDate <= lastDay) {
        const { week } = getISOWeekData(currentDate);
        if (!weekNumbers.includes(week)) {
            weekNumbers.push(week);
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return { weekNumbers, dates };
};

export const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};