import { calculateNextOccurrence } from "./helpers/frequencyCalculator";
import { databaseManagers } from "@/database/tables";
import { setHours, setMinutes, setSeconds, setMilliseconds, startOfDay, endOfDay } from 'date-fns';

const checkAndAddRepeatingTasks = async (updateChecklist: () => void) => {
    try {
        const repeatingTasks = await databaseManagers.tasks.getRepeatingTasks();
        let tasksAdded = false;
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        for (const task of repeatingTasks) {
            // Get all instances of this repeated task
            const repeatedTasks = await databaseManagers.tasks.getRepeatedTaskByText(task.text);
            
            // Determine the next occurrence date
            let nextOccurrence: Date;
            const defaultDue = setMilliseconds(setSeconds(setMinutes(setHours(now, 14), 30), 0), 0);
            
            if (repeatedTasks.length === 0) {
                // If no instances exist, calculate from the original task's due date
                const due = task.due ? new Date(task.due) : defaultDue;
                nextOccurrence = calculateNextOccurrence(due, task.frequency!);
            } else {
                // Get the most recent instance
                const sortedRepeatedTasks = repeatedTasks.sort(
                    (a, b) => new Date(b.due!).getTime() - new Date(a.due!).getTime()
                );
                const mostRecentTask = sortedRepeatedTasks[0];
                const mostRecentDue = new Date(mostRecentTask.due!);
                nextOccurrence = calculateNextOccurrence(mostRecentDue, task.frequency!);
            }

            // Only proceed if the next occurrence is within the next 24 hours
            if (nextOccurrence > now && nextOccurrence <= tomorrow) {
                const startOfNextOccurrence = startOfDay(nextOccurrence);
                const endOfNextOccurrence = endOfDay(nextOccurrence);
                
                // Check if task already exists for this day
                const existingTasksOnNextOccurrence = await databaseManagers.tasks.listByDateRange(
                    startOfNextOccurrence.toISOString(),
                    endOfNextOccurrence.toISOString()
                );

                const taskAlreadyExists = existingTasksOnNextOccurrence.some(
                    t => t.text.trim() === task.text.trim() && t.type === 'repeatedTask'
                );

                if (!taskAlreadyExists) {
                    const newTask = {
                        ...task,
                        due: nextOccurrence.toISOString(),
                        repeat: false,
                        frequency: null,
                        id: undefined,
                        uuid: undefined,
                        type: 'repeatedTask',
                        completed: false
                    };
                    await databaseManagers.tasks.upsert(newTask);
                    console.log('New repeated task added for', nextOccurrence.toISOString());
                    tasksAdded = true;
                }
            }
        }

        if (tasksAdded) {
            updateChecklist();
        }

    } catch (err) {
        console.error('Error in checkAndAddRepeatingTasks:', err);
    }
}

export default checkAndAddRepeatingTasks;