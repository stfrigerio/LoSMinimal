import React from 'react';
import { View, TextInput, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';

import { SectionSelector } from './components/SectionSelector';
import { TagTypeSelector } from './components/TagTypeSelector';
import ColorPicker from './components/ColorPicker';
import AlertModal from '@/src/components/modals/AlertModal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useTagDescriptionForm } from './hooks/useTagDescriptionModal';

import { TagData } from '@/src/types/TagsAndDescriptions';
import { UniversalModal } from '@/src/components/modals/UniversalModal';

interface AddTagDescriptionModalProps {
	isVisible: boolean;
	onClose: () => void;
	onAdd: (itemData: TagData) => void;
	initialData?: TagData;
	getTagsForSelection: (type: string) => TagData[];
	currentSection: string;
	getLinkedDescriptions: (tag: string) => TagData[];
}

const AddTagDescriptionModal: React.FC<AddTagDescriptionModalProps> = ({
	isVisible,
	onClose,
	onAdd,
	initialData,
	getTagsForSelection,
	currentSection,
	getLinkedDescriptions,
}) => {
	const { designs, themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	const {
		itemData,
		selectedSection,
		isTagSelected,
		selectedColor,
		showColorPicker,
		tempColor,
		alertModalVisible,
		alertMessage,
		showWarning,
		linkedDescriptions,
		isTagSelectionModalVisible,
		handleSectionChange,
		handleTypeChange,
		handleAdd,
		updateItemData,
		setAlertModalVisible,
		setShowWarning,
		handleColorSelect,
		confirmColor,
		setShowColorPicker,
		openTagSelectionModal,
		setIsTagSelectionModalVisible,
	} = useTagDescriptionForm({
		initialData,
		currentSection,
		getLinkedDescriptions,
		onAdd,
		onClose,
	});

	const renderColorPicker = () => (
		<Modal visible={showColorPicker} transparent animationType="fade">
			<View style={styles.colorPickerContainer}>
				<View style={styles.colorPickerContent}>
					<ColorPicker
						onColorSelected={handleColorSelect}
						style={{ width: '100%', height: 600 }}
						initialColor={selectedColor}
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
			</View>
		</Modal>
	);

	const renderTagSelectionModal = () => (
		<Modal visible={isTagSelectionModalVisible} transparent animationType="fade">
			<View style={designs.modal.modalContainer}>
				<View style={designs.modal.modalView}>
					<Text style={designs.modal.title}>Select a Tag</Text>
					<FlatList
						data={getTagsForSelection(selectedSection)}
						keyExtractor={(item) => item.uuid!}
						renderItem={({ item }) => (
							<Pressable
								style={styles.tagItem}
								onPress={() => {
									updateItemData('linkedTag', item.text);
									setIsTagSelectionModalVisible(false);
								}}
							>
								<Text style={designs.text.text}>{item.emoji} {item.text}</Text>
							</Pressable>
						)}
					/>
					<PrimaryButton
						text='Close'
						onPress={() => setIsTagSelectionModalVisible(false)}
					/>
				</View>
			</View>
		</Modal>
	);

	return (
		<UniversalModal
			isVisible={isVisible}
			onClose={onClose}
		>
			<Text style={[designs.modal.title, { marginTop: 20, marginBottom: 40 }]}>
				{initialData
					? 'Edit Item'
					: `Add ${isTagSelected ? 'Tag' : 'Description'} for ${selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}`}
			</Text>
			
			<SectionSelector
				selectedSection={selectedSection}
				onSectionChange={handleSectionChange}
			/>
			
			<TagTypeSelector
				isTagSelected={isTagSelected}
				selectedSection={selectedSection}
				onTypeChange={handleTypeChange}
				onDescriptionWarning={() => setShowWarning(true)}
				hasLinkedDescriptions={linkedDescriptions.length > 0}
			/>

			<TextInput
				placeholder={isTagSelected ? "Tag" : "Description"}
				placeholderTextColor={themeColors.gray}
				value={itemData.text}
				onChangeText={(text) => updateItemData('text', text)}
				style={[designs.text.input]}
			/>
			
			{selectedSection !== 'mood' && (
				<>
					<TextInput
						placeholder="Emoji (optional)"
						placeholderTextColor={themeColors.gray}
						value={itemData.emoji}
						onChangeText={(emoji) => updateItemData('emoji', emoji)}
						style={[designs.text.input]}
					/>
					{!isTagSelected && (
						<Pressable
							style={[designs.text.input, { marginVertical: 10 }]}
							onPress={openTagSelectionModal}
						>
							<Text style={designs.text.text}>{itemData.linkedTag || "Select a Tag"}</Text>
						</Pressable>
					)}
				</>
			)}

			{isTagSelected && (
				<View style={styles.colorSelectionContainer}>
					<Pressable
						style={styles.colorPickerButton}
						onPress={() => setShowColorPicker(true)}
					>
						<View style={[styles.colorDot, { backgroundColor: selectedColor }]} />
						<Text style={styles.colorPickerButtonText}>Open Color Picker</Text>
					</Pressable>
				</View>
			)}

			{renderColorPicker()}
			{renderTagSelectionModal()}

			<View style={styles.modalButtonContainer}>
				<PrimaryButton
					variant='secondary'
					text='Cancel'
					onPress={onClose}
				/>
				<PrimaryButton
					variant='primary'
					text={initialData ? 'Update' : 'Add'}
					onPress={handleAdd}
				/>
			</View>

			{showWarning && (
				<Modal visible={showWarning} transparent animationType="fade">
					<View style={designs.modal.modalContainer}>
						<View style={designs.modal.modalView}>
							<Text style={designs.text.title}>Warning</Text>
							<Text style={designs.text.text}>
								This tag has {linkedDescriptions.length} linked description(s). 
								Changing it to a description may cause inconsistencies.
							</Text>
							<Text style={designs.text.text}>Do you want to proceed?</Text>
							<View style={styles.modalButtonContainer}>
								<PrimaryButton
									variant='secondary'
									text='Cancel'
									onPress={() => setShowWarning(false)}
								/>
								<PrimaryButton
									variant='primary'
									text='Proceed'
									onPress={() => handleTypeChange(false)}
								/>
							</View>
						</View>
					</View>
				</Modal>
			)}

			{alertModalVisible && (
				<AlertModal
					isVisible={alertModalVisible}
					title="Warning"
					message={alertMessage}
					onConfirm={() => setAlertModalVisible(false)}
					singleButton={true}
				/>
			)}
		</UniversalModal>
	);
};

const getStyles = (themeColors: any) => StyleSheet.create({
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10, 
    },
	colorSelectionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 10,
	},
	colorDot: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: themeColors.borderColor,
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
		textAlign: 'center',
		fontWeight: 'bold',
		color: themeColors.textColor,
	},
	colorPickerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	colorPickerContent: {
		backgroundColor: themeColors.backgroundColor,
		borderRadius: 10,
		padding: 20,
		width: '90%',
		height: 500,
	},
	colorPickerButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	tagItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: themeColors.borderColor,
	},
}); 

export default AddTagDescriptionModal;