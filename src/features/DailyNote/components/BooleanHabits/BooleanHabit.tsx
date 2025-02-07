import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

export type BooleanHabitProps = {
    name: React.ReactNode;
    value: boolean;
    setValue: () => void;
};

const Habit: React.FC<BooleanHabitProps> = ({ name, value, setValue }) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors, value);

    return (
        <View style={styles.habit}>
            <View style={styles.habitNameContainer}>{name}</View>
            <Switch
                value={value}
                onValueChange={setValue}
                trackColor={{ false: themeColors.gray, true: themeColors.greenOpacity }}
                thumbColor={value ? themeColors.backgroundSecondary : themeColors.backgroundSecondary}
                ios_backgroundColor={themeColors.gray}
            />
        </View>
    );
};

const getStyles = (theme: any, value: boolean) => StyleSheet.create({
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
        color: theme.textColor
    },
});

export default Habit;
