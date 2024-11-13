import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface TimePickerOptions {
    mode: 'date' | 'time' | 'datetime';
    value: Date;
    is24Hour?: boolean;
}

const CustomTimePicker = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    
    const [currentCallback, setCurrentCallback] = useState<((date: Date | undefined) => void) | null>(null);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const showPicker = (options: TimePickerOptions, onChange: (date: Date | undefined) => void) => {
        const { value } = options;
        setSelectedHour(value.getHours());
        setSelectedMinute(value.getMinutes());
        setCurrentCallback(() => onChange);
        setIsVisible(true);
    };

    const handleConfirm = () => {
        const date = new Date();
        date.setHours(selectedHour, selectedMinute);
        currentCallback?.(date);
        setIsVisible(false);
    };

    const picker = (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.title}>Select Time</Text>
                    
                    <View style={styles.timePickerContainer}>
                        {/* Hours */}
                        <ScrollView style={styles.pickerColumn}>
                            {hours.map(hour => (
                                <Pressable
                                    key={hour}
                                    style={[
                                        styles.timeOption,
                                        selectedHour === hour && styles.selectedTimeOption
                                    ]}
                                    onPress={() => setSelectedHour(hour)}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        selectedHour === hour && styles.selectedTimeText
                                    ]}>
                                        {hour.toString().padStart(2, '0')}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Text style={styles.separator}>:</Text>

                        {/* Minutes */}
                        <ScrollView style={styles.pickerColumn}>
                            {minutes.map(minute => (
                                <Pressable
                                    key={minute}
                                    style={[
                                        styles.timeOption,
                                        selectedMinute === minute && styles.selectedTimeOption
                                    ]}
                                    onPress={() => setSelectedMinute(minute)}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        selectedMinute === minute && styles.selectedTimeText
                                    ]}>
                                        {minute.toString().padStart(2, '0')}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable 
                            style={styles.button} 
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.button, styles.confirmButton]} 
                            onPress={handleConfirm}
                        >
                            <Text style={[styles.buttonText, styles.confirmButtonText]}>
                                Confirm
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return { showPicker, picker };
};

const getStyles = (themeColors: any) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: themeColors.backgroundColor,
        borderRadius: 16,
        padding: 20,
        width: '80%',
        maxWidth: 300,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.textColor,
        textAlign: 'center',
        marginBottom: 20,
    },
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    pickerColumn: {
        flex: 1,
        height: '100%',
    },
    separator: {
        fontSize: 24,
        color: themeColors.textColor,
        marginHorizontal: 10,
    },
    timeOption: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTimeOption: {
        backgroundColor: themeColors.primary,
        borderRadius: 8,
    },
    timeText: {
        fontSize: 20,
        color: themeColors.textColor,
    },
    selectedTimeText: {
        color: themeColors.white,
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: themeColors.primary,
    },
    buttonText: {
        color: themeColors.textColor,
        fontSize: 16,
        fontWeight: '500',
    },
    confirmButtonText: {
        color: themeColors.white,
    },
});

export default CustomTimePicker;