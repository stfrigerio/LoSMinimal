import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Markdown from '@/src/components/Markdown/Markdown';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface Project {
    id: string;
    title: string;
    description: string;
    markdown: string;
}

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

    // This is where you'd load your markdown files
    useEffect(() => {
        const loadProjects = async () => {
            try {
                // You'll need to implement this function to read .md files
                // from your project's assets or a specific directory
                const projectFiles = await loadProjectFiles();
                setProjects(projectFiles);
            } catch (error) {
                console.error('Error loading project files:', error);
            }
        };

        loadProjects();
    }, []);

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
                        <Text style={styles.projectDescription}>{project.description}</Text>
                        <View style={styles.markdownPreview}>
                            <Markdown>{project.markdown.slice(0, 200) + '...'}</Markdown>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            {selectedProject && (
                <View style={styles.projectDetail}>
                    <Text style={styles.projectTitle}>{selectedProject.title}</Text>
                    <ScrollView>
                        <Markdown>{selectedProject.markdown}</Markdown>
                    </ScrollView>
                </View>
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
        shadowColor: themeColors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColor,
        marginBottom: 8,
    },
    projectDescription: {
        fontSize: 14,
        color: themeColors.secondaryTextColor,
        marginBottom: 12,
    },
    markdownPreview: {
        borderTopWidth: 1,
        borderTopColor: themeColors.borderColor,
        paddingTop: 12,
    },
    projectDetail: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: themeColors.backgroundColor,
        padding: 16,
    },
});

export default ProjectsScreen;