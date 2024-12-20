// BatchTransactionModal.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import { PickerInput } from '@/src/components/FormComponents';
import TagDescriptionSelector from '@/src/components/atoms/TagDescriptionSelector';
import TagModal from '@/src/components/modals/TagModal';
import DescriptionModal from '@/src/components/modals/DescriptionModal';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { MoneyData } from '@/src/types/Money';
import { TagData } from '@/src/types/TagsAndDescriptions';
import { SelectionData } from '@/src/features/Home/components/TimerComponent';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface BatchTransactionModalProps {
    isOpen: boolean;
    closeBatchModal: () => void;
    selectedTransactions: MoneyData[];
    onBatchUpdate: (updatedFields: Partial<MoneyData>) => void;
}

const BatchTransactionModal: React.FC<BatchTransactionModalProps> = ({
    isOpen,
    closeBatchModal,
    selectedTransactions,
    onBatchUpdate,
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    // State for fields
    const [tag, setTag] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<TagData | undefined>(undefined);
    const [selectedDescription, setSelectedDescription] = useState<TagData | undefined>(undefined);

    // Extract unique tags and accounts from selected transactions
    const uniqueTags = Array.from(new Set(selectedTransactions.filter(t => t?.tag).map(t => t.tag)));
    const uniqueAccounts = Array.from(new Set(selectedTransactions.filter(t => t?.account).map(t => t.account)));

    // Handler for applying batch updates
    const handleApply = () => {
        const updatedFields: Partial<MoneyData> = {};

        if (tag !== null) {
            updatedFields.tag = tag;
        }
        if (description !== null) {
            updatedFields.description = description;
        }
        if (account !== null) {
            updatedFields.account = account;
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
                    <ScrollView>
                        <Text style={designs.text.title}>Batch Edit Transactions</Text>
                        
                        <View style={{ width: '100%' }}>
                            <TagDescriptionSelector
                                tag={tag || ''}
                                description={description || ''}
                                onPress={() => setIsTagModalOpen(true)}
                            />
                        </View>

                        {/* Account Picker */}
                        <PickerInput
                            label="Account"
                            selectedValue={account || ''}
                            onValueChange={(value) => setAccount(value)}
                            items={uniqueAccounts.map(account => ({ label: account || '', value: account || '' }))}
                        />

                        {/* Apply Button */}
                        <PrimaryButton
                            text="Apply Changes"
                            onPress={handleApply}
                        />
                    </ScrollView>
                </UniversalModal>
            )}
            {isTagModalOpen && (
                <TagModal
                    isOpen={isTagModalOpen}
                    setSelectionData={updateTagInSelectionData()}
                    sourceTable="MoneyTable"
                />
            )}
            {isDescriptionModalOpen && (
                <DescriptionModal
                    isOpen={isDescriptionModalOpen}
                    selectedTag={selectedTag!}
                    setSelectionData={updateDescriptionInSelectionData()}
                    sourceTable="MoneyTable"
                />
            )}
        </>
    );
};

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    label: {
        ...designs.text.label,
        marginTop: 15,
    },
    input: {
        borderColor: themeColors.borderColor,
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
        backgroundColor: themeColors.cancelButtonBackground,
    },
});

export default BatchTransactionModal;
