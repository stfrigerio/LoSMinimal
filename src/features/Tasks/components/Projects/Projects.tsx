import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, BackHandler } from 'react-native';

import { projectsHelpers } from './helpers';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { Project } from './types/types';
import ProjectView from './components/ProjectView';
import { ProgressBar } from './components/ProgressBar';
import { calculateProjectCompletion } from './helpers/calculateCompletion';


interface ProjectsScreenProps {
    pillars: any[];
}

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
    pillars,
}) => {
    const { themeColors } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectFiles = await projectsHelpers.load();
                setProjects(projectFiles);
            } catch (error) {
                console.error('Error loading project files:', error);
            }
        };

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
        } catch (error) {
            console.error('Error updating project:', error);
        }
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
                <View style={styles.addProjectButton}>
                    <PrimaryButton
                        text="Add Project"
                        onPress={handleAddProject}
                    />
                </View>
            </ScrollView>

            {selectedProject && (
                <ProjectView
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onDelete={handleDeleteProject}
                    onUpdate={handleUpdateProject}
                />
            )}
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    projectsList: {
        flex: 1,
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
        width: '40%', // Fixed width for title
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '55%', // Fixed width for progress section
    },
    progressBarWrapper: {
        flex: 1, // This will take up remaining space
    },
    projectCompletion: {
        fontSize: 10,
        color: themeColors.textColorItalic,
        minWidth: 35,
    },
    addProjectButton: {
        marginTop: 16,
    },
});


export default ProjectsScreen;