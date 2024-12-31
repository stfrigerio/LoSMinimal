import React, { useMemo, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Platform, Text } from 'react-native';

import QuantifiableHabitsChart from '@/src/components/charts/QuantifiableHabitsChart/QuantifiableHabitsChart';
import AlertModal from '@/src/components/modals/AlertModal';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { usePeriodicData } from '@/src/features/PeriodicNote/hooks/usePeriodicData';

interface QuantifiableSectionProps {
    startDate: Date;
    endDate: Date;
    tagColors: any;
    periodType: string;
}

const QuantifiableSection: React.FC<QuantifiableSectionProps> = ({ 
    startDate, 
    endDate,
    tagColors,
    periodType,
}) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const [error, setError] = useState<Error | null>(null);

    const { width } = Dimensions.get('window');
    const chartWidth = width * 0.8;
    const chartHeight = Dimensions.get('window').height * 0.3;

    const {
        current: { dailyNoteData, userSettingsQuantifiables },
        previous: { dailyNoteData: previousDailyNoteData, userSettingsQuantifiables: previousUserSettingsQuantifiables }
    } = usePeriodicData(startDate, endDate);
    
    const quantifiableHabitsData = useMemo(() => {
        try {
            if (!dailyNoteData || dailyNoteData.length === 0) return null;

            const processedData = dailyNoteData.map((note: any) => ({
                date: note.date,
                ...note.quantifiableHabits
            }));

            const chartData: { dates: string[] } & { [habit: string]: number[] } = { dates: [] };
            const habits = Object.keys(processedData[0]).filter(key => key !== 'date');

            processedData.forEach((day: any) => {
                chartData.dates.push(day.date);
                habits.forEach(habit => {
                    if (!chartData[habit]) chartData[habit] = [];
                    chartData[habit].push(day[habit]);
                });
            });

            return chartData;
        } catch (err) {
            console.error("Error in quantifiableHabitsData calculation:", err);
            setError(err instanceof Error ? err : new Error('Error in data processing'));
            return null;
        }
    }, [dailyNoteData]);

    const openNote = (date: string) => console.log(`Opening note for date: ${date}`);
    const openPeriodNote = (startDate: Date, endDate: Date) => 
        console.log(`Opening period note from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    if (!quantifiableHabitsData || !userSettingsQuantifiables) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'gray' }}>No quantifiable habits data available.</Text>
            </View>
        );
    }

    if (error) {
        return (
            <AlertModal
                isVisible={true}
                title="Error in QuantifiableSection"
                message={`An error occurred: ${error.message}\nPlease take a screenshot and send it to support.`}
                onConfirm={() => setError(null)}
                onCancel={() => setError(null)}
            />
        );
    }

    const defaultViewType = (() => {
        switch (periodType) {
            case 'week':
            case 'month':
                return 'daily';
            case 'quarter':
            case 'year':
                return 'weekly';
            default:
                return 'daily';
        }
    })();

    const validateViewType = (viewType: string) => {
        // Prevent daily view for longer periods
        if (periodType === 'year' && viewType === 'daily') {
            return 'weekly';
        }
        if (periodType === 'quarter' && viewType === 'daily') {
            return 'weekly';
        }
        return viewType;
    };

    return (
        <View style={styles.container}>
            <QuantifiableHabitsChart 
                userSettings={userSettingsQuantifiables}
                data={quantifiableHabitsData} 
                onOpenNote={openNote}
                onOpenPeriodNote={openPeriodNote}
                defaultViewType={validateViewType(defaultViewType)}
                periodType={periodType}
                width={chartWidth}
                height={chartHeight}
            />
        </View>
    );
};

const getStyles = (theme: any) => {
    const { width } = Dimensions.get('window');
    const isDesktop = Platform.OS === 'web';

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};

export default QuantifiableSection;
