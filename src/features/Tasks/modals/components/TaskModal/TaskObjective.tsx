import React from 'react';
import { View } from 'react-native';
import { PickerInput, SwitchInput } from '@/src/components/FormComponents';

export interface ObjectiveItem {
	label: string;
	value: string;
	pillarUuid?: string;
} 

interface TaskObjectiveProps {
	showObjective: boolean;
	setShowObjective: (value: boolean) => void;
	objectiveUuid: string | undefined;
	setObjectiveUuid: (value: string) => void;
	setShowPillar: (value: boolean) => void;
	setSelectedPillarUuid: (value: string) => void;
	objectiveItems: ObjectiveItem[];
	styles: any;
}

export const TaskObjective: React.FC<TaskObjectiveProps> = ({
	showObjective,
	setShowObjective,
	objectiveUuid,
	setObjectiveUuid,
	setShowPillar,
	setSelectedPillarUuid,
	objectiveItems,
	styles
}) => {
	return (
		<>
			<View style={styles.switchContainer}>
				<SwitchInput
					label="Add Objective"
					value={showObjective}
					trueLabel="Add objective"
					falseLabel=""
					leftLabelOff={true}
					onValueChange={(value) => setShowObjective(value)}
				/>
			</View>
			{showObjective && (
				<View style={{ width: '100%' }}>
					<PickerInput
						label="Objective"
						selectedValue={objectiveUuid || ''}
						onValueChange={(itemValue) => {
							setObjectiveUuid(itemValue);
							const selectedObjective = objectiveItems.find(item => item.value === itemValue);
							if (selectedObjective && selectedObjective.pillarUuid) {
								setShowPillar(true);
								setSelectedPillarUuid(selectedObjective.pillarUuid);
							}
						}}
						items={objectiveItems}
					/>
				</View>
			)}
		</>
	);
}; 