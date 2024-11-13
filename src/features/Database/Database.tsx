import React, { useState, useEffect } from 'react';
import { Text, View, Platform, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLaptop, faMobile, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { SwitchInput } from '@/src/components/FormComponents';
import DatabaseTable from './components/DatabaseTable';

import { useData } from './hooks/useData';
import { sortTableData } from './helpers/sortTableData'
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import TableSelector from './components/TableSelector';
import DestructionSection from './components/DestructionSection';
import ServerSection from './components/ServerSection';

const Database: React.FC = () => {
	const [selectedTable, setSelectedTable] = useState<string>('');

	const [showServerSection, setShowServerSection] = useState(false);
	const [showDestructionSection, setShowDestructionSection] = useState(false);

	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors);


	const {
		tableData,
		isLoading,
		error,
		tables,
		handleUpdate,
		handleRemove
	} = useData();

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.loadingText}>Loading...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	const getSortedTableData = (tableName: string, data: any[]) => {
		if (tableName === 'BooleanHabits') {
			return data
		} else {
			return sortTableData(tableName, data);
		}
	};

	const hiddenColumns = {
		common: ['id', 'uuid', 'createdAt', 'updatedAt', 'synced'],
		specific: {
			'DailyNotes': ['booleanHabits', 'quantifiableHabits'],
			'dailyNotes': ['booleanHabits', 'quantifiableHabits'],
			'Library': ['mediaImage', 'finished'],
			'library': ['mediaImage', 'finished']
		}
	};

	return (
		<View style={styles.superContainer}>
			<View style={styles.switchContainer}>
				<SwitchInput  
					label='Show Server Section'
					value={showServerSection}
					onValueChange={(value) => setShowServerSection(value)}
					trueLabel='Show Server Section'
					falseLabel=''
					leftLabelOff={true}
				/>
				<SwitchInput  
					label='Show Destruction Section'
					value={showDestructionSection}
					onValueChange={(value) => setShowDestructionSection(value)}
					trueLabel='Engage Database Destruction'
					falseLabel=''
					trackColorTrue={themeColors.hoverColor}
					leftLabelOff={true}
				/>
			</View>
			{showDestructionSection && (
				<DestructionSection />
			)}
			<ScrollView style={styles.container}>
				<TableSelector
					tables={tables}
					selectedTable={selectedTable}
					onSelectTable={setSelectedTable}
				/>
				{showServerSection && (
					<ServerSection />
				)}
				{selectedTable && tableData[selectedTable] && (
					<DatabaseTable
						tableData={getSortedTableData(selectedTable, tableData[selectedTable])}
						selectedTable={selectedTable}
						handleUpdate={handleUpdate}
						handleRemove={handleRemove}
						hiddenColumns={hiddenColumns}
					/>
				)}
			</ScrollView>
		</View>
	);
};

export default Database;

const getStyles = (theme: any) => StyleSheet.create({
	superContainer: {
		flex: 1,
		backgroundColor: theme.backgroundColor,
	},
	switchContainer: {
		paddingTop: 50,
		marginLeft: 40,
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'flex-start',
		width: '100%'
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: theme.backgroundColor,
	},
	loadingContainer: {
		backgroundColor: theme.backgroundColor,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 18,
		color: theme.textColor,
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.backgroundColor,
	},
	errorText: {
		fontSize: 18,
		color: 'red',
		textAlign: 'center',
	},
	syncButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginVertical: 10,
	},
	syncButtonLabel: {
		color: 'gray',
		fontSize: 10,
		marginBottom: 5
	},
	syncButtonAndLabelContainer: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	syncButton: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: theme.borderColor,
		padding: 10,
		borderRadius: 10,
	},
	arrowIcon: {
		marginHorizontal: 8,
	},

});

