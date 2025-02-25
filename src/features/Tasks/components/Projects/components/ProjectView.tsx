import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, BackHandler, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from '@/src/components/Markdown/Markdown';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { Project } from '../types/types';
import AlertModal from '@/src/components/modals/AlertModal';
import TaskModal from '../../../modals/TaskModal';
import { TaskData } from '@/src/types/Task';
import { useTasksData } from '@/src/features/Tasks/hooks/useTasksData';

interface ProjectViewProps {
    project: Project;
    onClose: () => void;
    onUpdate?: (updatedProject: Project) => Promise<void>;
    onDelete?: (projectId: string) => Promise<void>;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onClose, onUpdate, onDelete }) => {
    const { theme } = useThemeStyles();
    const styles = useMemo(() => getStyles(theme), [theme]);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(project.markdown);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [task, setTask] = useState<TaskData | null>(null);

    const { addTask, updateTask } = useTasksData();

    useEffect(() => {
        setContent(project.markdown);
    }, [project.markdown]);

    // todo i need to find a way to disable the swipe interaction on ios
    
    useEffect(() => {
        if (Platform.OS === 'android') {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if (isEditing) {
                        setShowDiscardModal(true);
                        return true;
                    }
                    return false;
                }
            );

            return () => backHandler.remove();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (onUpdate) {
            // Parse the markdown to extract title and other metadata
            const updatedProject = {
                ...project,
                markdown: content,
            };
            await onUpdate(updatedProject);
        }
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(project.id);
            onClose();
        }
    };

    const handleMarkdownChange = async (newContent: string) => {
        setContent(newContent);
        // Auto-save when checklist is toggled
        if (onUpdate) {
            const updatedProject = {
                ...project,
                markdown: newContent,
            };
            await onUpdate(updatedProject);
        }
    };

    const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

    const handleKeyPress = (e: any) => {
        if (e.nativeEvent.key === 'Enter') {
            // Find the cursor position in the text
            const cursorPosition = selection.start;
            
            // Split content into lines and find which line we're on
            const lines = content.split('\n');
            let charCount = 0;
            let currentLineIndex = 0;
        
            // Find the current line by counting characters
            for (let i = 0; i < lines.length; i++) {
                const lineLength = lines[i].length + 1; // +1 for newline character
                if (charCount + lineLength > cursorPosition) {
                    currentLineIndex = i;
                    break;
                }
                charCount += lineLength;
            }
        
            const currentLine = lines[currentLineIndex];
            if (currentLine?.trim().startsWith('- [ ]')) {
                e.preventDefault();
                // Create new content with the checklist item
                const beforeCursor = content.slice(0, cursorPosition);
                const afterCursor = content.slice(cursorPosition);
                const newContent = beforeCursor + '\n- [ ] ' + afterCursor;
                
                // Force a state update
                requestAnimationFrame(() => {
                    setContent(newContent);
                    const newPosition = cursorPosition + '\n- [ ] '.length;
                    setSelection({ start: newPosition, end: newPosition });
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={onClose} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textColor} />
                </Pressable>
                <View style={styles.headerButtons}>
                    {!isEditing ? (
                        <>
                            <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
                                <Ionicons name="pencil" size={24} color={theme.colors.textColor} />
                            </Pressable>
                            <Pressable 
                                onPress={() => setShowDeleteModal(true)} 
                                style={styles.deleteButton}
                            >
                                <Ionicons name="trash" size={24} color={theme.colors.redOpacity} />
                            </Pressable>
                        </>
                    ) : (
                        <Pressable onPress={handleSave} style={styles.saveButton}>
                            <Ionicons name="checkmark" size={24} color={theme.colors.textColor} />
                        </Pressable>
                    )}
                </View>
            </View>
            
            {isEditing ? (
                <TextInput
                    style={styles.markdownInput}
                    value={content}
                    onChangeText={setContent}
                    onSelectionChange={(event) => {
                        setSelection(event.nativeEvent.selection);
                    }}
                    onKeyPress={handleKeyPress}
                    selection={selection}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={true}
                />
            ) : (
                <ScrollView>
                    <Markdown 
                        onCreateTask={(title) => {
                            // Open your TaskModal here with the title pre-filled
                            setTaskModalOpen(true);
                            setTask({
                                text: title,
                                completed: false,
                            });
                        }}
                        onChange={handleMarkdownChange}
                        activeChecklists={true}
                    >
                        {content}
                    </Markdown>
                </ScrollView>
            )}

            {showDeleteModal && (
                <AlertModal
                    isVisible={showDeleteModal}
                    title="Delete Project"
                    message="Are you sure you want to delete this project?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            {showDiscardModal && (
                <AlertModal
                    isVisible={showDiscardModal}
                    title="Discard Changes"
                    message="You have unsaved changes. Are you sure you want to discard them?"
                    onConfirm={() => {
                        setShowDiscardModal(false);
                        setIsEditing(false);
                        onClose();
                    }}
                    onCancel={() => setShowDiscardModal(false)}
                />
            )}
            {taskModalOpen && (
                <TaskModal
                    isOpen={taskModalOpen}
                    onClose={() => setTaskModalOpen(false)}
                    onAddItem={addTask}
                    onUpdateItem={updateTask}
                    task={task || undefined}
                />
            )}
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        paddingTop: 50,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: theme.colors.borderColor,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    editButton: {
        padding: 4,
        marginLeft: 16,
    },
    deleteButton: {
        padding: 4,
        marginLeft: 16,
    },
    saveButton: {
        padding: 4,
        marginLeft: 16,
    },
    markdownInput: {
        flex: 1,
        padding: 16,
        fontSize: 14,
        color: theme.colors.textColor,
        textAlignVertical: 'top',
        fontFamily: 'monospace',
    },
});

export default ProjectView;