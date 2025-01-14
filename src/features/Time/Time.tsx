import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform} from 'react-native';

import Navbar from '@/src/components/NavBar';
import TimeList from './components/TimeList';
import TimeGraphs from './components/TimeGraphs';
import EditTimeEntryModal from './modals/EditModal';

import { useThemeStyles } from '../../styles/useThemeStyles';
import { useTimeData } from './hooks/useTimeData';
import { Timeline } from './components/Timeline/Timeline';
import { TimeData } from '../../types/Time';
import { SortOption } from '@/src/components/FilterAndSort';
import { FilterOptions } from '@/src/components/FilterAndSort';

const TimeHub: React.FC = () => {
	const { theme, themeColors, designs } = useThemeStyles();
	const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);
	const [showFilter, setShowFilter] = useState(false);
	const [activeView, setActiveView] = useState('List');
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [filters, setFilters] = useState<FilterOptions>({
        dateRange: { start: null, end: null },
        tags: [],
        searchTerm: '',
    });
    const [sortOption, setSortOption] = useState<SortOption>('recent');

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    const handleSortChange = (newSortOption: SortOption) => {
        setSortOption(newSortOption);
    };

	const closeAddModal = () => setIsAddModalOpen(false);
	const openAddModal = () => setIsAddModalOpen(true);

    const { 
        entries, 
        isLoading, 
        error, 
        deleteTimeEntry, 
        editTimeEntry, 
        addTimeEntry,
		batchUpdateTimeEntries  // Add this
    } = useTimeData();

	const handleAddNewTimer = (newEntry: TimeData) => {
		addTimeEntry(newEntry);
		closeAddModal();
	};

	const toggleFilter = () => {
		setShowFilter(!showFilter);
	};

	const handleEditTimeEntry = (entryOrUuids: TimeData | string[], updatedFields?: Partial<TimeData>) => {
		if (Array.isArray(entryOrUuids) && updatedFields) {
			// Handle batch update
			return batchUpdateTimeEntries(entryOrUuids, updatedFields);
		} else {
			// Handle single entry update
			return editTimeEntry(entryOrUuids as TimeData);
		}
	};

	const navItems = [
		{ label: 'List', onPress: () => setActiveView('List') },
		{ label: 'Timeline', onPress: () => setActiveView('Timeline') }
	];

	return (
		<View style={styles.container}>
            {activeView === 'List' && (
                <TimeList 
                    entries={entries}
                    isLoading={isLoading}
                    error={error || ''}
                    deleteTimeEntry={deleteTimeEntry}
                    editTimeEntry={handleEditTimeEntry} 
                    showFilter={showFilter}
                    filters={filters}
                    sortOption={sortOption}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            )}
			{activeView === 'Timeline' && (
				<Timeline />
			)}
			<Navbar
				items={navItems} 
				activeIndex={navItems.findIndex(item => item.label === activeView)} 
				showFilter={activeView === 'List' ? true : false}
				onFilterPress={toggleFilter}
				quickButtonFunction={openAddModal}
				screen="time"
			/>
			{isAddModalOpen && (
				<EditTimeEntryModal
					isVisible={isAddModalOpen}
					onClose={closeAddModal}
					onSave={handleAddNewTimer}
					timeEntry={{
						date: new Date().toISOString(),
						startTime: new Date().toISOString(),
						endTime: new Date().toISOString(),
						duration: '00:00:00',
						tag: '',
						description: '',
					}}
				/>
			)}
		</View>
	);
};

const getStyles = (themeColors: any, designs: any) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeColors.backgroundColor,
			padding: 20,
			paddingTop: 37,
		},
		header: {
			alignItems: 'center',
			marginBottom: 10,
			fontFamily: 'serif',
		},
		headerText: {
			...designs.text.title,
			fontSize: 24,
			fontFamily: 'serif',
		},
		viewToggle: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginBottom: 20,
		},
		chartIcon: {
			marginLeft: 15,
		},
		list: {
			flex: 1,
		},
		graphPlaceholder: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		floatingButton: {
			position: 'absolute',
			bottom: 20,
			right: 20,
			width: 60,
			height: 60,
			borderRadius: 30,
			backgroundColor: themeColors.hoverColor,
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
		},
		timeList: {
			flex: 1,
			marginTop: 30,
		},
	});
};

export default TimeHub;