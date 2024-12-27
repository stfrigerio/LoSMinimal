import React, { useState, useMemo } from 'react';
import { View, Dimensions, Text, StyleSheet, Pressable } from 'react-native';
import { MoodNoteData } from '@/src/types/Mood';
import MoodChart from '@/src/components/charts/MoodChart';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import createTimePicker from '@/src/components/DateTimePicker';

interface GraphViewProps {
    moodData: MoodNoteData[];
}

const GraphView: React.FC<GraphViewProps> = ({ moodData }) => {
    const { themeColors } = useThemeStyles();
    const { width } = Dimensions.get('window');
    const height = 300;
    const timePicker = createTimePicker();
    const styles = getStyles(themeColors);

    // Get min and max dates from the dataset
    const dateRange = useMemo(() => {
        const dates = moodData.map(d => new Date(d.date));
        return {
            min: new Date(Math.min(...dates.map(d => d.getTime()))),
            max: new Date(Math.max(...dates.map(d => d.getTime())))
        };
    }, [moodData]);

    // State for date range
    const [range, setRange] = useState(() => {
        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        return {
            start: monthAgo,
            end: today
        };
    });

    // Filter data based on selected date range
    const filteredData = useMemo(() => {
        return moodData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= range.start && itemDate <= range.end;
        });
    }, [moodData, range]);

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    const handleStartDatePress = () => {
        timePicker.showPicker(
            {
                mode: 'date',
                value: range.start,
                minimumDate: dateRange.min,
                maximumDate: range.end
            },
            (date) => {
                if (date) {
                    setRange(prev => ({ ...prev, start: date }));
                }
            }
        );
    };

    const handleEndDatePress = () => {
        timePicker.showPicker(
            {
                mode: 'date',
                value: range.end,
                minimumDate: range.start,
                maximumDate: dateRange.max
            },
            (date) => {
                if (date) {
                    setRange(prev => ({ ...prev, end: date }));
                }
            }
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
            <View style={{ height: 20 }} />
            <MoodChart
                moodData={filteredData}
                width={width - 40}
                height={height}
            />
            
            <View style={styles.datePickerContainer}>
                <Pressable 
                    style={[styles.dateButton]}
                    onPress={handleStartDatePress}
                >
                    <Text style={[styles.dateText, { color: themeColors.textColor }]}>
                        From: {formatDate(range.start)}
                    </Text>
                </Pressable>

                <Pressable 
                    style={[styles.dateButton]}
                    onPress={handleEndDatePress}
                >
                    <Text style={[styles.dateText, { color: themeColors.textColor }]}>
                        To: {formatDate(range.end)}
                    </Text>
                </Pressable>
            </View>

            {timePicker.picker}
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    datePickerContainer: {
        padding: 20,
        // borderWidth: 1,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 8,
        minWidth: '35%',
    },
    dateText: {
        textAlign: 'center',
        fontSize: 14,
    },
});

export default GraphView;