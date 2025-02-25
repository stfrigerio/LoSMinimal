import React, { useMemo, useState } from 'react';
import { View, Dimensions, StyleSheet, Platform, Text, Pressable, Switch, ActivityIndicator } from 'react-native';

import EntriesList from '../atoms/EntriesList';
import SunburstChart from '@/src/components/charts/Sunburst/SunburstChart';
import TimeHeatmap from '@/src/components/charts/Heatmaps/TimeHeatmap/TimeHeatmap';
import SummaryItem from '../atoms/SummaryItem';
import { GlitchText } from '@/src/styles/GlitchText';

import { formatTimeEntries } from '../../helpers/dataTransformer';
import { processTimeSunburstData } from '../../helpers/dataProcessing';
import { processMultiDayHourData } from '@/src/components/charts/Sunburst/helpers/dataProcessing';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { usePeriodicData } from '@/src/features/PeriodicNote/hooks/usePeriodicData';
import { calculateTimeSummary } from '../../helpers/timeHelpers';

interface ChartSectionProps {
    startDate: Date;
    endDate: Date;
    tagColors: any;
}

const ChartSection: React.FC<ChartSectionProps> = ({ 
    startDate,
    endDate,
    tagColors,
}) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);
    const [isHeatmapLoaded, setIsHeatmapLoaded] = useState(false);
    const [excludeSleep, setExcludeSleep] = useState(false);

    const { current: { timeData }, previous: { timeData: previousTimeData } } = usePeriodicData(startDate, endDate);

    const filteredTimeData = useMemo(() => {
        if (!excludeSleep) return timeData;
        return timeData.filter((entry: any) => entry.tag.toLowerCase() !== 'sleep');
    }, [timeData, excludeSleep]);

    const filteredPreviousTimeData = useMemo(() => {
        if (!excludeSleep) return previousTimeData;
        return previousTimeData.filter((entry: any) => entry.tag.toLowerCase() !== 'sleep');
    }, [previousTimeData, excludeSleep]);

    const timeSunburstData = useMemo(() => processTimeSunburstData(filteredTimeData), [filteredTimeData]);
    const timeHeatmapData = useMemo(() => processMultiDayHourData(filteredTimeData), [filteredTimeData]);
    const timeSummary = useMemo(() => calculateTimeSummary(filteredTimeData, filteredPreviousTimeData), [filteredTimeData, filteredPreviousTimeData]);

    const timeHeatmapDataCurrentPeriod = useMemo(() => {
        return timeHeatmapData.filter((entry: any) => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate < new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
        });
    }, [timeHeatmapData, startDate, endDate]);
    
    const timeEntries = formatTimeEntries(timeSunburstData, tagColors);

    const { width } = Dimensions.get('window');
    const chartWidth = width * 0.8;
    const chartHeight = Dimensions.get('window').height * 0.3;

    if (!timeSunburstData || !timeEntries) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.accentColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Exclude Sleep</Text>
                <Switch
                    value={excludeSleep}
                    onValueChange={setExcludeSleep}
                    trackColor={{ false: theme.colors.backgroundSecondary, true: theme.colors.accentColor }}
                    thumbColor={excludeSleep ? theme.colors.backgroundSecondary : theme.colors.accentColor}
                />
            </View>
            <View style={{ marginBottom: theme.spacing.xl }}>
                <SunburstChart
                    data={timeSunburstData}
                    width={chartWidth}
                    height={chartHeight}
                />      
            </View>
            {timeEntries.length > 0 && (
                <EntriesList entries={timeEntries} title="Time Entries" valueLabel="" />
            )}
            {!isHeatmapLoaded && (
                <Pressable style={styles.loadHeatmapButton} onPress={() => setIsHeatmapLoaded(true)}>
                    <Text style={styles.loadHeatmapButtonText}>Load Heatmap</Text>
                </Pressable>
            )}
            {isHeatmapLoaded && (
                <View>
                    <TimeHeatmap
                        data={timeHeatmapDataCurrentPeriod}
                        width={chartWidth}
                        height={chartHeight}
                    />
                </View>
            )}
            <View style={styles.summaryContainer}>
                <View style={{ alignItems: 'center' }}>
                    <GlitchText
                        style={styles.summaryTitle}
                        glitch={theme.name === 'signalis'}
                    >
                        Time Summary
                    </GlitchText>
                </View>
                <View style={styles.summaryGrid}>
                    <SummaryItem 
                        title="Total Time" 
                        value={timeSummary.totalTime}
                        // change={timeSummary.totalTimeChange}
                        // isPercentage={true}
                        // isTime={true}
                    />
                    <SummaryItem 
                        title="Time Tracked Per Day" 
                        value={timeSummary.timeTrackedPerDay}
                        // change={timeSummary.timeTrackedPerDayChange}
                        // isPercentage={false}
                        // isTime={true}
                    />
                    <SummaryItem title="Most Common Tag" value={timeSummary.mostCommonTag} />
                    <SummaryItem title="Longest Single Timer" value={timeSummary.longestSingleEntry} />
                    <SummaryItem title="Timers" value={timeSummary.numberOfTimers.toString()} />
                </View>
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) => {
    const { width } = Dimensions.get('window');
    const isDesktop = Platform.OS === 'web';

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            paddingTop: 0,
            backgroundColor: theme.colors.backgroundColor,
        },
        toggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.xl,
        },
        toggleLabel: {
            marginRight: 10,
            fontSize: 16,
            color: theme.colors.gray,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: 12
            })
        },
        loadHeatmapButton: {
            backgroundColor: theme.colors.backgroundColor,
            padding: 10,
            borderRadius: 5,
            margin: 10,
            marginTop: 30,
            alignSelf: 'center',
        },
        loadHeatmapButtonText: {
            color: theme.colors.textColorItalic,
            fontSize: 16,
            fontStyle: 'italic',
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: 14,
                fontStyle: 'normal',
                color: theme.colors.textColorItalic,
                textShadowColor: theme.colors.accentColor,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 12,
            })
        },
        summaryContainer: {
            marginBottom: 20,
            padding: 15,
            borderRadius: 10,
        },
        summaryTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 15,
            color: theme.colors.textColor,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: 18,
                fontWeight: 'normal',
                color: theme.colors.accentColor,
                textShadowColor: theme.colors.accentColor,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 12,
            })
        },
        summaryGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
    });
};

export default ChartSection;