import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

import { useSpotifyFetcher, Album } from '../api/musicFetcher';
import { useThemeStyles } from '../../../styles/useThemeStyles';
import { databaseManagers } from '@/database/tables';

import { LibraryData, TrackData } from '@/src/types/Library';

interface MusicSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveToLibrary: (album: LibraryData) => Promise<LibraryData>;
    showWantToList: boolean;
}

const MusicSearchModal: React.FC<MusicSearchModalProps> = ({ isOpen, onClose, onSaveToLibrary, showWantToList }) => {
    const [query, setQuery] = useState('');
    const [albums, setAlbums] = useState<Album[]>([]);
    const [personalRating, setPersonalRating] = useState(0);
    const [showSearch, setShowSearch] = useState(true);
    const [showAlbumsList, setShowAlbumsList] = useState(false);
    const [showRatingInput, setShowRatingInput] = useState(false);
    const [detailedAlbum, setDetailedAlbum] = useState<LibraryData | null>(null);
    const [loadingTrack, setLoadingTrack] = useState<string | null>(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const { fetchAlbums, getAlbumById, getTrackDetails, apiGet, getAccessToken, clearStoredTokens } = useSpotifyFetcher();

    const handleSearch = async () => {
        try {
            const fetchedAlbums = await fetchAlbums(query);
            if (fetchedAlbums.length === 0) {
                setError('No albums found. Please try a different search.');
                return;
            }
            setAlbums(fetchedAlbums);
            setShowSearch(false);
            setShowAlbumsList(true);
        } catch (error) {
            console.error('Error searching albums:', error);
            setError('Failed to search albums. Please try again.');
        }
    };

    const handleSelectAlbum = async (album: Album) => {
        const detailedData = await getAlbumById(album.id);
        if (detailedData) {
            if (detailedData.cast) {
                const tracks = detailedData.cast.split(' | ');
                
                const token = await getAccessToken();
                if (!token) {
                    console.error('No access token available');
                    return;
                }
    
                const albumRes = await apiGet(`albums/${album.id}`, {}, token);
                
                if (albumRes && albumRes.tracks && albumRes.tracks.items) {
                    setProgress({ current: 0, total: albumRes.tracks.items.length });
                    const tracksToSave: TrackData[] = [];
    
                    for (let i = 0; i < albumRes.tracks.items.length; i++) {
                        const track = albumRes.tracks.items[i];
                        setLoadingTrack(track.name);
                        setProgress(prev => ({ ...prev, current: i + 1 }));
                        
                        const trackDetails = await getTrackDetails(track.id);
                        if (trackDetails) {
                            const trackData: TrackData = {
                                uuid: track.id,
                                libraryUuid: '', // Will be set after album save
                                trackName: track.name,
                                trackNumber: track.track_number,
                                durationMs: track.duration_ms,
                                popularity: trackDetails.popularity,
                                playCount: 0,
                                rating: 0,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                            tracksToSave.push(trackData);
                        }
                    }
                    setTracks(tracksToSave);
                    setLoadingTrack(null);
                }
            }
    
            setDetailedAlbum(detailedData);
            setShowAlbumsList(false);
            setShowRatingInput(true);
        }
    };

    const handleSave = async () => {
        if (detailedAlbum) {
            const libraryData: LibraryData = {
                ...detailedAlbum,
                rating: personalRating,
                comments: '',
            };
    
            // Save the album first to get its UUID
            const savedAlbum = await onSaveToLibrary(libraryData);
    
            // Now save all tracks with the album's UUID
            for (const track of tracks) {
                const trackWithAlbumUuid: TrackData = {
                    ...track,
                    libraryUuid: savedAlbum.uuid!,
                };
                
                try {
                    await databaseManagers.music.upsert(trackWithAlbumUuid);
                } catch (error) {
                    console.error(`Error saving track ${track.trackName}:`, error);
                }
            }

            // Reset everything
            setQuery('');
            setAlbums([]);
            setPersonalRating(0);
            setShowSearch(true);
            setShowAlbumsList(false);
            setShowRatingInput(false);
            setDetailedAlbum(null);
            setTracks([]);

            Toast.show({
                text1: `Album "${detailedAlbum.title}" saved to library`,
                type: 'success',
            });
    
            onClose();
        }
    };

    const handleSaveCustomAlbumFromQuery = () => {
        if (!query) {
            Alert.alert('Error', 'Please enter an album name.');
            return;
        }
    
        //@ts-ignore we dont pass id
        const libraryData: LibraryData = {
            title: query,
            rating: 0, // Default rating, adjust as needed
            comments: '',
            seen: new Date().toISOString(),
            type: 'music',
            genre: 'custom',
            creator: 'custom',
            releaseYear: new Date().getFullYear().toString(),
            mediaImage: 'custom',
            finished: 1,
        };
    
        onSaveToLibrary(libraryData);
    
        // Reset states after saving
        setQuery('');
        onClose(); // Close modal after saving
    };

    // Add this loading indicator component
    const renderLoadingIndicator = () => {
        if (!loadingTrack) return null;
        
        return (
            <View style={styles.loadingContainer}>
                <Text style={[designs.text.text, styles.loadingText]}>
                    Fetching track {progress.current} of {progress.total}
                </Text>
                <Text style={[designs.text.text, styles.loadingTrackName]}>
                    "{loadingTrack}"
                </Text>
            </View>
        );
    };

    return (
        <>
            <UniversalModal
                isVisible={isOpen}
                onClose={onClose}
            >
                {showSearch && (
                    <>
                        <Text style={designs.modal.title}>Search for an Album</Text>
                        <TextInput
                            style={[designs.text.input, { marginBottom: 40, marginTop: 10 }]}
                            value={query}
                            onChangeText={setQuery}
                            onEndEditing={(e) => setQuery(e.nativeEvent.text.trim())}
                            placeholder="Enter album title"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={handleSearch}
                        />
                        <PrimaryButton
                            text="Search"
                            onPress={handleSearch}
                        />
                        <View style={{ height: 20 }}/>
                        <PrimaryButton
                            text="Add Custom Album"
                            onPress={handleSaveCustomAlbumFromQuery}
                        />
                    </>
                )}
                {showAlbumsList && !loadingTrack && (
                    <View>
                        {albums.map((item) => (
                            <Pressable 
                                key={item.id}
                                style={styles.albumItem} 
                                onPress={() => handleSelectAlbum(item)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.images[0]?.url }} style={styles.albumImage} />
                                    <View style={{ flexDirection: 'column'}}>
                                        <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{item.name}</Text>
                                        <Text style={designs.text.text}>{item.artists[0].name}</Text>
                                        <Text style={designs.text.text}>({new Date(item.release_date).getFullYear()})</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
                {loadingTrack && renderLoadingIndicator()}
                {showRatingInput && detailedAlbum && !loadingTrack && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={designs.modal.title}>Rate this album</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable
                                    key={star}
                                    onPress={() => setPersonalRating(star)}
                                    style={{ padding: 5 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faStar} 
                                        size={20} 
                                        color={star <= personalRating ? themeColors.textColor : 'gray'} 
                                    />
                                </Pressable>
                            ))}
                        </View>
                        <PrimaryButton
                            text="Save to Library"
                            onPress={handleSave}
                        />
                    </View>
                )}
                {error && 
                    <AlertModal
                        isVisible={!!error}
                        title="Error"
                        message={error || ''}
                        onConfirm={() => setError(null)}
                        singleButton
                    />
                }
            </UniversalModal>
        </>
    );
};

export default MusicSearchModal;

const getStyles = (theme: any) => StyleSheet.create({
    albumItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 5,
    },
    albumImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginBottom: 10,
        textAlign: 'center',
    },
    loadingTrackName: {
        fontStyle: 'italic',
        textAlign: 'center',
        color: theme.textColorFaded || 'gray',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: theme.cardColor,
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
    },
});