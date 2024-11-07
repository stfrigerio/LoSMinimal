import React from 'react';
import { Modal as RNModal, Pressable, Text, ScrollView, DimensionValue } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { modalStyles } from '@/src/styles/modal';

interface UniversalModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    hideCloseButton?: boolean;
    // New props
    maxHeight?: DimensionValue;
    maxWidth?: DimensionValue;
    closeOnBackdropPress?: boolean;
    testID?: string;
}

export const UniversalModal: React.FC<UniversalModalProps> = ({
    isVisible,
    onClose,
    children,
    hideCloseButton = false,
    maxHeight = '80%',
    maxWidth = '90%',
    closeOnBackdropPress = true,
    testID = 'universal-modal'
}) => {
    const { theme, designs } = useThemeStyles();
    const styles = modalStyles(theme);

    const handleBackdropPress = () => {
        if (closeOnBackdropPress) {
            onClose();
        }
    };

    const CloseButton = () => (
        !hideCloseButton && (
            <Pressable 
                style={designs.modal.closeButton} 
                onPress={onClose}
                accessibilityLabel="Close modal"
                accessibilityRole="button"
                testID={`${testID}-close-button`}
            >
                <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
        )
    );

    return (
        <RNModal
            visible={isVisible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
            statusBarTranslucent
            testID={testID}
        >
            <Pressable 
                style={styles.modalContainer}
                onPress={handleBackdropPress}
                testID={`${testID}-backdrop`}
            >
                <Pressable 
                    style={[
                        styles.modalView,
                        { maxHeight, maxWidth }
                    ]}
                    onPress={(e) => e.stopPropagation()}
                    testID={`${testID}-content`}
                >
                    <CloseButton />
                    <ScrollView 
                        contentContainerStyle={styles.scrollViewContent}
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {children}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </RNModal>
    );
};