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
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

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

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		marginTop: theme.spacing.xs,
	},
	toggleButton: {
		padding: 10,
		// marginLeft: 10, //^ 
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	toggleButtonText: {
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
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
		borderBottomColor: theme.colors.borderColor,
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
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
		flex: 1,
		marginRight: theme.spacing.xs,
	},
	percentageText: {
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
		width: 50,
		textAlign: 'center',
		marginRight: theme.spacing.xs,
	},
	valueText: {
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
		width: 80,
		textAlign: 'right',
	},
});

export default EntriesList;