import React from 'react';
import { View } from 'react-native';
import { PickerInput, SwitchInput } from '@/src/components/FormComponents';

interface TaskPriorityProps {
    showPriority: boolean;
    setShowPriority: (value: boolean) => void;
    priority: number | undefined;
    setPriority: (value: number) => void;
    priorityItems: Array<{ label: string; value: string }>;
    styles: any;
}

export const TaskPriority: React.FC<TaskPriorityProps> = ({
    showPriority,
    setShowPriority,
    priority,
    setPriority,
    priorityItems,
    styles
}) => {
    return (
        <>
            <View style={styles.switchContainer}>
                <SwitchInput
                    value={showPriority}
                    trueLabel="Add priority"
                    falseLabel=""
                    leftLabelOff={true}
                    onValueChange={(value) => setShowPriority(value)}
                />
            </View>
            {showPriority && (
                <View style={{ width: '100%' }}>
                    <PickerInput
                        label="Priority"
                        selectedValue={priority?.toString() || ''}
                        onValueChange={(itemValue) => setPriority(Number(itemValue))}
                        items={priorityItems}
                    />
                </View>
            )}
        </>
    );
}; 