import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform, Modal } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal'; 

import { useSettings } from '../../hooks/useSettings';
import ColorPicker from './components/ColorPicker';

import { UserSettingData } from '@/src/types/UserSettings';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import Toast from 'react-native-toast-message';


interface AddHabitModalProps {
	visible: boolean;
	onClose: () => void;
	initialHabit?: UserSettingData;
	onUpdate: (newHabit: UserSettingData) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, initialHabit, onUpdate }) => {
	const { theme, designs } = useThemeStyles();
	const styles = getStyles(theme);
	const [newHabitName, setNewHabitName] = useState('');
	const [newHabitType, setNewHabitType] = useState<'booleanHabits' | 'quantifiableHabits'>('booleanHabits');
	const [habitColor, setHabitColor] = useState('#FFFFFF');
	const [habitEmoji, setHabitEmoji] = useState('');
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [tempColor, setTempColor] = useState('#FFFFFF');
	const [isEditing, setIsEditing] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const { addNewHabit } = useSettings();

	useEffect(() => {
		if (initialHabit) {
			setNewHabitName(initialHabit.settingKey);
			setNewHabitType(initialHabit.type as 'booleanHabits' | 'quantifiableHabits');
			setHabitColor(initialHabit.color || '#FFFFFF');
			setHabitEmoji(initialHabit.value);
			setIsEditing(true);
		} else {
			resetForm();
		}
	}, [initialHabit]);

	const resetForm = () => {
		setNewHabitName('');
		setNewHabitType('booleanHabits');
		setHabitColor('#FFFFFF');
		setHabitEmoji('');
		setIsEditing(false);
	};

	const handleAddNewHabit = () => {
		if (!newHabitName.trim()) {
			setShowAlert(true);
			return;
		}

		if (initialHabit) {
			const updatedHabit = {
				...initialHabit,
				settingKey: newHabitName,
				type: newHabitType,
				color: habitColor,
				value: habitEmoji || '📌', // Use a default emoji if none is provided
			};
			onUpdate(updatedHabit);
			resetForm();
			onClose();
			Toast.show({
				text1: 'Habit updated',
				text2: `${habitEmoji || '📌'} ${newHabitName} has been updated.`,
			});
		} else {
			const newHabit = {
				settingKey: newHabitName,
				type: newHabitType,
				color: habitColor,
				value: habitEmoji || '📌', // Use a default emoji if none is provided
			};

			addNewHabit(newHabit).then(() => {
				resetForm();
				onClose();
			}).catch((error) => {
				console.error(`Error adding new habit: ${error}`);
			});
			Toast.show({
				text1: 'Habit added',
				text2: `${habitEmoji || '📌'} ${newHabitName} has been added.`,
			});
		}
	};

	const handleColorSelect = (color: string) => {
		setTempColor(color);
	};

	const confirmColor = () => {
		setHabitColor(tempColor);
		setShowColorPicker(false);
	};

	const renderColorPicker = () => {
		if (!ColorPicker) return null;
	
		return (
			<UniversalModal
				isVisible={showColorPicker}
				onClose={() => setShowColorPicker(false)}
			>
				<View style={[styles.colorPickerContent]}>
					<ColorPicker
						onColorSelected={handleColorSelect}
						style={{ width: '100%', height: 600 }}
						initialColor={habitColor}
					/>
					<View style={styles.colorPickerButtons}>
						<PrimaryButton
							text='Cancel'
							variant='secondary'
							onPress={() => setShowColorPicker(false)}
						/>
						<PrimaryButton
							text='Confirm'
							variant='primary'
							onPress={confirmColor}
						/>
					</View>
				</View>
			</UniversalModal>
		);
	};
	
	const selectHabitType = (type: 'booleanHabits' | 'quantifiableHabits') => {
		setNewHabitType(type);
	};

	const modalContent = (
		<View style={styles.modalContent}>
			<Text style={designs.modal.title}>{isEditing ? 'Edit Habit' : 'Add New Habit'}</Text>
			<TextInput
				style={styles.inputHabitText}
				onChangeText={setNewHabitName}
				value={newHabitName}
				placeholder="New habit name"
				placeholderTextColor='#969DA3'
			/>
			<TextInput
				style={styles.inputHabitText}
				onChangeText={setHabitEmoji}
				value={habitEmoji}
				placeholder="Habit emoji (optional)"
				placeholderTextColor='#969DA3'
			/>
			<View style={{ height: 20 }}/>
			<View style={styles.habitTypeContainer}>
				<Pressable
					style={[
						styles.habitTypeButton,
						newHabitType === 'booleanHabits' && styles.selectedHabitType
					]}
					onPress={() => selectHabitType('booleanHabits')}
				>
					<Text style={[
						styles.habitTypeText,
						newHabitType === 'booleanHabits' && styles.selectedHabitTypeText
					]}>Boolean</Text>
				</Pressable>
				<Pressable
					style={[
						styles.habitTypeButton,
						newHabitType === 'quantifiableHabits' && styles.selectedHabitType
					]}
					onPress={() => selectHabitType('quantifiableHabits')}
				>
					<Text style={[
						styles.habitTypeText,
						newHabitType === 'quantifiableHabits' && styles.selectedHabitTypeText
					]}>Quantifiable</Text>
				</Pressable>
			</View>
			<View style={styles.colorSelectionContainer}>
				<Pressable
					style={styles.colorPickerButton}
					onPress={() => setShowColorPicker(true)}
				>
					<View style={[styles.colorDot, { backgroundColor: habitColor }]} />
					<Text style={styles.colorPickerButtonText}>Select Color</Text>
				</Pressable>
			</View>
			<View style={{ width: '100%' }}>
				<PrimaryButton
					text={isEditing ? 'Update habit' : 'Add habit'}
					onPress={handleAddNewHabit}
				/>
			</View>
		</View>
	);

	return (
		<>
			<UniversalModal isVisible={visible} onClose={onClose}>
				{modalContent}
			</UniversalModal>
			{renderColorPicker()}
			{showAlert && (
				<AlertModal
					isVisible={showAlert}
					title="Error"
					message="Please enter a habit name."
					onConfirm={() => setShowAlert(false)}
					onCancel={() => setShowAlert(false)}
				/>
			)}
		</>
	);
};

const getStyles = (theme: Theme) => StyleSheet.create({
	modalContent: {
		width: '100%',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	inputHabitText: {
		marginTop: 20, 
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 10,
		borderColor: theme.colors.borderColor,
		paddingHorizontal: 18,
		width: '100%',
		color: theme.colors.textColor,
		height: 60
	},
	habitTypeContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
	},
	habitTypeButton: {
		flex: 1,
		padding: 10,
		borderWidth: 1,
		borderColor: theme.colors.borderColor,
		borderRadius: 10,
		marginHorizontal: 5,
		alignItems: 'center',
	},
	selectedHabitType: {
		borderColor: theme.colors.accentColor,
	},
	habitTypeText: {
		color: theme.colors.textColor,
		fontSize: 10,
	},
	selectedHabitTypeText: {
		color: theme.colors.accentColor,
		fontWeight: 'bold',
	},
	colorSelectionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 20,
	},
	colorDot: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: theme.colors.borderColor,
	},
	colorPickerButton: {
		flexDirection: 'row',
		padding: 10,
		borderRadius: 5,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorPickerButtonText: {
		marginLeft: 15,
		color: theme.colors.textColor,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	colorPickerContent: {
		marginTop: 20,
		backgroundColor: theme.colors.backgroundColor,
		borderRadius: 10,
		height: 500,
	},
	colorPickerButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		// gap: 20,
	},
});

export default AddHabitModal;