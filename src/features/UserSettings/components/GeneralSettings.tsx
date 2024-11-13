// Libraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Components
import AppSettingRow from '@/src/features/UserSettings/components/atoms/AppSettingRow';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useSettings } from '@/src/features/UserSettings/hooks/useSettings';

const GeneralSettings: React.FC = () => {
	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors, designs);

	const { settings, updateSetting, fetchSettings } = useSettings();
	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);

	return (
		<View style={styles.container}>
			<ScrollView 
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
			>
				<Text style={designs.text.title}>General Settings</Text>
				<Text style={{ color: themeColors.gray, marginTop: 10 }}>
					Activate or deactivate sections of the app.
				</Text>
				<Text style={{ color: themeColors.gray }}>
					Restart to see the changes applied.
				</Text>
				<View style={styles.sectionContainer} >
					<AppSettingRow
						settingKey="HidePeople"
						label="👤   Hide People"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideTasks"
						label="✅   Hide Tasks"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideJournal"
						label="📝   Hide Journal"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideMoods"
						label="💭   Hide Moods"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideLibrary"
						label="📚   Hide Library"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideMoney"
						label="💸   Hide Money"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideTime"
						label="🕒   Hide Time"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideMusic"
						label="🎧   Hide Music"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideCarLocation"
						label="🚗   Hide Car Location"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
				</View>
				<Text style={{ color: themeColors.gray }}>
					Further customization of the homepage
				</Text>
				<View style={styles.sectionContainer} >
					<AppSettingRow
						settingKey="HideNextTask"
						label="Hide Next Task"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideDots"
						label="Hide Note Status Dots"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
					<AppSettingRow
						settingKey="HideNextObjective"
						label="Hide Next Objective"
						type="appSettings"
						settings={settings}
						updateSetting={updateSetting}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const getStyles = (themeColors: any, designs: any) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			padding: 20,
			paddingTop: 0,
		},
		sectionContainer: {
			marginVertical: 20,
			backgroundColor: themeColors.backgroundSecondary,
			borderRadius: 10,
		},
		scrollView: {
			flex: 1,
		},
		scrollViewContent: {
			padding: 20,
			paddingBottom: 80, // Extra padding at the bottom
		},
	});
};

export default GeneralSettings;