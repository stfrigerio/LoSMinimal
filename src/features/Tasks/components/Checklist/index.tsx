import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { ChecklistProps, ChecklistData } from './types';
import SingleChecklist from './SingleChecklist';
import AddChecklistModal from '../../modals/AddChecklistModal';

import { TaskData } from '@/src/types/Task';

const Checklist: React.FC<ChecklistProps> = ({ 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    refreshTasks 
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);
    
    const [inputTexts, setInputTexts] = useState<{[key: string]: string}>({});
    const [localTasks, setLocalTasks] = useState(tasks);
    const [checklists, setChecklists] = useState<ChecklistData[]>([]);
    const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
    const [editingChecklist, setEditingChecklist] = useState<ChecklistData | null>(null);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    // Function to reconstruct checklists from tasks
    const reconstructChecklists = useCallback((taskList: TaskData[]) => {
        const checklistMap = new Map<string, ChecklistData>();
        
        taskList.forEach(task => {
            if (task.type && task.type.startsWith('checklist_')) {
                const checklistName = task.type.split('_')[1];
                if (!checklistMap.has(checklistName)) {
                    checklistMap.set(checklistName, {
                        name: checklistName,
                        collapsed: false
                    });
                }
            }
        });

        return Array.from(checklistMap.values());
    }, []);

    // Use useMemo to derive checklists from tasks
    const derivedChecklists = useMemo(() => reconstructChecklists(tasks), [tasks, reconstructChecklists]);

    // Effect to update checklists when tasks change
    useEffect(() => {
        setLocalTasks(tasks);
        setChecklists(prevChecklists => {
            const newChecklists = derivedChecklists;
            // Preserve collapsed state and color from previous checklists
            return newChecklists.map(newChecklist => {
                const prevChecklist = prevChecklists.find(pc => pc.name === newChecklist.name);
                return {
                    ...newChecklist,
                    collapsed: prevChecklist?.collapsed || false,
                };
            });
        });
    }, [tasks, derivedChecklists]);

    const handleInputChange = (text: string, checklistName: string) => {
        setInputTexts(prev => ({ ...prev, [checklistName]: text }));
    };

    const addItem = useCallback(async (checklistName: string) => {
        const inputText = inputTexts[checklistName] || '';
        if (inputText.trim()) {
            try {
                const newTask = {
                    text: inputText.trim(),
                    completed: false,
                    type: `checklist_${checklistName}`,
                };
                addTask(newTask);
                setInputTexts(prev => ({ ...prev, [checklistName]: '' }));
                refreshTasks();
            } catch (error) {
                console.error('Error adding checklist item:', error);
            }
        }
    }, [inputTexts, addTask, refreshTasks]);

    const toggleItem = useCallback(async (task: TaskData) => {
        try {
            const updatedTask = { 
                ...task,
                completed: !task.completed 
            };
            updateTask(updatedTask);
        } catch (error) {
            console.error('Error toggling checklist item:', error);
        }
    }, [updateTask]);

    const handleDeleteTask = useCallback(async (uuid: string) => {
        try {
            deleteTask(uuid);
        } catch (error) {
            console.error('Error deleting checklist item:', error);
        }
    }, [deleteTask]);

    const handleAddChecklist = (name: string) => {
        if (editingChecklist) {
            setChecklists(checklists.map(cl => 
                cl.name === editingChecklist.name ? { ...cl, name } : cl
            ));
            // Update tasks with the new checklist name
            localTasks.forEach(task => {
                if (task.type === `checklist_${editingChecklist.name}`) {
                    updateTask({ ...task, type: `checklist_${name}` });
                }
            });
            setEditingChecklist(null);
        } else {
            setChecklists([...checklists, { name, collapsed: false }]);
        }
        setShowAddChecklistModal(false);
    };

    const toggleCollapse = (name: string) => {
        setChecklists(checklists.map(cl => 
            cl.name === name ? { ...cl, collapsed: !cl.collapsed } : cl
        ));
    };

    const editChecklist = (checklist: ChecklistData) => {
        setEditingChecklist(checklist);
        setShowAddChecklistModal(true);
    };

    return (
        <>
            <ScrollView style={styles.container}>
                {checklists.map(checklist => (
                    <SingleChecklist
                        key={checklist.name}
                        checklistData={checklist}
                        tasks={localTasks}
                        inputText={inputTexts[checklist.name] || ''}
                        onInputChange={handleInputChange}
                        onAddItem={addItem}
                        onToggleItem={toggleItem}
                        onDeleteTask={handleDeleteTask}
                        onEdit={editChecklist}
                        onToggleCollapse={toggleCollapse}
                    />
                ))}
                <Pressable 
                    onPress={() => {
                        setEditingChecklist(null);
                        setShowAddChecklistModal(true);
                    }} 
                    style={styles.addChecklistButton}
                >
                    {({ pressed }) => (
                        <Text 
                            style={[
                                styles.addChecklistButtonText, 
                                { color: pressed ? themeColors.accentColor : themeColors.textColor }
                            ]}
                        >
                            Add New Checklist
                        </Text>
                    )}
                </Pressable>
            </ScrollView>
            {showAddChecklistModal && (
                <AddChecklistModal
                    visible={showAddChecklistModal}
                    onClose={() => {
                        setShowAddChecklistModal(false);
                        setEditingChecklist(null);
                    }}
                    onAdd={handleAddChecklist}
                    initialChecklist={editingChecklist}
                />
            )}
        </>
    );
};

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    container: {
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        marginBottom: 80
    },
    addChecklistButton: {
        backgroundColor: themeColors.backgroundSecondary,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addChecklistButtonText: {
        ...designs.text.text,
        color: themeColors.textColor,
    },
});

export default Checklist;