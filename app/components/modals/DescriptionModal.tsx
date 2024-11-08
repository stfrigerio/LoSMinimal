import React, { useState, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

import { SelectionData } from '@/app/features/Home/components/TimerComponent';
import AddTagDescriptionModal from '@/app/features/UserSettings/components/modals/AddTagDescriptionModal';

import { useDescriptionModal } from './helpers/useDescriptionModal';
import { useTagsAndDescriptions } from './helpers/useTagsAndDescriptions';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { TagData } from '@/src/types/TagsAndDescriptions';
import { PrimaryButton } from '../Atoms/PrimaryButton';

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
            <Modal visible={isOpen} onRequestClose={() => closeDescriptionModal()} transparent={true}>
                <View style={designs.modal.modalContainer}>
                    <View style={designs.modal.tagsDescriptionModalView}>
                        <Text style={designs.text.title}>Select a Description</Text>
                        {descriptions && descriptions.length > 0 ? (
                            <FlatList
                                data={sortedDescriptions}
                                renderItem={({ item, index }) => {
                                    const isLastItem = index === descriptions.length - 1; 
                                    return (
                                        <Pressable
                                            style={[
                                                styles.descriptionItem,
                                                isLastItem ? styles.lastItem : null,
                                                { backgroundColor: item.color || themeColors.backgroundColor },
                                            ]}
                                            onPress={() => handleDescriptionSelect(item)}
                                        >
                                            <Text style={designs.text.text}>{item.emoji} {item.text}</Text>
                                        </Pressable>
                                    );
                                }}
                                keyExtractor={(item, index) => `description-${item.id || index}`}
                            />
                        ) : (
                            <Text style={designs.text.text}>No descriptions available</Text>
                        )}
                        <PrimaryButton
                            text="Add Description"
                            onPress={() => setIsAddModalOpen(true)}
                        />
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: 50,
        padding: 15,
        marginVertical: 2,
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 5,
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
