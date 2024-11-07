import { useState, useCallback } from 'react';
import { MarkedDateDetails } from '@/src/types/Task';
import { databaseManagers } from '@/database/tables';
import { formatMarkedDates } from '../helpers/calendarUtils';
import {
    parseChecklistItems,
    getUpdatedBirthdayDates,
    mergeDates,
} from './useCalendar';

export const useMarkedDates = (currentYear: number, themeColors: any) => {
    const [markedDates, setMarkedDates] = useState<Record<string, MarkedDateDetails>>({});

    const fetchMarkedDates = useCallback(async () => {
        const items = await databaseManagers.tasks.list();
        const filteredItems = items.filter((item) => item.type !== 'checklist');
        const tempDueDates = parseChecklistItems(filteredItems);    
        const updatedBirthdayDates = await getUpdatedBirthdayDates(currentYear);
        const dueDates = mergeDates(tempDueDates, updatedBirthdayDates);

        const newMarkedDates = formatMarkedDates(dueDates, themeColors);
        setMarkedDates(newMarkedDates);
    }, [currentYear, themeColors]);

    return {
        markedDates,
        fetchMarkedDates
    };
};