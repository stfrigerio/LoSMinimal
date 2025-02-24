import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import { ExtendedTaskData } from '@/src/types/Task';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface TaskViewProps {
    item: ExtendedTaskData;
    toggleItemCompletion: (id: number, completed: boolean) => Promise<void>;
    onDelete: (uuid: string) => void;
    onLongPress: () => void;
    onPostpone: (task: ExtendedTaskData) => void;
}

const TaskView: React.FC<TaskViewProps> = ({
    item,
    toggleItemCompletion,
    onDelete,
    onLongPress,
    onPostpone,
}) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    const formatDateTimeDisplay = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const handlePress = () => {
        toggleItemCompletion(item.id!, item.completed);
    };

    return (
        <View style={styles.container}>
            <Pressable 
                onPress={handlePress}
                onLongPress={onLongPress}
                delayLongPress={500}
                style={styles.contentContainer}
            >
                <View style={[styles.circle, item.completed ? styles.completedCircle : null]} />
                <View style={styles.dueHourContainer}>
                    <Text style={[item.completed ? styles.completedText : styles.dueText]}>
                        {item.due
                            ? formatDateTimeDisplay(item.due).split(' ')[1].split(':').slice(0, 2).join(':')
                            : 'No due'
                        }
                    </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.textContainer}>
                    <Text style={[item.completed ? styles.completedText : designs.text.text, { fontSize: 12, textAlign: 'left' }]} numberOfLines={2} ellipsizeMode="tail">
                        {item.text}
                    </Text>
                </View>
            </Pressable>
            {!item.completed ? (
                <Pressable onPress={() => onPostpone(item)} style={[styles.iconButton, { marginRight: 5 }]}>
                    {({ pressed }) => (
                        <FontAwesomeIcon 
                            icon={faRotateRight} 
                            color={pressed ? theme.colors.accentColor : theme.colors.gray} 
                            size={15} 
                        />
                    )}
                </Pressable>
            ) : (
                <View style={[styles.iconButton, { marginRight: 15 }]} />
            )}
            <Pressable onPress={() => onDelete(item.uuid!)} style={styles.iconButton}>
                {({ pressed }) => (
                    <FontAwesomeIcon 
                        icon={faTrash} 
                        color={pressed ? theme.colors.accentColor : theme.colors.gray} 
                        size={15} 
                    />
                )}
            </Pressable>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    circle: {
        height: 18,
        width: 18,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.borderColor,
    },
    completedCircle: {
        backgroundColor: theme.colors.greenOpacity,
    },
    dueHourContainer: {
        width: '20%',
        alignItems: 'center',
        marginLeft: 5,
    },
    dueText: {
        fontSize: 12,
        color: theme.colors.textColorItalic,
    },
    separator: {
        width: 1,
        height: 50,
        backgroundColor: theme.colors.borderColor,
        marginHorizontal: 6,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    deleteIcon: {
        padding: 10,
    },
    iconButton: {
        padding: 10,
    },
    completedText: {
        fontSize: 12,
        color: theme.colors.gray,
        textDecorationLine: 'line-through',
    },
});

export default TaskView;