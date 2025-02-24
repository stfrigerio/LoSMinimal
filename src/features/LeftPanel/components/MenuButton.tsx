import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface MenuButtonProps {
    icon: IconDefinition;
    label: string;
    onPress: () => void;
    onLongPress?: (event: any) => void;
    color?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress, onLongPress, color }) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
            ]}
            onLongPress={(event) => onLongPress?.(event)}
        >
            {({ pressed }) => (
                <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                        <FontAwesomeIcon 
                            icon={icon} 
                            size={20}
                            color={pressed ? theme.colors.accentColor : color || theme.colors.gray}
                        />
                    </View>
                    <Text style={[
                        designs.text.text,
                        styles.buttonText,
                        { color: theme.colors.textColor }
                    ]}>
                        {label}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    button: {
        padding: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.name === 'light' ? `${theme.colors.backgroundColor}CC` : `${theme.colors.borderColor}E6`,
        marginVertical: theme.spacing.md, 
        marginHorizontal: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.name === 'light' ? 'transparent' : theme.colors.backgroundColor,
        flex: 1, 
    },
    buttonPressed: {
        backgroundColor: `${theme.colors.backgroundColor}EE`,
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