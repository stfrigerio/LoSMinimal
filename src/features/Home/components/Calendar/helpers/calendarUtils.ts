import { MarkedDateDetails, ExtendedTaskData } from '@/src/types/Task';

export const formatMarkedDates = (
    dueDates: any,
    theme: any
): Record<string, MarkedDateDetails> => {
    const newMarkedDates: Record<string, MarkedDateDetails> = {};

    Object.entries(dueDates).forEach(([date, details]: [string, any]) => {
        const repeatedTasks = details.tasks?.filter((task: ExtendedTaskData) => task.type === 'repeatedTask') || [];
        const normalTasks = details.tasks?.filter((task: ExtendedTaskData) => task.type !== 'repeatedTask') || [];
        
        const allRepeatedCompleted = repeatedTasks.length > 0 && repeatedTasks.every((task: ExtendedTaskData) => task.completed);
        const allNormalCompleted = normalTasks.length > 0 && normalTasks.every((task: ExtendedTaskData) => task.completed);
    
        newMarkedDates[date] = {
            ...details,
            isRepeated: repeatedTasks.length > 0,
            marked: true,
            dots: [
                details.isBirthday ? { key: 'birthday', color: theme.colors.accentColor } : null,
                repeatedTasks.length > 0 ? { key: 'repeated', color: allRepeatedCompleted ? theme.colors.greenOpacity : theme.blueOpacity } : null,
                normalTasks.length > 0 ? { key: 'normal', color: allNormalCompleted ? theme.colors.greenOpacity : theme.colors.yellowOpacity } : null,
            ].filter(Boolean) as Array<{key: string, color: string}>,
        };
    });

    return newMarkedDates;
};