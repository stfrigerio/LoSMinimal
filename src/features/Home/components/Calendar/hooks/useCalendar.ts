import { databaseManagers } from '@/database/tables';
import { Theme } from '@/src/styles/useThemeStyles';

interface BirthdayRecord {
    birthDay: string;
    name: string;
}

import { TaskData, TempDueDates, MarkedDateDetails, ExtendedTaskData } from '@/src/types/Task'; 

export const parseChecklistItems = (items: TaskData[], theme: Theme): TempDueDates => {
    const tempDueDates: TempDueDates = {};
    items.forEach(item => {
        if (item.due) {
            const datePart = item.due.split('T')[0];
            if (!tempDueDates[datePart]) {
                tempDueDates[datePart] = { 
                    marked: true, 
                    dotColor: theme.colors.greenOpacity,
                    incompleteTasks: 0, 
                    tasks: [] 
                };
            }
            tempDueDates[datePart].tasks.push(item);
            if (!item.completed) {
                tempDueDates[datePart].dotColor = theme.colors.yellowOpacity;
                tempDueDates[datePart].incompleteTasks++;
            }
        }
    });
    return tempDueDates;
}

export const getUpdatedBirthdayDates = async (
    currentYear: number,
    theme: any
): Promise<Record<string, MarkedDateDetails>> => {
    const birthdaysRecords = await databaseManagers.people.getAllBirthdays();
    const updatedBirthdayDates: Record<string, MarkedDateDetails> = {};

    birthdaysRecords.forEach((birthday: BirthdayRecord) => {
        const monthDay = birthday.birthDay.substring(5);
        const fullDate = `${currentYear}-${monthDay}`;
        const age = calculateAge(birthday.birthDay);
        updatedBirthdayDates[fullDate] = {
            marked: true,
            dotColor: theme.colors.accentColor,
            isBirthday: true,
            name: birthday.name, 
            dateOfBirth: birthday.birthDay,
            age
        };
    });

    return updatedBirthdayDates;
}

export const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();

    return age;
};

export const mergeDates = (taskDates: TempDueDates, birthdayDates: Record<string, MarkedDateDetails>): Record<string, MarkedDateDetails> => {
    const dueDates: Record<string, MarkedDateDetails> = { ...birthdayDates };
    Object.keys(taskDates).forEach(date => {
        if (dueDates[date]) { // If the date is already marked as a birthday
        // Merge but keep the birthday's dotColor
        dueDates[date] = {
            ...taskDates[date],
            ...dueDates[date],
            dotColor: dueDates[date].dotColor // Ensures the birthday's dotColor takes precedence
        };
        } else {
        // If no birthday, just copy the task date details
        dueDates[date] = taskDates[date];
        }
    });
    return dueDates;
};

export const getDayItems = async (date: string, markedDates: Record<string, MarkedDateDetails>): Promise<ExtendedTaskData[]> => {
    const items = await databaseManagers.tasks.listByDateRange(`${date}T00:00:00`, `${date}T23:59:59`);
    const extendedItems: ExtendedTaskData[] = items.map((item: TaskData) => ({ ...item }));

    if (markedDates[date]?.isBirthday) {
            extendedItems.push({
            text: `${markedDates[date].name} turns ${markedDates[date].age} today!`,
            due: date,
            completed: false,
            isBirthday: true,
        });
    }

    return extendedItems;
}
