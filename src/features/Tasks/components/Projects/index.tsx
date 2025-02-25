import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';

import Collapsible from '@/src/components/Collapsible';
import { ProjectCard, HeaderActions, ProjectView } from './components';
import MobileNavbar from '@/src/components/NavBar';
import AlertModal from '@/src/components/modals/AlertModal';

import { navItems } from '../../constants/navItems';
import { projectsHelpers } from './helpers';
import { exportProjects, importProjects } from './hooks';
import { GlitchText } from '@/src/styles/GlitchText';

import { Project } from './types/types';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';

const Projects: React.FC = () => {
    const { theme } = useThemeStyles();
    const styles = useMemo(() => getStyles(theme), [theme]);
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

    const [activeCollapsed, setActiveCollapsed] = useState<boolean>(false);
    const [completedCollapsed, setCompletedCollapsed] = useState<boolean>(true);
    const [onHoldCollapsed, setOnHoldCollapsed] = useState<boolean>(true);
    const [uncategorisedCollapsed, setUncategorisedCollapsed] = useState<boolean>(true);

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
            <ScrollView style={[styles.projectsList, { marginBottom: 80 }]}>
                <View style={styles.projectsListHeader}>
                    <GlitchText
                        style={styles.projectsListHeaderText}
                        glitch={theme.name === 'signalis'}
                    >
                        Projects
                    </GlitchText>
                </View>
                <HeaderActions
                    handleAddProject={handleAddProject}
                    handleExportProjects={handleExportProjects}
                    handleImportProjects={handleImportProjects}
                />

                {/* Active Projects Section */}
                <View style={styles.sectionContainer}>
                    <Pressable onPress={() => setActiveCollapsed(prev => !prev)}>
                        <Text style={styles.sectionTitle}>
                            Active Projects {activeCollapsed ? '+' : '-'}
                        </Text>
                    </Pressable>
                    <Collapsible collapsed={activeCollapsed}>
                        {projects
                            .filter(project => project.status === 'active')
                            .map(project => {
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
                    </Collapsible>
                </View>

                {/* On Hold Projects Section */}
                <View style={styles.sectionContainer}>
                    <Pressable onPress={() => setOnHoldCollapsed(prev => !prev)}>
                        <Text style={styles.sectionTitle}>
                            On Hold Projects {onHoldCollapsed ? '+' : '-'}
                        </Text>
                    </Pressable>
                    <Collapsible collapsed={onHoldCollapsed}>
                        {projects
                            .filter(project => project.status === 'onHold')
                            .map(project => {
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
                    </Collapsible>
                </View>

                {/* Completed Projects Section */}
                <View style={styles.sectionContainer}>
                    <Pressable onPress={() => setCompletedCollapsed(prev => !prev)}>
                        <Text style={styles.sectionTitle}>
                            Completed Projects {completedCollapsed ? '+' : '-'}
                        </Text>
                    </Pressable>
                    <Collapsible collapsed={completedCollapsed}>
                        {projects
                            .filter(project => project.status === 'completed')
                            .map(project => {
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
                    </Collapsible>
                </View>

                {/* Uncategorised Projects Section */}
                <View style={styles.sectionContainer}>
                    <Pressable onPress={() => setUncategorisedCollapsed(prev => !prev)}>
                        <Text style={styles.sectionTitle}>Uncategorised Projects {uncategorisedCollapsed ? '+' : '-'}</Text>
                    </Pressable>
                    <Collapsible collapsed={uncategorisedCollapsed}>
                        {projects.filter(project => project.status !== 'active' && project.status !== 'onHold' && project.status !== 'completed').map(project => {
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
                    </Collapsible>
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

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
        paddingTop: 50,
    },
    projectsList: {
        flex: 1,
        marginBottom: 50,
    },
    projectsListHeader: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    projectsListHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.accentColor,
        ...(theme.name === 'signalis' && {
            fontSize: 24,
            fontWeight: 'normal',
            fontFamily: theme.typography.fontFamily.primary,
            textShadowColor: theme.colors.accentColor,
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 10,
        })
    },
    sectionContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 20,
        color: theme.colors.textColorItalic,
        ...(theme.name === 'signalis' && {
            fontSize: 18,
            fontWeight: 'normal',
            fontFamily: theme.typography.fontFamily.primary,
        })
    },
});

export default Projects;