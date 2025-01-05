import React, { useState, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

import { SelectionData } from '@/src/features/Home/components/TimerComponent';
import AddTagDescriptionModal from '@/src/features/UserSettings/components/modals/AddTagDescriptionModal';

import { useDescriptionModal } from './helpers/useDescriptionModal';
import { useTagsAndDescriptions } from './helpers/useTagsAndDescriptions';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { TagData } from '@/src/types/TagsAndDescriptions';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { UniversalModal } from './UniversalModal';

interface DescriptionModalProps {
    isOpen: boolean;
    selectedTag: TagData;
    setSelectionData: (updateFunc: (prevData: SelectionData) => SelectionData) => void;
    sourceTable: string;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ isOpen, selectedTag, setSelectionData, sourceTable }) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const {
        descriptions,
        handleDescriptionSelect,
        closeDescriptionModal,
        fetchDescriptions
    } = useDescriptionModal(isOpen, selectedTag, setSelectionData, sourceTable);

    const { handleAddOrUpdateItem } = useTagsAndDescriptions();

    const handleAddOrEditItem = async (itemData: TagData) => {
        await handleAddOrUpdateItem(itemData);
        fetchDescriptions(selectedTag);
        setIsAddModalOpen(false);
    };

    const sortedDescriptions = useMemo(() => {
        return [...descriptions].sort((a, b) => String(a).localeCompare(String(b)));
    }, [descriptions]);

    return (
        <>
            <UniversalModal
                isVisible={isOpen}
                onClose={() => closeDescriptionModal()}
            >
                <Text style={designs.modal.title}>Select a Description</Text>
                {descriptions && descriptions.length > 0 ? (
                    <View style={styles.descriptionsContainer}>
                        {sortedDescriptions.map((item, index) => (
                            <Pressable
                                key={`tag-${item.id || index}`}
                                style={[
                                    styles.descriptionItem,
                                    index === descriptions.length - 1 ? styles.lastItem : null,
                                    { backgroundColor: themeColors.backgroundColor },
                                ]}
                                onPress={() => handleDescriptionSelect(item)}
                                testID={`description-item-${index}`}
                            >
                                <View style={styles.descriptionContent}>
                                    <Text style={[designs.text.text, { marginRight: 10 }]}>{item.emoji}</Text>
                                    <Text style={designs.text.text}>{item.text}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                ) : (
                    <Text style={designs.text.text}>No descriptions available</Text>
                )}
                <View style={{ height: 20 }} />
                <PrimaryButton
                    text="Add Description"
                    onPress={() => setIsAddModalOpen(true)}
                />
            </UniversalModal>
            {isAddModalOpen && 
                <AddTagDescriptionModal
                    isVisible={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddOrEditItem}
                    getTagsForSelection={() => []}
                    currentSection={sourceTable === 'MoodTable' ? 'mood' : sourceTable === 'TimeTable' ? 'time' : sourceTable === 'MoneyTable' ? 'money' : sourceTable}
                    getLinkedDescriptions={() => []}
                    initialData={{
                        text: '',
                        type: `${sourceTable.toLowerCase().replace('table', '')}Description`,
                        emoji: '',
                        linkedTag: selectedTag?.text || '',
                        color: '#FFFFFF'
                    }}
                />
            }
        </>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    descriptionItem: {
		alignItems: 'center',
		padding: 15,
		marginVertical: 2,
		borderBottomWidth: 1,
		borderColor: theme.borderColor,
		borderRadius: 5,
    },
    descriptionsContainer: {
		marginHorizontal: 40,
	},
	descriptionContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
    lastItem: {
        borderBottomWidth: 0
    },
    addButton: {
        marginTop: 20,
        width: '100%',
    },
});

export default DescriptionModal;
