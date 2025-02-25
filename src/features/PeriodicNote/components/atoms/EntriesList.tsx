import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeStyles } from '../../../../styles/useThemeStyles';

export interface EntryData {
	color: string;
	description: string;
	value: string;
	percentage: string;
}

interface EntriesListProps {
	entries: EntryData[];
	title: string;
	valueLabel: string;
}

const EntriesList: React.FC<EntriesListProps> = ({ entries, title, valueLabel }) => {
	const [isVisible, setIsVisible] = useState(false);
	const { themeColors, theme } = useThemeStyles();
	const styles = getStyles(theme, themeColors);

	const sortedEntries = [...entries].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

	return (
		<View style={styles.container}>
			<Pressable onPress={() => setIsVisible(!isVisible)} style={styles.toggleButton}>
				<Text style={styles.toggleButtonText}>{isVisible ? `Hide ${title}` : `Show ${title}`}</Text>
			</Pressable>
			{isVisible && (
				<View style={styles.entriesList}>
					{sortedEntries.map((entry, index) => (
						<View key={index} style={[styles.entryContainer, index === sortedEntries.length - 1 && styles.lastEntry]}>
							<View style={[styles.dot, { backgroundColor: entry.color }]} />
							<View style={styles.entryTextContainer}>
								<Text style={styles.descriptionText}>{entry.description}</Text>
								<Text style={styles.percentageText}>{entry.percentage}%</Text>
								<Text style={styles.valueText}>{entry.value} {valueLabel}</Text>
							</View>
						</View>
					))}
				</View>
			)}
		</View>
	);
};

const getStyles = (theme: any, themeColors: any) => StyleSheet.create({
	container: {
		marginTop: 10,
	},
	toggleButton: {
		padding: 10,
		// marginLeft: 10, //^ 
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	toggleButtonText: {
		color: theme === 'dark' ? themeColors.textColor : 'white',
		fontSize: 16,
	},
	entriesList: {
		paddingHorizontal: 20,
	},
	entryContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: themeColors.borderColor,
	},
	lastEntry: {
		borderBottomWidth: 0,
		marginBottom: 20,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginRight: 8,
	},
	entryTextContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
	},
	descriptionText: {
		color: theme === 'dark' ? themeColors.textColor : 'white',
		flex: 1,
		marginRight: 10,
	},
	percentageText: {
		color: theme === 'dark' ? themeColors.textColor : 'white',
		width: 50,
		textAlign: 'center',
		marginRight: 10,
	},
	valueText: {
		color: theme === 'dark' ? themeColors.textColor : 'white',
		width: 80,
		textAlign: 'right',
	},
});

export default EntriesList;