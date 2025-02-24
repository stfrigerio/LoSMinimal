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
} from './components'

import TimeBox from '@/src/components/TimeBox/TimeBox';
import DateNavigation from '@/src/components/DateNavigation';
import ImagePickerComponent from './components/ImagePickerComponent';

// Functions
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { getStartOfToday, getLocalTimeZone, navigateDate } from '@/src/utils/timezoneBullshit';
import { useNavigationComponents } from '@/src/features/LeftPanel/helpers/useNavigation';

import ColorfulTimeline from '@/src/features/DailyNote/components/ColorfulTimeline';
import { useDailyData } from '@/src/features/DailyNote/helpers/useDailyData';
import { useDailySettings } from '@/src/features/DailyNote/helpers/useDailySettings';

const DailyNote = () => {
    const params = useGlobalSearchParams();
    const dateParam = params.date ? String(params.date) : getStartOfToday(getLocalTimeZone()).toString();
	
	const { openDailyNote } = useNavigationComponents();

	const timeZone = getLocalTimeZone();
    const title = format(dateParam, 'EEEE, dd MMMM');
	const [lastSubmissionTime, setLastSubmissionTime] = useState(Date.now());

	const { dailyData, onUpdateDaySections } = useDailyData(new Date(dateParam), lastSubmissionTime);
	const [ settings ] = useDailySettings();

	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	useEffect(() => {
        setLastSubmissionTime(Date.now());
    }, [dateParam]);

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
					<QuantifiableHabits data={dailyData?.quantifiableHabits || []} date={dateParam} quantifiableHabitsName={settings?.quantifiableHabitsName ?? false} />
					<BooleanHabits data={dailyData?.booleanHabits || []} date={dateParam} booleanHabitsName={settings?.booleanHabitsName ?? false} />
					<MorningData data={dailyData} onUpdate={onUpdateDaySections}/>
					<EveningData data={dailyData} onUpdate={onUpdateDaySections}/>
					<ImagePickerComponent date={dateParam} />
				</View>
			</ScrollView>
			{/* <View style={styles.verticalCenterLine} /> */}
		</View>
	);
};

export default DailyNote;


const getStyles = (theme: Theme) => {
	return StyleSheet.create({
		mainContainer: {
			flex: 1,
			paddingTop: 37,
			position: 'relative',
			backgroundColor: theme.colors.backgroundColor,
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
