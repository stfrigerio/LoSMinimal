import React from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface ButtonProps {
    onPress: () => void;
    text: string;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ 
    onPress, 
    text, 
    variant = 'primary',
    disabled = false 
}) => {
    const { theme, themeColors } = useThemeStyles();
    const animatedScale = new Animated.Value(1);
    const styles = getStyles(themeColors);

    const handlePressIn = () => {
        Animated.spring(animatedScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animatedScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                    disabled && styles.disabled,
                ]}
            >
                <Text style={styles.buttonText}>
                    {text}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: themeColors.accentColor,
        borderWidth: 2,
        borderColor: themeColors.borderColor,
        borderRadius: 10,
    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
});