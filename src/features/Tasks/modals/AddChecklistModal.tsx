import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { UniversalModal } from '@/src/components/modals/UniversalModal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface AddChecklistModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
    initialChecklist?: { name: string } | null;
}

const AddChecklistModal: React.FC<AddChecklistModalProps> = ({ visible, onClose, onAdd, initialChecklist }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);
    const [checklistName, setChecklistName] = useState('');

    useEffect(() => {
        if (initialChecklist) {
            setChecklistName(initialChecklist.name);
        } else {
            setChecklistName('');
        }
    }, [initialChecklist]);

    const handleAddChecklist = () => {
        if (checklistName.trim()) {
            onAdd(checklistName.trim());
            setChecklistName('');
            onClose();
        }
    };

    return (
        <>
            <UniversalModal isVisible={visible} onClose={onClose}>
                <View style={styles.modalContent}>
                    <Text style={designs.modal.title}>{initialChecklist ? 'Edit Checklist' : 'Add New Checklist'}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setChecklistName}
                        value={checklistName}
                        placeholder="Checklist name"
                        placeholderTextColor='#969DA3'
                        onSubmitEditing={handleAddChecklist}
                    />
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            text={initialChecklist ? 'Update Checklist' : 'Add Checklist'}
                            onPress={handleAddChecklist}
                        />
                    </View>
                </View>
            </UniversalModal>
        </>
    );
};

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    modalContent: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        fontSize: 14,
        marginTop: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: themeColors.borderColor,
        paddingHorizontal: 18,
        width: '100%',
        color: themeColors.textColor,
        height: 60
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    }
});

export default AddChecklistModal;