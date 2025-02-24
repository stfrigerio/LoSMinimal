import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface TableCellProps {
	displayValue: string;
	tableName: string;
	columnName: string;
	rowData: any;
}

const TableCell: React.FC<TableCellProps> = ({ displayValue, tableName, columnName }) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	const renderEditableContent = () => {
		if (tableName.toLowerCase() === 'time') {
			if (columnName === 'duration') {
				return (
					<Text style={styles.rowText} numberOfLines={2}>
						{displayValue}
					</Text>
				);
			}
			if (columnName === 'start_time' || columnName === 'end_time') {
				return (
						<Text style={styles.rowText} numberOfLines={2}>
							{displayValue}
						</Text>
				);
			}
		}

		return (
				<Text style={styles.rowText} numberOfLines={2}>
					{displayValue}
				</Text>
		);
	};

	return (
		<>
			{renderEditableContent()}
		</>
	);
};


const getStyles = (theme: Theme) => StyleSheet.create({
	textContainer: {
		justifyContent: 'center',
		minHeight: 40,
	},
	rowText: {
		color: theme.colors.textColor,
		fontSize: 12,
	}
});

export default TableCell;