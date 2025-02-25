import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle, faRotateRight, faTrash, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { Theme } from '@/src/styles/useThemeStyles';
import { ExtendedObjectiveData } from '../../types/ObjectivesSection';

interface ObjectiveCardProps {
    objective: ExtendedObjectiveData;
    theme: Theme;
    onEdit: (objective: ExtendedObjectiveData) => void;
    onToggleCompletion: (uuid: string) => void;
    onPostpone: (uuid: string) => void;
    onDelete: (objective: ExtendedObjectiveData) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
    objective,
    theme,
    onEdit,
    onToggleCompletion,
    onPostpone,
    onDelete
}) => {
    const styles = getStyles(theme);

    return (
        <Pressable
            onPress={() => onEdit(objective)}
        >
            <View style={styles.objectiveItem}>
                <Text style={styles.pillarEmoji}>{objective.pillarEmoji}</Text>

                <Text style={[
                    styles.objectiveText,
                    objective.completed === 1 && styles.completedObjectiveText,
                    objective.completed === 2 && styles.failedObjectiveText
                ]}>
                    {objective.objective}
                </Text>

                <View style={styles.actions}>
                    <Pressable 
                        onPress={() => onToggleCompletion(objective.uuid!)} 
                        style={styles.completionToggle}
                    >
                        <FontAwesomeIcon 
                            icon={
                                objective.completed === 0 ? faCircle :
                                objective.completed === 1 ? faCheckCircle :
                                faXmarkCircle
                            } 
                            color={
                                objective.completed === 0 ? theme.colors.gray :
                                objective.completed === 1 ? theme.colors.accentColor :
                                theme.colors.redOpacity
                            } 
                            size={20} 
                        /> 
                    </Pressable>
                    <Pressable 
                        onPress={() => onPostpone(objective.uuid!)} 
                        style={styles.actionButton}
                    >
                        {({ pressed }) => (
                            <FontAwesomeIcon icon={faRotateRight} color={pressed ? theme.colors.accentColor : theme.colors.gray} size={20} />
                        )}
                    </Pressable>
                    <Pressable 
                        onPress={() => onDelete(objective)} 
                        style={styles.actionButton}
                    >
                        {({ pressed }) => (
                            <FontAwesomeIcon icon={faTrash} color={pressed ? theme.colors.accentColor : theme.colors.gray} size={20} />
                        )}
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

const getStyles = (theme: Theme) => StyleSheet.create({
    objectiveItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
    },
    pillarEmoji: {
        fontSize: 18,
        marginRight: theme.spacing.sm,
    },
    objectiveText: {
        flex: 1,
        fontSize: 12,
        color: theme.colors.textColor,
        ...(theme.name === 'signalis' && {
            fontSize: 18,
            fontFamily: theme.typography.fontFamily.secondary,
        }),
    },
    completedObjectiveText: {
        color: theme.colors.greenOpacity,
    },
    failedObjectiveText: {
        color: theme.colors.redOpacity,
        textDecorationLine: 'line-through',
    },
    completionToggle: {
        width: '10%',
        alignItems: 'center',
        marginRight: '8%',
        marginLeft: '2%',
        padding: 5,
        zIndex: 100,
    },
    actions: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});