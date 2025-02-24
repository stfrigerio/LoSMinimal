import React from 'react';
import { View, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <View style={styles.buttonAndLabelContainer}>
            <Text style={styles.buttonLabel}>{label}</Text>
            <Pressable 
                style={styles.button} 
                onPress={onPress}
                disabled={disabled || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={theme.colors.accentColor} />
                ) : (
                    <FontAwesomeIcon icon={icon} size={20} color={theme.colors.accentColor} />
                )}
            </Pressable>
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    buttonAndLabelContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 5,
    },
    buttonLabel: {
        color: theme.colors.textColorBold,
        fontSize: 10,
        marginBottom: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        padding: 10,
        borderRadius: 10,
        minWidth: 90,
        justifyContent: 'center',
    },
});

export default BackupActionButton;