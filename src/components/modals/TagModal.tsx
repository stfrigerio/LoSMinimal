import React, { useState, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';

import { SelectionData } from '@/src/features/Home/components/TimerComponent';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import AddTagDescriptionModal from '@/src/features/UserSettings/components/modals/AddTagDescriptionModal';

import { useTagsAndDescriptions } from '@/src/features/UserSettings/hooks/useTagsAndDescriptions';
import { TagData } from '@/src/types/TagsAndDescriptions';
import { useTagModal } from '@/src/components/modals/helpers/useTagModal';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { UniversalModal } from './UniversalModal';

interface TagModalProps {
	isOpen: boolean;
	setSelectionData: (updateFunc: (prevData: SelectionData) => SelectionData) => void;
	sourceTable: string;
}

const TagModal: React.FC<TagModalProps> = ({ isOpen, setSelectionData, sourceTable }) => {
	const { theme, designs } = useThemeStyles();
	const styles = getStyles(theme);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const {
		tags,
		closeTagModal,
		handleTagSelect,
		fetchTags
	} = useTagModal(isOpen, sourceTable, setSelectionData);

	const { handleAddOrUpdateItem } = useTagsAndDescriptions();

	const handleAddOrEditItem = async (itemData: TagData) => {
		await handleAddOrUpdateItem(itemData);
		fetchTags();
		setIsAddModalOpen(false);
	};

	const sortedTags = useMemo(() => {
		return [...tags].sort((a, b) => a.text.localeCompare(b.text));
	}, [tags]);

	const isMoodTable = sourceTable === 'MoodTable';

	return (
		<>
			<UniversalModal
				isVisible={isOpen}
				onClose={() => closeTagModal()}
			>
					<Text style={designs.modal.title}>Select Tag</Text>
					{tags && tags.length > 0 ? (
                        <View style={[
                            styles.tagsContainer,
                            isMoodTable ? styles.moodTagsContainer : styles.listTagsContainer
                        ]}>
                            {sortedTags.map((item, index) => (
                                <Pressable
                                    key={`tag-${item.id || index}`}
                                    style={[
                                        styles.tagItem,
                                        isMoodTable ? styles.moodTagItem : styles.listTagItem,
                                        !isMoodTable && index === tags.length - 1 ? styles.lastItem : null,
                                        { backgroundColor: theme.colors.backgroundColor },
                                    ]}
                                    onPress={() => handleTagSelect(item)}
                                    testID={`tag-item-${index}`}
                                >
                                    <View style={styles.tagContent}>
                                        <Text style={designs.text.text}>{item.emoji}</Text>
                                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                        <Text 
											style={[isMoodTable ? styles.moodTagText : designs.text.text, styles.tagText]} 
											numberOfLines={1}
											ellipsizeMode="tail"
										>
											{item.text}
										</Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
					) : (
						<Text style={[designs.text.text, { textAlign: 'center', color: theme.colors.gray }]}>
							No tags available
						</Text>
					)}
					<View style={{ height: 20 }} />
					<PrimaryButton
						text="Add New Tag"
						onPress={() => setIsAddModalOpen(true)}
					/>
			</UniversalModal>
			{isAddModalOpen && 
				<AddTagDescriptionModal
					isVisible={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					onAdd={handleAddOrEditItem}
					getTagsForSelection={() => []} // You might need to implement this
					currentSection={sourceTable === 'MoodTable' ? 'mood' : sourceTable === 'TimeTable' ? 'time' : sourceTable === 'MoneyTable' ? 'money' : sourceTable}
					getLinkedDescriptions={() => []} // You might need to implement this
				/>
			}
		</>
	);
};

const getStyles = (theme: Theme) => StyleSheet.create({
	tagItem: {
		alignItems: 'center',
		padding: 15,
		marginVertical: 2,
		borderBottomWidth: 1,
		borderColor: theme.colors.borderColor,
		borderRadius: 5,
	},
	tagText: {
		fontFamily: theme.name === 'signalis' ? theme.typography.fontFamily.secondary : theme.typography.fontFamily.primary,
		fontSize: theme.name === 'signalis' ? 18 : undefined,
	},
	lastItem: {
		borderBottomWidth: 0
	},
	addButton: {
		marginTop: 20,
		width: '100%',
	},
    tagsContainer: {
        marginHorizontal: 20,
    },
    moodTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    listTagsContainer: {
        flexDirection: 'column',
    },
    moodTagItem: {
        flex: 1,
        minWidth: '20%',
    },
	moodTagText: {
		color: theme.colors.textColor,
		fontSize: 10,
	},
    listTagItem: {
        width: '100%',
        marginVertical: 2,
        borderBottomWidth: 1,
        borderColor: theme.colors.borderColor,
    },
	tagContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	colorDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 5,
	},
});

export default TagModal;