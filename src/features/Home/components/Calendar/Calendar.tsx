import React, { useEffect, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { StyleSheet } from 'react-native';

import { darkTheme, lightTheme } from '@/src/styles/theme';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import CustomDay from './CustomCalendarDay';

import { useChecklist } from '@/src/contexts/checklistContext';
import ViewTaskModal from '@/src/features/Home/components/Calendar/modals/ViewTaskModal';

import { useMarkedDates } from './_hooks/useMarkedDates';
import { useTaskModal } from './_hooks/useTaskModal';

const CustomCalendar = () => {
	const { theme, themeColors } = useThemeStyles();
	const styles = getStyles(theme);
	
    const isDarkMode = theme === 'dark';

    const calendarTheme = {
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
		//this controls the week color but for some reason only accept the dark mode color
        textDisabledColor: isDarkMode ? darkTheme.opaqueTextColor : lightTheme.borderColor, 
        monthTextColor: isDarkMode ? darkTheme.textColorItalic : lightTheme.textColorItalic,
        arrowColor: isDarkMode ? darkTheme.gray : lightTheme.gray,
        textSectionTitleColor: isDarkMode ? darkTheme.gray : lightTheme.gray,
        weekVerticalMargin: 8
    };

	const { checklistUpdated, resetChecklistUpdate } = useChecklist();

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const currentDay = new Date().getDate();

	const { markedDates, fetchMarkedDates } = useMarkedDates(currentYear, themeColors);

    const {
        showModal,
        setShowModal,
        selectedDate,
        setSelectedDate,
        updateChecklistItems,
        fetchDayItems,
        toggleItemCompletion
    } = useTaskModal(fetchMarkedDates, markedDates);

    useEffect(() => {
        fetchMarkedDates();
    }, [fetchMarkedDates]);

    useEffect(() => {
        if (checklistUpdated) {
            fetchMarkedDates();
            resetChecklistUpdate();
        }
    }, [checklistUpdated, fetchMarkedDates, resetChecklistUpdate]);

    const onDayPress = useCallback((day: any) => {
        setSelectedDate(day.dateString);
        setShowModal(true);
    }, [setSelectedDate, setShowModal]);

	return (
		<>
			<Calendar
				onDayPress={onDayPress}
				firstDay={1}
				showWeekNumbers={true}
				theme={{
					...calendarTheme,
				}}
				style={[
					styles.calendar
				]}
				hideExtraDays={false}
				markingType="custom"
				markedDates={markedDates}
				enableSwipeMonths={true}
				dayComponent={({ date, marking }: { date?: any; marking?: any }) => (
					<CustomDay
						date={date}
						marking={marking}
						currentMonth={currentMonth}
						onPress={() => date && onDayPress(date)}
						isToday={date.month === currentMonth && date.day === currentDay}
					/>
				)}
			/>
			{showModal && (
				<ViewTaskModal
					showModal={showModal}
					setShowModal={setShowModal}
					initialDate={selectedDate}
					fetchDayItems={fetchDayItems}
					toggleItemCompletion={toggleItemCompletion}
					updateChecklistItems={updateChecklistItems}
				/>
			)}
		</>
	);
}

const getStyles = (theme: any) => StyleSheet.create({
	calendar: {
		marginTop: 30
	},
});

export default CustomCalendar;
