import { useState, useCallback } from 'react';
import { MarkedDateDetails } from '@/src/types/Task';
import { databaseManagers } from '@/database/tables';
import { formatMarkedDates } from '../helpers/calendarUtils';
import {
    parseChecklistItems,
    getUpdatedBirthdayDates,
    mergeDates,
} from './useCalendar';

export const useMarkedDates = (currentYear: number, theme: any) => {
    const [markedDates, setMarkedDates] = useState<Record<string, MarkedDateDetails>>({});

    const fetchMarkedDates = useCallback(async () => {
        const items = await databaseManagers.tasks.list();
        const filteredItems = items.filter((item) => item.type !== 'checklist');
        const tempDueDates = parseChecklistItems(filteredItems, theme);   
        const updatedBirthdayDates = await getUpdatedBirthdayDates(currentYear, theme);
        const dueDates = mergeDates(tempDueDates, updatedBirthdayDates);

        const newMarkedDates = formatMarkedDates(dueDates, theme);
        setMarkedDates(newMarkedDates);
    }, [currentYear, theme]);

    return {
        markedDates,
        fetchMarkedDates
    };
};