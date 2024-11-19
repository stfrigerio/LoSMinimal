import React, { useMemo, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Platform, Text, ScrollView, Pressable } from 'react-native';

import SunburstChart from '@/src/components/charts/Sunburst/SunburstChart';
import EntriesList from '@/src/features/PeriodicNote/components/atoms/EntriesList';

import { formatTimeEntries } from '@/src/features/PeriodicNote/helpers/dataTransformer';
import { processTimeSunburstData } from '@/src/features/PeriodicNote/helpers/dataProcessing';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { processMultiDayHourData } from '@/src/components/charts/Sunburst/helpers/dataProcessing';

import { TimeData } from '@/src/types/Time';
import TimeHeatmap from '@/src/components/charts/Heatmaps/TimeHeatmap/TimeHeatmap';
import { useColors } from '@/src/utils/useColors';

interface ChartSectionProps {
    entries: TimeData[];
}

const TimeGraphs: React.FC<ChartSectionProps> = ({ 
    entries,
}) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { colors: tagColors} = useColors();

    const [isFullScreenHeatmapVisible, setIsFullScreenHeatmapVisible] = useState(false);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const timeSunburstData = useMemo(() => processTimeSunburstData(entries), [entries]);
    const timeEntries = formatTimeEntries(timeSunburstData, tagColors);
    const timeHeatmapData = useMemo(() => processMultiDayHourData(entries), [entries]);

    const chartWidth = dimensions.width * 0.88; //^ boh, affects only heatmap e non so se va bene su tutti i devices
    const chartHeight = dimensions.height * 0.3;

    if (!timeSunburstData || !timeEntries) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'gray' }}>No Time data available.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ marginBottom: 50 }}>
            <View style={{ alignItems: 'center' }}>
                <SunburstChart
                    data={timeSunburstData}
                    width={chartWidth}
                    height={chartHeight}
                />      
            </View>
            {timeEntries.length > 0 && (
                <EntriesList entries={timeEntries} title="Time Entries" valueLabel="" />
            )}
            <Pressable onPress={() => setIsFullScreenHeatmapVisible(true)}>
                <View>
                    <TimeHeatmap
                        data={timeHeatmapData}
                        width={chartWidth}
                        height={chartHeight}
                    />
                </View>
            </Pressable>
        </ScrollView>
    );
};

const getStyles = (theme: any) => {
    const { width } = Dimensions.get('window');
    const isDesktop = Platform.OS === 'web';

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};

export default TimeGraphs;