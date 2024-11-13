import React from 'react';
import { View } from 'react-native';
import { FormInput } from '@/src/components/FormComponents';

interface TaskBasicInfoProps {
	itemName: string;
	setItemName: (value: string) => void;
}

export const TaskBasicInfo: React.FC<TaskBasicInfoProps> = ({ itemName, setItemName }) => {
	return (
		<View style={{ width: '100%' }}>
			<FormInput
				label="Task"
				value={itemName}
				onChangeText={setItemName}
				placeholder="Name of the task..."
			/>
		</View>
	);
}; 