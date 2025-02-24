import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
export type BooleanHabitProps = {
    name: React.ReactNode;
    value: boolean;
    setValue: () => void;
};

const Habit: React.FC<BooleanHabitProps> = ({ name, value, setValue }) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme, value);

    return (
        <View style={styles.habit}>
            <View style={styles.habitNameContainer}>{name}</View>
            <Switch
                value={value}
                onValueChange={setValue}
                trackColor={{ false: theme.colors.gray, true: theme.colors.greenOpacity }}
                thumbColor={value ? theme.colors.backgroundSecondary : theme.colors.backgroundSecondary}
                ios_backgroundColor={theme.colors.gray}
            />
        </View>
    );
};

const getStyles = (theme: Theme, value: boolean) => StyleSheet.create({
    habit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
    },
    habitNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        marginLeft: 25,
        flexShrink: 1,
    },
    habitName: {
        marginRight: 10, 
        fontSize: 18,
        color: theme.colors.textColor
    },
});

export default Habit;
