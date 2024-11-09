import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface CustomDayProps {
    date?: { day: number; month: number; year: number; timestamp: number; dateString: string };
    marking?: { dots?: Array<{ key: string; color: string }> };
    onPress?: () => void;
    currentMonth: number; 
    isToday: boolean;
}

const CustomDay: React.FC<CustomDayProps> = ({ date, marking, onPress, currentMonth, isToday }) => {
    if (!date) {
        return <View />;
    }

    const { themeColors, theme } = useThemeStyles();
    const styles = getStyles(themeColors);

    const isCurrentMonth = date.month === currentMonth;
    const textColor = isCurrentMonth ? 
        theme === 'dark' ? 
            themeColors.textColor : themeColors.borderColor 
        : theme === 'dark' ? 
            themeColors.opaqueTextColor : themeColors.gray;

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.container,
                pressed && { opacity: 0.7 },
            ]} 
            onPress={onPress}
            android_ripple={{ 
                color: themeColors.accentColor,
                radius: 16,
            }}
        >
            <View style={[styles.contentContainer, isToday && styles.todayContainer]}>
                <Text style={[
                    styles.text, 
                    { color: textColor },
                    isToday && styles.todayText
                ]}>
                    {date.day}
                </Text>
                <View style={styles.dotsContainer}>
                    {marking?.dots ? (
                        marking.dots.map((dot, index) => (
                            <View
                                key={dot.key}
                                style={[styles.dot, { backgroundColor: dot.color }]}
                            />
                        ))
                    ) : (
                        <View style={styles.fakeDot} />
                    )}
                </View>
            </View>
        </Pressable>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 4,
    },
    todayText: {
        fontSize: 16,
        color: theme.textColorItalic,
        fontWeight: 'bold'
    },
    todayContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 1,
    },
    fakeDot: {
        width: 4,
        height: 4,
        opacity: 0,
    },
});

export default CustomDay;