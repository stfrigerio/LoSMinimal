import { calculateNextOccurrence } from "@/src/features/Tasks/helpers/frequencyCalculator";
import { databaseManagers } from "@/database/tables";
import { 
    setHours, 
    setMinutes, 
    setSeconds, 
    setMilliseconds, 
    startOfDay, 
    endOfDay 
} from 'date-fns';
import { TaskData } from "@/src/types/Task";

let isRunning = false;

const checkAndAddRepeatingMoneyTasks = async (updateChecklist: () => void) => {
    if (isRunning) {
        console.log('checkAndAddRepeatingMoneyTasks is already running');
        return;
    }
    
    try {
        isRunning = true;

        // Get transactions which have a due date (our frequency indicator)
        const repeatingTransactions = await databaseManagers.money.getRepeatingTransactions();
        let tasksAdded = false;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        for (const transaction of repeatingTransactions) {
            const tagData = await databaseManagers.tags.getTagsByType('moneyTag');
            const tagInfo = tagData.find(tag => tag.text === transaction.tag);

            const descriptionData = await databaseManagers.tags.getDescriptionsByTag(transaction.tag);
            const descriptionInfo = descriptionData.find(d => d.text === transaction.description);

            // Create a task text that includes all transaction details in a parseable format
            const taskText = `${transaction.type === 'RepeatedExpense' ? '💸' : '💰'} ${
                descriptionInfo?.emoji || transaction.description
            } ${
                tagInfo?.emoji || `#${transaction.tag}`
            } - ${transaction.amount}€`;
            
            // Get existing tasks for this transaction
            const repeatedTasks = await databaseManagers.tasks.getRepeatedTaskByText(taskText);
            let baseDate: Date;

            if (repeatedTasks.length === 0) {
                const defaultDue = setMilliseconds(setSeconds(setMinutes(setHours(now, 14), 30), 0), 0);
                baseDate = transaction.date ? new Date(transaction.date) : defaultDue;
            } else {
                const sorted = repeatedTasks
                    .filter(t => t.due)
                    .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime());
                baseDate = sorted.length ? new Date(sorted[sorted.length - 1].due!) : (transaction.date ? new Date(transaction.date) : now);
            }

            let nextOccurrence = calculateNextOccurrence(baseDate, transaction.due!);
            nextOccurrence = new Date(Math.floor(nextOccurrence.getTime() / 1000) * 1000);

            while (nextOccurrence <= now) {
                nextOccurrence = calculateNextOccurrence(nextOccurrence, transaction.due!);
                nextOccurrence = new Date(Math.floor(nextOccurrence.getTime() / 1000) * 1000);
            }

            const isDailyType = ['daily', 'weekday', 'weekend'].includes(transaction.due!);
            if (isDailyType) {
                const endOfNextWeek = new Date(now);
                endOfNextWeek.setDate(now.getDate() + (7 - now.getDay()) + 7);
                endOfNextWeek.setHours(23, 59, 59, 999);

                if (nextOccurrence > endOfNextWeek) {
                    continue;
                }
            } else {
                if (
                    nextOccurrence.getFullYear() !== currentYear ||
                    nextOccurrence.getMonth() !== currentMonth
                ) {
                    continue;
                }
            }

            const startOfNextOccurrence = startOfDay(nextOccurrence).toISOString();
            const endOfNextOccurrence = endOfDay(nextOccurrence).toISOString();
            const tasksOnDate = await databaseManagers.tasks.listByDateRange(startOfNextOccurrence, endOfNextOccurrence);

            const existingRepeatedTasks = tasksOnDate.filter(t => {
                const textMatch = t.text.trim() === taskText.trim();
                const typeMatch = t.type === 'repeatedTask';
                return textMatch && typeMatch;
            });

            if (existingRepeatedTasks.length > 1) {
                const [keepTask, ...duplicateTasks] = existingRepeatedTasks;
                for (const dupTask of duplicateTasks) {
                    await databaseManagers.tasks.removeByUuid(dupTask.uuid!);
                }
                tasksAdded = true;
                continue;
            }

            if (existingRepeatedTasks.length === 1) {
                continue;
            }

            const transactionDetails = {
                type: transaction.type,
                description: transaction.description,
                tag: transaction.tag,
                amount: transaction.amount,
                account: transaction.account,
                synced: 0
            };

            // Create a new task that conforms to TaskData interface
            const newTask: TaskData = {
                text: taskText,
                due: nextOccurrence.toISOString(),
                note: JSON.stringify(transactionDetails),
                repeat: 'false',
                frequency: undefined,
                type: 'repeatedTask',
                completed: false,
            };

            await databaseManagers.tasks.upsert(newTask);
            console.log('New money reminder task added for', nextOccurrence.toISOString());
            tasksAdded = true;
        }

        if (tasksAdded) {
            updateChecklist();
        }

    } catch (err) {
        console.error(err);
    } finally {
        isRunning = false;
    }
};

export default checkAndAddRepeatingMoneyTasks;