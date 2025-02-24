import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface ChecklistItemProps {
    text: string;
    isChecked: boolean;
    onToggle: () => void;
    showActions?: boolean;
    onCreateTask?: (text: string) => void;
    onDelete?: () => void;
    indentLevel: number;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ 
    text, 
    isChecked, 
    onToggle,
    showActions,
    onCreateTask,
    onDelete,
    indentLevel
}) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    const cleanText = text.replace(/^(\s*)- \[[x ]\] /, '');

    return (
        <View style={[styles.container, { marginLeft: indentLevel * 24 }]}>
            <Pressable 
                onPress={onToggle} 
                style={[styles.checklistItem]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <View style={styles.checklistItem}>
                    <View style={[styles.checklistItemCheckbox, { backgroundColor: isChecked ? theme.colors.accentColor : 'transparent' }]}/>
                    <Text 
                        style={[isChecked ? styles.checked : styles.unchecked]}
                        numberOfLines={2}
                    >
                        {cleanText}
                    </Text>
                </View>
            </Pressable>
            
            {showActions && (
                <View style={styles.actions}>
                    <Pressable
                        style={styles.actionButton}
                        onPress={() => onCreateTask?.(cleanText)}
                    >
                        <FontAwesomeIcon icon={faLocationPin} color={theme.colors.gray} />
                    </Pressable>
                    <Pressable
                        style={styles.actionButton}
                        onPress={onDelete}
                    >
                        <FontAwesomeIcon icon={faTrash} color={theme.colors.gray} />
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    checklistItemCheckbox: {
        width: 20,
        height: 20,
        marginRight: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        maxWidth: '100%',
        justifyContent: 'space-between',
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 4,
        flex: 1,
    },
    unchecked: {
        color: theme.colors.textColor,
        flex: 1,
    },
    checked: {
        textDecorationLine: 'line-through',
        color: 'gray',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    actionButton: {
        padding: 10,
    },
});