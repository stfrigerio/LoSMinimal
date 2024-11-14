import { useCallback } from 'react';
import { endOfWeek, endOfMonth, endOfQuarter, endOfYear } from 'date-fns';
import { router } from 'expo-router';

import { formatDate, parseDate, startOfPeriod, getLocalTimeZone } from '@/src/utils/timezoneBullshit';

export type NotePeriod = 'day' | 'week' | 'lastWeek' | 'month' | 'quarter' | 'year' | 'allYears';

export const useNavigationComponents = () => {

	const openNote = useCallback((period: NotePeriod, date: string) => {
		const timeZone = getLocalTimeZone();
		const parsedDate = parseDate(date, timeZone);
	
		if (period === 'day') {
			const formattedDate = formatDate(parsedDate, 'yyyy-MM-dd', timeZone);
			router.push({
				pathname: "daily-note",
				params: { date: formattedDate }
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
		router.push({
			pathname: "periodic-note",
			params: { startDate, endDate }
		});
	}, []);

	const openDailyNote = useCallback((dateStr: string) => {
		const timeZone = getLocalTimeZone();
		const formattedDate = formatDate(new Date(dateStr), 'yyyy-MM-dd', timeZone);
		
		router.push({
			pathname: "daily-note",
			params: { date: formattedDate }
		});	
	}, []);

	const openSettings = useCallback(() => {
		router.push('/user-settings');
	}, []);

	const openLibrary = useCallback(() => {
		router.push('/library');
	}, [])

	const openJournal = useCallback(() => {
		router.push('/journal');
	}, [])

	const openPeople = useCallback(() => {
		router.push('/people');
	}, [])

    const openTasks = useCallback(() => {
        router.push('/tasks');
    }, []);


	const openMoods = useCallback(() => {
		router.push('/mood');
	}, []);

	const openDatabase = useCallback(() => {
		router.push('/database');
	}, []);

	const openMoney = useCallback(() => {
		router.push('/money');
	}, []);

	const openHomepage = useCallback(() => {
		router.push('/home');
	}, []);

	const openMusic = useCallback(() => {
		router.push('/music');
	}, [])

	const openTime = useCallback(() => {
		router.push('/time');
	}, [])

	return { 
		openNote, 
		openSettings, 
		openDailyNote, 
		openLibrary, 
		openJournal,
		openPeople,
		openTasks,
		openMoods,
		openMoney,
		openHomepage,
		openMusic,
		openTime,
		openDatabase
	};
};