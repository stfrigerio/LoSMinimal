import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, FlatList, Dimensions, Platform, View, Text, Pressable,  } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle, faList, faRepeat } from '@fortawesome/free-solid-svg-icons';

import TaskEntry from './TaskEntry';
import { TaskData } from '@/src/types/Task';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { PillarData } from '@/src/types/Pillar';

interface TaskListProps {
    tasks: TaskData[];
    updateTask: any;
    deleteTask: any;
    refreshTasks: () => void;
    pillars: PillarData[];
}

type FilterType = 'all' | 'completed' | 'active' | 'repeat';

const TaskListScreen = ({ 
    tasks, 
    updateTask,
    deleteTask,
    refreshTasks,
    pillars,
}: TaskListProps) => {
    const [filter, setFilter] = useState<FilterType>('all');
    const { themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);

    // Sort and filter the tasks
    const filteredAndSortedTasks = useMemo(() => {
        return tasks
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
    }, [tasks, filter]);

    const keyExtractor = useCallback((item: TaskData) => {
        if (!item.uuid) {
            console.error('Task without UUID:', item);
            return `fallback-${item.id || Math.random()}`;
        }
        return item.uuid;
    }, []);

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

    const FilterIcon: React.FC<{ type: FilterType, icon: any }> = ({ type, icon }) => (
        <Pressable onPress={() => setFilter(type)} style={styles.filterIcon}>
            <FontAwesomeIcon 
                icon={icon} 
                color={filter === type ? themeColors.accentColor : 'gray'} 
                size={24} 
            />
        </Pressable>
    );

    return (
        <>
            <View style={styles.filterContainer}>
                <FilterIcon type="all" icon={faList} />
                <FilterIcon type="active" icon={faCircle} />
                <FilterIcon type="completed" icon={faCheckCircle} />
                <FilterIcon type="repeat" icon={faRepeat} />
            </View>
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
        </>
    )
};

const getStyles = (themeColors: any, designs: any) => {
    return StyleSheet.create({
        filterContainer: {
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        filterIcon: {
            marginHorizontal: 15,
            padding: 5,
        },
        list: {
            flex: 1,
        },
        divider: {
            height: 1,
            backgroundColor: themeColors.borderColor,
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
            backgroundColor: themeColors.borderColor,
            marginRight: 10,
        },
        todayLineRight: {
            flex: 1,
            height: 1,
            backgroundColor: themeColors.borderColor,
            marginLeft: 10,
        },
        todayText: {
            color: themeColors.textColorItalic,
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