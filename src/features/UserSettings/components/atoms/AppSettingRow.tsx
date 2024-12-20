import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { Settings } from '@/src/types/UserSettings';
import { UserSettingData } from '@/src/types/UserSettings';

interface AppSettingRowProps {
	settingKey: string;
	label: string;
	type: 'appSettings';
	settings: Settings;
	updateSetting: (newHabit: UserSettingData) => Promise<void>;
}

const AppSettingRow: React.FC<AppSettingRowProps> = ({ settingKey, label, type, settings, updateSetting }) => {
	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors, designs);

	const setting = settings[settingKey];
	const [isEnabled, setIsEnabled] = useState(setting?.value === 'true');
	const uuid = setting?.uuid || '';

	useEffect(() => {
		setIsEnabled(setting?.value === 'true');
	}, [setting?.value]);

	const handleToggle = () => {
		const newValue = !isEnabled;
		setIsEnabled(newValue);

		const newHabit: UserSettingData = {
			uuid: uuid,
			settingKey: settingKey,
			value: newValue.toString(),
			type: 'appSettings',
		};

		updateSetting(newHabit);
	};

	return (
		<View style={styles.outsideContainer}>
			<View style={styles.container}>
				<Text style={styles.label}>{label}</Text>
				<Switch
					trackColor={{ false: themeColors.backgroundColor, true: themeColors.backgroundColor }}
					thumbColor={isEnabled ? themeColors.accentColor : themeColors.gray}
					onValueChange={handleToggle}
					value={isEnabled}
				/>
			</View>
		</View>
	);
};

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
	outsideContainer: {
		borderBottomWidth: 1,
		borderBottomColor: themeColors.backgroundColor,
		paddingHorizontal: 16,
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	label: {
		color: themeColors.textColor,
	},
	explainerText: {
		color: themeColors.gray,
	},
});

export default AppSettingRow;