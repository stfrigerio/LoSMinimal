import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface HeaderActionsProps {
    handleAddProject: () => void;
    handleExportProjects: () => void;
    handleImportProjects: () => void;
}

export const HeaderActions = ({ handleAddProject, handleExportProjects, handleImportProjects }: HeaderActionsProps) => {
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);

    return (
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
                        color={theme.colors.accentColor} 
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
                        color={theme.colors.accentColor} 
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
                        color={theme.colors.accentColor} 
                    />
                    <Text style={styles.iconText}>Import</Text>
                </View>
            </Pressable>
        </View>
    )
}

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
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
            color: theme.colors.gray,
        },
        iconButtonPressed: {
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: 16,
            opacity: 0.7,
        },
    });
}