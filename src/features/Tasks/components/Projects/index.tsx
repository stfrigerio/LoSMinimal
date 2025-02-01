import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native';

import { projectsHelpers } from './helpers';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import AlertModal from '@/src/components/modals/AlertModal';
import { Project } from './types/types';
import { navItems } from '../../constants/navItems';
import MobileNavbar from '@/src/components/NavBar';
import { ProjectCard, HeaderActions, ProjectView } from './components';
import { exportProjects, importProjects } from './hooks';

const ProjectsScreen: React.FC = () => {
    const { themeColors } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors), [themeColors]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

    return (
        <View style={styles.container}>
            <ScrollView style={styles.projectsList}>
                <View style={styles.projectsListHeader}>
                    <Text style={styles.projectsListHeaderText}>Projects</Text>
                </View>
                <HeaderActions
                    handleAddProject={handleAddProject}
                    handleExportProjects={handleExportProjects}
                    handleImportProjects={handleImportProjects}
                />
                
                {projects.map((project) => {
                    const completion = projectsHelpers.calculateCompletion(project.markdown);
                    return (
                        <View key={project.id}>
                            <ProjectCard
                                project={project}
                                setSelectedProject={setSelectedProject}
                                completion={completion}
                            />
                        </View>
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
            {selectedProject ? null : <MobileNavbar
                items={navItems}
                activeIndex={navItems.findIndex(item => item.label === 'Projects')}
                quickButtonFunction={undefined}
                screen="tasks"
            />}
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroundColor,
        paddingTop: 50,
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
});


export default ProjectsScreen;