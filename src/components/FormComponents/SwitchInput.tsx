import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface SwitchInputProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    trueLabel?: string;
    falseLabel?: string;
    trackColorFalse?: string;
    trackColorTrue?: string;
    leftLabelOff?: boolean;
    style?: any;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({ 
    value, 
    onValueChange, 
    trueLabel = 'On', 
    falseLabel = 'Off',
    trackColorFalse,
    trackColorTrue,
    leftLabelOff = false,
    style
}) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <View style={[styles.switchContainer]}>
            <View style={styles.switchWrapper}>
                {!leftLabelOff && (
                    falseLabel ? (
                        <Text style={[styles.switchLabel, !value && styles.activeSwitchLabel]}>
                            {falseLabel}
                        </Text>
                    ) : (
                        <View style={styles.emptyLabel} />
                    )
                )}
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: trackColorFalse, true: trackColorTrue }}
                    thumbColor={theme.colors.accentColor}
                />
                <Text style={[
                    styles.switchLabel, 
                    style,
                    value && styles.activeSwitchLabel,
                    leftLabelOff && styles.fullWidthLabel
                ]}>
                    {trueLabel}
                </Text>
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    switchContainer: {
        width: '100%',
        marginBottom: 10,
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.backgroundColor,
    },
    switchLabel: {
        flex: 1,
        color: theme.colors.gray,
        opacity: 0.6,
        fontSize: 14,
        textAlign: 'center',
        ...(theme.name === 'signalis' && {
            opacity: 1,
            fontSize: 20,
            fontFamily: theme.typography.fontFamily.secondary,
        })
    },
    activeSwitchLabel: {
        opacity: 1,
    },
    emptyLabel: {
        flex: 1,
    },
    fullWidthLabel: {
        flex: 1,
        marginLeft: 10,
    },
});