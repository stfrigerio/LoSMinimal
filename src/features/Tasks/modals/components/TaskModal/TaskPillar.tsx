import React from 'react';
import { View } from 'react-native';
import { PickerInput, SwitchInput } from '@/src/components/FormComponents';

interface TaskPillarProps {
    showPillar: boolean;
    setShowPillar: (value: boolean) => void;
    selectedPillarUuid: string | undefined;
    setSelectedPillarUuid: (value: string) => void;
    pillarItems: Array<{ label: string; value: string }>;
    styles: any;
}

export const TaskPillar: React.FC<TaskPillarProps> = ({
    showPillar,
    setShowPillar,
    selectedPillarUuid,
    setSelectedPillarUuid,
    pillarItems,
    styles
}) => {
    return (
        <>
            <View style={styles.switchContainer}>
                <SwitchInput
                    label="Add Pillar"
                    value={showPillar}
                    trueLabel="Add pillar"
                    falseLabel=""
                    leftLabelOff={true}
                    onValueChange={(value) => setShowPillar(value)}
                />
            </View>
            {showPillar && (
                <View style={{ width: '100%' }}>
                    <PickerInput
                        label="Pillar"
                        selectedValue={selectedPillarUuid?.toString() || ''}
                        onValueChange={(itemValue) => setSelectedPillarUuid(itemValue)}
                        items={pillarItems}
                    />
                </View>
            )}
        </>
    );
}; 