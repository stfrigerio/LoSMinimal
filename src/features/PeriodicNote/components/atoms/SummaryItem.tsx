import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Theme, useThemeStyles } from "../../../../styles/useThemeStyles";

const SummaryItem = ({ 
    title, 
    value, 
    change, 
    isPercentage, 
    isTime 
}: { 
    title: string; 
    value: string; 
    change?: number; 
    isPercentage?: boolean;
    isTime?: boolean;
}) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    
    return (
        <View style={styles.summaryItem}>
            <Text style={styles.summaryItemTitle}>{title}</Text>
            <View style={styles.summaryItemValueContainer}>
                <Text style={styles.summaryItemValue}>{value}</Text>
                {change !== undefined && (
                    <Text style={[styles.changeText, { color: change >= 0 ? 'red' : 'green' }]}>
                        {change >= 0 ? '+' : ''}
                        {isPercentage ? `${change.toFixed(1)}%` : 
                            isTime ? `${Math.abs(change).toFixed(2)}` : 
                            `€${Math.abs(change).toFixed(2)}`}
                    </Text>
                )}
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) => {
    return StyleSheet.create({
        summaryItem: {
            width: '48%',
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.backgroundSecondary,
        },
        summaryItemTitle: {
            fontSize: 14,
            color: theme.colors.gray,
            marginBottom: 5,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: 12,
                color: theme.colors.gray,
            })
        },
        summaryItemValue: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.colors.textColor,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.secondary,
                fontSize: 18,
                color: theme.colors.textColor,
                fontWeight: 'normal',
                textShadowColor: theme.colors.textColorBold,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 12,
            })
        },
        summaryItemValueContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        changeText: {
            fontSize: 10,
            fontWeight: 'bold',
            marginLeft: 5,
        },
    });
};

export default SummaryItem;