import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import MobileNavbar from '@/src/components/NavBar';
import MoodModal from '@/src/features/Mood/modals/MoodModal';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMoodData } from './hooks/useMoodData';

import { navItems } from './constants/navItems';
import Banner from '@/src/components/Banner';

const Moods: React.FC = () => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

    const { entries: moods, refreshMoods } = useMoodData();

    // Compute summary statistics for moods, including most common tags.
    const { totalMoods, averageRating, commonTags } = useMemo(() => {
        const total = moods.length;
        const sumRatings = moods.reduce((sum, mood) => sum + (mood.rating || 0), 0);
        const average = total ? sumRatings / total : 0;

        // Count frequency of each tag from comma-separated string
        const tagCounts: { [key: string]: number } = {};
        moods.forEach((mood) => {
            if (mood.tag) {
                const tags = mood.tag
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);
                tags.forEach((tag) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        // Sort tags by frequency (highest first) and take the top three
        const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
        const topTags = sortedTags.slice(0, 3).map(([tag]) => tag).join(', ');

        return {
            totalMoods: total,
            averageRating: average.toFixed(1),
            commonTags: topTags || 'None',
        };
    }, [moods]);

    const handleMoodModalClose = useCallback(() => {
        setIsMoodModalOpen(false);
        refreshMoods();
    }, [refreshMoods]);

    return (
        <View style={styles.container}>
            <Banner imageSource={require('@/assets/images/mood.webp')} />
            <Text style={designs.text.title}>Moods</Text>

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Moods</Text>
                    <Text style={styles.summaryValue}>{totalMoods}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Average Rating</Text>
                    <Text style={styles.summaryValue}>{averageRating}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Common Tags</Text>
                    <Text style={styles.summaryValue}>{commonTags}</Text>
                </View>
            </View>

            {isMoodModalOpen && (
                <MoodModal
                    isOpen={isMoodModalOpen}
                    closeMoodModal={handleMoodModalClose}
                />
            )}
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === 'Dashboard')} 
                quickButtonFunction={() => setIsMoodModalOpen(true)}
                screen="mood"
            />
        </View>
    );
};


const getStyles = (themeColors: any, designs: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.backgroundColor,
            paddingTop: 30,
            paddingHorizontal: 20,
        },
        summaryContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginVertical: 20,
			paddingHorizontal: 10,
		},
		summaryItem: {
			alignItems: 'center',
			flex: 1,
		},
		summaryLabel: {
			color: themeColors.textColorItalic,
			marginBottom: 5,
			textAlign: 'center',
		},
		summaryValue: {
			color: themeColors.textColor,
			fontWeight: 'bold',
			textAlign: 'center',
		},
    });
};

export default Moods;