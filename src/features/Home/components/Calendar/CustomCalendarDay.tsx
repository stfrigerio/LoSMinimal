import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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

    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const isCurrentMonth = date.month === currentMonth;
    // For current month dates:
    //   - In dark mode: use normal text color
    //   - In light mode: use border color (for contrast)
    // For other month dates:
    //   - In dark mode: use faded text color
    //   - In light mode: use gray (for less emphasis)
    const textColor = isCurrentMonth ? 
        theme.name === 'dark' ? 
            theme.colors.textColor : '#d3c6aa' 
        : theme.name === 'dark' ? 
            theme.colors.opaqueTextColor : 'rgba(211, 198, 170, 0.5)';

    return (
        <Pressable 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // <-- Increase tap area
            style={({ pressed }) => [
                styles.container,
                pressed && { 
                    opacity: 0.7,
                    transform: [{ scale: Platform.OS === 'ios' ? 0.95 : 1 }]
                },
            ]} 
            onPress={onPress}
            android_ripple={{ 
                color: theme.colors.accentColor,
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

const getStyles = (theme: Theme) => StyleSheet.create({
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
        fontFamily: theme.typography.fontFamily.primary,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 4,
    },
    todayText: {
        fontSize: theme.name === 'signalis' ? 22 : 16,
        color: theme.colors.accentColor,
        fontWeight: theme.name === 'signalis' ? 'normal' : 'bold',
        fontFamily: theme.typography.fontFamily.secondary,
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