import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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
	const { theme, designs } = useThemeStyles();
	const styles = getStyles(theme, designs);

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
					trackColor={{ false: theme.colors.backgroundColor, true: theme.colors.backgroundColor }}
					thumbColor={isEnabled ? theme.colors.accentColor : theme.colors.gray}
					onValueChange={handleToggle}
					value={isEnabled}
				/>
			</View>
		</View>
	);
};

const getStyles = (theme: Theme, designs: any) => StyleSheet.create({
	outsideContainer: {
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.backgroundColor,
		paddingHorizontal: 16,
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	label: {
		color: theme.colors.textColor,
	},
	explainerText: {
		color: theme.colors.gray,
	},
});

export default AppSettingRow;