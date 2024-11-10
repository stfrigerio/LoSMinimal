import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

// Define a type for the props
type QuantifiableHabitProps = {
    name: string;
    value: number;
    color: string;
    onIncrement: () => void;
    onDecrement: () => void;
};

const QuantifiableHabit: React.FC<QuantifiableHabitProps> = ({ name, value, color, onIncrement, onDecrement }) => {
    const { theme, themeColors, designs } = useThemeStyles();

    const getStyles = (theme: any) => StyleSheet.create({
        habit: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
        },
        habitName: {
            flexGrow: 1,
            marginLeft: 25,
            flexShrink: 1,
            color: theme.textColor,
            fontSize: 18, // Adjust font size for emojis
            textAlignVertical: 'center', // Align text vertically
        },
        habitValue: {
            width: 44,
            textAlign: 'center',
            marginRight: 5,
            color: color,
            lineHeight: 24, // Align text vertically
        },
        button: {
            padding: 8,
            width: 40, // Fixed width for buttons
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            color: theme.textColor,
            fontSize: 20,
        },
    });

    const styles = getStyles(themeColors);

    return (
        <View style={styles.habit}>
            <Text style={styles.habitName}>{`${name}`}</Text>
            <Pressable style={[styles.button]} onPress={onDecrement}>
                <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.habitValue}>{value}</Text>
            <Pressable style={[styles.button]} onPress={onIncrement}>
                <Text style={styles.buttonText}>+</Text>
            </Pressable>
        </View>
    );
}

export default QuantifiableHabit;

