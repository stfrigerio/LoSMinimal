import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, Pressable, Text } from 'react-native';

import TaskModal from '@/src/features/Tasks/modals/TaskModal';
import MobileNavbar from '@/src/components/NavBar';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { useTasksData } from './hooks/useTasksData';

import { TaskData } from '@/src/types/Task';
import { Project } from './components/Projects/types/types';
import { router } from 'expo-router';
import Banner from '@/src/components/Banner';


const TasksHub: React.FC = () => {
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme), [theme]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const { tasks } = useTasksData(); 

    const { 
        addTask,
        updateTask,
        refreshTasks,
    } = useTasksData();

    const handleUpdateTask = useCallback(async (newTask: TaskData) => {
        await updateTask(newTask);
        refreshTasks();
        setIsUpdateModalOpen(false);
    }, [updateTask, refreshTasks]);

    const handleAddTask = useCallback(async (newTask: TaskData) => {
        await addTask(newTask);
        refreshTasks();
        setIsAddModalOpen(false);
    }, [addTask, refreshTasks]);

    const navItems = [
        { label: 'Dashboard', onPress: () => router.push('/tasks') },
        { label: 'List', onPress: () => router.push('/tasks/list') },
        { label: 'Checklist', onPress: () => router.push('/tasks/checklist') },
        { label: 'Projects', onPress: () => router.push('/tasks/projects') }
    ];

    const taskStats = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 
            ? Math.round((completedTasks / totalTasks) * 100) 
            : 0;
        
        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate,
        };
    }, [tasks]);

    return (
        <View style={styles.container}>
            <Banner imageSource={require('@/assets/images/tasks.webp')} />
            <Text style={designs.text.title}>Tasks</Text>

            {/* Add Summary Section */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Tasks</Text>
                        <Text style={styles.summaryValue}>{taskStats.totalTasks}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Completion Rate</Text>
                        <Text style={[
                            styles.summaryValue,
                            { color: taskStats.completionRate > 50 ? theme.colors.greenOpacity : theme.colors.yellowOpacity }
                        ]}>{taskStats.completionRate}%</Text>
                    </View>
                </View>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Pending</Text>
                        <Text style={[styles.summaryValue, { color: theme.colors.yellowOpacity }]}>
                            {taskStats.pendingTasks}
                        </Text>
                    </View>
                </View>
            </View>

            {isAddModalOpen && (
                <TaskModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
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
                activeIndex={navItems.findIndex(item => item.label === 'Dashboard')}
                quickButtonFunction={() => setIsAddModalOpen(true)}
                screen="tasks"
            />
        </View>
    );
};

const getStyles = (theme: Theme) => {    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.backgroundColor,
            padding: 20,
            paddingTop: 40,
        },
        summaryContainer: {
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: 12,
            padding: 15,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        summaryItem: {
            flex: 1,
            alignItems: 'center',
            padding: 10,
        },
        summaryLabel: {
            fontSize: 14,
            color: theme.colors.textColorItalic,
            marginBottom: 5,
        },
        summaryValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.textColor,
        },
    });
};

export default TasksHub;