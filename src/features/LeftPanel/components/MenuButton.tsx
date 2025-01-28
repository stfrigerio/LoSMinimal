import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useTheme } from '@/src/contexts/ThemeContext';

interface MenuButtonProps {
    icon: IconDefinition;
    label: string;
    onPress: () => void;
    onLongPress?: () => void;
    color?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress, onLongPress, color }) => {
    const { themeColors, designs } = useThemeStyles();
    const { theme } = useTheme();
    const styles = getStyles(themeColors, theme);

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
            ]}
            onLongPress={onLongPress}
        >
            {({ pressed }) => (
                <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                        <FontAwesomeIcon 
                            icon={icon} 
                            size={20}
                            color={pressed ? themeColors.accentColor : color || themeColors.gray}
                        />
                    </View>
                    <Text style={[
                        designs.text.text,
                        styles.buttonText,
                        { color: theme === 'dark' ? themeColors.textColor : themeColors.textColor }
                    ]}>
                        {label}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

const getStyles = (themeColors: any, theme: any) => StyleSheet.create({
    button: {
        padding: 10,
        paddingVertical: 20,
        borderRadius: 12,
        backgroundColor: theme === 'light' ? `${themeColors.backgroundColor}CC` : `${themeColors.borderColor}E6`,
        marginVertical: 16, 
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: theme === 'light' ? 'transparent' : themeColors.backgroundColor,
        flex: 1, 
    },
    buttonPressed: {
        backgroundColor: `${themeColors.backgroundColor}EE`,
        transform: [{ scale: 0.95 }],
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        width: 40, 
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 12,
        flex: 1,
        fontWeight: '700',
    },
});