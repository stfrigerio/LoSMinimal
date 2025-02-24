import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

import createTimePicker from '@/src/components/DateTimePicker';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { DailyNoteData } from '@/src/types/DailyNote';
import ButtonsSlider from '@/src/components/atoms/ButtonsSlider';

type EveningDataProps = {
    data?: DailyNoteData | null;
    onUpdate?: (eveningData: Partial<DailyNoteData>) => void;
};

const EveningData: React.FC<EveningDataProps> = ({ data, onUpdate }) => {
    const initialData = {
        success: data?.success || '',
        beBetter: data?.beBetter || '',
        dayRating: data?.dayRating || 0,
        sleepTime: data?.sleepTime || '',
    };
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    const [eveningData, setEveningData] = useState(initialData);

    useEffect(() => {
        setEveningData({
            success: data?.success || '',
            beBetter: data?.beBetter || '',
            dayRating: data?.dayRating || 0,
            sleepTime: data?.sleepTime || '',
        });
    }, [data]);

    const { showPicker, picker } = createTimePicker();

    const handleInputChange = (field: keyof typeof initialData, value: string | number) => {
        const updatedData = { ...eveningData, [field]: value };
        setEveningData(updatedData);
        onUpdate?.(updatedData as Partial<DailyNoteData>);
    };

    const handleSleepTimeChange = (date: Date | undefined) => {
        if (date) {
            const formattedTime = format(date, 'HH:mm');
            handleInputChange('sleepTime', formattedTime);
        }
    };

    const showSleepTimePicker = () => {
        const currentDate = new Date();
        if (eveningData.sleepTime) {
            const [hours, minutes] = eveningData.sleepTime.split(':').map(Number);
            currentDate.setHours(hours, minutes);
        }

        showPicker({
            mode: 'time',
            value: currentDate,
            is24Hour: true,
        }, handleSleepTimeChange);
    };

    const getSleepTimeColor = (bedTime: string | null): string => {
        const time = parseFloat(bedTime || '0');
    
        if ((time >= 23 && time <= 24) || (time >= 0 && time < 1)) {
            return theme.colors.greenOpacity;
        } else if (time >= 1 && time < 5) {
            return theme.colors.yellowOpacity;
        } else {
            return theme.colors.redOpacity;
        }
    };

    return (
        <View style={styles.eveningContainer}>
            <Text style={styles.sectionTitle}>Evening Check-in</Text>
            
            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>🏆 What went well today?</Text> */}
                <TextInput
                    style={styles.input}
                    value={eveningData.success}
                    onChangeText={(value) => handleInputChange('success', value)}
                    placeholder="Share your successes..."
                    placeholderTextColor={theme.colors.gray}
                    numberOfLines={1}
                />
            </View>

            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>🛠️ What could be improved?</Text> */}
                <TextInput
                    style={styles.input}
                    value={eveningData.beBetter}
                    onChangeText={(value) => handleInputChange('beBetter', value)}
                    placeholder="Areas for improvement..."
                    placeholderTextColor={theme.colors.gray}
                    numberOfLines={1}
                />
            </View>

            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>🌟 Day Rating (0-10)</Text> */}
                <ButtonsSlider 
                    selectedValue={eveningData.dayRating} 
                    onChange={(value) => handleInputChange('dayRating', value)} 
                />
            </View>

            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>🛏️ Bedtime</Text> */}
                <Pressable style={styles.timeInputWrapper} onPress={showSleepTimePicker}>
                    <View style={[styles.input, styles.timeInput]}>
                        <Text style={{ 
                            color: eveningData.sleepTime ? getSleepTimeColor(eveningData.sleepTime) : theme.colors.opaqueTextColor,
                            fontFamily: theme.typography.fontFamily.secondary,
                            fontSize: theme.name === 'signalis' ? 18 : 14,
                        }}>
                            {eveningData.sleepTime || 'Set time'}
                        </Text>
                        <MaterialCommunityIcons 
                            name="clock-outline" 
                            size={20} 
                            color={theme.colors.opaqueTextColor} 
                        />
                    </View>
                </Pressable>
            </View>
            {picker}
        </View>
    );
};

export default EveningData;

const getStyles = (theme: Theme) => StyleSheet.create({
    eveningContainer: {
        padding: 20,
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: 16,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: theme.name === 'signalis' ? undefined : '600',
        color: theme.colors.textColorBold,
        fontFamily: theme.typography.fontFamily.primary,
        marginBottom: 15,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: theme.colors.opaqueTextColor,
        marginBottom: 8,
        fontFamily: theme.typography.fontFamily.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        borderRadius: theme.borderRadius.md,
        padding: 10,
        color: theme.colors.textColor,
        backgroundColor: theme.colors.backgroundSecondary,
        fontSize: theme.name === 'signalis' ? 18 : 14,
        fontFamily: theme.typography.fontFamily.secondary,
    },
    timeInputWrapper: {
        position: 'relative',
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
});
