import { useState, useEffect, useMemo } from 'react';
import * as Notifications from 'expo-notifications';

import { databaseManagers } from '@/database/tables';
import { UseQuantifiableHabitsType, UseQuantifiableHabitsReturnType } from '@/app/(drawer)/features/DailyNote/types/QuantifiableHabits';
import { habitThresholds } from '@/app/(drawer)/features/DailyNote/components/QuantifiableHabits/helpers/colors';
import { capitalize } from '@/src/utils/textManipulations';
import { QuantifiableHabitsData } from '@/src/types/QuantifiableHabits';

export const useQuantifiableHabits: UseQuantifiableHabitsType = (data: any, date: any): UseQuantifiableHabitsReturnType => {
	const [optimisticUpdates, setOptimisticUpdates] = useState<{ [key: string]: number }>({});
	const [emojis, setEmojis] = useState<{ [key: string]: string }>({});

	// Convert data into habits object, incorporating any optimistic updates
	const habits = useMemo(() => {
		const baseHabits = Object.fromEntries(
			data.map((item: any) => [item.habitKey, { value: item.value, uuid: item.uuid || '' }])
		);

		// Apply any optimistic updates
		return Object.entries(baseHabits).reduce((acc, [key, habit]) => {
			acc[key] = {
				...habit,
				value: optimisticUpdates[key] ?? habit.value
			};
			return acc;
		}, {} as { [key: string]: { value: number; uuid: string } });
	}, [data, optimisticUpdates]);

	useEffect(() => {
		const fetchEmojis = async () => {
			try {
				const emojiSettings = await databaseManagers.userSettings.getByType('quantifiableHabits');
				const emojiMap: { [key: string]: string } = {};
				
				emojiSettings.forEach(setting => {
					if (setting.settingKey && setting.value) {
						emojiMap[setting.settingKey] = setting.value;
					}
				});
				
				setEmojis(emojiMap);
			} catch (error) {
				console.error('Failed to fetch habit emojis:', error);
			}
		};

		fetchEmojis();
	}, []);

	const scheduleMindfulReminder = async (habit: string) => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Mindful Reminder",
				body: `Looks like you're having a lot of ${habit} today. Remember to take it easy!`,
				data: { habit },
			},
			trigger: { seconds: 1 },
		});
	};

	const handleIncrement = async (uuid: string, habitKey: string) => {
		const key = habitKey as keyof typeof habitThresholds;
		const currentValue = habits[key]?.value ?? 0;
		const newValue = currentValue + 1;
	
		// Set optimistic update
		setOptimisticUpdates(prev => ({ ...prev, [key]: newValue }));
	
		if (habitThresholds[key] && newValue >= habitThresholds[key].red) {
		  const habitForReminder = emojis[key] || capitalize(key);
		  scheduleMindfulReminder(habitForReminder);
		}
	
		await updateDatabaseAndPropagate(uuid, key, newValue);
	};
	
	const handleDecrement = async (uuid: string, habitKey: string) => {
		const key = habitKey as keyof typeof habitThresholds;
		const currentValue = habits[key]?.value ?? 0;
		const newValue = Math.max(0, currentValue - 1);
	
		// Set optimistic update
		setOptimisticUpdates(prev => ({ ...prev, [key]: newValue }));
	
		await updateDatabaseAndPropagate(uuid, key, newValue);
	};
	
	const updateDatabaseAndPropagate = async (uuid: string, habitKey: string, newValue: number) => {
		habitKey = capitalize(habitKey);
		await databaseManagers.quantifiableHabits.upsert({
			uuid: uuid,
			date: date, 
			habitKey,
			value: newValue
		} as QuantifiableHabitsData)

		// Fetch the daily note and get its UUID
		const dailyNotes = await databaseManagers.dailyNotes.getByDate(date);
		if (dailyNotes.length > 0) {
			const dailyNoteUuid = dailyNotes[0].uuid;
			await databaseManagers.dailyNotes.upsert({
				uuid: dailyNoteUuid,
				updatedAt: new Date().toISOString()
			});
		}
		
	};

	return { habits, emojis, handleIncrement, handleDecrement };
};