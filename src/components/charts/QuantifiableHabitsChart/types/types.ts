export interface ChartData {
	[key: string]: number[] | string[];
	dates: string[];
}

export type PeriodType = 'week' | 'month' | 'quarter' | 'year' | 'allTime';

export interface QuantifiableHabitsChartProps {
	data: ChartData;
	userSettings: any;
	onOpenNote: (date: string) => void;
	onOpenPeriodNote: (startDate: Date, endDate: Date) => void;
	defaultViewType: any;
	periodType: string;
	width: number;
	height: number;
}

export type ViewType = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface ChartToggleProps {
	availableViewTypes: ViewType[];
	viewType: ViewType;
	setViewType: (type: ViewType) => void;
}
