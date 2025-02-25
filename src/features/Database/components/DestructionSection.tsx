import React, { useState } from 'react';
import { View } from 'react-native';

import { PickerInput } from '@/src/components/FormComponents';
import AlertModal from '@/src/components/modals/AlertModal';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { databaseManagers } from '@/database/tables';
import { databaseManager } from '@/database/databaseManager';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

const DestructionSection = () => {
	const [selectedTable, setSelectedTable] = useState('');
	const { theme } = useThemeStyles();

	const [alertModalVisible, setAlertModalVisible] = useState(false);
	const [alertTitle, setAlertTitle] = useState('');
	const [alertMessage, setAlertMessage] = useState('');
	const [alertConfirmAction, setAlertConfirmAction] = useState<() => void>(() => {});

	const showAlert = (title: string, message: string, onConfirm: () => void) => {
		setAlertTitle(title);
		setAlertMessage(message);
		setAlertConfirmAction(() => onConfirm);
		setAlertModalVisible(true);
	};

	const dropDatabases = async (dropAll: boolean) => {
		const message = dropAll
			? "Are you sure you want to delete the database? This action cannot be undone."
			: `Are you sure you want to delete the ${selectedTable} table? This action cannot be undone.`;

		showAlert(
			"Confirm Delete",
			message,
			() => dropAll ? performDatabaseDrop() : performDatabaseDropByTable()
		);
	};

	const performDatabaseDrop = async () => {
		try {
			await databaseManager.dropAllTables();
			showAlert('Success', 'Database deleted successfully', () => {});
		} catch (error) {
			console.error("Failed to delete database:", error);
			showAlert('Error', 'Failed to delete database', () => {});
		}
	};

	const performDatabaseDropByTable = async () => {
		if (!selectedTable) {
			showAlert('Error', 'Please select a table to drop.', () => {});
			return;
		}
		try {
			await databaseManager.dropTable(selectedTable);
			showAlert('Success', `Table ${selectedTable} deleted successfully`, () => {});
		} catch (error) {
			console.error(`Failed to delete table ${selectedTable}:`, error);
			showAlert('Error', `Failed to delete table ${selectedTable}`, () => {});
		}
	};

	return (
		<View style={{ marginTop: 10, marginHorizontal: 10 }}>
			<PickerInput
				label="Select a table to destroy"
				selectedValue={selectedTable}
				onValueChange={(itemValue) => setSelectedTable(itemValue)}
				items={[
					{ label: 'None', value: '' },
					...Object.keys(databaseManagers).map((table) => ({ label: table, value: table }))
				]}
			/>
			<PrimaryButton
				text="⚠️DELETE selected table⚠️"
				variant="secondary"
				onPress={() => dropDatabases(false)}
			/>
			<PrimaryButton
				text="💥NUKE DATABASE💥"
				variant="secondary"
				onPress={() => dropDatabases(true)}
			/>
			{alertModalVisible && (
				<AlertModal
					isVisible={alertModalVisible}
					title={alertTitle}
					message={alertMessage}
					onConfirm={() => {
						setAlertModalVisible(false);
						alertConfirmAction();
					}}
					onCancel={() => setAlertModalVisible(false)}
				/>
			)}
		</View>
	);
};

export default DestructionSection;