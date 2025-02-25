import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface TimePickerOptions {
    mode: 'date' | 'time' | 'datetime';
    value: Date;
    is24Hour?: boolean;
    minimumDate?: Date;
    maximumDate?: Date;
}

const IOSTimePicker = () => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const [isVisible, setIsVisible] = useState(false);
    const [currentMode, setCurrentMode] = useState<'date' | 'time'>('date');
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [callback, setCallback] = useState<((date: Date | undefined) => void) | null>(null);

    const showPicker = (options: TimePickerOptions, onChange: (date: Date | undefined) => void) => {
        const { mode, value, minimumDate, maximumDate } = options;

        setTempDate(value);
        setCallback(() => onChange);

        if (mode === 'datetime') {
            setCurrentMode('date');
        } else {
            setCurrentMode(mode);
        }

        setIsVisible(true);
    };

    const handleChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    return {
        showPicker,
        picker: (
            <Modal
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={tempDate}
                            mode={currentMode}
                            is24Hour={true}
                            display="spinner"
                            onChange={handleChange}
                            textColor={themeColors.textColor}
                            accentColor={themeColors.accentColor}
                        />
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setIsVisible(false);
                                    if (callback) callback(undefined);
                                }}
                            >
                                <Text style={[styles.textStyle, { color: themeColors.redOpacity }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.doneButton]}
                                onPress={() => {
                                    if (currentMode === 'date' && callback) {
                                        setCurrentMode('time');
                                    } else {
                                        setIsVisible(false);
                                        if (callback) callback(tempDate);
                                    }
                                }}
                            >
                                <Text style={[styles.textStyle, { color: themeColors.greenOpacity }]}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        ),
    };
};

const getStyles = (themeColors: any) => {
    return StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            width: '100%',
            backgroundColor: themeColors.backgroundColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderWidth: 1,
            borderColor: themeColors.borderColor,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
            width: 0,
            height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 15,
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            flex: 0.45,
        },
        cancelButton: {
            borderWidth: 1,
            borderColor: themeColors.redOpacity,
            backgroundColor: themeColors.backgroundColor,
        },
        doneButton: {
            borderWidth: 1,
            borderColor: themeColors.greenOpacity,
            backgroundColor: themeColors.backgroundColor,
        },
        textStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
};

export default IOSTimePicker;