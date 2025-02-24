import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { PickerInput } from '@/src/components/FormComponents';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface TableSelectorProps {
	tables: string[];
	selectedTable: string;
	onSelectTable: (table: string) => void;
}

const tableDisplayNames: { [key: string]: string } = {
	dailyNote: 'Daily Note',
	time: 'Time',
	library: 'Library',
	tasks: 'Tasks',
	money: 'Money',
	text: 'Text',
	mood: 'Mood',
	userSettings: 'User Settings',
	tags: 'Tags'
};

const TableSelector: React.FC<TableSelectorProps> = ({ tables, selectedTable, onSelectTable }) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	if (!tables || tables.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>No tables available</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<PickerInput
				label="Select a table"
				selectedValue={selectedTable}
				onValueChange={(itemValue) => onSelectTable(itemValue)}
				items={[
					{ label: 'None', value: '' },
					...tables.map((table) => ({ label: table, value: table }))
				]}
			/>
		</View>
	);
};

const getStyles = (theme: Theme) => StyleSheet.create({
	container: {
		marginBottom: 20,
		marginTop: 0,
		marginHorizontal: 20,
	},
	errorText: {
		color: theme.colors.red,
		fontSize: 16,
		textAlign: 'center',
	},
});

export default TableSelector;