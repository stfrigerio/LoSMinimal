//TimeBox.tsx
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

import { useNavigationComponents, NotePeriod } from '@/src/features/LeftPanel/helpers/useNavigation';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import {
	parseDate,
	formatDate,
	getStartOfToday,
	getLocalTimeZone,
	isSamePeriod,
    getISOWeekData,
} from '@/src/utils/timezoneBullshit';

import { SubPeriods } from '@/src/components/TimeBox/components/SubPeriods';

interface TimeBoxProps {
	startDate: string;
	currentViewType?: string;
}

const TimeBox: React.FC<TimeBoxProps> = ({ startDate, currentViewType }) => {
    if (typeof startDate !== 'string' || !startDate.match(/^\d{4}-\d{2}-\d{2}/)) {
        return null;
    }

    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const { openNote } = useNavigationComponents();
    const timeZone = getLocalTimeZone();

    // Parse dates using dateUtils
    const noteStartDate = useMemo(() => parseDate(startDate, timeZone), [startDate, timeZone]);
    const today = useMemo(() => getStartOfToday(timeZone), [timeZone]);

    // Format dates
    const displayYear = useMemo(() => formatDate(noteStartDate, 'yyyy', timeZone), [noteStartDate, timeZone]);
    const displayQuarter = useMemo(() => `Q${Math.ceil((noteStartDate.getMonth() + 1) / 3)}`, [noteStartDate]);
    const displayMonthName = useMemo(() => formatDate(noteStartDate, 'MMMM', timeZone), [noteStartDate]);

    // Update displayWeek to use UTC-based ISO week number
    const displayWeek = useMemo(() => {
        const date = new Date(startDate);
        const { week } = getISOWeekData(date);
        return `W${week.toString().padStart(2, '0')}`;
    }, [startDate, timeZone]);

    const displayDay = useMemo(() => formatDate(noteStartDate, 'd', timeZone), [noteStartDate, timeZone]);

    // Compare dates
    const isCurrentYear = useMemo(() => isSamePeriod(noteStartDate, today, 'year', timeZone), [noteStartDate, today, timeZone]);
    const isCurrentQuarter = useMemo(() => isSamePeriod(noteStartDate, today, 'quarter', timeZone), [noteStartDate, today, timeZone]);
    const isCurrentMonth = useMemo(() => isSamePeriod(noteStartDate, today, 'month', timeZone), [noteStartDate, today, timeZone]);
    const isCurrentWeek = useMemo(() => isSamePeriod(noteStartDate, today, 'week', timeZone), [noteStartDate, today, timeZone]);
    const isCurrentDay = useMemo(() => isSamePeriod(noteStartDate, today, 'day', timeZone), [noteStartDate, today, timeZone]);

    const handleOpenNote = (period: NotePeriod, specificDate?: string) => {
        try {
            openNote(period, specificDate || startDate);
        } catch (error) {
            console.error('Error in handleOpenNote', error);
        }
    };    

    const renderPeriod = (period: NotePeriod, display: string, isCurrentPeriod: boolean, isCurrentView: boolean) => {
        return (
            <Pressable onPress={() => handleOpenNote(period)} style={styles.button}>
                <Text
                    style={[
                        styles.buttonText,
                        isCurrentPeriod && styles.currentPeriodText,
                        isCurrentView && styles.currentViewText
                    ]}
                >
                    {display}
                </Text>
            </Pressable>
        );
    };

    const renderAllTime = () => (
        <>
            <Pressable onPress={() => handleOpenNote('allTime')} style={styles.button}>
                <Text style={[styles.buttonText, styles.allTimeText]}>All Time</Text>
            </Pressable>
            <Text style={styles.arrow}> » </Text>
        </>
    );

    const isDaily = currentViewType === 'daily';
    const isWeekly = currentViewType === 'week';
    const isMonthly = currentViewType === 'month';
    const isQuarterly = currentViewType === 'quarter';
    const isYearly = currentViewType === 'year';

    return (
        <View style={{alignItems: 'center'}}>
            <View style={styles.container}>
                {isYearly && renderAllTime()}
                {!isDaily && !isWeekly && renderPeriod('year', displayYear, isCurrentYear, currentViewType === 'year')}
                {!isDaily && !isYearly && (
                    <>
                        {!isDaily && !isWeekly && <Text style={styles.arrow}> » </Text>}
                        {renderPeriod('quarter', displayQuarter, isCurrentQuarter, currentViewType === 'quarter')}
                    </>
                )}
                {!isYearly && (
                    <>
                        {!isDaily && <Text style={styles.arrow}> » </Text>}
                        {renderPeriod('month', displayMonthName, isCurrentMonth, currentViewType === 'month')}
                    </>
                )}
                {(isWeekly || isDaily) && (
                    <>
                        <Text style={styles.arrow}> » </Text>
                        {renderPeriod('week', displayWeek, isCurrentWeek, currentViewType === 'week')}
                    </>
                )}
                {isDaily && (
                    <>
                        <Text style={styles.arrow}> » </Text>
                        {renderPeriod('day', displayDay, isCurrentDay, currentViewType === 'daily')}
                    </>
                )}
            </View>
            <SubPeriods
                currentViewType={currentViewType}
                date={startDate}
                timeZone={timeZone}
                displayYear={displayYear}
                handleOpenNote={handleOpenNote}
            />
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 8,
        marginHorizontal: 5,
        borderRadius: 6,
    },
    buttonText: {
        fontSize: 20,
        color: theme.colors.accentColor,
        fontWeight: '500',
        textShadowColor: theme.name === 'signalis' ? theme.colors.accentColor : theme.colors.shadowColor,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        fontFamily: theme.typography.fontFamily.primary,
    },
    currentPeriodText: {
        fontWeight: '600',
    },
    currentViewText: {
        color: theme.colors.textColorBold,
        fontWeight: '600',
    },
    arrow: {
        fontSize: 20, // Slightly smaller
        color: theme.colors.gray,
        opacity: 0.7,
        marginHorizontal: 2,
    },
    allTimeText: {
        color: theme.colors.accentColor,
        opacity: 0.8,
        fontSize: 18, // Slightly smaller than other periods
    },
});

export default React.memo(TimeBox);