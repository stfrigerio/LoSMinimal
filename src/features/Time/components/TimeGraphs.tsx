import React, { useMemo, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Platform, Text, ScrollView, Pressable } from 'react-native';

import SunburstChart from '@/src/components/charts/Sunburst/SunburstChart';
import EntriesList from '@/src/features/PeriodicNote/components/atoms/EntriesList';

import { formatTimeEntries } from '@/src/features/PeriodicNote/helpers/dataTransformer';
import { processTimeSunburstData } from '@/src/features/PeriodicNote/helpers/dataProcessing';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { processMultiDayHourData } from '@/src/components/charts/Sunburst/helpers/dataProcessing';

import TimeHeatmap from '@/src/components/charts/Heatmaps/TimeHeatmap/TimeHeatmap';
import { useColors } from '@/src/utils/useColors';
import FilterAndSort, { FilterOptions, SortOption } from '@/src/components/FilterAndSort';
import { useTimeData } from '../hooks/useTimeData';
import { TimeData } from '@/src/types/Time';
import MobileNavbar from '@/src/components/NavBar';
import { navItems } from '../constants/navItems';

const TimeGraphs: React.FC = () => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);
    const { colors: tagColors} = useColors();
    const [showFilter, setShowFilter] = useState(false);
	const [filters, setFilters] = useState<FilterOptions>({
        dateRange: { start: null, end: null },
        tags: [],
        searchTerm: '',
    });
    const [sortOption, setSortOption] = useState<SortOption>('recent');

    const { 
        entries, 
    } = useTimeData();

    const tags = useMemo(() => {
		return Array.from(new Set(entries.map((entry: TimeData) => entry.tag)));
	}, [entries]);

    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

	// Compute filtered and sorted entries
	const filteredEntries = useMemo(() => {
		// Apply Filters
		let filtered = entries.filter((entry: TimeData) => {
			const entryDate = new Date(entry.date!);
			entryDate.setHours(0, 0, 0, 0);  // Reset time to start of day

			const inDateRange = (!filters.dateRange.start || entryDate >= new Date(filters.dateRange.start.setHours(0, 0, 0, 0))) &&
								(!filters.dateRange.end || entryDate <= new Date(filters.dateRange.end.setHours(0, 0, 0, 0)));

			const matchesTags = filters.tags.length === 0 || filters.tags.includes(entry.tag);
			const matchesSearch = entry.description!.toLowerCase().includes(filters.searchTerm.toLowerCase());
			return inDateRange && matchesTags && matchesSearch;
		});

		// Apply Sorting
		filtered.sort((a: TimeData, b: TimeData) => {
			switch (sortOption) {
				case 'recent':
					return new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime();
				case 'oldest':
					return new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime();
				case 'highestValue':
					// Assuming duration is a number; adjust if it's a string
					return Number(b.duration!) - Number(a.duration!);
				case 'lowestValue':
					return Number(a.duration!) - Number(b.duration!);
				default:
					return 0;
			}
		});

		return filtered;
	}, [entries, filters, sortOption]);

    const timeSunburstData = useMemo(() => processTimeSunburstData(filteredEntries), [filteredEntries]);
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
        <View style={styles.container}>
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
                {/* <>
                    <View>
                        <TimeHeatmap
                            data={timeHeatmapData}
                            width={chartWidth}
                            height={chartHeight}
                        />
                    </View>
                </> */}
            </ScrollView>
            <FilterAndSort
                onFilterChange={(newFilters: FilterOptions) => setFilters(newFilters)}
                onSortChange={(newSortOption: SortOption) => setSortOption(newSortOption)}
                tags={tags}
                searchPlaceholder="Search by description"
                isActive={showFilter}
            />
            <MobileNavbar
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === 'Graphs')} 
                quickButtonFunction={undefined}
                showFilter={true}
                onFilterPress={() => setShowFilter(!showFilter)}
                screen="time"
            />
        </View>
    );
};

const getStyles = (theme: Theme) => {
    const { width } = Dimensions.get('window');
    const isDesktop = Platform.OS === 'web';

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.backgroundColor,
            paddingTop: 56,
        },
    });
};

export default TimeGraphs;