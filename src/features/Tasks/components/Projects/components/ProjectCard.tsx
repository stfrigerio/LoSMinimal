import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from './ProgressBar';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface ProjectCardProps {
    project: any;
    setSelectedProject: (project: any) => void;
    completion: number;
}

export const ProjectCard = ({ project, setSelectedProject, completion }: ProjectCardProps) => {
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);

    const getProgressColor = (completion: number) => {
        if (completion >= 75) return theme.colors.greenOpacity;
        if (completion >= 25) return theme.colors.yellowOpacity;
        return theme.colors.redOpacity;
    };

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
                        backgroundColor={theme.colors.backgroundSecondary}
                        fillColor={getProgressColor(completion)}
                    />
            </View>
            <Text style={styles.projectCompletion}>
                    {completion}%
                </Text>
            </View>
        </Pressable>
    )
}

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
        projectCard: {
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 16,
        },
        projectTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.textColor,
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
            color: theme.colors.textColorItalic,
            minWidth: 8,
        },
    });
}