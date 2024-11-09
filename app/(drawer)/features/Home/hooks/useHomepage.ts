import { useSettings as useHomepageSettings } from '@/app/(drawer)/features/UserSettings/hooks/useSettings';

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

export const useHomepage = () => {
	let homepageSettings: HomepageSettings = {};

	if (typeof useHomepageSettings === 'function') {
		const { settings } = useHomepageSettings();
		homepageSettings = {
			HideNextTask: settings.HideNextTask,
			HideDots: settings.HideDots,
			HidePeople: settings.HidePeople,
			HideTasks: settings.HideTasks,
			HideJournal: settings.HideJournal,
			HideMoods: settings.HideMoods,
			HideLibrary: settings.HideLibrary,
			HideMoney: settings.HideMoney,
			HideNextObjective: settings.HideNextObjective,
			HideCarLocation: settings.HideCarLocation,
			HideTime: settings.HideTime,
			HideMusic: settings.HideMusic,
		};
	}

	return { 
		homepageSettings,
	};
};