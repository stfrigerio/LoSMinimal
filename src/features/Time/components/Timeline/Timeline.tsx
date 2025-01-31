import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface TimelineEvent {
	date: string;
	title: string;
	description: string;
}

export const Timeline: React.FC = () => {
	const [events, setEvents] = useState<TimelineEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors);

	useEffect(() => {
		loadEvents();
	}, []);

	const loadEvents = async () => {
		try {
			// Import the JSON file

			// const data = require('@/src/features/Time/components/Timeline/lifeEvents.json');
			// setEvents(data.events);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={themeColors.accentColor} />
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.timelineContainer}>
				{events && events.map((event, index) => (
					<View key={index} style={styles.eventContainer}>
						<View style={styles.dateContainer}>
							<Text style={styles.dateText}>{event.date}</Text>
						</View>
						
						<View style={styles.lineContainer}>
							<View style={styles.dot} />
							{index !== events.length - 1 && <View style={styles.line} />}
						</View>

						<View style={styles.contentContainer}>
							<Text style={styles.titleText}>{event.title}</Text>
							<Text style={styles.descriptionText}>{event.description}</Text>
						</View>
					</View>
				))}
				{events.length === 0 && <Text style={{...designs.text, color: themeColors.textColor}}>Nothing to see here</Text>}
			</View>
		</ScrollView>
	);
};

const getStyles = (theme: any) => StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.backgroundColor,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.backgroundColor,
	},
	timelineContainer: {
		paddingVertical: 20,
		paddingHorizontal: 16,
	},
	eventContainer: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	dateContainer: {
		width: 80,
		paddingRight: 12,
	},
	dateText: {
		fontSize: 14,
		fontWeight: '600',
		color: theme.textColor,
		textAlign: 'right',
	},
	lineContainer: {
		alignItems: 'center',
		width: 20,
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: theme.accentColor || '#3498db',
	},
	line: {
		width: 2,
		flex: 1,
		backgroundColor: theme.borderColor || '#e0e0e0',
		position: 'absolute',
		top: 16,
		bottom: -20,
	},
	contentContainer: {
		flex: 1,
		paddingLeft: 12,
		paddingRight: 16,
	},
	titleText: {
		fontSize: 16,
		fontWeight: '600',
		color: theme.textColor,
		marginBottom: 4,
	},
	descriptionText: {
		fontSize: 14,
		color: theme.secondaryTextColor || theme.textColor,
		lineHeight: 20,
	},
});
