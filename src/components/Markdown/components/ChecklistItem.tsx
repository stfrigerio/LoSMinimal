import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface ChecklistItemProps {
    text: string;
    isChecked: boolean;
    onToggle: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ text, isChecked, onToggle }) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <Pressable 
            onPress={onToggle} 
            style={styles.checklistItem}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Add this to make it easier to tap
        >
            <View style={styles.checklistItem}>
                <View style={[styles.checklistItemCheckbox, { backgroundColor: isChecked ? themeColors.accentColor : 'transparent' }]}/>
                <Text style={isChecked ? styles.checked : styles.unchecked}>
                    {text.replace(/- \[[x ]\] /, '')}
                </Text>
            </View>
        </Pressable>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4, // Increased for better touch target
        paddingHorizontal: 4,
    },
    checklistItemCheckbox: {
        width: 20,
        height: 20,
        marginRight: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    checked: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    unchecked: {
        color: themeColors.textColor
    },
});