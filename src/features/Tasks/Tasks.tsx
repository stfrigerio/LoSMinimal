import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, Pressable } from 'react-native';

import TaskModal from '@/src/features/Tasks/modals/TaskModal';
import MobileNavbar from '@/src/components/NavBar';
import TaskListScreen from './components/TasksList';
import ChecklistScreen from './components/Checklist';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useNavigationComponents } from '@/src/features/LeftPanel/helpers/useNavigation'
import { useTasksData } from './hooks/useTasksData';

import { TaskData } from '@/src/types/Task';
import ProjectsScreen from './components/Projects/Projects';

const TasksHub: React.FC = () => {
    const { themeColors } = useThemeStyles();
    const { openHomepage } = useNavigationComponents();
    const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeScreen, setActiveScreen] = useState<'tasklist' | 'checklist' | 'projects'>('tasklist');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [screens, setScreens] = useState(['Task List', 'Checklist', 'Projects']);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { 
        tasks, 
        addTask,
        updateTask,
        refreshTasks,
        deleteTask,
        pillars,
    } = useTasksData();

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const handleUpdateTask = useCallback(async (newTask: TaskData) => {
        await updateTask(newTask);
        refreshTasks();
        setRefreshTrigger(prev => prev + 1);
        closeAddModal();
    }, [updateTask, refreshTasks, closeAddModal]);

    const handleAddTask = useCallback(async (newTask: TaskData) => {
        await addTask(newTask);
        refreshTasks();
        setRefreshTrigger(prev => prev + 1);
        closeAddModal();
    }, [addTask, refreshTasks, closeAddModal]);

    const checklistTasks = useMemo(() => {
        return tasks.filter((task: TaskData) => task.type && task.type.startsWith('checklist'));
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const tasksWithoutChecklist = tasks.filter((task: TaskData) => task.type !== 'checklist');
        return tasksWithoutChecklist.filter((task: TaskData) => task.due);
    }, [tasks]);

    const renderContent = () => {
        switch (activeScreen) {
            case 'tasklist':
                return (
                    <TaskListScreen
                        tasks={filteredTasks}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                        refreshTasks={refreshTasks}
                        pillars={pillars}
                    />
                );
            case 'checklist':
                return (
                    <ChecklistScreen 
                        tasks={checklistTasks}
                        addTask={(task: Partial<TaskData>) => addTask(task as Omit<TaskData, "id" | "uuid">)}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                        refreshTasks={refreshTasks}
                    />
                );
            case 'projects':
                return (
                    <ProjectsScreen 
                        pillars={pillars}
                    />
                );
            default:
                return null;
        }
    };

    const navItems = useMemo(() => 
        screens.map((screen) => ({
            label: screen,
            onPress: () => setActiveScreen(screen.toLowerCase().replace(' ', '') as 'tasklist' | 'checklist' | 'projects'),
        })),
        [screens]
    );

    return (
        <View style={styles.container}>
            {renderContent()}
            {isAddModalOpen && (
                <TaskModal
                    isOpen={isAddModalOpen}
                    onClose={closeAddModal}
                    onAddItem={handleAddTask}
                    onUpdateItem={handleUpdateTask}
                />
            )}  
            {isUpdateModalOpen && (
                <TaskModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onAddItem={handleUpdateTask}
                    onUpdateItem={handleUpdateTask}
                />
            )}
            <MobileNavbar
                items={navItems}
                activeIndex={screens.findIndex(screen => screen.toLowerCase().replace(' ', '') === activeScreen)}
                quickButtonFunction={activeScreen === 'checklist' || activeScreen === 'projects' ? undefined : openAddModal}
                screen="tasks"
            />
        </View>
    );
};

const getStyles = (themeColors: any) => {    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.backgroundColor,
            padding: 20,
            paddingTop: 40,
        },
    });
};

export default TasksHub;