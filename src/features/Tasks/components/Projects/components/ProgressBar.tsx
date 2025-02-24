import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface ProgressBarProps {
    progress: number;  // 0 to 100
    height?: number;
    backgroundColor?: string;
    fillColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 8,
    backgroundColor = '#E0E0E0',
    fillColor = '#4CAF50',
}) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <View style={[styles.container, { height, backgroundColor }]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${Math.min(Math.max(progress, 0), 100)}%`,
                        backgroundColor: fillColor,
                    },
                ]}
            />
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});