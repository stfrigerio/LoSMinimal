import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface ChecklistItemProps {
    text: string;
    isChecked: boolean;
    onToggle: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ text, isChecked, onToggle }) => {
    const { themeColors } = useThemeStyles();

    return (
        <Pressable onPress={onToggle} style={styles.checklistItem}>
            <Text style={isChecked ? styles.checked : styles.unchecked}>
                {isChecked ? '☑' : '☐'} {text.replace(/- \[[x ]\] /, '')}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    checked: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    unchecked: {
        color: 'black',
    },
});