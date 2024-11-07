import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { UniversalModal } from './UniversalModal';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface AlertModalProps {
    isVisible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    singleButton?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isVisible,
    title,
    message,
    onConfirm,
    onCancel,
    singleButton = false
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);

    return (
        <UniversalModal isVisible={isVisible} onClose={onCancel || (() => {})}>
            <Text style={designs.modal.title}>{title}</Text>
            <Text style={styles.modalText}>{message}</Text>
            <View style={styles.buttonContainer}>
                {singleButton ? (
                    <Pressable 
                        style={({ pressed }) => [
                            styles.button,
                            styles.buttonConfirm,
                            pressed && styles.buttonPressed
                        ]} 
                        onPress={onConfirm}>
                        <Text style={styles.textStyle}>OK</Text>
                    </Pressable>
                ) : (
                    <>
                        <Pressable 
                            style={({ pressed }) => [
                                styles.button,
                                styles.buttonCancel,
                                pressed && styles.buttonPressedCancel
                            ]} 
                            onPress={onCancel}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable 
                            style={({ pressed }) => [
                                styles.button,
                                styles.buttonConfirm,
                                pressed && styles.buttonPressed
                            ]} 
                            onPress={onConfirm}>
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </UniversalModal>
    );
};


const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    modalText: {
        ...designs.text.text,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        gap: 25,
    },
    button: {
        borderRadius: 25,
        paddingVertical: 12,
        minWidth: 120,
    },
    buttonCancel: {
        borderWidth: 1,
        borderColor: themeColors.redOpacity,
        backgroundColor: themeColors.backgroundColor,
    },
    buttonConfirm: {
        borderWidth: 1,
        borderColor: themeColors.greenOpacity,
        backgroundColor: themeColors.backgroundColor,
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        backgroundColor: themeColors.greenOpacity,
        opacity: 0.9,
    },
    buttonPressedCancel: {
        transform: [{ scale: 0.98 }],
        backgroundColor: themeColors.redOpacity,
        opacity: 0.9,
    },
    textStyle: {
        color: themeColors.textColorBold,
        textAlign: 'center',
        fontSize: 14,
    },
});

export default AlertModal;