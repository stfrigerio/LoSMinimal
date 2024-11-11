import { useCallback } from 'react';
import { endOfWeek, endOfMonth, endOfQuarter, endOfYear } from 'date-fns';
import { useNavigation } from 'expo-router';

import { formatDate, parseDate, startOfPeriod, getLocalTimeZone } from '@/src/utils/timezoneBullshit';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

export type NotePeriod = 'day' | 'week' | 'lastWeek' | 'month' | 'quarter' | 'year' | 'allYears';

// export interface HomepageSettings {
// 	HideNextTask?: { value: string };
// 	HideDots?: { value: string };
// 	HidePeople?: { value: string };
// 	HideTasks?: { value: string };
// 	HideJournal?: { value: string };
// 	HideMoods?: { value: string };
// 	HideLibrary?: { value: string };
// 	HideMoney?: { value: string };
// 	HideNextObjective?: { value: string };
// 	HideCarLocation?: { value: string };
// 	HideTime?: { value: string };
// 	HideMusic?: { value: string };
// }

export type RootStackParamList = {
    'features/DailyNote/DailyNote': { date: string };
	'features/PeriodicNote/PeriodicNote': { startDate: string; endDate: string };
    'features/Tasks/Tasks': undefined;
    'features/Home/Homepage': undefined;
	'features/UserSettings/UserSettings': undefined;
	'features/Mood/Mood': undefined;
	'features/Database/Database': undefined;
};

export const useNavigationComponents = () => {
    const navigate = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const openNote = useCallback((period: NotePeriod, date: string) => {
		const timeZone = getLocalTimeZone();
		const parsedDate = parseDate(date, timeZone);
	
		if (period === 'day') {
			const formattedDate = formatDate(parsedDate, 'yyyy-MM-dd', timeZone);
			navigate.navigate('features/DailyNote/DailyNote', { 
				date: formattedDate 
			});
			return;
		}
	
		let start: Date, end: Date;
	
		switch (period) {
			case 'week':
			case 'lastWeek':
			case 'month':
			case 'quarter':
			case 'year':
			case 'allYears':
				start = startOfPeriod(parsedDate, period as any, timeZone);
				end = startOfPeriod(parsedDate, period as any, timeZone);
				break;
		}
	
		// Adjust end date calculation based on period
		switch (period) {
			case 'week':
			case 'lastWeek':
				end = endOfWeek(start, { weekStartsOn: 1 });
				break;
			case 'month':
				end = endOfMonth(start);
				break;
			case 'quarter':
				end = endOfQuarter(start);
				break;
			case 'year':
				end = endOfYear(start);
				break;
		}
	
		const startDate = formatDate(start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timeZone);
		const endDate = formatDate(end, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timeZone);
	
		// Add periodicNote to RootStackParamList if not already there
		navigate.navigate('features/PeriodicNote/PeriodicNote', {
			startDate,
			endDate
		});
	}, [navigate]);

	const openDailyNote = useCallback((dateStr: string) => {
		const timeZone = getLocalTimeZone();
		const formattedDate = formatDate(new Date(dateStr), 'yyyy-MM-dd', timeZone);
		
		navigate.navigate('features/DailyNote/DailyNote', {
			date: formattedDate
		});
	}, [navigate]);

	const openSettings = useCallback(() => {
		navigate.navigate('features/UserSettings/UserSettings' as never);
	}, [navigate]);

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


	const openMoods = useCallback(() => {
		navigate.navigate('features/Mood/Mood' as never);
	}, [navigate])

	const openDatabase = useCallback(() => {
		navigate.navigate('features/Database/Database' as never);
	}, [navigate])

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

	return { 
		openNote, 
		openSettings, 
		openDailyNote, 
		// openLibrary, 
		// openJournalHub,
		// openPeople,
		openTasks,
		openMoods,
		// openMoney,
		openHomepage,
		// openCurrentWeek,
		// openCurrentMonth,
		// openMusic,
		// openTime,
		openDatabase
	};
};