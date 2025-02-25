import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface TaskDateTimeProps {
	dateInput: string;
	showDateTimePicker: (isStart: boolean, isDate: boolean) => void;
	styles: any;
}

export const TaskDateTime: React.FC<TaskDateTimeProps> = ({ 
	dateInput, 
	showDateTimePicker,
	styles 
}) => {
	return (
		<View style={styles.dateTimeContainer}>
			<Pressable style={styles.dateTimeButton} onPress={() => showDateTimePicker(true, true)}>
				<Text style={styles.dateTimeText}>
					{dateInput ? new Date(dateInput).toLocaleDateString() : 'Date'}
				</Text>
			</Pressable>
			<Pressable style={styles.dateTimeButton} onPress={() => showDateTimePicker(true, false)}>
				<Text style={styles.dateTimeText}>
					{dateInput ? new Date(dateInput).toLocaleTimeString() : 'Start Time'}
				</Text>
			</Pressable>
		</View>
	);
}; 