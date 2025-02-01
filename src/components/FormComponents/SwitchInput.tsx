import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface SwitchInputProps {
    label: string;
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
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <View style={[styles.switchContainer]}>
            <View style={styles.switchWrapper}>
                {!leftLabelOff && (
                    falseLabel ? (
                        <Text style={[styles.switchLabel, !value && styles.activeSwitchLabel]}>{falseLabel}</Text>
                    ) : (
                        <View style={styles.emptyLabel} />
                    )
                )}
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: trackColorFalse, true: trackColorTrue }}
                    thumbColor={themeColors.accentColor}
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

const getStyles = (themeColors: any) => StyleSheet.create({
    switchContainer: {
        width: '100%',
        marginBottom: 10,
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.backgroundColor,
    },
    switchLabel: {
        flex: 1,
        color: themeColors.gray,
        opacity: 0.6,
        fontSize: 14,
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