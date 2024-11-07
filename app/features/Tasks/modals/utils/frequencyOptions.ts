interface FrequencyOption {
    label: string;
    value: string;
}

export const getFrequencyOptions = (selectedFrequency: string): FrequencyOption[] => {
    switch (selectedFrequency) {
        case 'daily':
            return [
                { label: 'Every day', value: 'daily' },
                { label: 'Every weekday', value: 'weekday' },
                { label: 'Every weekend', value: 'weekend' },
            ];
        case 'weekly':
            return [
                { label: 'Every Monday', value: 'weekly_mon' },
                { label: 'Every Tuesday', value: 'weekly_tue' },
                { label: 'Every Wednesday', value: 'weekly_wed' },
                { label: 'Every Thursday', value: 'weekly_thu' },
                { label: 'Every Friday', value: 'weekly_fri' },
                { label: 'Every Saturday', value: 'weekly_sat' },
                { label: 'Every Sunday', value: 'weekly_sun' },
            ];
        case 'monthly':
            return [
                { label: 'On the 1st', value: 'monthly_1' },
                { label: 'On the 15th', value: 'monthly_15' },
                { label: 'On the last day', value: 'monthly_last' },
            ];
        case 'yearly':
            return [
                { label: 'On January 1st', value: 'yearly_0101' },
                { label: 'On July 1st', value: 'yearly_0701' },
                { label: 'On December 31st', value: 'yearly_1231' },
            ];
        default:
            return [];
    }
}; 