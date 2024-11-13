//TimeBox.tsx
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { useNavigationComponents, NotePeriod } from '@/src/features/LeftPanel/helpers/useNavigation';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import {
	parseDate,
	formatDate,
	getStartOfToday,
	getLocalTimeZone,
	isSamePeriod,
    getISOWeekData,
} from '@/src/utils/timezoneBullshit';

interface TimeBoxProps {
	startDate: string;
	currentViewType?: string;
}

const TimeBox: React.FC<TimeBoxProps> = ({ startDate, currentViewType }) => {
    if (typeof startDate !== 'string' || !startDate.match(/^\d{4}-\d{2}-\d{2}/)) {
        return null;
    }

    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

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
        const date = parseDate(startDate, timeZone);
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

    const handleOpenNote = (period: NotePeriod) => {
        openNote(period, startDate);
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

    const isDaily = currentViewType === 'daily';
    const isWeekly = currentViewType === 'week';
    const isMonthly = currentViewType === 'month';
    const isQuarterly = currentViewType === 'quarter';
    const isYearly = currentViewType === 'year';

    return (
        <View style={styles.container}>
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
    );
};

const getStyles = (theme: any) => StyleSheet.create({
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
        color: theme.accentColor,
        fontWeight: '500',
        textShadowColor: theme.shadowColor,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    currentPeriodText: {
        fontWeight: '600',
    },
    currentViewText: {
        color: theme.textColorBold,
        fontWeight: '600',
    },
    arrow: {
        fontSize: 20, // Slightly smaller
        color: theme.gray,
        opacity: 0.7,
        marginHorizontal: 2,
    },
});

export default React.memo(TimeBox);