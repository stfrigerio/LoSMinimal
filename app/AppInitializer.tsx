import { useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useChecklist } from '@/src/contexts/checklistContext';

import {
    setGlobalNotificationHandler,
    registerForPushNotificationsAsync,
    checkMorningRoutineReminderScheduled,
    scheduleMorningRoutineReminder,
    checkMoodReminderScheduled,
    scheduleMoodReminder15,
    scheduleMoodReminder19
} from '@/src/notifications/notificationManager';

import checkAndAddRepeatingTasks from '@/src/notifications/repeatedTaskInit';
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
        
        // Schedule reminders
        checkMorningRoutineReminderScheduled().then(isScheduled => {
            if (!isScheduled) {
                scheduleMorningRoutineReminder();
            }
        });

        checkMoodReminderScheduled('MoodReminder15').then(isScheduled => {
            if (!isScheduled) {
                scheduleMoodReminder15();
            }
        });

        checkMoodReminderScheduled('MoodReminder19').then(isScheduled => {
            if (!isScheduled) {
                scheduleMoodReminder19();
            }
        });

        // Initialize audio
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeAndroid: 1,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
    }, []);

    const runCheckAndAddRepeatingTasks = useCallback(async () => {
        try {
            await checkAndAddRepeatingTasks(updateChecklist);
        } catch (error) {
            console.error('Error in checkAndAddRepeatingTasks:', error);
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
        setTimeout(checkAndSetTaskNotifications, 1000);
    }, [runCheckAndAddRepeatingTasks, checkAndSetTaskNotifications]);

    return null;
}