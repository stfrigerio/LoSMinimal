//useHomepage.ts
import { useCallback } from 'react';
import { endOfWeek, endOfMonth, endOfQuarter, endOfYear } from 'date-fns';
import { useNavigation } from 'expo-router';  // Change this import

import { formatDate, parseDate, startOfPeriod, getLocalTimeZone } from '@/src/utils/timezoneBullshit';

// useHomepageSettings = require('@los/mobile/src/components/UserSettings/hooks/useSettings').useSettings;

export type NotePeriod = 'day' | 'week' | 'lastWeek' | 'month' | 'quarter' | 'year' | 'allYears';

export interface HomepageSettings {
	HideNextTask?: { value: string };
	HideDots?: { value: string };
	HidePeople?: { value: string };
	HideTasks?: { value: string };
	HideJournal?: { value: string };
	HideMoods?: { value: string };
	HideLibrary?: { value: string };
	HideMoney?: { value: string };
	HideNextObjective?: { value: string };
	HideCarLocation?: { value: string };
	HideTime?: { value: string };
	HideMusic?: { value: string };
}

export const useNavigationComponents = () => {
    const navigate = useNavigation();

	// const openNote = useCallback((period: NotePeriod, date: string) => {
	// 	const timeZone = getLocalTimeZone(); // Use the utility function to get the timezone
	// 	const parsedDate = parseDate(date, timeZone); // Use the utility function to parse the date

	// 	if (period === 'day') {
	// 		const formattedDate = formatDate(parsedDate, 'yyyy-MM-dd', timeZone); // Use the utility function to format the date
	// 		navigate('dailyNote', { date: formattedDate });
	// 		return;
	// 	}

	// 	let start: Date, end: Date;

	// 	switch (period) {
	// 		case 'week':
	// 		case 'lastWeek':
	// 		case 'month':
	// 		case 'quarter':
	// 		case 'year':
	// 		case 'allYears':
	// 			start = startOfPeriod(parsedDate, period as any, timeZone); // Correctly calculate the start of the period
	// 			end = startOfPeriod(parsedDate, period as any, timeZone); // Correctly calculate the end of the period
	// 			break;
	// 	}

	// 	// Adjust end date calculation based on period
	// 	switch (period) {
	// 		case 'week':
	// 		case 'lastWeek':
	// 			end = endOfWeek(start, { weekStartsOn: 1 });
	// 			break;
	// 		case 'month':
	// 			end = endOfMonth(start);
	// 			break;
	// 		case 'quarter':
	// 			end = endOfQuarter(start);
	// 			break;
	// 		case 'year':
	// 			end = endOfYear(start);
	// 			break;
	// 	}

	// 	// Format dates to ISO string in local time zone
	// 	const startDate = formatDate(start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timeZone);
	// 	const endDate = formatDate(end, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timeZone);

	// 	navigate('periodicNote', {
	// 		startDate: startDate,
	// 		endDate: endDate,
	// 	});

	// }, [navigate]);

	// const openToday = useCallback(() => {
	// 	navigate('dailyNote');
	// }, [navigate]);

	// const openSettings = useCallback(() => {
	// 	navigate('settings');
	// }, [navigate]);

	// const openLibrary = useCallback(() => {
	// 	navigate('library');
	// }, [navigate])

	// const openJournalHub = useCallback(() => {
	// 	navigate('journalHub');
	// }, [navigate])

	// const openPeople = useCallback(() => {
	// 	navigate('people');
	// }, [navigate])

    const openTasks = useCallback(() => {
        navigate.navigate('features/Tasks/Tasks' as never);
    }, [navigate]);


	// const openMoods = useCallback(() => {
	// 	navigate('moods');
	// }, [navigate])

	// const openMoney = useCallback(() => {
	// 	navigate('money');
	// }, [navigate])

	const openHomepage = useCallback(() => {
		navigate.navigate('features/Home/Homepage' as never);
	}, [navigate])

	// const openCurrentWeek = useCallback(() => {
	// 	const today = new Date();
	// 	openNote('week', today.toString());
	// }, [openNote]);

	// const openCurrentMonth = useCallback(() => {
	// 	const today = new Date();
	// 	openNote('month', today.toString());
	// }, [openNote]);

	// const openMusic = useCallback(() => {
	// 	navigate('music');
	// }, [navigate])

	// const openTime = useCallback(() => {
	// 	navigate('time');
	// }, [navigate])

	let homepageSettings: HomepageSettings = {};

	// if (typeof useHomepageSettings === 'function') {
	// 	const { settings } = useHomepageSettings();
	// 	homepageSettings = {
	// 		HideNextTask: settings.HideNextTask,
	// 		HideDots: settings.HideDots,
	// 		HidePeople: settings.HidePeople,
	// 		HideTasks: settings.HideTasks,
	// 		HideJournal: settings.HideJournal,
	// 		HideMoods: settings.HideMoods,
	// 		HideLibrary: settings.HideLibrary,
	// 		HideMoney: settings.HideMoney,
	// 		HideNextObjective: settings.HideNextObjective,
	// 		HideCarLocation: settings.HideCarLocation,
	// 		HideTime: settings.HideTime,
	// 		HideMusic: settings.HideMusic,
	// 	};
	// }

	return { 
		// openNote, 
		// openSettings, 
		// openToday, 
		// openLibrary, 
		// openJournalHub,
		// openPeople,
		openTasks,
		// openMoods,
		// openMoney,
		openHomepage,
		// openCurrentWeek,
		// openCurrentMonth,
		// openMusic,
		// openTime,
		// homepageSettings,
	};
};