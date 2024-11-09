// Libraries
import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
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

import TimeBox from '@/app/components/TimeBox';
import DateNavigation from '@/app/components/DateNavigation';
// import ImagePickerComponent from './components/ImagePickerComponent';

// Functions
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { getStartOfToday, getLocalTimeZone, navigateDate } from '@/src/utils/timezoneBullshit';
import { useNavigationComponents } from '@/app/(drawer)/features/LeftPanel/helpers/useNavigation';

import ColorfulTimeline from '@/app/(drawer)/features/DailyNote/components/ColorfulTimeline';
import { useDailyData } from '@/app/(drawer)/features/DailyNote/helpers/useDailyData';
import { useDailySettings } from '@/app/(drawer)/features/DailyNote/helpers/useDailySettings';
import { useTasksData } from '@/app/(drawer)/features/Tasks/hooks/useTasksData';

// Types
import { UseDailyDataType } from './types/DailyData';
import  { UseTaskDataType } from '@/app/(drawer)/features/Tasks/hooks/useTasksData';
import { TaskData } from '@/src/types/Task';

const DailyNote = () => {
    const params = useGlobalSearchParams();
    const dateParam = params.date ? String(params.date) : getStartOfToday(getLocalTimeZone()).toString();
	
	const { openDailyNote } = useNavigationComponents();

    // if (!date) {
    //     return null;
    // }

	const timeZone = getLocalTimeZone();
    const title = format(dateParam, 'EEEE, dd MMMM');

	// const [lastSubmissionTime, setLastSubmissionTime] = useState(Date.now());
	// const [tasks, setTasks] = useState<TaskData[]>([]);

	// const { dailyData, onUpdateDaySections } = useDailyData(currentDate, lastSubmissionTime);
	// const { toggleTaskCompletion, getTasksDueOnDate: fetchDailyTasks } = useTaskData();
	const [ settings ] = useDailySettings();

	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	// useEffect(() => {
	// 	const fetchTasks = async () => {
	// 		const dailyTasks = await fetchDailyTasks(currentDate);
	// 		setTasks(dailyTasks);
	// 	};

	// 	fetchTasks();
	// }, [currentDate]);

    const handleNavigatePeriod = (direction: 'previous' | 'next' | 'current') => {
        let newDate;
        if (direction === 'current') {
            newDate = getStartOfToday(timeZone);
        } else {
            const offset = direction === 'previous' ? -1 : 1;
            newDate = navigateDate(new Date(dateParam), offset, timeZone);
        }
        
        openDailyNote(newDate.toString());
    };

	return (
		<View style={styles.mainContainer}>
			<ColorfulTimeline title={dateParam} />
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.noteContainer}>
					<DateHeader formattedDate={title} periodType='day' />
					<View style={styles.navigation}>
						<TimeBox
							startDate={dateParam}
							currentViewType={'daily'}
						/>
						<DateNavigation
							periodType={'day'}
							onNavigate={handleNavigatePeriod}
						/>
					</View>
					{settings && !settings.hideQuote && (
						<Quote
							isCollapse={settings.quoteCollapse}
							isFixed={settings.fixedQuote}
						/>
					)}
					{/* <QuantifiableHabits data={dailyData?.quantifiableHabits || []} date={dateStr} /> */}
					{/* <BooleanHabits data={dailyData?.booleanHabits || []} date={dateStr} booleanHabitsName={settings?.booleanHabitsName ?? false} /> */}
					{/* <DailyTasks tasks={tasks || []} onToggleTaskCompletion={toggleTaskCompletion} fetchDailyTasks={fetchDailyTasks} currentDate={currentDate} /> */}
					{/* <MorningData data={dailyData} onUpdate={onUpdateDaySections}/> */}
					{/* <EveningData data={dailyData} onUpdate={onUpdateDaySections}/> */}
					{/* <ImagePickerComponent date={dateStr} /> */}
				</View>
			</ScrollView>
			{/* <View style={styles.verticalCenterLine} /> */}
		</View>
	);
};

export default DailyNote;


const getStyles = (theme: any) => {
	return StyleSheet.create({
		mainContainer: {
			flex: 1,
			paddingTop: 37,
			position: 'relative',
			backgroundColor: theme.backgroundColor,
		},
		noteContainer: {
			paddingHorizontal: 20,
		},
		navigation: {
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 20,
		},
		verticalCenterLine: {
			position: 'absolute',
			left: '50%',
			top: 0,
			bottom: 0,
			width: 1,
			backgroundColor: 'red', // or any other color you prefer
			opacity: 0.2, // optional: makes the line subtle
		},
	});
};
