import { calculateNextOccurrence } from "./frequencyCalculator";
import { databaseManagers } from "@/database/tables";
import { 
    setHours, 
    setMinutes, 
    setSeconds, 
    setMilliseconds, 
    startOfDay, 
    endOfDay 
} from 'date-fns';
import { TaskData } from '@/src/types/Task';

let isRunning = false;

const checkAndAddRepeatingTasks = async (updateChecklist: () => void) => {
    if (isRunning) {
        console.log('checkAndAddRepeatingTasks is already running');
        return;
    }
    
    try {
        isRunning = true;

        //? first we get the tasks which have repeat = 1 and indication of frequency
        //? ive called this repeatingTasks to differentiate from the repeatedTasks which are the ones that have been generated
        const repeatingTasks = await databaseManagers.tasks.getRepeatingTasks();
        let tasksAdded = false;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        //? we iterate over all the different repeated tasks (identified by the text)
        for (const task of repeatingTasks) {
            // Retrieve all repeatedTasks with the same text
            //? this tasks have repeat = 0, frequency = null and type = repeatedTask
            const repeatedTasks = await databaseManagers.tasks.getRepeatedTaskByText(task.text);
            let baseDate: Date;

            if (repeatedTasks.length === 0) {
                // If no repeated tasks exist, use task.due or default to today at 14:30.
                const defaultDue = setMilliseconds(setSeconds(setMinutes(setHours(now, 14), 30), 0), 0);
                baseDate = task.due ? new Date(task.due) : defaultDue;
            } else {
                // Use the most recent repeated task’s due date (if any) as the base.
                const sorted = repeatedTasks
                    .filter(t => t.due)
                    .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime());
                baseDate = sorted.length ? new Date(sorted[sorted.length - 1].due!) : (task.due ? new Date(task.due) : now);
            }

            // Calculate the next occurrence using the template’s frequency.
            let nextOccurrence = calculateNextOccurrence(baseDate, task.frequency!);
            // Normalize the computed time to the nearest second.
            nextOccurrence = new Date(Math.floor(nextOccurrence.getTime() / 1000) * 1000);

            // Ensure the next occurrence is in the future.
            while (nextOccurrence <= now) {
                nextOccurrence = calculateNextOccurrence(nextOccurrence, task.frequency!);
                nextOccurrence = new Date(Math.floor(nextOccurrence.getTime() / 1000) * 1000);
            }

            // Check if the task should be limited by week
            const isDailyType = ['daily', 'weekday', 'weekend'].includes(task.frequency!);
            if (isDailyType) {
                // Calculate the end of next week
                const endOfNextWeek = new Date(now);
                // Get to the end of current week (Sunday)
                endOfNextWeek.setDate(now.getDate() + (7 - now.getDay()));
                // Add 7 more days to get to the end of next week
                endOfNextWeek.setDate(endOfNextWeek.getDate() + 7);
                // Set to end of day
                endOfNextWeek.setHours(23, 59, 59, 999);

                if (nextOccurrence > endOfNextWeek) {
                    continue;
                }
            } else {
                // For non-daily tasks, keep the existing month/year check
                if (
                    nextOccurrence.getFullYear() !== currentYear ||
                    nextOccurrence.getMonth() !== currentMonth
                ) {
                    continue;
                }
            }

            // Query tasks on that day.
            const startOfNextOccurrence = startOfDay(nextOccurrence).toISOString();
            const endOfNextOccurrence = endOfDay(nextOccurrence).toISOString();
            const tasksOnDate = await databaseManagers.tasks.listByDateRange(startOfNextOccurrence, endOfNextOccurrence);

            // Check for any existing repeated tasks with the same text on this day
            const existingRepeatedTasks = tasksOnDate.filter(t => {
                const textMatch = t.text.trim().toLowerCase() === task.text.trim().toLowerCase();
                const typeMatch = t.type === 'repeatedTask';

                return textMatch && typeMatch;
            });

            if (existingRepeatedTasks.length > 1) {
                // Keep the first one and delete the rest
                const [keepTask, ...duplicateTasks] = existingRepeatedTasks;
                for (const dupTask of duplicateTasks) {
                    await databaseManagers.tasks.removeByUuid(dupTask.uuid!);
                }
                tasksAdded = true; // Trigger refresh since we modified the tasks
                continue; // Skip creating a new task since we already have one
            }

            // If we have exactly one task for this day, skip creating a new one
            if (existingRepeatedTasks.length === 1) {
                continue;
            }

            // If we reach here, we need to create a new task
            const newTask: TaskData = {
                ...task,
                due: nextOccurrence.toISOString(),
                note: '',
                repeat: 'false',
                frequency: undefined,
                id: undefined,
                uuid: undefined,
                type: 'repeatedTask',
                completed: false,
            };
            await databaseManagers.tasks.upsert(newTask);
            tasksAdded = true;
        }

        if (tasksAdded) {
            updateChecklist();
        }
    // Mark the check as completed for today.
    } catch (err) {
        console.error(err);
    } finally {
        isRunning = false;
    }
};

export default checkAndAddRepeatingTasks;
