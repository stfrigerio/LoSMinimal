import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek } from 'date-fns';
import { getLocalTimeZone, parseDate } from '@/src/utils/timezoneBullshit';
import { calculatePeriodTypeAndFormatDate } from './periodCalculation';
import { useGlobalSearchParams } from 'expo-router';

export const useDateState = () => {
    const params = useGlobalSearchParams();
    const timeZone = getLocalTimeZone();
    
    const [dateState, setDateState] = useState(() => {
        const today = new Date();
        
        // Use route params if available, otherwise default to current week
        let startDate = params.startDate 
            ? parseDate(String(params.startDate), timeZone) 
            : startOfWeek(today, { weekStartsOn: 1 });
            
        let endDate = params.endDate 
            ? parseDate(String(params.endDate), timeZone) 
            : endOfWeek(startDate, { weekStartsOn: 1 });

        const { periodType, formattedDate } = calculatePeriodTypeAndFormatDate(startDate, endDate);
        
        return { startDate, endDate, periodType, formattedDate };
    });

    useEffect(() => {
        const startDate = params.startDate 
            ? parseDate(String(params.startDate), timeZone) 
            : startOfWeek(new Date(), { weekStartsOn: 1 });
            
        const endDate = params.endDate 
            ? parseDate(String(params.endDate), timeZone) 
            : endOfWeek(startDate, { weekStartsOn: 1 });

        const { periodType, formattedDate } = calculatePeriodTypeAndFormatDate(startDate, endDate);

        setDateState({ startDate, endDate, periodType, formattedDate });
    }, [params.startDate, params.endDate]);

    return [dateState, setDateState] as const;
};