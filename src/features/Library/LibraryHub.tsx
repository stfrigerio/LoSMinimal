import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';

import LibrarySettings from './components/LibrarySettings/LibrarySettings';
import { Stats } from './components/Stats';
import { RecentActivity } from './components/RecentActivity';
import { MediaGrid } from './components/MediaGrid';
import { Welcome } from './components/Welcome';

import { LibraryChart } from '@/src/components/charts/StackBar/LibraryChart';

import { mediaTypes } from './constants/mediaTypes';
import { Theme, useThemeStyles } from '../../styles/useThemeStyles';
import { useLibraryHub } from './hooks/useLibraryHub';
import { router } from 'expo-router';

const LibraryHub: React.FC = () => {
    const [isDashboard, setIsDashboard] = useState(true);
    const [currentSection, setCurrentSection] = useState<number | null>(0);

    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    const { isLoading, error, stats, recentActivity, weeklyActivity } = useLibraryHub();

    const navigateToSection = (index: number) => {
        const typeMap = ['movie', 'series', 'book', 'videogame', 'music'];
        setCurrentSection(index);
        setIsDashboard(false);
        if (index < 5) { // Don't navigate for settings
            router.push(`/library/${typeMap[index]}`);
        }
    };

    const navItems = ['Movies', 'Series', 'Books', 'Videogames', 'Music', 'Settings'].map((title, index) => ({
        label: title,
        onPress: () => navigateToSection(index)
    }));

    const Dashboard = () => (
        <ScrollView style={styles.dashboardContainer}>
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.textColor} />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <>
                    <Welcome />
                    <MediaGrid 
                        mediaTypes={mediaTypes} 
                        navItems={navItems}
                        onNavigate={navigateToSection}
                    />
                    <Stats stats={stats} />
                    <LibraryChart weeklyData={weeklyActivity} />
                    <RecentActivity 
                        recentActivity={recentActivity} 
                    />
                </>
            )}
        </ScrollView>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                {isDashboard ? (
                    <Dashboard />
                ) : ( // Settings
                    <LibrarySettings onBackPress={() => setIsDashboard(true)}/>
                )}
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    // Keep only the main container styles here
    mainContainer: {
        paddingTop: 37,
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
        marginBottom: 20
    },
    dashboardContainer: {
        flex: 1,
    },
    errorText: {
        color: theme.colors.red,
        textAlign: 'center',
        padding: 16,
        fontSize: 16,
    },
});

export default LibraryHub;