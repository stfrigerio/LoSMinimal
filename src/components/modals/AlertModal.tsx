import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { UniversalModal } from './UniversalModal';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface CustomButton {
    text: string;
    onPress: () => void;
}

export interface AlertModalProps {
    isVisible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    singleButton?: boolean;
    customButtons?: CustomButton[];
}

export interface AlertConfig {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    singleButton?: boolean;
    customButtons?: Array<{ text: string; onPress: () => void }>;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isVisible,
    title,
    message,
    onConfirm,
    onCancel,
    singleButton = false,
    customButtons,
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);

    const renderButtons = () => {
        if (customButtons && customButtons.length > 0) {
            return (
                <>
                    {customButtons.map((button, index) => (
                        <Pressable 
                            key={index}
                            style={({ pressed }) => [
                                styles.button,
                                styles.buttonCustom,
                                pressed && styles.buttonPressed
                            ]} 
                            onPress={button.onPress}
                        >
                            <Text style={styles.textStyle}>{button.text}</Text>
                        </Pressable>
                    ))}
                </>
            );
        }

        if (singleButton) {
            return (
                <Pressable 
                    style={({ pressed }) => [
                        styles.button,
                        styles.buttonConfirm,
                        pressed && styles.buttonPressed
                    ]} 
                    onPress={onConfirm}
                >
                    <Text style={styles.textStyle}>OK</Text>
                </Pressable>
            );
        }

        return (
            <>
                <Pressable 
                    style={({ pressed }) => [
                        styles.button,
                        styles.buttonCancel,
                        pressed && styles.buttonPressedCancel
                    ]} 
                    onPress={onCancel}
                >
                    <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable 
                    style={({ pressed }) => [
                        styles.button,
                        styles.buttonConfirm,
                        pressed && styles.buttonPressed
                    ]} 
                    onPress={onConfirm}
                >
                    <Text style={styles.textStyle}>OK</Text>
                </Pressable>
            </>
        );
    };

    return (
        <UniversalModal isVisible={isVisible} onClose={onCancel || (() => {})}>
            <Text style={designs.modal.title}>{title}</Text>
            <Text style={styles.modalText}>{message}</Text>
            <View style={[
                styles.buttonContainer,
                customButtons && customButtons.length > 2 && styles.buttonContainerWrap
            ]}>
                {renderButtons()}
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
    buttonContainerWrap: {
        flexWrap: 'wrap',
        gap: 15,
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
    buttonCustom: {
        borderWidth: 1,
        borderColor: themeColors.borderColor,
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