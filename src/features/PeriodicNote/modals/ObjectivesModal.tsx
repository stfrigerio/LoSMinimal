import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform } from 'react-native';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import { FormInput, PickerInput } from '@/src/components/FormComponents';
import AlertModal from '@/src/components/modals/AlertModal';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { PillarData } from '@/src/types/Pillar';
import { ExtendedObjectiveData } from '@/src/features/PeriodicNote/types/ObjectivesSection';
import { ObjectiveData } from '@/src/types/Objective';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface AddObjectivesModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAdd: (newObjective: ObjectiveData) => void;
    objective?: ExtendedObjectiveData;
    pillars: PillarData[];
    currentDate: string;
}

export const AddObjectivesModal: React.FC<AddObjectivesModalProps> = ({ isVisible, onClose, onAdd, objective, pillars, currentDate }) => {
    const [objectiveText, setObjectiveText] = useState('');
    const [noteText, setNoteText] = useState('');
    const [selectedPillarUuid, setSelectedPillarUuid] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    useEffect(() => {
        if (isVisible) {
            setObjectiveText(objective?.objective || '');
            setSelectedPillarUuid(objective?.pillarUuid! || null);
            setIsCompleted(objective?.completed || false);
            setNoteText(objective?.note || '');
        }
    }, [isVisible, objective]);

    const handleSubmit = () => {
        if (objectiveText && currentDate) {
            const selectedPillar = selectedPillarUuid ? pillars.find(pillar => pillar.uuid === selectedPillarUuid) : null;
            const now = new Date().toISOString();

            const objectiveData: ObjectiveData = {
                uuid: objective?.uuid,
                objective: objectiveText,
                pillarUuid: selectedPillar ? selectedPillarUuid! : undefined,
                completed: isCompleted,
                period: currentDate,
                note: noteText,
                createdAt: objective?.createdAt || now,
                updatedAt: now
            };

            onAdd(objectiveData);
            resetForm();
            onClose();
        } else {
            setShowAlert(true);
        }
    };

    const resetForm = () => {
        setObjectiveText('');
        setSelectedPillarUuid(null);
        setIsCompleted(false);
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
        backgroundColor: theme.hoverColor,
    },
});