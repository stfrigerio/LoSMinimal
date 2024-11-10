import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import QuantifiableHabit from './QuantifiableHabit';

import { capitalize } from '@/src/utils/textManipulations';
import { habitThresholds, getColorForValue } from './helpers/colors';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { QuantifiableHabitsData } from '@/src/types/QuantifiableHabits';
import { useQuantifiableHabits } from '@/app/(drawer)/features/DailyNote/helpers/useQuantifiableHabits';

export interface QuantifiableHabitsProps {
    data: QuantifiableHabitsData[];
    date: string;
    quantifiableHabitsName: boolean;
}

const QuantifiableHabits: React.FC<QuantifiableHabitsProps> = ({ data, date, quantifiableHabitsName }) => {
    const { habits, emojis, handleIncrement, handleDecrement } = useQuantifiableHabits(data, date);
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    //^ My personal shit
    const habitOrder = ['Cigarettes', 'Herbs', 'Coffees', 'Alcohols'];
    const sortedHabits = Object.entries(habits ?? {}).sort((a, b) => {
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
                    'rgba(250, 37, 37, 0.8)',
                    'rgba(204, 197, 20, 0.9)',
                    'rgba(61, 247, 52, 0.5)',
                    themeColors.textColor
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

const getStyles = (theme: any) => StyleSheet.create({
    QuantifiableHabitsContainer: {
        flex: 1,
        marginTop: 10,
        padding: 15,
    },
});