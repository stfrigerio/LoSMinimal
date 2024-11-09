import { useState, useCallback } from 'react';

import { databaseManagers } from '@/database/tables';
import { getDayItems } from './useCalendar';

import { ExtendedTaskData } from '@/src/types/Task';
import { MarkedDateDetails } from '@/src/types/Task';

export const useTaskModal = (
    fetchMarkedDates: () => Promise<void>,
    markedDates: Record<string, MarkedDateDetails>
) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [checklistItems, setChecklistItems] = useState<ExtendedTaskData[]>([]);

    const updateChecklistItems = useCallback(async () => {
        if (selectedDate) {
            const startDate = `${selectedDate}T00:00:00.000Z`;
            const endDate = `${selectedDate}T23:59:59.999Z`;
            const items = await databaseManagers.tasks.listByDateRange(startDate, endDate);
            setChecklistItems(items);
        }
        fetchMarkedDates();
    }, [selectedDate, fetchMarkedDates]);

    const fetchDayItems = useCallback(async (date: string) => {
        const displayItems = await getDayItems(date, markedDates);
        const isBirthday = markedDates[date]?.isBirthday || false;
        const birthdayPerson = markedDates[date]?.name || "";
        const birthdayAge = markedDates[date]?.age ?? null;

        return {
            checklistItems: displayItems,
            birthdayDetails: { isBirthday, name: birthdayPerson, age: birthdayAge }
        };
    }, [markedDates]);

    const toggleItemCompletion = useCallback(async (id: number, completed: boolean) => {
        try {
            const currentItem = await databaseManagers.tasks.getById(id);
            if (!currentItem) {
                throw new Error('Task not found');
            }
    
            const newItem = {
                ...currentItem,
                completed: !completed,
            };
    
            await databaseManagers.tasks.upsert(newItem);
            updateChecklistItems();
        } catch (error) {
            console.error('Error toggling item completion:', error);
        }
    }, [updateChecklistItems]);

    return {
        showModal,
        setShowModal,
        selectedDate,
        setSelectedDate,
        checklistItems,
        updateChecklistItems,
        fetchDayItems,
        toggleItemCompletion
    };
};