import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';

import { databaseManagers } from '@/database/tables';
import { getDayItems } from './useCalendar';
import { parseMoneyTask } from '@/src/features/Tasks/helpers/parseMoneyTask';

import { ExtendedTaskData } from '@/src/types/Task';
import { MarkedDateDetails } from '@/src/types/Task';
import { MoneyData } from '@/src/types/Money';

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

            if (newItem.completed && (currentItem.text.startsWith('💸') || currentItem.text.startsWith('💰'))) {
                try {
                    const moneyTransaction = await parseMoneyTask(
                        currentItem.due || new Date().toISOString(),
                        currentItem.text,
                        currentItem.note
                    );
                    
                    if (moneyTransaction) {
                        // Check for existing identical transaction
                        const existingTransactions = await databaseManagers.money.getByDateRange(
                            moneyTransaction.date,
                            moneyTransaction.date
                        );
                        
                        const isDuplicate = existingTransactions.some(existing => 
                            existing.amount === moneyTransaction.amount &&
                            existing.tag === moneyTransaction.tag &&
                            existing.description === moneyTransaction.description
                        );

                        if (!isDuplicate) {
                            await databaseManagers.money.upsert(moneyTransaction);
                            Toast.show({
                                text1: '💰 Transaction saved',
                            });
                        } else {
                            Toast.show({
                                text1: '💰 Transaction already exists',
                            });
                        }
                    }
                } catch (moneyErr) {
                    console.error('Error creating money transaction:', moneyErr);
                    throw new Error('Failed to create money transaction');
                }
            }
    
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