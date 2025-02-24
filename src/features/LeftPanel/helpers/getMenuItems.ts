import { MenuItem } from '../components/PopupMenu';
import { getStartOfToday } from '@/src/utils/timezoneBullshit';
import { NotePeriod } from './useNavigation';

type getMenuItemsProps = {
    type: 'tasks' | 'money' | 'time' | 'mood';
    openTasks: (type?: 'list' | 'checklist' | 'projects') => void;
    openDailyNote: (date: string) => void;
    openNote: (period: NotePeriod, date: string) => void;
    openMoods: (type?: 'list' | 'graph') => void;
    openDatabase: () => void;
    openMoney: (type?: 'list' | 'graph') => void;
    openJournal: () => void;
    openPeople: () => void;
    openLibrary: () => void;
    openTime: (type?: 'list' | 'timeline' | 'graph') => void;
}

const withNavigationDelay = <T extends (...args: any[]) => void>(action: T) => {
    return ((...args: Parameters<T>): void => {
        setTimeout(() => action(...args), 150);
    }) as unknown as T;
};

export const getNavigationHandlers = (props: any) => {

    return {
        handleOpenTasks: withNavigationDelay(() => props.openTasks()),
        handleOpenDailyNote: withNavigationDelay(() => props.openDailyNote(getStartOfToday().toString())),
        handleOpenNote: withNavigationDelay((type: string, date: string) => props.openNote(type as NotePeriod, date)),
        handleOpenMood: withNavigationDelay(() => props.openMoods()),
        handleOpenDatabase: withNavigationDelay(() => props.openDatabase()),
        handleOpenMoney: withNavigationDelay(() => props.openMoney()),
        handleOpenJournal: withNavigationDelay(() => props.openJournal()),
        handleOpenPeople: withNavigationDelay(() => props.openPeople()),
        handleOpenLibrary: withNavigationDelay(() => props.openLibrary()),
        handleOpenTime: withNavigationDelay(() => props.openTime())
    };
};

export const getMenuItems = (props: getMenuItemsProps): MenuItem[] => {
    switch (props.type) {
        case 'tasks':
            return [
                { 
                    label: 'Dashboard', 
                    onPress: withNavigationDelay(() => props.openTasks())
                },
                { 
                    label: 'Task List', 
                    onPress: withNavigationDelay(() => props.openTasks('list'))
                },
                { 
                    label: 'Checklist', 
                    onPress: withNavigationDelay(() => props.openTasks('checklist'))
                },
                { 
                    label: 'Projects', 
                    onPress: withNavigationDelay(() => props.openTasks('projects'))
                },
            ];
        case 'money':
            return [
                { 
                    label: 'Dashboard', 
                    onPress: withNavigationDelay(() => props.openMoney())
                },
                { 
                    label: 'List', 
                    onPress: withNavigationDelay(() => props.openMoney('list'))
                },
                { 
                    label: 'Graph', 
                    onPress: withNavigationDelay(() => props.openMoney('graph'))
                },
            ];
        case 'time':
            return [
                { 
                    label: 'Dashboard', 
                    onPress: withNavigationDelay(() => props.openTime())
                },
                { 
                    label: 'List', 
                    onPress: withNavigationDelay(() => props.openTime('list'))
                },
                { 
                    label: 'Timeline', 
                    onPress: withNavigationDelay(() => props.openTime('timeline'))
                },
                { 
                    label: 'Graph', 
                    onPress: withNavigationDelay(() => props.openTime('graph'))
                },
            ];
        case 'mood':
            return [
                { 
                    label: 'Dashboard', 
                    onPress: withNavigationDelay(() => props.openMoods())
                },
                { 
                    label: 'List', 
                    onPress: withNavigationDelay(() => props.openMoods('list'))
                },
                { 
                    label: 'Graph', 
                    onPress: withNavigationDelay(() => props.openMoods('graph'))
                },
            ];
        default:
            return [];
    }
};