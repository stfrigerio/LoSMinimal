import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, Text, Pressable } from 'react-native';

import TimeEntry from './components/TimeEntry';
import FilterAndSort, { FilterOptions, SortOption } from '@/src/components/FilterAndSort';
import BatchTimeEntryModal from '../../modals/BatchTimeEntryModal';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useColors } from '@/src/utils/useColors';

import { TimeData } from '@/src/types/Time';
import { useTimeData } from '../../hooks/useTimeData';
import { navItems } from '../../constants/navItems';
import MobileNavbar from '@/src/components/NavBar';
import EditTimeEntryModal from '../../modals/EditModal';


const TimeList: React.FC = () => {
	const { themeColors, designs } = useThemeStyles();
	const [selectionState, setSelectionState] = useState({
		selectedUuids: new Set<string>(),
		isSelectionMode: false
	});
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        dateRange: { start: null, end: null },
        tags: [],
        searchTerm: '',
    });
    const [sortOption, setSortOption] = useState<SortOption>('recent');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const styles = React.useMemo(() => getStyles(themeColors, designs, showFilter, selectionState.isSelectionMode), [themeColors, designs, showFilter, selectionState.isSelectionMode]);
	const { colors: tagColors, loading: colorsLoading, error: colorsError } = useColors();
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    const { 
        entries, 
        isLoading, 
        error, 
        deleteTimeEntry, 
        editTimeEntry, 
        addTimeEntry,
		batchUpdateTimeEntries  // Add this
    } = useTimeData();

	// Compute sorted entries
	const sortedEntries = useMemo(() => {
		return [...entries].sort((a: TimeData, b: TimeData) => 
			new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime()
		);
	}, [entries]);

	// Derive unique tags
	const tags = useMemo(() => {
		return Array.from(new Set(entries.map((entry: TimeData) => entry.tag)));
	}, [entries]);

	// Compute filtered and sorted entries
	const filteredEntries = useMemo(() => {
		// Apply Filters
		let filtered = sortedEntries.filter((entry: TimeData) => {
			const entryDate = new Date(entry.date!);
			entryDate.setHours(0, 0, 0, 0);  // Reset time to start of day

			const inDateRange = (!filters.dateRange.start || entryDate >= new Date(filters.dateRange.start.setHours(0, 0, 0, 0))) &&
								(!filters.dateRange.end || entryDate <= new Date(filters.dateRange.end.setHours(0, 0, 0, 0)));

			const matchesTags = filters.tags.length === 0 || filters.tags.includes(entry.tag);
			const matchesSearch = entry.description!.toLowerCase().includes(filters.searchTerm.toLowerCase());
			return inDateRange && matchesTags && matchesSearch;
		});

		// Apply Sorting
		filtered.sort((a: TimeData, b: TimeData) => {
			switch (sortOption) {
				case 'recent':
					return new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime();
				case 'oldest':
					return new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime();
				case 'highestValue':
					// Assuming duration is a number; adjust if it's a string
					return Number(b.duration!) - Number(a.duration!);
				case 'lowestValue':
					return Number(a.duration!) - Number(b.duration!);
				default:
					return 0;
			}
		});

		return filtered;
	}, [sortedEntries, filters, sortOption]);

    // Memoize the color mapping for all entries
    const entryColors = useMemo(() => {
        if (colorsLoading || !tagColors) {
            return {};
        }
        return entries.reduce((acc, entry) => {
            acc[entry.id!] = tagColors[entry.tag!] || themeColors.textColor;
            return acc;
        }, {} as Record<number, string>);
    }, [entries, tagColors, colorsLoading, themeColors.textColor]);

	const toggleSelect = (uuid: string) => {
		setSelectionState(prevState => {
			const newSelectedUuids = new Set(prevState.selectedUuids);
			if (newSelectedUuids.has(uuid)) {
				newSelectedUuids.delete(uuid);
			} else {
				newSelectedUuids.add(uuid);
			}
			return {
				selectedUuids: newSelectedUuids,
				isSelectionMode: newSelectedUuids.size > 0
			};
		});
	};

    const clearSelection = () => {
        setSelectionState(prevState => ({
            selectedUuids: new Set(),
            isSelectionMode: false
        }));
    };

    const handleBatchEdit = () => {
        setIsBatchModalOpen(true);
    };

	
    const handleBatchModalClose = () => {
        setIsBatchModalOpen(false);
        clearSelection();
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

	const handleBatchUpdate = (updatedFields: Partial<TimeData>) => {
		handleEditTimeEntry(Array.from(selectionState.selectedUuids), updatedFields);
		handleBatchModalClose();
	};

	const renderTimeEntry = useCallback(({ item }: { item: TimeData }) => (
		<TimeEntry
			item={item}
			onUpdateTimeEntry={editTimeEntry}
			deleteTimeEntry={deleteTimeEntry}
			tagColor={entryColors[item.id!] || themeColors.textColor}
			isSelectionMode={selectionState.isSelectionMode}
			isSelected={selectionState.selectedUuids.has(item.uuid!)}
			toggleSelect={toggleSelect}
			isFilterActive={showFilter}
		/>
	), [selectionState, editTimeEntry, deleteTimeEntry, entryColors, showFilter, toggleSelect]);


	const handleAddNewTimer = (newEntry: TimeData) => {
		addTimeEntry(newEntry);
		setIsAddModalOpen(false);
	};

	return (
        <View style={styles.container}>
			{selectionState.isSelectionMode && (
                <View style={styles.selectionHeader}>
                    <Text style={styles.selectionText}>{selectionState.selectedUuids.size} Selected</Text>
                    <Pressable onPress={handleBatchEdit} style={styles.batchButton}>
                        <Text style={styles.batchButtonText}>Batch Edit</Text>
                    </Pressable>
                    <Pressable onPress={clearSelection} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                </View>
            )}
			<FlatList
				data={filteredEntries}
				renderItem={renderTimeEntry}
                keyExtractor={(item) => item.uuid!}
				style={styles.list}
				initialNumToRender={10}
				maxToRenderPerBatch={5}
				windowSize={5}
				removeClippedSubviews={true}
				
			/>
            {!selectionState.isSelectionMode && (
				<FilterAndSort
					onFilterChange={(newFilters: FilterOptions) => setFilters(newFilters)}
					onSortChange={(newSortOption: SortOption) => setSortOption(newSortOption)}
					tags={tags}
					searchPlaceholder="Search by description"
					isActive={showFilter}
				/>
            )}
			{isBatchModalOpen && (
                <BatchTimeEntryModal
                    isOpen={isBatchModalOpen}
                    closeBatchModal={handleBatchModalClose}
                    selectedTimeEntries={Array.from(selectionState.selectedUuids).map(uuid => filteredEntries.find(t => t.uuid === uuid)!)}
                    onBatchUpdate={handleBatchUpdate}
                />
            )}
			{isAddModalOpen && (
				<EditTimeEntryModal
					isVisible={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
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
            <MobileNavbar
				items={navItems} 
				activeIndex={navItems.findIndex(item => item.label === 'List')} 
				showFilter={true}
                onFilterPress={() => setShowFilter(!showFilter)}
				quickButtonFunction={() => setIsAddModalOpen(true)}
				screen="time"
			/>
		</View>
	);
};

const getStyles = (themeColors: any, designs: any, showFilter: boolean, isSelectionMode: boolean) => {
	const { width } = Dimensions.get('window');
	const isSmall = width < 1920;
	const isDesktop = Platform.OS === 'web';

	return StyleSheet.create({
		container: {
            flex: 1,
			backgroundColor: themeColors.backgroundColor,
			paddingTop: 20,
            position: 'relative',
        },
        list: {
            marginTop: isSelectionMode ? 80 : 30, // Adjust margin if selection header is visible
            marginBottom: showFilter ? 80 : 0,
            flex: 1,
			marginHorizontal: 16,
        },
		selectionHeader: {
            position: 'absolute',
            top: 10,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: themeColors.backgroundSecondary,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.borderColor,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            zIndex: 1,
        },
        selectionText: {
            color: 'gray',
        },
        batchButton: {
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
        },
        batchButtonText: {
            color: themeColors.textColor,
            fontWeight: 'bold',
        },
        cancelButton: {
            padding: 10,
            borderRadius: 5,
        },
        cancelButtonText: {
            color: 'gray',
        },
	});
};

export default TimeList;
