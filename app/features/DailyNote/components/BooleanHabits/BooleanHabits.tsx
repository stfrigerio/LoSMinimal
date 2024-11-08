import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import Habit from './Habit';
import { capitalize } from '@/src/utils/textManipulations';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { useBooleanHabits } from '@/app/features/DailyNote/helpers/useBooleanHabits';

import { BooleanHabitsData } from '@/src/types/BooleanHabits';

export interface BooleanHabitsProps {
    data?: BooleanHabitsData[];
    date: string
    booleanHabitsName?: boolean;
}

const BooleanHabits: React.FC<BooleanHabitsProps> = ({ data, date, booleanHabitsName }) => {
    const { habits, emojis, handleToggle } = useBooleanHabits(data, date);
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const renderHabitName = (habit: { key: string }) => {
        const emoji = emojis[habit.key] || '';
        const name = capitalize(habit.key);

        if (booleanHabitsName) {
            return (
                <View style={styles.habitNameContainer}>
                    {emoji && <Text style={styles.emoji}>{emoji}</Text>}
                    <Text style={styles.habitName}>{name}</Text>
                </View>
            );
        } else {
            return <Text style={styles.habitName}>{emoji || name}</Text>;
        }
    };

    return (
        <View style={styles.BooleanHabitsContainer}>
            {habits.map((habit, index) => (
                <React.Fragment key={habit.key}>
                    <Habit 
                        name={renderHabitName(habit)}
                        value={habit.value} 
                        setValue={() => handleToggle(habit.uuid!, habit.key)}
                    />
                    {index < habits.length - 1 && <View style={styles.separator} />}
                </React.Fragment>
            ))}
        </View>
    );
};

export default BooleanHabits;

const getStyles = (theme: any) => StyleSheet.create({
    BooleanHabitsContainer: {
        flex: 1,
        marginTop: 10,
        padding: 15,
    },
    separator: {
        height: 1,
        backgroundColor: theme.borderColor,
        marginVertical: 4, 
    },
    habitNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emoji: {
        marginRight: 8,
        fontSize: 18,
    },
    habitName: {
        fontSize: 14,
        color: theme.textColor,
    },
});