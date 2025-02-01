import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import SearchComponent from './components/SearchComponent';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMediaList } from '@/src/features/Library/hooks/useMediaList';

import { LibraryData } from '@/src/types/Library';
import { SectionHeader } from './components/SectionHeader';
import { useAlbumManagement } from '@/src/features/Music/hooks/useAlbumManagement';
import { Album } from '@/src/features/Music/types';
import { router } from 'expo-router';

interface MediaListProps {
    mediaType: 'movie' | 'book' | 'series' | 'videogame' | 'music';
    CardComponent: React.ComponentType<{ item: LibraryData; onPress: (item: LibraryData) => void; onToggleDownload?: (item: LibraryData) => Promise<void> }>;
    DetailedViewComponent: React.ComponentType<{
        item: LibraryData;
        onClose: () => void;
        onDelete: (item: LibraryData) => void;
        onToggleDownload?: (item: LibraryData) => Promise<void>;
        updateItem: (item: LibraryData) => Promise<void>;
        album?: Album;
    }>;
    SearchModalComponent: React.ComponentType<{ 
        isOpen: boolean; 
        onClose: () => void; 
        onSaveToLibrary: (item: LibraryData) => Promise<LibraryData>; 
        showWantToList: boolean;
    }>;
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MediaList: React.FC<MediaListProps> = ({ 
    mediaType, 
    CardComponent, 
    DetailedViewComponent, 
    SearchModalComponent, 
    modalVisible, 
    setModalVisible,
}) => {
    const [showWantToList, setShowWantToList] = useState(false);
    const [showDownloadedOnly, setShowDownloadedOnly] = useState(false);

    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const {
        items,
        selectedItem,
        sortOption,
        searchQuery,
        setSearchQuery,
        setSortOption,
        onSaveToLibrary,
        handleCloseDetail,
        handleDelete,
        handleToggleDownload,
        updateItem,
    } = useMediaList(mediaType, showWantToList, showDownloadedOnly);

    const { 
        albums, 
        selectedAlbum, 
        setSelectedAlbum 
    } = useAlbumManagement();

    const handleItemSelectWithAlbum = (item: LibraryData) => {
        const typeMap = {
            movie: 'movies',
            series: 'series',
            book: 'books',
            videogame: 'videogames',
            music: 'music'
        };
        
        if (mediaType === 'music') {
            const matchingAlbum = albums.find(album => {
                return album.name === item.title;
            });
            setSelectedAlbum(matchingAlbum || null);
        }

        router.push(`/library/${typeMap[mediaType]}/${item.title}`);
    };

    const handleCloseDetailWithAlbum = () => {
        if (mediaType === 'music') {
            setSelectedAlbum(null);
        }
        handleCloseDetail();
    };

    const renderItem = ({ item }: { item: LibraryData }) => {
        return (
            <View style={styles.cardWrapper}>
                <CardComponent 
                    item={item} 
                    onPress={handleItemSelectWithAlbum} 
                    onToggleDownload={(mediaType === 'music' || mediaType === 'book') ? handleToggleDownload : undefined} 
                />
            </View>
        );
    };

    return (
        <>
            <View style={styles.container}>
                {selectedItem ? (
                    <DetailedViewComponent 
                        item={selectedItem} 
                        onClose={handleCloseDetailWithAlbum} 
                        onDelete={handleDelete} 
                        onToggleDownload={mediaType === 'music' ? handleToggleDownload : undefined}
                        updateItem={updateItem}
                        album={selectedAlbum || undefined}
                    />
                ) : (
                    <View style={styles.listContainer}>
                        <SectionHeader 
                            section={mediaType} 
                            onBack={() => router.navigate('/library')} 
                            showWantToList={showWantToList}
                            setShowWantToList={setShowWantToList}
                            showDownloadedOnly={showDownloadedOnly}
                            setShowDownloadedOnly={setShowDownloadedOnly}
                        />
                        <View style={styles.filteringView}>
                            <View style={styles.searchContainer}>
                                <SearchComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            </View>
                            {/* TODO: This needs iOS and Android support */}

                            {/* <View style={styles.pickerContainer}> 
                                {/* <Text style={styles.sortText}>Sort by</Text> */}
                                {/* <Picker
                                    selectedValue={sortOption}
                                    onValueChange={(itemValue) => setSortOption(itemValue)}
                                    style={{ color: themeColors.textColor }}
                                >
                                    <Picker.Item label="Seen" value="seen" />
                                    <Picker.Item label="Release Year" value="year" />
                                    <Picker.Item label="Rating" value="rating" />
                                </Picker> 
                            </View> */}
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
                        <View style={{ height: 60 }} />
                        {modalVisible && 
                            <SearchModalComponent
                                isOpen={modalVisible}
                                onClose={() => setModalVisible(false)}
                                onSaveToLibrary={onSaveToLibrary}
                                showWantToList={showWantToList}
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
            paddingTop: 50
        },
        flatList: {
            flex: 1,
            width: '100%',
        },
        filteringView: {
            flexDirection: 'row',
            margin: 10,
            padding: 15,
            marginBottom: 10
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
        },
    });
};

export default MediaList;