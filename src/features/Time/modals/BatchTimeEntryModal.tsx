// BatchTransactionModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import TagDescriptionSelector from '@/src/components/atoms/TagDescriptionSelector';
import TagModal from '@/src/components/modals/TagModal';
import DescriptionModal from '@/src/components/modals/DescriptionModal';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { TimeData } from '@/src/types/Time';
import { TagData } from '@/src/types/TagsAndDescriptions';
import { SelectionData } from '../../Home/components/TimerComponent';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface BatchTransactionModalProps {
    isOpen: boolean;
    closeBatchModal: () => void;
    selectedTimeEntries: TimeData[];
    onBatchUpdate: (updatedFields: Partial<TimeData>) => void;
}

const BatchTransactionModal: React.FC<BatchTransactionModalProps> = ({
    isOpen,
    closeBatchModal,
    selectedTimeEntries,
    onBatchUpdate,
}) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

    // State for fields
    const [tag, setTag] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<TagData | undefined>(undefined);
    const [selectedDescription, setSelectedDescription] = useState<TagData | undefined>(undefined);

    // Extract unique tags and accounts from selected transactions
    const uniqueTags = Array.from(new Set(selectedTimeEntries.filter(t => t?.tag).map(t => t.tag)));

    // Handler for applying batch updates
    const handleApply = () => {
        const updatedFields: Partial<TimeData> = {};

        if (tag !== null) {
            updatedFields.tag = tag;
        }
        if (description !== null) {
            updatedFields.description = description;
        }

        onBatchUpdate(updatedFields);
    };

    const updateTagInSelectionData = () => {
        return (updateFunc: (prevData: SelectionData) => SelectionData) => {
            const updatedData = updateFunc({} as SelectionData);
            const newSelectedTag = updatedData.selectedTag;
            if (newSelectedTag) {
                setSelectedTag(newSelectedTag);
                setTag(newSelectedTag.text);
                setIsTagModalOpen(false);
                setIsDescriptionModalOpen(true);
            } else {
                setSelectedTag(undefined);
                setTag(null);
                setIsTagModalOpen(false);
            }
        };
    };     
    
    const updateDescriptionInSelectionData = () => {
        return (updateFunc: (prevData: SelectionData) => SelectionData) => {
            const updatedData = updateFunc({} as SelectionData);
            const newSelectedDescription = updatedData.selectedDescription;
            if (newSelectedDescription) {
                setSelectedDescription(newSelectedDescription);
                setDescription(newSelectedDescription.text);
            } else {
                setSelectedDescription(undefined);
                setDescription(null);
            }
            setIsDescriptionModalOpen(false);
        };
    }; 

    return (
        <>
            {isOpen && (
                <UniversalModal
                    isVisible={isOpen}
                    onClose={closeBatchModal}
                >
                        <Text style={designs.text.title}>Batch Edit Time Entries</Text>
                        
                        <View style={{ width: '100%' }}>
                            <TagDescriptionSelector
                                tag={tag || ''}
                                description={description || ''}
                                onPress={() => setIsTagModalOpen(true)}
                            />
                        </View>

                        {/* Apply Button */}
                        <PrimaryButton
                            text="Apply Changes"
                            onPress={handleApply}
                        />
                </UniversalModal>
            )}
            {isTagModalOpen && (
                <TagModal
                    isOpen={isTagModalOpen}
                    setSelectionData={updateTagInSelectionData()}
                    sourceTable="TimeTable"
                />
            )}
            {isDescriptionModalOpen && (
                <DescriptionModal
                    isOpen={isDescriptionModalOpen}
                    selectedTag={selectedTag!}
                    setSelectionData={updateDescriptionInSelectionData()}
                    sourceTable="TimeTable"
                />
            )}
        </>
    );
};

const getStyles = (theme: Theme, designs: any) => StyleSheet.create({
    label: {
        ...designs.text.label,
        marginTop: 15,
    },
    input: {
        borderColor: theme.colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    applyButton: {
        marginTop: 20,
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: theme.colors.backgroundColor,
    },
});

export default BatchTransactionModal;
