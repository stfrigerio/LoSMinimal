import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

import createTimePicker from '@/src/components/DateTimePicker';
import ButtonsSlider from '@/src/components/atoms/ButtonsSlider';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { DailyNoteData } from '@/src/types/DailyNote';

type MorningDataProps = {
    data?: DailyNoteData | null;
    onUpdate?: (morningData: Partial<DailyNoteData>) => void;
};

const MorningData: React.FC<MorningDataProps> = ({ data, onUpdate }) => {
    const initialData = {
        morningComment: data?.morningComment || '',
        wakeHour: data?.wakeHour || '',
        energy: data?.energy || 0,
    };
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const [morningData, setMorningData] = useState(initialData);

    useEffect(() => {
        setMorningData({
            morningComment: data?.morningComment || '',
            wakeHour: data?.wakeHour || '',
            energy: data?.energy || 0,
        });
    }, [data]);

    const handleInputChange = (field: keyof typeof initialData, value: string | number) => {
        const updatedData = { ...morningData, [field]: value };
        setMorningData(updatedData);
        onUpdate?.(updatedData as Partial<DailyNoteData>);
    };

    const { showPicker, picker } = createTimePicker();

    const handleWakeHourChange = (date: Date | undefined) => {
        if (date) {
            const formattedTime = format(date, 'HH:mm');
            handleInputChange('wakeHour', formattedTime);
        }
    };

    const showWakeHourPicker = () => {
        const currentDate = new Date();
        if (morningData.wakeHour) {
            const [hours, minutes] = morningData.wakeHour.split(':').map(Number);
            currentDate.setHours(hours, minutes);
        }

        showPicker({
            mode: 'time',
            value: currentDate,
            is24Hour: true,
        }, handleWakeHourChange);
    };

    const getWakeHourColor = (wakeHour: string): string => {
        const [hours, minutes] = wakeHour.split(':').map(Number);
        const decimalHour = hours + minutes / 60;
        if (decimalHour < 9.5) return themeColors.greenOpacity;
        if (decimalHour <= 11) return themeColors.yellowOpacity;
        return themeColors.redOpacity;
    };

    return (
        <View style={styles.morningContainer}>
            <Text style={styles.sectionTitle}>Morning Check-in</Text>
            
            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>💬 How are you feeling?</Text> */}
                <TextInput
                    style={styles.input}
                    value={morningData.morningComment}
                    onChangeText={(value) => handleInputChange('morningComment', value)}
                    placeholder="Share your morning thoughts..."
                    placeholderTextColor={themeColors.gray}
                    multiline
                    numberOfLines={1}
                />
            </View>

            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>🔋 Energy Level (0-10)</Text> */}
                <ButtonsSlider 
                    selectedValue={morningData.energy} 
                    onChange={(value) => handleInputChange('energy', value)} 
                />
            </View>

            <View style={styles.inputGroup}>
                {/* <Text style={styles.label}>🌞 Wake-up Time</Text> */}
                <Pressable style={styles.timeInputWrapper} onPress={showWakeHourPicker}>
                    <View style={[styles.input, styles.timeInput]}>
                        <Text style={{ color: morningData.wakeHour ? getWakeHourColor(morningData.wakeHour) : themeColors.gray }}>
                            {morningData.wakeHour || 'Set time'}
                        </Text>
                        <MaterialCommunityIcons 
                            name="clock-outline" 
                            size={20} 
                            color={themeColors.opaqueTextColor} 
                        />
                    </View>
                </Pressable>
            </View>
            {picker}
        </View>
    );
};

export default MorningData;

const getStyles = (themeColors: any) => StyleSheet.create({
    morningContainer: {
        padding: 20,
        backgroundColor: themeColors.backgroundColor,
        borderRadius: 16,
        marginVertical: 10,
        // shadowColor: themeColors.shadowColor,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.textColor,
        marginBottom: 15,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: themeColors.opaqueTextColor,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 10,
        padding: 10,
        color: themeColors.textColor,
        backgroundColor: themeColors.backgroundSecondary,
        fontSize: 16,
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