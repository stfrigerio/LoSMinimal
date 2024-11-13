import { TaskData } from '@/src/types/Task';

export interface ChecklistProps {
    tasks: TaskData[];
    addTask: (task: Partial<TaskData>) => void;
    updateTask: (task: TaskData) => void;
    deleteTask: (uuid: string) => void;
    refreshTasks: () => void;
}

export interface ChecklistData {
    name: string;
    color: string;
    collapsed: boolean;
}

export interface ChecklistItemProps {
    task: TaskData;
    textColor: string;
    onToggle: (task: TaskData) => void;
    onDelete: (uuid: string) => void;
} 