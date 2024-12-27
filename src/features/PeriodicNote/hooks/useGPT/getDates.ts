const getNextWeekDate = (currentDate: string) => {
    const [year, week] = currentDate.split('-W');
    const nextWeek = parseInt(week) + 1;
    return `${year}-W${nextWeek.toString().padStart(2, '0')}`;
};

const getNextMonthDate = (currentDate: string) => {
    const [year, month] = currentDate.split('-');
    const nextMonth = parseInt(month) + 1;
    if (nextMonth > 12) {
        return `${parseInt(year) + 1}-01`;
    }
    return `${year}-${nextMonth.toString().padStart(2, '0')}`;
};

const getNextQuarterDate = (currentDate: string) => {
    const [year, quarter] = currentDate.split('-Q');
    const nextQuarter = parseInt(quarter) + 1;
    return `${year}-Q${nextQuarter.toString().padStart(2, '0')}`;
};

export { getNextWeekDate, getNextMonthDate, getNextQuarterDate };