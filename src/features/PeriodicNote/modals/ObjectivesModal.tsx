import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform } from 'react-native';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import { FormInput, PickerInput } from '@/src/components/FormComponents';
import AlertModal from '@/src/components/modals/AlertModal';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { PillarData } from '@/src/types/Pillar';
import { ExtendedObjectiveData } from '@/src/features/PeriodicNote/types/ObjectivesSection';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface AddObjectivesModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAdd: (newObjective: Omit<ExtendedObjectiveData, "uuid"> | ExtendedObjectiveData) => Promise<void>;
    objective?: ExtendedObjectiveData;
    pillars: PillarData[];
    currentDate: string;
}

export const AddObjectivesModal: React.FC<AddObjectivesModalProps> = ({ isVisible, onClose, onAdd, objective, pillars, currentDate }) => {
    const [objectiveText, setObjectiveText] = useState('');
    const [noteText, setNoteText] = useState('');
    const [selectedPillarUuid, setSelectedPillarUuid] = useState<string | null>(null);
    const [completionStatus, setCompletionStatus] = useState<0 | 1 | 2>(0);
    const [showAlert, setShowAlert] = useState(false);

    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    useEffect(() => {
        if (isVisible) {
            setObjectiveText(objective?.objective || '');
            setSelectedPillarUuid(objective?.pillarUuid! || null);
            setCompletionStatus(objective?.completed || 0);
            setNoteText(objective?.note || '');
        }
    }, [isVisible, objective]);

    const handleSubmit = async () => {
        if (!objectiveText || !currentDate) {
            setShowAlert(true);
            return;
        }

        const selectedPillar = selectedPillarUuid ? pillars.find(pillar => pillar.uuid === selectedPillarUuid) : null;
        const now = new Date().toISOString();

        if (objective) {
            // Updating existing objective - include UUID
            const objectiveData: ExtendedObjectiveData = {
                ...objective,
                objective: objectiveText,
                pillarUuid: selectedPillarUuid || undefined,
                pillarEmoji: selectedPillar?.emoji || '',
                completed: completionStatus, // Updated from isCompleted
                note: noteText,
                updatedAt: now
            };
            await onAdd(objectiveData);
        } else {
            // Adding new objective - omit UUID
            const objectiveData: Omit<ExtendedObjectiveData, "uuid"> = {
                objective: objectiveText,
                pillarUuid: selectedPillarUuid || undefined,
                pillarEmoji: selectedPillar?.emoji || '',
                completed: completionStatus,
                period: currentDate,
                note: noteText,
                createdAt: now,
                updatedAt: now
            };
            await onAdd(objectiveData);
        }

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setObjectiveText('');
        setSelectedPillarUuid(null);
        setCompletionStatus(0);
        setNoteText('');
    };

    const pillarItems = [
        { label: 'None', value: '' },
        ...pillars.map(pillar => ({
            label: `${pillar.emoji} ${pillar.name}`,
            value: pillar.uuid
        }))
    ];

    const modalContent = (
        <View style={styles.modalContent}>
            <Text style={[designs.text.title, styles.title]}>
                {objective ? '✏️ Edit Objective' : '🎯 Add New Objective'}
            </Text>
            <View style={{ width: '100%' }}>
                <FormInput
                    label="Objective"
                    value={objectiveText}
                    onChangeText={setObjectiveText}
                    placeholder="Enter objective"
                />
            </View>
            <View style={{ width: '100%' }}>
                <FormInput
                    label="Note"
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Enter note (optional)"
                />
            </View>
            <PickerInput
                label="Pillar"
                selectedValue={selectedPillarUuid || ''}
                onValueChange={(itemValue) => setSelectedPillarUuid(itemValue)}
                items={pillarItems}
            />
            <PrimaryButton
                text={objective ? 'Update' : 'Add Objective'}
                onPress={handleSubmit}
            />
        </View>
    );

    return (
        <>
            <UniversalModal isVisible={isVisible} onClose={onClose}>
                {modalContent}
            </UniversalModal>
            <AlertModal
                isVisible={showAlert}
                title="Error"
                message="Please enter an objective"
                onConfirm={() => setShowAlert(false)}
                onCancel={() => setShowAlert(false)}
            />
        </>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    modalContent: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '90%',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    addButton: {
        width: '100%',
    },
    pillarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    pillarButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.borderColor,
    },
    selectedPillarButton: {
        backgroundColor: theme.accentColor,
    },
});