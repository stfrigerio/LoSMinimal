import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import QuantifiableHabit from './QuantifiableHabit';

import { capitalize } from '@/src/utils/textManipulations';
import { habitThresholds, getColorForValue } from './helpers/colors';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { QuantifiableHabitsData } from '@/src/types/QuantifiableHabits';
import { useQuantifiableHabits } from '@/src/features/DailyNote/helpers/useQuantifiableHabits';

export interface QuantifiableHabitsProps {
    data: QuantifiableHabitsData[];
    date: string;
    quantifiableHabitsName: boolean;
}

const QuantifiableHabits: React.FC<QuantifiableHabitsProps> = ({ data, date, quantifiableHabitsName }) => {
    const { habits, emojis, handleIncrement, handleDecrement } = useQuantifiableHabits(data, date);
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    //^ My personal shit
    const habitOrder = ['Cigarettes', 'Herbs', 'Coffees', 'Alcohols'];
    const sortedHabits = (Object.entries(habits ?? {}) as [string, { uuid: string; value: number }][]).sort((a, b): number => {
        const orderA = habitOrder.indexOf(a[0]);
        const orderB = habitOrder.indexOf(b[0]);

        if (orderA !== -1 && orderB !== -1) {
            return orderA - orderB;
        }
        if (orderA === -1) {
            return 1;
        }
        if (orderB === -1) {
            return -1;
        }
        return a[0].localeCompare(b[0]);
    });

    return (
        <View style={styles.QuantifiableHabitsContainer}>
            {sortedHabits.map(([key, habitData]) => {
                const emoji = emojis[key] || '';
                const habitName = capitalize(key);

                const color = getColorForValue(
                    key as keyof typeof habitThresholds,
                    habitData.value,
                    theme.name === 'dark' ? 'rgba(250, 37, 37, 0.8)' : 'rgba(220, 37, 37, 0.8)',
                    theme.name === 'dark' ? 'rgba(204, 197, 20, 0.9)' : 'rgba(184, 167, 20, 0.9)',
                    theme.name === 'dark' ? 'rgba(61, 247, 52, 0.5)' : 'rgba(61, 157, 52, 0.5)',
                    theme.colors.textColor
                );

                return (
                    <QuantifiableHabit
                        key={key}
                        emoji={emoji}
                        name={habitName}
                        value={habitData.value}
                        color={color}
                        showName={quantifiableHabitsName}
                        onIncrement={() => handleIncrement(habitData.uuid, key)}
                        onDecrement={() => handleDecrement(habitData.uuid, key)}
                    />
                );
            })}
        </View>
    );
};

export default QuantifiableHabits;

const getStyles = (theme: Theme) => StyleSheet.create({
    QuantifiableHabitsContainer: {
        flex: 1,
        marginTop: 10,
        padding: 10,
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: 16,
        marginVertical: 10,
        // shadowColor: theme.shadowColor,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 3,
    },
});