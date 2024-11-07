import React from 'react';
import { View } from 'react-native';
import { PickerInput } from '@/app/components/FormComponents';
import { getFrequencyOptions } from '../utils/frequencyOptions';

interface TaskFrequencyProps {
    frequency: string | undefined;
    setFrequency: (value: string) => void;
    frequencyItems: Array<{ label: string; value: string }>;
    styles: any;
}

export const TaskFrequency: React.FC<TaskFrequencyProps> = ({
    frequency,
    setFrequency,
    frequencyItems,
    styles
}) => {
    return (
        <View style={styles.switchContainer}>
            <PickerInput
                label="Frequency"
                selectedValue={frequency || ''}
                onValueChange={(itemValue) => {
                if (itemValue === '') {
                    setFrequency('');
                } else {
                    const firstOption = getFrequencyOptions(itemValue)[0];
                    setFrequency(firstOption ? firstOption.value : '');
                }
                }}
                items={frequencyItems}
            />
            {frequency && frequency !== '' && (
                <PickerInput
                    label="Frequency details"
                    selectedValue={frequency}
                    onValueChange={(itemValue) => setFrequency(itemValue)}
                    items={getFrequencyOptions(frequencyItems.find(item => 
                        getFrequencyOptions(item.value).some(option => option.value === frequency)
                    )?.value || '')}
                />
            )}
        </View>
    );
}; 