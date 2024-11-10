import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { formatInTimeZone, toDate } from 'date-fns-tz';

import { databaseManagers } from '@/database/tables';

import { DailyNoteData, NoteData } from '@/src/types/DailyNote';
import { UseDailyDataReturnType } from '@/app/(drawer)/features/DailyNote/types/DailyData';
import { BooleanHabitsData } from '@/src/types/BooleanHabits';
import { QuantifiableHabitsData } from '@/src/types/QuantifiableHabits';

export const useDailyData = (
	currentDate: Date,
	lastSubmissionTime: number
): UseDailyDataReturnType => {
	const [dailyData, setDailyData] = useState<DailyNoteData | null>(null);

	// Ref to prevent concurrent fetches
	const isFetchingRef = useRef(false);

	// Memoize timeZone to ensure it doesn't change on every render
	const timeZone = useMemo(
		() => Intl.DateTimeFormat().resolvedOptions().timeZone,
		[]
	);

	// Memoize localDate based on currentDate and timeZone
	const localDate = useMemo(() => {
		return toDate(currentDate, { timeZone });
	}, [currentDate, timeZone]);

	// Memoize dateStr based on localDate and timeZone
	const dateStr = useMemo(() => {
		return formatInTimeZone(localDate, timeZone, 'yyyy-MM-dd');
	}, [localDate, timeZone]);

  	// Fetch daily note and habits
  	const fetchDailyNoteAndHabits = useCallback(async () => {
		if (isFetchingRef.current) {
		// Prevent overlapping fetches
		return;
		}

		isFetchingRef.current = true;

		try {
			// Fetch user settings for boolean and quantifiable habits
			const [userSettingsBooleans, userSettingsQuantifiables] =
				await Promise.all([
					databaseManagers.userSettings.getByType('booleanHabits'),
					databaseManagers.userSettings.getByType('quantifiableHabits'),
				]);

			// Fetch or create daily note for the current date
			let dailyNotes = await databaseManagers.dailyNotes.getByDate(dateStr);
			let dailyNote: NoteData | null = dailyNotes[0] || null;

			if (!dailyNote) {
				// Create a new daily note if it doesn't exist
				dailyNote = await databaseManagers.dailyNotes.upsert({
					date: dateStr,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					synced: 0,
				});
			}

			// Create boolean habits if they don't exist for the current date
			const booleanPromises = userSettingsBooleans.map(async (setting) => {
				const existingHabit =
				await databaseManagers.booleanHabits.getHabitByDateAndKey(
					dateStr,
					setting.settingKey
				);
				if (!existingHabit) {
					await databaseManagers.booleanHabits.upsert({
						date: dateStr,
						habitKey: setting.settingKey,
						value: 0,
					} as BooleanHabitsData);
				}
			});

			// Create quantifiable habits if they don't exist for the current date
			const quantifiablePromises = userSettingsQuantifiables.map(async (setting) => {
				const existingHabit =
					await databaseManagers.quantifiableHabits.getHabitByDateAndKey(
					dateStr,
					setting.settingKey
					);
				if (!existingHabit) {
					await databaseManagers.quantifiableHabits.upsert({
						date: dateStr,
						habitKey: setting.settingKey,
						value: 0,
					} as QuantifiableHabitsData);
				}
			});

			// Wait for all habit creation operations to complete
			await Promise.all([...booleanPromises, ...quantifiablePromises]);

			// Fetch updated habits for the current date
			const [booleanHabits, quantifiableHabits] = await Promise.all([
				databaseManagers.booleanHabits.getByDate(dateStr),
				databaseManagers.quantifiableHabits.getByDate(dateStr),
			]);

			// Filter habits to only include those in current user settings
			const filteredBooleanHabits = booleanHabits.filter((habit) =>
				userSettingsBooleans.some(
					(setting) => setting.settingKey === habit.habitKey
				)
			);

			const filteredQuantifiableHabits = quantifiableHabits.filter((habit) =>
				userSettingsQuantifiables.some(
					(setting) => setting.settingKey === habit.habitKey
				)
			);

			// Prepare the new daily data
			const newDailyData: DailyNoteData = {
				...dailyNote,
				booleanHabits: filteredBooleanHabits,
				quantifiableHabits: filteredQuantifiableHabits,
			};

			// Update state only if data has changed to prevent unnecessary re-renders
			setDailyData((prevData) => {
				if (JSON.stringify(prevData) !== JSON.stringify(newDailyData)) {
					return newDailyData;
				}
				return prevData;
			});
		} catch (error) {
			console.error('Error in fetchDailyNoteAndHabits:', error);
		} finally {
			isFetchingRef.current = false;
		}
	}, [dateStr]);

	// Update day sections
  	const onUpdateDaySections = useCallback(
    	async (updatedFields: Partial<NoteData>) => {
			if (isFetchingRef.current) {
				// Prevent updates while fetching is in progress
				return;
			}

      		isFetchingRef.current = true;

			try {
				const currentNotes = await databaseManagers.dailyNotes.getByDate(dateStr);
				let currentNote: NoteData | null = currentNotes[0] || null;

				if (!currentNote) {
					currentNote = {
						date: dateStr,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						synced: 0,
					};
				}

				const newNoteData: NoteData = {
					...currentNote,
					...updatedFields,
					updatedAt: new Date().toISOString(),
				};

				await databaseManagers.dailyNotes.upsert(newNoteData);

				// After updating, fetch the latest data to ensure consistency
				await fetchDailyNoteAndHabits();
			} catch (error) {
				console.error('Error updating note data:', error);
			} finally {
				isFetchingRef.current = false;
			}
		},
		[dateStr, fetchDailyNoteAndHabits]
	);

	// Effect to fetch data when dateStr or lastSubmissionTime changes
	useEffect(() => {
		fetchDailyNoteAndHabits();
	}, [fetchDailyNoteAndHabits, lastSubmissionTime]);

  	return { dailyData, setDailyData, onUpdateDaySections };
};
