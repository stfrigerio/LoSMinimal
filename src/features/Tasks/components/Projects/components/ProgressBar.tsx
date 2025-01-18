import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

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
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

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

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});