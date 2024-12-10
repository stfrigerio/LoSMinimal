import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, BackHandler } from 'react-native';

import { loadProjectFiles, createProject, deleteProject, updateProject } from './helpers';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { Project } from './types/types';
import ProjectView from './components/ProjectView';


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
                const projectFiles = await loadProjectFiles();
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
            const createdProject = await createProject();
            setProjects(prevProjects => [...prevProjects, createdProject]);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await deleteProject(projectId);
            setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };


    const handleUpdateProject = async (project: Project) => {
        try {
            await updateProject(project);
            // Update local state
            setProjects(prevProjects => 
                prevProjects.map(p => p.id === project.id ? project : p)
            );
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.projectsList}>
                {projects.map((project) => (
                    <Pressable
                        key={project.id}
                        style={styles.projectCard}
                        onPress={() => setSelectedProject(project)}
                    >
                        <Text style={styles.projectTitle}>{project.title}</Text>
                        <Text style={styles.projectCompletion}>Completion: 0%</Text>
                    </Pressable>
                ))}
                <PrimaryButton
                    text="Add Project"
                    onPress={handleAddProject}
                />
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
    projectCard: {
        backgroundColor: themeColors.cardBackground,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColor,
        marginBottom: 8,
    },
    projectCompletion: {
        fontSize: 14,
        color: themeColors.textColor,
    },
});


export default ProjectsScreen;