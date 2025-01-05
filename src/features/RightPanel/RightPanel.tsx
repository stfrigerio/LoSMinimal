import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import TimeChart from './TimeChart'

import { useThemeStyles } from '@/src/styles/useThemeStyles';

const RightPanel: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = useMemo(() => getStyles(themeColors, theme), [themeColors, theme]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BlurView 
                    intensity={theme === 'dark' ? 100 : 30} 
                    tint={theme === 'dark' ? 'dark' : 'light'} 
                    style={[StyleSheet.absoluteFill, { zIndex: 1 }]} 
                />
                <View style={styles.content}>
                    <View style={styles.chartContainer}>
                        <TimeChart />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const getStyles = (themeColors: any, theme: 'dark' | 'light') => StyleSheet.create({
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
        padding: 20,
        paddingTop: 50,
        zIndex: 1000,
        height: '100%',
    },
    chartContainer: {
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 20, 
    },
    button: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginVertical: 4,
    },
    buttonText: {
        alignSelf: 'center',
        color: themeColors.textColor,
    },
    musicControlsContainer: {
        marginVertical: 10
    }
});

export default RightPanel;