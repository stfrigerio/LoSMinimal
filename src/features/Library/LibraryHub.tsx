import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';

import Navbar from '@/src/components/NavBar';
import DetailedView from './components/MediaList/components/DetailedView';
import { Stats } from './components/Stats';
import { RecentActivity } from './components/RecentActivity';
import { MediaGrid } from './components/MediaGrid';
import { Welcome } from './components/Welcome';
import MediaList from './components/MediaList/MediaList';
import Card from './components/MediaList/components/Card';
import { LibraryChart } from '@/src/components/charts/StackBar/LibraryChart';

import { mediaTypes } from './constants/mediaTypes';
import { useThemeStyles } from '../../styles/useThemeStyles';
import { useLibraryHub } from './hooks/useLibraryHub';

const LibraryHub: React.FC = () => {
    const [currentSection, setCurrentSection] = useState<number | null>(null);
    const [isDashboard, setIsDashboard] = useState(true);

    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { isLoading, error, stats, recentActivity, weeklyActivity } = useLibraryHub();

    const navigateToSection = (index: number) => {
        setCurrentSection(index);
        setIsDashboard(false);
    };

    const returnToDashboard = () => {
        setIsDashboard(true);
        setCurrentSection(null);
    };

    const navItems = ['Movies', 'Series', 'Books', 'Videogames', 'Music'].map((title, index) => ({
        label: title,
        onPress: () => navigateToSection(index)
    }));

    const Dashboard = () => (
        <ScrollView style={styles.dashboardContainer}>
            {isLoading ? (
                <ActivityIndicator size="large" color={themeColors.textColor} />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <>
                    <Welcome />
                    <Stats stats={stats} themeColors={themeColors} />
                    <LibraryChart weeklyData={weeklyActivity} />
                    <MediaGrid 
                        mediaTypes={mediaTypes} 
                        navItems={navItems}
                        onNavigate={navigateToSection}
                    />
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
                ) : (
					<MediaList
						key={`media-list-${currentSection}`}
						mediaType={mediaTypes[currentSection!].type}
						CardComponent={Card}
						DetailedViewComponent={DetailedView}
						SearchModalComponent={mediaTypes[currentSection!].SearchModalComponent}
						modalVisible={mediaTypes[currentSection!].modalVisible}
						setModalVisible={mediaTypes[currentSection!].setModalVisible}
						onBackPress={returnToDashboard}
					/>
                )}
            </View>
            {!isDashboard && currentSection !== null && (
                <Navbar
                    items={navItems}
                    activeIndex={currentSection + 1}
                    screen={mediaTypes[currentSection].type}
                    quickButtonFunction={mediaTypes[currentSection].openModal}
                />
            )}
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    // Keep only the main container styles here
    mainContainer: {
        paddingTop: 37,
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        marginBottom: 20
    },
    dashboardContainer: {
        flex: 1,
    },
    errorText: {
        color: theme.errorColor || 'red',
        textAlign: 'center',
        padding: 16,
        fontSize: 16,
    },
});

export default LibraryHub;