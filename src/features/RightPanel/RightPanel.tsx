import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import TimeChart from './TimeChart'

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import MusicPlayerControls from '../Music/components/MusicPlayerControls';

const RightPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme } = useThemeStyles();
    const styles = useMemo(() => getStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={theme.name === 'dark' ? 100 : 20} 
                    tint={theme.name === 'dark' ? 'dark' : 'light'} 
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]} 
                />
                <View style={styles.content}>
                    <View style={styles.chartContainer}>
                        <TimeChart />
                    </View>
                </View>
                <View style={{ zIndex: 1000 }}>
                    <MusicPlayerControls />
                </View>
            </ScrollView>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        overflow: 'hidden',
    },
    scrollViewContent: {
        flexGrow: 1,
        minHeight: '100%',
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
        paddingTop: theme.spacing.md,
        zIndex: 1000,
        height: '100%',
    },
    chartContainer: {
        borderColor: 'black',
        borderRadius: theme.borderRadius.sm,
        backgroundColor: 'transparent',
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 20, 
    },
    button: {
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        borderRadius: theme.borderRadius.sm,
        marginVertical: theme.spacing.xs,
    },
    buttonText: {
        alignSelf: 'center',
        color: theme.colors.textColor,
    },
    musicControlsContainer: {
        marginVertical: theme.spacing.xs
    }
});

export default RightPanel;