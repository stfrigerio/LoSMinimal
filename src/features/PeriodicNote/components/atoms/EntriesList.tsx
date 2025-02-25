import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Theme, useThemeStyles } from '../../../../styles/useThemeStyles';
import { GlitchText } from '@/src/styles/GlitchText';

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
				<GlitchText
					glitch={theme.name === 'signalis'}
					style={styles.toggleButtonText}
				>
					{isVisible ? `Hide ${title}` : `Show ${title}`}
				</GlitchText>
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

const getStyles = (theme: Theme) => StyleSheet.create({
	container: {
		marginTop: theme.spacing.xs,
	},
	toggleButton: {
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	toggleButtonText: {
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
		fontSize: 16,
		...(theme.name === 'signalis' && {
			fontSize: 12,
			color: theme.colors.textColor,
			fontFamily: theme.typography.fontFamily.primary,
			textShadowColor: theme.colors.textColorBold,
			textShadowOffset: { width: 1, height: 1 },
			textShadowRadius: 12,
		}),
	},
	entriesList: {
		paddingHorizontal: 10,
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
		...(theme.name === 'signalis' && {
			fontFamily: theme.typography.fontFamily.secondary,
			fontSize: 18,
		}),
	},
	percentageText: {
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
		width: 50,
		textAlign: 'center',
		marginRight: theme.spacing.xs,
		...(theme.name === 'signalis' && {
			fontFamily: theme.typography.fontFamily.primary,
			fontSize: 12,
		}),
	},
	valueText: {
		color: theme.name === 'dark' ? theme.colors.textColor : 'white',
		width: 80,
		textAlign: 'right',
		...(theme.name === 'signalis' && {
			fontFamily: theme.typography.fontFamily.primary,
			fontSize: 12,
		}),
	},
});

export default EntriesList;