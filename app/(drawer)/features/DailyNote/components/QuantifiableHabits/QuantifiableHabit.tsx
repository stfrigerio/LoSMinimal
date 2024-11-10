import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

type QuantifiableHabitProps = {
    emoji: string;
    name: string;
    value: number;
    color: string;
    onIncrement: () => void;
    onDecrement: () => void;
    showName: boolean;
};

const QuantifiableHabit: React.FC<QuantifiableHabitProps> = ({ emoji, name, value, color, onIncrement, onDecrement, showName }) => {
    const { themeColors } = useThemeStyles();

    const getStyles = (theme: any) => StyleSheet.create({
        habit: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        nameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flexGrow: 1,
            marginLeft: 25,
            flexShrink: 1,
        },
        emoji: {
            fontSize: 20,
            marginRight: 8,
            marginBottom: 6,
        },
        habitName: {
            color: theme.textColor,
            fontSize: 14,
            textAlignVertical: 'center',
        },
        habitValue: {
            width: 44,
            textAlign: 'center',
            marginRight: 5,
            color: color,
            lineHeight: 24,
        },
        button: {
            padding: 8,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            color: theme.gray,
            fontSize: 20,
        },
    });

    const styles = getStyles(themeColors);

    return (
        <View style={styles.habit}>
            <View style={styles.nameContainer}>
                <Text style={styles.emoji}>{emoji}</Text>
                {showName && <Text style={styles.habitName}>{name}</Text>}
            </View>
            <Pressable 
                style={[styles.button]} 
                onPress={onDecrement} 
                android_ripple={{ 
                    color: themeColors.accentColor,
                    radius: 20
                }}>
                <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.habitValue}>{value}</Text>
            <Pressable 
                style={[styles.button]} 
                onPress={onIncrement} 
                android_ripple={{ 
                    color: themeColors.accentColor,
                    radius: 20 
                }}>
                <Text style={styles.buttonText}>+</Text>
            </Pressable>
        </View> 
    );
}

export default QuantifiableHabit;

