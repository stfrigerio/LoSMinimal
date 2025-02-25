import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

import createTimePicker from '@/src/components/DateTimePicker';
import ButtonsSlider from '@/src/components/atoms/ButtonsSlider';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
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
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
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
        if (decimalHour < 9.5) return theme.colors.greenOpacity;
        if (decimalHour <= 11) return theme.colors.yellowOpacity;
        return theme.colors.redOpacity;
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
                    placeholderTextColor={theme.colors.gray}
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
                        <Text style={{ 
                            color: morningData.wakeHour ? getWakeHourColor(morningData.wakeHour) : theme.colors.opaqueTextColor, 
                            fontFamily: theme.typography.fontFamily.secondary,
                            fontSize: theme.name === 'signalis' ? 18 : 14,
                        }}>
                            {morningData.wakeHour || 'Set time'}
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

export default MorningData;

const getStyles = (theme: Theme) => StyleSheet.create({
    morningContainer: {
        padding: 20,
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: 16,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: theme.name === 'signalis' ? undefined : '400',
        color: theme.colors.textColorBold,
        marginBottom: 15,
        alignSelf: 'center',
        fontFamily: theme.typography.fontFamily.primary,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontFamily: theme.typography.fontFamily.secondary,
        color: theme.colors.opaqueTextColor,
        marginBottom: 8,
        // fontWeight: '500',
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