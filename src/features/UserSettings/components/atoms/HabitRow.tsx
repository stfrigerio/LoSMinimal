import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import AddHabitModal from '../modals/AddHabitModal';
import AlertModal from '@/src/components/modals/AlertModal';
import { useColors } from '@/src/utils/useColors';

import { UserSettingData } from '@/src/types/UserSettings';
import DeleteButton from '@/src/components/atoms/DeleteButton';

interface HabitRowProps {
	habitName: string;
	setting: UserSettingData;
	updateSetting: (newHabit: UserSettingData) => Promise<void>;
	deleteRecord: (settingUuid: string) => Promise<void>;
}

const HabitRow: React.FC<HabitRowProps> = ({ habitName, setting, updateSetting, deleteRecord }) => {
	const { themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors, designs);
	const { colors: tagColors } = useColors();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	
	const handlePress = () => {
		setIsModalVisible(true);
	}

	const handleCloseModal = () => {
		setIsModalVisible(false);
	}

	return (
		<>
			<Pressable onPress={handlePress} style={styles.settingRow}>
				<View style={styles.colorDotContainer}>
					<View style={[styles.colorDot, { backgroundColor: tagColors[setting.settingKey] || '#FFFFFF' }]} />
				</View>
				<Text style={styles.habitName}>{habitName}</Text>
				<Text style={styles.emoji}>{setting.value}</Text>
				<DeleteButton
					onDelete={() => setShowAlert(true)}
				/>
			</Pressable>
			{isModalVisible && (
				<AddHabitModal
					visible={isModalVisible}
					onClose={handleCloseModal}
					initialHabit={setting}
					onUpdate={updateSetting}
				/>    
			)}
			{showAlert && (
				<AlertModal
					isVisible={showAlert}
					title="Delete Habit"
					message="Are you sure you want to delete this habit?"
					onConfirm={() => deleteRecord(setting.uuid!)}
					onCancel={() => setShowAlert(false)}
				/>
			)}
		</>
	);
};

const getStyles = (theme: any, designs: any) => StyleSheet.create({
	settingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: theme.borderColor,
		width: '100%',
	},
	habitName: {
		width: '40%',
		paddingRight: 10,
		color: theme.textColor,
	},
	emoji: {
		width: '20%',
		textAlign: 'center',
		fontSize: 18,
	},
	colorDotContainer: {
		width: '10%',
		alignItems: 'center',
	},
	colorDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginRight: 10,
		borderWidth: 1,
		borderColor: theme.borderColor,
	},
	deleteButtonContainer: {
		width: '10%',
		alignItems: 'flex-end',
	},
});

export default HabitRow;