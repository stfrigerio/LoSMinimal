import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, FlatList, Dimensions, Platform, View, Text, Pressable,  } from 'react-native';
import { faCheckCircle, faCircle, faList, faRepeat } from '@fortawesome/free-solid-svg-icons';

import TaskEntry from './components/TaskEntry';
import { TaskData } from '@/src/types/Task';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { useTasksData } from '../../hooks/useTasksData';
import { FilterType } from './components/FilterIcon';
import { FilterTray } from './components/FilterTray';
import MobileNavbar from '@/src/components/NavBar';
import TaskModal from '../../modals/TaskModal';
import { navItems } from '../../constants/navItems';

const TaskListScreen = () => {
    const [filter, setFilter] = useState<FilterType>('all');
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { 
        tasks, 
        addTask,
        updateTask,
        refreshTasks,
        deleteTask,
        pillars,
    } = useTasksData();

    const filteredTasks = useMemo(() => {
        const tasksWithoutChecklist = tasks.filter((task: TaskData) => task.type !== 'checklist');
        return tasksWithoutChecklist.filter((task: TaskData) => task.due);
    }, [tasks]);

    // Sort and filter the tasks
    const filteredAndSortedTasks = useMemo(() => {
        return filteredTasks
            .filter((task: TaskData) => {
                if (!task.uuid) {
                    console.warn('Task without UUID:', task);
                    return false;
                }
                if (filter === 'all') return task.repeat !== 'true' && task.type !== 'repeatedTask'; // if everybody, exclude repeated and repeating tasks
                if (filter === 'completed') return task.completed && task.repeat !== 'true' && task.type !== 'repeatedTask';
                if (filter === 'active') return !task.completed && task.repeat !== 'true' && task.type !== 'repeatedTask';
                if (filter === 'repeat') return task.repeat === 'true' && task.type !== 'repeatedTask';

                return true;
            })
            .sort((a: TaskData, b: TaskData) => {
                const dateA = new Date(a.due || 0);
                const dateB = new Date(b.due || 0);
                return dateB.getTime() - dateA.getTime(); // Newest to oldest
            });
    }, [filteredTasks, filter]);

    const keyExtractor = useCallback((item: TaskData) => {
        if (!item.uuid) {
            console.error('Task without UUID:', item);
            return `fallback-${item.id || Math.random()}`;
        }
        return item.uuid;
    }, []);

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

    const renderItem = ({ item, index }: { item: TaskData; index: number }) => {
        const today = new Date();

        const showTodayLine = filter !== 'repeat' && index === filteredAndSortedTasks.findIndex((task: TaskData) => {
            const taskDate = new Date(task.due!);
            return taskDate <= today;
        });

        const todayText = today.toLocaleString('en-US',  { weekday: 'short', month: 'short', day: 'numeric' });
        const todayTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return (
            <>
                {showTodayLine && (
                    <View style={styles.todayLine}>
                        <View style={styles.todayLineLeft} />
                        <Text style={styles.todayText}>{todayTime} - {todayText}</Text>
                        <View style={styles.todayLineRight} />
                    </View>
                )}
                <TaskEntry
                    item={item}
                    pillar={pillars.find(pillar => pillar.uuid === item.pillarUuid)}
                    onUpdateTask={updateTask}
                    deleteTask={deleteTask}
                    refreshTasks={refreshTasks}
                />
            </>
        );
    };

    return (
        <View style={styles.container}>
            <FilterTray setFilter={setFilter} filter={filter} />
            <View style={styles.divider} />
            <FlatList
                data={filteredAndSortedTasks}
                renderItem={({ item, index }) => (
                    <View style={[
                        index === filteredAndSortedTasks.length - 1 && styles.lastItem
                    ]}>
                        {renderItem({ item, index })}
                    </View>
                )}
                keyExtractor={keyExtractor}
                style={styles.list}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
            />
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
                activeIndex={navItems.findIndex(item => item.label === 'List')}
                quickButtonFunction={() => setIsAddModalOpen(true)}
                screen="tasks"
            />
        </View>
    )
};

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 50,
            backgroundColor: theme.colors.backgroundColor,
        },
        filterContainer: {
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        list: {
            flex: 1,
            marginHorizontal: 16,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.borderColor,
            marginVertical: 20,
        },
        todayLine: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 15,
        },
        todayLineLeft: {
            flex: 1,
            height: 1,
            backgroundColor: theme.colors.borderColor,
            marginRight: 10,
        },
        todayLineRight: {
            flex: 1,
            height: 1,
            backgroundColor: theme.colors.borderColor,
            marginLeft: 10,
        },
        todayText: {
            color: theme.colors.textColorItalic,
            fontSize: 12,
            fontFamily: 'serif',
            fontWeight: 'bold',
        },
        lastItem: {
            marginBottom: 80,
        },
    });
};

export default TaskListScreen;