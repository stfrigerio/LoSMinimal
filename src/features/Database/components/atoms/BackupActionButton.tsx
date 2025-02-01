import React from 'react';
import { View, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface BackupActionButtonProps {
    label: string;
    icon: IconDefinition;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const BackupActionButton = ({ 
    label, 
    icon, 
    onPress, 
    isLoading = false,
    disabled = false 
}: BackupActionButtonProps) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <View style={styles.buttonAndLabelContainer}>
            <Text style={styles.buttonLabel}>{label}</Text>
            <Pressable 
                style={styles.button} 
                onPress={onPress}
                disabled={disabled || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={themeColors.accentColor} />
                ) : (
                    <FontAwesomeIcon icon={icon} size={20} color={themeColors.accentColor} />
                )}
            </Pressable>
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    buttonAndLabelContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 5,
    },
    buttonLabel: {
        color: themeColors.textColorBold,
        fontSize: 10,
        marginBottom: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        padding: 10,
        borderRadius: 10,
        minWidth: 90,
        justifyContent: 'center',
    },
});

export default BackupActionButton;