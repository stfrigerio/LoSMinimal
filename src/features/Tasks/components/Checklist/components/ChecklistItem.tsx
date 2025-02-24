import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ChecklistItemProps } from '../types';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';

const ChecklistItem: React.FC<ChecklistItemProps> = ({ 
    task, 
    onToggle, 
    onDelete,
    textColor
}) => {
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(designs), [designs]);

    return (
        <View style={styles.itemContainer}>
            <Pressable 
                onPress={() => onToggle(task)} 
                style={styles.checklistItem}
                hitSlop={8}  // Added for better touch target
            >
                <FontAwesomeIcon 
                    icon={task.completed ? faCheckCircle : faCircle} 
                    color={task.completed ? theme.colors.accentColor : textColor} 
                    size={20} 
                    style={styles.checkIcon}
                />
                <Text 
                    style={[
                        styles.itemText, 
                        { color: theme.colors.textColor }, 
                        task.completed && styles.completedText
                    ]}
                    numberOfLines={2}  // Added to handle long text
                >
                    {task.text}
                </Text>
            </Pressable>
            <Pressable 
                onPress={() => onDelete(task.uuid!)} 
                style={styles.deleteButton}
                hitSlop={8}  // Added for better touch target
            >
                <FontAwesomeIcon icon={faTrash} color={textColor} size={18} />
            </Pressable>
        </View>
    );
};

const getStyles = (designs: any) => StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8
    },
    checklistItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        marginRight: 12
    },
    itemText: {
        ...designs.text.text,
        flex: 1,
        paddingRight: 8
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.6
    },
    deleteButton: {
        padding: 8,
        marginLeft: 4
    },
});

export default ChecklistItem;