import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, BackHandler } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';

import { projectsHelpers } from './helpers';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import AlertModal from '@/src/components/modals/AlertModal';
import { Project } from './types/types';
import ProjectView from './components/ProjectView';
import { ProgressBar } from './components/ProgressBar';
import { exportProjects } from './hooks/exportProjects';
import { importProjects } from './hooks/importProjects';

interface ProjectsScreenProps {
    pillars: any[];
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;
}

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
    pillars,
    selectedProject,
    setSelectedProject,
}) => {
    const { themeColors } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [alertConfig, setAlertConfig] = useState<{
        isVisible: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        singleButton?: boolean;
    }>({
        isVisible: false,
        title: '',
        message: '',
        onConfirm: () => {},
        singleButton: true
    });

    const loadProjects = async () => {
        try {
            const projectFiles = await projectsHelpers.load();
            setProjects(projectFiles);
        } catch (error) {
            console.error('Error loading project files:', error);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    // Add back handler
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (selectedProject) {
                setSelectedProject(null);
                return true; // Prevent default behavior
            }
            return false; // Let default behavior happen
        });

        return () => backHandler.remove();
    }, [selectedProject]);


    const handleAddProject = async () => {
        try {
            const createdProject = await projectsHelpers.create();
            setProjects(prevProjects => [...prevProjects, createdProject]);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await projectsHelpers.delete(projectId);
            setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleUpdateProject = async (project: Project) => {
        try {
            await projectsHelpers.update(project);
            // Update local state
            setProjects(prevProjects => 
                prevProjects.map(p => p.id === project.id ? project : p)
            );
            loadProjects();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };
    
    const handleExportProjects = async () => {
        const result = await exportProjects();
        setAlertConfig({
            isVisible: true,
            title: result.success ? 'Success' : 'Error',
            message: result.message,
            onConfirm: () => setAlertConfig(prev => ({ ...prev, isVisible: false })),
            singleButton: true
        });
    };

    // Import with alert feedback
    const handleImportProjects = async () => {
        const result = await importProjects();
        if (result.success) {
            await loadProjects(); // Reload projects after successful import
        }
        setAlertConfig({
            isVisible: true,
            title: result.success ? 'Success' : 'Error',
            message: result.message,
            onConfirm: () => setAlertConfig(prev => ({ ...prev, isVisible: false })),
            singleButton: true
        });
    };

    const getProgressColor = (completion: number) => {
        if (completion >= 75) return themeColors.greenOpacity;
        if (completion >= 25) return themeColors.yellowOpacity;
        return themeColors.redOpacity;
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.projectsList}>
                <View style={styles.projectsListHeader}>
                    <Text style={styles.projectsListHeaderText}>Projects</Text>
                </View>
                <View style={styles.headerActions}>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed
                        ]}
                        onPress={handleAddProject}
                    >
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon 
                                icon={faPlus} 
                                size={20} 
                                color={themeColors.accentColor} 
                            />
                            <Text style={styles.iconText}>New Project</Text>
                        </View>
                    </Pressable>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed
                        ]}
                        onPress={handleExportProjects}
                    >
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon 
                                icon={faFileExport} 
                                size={20} 
                                color={themeColors.accentColor} 
                            />
                            <Text style={styles.iconText}>Export</Text>
                        </View>
                    </Pressable>
                    <Pressable 
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed
                        ]}
                        onPress={handleImportProjects}
                    >
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon 
                                icon={faFileImport} 
                                size={20} 
                                color={themeColors.accentColor} 
                            />
                            <Text style={styles.iconText}>Import</Text>
                        </View>
                    </Pressable>
                </View>
                {projects.map((project) => {
                    const completion = projectsHelpers.calculateCompletion(project.markdown);
                    return (
                        <Pressable
                            key={project.id}
                            style={styles.projectCard}
                            onPress={() => setSelectedProject(project)}
                        >
                            <Text style={styles.projectTitle} numberOfLines={1}>
                                {project.title}
                            </Text>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarWrapper}>
                                    <ProgressBar
                                        progress={completion}
                                        height={6}
                                        backgroundColor={themeColors.backgroundSecondary}
                                        fillColor={getProgressColor(completion)}
                                    />
                                </View>
                                <Text style={styles.projectCompletion}>
                                    {completion}%
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
            {selectedProject && (
                <ProjectView
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onDelete={handleDeleteProject}
                    onUpdate={handleUpdateProject}
                />
            )}
            <AlertModal
                isVisible={alertConfig.isVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={alertConfig.onConfirm}
                singleButton={alertConfig.singleButton}
            />
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    projectsList: {
        flex: 1,
        marginBottom: 50,
    },
    projectsListHeader: {
        padding: 16,
    },
    projectsListHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: themeColors.accentColor,
    },
    projectCard: {
        backgroundColor: themeColors.backgroundSecondary,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColor,
        width: '50%', // Fixed width for title
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '45%', // Fixed width for progress section
    },
    progressBarWrapper: {
        flex: 1, // This will take up remaining space
    },
    projectCompletion: {
        fontSize: 8,
        color: themeColors.textColorItalic,
        minWidth: 8,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    iconButton: {
        padding: 8,
    },
    iconText: {
        fontSize: 10,
        color: themeColors.gray,
    },
    iconButtonPressed: {
        backgroundColor: themeColors.backgroundSecondary,
        borderRadius: 16,
        opacity: 0.7,
    },
});


export default ProjectsScreen;