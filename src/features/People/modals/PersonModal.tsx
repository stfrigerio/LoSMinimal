import React, { useEffect } from 'react';
import { View, Modal, Text, Pressable, StyleSheet } from 'react-native';

import BasicInfoStep from './components/BasicInfoStep';
import ContactInfoStep from './components/ContactInfoStep';
import PreferencesStep from './components/PreferencesStep';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { usePersonModal } from './hooks/usePersonModal';

import { PersonData } from '@/src/types/People';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface AddPersonModalProps {
    isOpen: boolean;
    initialPerson?: PersonData;
    onClose: () => void;
}

export interface StepProps {
    person: Partial<PersonData>;
    updatePerson: (key: keyof PersonData, value: any) => void;
    resetStep: () => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ isOpen, onClose, initialPerson }) => {
    const { designs } = useThemeStyles();

    const { step, person, setPerson, handleNext, handleBack, resetForm, updatePerson } = usePersonModal(onClose, initialPerson);

    useEffect(() => {
        if (initialPerson) {
            setPerson(initialPerson);
        }
    }, [initialPerson, setPerson]);

    const steps: { title: string; component: React.FC<StepProps> }[] = [
        { title: 'Basic Info', component: BasicInfoStep },
        { title: 'Contact Info', component: ContactInfoStep },
        { title: 'Preferences', component: PreferencesStep },
    ];

    const CurrentStepComponent = steps[step].component;

    return (
        <Modal visible={isOpen} animationType="slide" transparent={true}>
            <Pressable style={designs.modal.modalContainer} onPress={onClose}>
                <View style={[designs.modal.modalView, { width: '90%' }]} onStartShouldSetResponder={() => true} onTouchEnd={(e) => e.stopPropagation()}>
                    <Text style={designs.text.title}>{steps[step].title}</Text>
                    
                    <CurrentStepComponent
                        person={person}
                        updatePerson={updatePerson}
                        resetStep={resetForm}
                    />

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            onPress={handleBack}
                            variant="secondary"
                            text={step === 0 ? 'Cancel' : 'Back'}
                        />
                        <PrimaryButton
                            onPress={handleNext}
                            variant="primary"
                            text={step === steps.length - 1 ? 'Save' : 'Next'}
                        />
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default AddPersonModal;