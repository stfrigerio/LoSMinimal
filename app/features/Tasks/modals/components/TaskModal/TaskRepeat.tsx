import React from 'react';
import { View } from 'react-native';
import { SwitchInput } from '@/app/components/FormComponents';

interface TaskRepeatProps {
    repeat: string | undefined;
    setRepeat: (value: string) => void;
    setShowFrequency: (value: boolean) => void;
    styles: any;
}

export const TaskRepeat: React.FC<TaskRepeatProps> = ({
    repeat,
    setRepeat,
    setShowFrequency,
    styles
}) => {
    return (
        <View style={styles.switchContainer}>
            <SwitchInput
                label="Add Repeat"
                value={repeat ? true : false}
                trueLabel="Repeats"
                falseLabel=""
                leftLabelOff={true}
                onValueChange={(value) => {
                    setRepeat(value ? 'true' : '');
                    setShowFrequency(value);
                }}
            />
        </View>
    );
}; 