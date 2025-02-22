import { useCallback } from 'react';
import { endOfWeek, endOfMonth, endOfQuarter, endOfYear } from 'date-fns';
import { router } from 'expo-router';

import { formatDate, parseDate, startOfPeriod, getLocalTimeZone } from '@/src/utils/timezoneBullshit';

export type NotePeriod = 'day' | 'week' | 'lastWeek' | 'month' | 'quarter' | 'year' | 'allTime';

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
	
		if (period === 'allTime') {
			start = new Date(2000, 0, 1);
			end = new Date(2100, 11, 31);
		} else {
			start = startOfPeriod(parsedDate, period as any, timeZone);
			end = start; // Initialize end date
	
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
		}
	
		const startDate = formatDate(start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timeZone);
		const endDate = formatDate(end, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timeZone);
	
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

	const openTasks = useCallback((screen?: 'list' | 'projects' | 'checklist') => {
		if (screen) {
			router.push(`/tasks/${screen}`);
		} else {
			router.push('/tasks');
		}
	}, []);

	const openMoods = useCallback((screen?: 'dashboard' | 'list' | 'graph') => {
		if (screen) {
			router.push(`/mood/${screen}`);
		} else {
			router.push('/mood');
		}
	}, []);

	const openDatabase = useCallback(() => {
		router.push('/database');
	}, []);

	const openMoney = useCallback((screen?: 'list' | 'graph') => {
		if (screen) {
			router.push(`/money/${screen}`);
		} else {
			router.push('/money');
		}
	}, []);

	const openHomepage = useCallback(() => {
		router.replace('/index');
	}, []);

	const openMusic = useCallback(() => {
		router.push('/library/music');
	}, []);

	const openTime = useCallback((screen?: 'list' | 'timeline' | 'graph') => {
		if (screen) {
			router.push(`/time/${screen}`);
		} else {
			router.push('/time');
		}
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