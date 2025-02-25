import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { UniversalModal } from './UniversalModal';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);

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
            <Text style={[designs.modal.title, { marginTop: 20}]}>{title}</Text>
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

const getStyles = (theme: any, designs: any) => StyleSheet.create({
    modalText: {
        ...designs.text.text,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
        fontSize: 16,
        ...(theme.name === 'signalis' && {
            fontSize: 18,
            fontWeight: 'normal',
        })
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
        borderRadius: theme.borderRadius.pill,
        paddingVertical: 12,
        minWidth: 120,
    },
    buttonCancel: {
        borderWidth: 1,
        borderColor: theme.colors.redOpacity,
        backgroundColor: theme.colors.backgroundColor,
    },
    buttonConfirm: {
        borderWidth: 1,
        borderColor: theme.colors.greenOpacity,
        backgroundColor: theme.colors.backgroundColor,
    },
    buttonCustom: {
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        backgroundColor: theme.colors.backgroundColor,
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        backgroundColor: theme.colors.greenOpacity,
        opacity: 0.9,
    },
    buttonPressedCancel: {
        transform: [{ scale: 0.98 }],
        backgroundColor: theme.colors.redOpacity,
        opacity: 0.9,
    },
    textStyle: {
        color: theme.colors.textColorBold,
        textAlign: 'center',
        fontSize: 14,
        ...(theme.name === 'signalis' && {
            fontFamily: theme.typography.fontFamily.secondary,
            fontSize: 18,
            fontWeight: 'normal',
            textShadowColor: theme.colors.accentColor,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 12,
        })
    },
});

export default AlertModal;