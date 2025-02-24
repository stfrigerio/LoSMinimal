import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Navbar from '@/src/components/NavBar';
import EditTimeEntryModal from './modals/EditModal';
import Banner from '@/src/components/Banner';

import { useThemeStyles, Theme } from '../../styles/useThemeStyles';
import { useTimeData } from './hooks/useTimeData';
import { TimeData } from '../../types/Time';
import { navItems } from './constants/navItems';

const TimeHub: React.FC = () => {
	const { theme, designs } = useThemeStyles();
	const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	// Assume useTimeData now provides a list of timeEntries
	const { entries: timeEntries, addTimeEntry } = useTimeData();

  	// Compute summary statistics based on the timeEntries array
	const { totalEntries, totalTrackedTime, averageSession } = useMemo(() => {
		const durationToSeconds = (duration: string) => {
			const parts = duration.split(':').map(Number);
			return parts[0] * 3600 + parts[1] * 60 + parts[2];
		};

		const formatSeconds = (totalSeconds: number) => {
			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;
			return [
				hours.toString().padStart(2, '0'),
				minutes.toString().padStart(2, '0'),
				seconds.toString().padStart(2, '0'),
			].join(':');
		};

		const totalEntries = timeEntries.length;
		const totalSeconds = timeEntries.reduce((sum, entry) => {
			// If duration is not set, default to 0 seconds
			return sum + (entry.duration ? durationToSeconds(entry.duration) : 0);
		}, 0);
		const averageSeconds = totalEntries ? Math.floor(totalSeconds / totalEntries) : 0;

		return {
			totalEntries,
			totalTrackedTime: formatSeconds(totalSeconds),
			averageSession: formatSeconds(averageSeconds),
		};
	}, [timeEntries]);

	const handleAddNewTimer = (newEntry: TimeData) => {
		addTimeEntry(newEntry);
		setIsAddModalOpen(false);
	};

	return (
		<View style={styles.container}>
			<Banner imageSource={require('@/assets/images/time.webp')} />
			<Text style={designs.text.title}>
				Time
			</Text>
			
			<View style={styles.summaryContainer}>
				<View style={styles.summaryItem}>
					<Text style={styles.summaryLabel}>Total Entries</Text>
					<Text style={styles.summaryValue}>{totalEntries}</Text>
				</View>
				<View style={styles.summaryItem}>
					<Text style={styles.summaryLabel}>Total Tracked Time</Text>
					<Text style={styles.summaryValue}>{totalTrackedTime.split(':')[0]}h</Text>
				</View>
				<View style={styles.summaryItem}>
					<Text style={styles.summaryLabel}>Average Session</Text>
					<Text style={styles.summaryValue}>{averageSession}</Text>
				</View>
			</View>
			
			<Navbar
				items={navItems} 
				activeIndex={navItems.findIndex(item => item.label === 'Dashboard')} 
				showFilter={false}
				quickButtonFunction={() => setIsAddModalOpen(true)}
				screen="time"
			/>
			
			{isAddModalOpen && (
				<EditTimeEntryModal
					isVisible={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					onSave={handleAddNewTimer}
					timeEntry={{
						date: new Date().toISOString(),
						startTime: new Date().toISOString(),
						endTime: new Date().toISOString(),
						duration: '00:00:00',
						tag: '',
						description: '',
					}}
				/>
			)}
		</View>
	);
};

const getStyles = (theme: Theme, designs: any) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.backgroundColor,
			padding: 20,
			paddingTop: 37,
		},
		summaryContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginVertical: 20,
			paddingHorizontal: 10,
		},
		summaryItem: {
			alignItems: 'center',
			flex: 1,
		},
		summaryLabel: {
			color: theme.colors.textColorItalic,
			marginBottom: 5,
			textAlign: 'center',
		},
		summaryValue: {
			color: theme.colors.textColor,
			fontWeight: 'bold',
			textAlign: 'center',
		},
	});
};

export default TimeHub;
