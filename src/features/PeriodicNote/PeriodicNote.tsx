// Libraries
import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import Color from 'color';

// Components
import TimeBox from '@/src/components/TimeBox/TimeBox';
import DateNavigation from '@/src/features/PeriodicNote/components/DateNavigation';
import DateHeader from '@/src/features/DailyNote/components/DateHeader';
import { SectionRenderer } from './components/SectionRenderer';
import SectionSidebar from './components/SectionSidebar';
import SidebarButton from './components/atoms/SidebarButton';
import ColorfulTimeline from '@/src/features/DailyNote/components/ColorfulTimeline';

import { calculatePeriodTypeAndFormatDate } from './helpers/periodCalculation';
import { useDateState } from './helpers/useDateState';
import { useColors } from '@/src/utils/useColors';
import { useThemeStyles } from '../../styles/useThemeStyles';
import { navigatePeriod } from './helpers/navigatePeriod';
import { getLocalTimeZone } from '@/src/utils/timezoneBullshit';

const PeriodicNote: React.FC = () => {
	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);
	const { colors: tagColors } = useColors();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [sidebarVisibility, setSidebarVisibility] = useState<'hidden' | 'icons' | 'extended'>('hidden');
	const [activeSection, setActiveSection] = useState<string>('objectives');

	const [dateState, setDateState] = useDateState();

	const handleNavigatePeriod = useCallback((direction: 'previous' | 'next' | 'current') => {
		const timeZone = getLocalTimeZone();
		setDateState(prevState => {
			const { newStartDate, newEndDate } = navigatePeriod(direction, prevState.periodType, prevState.startDate, prevState.endDate, timeZone);
			const { periodType, formattedDate } = calculatePeriodTypeAndFormatDate(newStartDate, newEndDate);
			return { startDate: newStartDate, endDate: newEndDate, periodType, formattedDate };
		});
	}, []);
	
	const toggleSidebarVisibility = (newVisibility?: 'hidden' | 'icons' | 'extended') => {
		setSidebarVisibility(current => newVisibility ?? (current === 'hidden' ? 'icons' : 'hidden'));
	};

	return (
		<>
			<View style={styles.mainContainer}>
				<ColorfulTimeline title={dateState.formattedDate} />
				<View style={[styles.contentContainer]}>
					<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

						<View style={styles.periodNote}>
							<DateHeader
								formattedDate={dateState.formattedDate}
								periodType={dateState.periodType}
							/>
							<View style={styles.navigation}>
								<TimeBox
									startDate={dateState.startDate.toISOString()}
									currentViewType={dateState.periodType}
								/>
								<DateNavigation
									periodType={dateState.periodType}
									onNavigate={handleNavigatePeriod}
								/>
							</View>
						</View>

						<View>
							<SectionRenderer
								activeSection={activeSection}
								dateState={dateState}
								isModalVisible={isModalVisible}
								setIsModalVisible={setIsModalVisible}
								tagColors={tagColors}
							/>
						</View>
					</ScrollView>
				</View>
			</View>

			<SidebarButton
				sidebarVisibility={sidebarVisibility}
				toggleSidebarVisibility={toggleSidebarVisibility}
			/>
			<SectionSidebar
				dateState={dateState}
				onSectionSelect={setActiveSection}
				activeSection={activeSection}
				visibility={sidebarVisibility}
			/>
			{/* <View style={styles.verticalLine}></View> */}
		</>
	);
};

const getStyles = (theme: any) => {
	const translucentBackgroundColor = Color(theme.backgroundSecondary).alpha(0.3).toString();

	return StyleSheet.create({
		mainContainer: {
			flex: 1,
			paddingTop: 37,
			position: 'relative',
			backgroundColor: theme.backgroundColor,
		},
		container: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
		},
		contentContainer: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			padding: 20,
			paddingTop: 0,
		},
		periodNote: {
			padding: 20,
		},
		navigation: {
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		chevronButton: {
			position: 'absolute',
			top: 140,
			left: 0,
			backgroundColor: translucentBackgroundColor,
			borderTopRightRadius: 15,
			borderBottomRightRadius: 15,
			padding: 5,
			zIndex: 1001,
		},
		verticalLine: {
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: 'red', // Change the color as needed
        },
	});
};

export default PeriodicNote;