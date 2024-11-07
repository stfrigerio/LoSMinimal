import React, { useEffect, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { StyleSheet } from 'react-native';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { darkCalendar, lightCalendar} from '@/src/styles/theme'; 
import CustomDay from './CustomCalendarDay';

import { useChecklist } from '@/src/contexts/checklistContext';
import ViewTaskModal from '@/app/features/Home/components/Calendar/modals/ViewTaskModal';

import { useMarkedDates } from './hooks/useMarkedDates';
import { useTaskModal } from './hooks/useTaskModal';

const CustomCalendar = () => {
	const { theme, themeColors, designs } = useThemeStyles();
	const styles = getStyles(themeColors);
	
	const isDarkMode = theme === 'dark';
	const calendarTheme = isDarkMode ? darkCalendar : lightCalendar;

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
					weekVerticalMargin: 8
				}}
				style={[
					styles.calendar
				]}
				hideExtraDays={false}
				markingType="custom"
				markedDates={markedDates}
				// enableSwipeMonths={true} // don't like it
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
