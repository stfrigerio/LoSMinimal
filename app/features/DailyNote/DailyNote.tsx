// Libraries
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Platform, Dimensions, Text } from 'react-native';
import { format } from 'date-fns';
import { useGlobalSearchParams } from 'expo-router';

import {
	Quote,
	QuantifiableHabits,
	BooleanHabits,
	MorningData,
	EveningData,
	DateHeader,
	DailyTasks
} from './components'

// import TimeBox from '../PeriodicNote/components/atoms/TimeBox'
// import DateNavigation from '../PeriodicNote/components/DateNavigation';
// import ImagePickerComponent from './components/ImagePickerComponent';

// Functions
import { useThemeStyles } from '@/src/styles/useThemeStyles';
// import { getStartOfToday, parseDate, formatDate, getLocalTimeZone, navigateDate } from '@/src/utilities/timezoneBullshit';

import ColorfulTimeline from '@/app/features/DailyNote/components/ColorfulTimeline';
import { useDailyData } from '@/app/features/DailyNote/helpers/useDailyData';
import { useDailySettings } from '@/app/features/DailyNote/helpers/useDailySettings';
import { DrawerStateManager } from '@/src/contexts/DrawerState';
import { useTasksData } from '@/app/features/Tasks/hooks/useTasksData';
import { formatDate, getLocalTimeZone } from '@/src/utils/timezoneBullshit';

// Types
import { UseDailyDataType } from './types/DailyData';
import  { UseTaskDataType } from '@/app/features/Tasks/hooks/useTasksData';
import { TaskData } from '@/src/types/Task';

const DailyNote = () => {
	const { date } = useGlobalSearchParams();

    if (!date) {
        console.log('No date provided');
        return null;
    }

	const timeZone = getLocalTimeZone();
	const title = format(date as string, 'EEEE, dd MMMM');

	
	// const [lastSubmissionTime, setLastSubmissionTime] = useState(Date.now());
	// const [tasks, setTasks] = useState<TaskData[]>([]);

	// const { dailyData, onUpdateDaySections } = useDailyData(currentDate, lastSubmissionTime);
	// const { toggleTaskCompletion, getTasksDueOnDate: fetchDailyTasks } = useTaskData();
	// const [ settings ] = useDailySettings();

	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	// // Update currentDate when route or propDate changes
	// useEffect(() => {
	// 	const newDate = route?.params?.date || propDate;
	// 	if (newDate) {
	// 		setCurrentDate(typeof newDate === 'string' ? parseDate(newDate, timeZone) : newDate);
	// 	}
	// }, [route?.params?.date, propDate]);

	// useEffect(() => {
	// 	if (DrawerStateManager) {
	// 		DrawerStateManager.disableAllSwipeInteractions();
	// 	}

	// 	// Cleanup function to re-enable swipe interactions when component unmounts
	// 	return () => {
	// 		if (DrawerStateManager) {
	// 			DrawerStateManager.enableAllSwipeInteractions();
	// 		}
	// 	};
	// }, []);

	// useEffect(() => {
	// 	const fetchTasks = async () => {
	// 		const dailyTasks = await fetchDailyTasks(currentDate);
	// 		setTasks(dailyTasks);
	// 	};

	// 	fetchTasks();
	// }, [currentDate]);

	// // Handle date navigation
	// const handleNavigatePeriod = (direction: 'previous' | 'next' | 'current') => {
	// 	if (direction === 'current') {
	// 		setCurrentDate(getStartOfToday(timeZone));
	// 	} else {
	// 		const offset = direction === 'previous' ? -1 : 1;
	// 		const newDate = navigateDate(currentDate, offset, timeZone);
	// 		setCurrentDate(newDate);
	// 	}
	// };

	return (
		<View style={styles.mainContainer}>
			<ColorfulTimeline title={date as string} />
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.noteContainer}>
					<DateHeader formattedDate={title} periodType='day' />
					{/* <View style={styles.navigation}>
						<TimeBox
							startDate={dateStr}
							endDate={dateStr}
							currentViewType={'daily'}
						/>
						<DateNavigation
							periodType={'day'}
							onNavigate={handleNavigatePeriod}
						/>
					</View> */}
					{/* {settings && !settings.hideQuote && (
						<Quote
							isCollapse={settings.quoteCollapse}
							isFixed={settings.fixedQuote}
						/>
					)} */}
					{/* <QuantifiableHabits data={dailyData?.quantifiableHabits || []} date={dateStr} /> */}
					{/* <BooleanHabits data={dailyData?.booleanHabits || []} date={dateStr} booleanHabitsName={settings?.booleanHabitsName ?? false} /> */}
					{/* <DailyTasks tasks={tasks || []} onToggleTaskCompletion={toggleTaskCompletion} fetchDailyTasks={fetchDailyTasks} currentDate={currentDate} /> */}
					{/* <MorningData data={dailyData} onUpdate={onUpdateDaySections}/> */}
					{/* <EveningData data={dailyData} onUpdate={onUpdateDaySections}/> */}
					{/* <ImagePickerComponent date={dateStr} /> */}
				</View>
			</ScrollView>
		</View>
	);
};

export default DailyNote;


const getStyles = (theme: any) => {
	return StyleSheet.create({
		mainContainer: {
			flex: 1,
			marginTop: 37,
			position: 'relative',
		},
		noteContainer: {
			backgroundColor: theme.backgroundColor,
			paddingHorizontal: 20,
		},
		navigation: {
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 20,
		},
	});
};
