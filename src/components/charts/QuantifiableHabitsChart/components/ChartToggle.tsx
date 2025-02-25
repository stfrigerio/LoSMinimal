import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDay, faCalendarWeek, faCalendar, faChartPie } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { ChartToggleProps } from '../types/types';

const ChartToggle: React.FC<ChartToggleProps> = ({ 
	availableViewTypes, 
	viewType, 
	setViewType, 
}) => {
	const { theme } = useThemeStyles();
	const styles = getStyles(theme);

	return (
		<View style={styles.chartToggle}>
			{availableViewTypes.map((type) => (
				<Pressable
					key={type}
					style={[styles.chartButton, viewType === type && styles.activeChartButton]}
					onPress={() => setViewType(type)}
				>
					<FontAwesomeIcon 
						icon={
							type === 'daily' ? faCalendarDay :
							type === 'weekly' ? faCalendarWeek :
							type === 'monthly' ? faCalendar :
							faChartPie
						}
						color={viewType === type ? theme.name === 'signalis' ? theme.colors.backgroundColor : theme.colors.accentColor : theme.colors.textColor}
					/>
					<Text style={[styles.chartButtonText, viewType === type && styles.activeChartButtonText]}>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</Text>
				</Pressable>
			))}
		</View>
	);
};

const getStyles = (theme: Theme) => {
	const { width } = Dimensions.get('window');
	const isDesktop = width > 768;

	return StyleSheet.create({
		chartToggle: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'center',
			marginBottom: 10,
			marginLeft: 10
		},
		chartButton: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: 8,
			borderRadius: 5,
		},
		chartButtonText: {
			marginLeft: 10,
			fontSize: 12,
			color: theme.colors.gray,
			fontFamily: theme.typography.fontFamily.primary,
			...(theme.name === 'signalis' && {
				fontSize: theme.typography.fontSize.md,
				fontFamily: theme.typography.fontFamily.secondary,
			}),
		},
		activeChartButton: {
			...(theme.name === 'signalis' && {
				borderRadius: theme.borderRadius.sm,
				backgroundColor: theme.colors.accentColor,
			}),
		},
		activeChartButtonText: {
			color: theme.colors.textColor,
			...(theme.name === 'signalis' && {
				fontSize: theme.typography.fontSize.xs,
				fontFamily: theme.typography.fontFamily.primary,
				textShadowColor: theme.colors.accentColor,
				textShadowOffset: { width: 1, height: 1 },
				textShadowRadius: 16,
				color: theme.colors.backgroundColor,
			}),
		},
	});
};

export default ChartToggle;