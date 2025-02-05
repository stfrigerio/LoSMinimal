// Libraries
import React, { useCallback, useMemo, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { format } from 'date-fns';
import { parseDate, isSamePeriod, getLocalTimeZone } from '@/src/utils/timezoneBullshit';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { DailyTextData } from '@/src/types/TextNotes';
import Pagination from './atoms/TextPagination'; // Adjust the path as necessary
import { usePeriodicData } from '../hooks/usePeriodicData';

// Interface for grouped weekly data
interface WeeklyData {
	weekStartDate: Date;
	weekDays: DailyTextData[];
}

interface TextListsProps {
	startDate: Date;
	endDate: Date;
}

const TextLists: React.FC<TextListsProps> = ({ startDate, endDate }) => {
	const { theme, themeColors } = useThemeStyles();
	const styles = useMemo(() => getStyles(themeColors), [themeColors]);
	const [activeSlide, setActiveSlide] = useState(0);
	const { width: windowWidth } = useWindowDimensions();

    // Validate date string format before parsing
    if (!startDate || !endDate) {
        console.warn('Missing date strings:', { startDate, endDate });
        return null;
    }

	const { current: { dailyTextData } } = usePeriodicData(startDate, endDate);

	// Utility to format date with day name
	const formatDateWithDay = useCallback((dateString: string) => {
		const date = new Date(dateString);
		return format(date, 'EEEE, MMM d');
	}, []);

	const renderWeekCard = useCallback(({ item }: { item: WeeklyData }) => (
		<View style={[styles.weekCard, {marginTop: 20}]}>
			<View style={styles.gridContainer}>
				{/* Week number card */}
				<View style={[styles.dayCard, styles.weekNumberCard]}>
					<Text style={styles.weekNumberText}>
						Week {format(item.weekStartDate, 'w')}
					</Text>
				</View>
				{item.weekDays.map((note, index) => (
					<View key={`${item.weekStartDate}-day-${index}`} style={styles.dayCard}>
						<Text style={styles.dateText}>{formatDateWithDay(note.date)}</Text>
						<View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
							<Text style={styles.label}>Success:</Text>	
							<Text style={styles.listItem}>{note.success || 'N/A'}</Text>
						</View>
						<View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
							<Text style={styles.label}>Improvement:</Text>
							<Text style={styles.listItem}>{note.beBetter || 'N/A'}</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	), [styles.weekCard, styles.gridContainer, styles.dayCard, styles.dateText, styles.listItem, formatDateWithDay]);

    const groupByWeek = useCallback((data: DailyTextData[]): WeeklyData[] => {
		try {
			const weeks: WeeklyData[] = [];
			if (data.length === 0) return weeks;

			const start = parseDate(startDate.toString());
			const end = parseDate(endDate.toString());

			let currentWeekStart = start;
			let currentWeekData: DailyTextData[] = [];

			data.forEach(note => {
				const noteDate = parseDate(note.date);
				if (!isSamePeriod(currentWeekStart, noteDate, 'week')) {
					if (currentWeekData.length > 0) {
						weeks.push({
							weekStartDate: currentWeekStart,
							weekDays: currentWeekData,
						});
					}
					currentWeekStart = noteDate;
					currentWeekData = [];
				}
				currentWeekData.push(note);
			});

			// Add the last week if it exists
			if (currentWeekData.length > 0) {
				weeks.push({
					weekStartDate: currentWeekStart,
					weekDays: currentWeekData,
				});
			}

			return weeks;
		} catch (error) {
			console.error('Error in groupByWeek:', error);
			return [];
		}
    }, [startDate, endDate]);

	// Modify viewMode and groupedData
	const groupedData = useMemo(() => groupByWeek(dailyTextData), [groupByWeek, dailyTextData]);

	return (
		<View style={styles.container}>
			{groupedData.length > 0 ? (
                <>
					{groupedData.length === 1 ? (
						// Render a single week without Carousel
						renderWeekCard({ item: groupedData[0] })
					) : (
						// Render Carousel for multiple weeks
						<Carousel
							width={windowWidth - 40}
							height={650}
							data={groupedData}
							scrollAnimationDuration={1000}
							onSnapToItem={(index) => setActiveSlide(index)}
							renderItem={renderWeekCard}
							// mode="parallax" //!culprit
							panGestureHandlerProps={{
								activeOffsetX: [-10.0, 10.0],
							}}
						/>
					)}
					{groupedData.length > 1 && (
						<Pagination
							dotsLength={groupedData.length}
							activeDotIndex={activeSlide}
							dotStyle={styles.activeDot}
							inactiveDotStyle={styles.inactiveDot}
							containerStyle={styles.paginationContainer}
						/>
					)}
				</>
			) : (
				<Text style={styles.noDataText}>No data available for this period.</Text>
			)}
		</View>
	);
};

// Styles
const getStyles = (theme: any) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
		},
		paginationContainer: {
			backgroundColor: 'transparent',
			paddingVertical: 10,
		},
		activeDot: {
			width: 10,
			height: 10,
			borderRadius: 5,
			backgroundColor: theme.textColorBold,
		},
		inactiveDot: {
			backgroundColor: theme.opaqueTextColor,
		},
		weekNumberCard: {
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.backgroundColor,
		},
		weekNumberText: {
			fontWeight: 'bold',
			fontSize: 16,
			color: theme.accentColor,
		},
		weekCard: {
			backgroundColor: theme.backgroundSecondary,
			borderRadius: 10,
			padding: 10,
			marginVertical: 10,
			shadowColor: theme.textColor,
			elevation: 5,
			alignSelf: 'center',
		},
		gridContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
		},
		dayCard: {
			backgroundColor: theme.backgroundColor,
			borderRadius: 8,
			padding: 6,
			marginBottom: 10,
			shadowColor: theme.textColor,
			elevation: 3,
			width: '48%', // Adjust this value to control card width
		},
		dateText: {
			fontWeight: 'bold',
			fontSize: 14,
			marginBottom: 10,
			color: theme.textColorBold,
		},
		listItem: {
			fontSize: 14,
			color: theme.textColor,
			marginBottom: 5,
		},
		label: {
			fontSize: 12,
			marginBottom: 5,
			color: theme.gray,
		},
		noDataText: {
			textAlign: 'center',
			color: theme.opaqueTextColor,
			marginTop: 20,
			fontSize: 16,
		},
	});
};

export default TextLists;
