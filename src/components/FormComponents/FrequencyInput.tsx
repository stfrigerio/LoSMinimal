import React, { useState } from 'react';
import { View } from 'react-native';
import { SwitchInput, PickerInput } from '@/src/components/FormComponents';
import { getFrequencyOptions } from '@/src/components/FormComponents/helpers/frequencyOptions';

interface RepeatFrequencySelectorProps {
    repeat?: string;
    frequency?: string;
    onRepeatChange: (value: string) => void;
    onFrequencyChange: (value: string) => void;
    styles?: any;
    customFrequencyItems?: Array<{ label: string; value: string }>;
    leftLabelOff?: boolean;
}

export const RepeatFrequencySelector: React.FC<RepeatFrequencySelectorProps> = ({
    repeat,
    frequency,
    onRepeatChange,
    onFrequencyChange,
    customFrequencyItems,
    leftLabelOff = true,
}) => {
    const [showFrequency, setShowFrequency] = useState<boolean>(!!frequency);

    const defaultFrequencyItems = [
        { label: 'None', value: '' },
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
    ];

    const frequencyItems = customFrequencyItems || defaultFrequencyItems;

    return (
        <View>
            <SwitchInput
                value={repeat ? true : false}
                trueLabel="Repeats"
                falseLabel="Single"
                leftLabelOff={leftLabelOff}
                onValueChange={(value) => {
                    onRepeatChange(value ? 'true' : '');
                    setShowFrequency(value);
                    if (!value) {
                        onFrequencyChange('');
                    }
                }}
            />

            {showFrequency && (
                <>
                    <PickerInput
                        label="Frequency"
                        selectedValue={frequency || ''}
                        onValueChange={(itemValue) => {
                            if (itemValue === '') {
                                onFrequencyChange('');
                            } else {
                                const firstOption = getFrequencyOptions(itemValue)[0];
                                onFrequencyChange(firstOption ? firstOption.value : '');
                            }
                        }}
                        items={frequencyItems}
                    />
                    {frequency && frequency !== '' && (
                        <PickerInput
                            label="Frequency details"
                            selectedValue={frequency}
                            onValueChange={(itemValue) => onFrequencyChange(itemValue)}
                            items={getFrequencyOptions(frequencyItems.find(item => 
                                getFrequencyOptions(item.value).some(option => 
                                    option.value === frequency
                                )
                            )?.value || '')}
                        />
                    )}
                </>
            )}
        </View>
    );
};