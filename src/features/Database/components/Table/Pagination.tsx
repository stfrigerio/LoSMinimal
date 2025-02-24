import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface PaginationProps {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	totalItems: number;
	itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	setCurrentPage,
	totalItems,
	itemsPerPage,
}) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<View style={styles.container}>
			<Pressable onPress={handlePrevious} style={styles.button} disabled={currentPage === 1}>
				<Text style={styles.buttonText}>Previous</Text>
			</Pressable>
			<Text style={styles.pageInfo}>
				Page {currentPage} of {totalPages}
			</Text>
			<Pressable onPress={handleNext} style={styles.button} disabled={currentPage === totalPages}>
				<Text style={styles.buttonText}>Next</Text>
			</Pressable>
		</View>
	);
};

const getStyles = (theme: Theme) => StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 20,
	},
	button: {
		padding: 10,
		backgroundColor: theme.colors.backgroundColor,
		borderColor: theme.colors.borderColor,
		borderWidth: 1,
		borderRadius: 5,
	},
	buttonText: {
		color: theme.colors.textColor,
	},
	pageInfo: {
		color: theme.colors.textColor,
	},
});

export default Pagination;