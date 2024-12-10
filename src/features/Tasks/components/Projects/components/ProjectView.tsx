import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from '@/src/components/Markdown/Markdown';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { Project } from '../types/types';
import AlertModal from '@/src/components/modals/AlertModal';

interface ProjectViewProps {
    project: Project;
    onClose: () => void;
    onUpdate?: (updatedProject: Project) => Promise<void>;
    onDelete?: (projectId: string) => Promise<void>;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onClose, onUpdate, onDelete }) => {
    const { themeColors } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(project.markdown);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    useEffect(() => {
        setContent(project.markdown);
    }, [project.markdown]);

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete(project.id);
            onClose();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={onClose} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={themeColors.textColor} />
                </Pressable>
                <View style={styles.headerButtons}>
                    {!isEditing ? (
                        <>
                            <Pressable onPress={() => setIsEditing(true)} style={styles.editButton}>
                                <Ionicons name="pencil" size={24} color={themeColors.textColor} />
                            </Pressable>
                            <Pressable 
                                onPress={() => setShowDeleteModal(true)} 
                                style={styles.deleteButton}
                            >
                                <Ionicons name="trash" size={24} color={themeColors.redOpacity} />
                            </Pressable>
                        </>
                    ) : (
                        <Pressable onPress={handleSave} style={styles.saveButton}>
                            <Ionicons name="checkmark" size={24} color={themeColors.textColor} />
                        </Pressable>
                    )}
                </View>
            </View>
            
            {isEditing ? (
                <TextInput
                    style={styles.markdownInput}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            ) : (
                <Markdown>{content}</Markdown>
            )}

            <AlertModal
                isVisible={showDeleteModal}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroundColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borderColor,
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
        color: themeColors.textColor,
        textAlignVertical: 'top',
        fontFamily: 'monospace',
    },
});

export default ProjectView;