import { useState, useEffect } from 'react';

import { sortOptions } from '@/src/features/Library/helpers/sortOptions';
import { databaseManagers } from '@/database/tables';

import { LibraryData, SortOptionType } from '@/src/types/Library';

export const useMediaList = (
    mediaType: 'movie' | 'book' | 'series' | 'videogame' | 'music', 
    showWantToList: boolean,
    showDownloadedOnly: boolean
) => {
    const [items, setItems] = useState<LibraryData[]>([]);
    const [sortedItems, setSortedItems] = useState<LibraryData[]>([]);
    const [selectedItem, setSelectedItem] = useState<LibraryData | null>(null);
    const [sortOption, setSortOption] = useState<SortOptionType>('seen');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fetchItems = async (sort = sortOption, search = '') => {
        try {
            const fetchedItems = await databaseManagers.library.getLibrary({ 
                type: mediaType,
                sort: sort,
                search: search,
                finished: showWantToList ? 0 : 1,
                ...(showDownloadedOnly ? { isMarkedForDownload: 1 } : {})
            });
            setItems(fetchedItems);
        } catch (error) {
            console.error(`Error fetching ${mediaType}:`, error);
        }
    };

    useEffect(() => {
        const filteredAndSorted = items
            .filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesList = showWantToList
                    ? item.finished === 0  // Want to list: not finished
                    : item.finished === 1; // Library list: finished
                const matchesDownload = showDownloadedOnly 
                    ? item.isMarkedForDownload === 1
                    : true; // Show all items when showDownloadedOnly is false
                return matchesSearch && matchesList && matchesDownload;
            })
            .sort(sortOptions[sortOption]);
        setSortedItems(filteredAndSorted);
    }, [items, sortOption, searchQuery, showWantToList, showDownloadedOnly]);

    useEffect(() => {
        fetchItems(sortOption, searchQuery);
    }, [sortOption, searchQuery, showWantToList, showDownloadedOnly]);

    const onSaveToLibrary = async (item: LibraryData): Promise<LibraryData> => {
        try {
            const savedItem = await databaseManagers.library.upsert(item);
            fetchItems();
            return savedItem; // Return the saved item with UUID
        } catch (error) {
            console.error(`Error saving ${mediaType} to library:`, error);
            throw error; // Re-throw to handle in the modal
        }
    };

    const handleCloseDetail = () => {
        setSelectedItem(null);
    };

    const handleDelete = async (item: LibraryData) => {
        try {
            if (!item.uuid) {
                throw new Error('UUID is required for deletion');
            }

            if (mediaType === 'music') {
                // First delete all associated tracks
                const tracks = await databaseManagers.music.getTracksByLibraryUuid(item.uuid);
                
                // Use Promise.all to handle all deletions in parallel
                await Promise.all(tracks.map(async track => {
                    if (track.uuid) {
                        try {
                            await databaseManagers.music.removeByUuid(track.uuid);
                        } catch (error) {
                            // Log but continue if a track deletion fails
                            console.warn(`Failed to delete track ${track.uuid}:`, error);
                        }
                    }
                }));
            }

            // Then delete the library item
            await databaseManagers.library.removeByUuid(item.uuid);
            
            fetchItems();
        } catch (error) {
            console.error(`Error deleting ${mediaType}:`, error);
        }
    };

    const handleToggleDownload = async (item: LibraryData) => {
        try {
            const updatedItem = {
                ...item,
                isMarkedForDownload: item.isMarkedForDownload === 1 ? 0 : 1
            };
            await databaseManagers.library.upsert(updatedItem);
            setItems(prevItems =>
                prevItems.map(i => i.id === item.id ? updatedItem : i)
            );
            setSortedItems(prevItems =>
                prevItems.map(i => i.id === item.id ? updatedItem : i)
            );
            // If you have a selectedItem state, update it as well
            if (selectedItem && selectedItem.id === item.id) {
                setSelectedItem(updatedItem);
            }
        } catch (error) {
            console.error(`Error toggling download for ${mediaType}:`, error);
        }
    };

    const updateItem = async (updatedItem: LibraryData) => {
        try {
            await databaseManagers.library.upsert(updatedItem);
            
            setItems(prevItems =>
                prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
            );
            
            setSortedItems(prevSortedItems =>
                prevSortedItems.map(item => item.id === updatedItem.id ? updatedItem : item)
            );

            if (selectedItem && selectedItem.id === updatedItem.id) {
                setSelectedItem(updatedItem);
            }
        } catch (error) {
            console.error(`Error updating ${mediaType}:`, error);
        }
    };
    
    return {
        items: sortedItems,
        selectedItem,
        sortOption,
        searchQuery,
        setSelectedItem,
        setSearchQuery,
        setSortOption,
        onSaveToLibrary,
        handleCloseDetail,
        handleDelete,
        handleToggleDownload,
        updateItem,
    };
};