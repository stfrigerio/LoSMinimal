import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { UniversalModal } from '@/src/components/modals/UniversalModal';

interface PickerInputProps {
    label: string;
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
    items: Array<{ label: string; value: string }>;
}

export const PickerInput: React.FC<PickerInputProps> = ({
    label,
    items,
    selectedValue,
    onValueChange,
}) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.pickerLabel}>{label}</Text>
            <Pressable
                onPress={() => setIsModalVisible(true)}
                style={styles.pickerTouchable}
            >
                <Text style={styles.pickerText}>
                    {items.find((item) => item.value === selectedValue)?.label ||
                        'Select an option'}
                </Text>
            </Pressable>

            <UniversalModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                maxHeight="60%"
            >
                <View style={styles.modalContent}>
                    {items.map((item) => (
                        <Pressable
                            key={item.value}
                            style={[
                                styles.optionItem,
                                selectedValue === item.value && styles.selectedOption
                            ]}
                            onPress={() => {
                                onValueChange(item.value);
                                setIsModalVisible(false);
                            }}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedValue === item.value && styles.selectedOptionText
                            ]}>
                                {item.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </UniversalModal>
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    inputContainer: {
        marginVertical: 10,
    },
    pickerLabel: {
        fontSize: 16,
        color: themeColors.textColor,
        marginBottom: 5,
    },
    pickerTouchable: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 4,
        backgroundColor: themeColors.backgroundSecondary,
    },
    pickerText: {
        fontSize: 16,
        color: themeColors.textColor,
    },
    modalContent: {
        padding: 16,
    },
    optionItem: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: themeColors.textColor + '20', // 20 is hex for 12% opacity
    },
    optionText: {
        fontSize: 16,
        color: themeColors.textColor,
    },
    selectedOptionText: {
        color: themeColors.textColorItalic,
        fontWeight: '600',
    },
});