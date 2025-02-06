import { useEffect, useCallback } from 'react';
import { useChecklist } from '@/src/contexts/checklistContext';

import {
    setGlobalNotificationHandler,
    registerForPushNotificationsAsync,
} from '@/src/notifications/notificationManager';

import checkAndAddRepeatingTasks from '@/src/features/Tasks/helpers/repeatedTaskInit';
import checkAndAddRepeatingMoney from '@/src/features/Money/helpers/repeatedMoneyInit';
import { 
    checkTasksDueToday, 
    setNotificationsForDueTasks, 
    syncNotificationsWithTasks 
} from '@/src/notifications/taskNotifications';

export function AppInitializer() {
    const { updateChecklist } = useChecklist();

    useEffect(() => {        
        // Initialize notifications
        setGlobalNotificationHandler();
        registerForPushNotificationsAsync().then(token => console.log(token));
    }, []);

    const runCheckAndAddRepeatingTasks = useCallback(async () => {
        try {
            await checkAndAddRepeatingTasks(updateChecklist);
        } catch (error) {
            console.error('Error in checkAndAddRepeatingTasks:', error);
        }
    }, [updateChecklist]);

    const runCheckAndAddRepeatingMoney = useCallback(async () => {
        try {
            await checkAndAddRepeatingMoney(updateChecklist);
        } catch (error) {
            console.error('Error in checkAndAddRepeatingMoney:', error);
        }
    }, [updateChecklist]);

    const checkAndSetTaskNotifications = useCallback(async () => {
        try {
            const tasksDueToday = await checkTasksDueToday();
            await setNotificationsForDueTasks(tasksDueToday);
            await syncNotificationsWithTasks(tasksDueToday);
        } catch (error) {
            console.error('Error in checkAndSetTaskNotifications:', error);
        }
    }, []);

    useEffect(() => {
        runCheckAndAddRepeatingTasks();
        runCheckAndAddRepeatingMoney();
        setTimeout(checkAndSetTaskNotifications, 1000);
    }, [runCheckAndAddRepeatingTasks, checkAndSetTaskNotifications, runCheckAndAddRepeatingMoney]);

    return null;
}