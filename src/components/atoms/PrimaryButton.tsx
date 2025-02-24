import React from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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
    disabled = false,
}) => {
    const { theme } = useThemeStyles();
    const animatedScale = new Animated.Value(1);
    const styles = getStyles(theme, variant);

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

const getButtonColor = (theme: any, variant: string) => {
    if (variant === 'primary') {
        return theme.name === 'dark' ? theme.colors.textColor : theme.colors.backgroundSecondary;
    }
    return theme.colors.accentColor;
}

const getStyles = (theme: Theme, variant: string) => StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,  
        backgroundColor: getButtonColor(theme, variant),
        borderWidth: theme.name === 'dark' ? 2 : 1,
        borderColor: theme.colors.borderColor,
        borderRadius: 10,
        minWidth: 120,  
    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        alignSelf: 'center',
        color: theme.name === 'dark' ? theme.colors.backgroundColor : theme.colors.textColor,
        fontWeight: 'bold',
    },
});