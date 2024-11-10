import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import GeneralSettings from './components/GeneralSettings';
import DefaultTagsAndDescriptions from './components/DefaultTagsAndDescriptions'
import DailyNoteSettings from './components/DailyNoteSettings';
import Navbar from '@/app/components/NavBar';
import PillarManager from './components/Pillars';
import { NotificationManager } from './components/NotificationManager';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

const UserSettings: React.FC = () => {
	const [pageIndex, setPageIndex] = useState(0);
	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	const screens = [
		'Tags', 
		'Pillars', 
		'General Settings', 
		'Notifications', 
		'Daily Settings', 
	];

	const renderContent = () => {
		switch (pageIndex) {
			case 0:
				return <DefaultTagsAndDescriptions />;
			case 1:
				return <PillarManager />;
			case 2:
				return <GeneralSettings />;
			case 3:
				return <NotificationManager />;
			case 4:
				return <DailyNoteSettings />;
			default:
				return null;
		}
	};

	const navItems = useMemo(() => 
		screens.map((screen, index) => ({
			label: screen,
			onPress: () => setPageIndex(index),
		})),
		[screens]
	);

	return (
		<View style={styles.mainContainer}>
			<View style={styles.content}>
				{renderContent()}
			</View>
			{navItems.length > 0 && (
				<Navbar
					items={navItems}
					activeIndex={pageIndex}
					screen="userSettings"
				/>
			)}
		</View>
	);
};

const getStyles = (theme: any) => {
	return StyleSheet.create({
		content: {
			flex: 1,
		},
		mainContainer: {
			paddingTop: 37,
			flex: 1,
			backgroundColor: theme.backgroundColor,
		},
		button: {
			margin: 10,
			padding: 8,
			backgroundColor: theme.backgroundColor,
			borderRadius: 10,
			alignSelf: 'flex-start',
		},
		activeButton: {
			backgroundColor: theme.hoverColor,
		},
		text: {
			color: theme.textColor,
		},
		navBar: {
			flexDirection: 'row',
			flexWrap: 'wrap', 
			justifyContent: 'space-around',
			backgroundColor: theme.borderColor
		},
		pagerView: {
			flex: 1,
		},
	});
};

export default UserSettings;