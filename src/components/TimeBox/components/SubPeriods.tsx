import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { formatDate, parseDate } from '@/src/utils/timezoneBullshit';
import { getMonthWeeks, getWeekStart } from '@/src/components/TimeBox/helpers/dateUtils';
import { NotePeriod } from '@/src/features/LeftPanel/helpers/useNavigation';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface SubPeriodsProps {
    currentViewType?: string;
    date: string;
    timeZone: string;
    displayYear: string;
    handleOpenNote: (period: NotePeriod, specificDate?: string) => void;
}

export const SubPeriods: React.FC<SubPeriodsProps> = ({
    currentViewType,
    date,
    timeZone,
    displayYear,
    handleOpenNote,
}) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const renderSubPeriods = (startDate: string) => {
        const date = parseDate(startDate, timeZone);
        
        if (currentViewType === 'year') {
          // Render 4 quarters
            return (
                <View style={styles.subPeriodsContainer}>
                    {[1, 2, 3, 4].map((quarter) => {
                        // Calculate the first month of the quarter (1->0, 2->3, 3->6, 4->9)
                        const monthIndex = (quarter - 1) * 3;
                        const quarterDate = new Date(parseInt(displayYear), monthIndex, 1);
                        return (
                            <Pressable 
                                key={quarter}
                                style={styles.subPeriodButton}
                                onPress={() => handleOpenNote('quarter', formatDate(quarterDate, 'yyyy-MM-dd', timeZone))}
                            >
                                <Text style={styles.subPeriodText}>Q{quarter}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            );
        }
    
        if (currentViewType === 'quarter') {
            // Render 3 months of the quarter
            const quarterStartMonth = Math.floor((date.getMonth()) / 3) * 3;
            return (
                <View style={styles.subPeriodsContainer}>
                    {[0, 1, 2].map((offset) => {
                        const monthDate = new Date(date.getFullYear(), quarterStartMonth + offset, 1);
                        return (
                            <Pressable 
                                key={offset}
                                style={styles.subPeriodButton}
                                onPress={() => handleOpenNote('month', formatDate(monthDate, 'yyyy-MM-dd', timeZone))}
                            >
                                <Text style={styles.subPeriodText}>
                                    {formatDate(monthDate, 'MMM', timeZone)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            );
        }
    
        if (currentViewType === 'month') {
            // Render weeks of the month
            const { weekNumbers, dates } = getMonthWeeks(date);
            return (
                <ScrollView horizontal style={styles.subPeriodsScroll}>
                    <View style={styles.subPeriodsContainer}>
                        {weekNumbers.map((week, index) => (
                            <Pressable 
                                key={week}
                                style={styles.subPeriodButton}
                                onPress={() => handleOpenNote('week', formatDate(dates[index], 'yyyy-MM-dd', timeZone))}
                            >
                                <Text style={styles.subPeriodText}>W{week}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            );
        }

        if (currentViewType === 'week') {
            // Render 7 days of the week
            const weekStart = getWeekStart(date);
            return (
                <ScrollView horizontal style={styles.subPeriodsScroll}>
                    <View style={styles.subPeriodsContainer}>
                        {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                            const dayDate = new Date(weekStart);
                            dayDate.setDate(weekStart.getDate() + dayOffset);
                            return (
                                <Pressable 
                                    key={dayOffset}
                                    style={styles.subPeriodButton}
                                    onPress={() => handleOpenNote('day', formatDate(dayDate, 'yyyy-MM-dd', timeZone))}
                                >
                                    <Text style={styles.subPeriodText}>
                                        {formatDate(dayDate, 'd', timeZone)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            );
        }
    
        return null;
    };

    return (
        <View style={{alignItems: 'center'}}>
            {renderSubPeriods(date)}
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    subPeriodsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: 'red',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
    },
    subPeriodsScroll: {
        maxHeight: 50,
    },
    subPeriodButton: {
        padding: 6,
        borderRadius: 4,

        backgroundColor: theme.backgroundSecondary,
    },
    subPeriodText: {
        fontSize: 14,
        color: theme.accentColor,
    },
});