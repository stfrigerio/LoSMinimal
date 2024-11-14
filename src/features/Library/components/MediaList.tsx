import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import SearchComponent from '@/src/features/Library/components/SearchComponent';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMediaList } from '@/src/features/Library/hooks/useMediaList';

import { LibraryData } from '@/src/types/Library';

interface MediaListProps {
    mediaType: 'movie' | 'book' | 'series' | 'videogame' | 'music';
    CardComponent: React.ComponentType<{ item: LibraryData; onPress: (item: LibraryData) => void }>;
    DetailedViewComponent: React.ComponentType<{
        item: LibraryData;
        onClose: () => void;
        onDelete: (item: LibraryData) => void;
        onToggleDownload?: (item: LibraryData) => Promise<void>;
        updateItem: (item: LibraryData) => Promise<void>;
    }>;
    SearchModalComponent: React.ComponentType<{ isOpen: boolean; onClose: () => void; onSaveToLibrary: (item: LibraryData) => Promise<LibraryData> }>;
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MediaList: React.FC<MediaListProps> = ({ mediaType, CardComponent, DetailedViewComponent, SearchModalComponent, modalVisible, setModalVisible }) => {
    const {
        items,
        selectedItem,
        sortOption,
        searchQuery,
        setSearchQuery,
        setSortOption,
        onSaveToLibrary,
        handleItemSelect,
        handleCloseDetail,
        handleDelete,
        handleToggleDownload,
        updateItem,
    } = useMediaList(mediaType);

    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const renderItem = ({ item }: { item: LibraryData }) => {
        return (
            <View style={styles.cardWrapper}>
                <CardComponent item={item} onPress={handleItemSelect} />
            </View>
        );
    };

    return (
        <>
            <View style={styles.container}>
                {selectedItem ? (
                    <DetailedViewComponent 
                        item={selectedItem} 
                        onClose={handleCloseDetail} 
                        onDelete={handleDelete} 
                        onToggleDownload={mediaType === 'music' ? handleToggleDownload : undefined}
                        updateItem={updateItem}
                    />
                ) : (
                    <View style={styles.listContainer}>
                        <View style={styles.filteringView}>
                            <View style={styles.searchContainer}>
                                <SearchComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            </View>
                            <View style={styles.pickerContainer}>
                                <Text style={styles.sortText}>Sort by</Text>
                                <Picker
                                    selectedValue={sortOption}
                                    onValueChange={(itemValue) => setSortOption(itemValue)}
                                    style={{ color: themeColors.textColor }}
                                >
                                    <Picker.Item label="Seen" value="seen" />
                                    <Picker.Item label="Release Year" value="year" />
                                    <Picker.Item label="Rating" value="rating" />
                                </Picker>
                            </View>
                        </View>
                        <FlatList
                            style={styles.flatList}
                            data={items}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderItem}
                            initialNumToRender={10}
                            maxToRenderPerBatch={5}
                            windowSize={5}
                            removeClippedSubviews={true}
                        />
                        {modalVisible && 
                            <SearchModalComponent
                                isOpen={modalVisible}
                                onClose={() => setModalVisible(false)}
                                onSaveToLibrary={onSaveToLibrary}
                            />
                        }
                    </View>
                )}
            </View>
        </>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            height: '100%',
            backgroundColor: theme.backgroundColor,
            padding: 10,
        },
        buttonText: {
            color: '#1E2225',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold'
        },
        flatList: {
            flex: 1,
            width: '100%',
        },
        filteringView: {
            flexDirection: 'row',
            margin: 10,
            padding: 15,
            marginBottom: -10
        },
        listContainer: {
            flex: 1,
            height: '100%',
        },
        pickerContainer: {
            flexDirection: 'column',
        },
        sortText: {
            color: theme.textColor,
            marginLeft: 10
        },
        searchContainer: {
            flexGrow: 1,
        },
        cardWrapper: {
            marginVertical: 6,
            marginHorizontal: 2, // Slight horizontal margin
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3, // Android shadow
        },
    });
};

export default MediaList;