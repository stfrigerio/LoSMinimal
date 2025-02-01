import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import Color from 'color';

import TagModal from '@/src/components/modals/TagModal';
import { UniversalModal } from '@/src/components/modals/UniversalModal';
import createTimePicker from '@/src/components/DateTimePicker';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMoodNoteModal } from '@/src/features/Mood/modals/hooks/useMoodModal'

import { MoodNoteData } from '@/src/types/Mood';
import { SelectionData } from '@/src/features/Home/components/TimerComponent';
import { TagData } from '@/src/types/TagsAndDescriptions';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import ButtonsSlider from '@/src/components/atoms/ButtonsSlider';
import Toast from 'react-native-toast-message';

interface MoodNoteModalProps {
	isOpen: boolean;
	closeMoodModal: () => void;
	initialMoodNote?: MoodNoteData;
	refreshMoods?: () => void;
	tagColors?: Record<string, string>;
	isEdit?: boolean;
}

const MoodNoteModal: React.FC<MoodNoteModalProps> = ({ isOpen, closeMoodModal, initialMoodNote, refreshMoods, isEdit, tagColors }) => {
	const { theme, themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors);
	const { showPicker } = createTimePicker();

	const [showCommentScreen, setShowCommentScreen] = useState(false);
	const [isTagModalOpen, setIsTagModalOpen] = useState(false);
	const [moodTags, setMoodTags] = useState<TagData[]>(
		initialMoodNote?.tag ? initialMoodNote.tag.split(',').map(tag => ({
			text: tag,
			type: 'moodTag',
			emoji: '',
			linkedTag: null,
			color: tagColors?.[tag] || '', // Use the passed tagColors
		})) : []
	);

	const [moodNote, setMoodNote] = useState<MoodNoteData>(initialMoodNote || {
		date: new Date().toISOString(), // Initialize with current date in ISO format
		rating: 0,
		tag: '',
		description: '',
		comment: '',
		synced: 0,
		createdAt: '',
		updatedAt: '',
	});

	const [dateInput, setDateInput] = useState<string>(moodNote.date || new Date().toISOString());

	const {
		handleSave,
	} = useMoodNoteModal(closeMoodModal);

	const handleChange = (name: string, value: string) => {
		setMoodNote({
		...moodNote,
		[name]: value,
		});
	};

	const updateTagInSelectionData = () => {
		return (updateFunc: (prevData: SelectionData) => SelectionData) => {
			const updatedData = updateFunc({} as SelectionData);
			
			const selectedTag = updatedData.selectedTag;
			
			if (selectedTag && !moodTags.some(tag => tag.text === selectedTag.text)) {
				setMoodTags(prevTags => [...prevTags, selectedTag]);
			}

			setIsTagModalOpen(false);
		};
	};

	const removeMoodTag = (tagToRemove: TagData) => {
		setMoodTags(prevTags => prevTags.filter(tag => tag.text !== tagToRemove.text));
	};

	const handleCommentChange = (text: string) => {
		handleChange('comment', text);
	};

	const handleSaveMoodNote = () => {
		const updatedMoodNote = {
			...moodNote,
			tag: moodTags.map(tag => tag.text).join(',')
		};
		handleSave(updatedMoodNote).catch((error: any) => alert(error.message));
		Toast.show({
			text1: '💭 Mood note saved',
		});
		closeMoodModal();
		if (refreshMoods) {
			refreshMoods();
		}
	};

	useEffect(() => {
		setMoodNote(prev => ({ 
			...prev, 
			tag: moodTags.map(tag => tag.text).join(',') 
		}));
	}, [moodTags]);

	useEffect(() => {
		if (initialMoodNote) {
			setMoodNote(initialMoodNote);
		}
	}, [initialMoodNote]);

	function formatDateTimeDisplay(dateTimeString: string): string {
		const date = new Date(dateTimeString);
		
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
	
		return `${year}-${month}-${day} ${hours}:${minutes}`;
	}
	
	const showDatePicker = () => {
		showPicker({
			mode: 'datetime',
			value: new Date(dateInput),
			is24Hour: true,
		}, (selectedDate) => {
			if (selectedDate) {
				const newDateInput = selectedDate.toISOString();
				setDateInput(newDateInput);
				setMoodNote(prevMoodNote => ({
					...prevMoodNote,
					date: newDateInput
				}));
			}
		});
	};

	const getContrastColor = (bgColor: string) => {
		const color = Color(bgColor);
		return color.isLight() ? '#000000' : '#FFFFFF';
	};

	return (
		<UniversalModal
			isVisible={isOpen}
			onClose={closeMoodModal}
			hideCloseButton={showCommentScreen}
		>
			<Text style={[designs.modal.title, { marginBottom: 30 }]}>        
			{showCommentScreen ? 'Add Detailed Comment' : '💭 Mood Entry'}</Text>
			{showCommentScreen ? (
				<>
					<View style={{ width: '100%', flex: 1, minHeight: 200 }}>
						<TextInput
                            style={[designs.text.input, styles.inputText, { minHeight: 120, width: '100%' }]}
                            onChangeText={handleCommentChange}
                            value={moodNote.comment}
                            placeholder="Type your detailed comment here..."
                            placeholderTextColor={themeColors.gray}
                            multiline={true}
                        />
						<PrimaryButton
							onPress={() => setShowCommentScreen(false)}
							text="Done"
						/>
					</View>
				</>
			) : (
				<>
					{isEdit && (
						<Pressable onPress={showDatePicker} style={designs.text.input}>
							<Text style={designs.text.text}>
								{formatDateTimeDisplay(dateInput)}
							</Text>
						</Pressable>
					)}
					<ButtonsSlider 
						selectedValue={Number(moodNote.rating)}
						onChange={(value: number) => handleChange('rating', value.toString())}
						twoRows={true}
					/>
					<View style={{ width: '100%', marginBottom: 15 }}>
						<View style={styles.buttonsContainer}>
							<Pressable 
								style={[styles.butòn]}
								onPress={() => setIsTagModalOpen(true)}
							>
								<Text style={designs.text.text}>Add Tags</Text>
							</Pressable>
							<Pressable
								style={[styles.butòn]}
								onPress={() => setShowCommentScreen(true)}
							>
								<Text style={designs.text.text}>
									Add Comment {moodNote.comment ? '✓' : ''}
								</Text>
							</Pressable>
						</View>
						<View style={[styles.tagContainer]}>
							{moodTags.map((tag, index) => (
								<Pressable 
									key={`${tag.text}-${index}`}
									style={[styles.tag, { backgroundColor: tag.color ? `${tag.color}99` : undefined }]}
									onPress={() => removeMoodTag(tag)}
								>
									<Text style={[
										styles.tagText, 
										{ color: tag.color ? getContrastColor(tag.color) : theme.textColor }
									]}>
										{tag.text}
									</Text>
									<Text style={[
										styles.removeTag, 
										{ color: tag.color ? getContrastColor(tag.color) : theme.textColor }
									]}>
										×
									</Text>
								</Pressable>
							))}
						</View>
					</View>
					<PrimaryButton
						onPress={handleSaveMoodNote}
						text="Save"
					/>
				</>
			)}
			{isTagModalOpen && (
				<TagModal
					isOpen={isTagModalOpen}
					setSelectionData={updateTagInSelectionData()}
					sourceTable="MoodTable"
				/>
			)}
		</UniversalModal>
	);
};

const getStyles = (theme: any) => StyleSheet.create({
	inputText: {
		fontFamily: 'serif',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 12,
		paddingVertical: 20
	},
	butòn: {
		flex: 1,
		alignItems: 'center',
		padding: 10,
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: theme.borderColor,
		borderRadius: 10
	},
	tagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginVertical: 10,
		borderWidth: 1,
		borderColor: theme.borderColor,
		padding: 10,
		borderRadius: 10,
		minHeight: 50,
	},
	tag: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 20,
		paddingHorizontal: 8,
		paddingVertical: 4,
		margin: 2,
		borderWidth: 1,
		borderColor: theme.borderColor,
	},
	tagText: {
		fontSize: 12,
		fontWeight: '600',
		marginRight: 4,
	},
	removeTag: {
		fontSize: 16,
		fontWeight: 'bold',
		opacity: 0.6,
	},
});

export default MoodNoteModal;