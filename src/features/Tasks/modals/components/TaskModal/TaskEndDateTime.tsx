import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SwitchInput } from '@/src/components/FormComponents';

interface TaskEndDateTimeProps {
	showEndDateTime: boolean;
	setShowEndDateTime: (value: boolean) => void;
	endDateInput: string;
	showDateTimePicker: (isStart: boolean, isDate: boolean) => void;
	styles: any;
}

export const TaskEndDateTime: React.FC<TaskEndDateTimeProps> = ({
	showEndDateTime,
	setShowEndDateTime,
	endDateInput,
	showDateTimePicker,
	styles
}) => {
  return (
		<>
			<View style={styles.switchContainer}>
				<SwitchInput
				label="Add end time"
				value={showEndDateTime}
				trueLabel="Add end time"
				falseLabel=""
				leftLabelOff={true}
				onValueChange={(value) => setShowEndDateTime(value)}
				/>
			</View>
			{showEndDateTime && (
				<View style={styles.dateTimeContainer}>
					<Pressable style={styles.dateTimeButton} onPress={() => showDateTimePicker(false, true)}>
						<Text style={styles.dateTimeText}>
							{endDateInput ? new Date(endDateInput).toLocaleDateString() : 'End Date'}
						</Text>
					</Pressable>
					<Pressable style={styles.dateTimeButton} onPress={() => showDateTimePicker(false, false)}>
						<Text style={styles.dateTimeText}>
							{endDateInput ? new Date(endDateInput).toLocaleTimeString() : 'End Time'}
						</Text>
					</Pressable>
				</View>
			)}
		</>
	);
}; 