import React, { useRef } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faChevronDown, faChevronUp, faEdit } from '@fortawesome/free-solid-svg-icons';
import Collapsible from '@/src/components/Collapsible';
import { ChecklistData, ChecklistProps } from '../types';
import ChecklistItem from './ChecklistItem';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface SingleChecklistProps {
    checklistData: ChecklistData;
    tasks: ChecklistProps['tasks'];
    inputText: string;
    onInputChange: (text: string, checklistName: string) => void;
    onAddItem: (checklistName: string) => void;
    onToggleItem: (task: any) => void;
    onDeleteTask: (uuid: string) => void;
    onEdit: (checklist: ChecklistData) => void;
    onToggleCollapse: (name: string) => void;
}

const SingleChecklist: React.FC<SingleChecklistProps> = ({
    checklistData,
    tasks,
    inputText,
    onInputChange,
    onAddItem,
    onToggleItem,
    onDeleteTask,
    onEdit,
    onToggleCollapse,
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(designs), [designs]);
    const inputRef = useRef<TextInput>(null);
    const filteredTasks = tasks
        .filter(task => task.type === `checklist_${checklistData.name}`)
        .reverse();

    const handleAddItem = (checklistName: string, isKeyboardSubmit = false) => {
        onAddItem(checklistName);
        if (isKeyboardSubmit) {
            // Small delay to ensure state updates are processed
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        } else {
            inputRef.current?.focus();
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.backgroundSecondary }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.textColor }]}>{checklistData.name}</Text>
                <View style={styles.headerIcons}>
                    <Pressable onPress={() => onEdit(checklistData)} style={styles.headerIcon}>
                        <FontAwesomeIcon icon={faEdit} color={themeColors.textColor} size={18} />
                    </Pressable>
                    <Pressable onPress={() => onToggleCollapse(checklistData.name)} style={styles.headerIcon}>
                        <FontAwesomeIcon 
                            icon={checklistData.collapsed ? faChevronDown : faChevronUp} 
                            color={themeColors.textColor} 
                            size={18} 
                        />
                    </Pressable>
                </View>
            </View>
            <Collapsible collapsed={checklistData.collapsed}>
                <View style={[styles.addItemContainer, { backgroundColor: `${themeColors.backgroundSecondary}CC` }]}>
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { color: themeColors.textColor, backgroundColor: `${themeColors.backgroundSecondary}99` }]}
                        value={inputText}
                        onChangeText={(text) => onInputChange(text, checklistData.name)}
                        placeholder="Add new item"
                        placeholderTextColor={`${themeColors.textColor}99`}
                        onSubmitEditing={() => handleAddItem(checklistData.name, true)}
                    />
                    <Pressable onPress={() => handleAddItem(checklistData.name)} style={styles.addButton}>
                        <FontAwesomeIcon icon={faPlus} color={themeColors.textColor} size={20} />
                    </Pressable>
                </View>
                {filteredTasks.map(task => (
                    <ChecklistItem
                        key={task.uuid}
                        task={task}
                        textColor={themeColors.textColor}
                        onToggle={onToggleItem}
                        onDelete={onDeleteTask}
                    />
                ))}
            </Collapsible>
        </View>
    );
};

const getStyles = (designs: any) => StyleSheet.create({
    container: {
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    title: {
        ...designs.text.subtitle,
        marginBottom: 0,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    headerIcon: {
        padding: 5,
        marginLeft: 10,
    },
    addItemContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 10
    },
    input: {
        flex: 1,
        ...designs.text.text,
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

export default SingleChecklist; 