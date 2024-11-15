import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface MenuButtonProps {
    icon: IconDefinition;
    label: string;
    onPress: () => void;
    color?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress, color }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
            ]}
        >
            {({ pressed }) => (
                <View style={styles.buttonContent}>
                    <FontAwesomeIcon 
                        icon={icon} 
                        size={20}
                        color={pressed ? themeColors.greenOpacity : color || themeColors.gray}
                    />
                    <Text style={[
                        designs.text.text,
                        styles.buttonText,
                        { color: pressed ? themeColors.textColor : themeColors.textColor }
                    ]}>
                        {label}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 12,
        backgroundColor: `${themeColors.backgroundColor}CC`,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    buttonPressed: {
        backgroundColor: `${themeColors.backgroundColor}EE`,
        transform: [{ scale: 0.98 }],
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
});