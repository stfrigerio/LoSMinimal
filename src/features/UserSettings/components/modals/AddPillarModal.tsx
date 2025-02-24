import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { PillarData } from '@/src/types/Pillar';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { UniversalModal } from '@/src/components/modals/UniversalModal';
import Toast from 'react-native-toast-message';
import AlertModal from '@/src/components/modals/AlertModal';

interface AddPillarModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAdd: (pillarData: PillarData) => void;
    initialData?: PillarData;
}

const AddPillarModal: React.FC<AddPillarModalProps> = ({
    isVisible,
    onClose,
    onAdd,
    initialData,
}) => {
    const [pillarData, setPillarData] = useState<PillarData>({
        uuid: '',
        name: '',
        emoji: '',
        description: '',
    });
    const [showAlert, setShowAlert] = useState(false);
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    useEffect(() => {
        if (initialData) {
            setPillarData(initialData);
        } else {
            setPillarData({ uuid: '', name: '', emoji: '', description: '' });
        }
    }, [initialData]);

    const handleAdd = () => {
        if (!pillarData.name) {
            setShowAlert(true);
            return;
        }
        onAdd(pillarData);
        Toast.show({
            text1: 'Pillar added successfully',
            text2: `${pillarData.emoji} ${pillarData.name} added to your pillars`,
            type: 'success',
        });
        onClose();
    };

    const updatePillarData = (key: keyof PillarData, value: string) => {
        setPillarData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <UniversalModal
                isVisible={isVisible}
                onClose={onClose}
            >
                <Text style={designs.modal.title}>
                    {initialData ? 'Edit Pillar' : 'Add New Pillar'}
                </Text>
                <TextInput
                    placeholder="Pillar Name"
                    placeholderTextColor={theme.colors.gray}
                    value={pillarData.name}
                    onChangeText={(text) => updatePillarData('name', text)}
                    style={designs.text.input}
                />
                <TextInput
                    placeholder="Emoji (optional)"
                    placeholderTextColor={theme.colors.gray}
                    value={pillarData.emoji}
                    onChangeText={(emoji) => updatePillarData('emoji', emoji)}
                    style={designs.text.input}
                />
                <TextInput
                    placeholder="Description (optional)"
                    placeholderTextColor={theme.colors.gray}
                    value={pillarData.description}
                    onChangeText={(description) => updatePillarData('description', description)}
                    style={designs.text.input}
                />
                <View style={styles.modalButtonContainer}>
                    <PrimaryButton
                        text='Cancel'
                        variant='secondary'
                        onPress={onClose}
                    />
                    <PrimaryButton
                        text={initialData ? 'Update' : 'Add'}
                        variant='primary'
                        onPress={handleAdd}
                    />
                </View>
            </UniversalModal>
            {showAlert && (
                <AlertModal
                    isVisible={showAlert}
                    title="Error"
                    message="Pillar name is required"
                    singleButton={true}
                    onConfirm={() => setShowAlert(false)}
                />
            )}
        </>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default AddPillarModal;