import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faPlay, faLink, faStar, faMagicWandSparkles, faUnlink, faRefresh } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMusicPlayer } from '@/src/contexts/MusicPlayerContext';
import { useTrackManagement } from '@/src/features/Music/hooks/useTrackManagement';
import { musicFolderPath } from '@/src/features/Library/helpers/LibrarySettingsHelper';
import { LibraryData, TrackData } from '@/src/types/Library';
import LinkTrackModal from '@/src/features/Music/modals/LinkTrackModal';
import { databaseManagers } from '@/database/tables';
import { Album } from '@/src/features/Music/types';
import AlertModal from '@/src/components/modals/AlertModal';
import { useSpotifyFetcher } from '@/src/features/Library/api/musicFetcher'
import { UniversalModal } from '@/src/components/modals/UniversalModal';

interface DetailedMusicViewProps {
    item: LibraryData;
    album: Album;
    updateItem: (item: LibraryData) => Promise<void>;
}

export const DetailedMusicView = ({ item, album, updateItem }: DetailedMusicViewProps) => {
    const { themeColors, designs } = useThemeStyles();
    const { playSound } = useMusicPlayer();
    const styles = getStyles(themeColors);
    const [dbOnlyTracks, setDbOnlyTracks] = React.useState<TrackData[]>([]);
    const [showAlbumSelector, setShowAlbumSelector] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loadingTrack, setLoadingTrack] = useState<string | null>(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const { 
        trackDetails, 
        availableTracks, 
        loadTrackDetails, 
        loadAvailableTracks, 
        handleAutoLink,
        handleUnlinkAll, 
        alertModal
    } = useTrackManagement(album);

    const { getAccessToken, apiGet, getTrackDetails, fetchAlbums } = useSpotifyFetcher();

    const [selectedSongForLinking, setSelectedSongForLinking] = React.useState<string | null>(null);

    const refresh = () => {
        loadTrackDetails();
        loadAvailableTracks();
        const loadDbTracks = async () => {
            try {
                let dbTracks: TrackData[] = [];
                if (album) {
                    dbTracks = await databaseManagers.music.getMusicTracks({ 
                        libraryUuid: album.uuid 
                    });
                } else {
                    dbTracks = await databaseManagers.music.getMusicTracks({ 
                        libraryUuid: item.uuid 
                    });
                }
                
                // Filter for tracks that exist only in DB (no fileName)
                const dbOnlyTracks = dbTracks.filter(track => !track.fileName);
                setDbOnlyTracks(dbOnlyTracks);
            } catch (error) {
                console.error('Error loading DB tracks:', error);
            }
        };
        loadDbTracks();
    };

    useEffect(() => {
        refresh();
    }, [item]);
    
    const handlePlaySound = (songName: string) => {
        // const albumPath = `${musicFolderPath}/${item.title}`;
        // playSound(albumPath, songName, trackDetails.orderedSongs);
        console.log('playSound', songName);
    };

    const handleLinkTrack = async (track: TrackData) => {
        if (!selectedSongForLinking) return;
        
        try {
            const dataToSave = {
                ...track,
                fileName: selectedSongForLinking
            };
            
            await databaseManagers.music.upsert(dataToSave);
            setSelectedSongForLinking(null);
            loadTrackDetails();
        } catch (error) {
            console.error('Error linking track:', error);
        }
    };

    const handleRefetchTracks = async () => {
        try {
            const albums = await fetchAlbums(item.title);
            if (albums.length === 0) {
                console.log('No matching albums found on Spotify.');
                return;
            }
            setSearchResults(albums);
            setShowAlbumSelector(true);
        } catch (error) {
            console.error('Error fetching albums:', error);
        }
    };

    const handleAlbumSelection = async (selectedAlbum: Album) => {
        try {
            const token = await getAccessToken();
            if (!token) {
                throw new Error('No access token available');
            }
    
            const albumRes = await apiGet(`albums/${selectedAlbum.id}`, {}, token);
    
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

                for (const track of albumRes.tracks.items) {
                    const trackDetails = await getTrackDetails(track.id);
                    if (trackDetails) {
                        const trackData: TrackData = {
                            uuid: track.id,
                            libraryUuid: item.uuid!,
                            trackName: track.name,
                            trackNumber: track.track_number,
                            durationMs: track.duration_ms,
                            popularity: trackDetails.popularity,
                            playCount: 0,
                            rating: 0,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        await databaseManagers.music.upsert(trackData);
                    }
                }
                setLoadingTrack(null);
            }
            setShowAlbumSelector(false);
            refresh();
        } catch (error) {
            console.error('Error updating tracks:', error);
            console.log('Failed to update tracks from Spotify.');
        }
    };

    const renderRating = (rating: number = 0) => (
        <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon 
                    key={star}
                    icon={faStar} 
                    size={14} 
                    color={star <= rating ? themeColors.textColor : themeColors.borderColor} 
                />
            ))}
        </View>
    );

    const onPressAutoLink = async () => {
        await handleAutoLink();
        refresh();
    };
    
    const onPressUnlinkAll = async () => {
        await handleUnlinkAll();
        refresh();
    };

    const renderLoadingIndicator = () => {        
        return (
            <View style={[
                styles.loadingContainer,
                { 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: themeColors.backgroundColor,
                    zIndex: 1000,
                    padding: 20,
                }
            ]}>
                <Text style={[
                    designs.text.text, 
                    styles.loadingText,
                    { fontSize: 18, fontWeight: 'bold' }
                ]}>
                    Fetching track {progress.current} of {progress.total}
                </Text>
                <Text style={[
                    designs.text.text, 
                    styles.loadingTrackName,
                    { fontSize: 16 }
                ]}>
                    "{loadingTrack}"
                </Text>
            </View>
        );
    };
    

    return (
        <>
            <Text style={styles.sectionTitle}>Tracks</Text>
            <View style={styles.autoLinkContainer}>
                <Pressable 
                    style={styles.autoLinkButton}
                    onPress={onPressAutoLink}
                >
                    {({ pressed }) => (
                        <FontAwesomeIcon 
                            icon={faMagicWandSparkles} 
                            size={18} 
                            color={pressed ? themeColors.accentColor : themeColors.textColorItalic} 
                        />
                    )}
                </Pressable>
                <Pressable 
                    onPress={onPressUnlinkAll}
                >
                    {({ pressed }) => (
                        <FontAwesomeIcon 
                            icon={faUnlink} 
                            size={18} 
                            color={pressed ? themeColors.accentColor : themeColors.textColorItalic} 
                        />
                    )}
                </Pressable>
                <Pressable 
                    onPress={handleRefetchTracks}
                >
                    {({ pressed }) => (
                        <FontAwesomeIcon 
                            icon={faRefresh} 
                            size={18} 
                            color={pressed ? themeColors.accentColor : themeColors.textColorItalic} 
                        />
                    )}
                </Pressable>
            </View>
            <View style={styles.tracksContainer}>
                {trackDetails.orderedSongs.map((fileName, index) => {
                    const trackData = trackDetails.details[fileName];
                    const songName = fileName.split('.').slice(0, -1).join('.');

                    return (
                        <Pressable 
                            key={fileName}
                            style={({ pressed }) => [
                                styles.trackItemContainer,
                                pressed && styles.trackItemPressed
                            ]}
                            onPress={() => handlePlaySound(fileName)}
                        >
                            <View style={styles.trackIconContainer}>
                                <FontAwesomeIcon 
                                    icon={faMusic} 
                                    size={16} 
                                    color={themeColors.textColorItalic} 
                                />
                                <Text style={styles.trackNumber}>
                                    {trackData?.trackNumber?.toString().padStart(2, '0') || '--'}
                                </Text>
                            </View>
                            <View style={styles.trackDetails}>
                                <Text style={styles.trackName}>{songName}</Text>
                                {trackData ? (
                                    <View style={styles.trackMetadata}>
                                        {renderRating(trackData.rating || 0)}
                                        <Text style={styles.playCount}>
                                            Plays: {trackData.playCount || 0}
                                        </Text>
                                    </View>
                                ) : (
                                    <Pressable 
                                        style={styles.linkButton}
                                        onPress={() => setSelectedSongForLinking(fileName)}
                                    >
                                        <FontAwesomeIcon 
                                            icon={faLink} 
                                            size={14} 
                                            color={themeColors.textColorItalic} 
                                        />
                                        <Text style={styles.linkText}>Link to track</Text>
                                    </Pressable>
                                )}
                            </View>
                            <FontAwesomeIcon 
                                icon={faPlay} 
                                size={16} 
                                color={themeColors.textColorItalic} 
                            />
                        </Pressable>
                    );
                })}
                {dbOnlyTracks.map((track) => (
                    <Pressable 
                        key={`db_${track.uuid}`}
                        style={[
                            styles.trackItemContainer,
                            styles.dbTrackContainer
                        ]}
                    >
                        <View style={styles.trackIconContainer}>
                            <FontAwesomeIcon 
                                icon={faMusic} 
                                size={16} 
                                color={themeColors.textColorItalic} 
                            />
                            <Text style={styles.trackNumber}>
                                {track.trackNumber?.toString().padStart(2, '0') || '--'}
                            </Text>
                        </View>
                        <View style={styles.trackDetails}>
                            <Text style={[styles.trackName, styles.dbTrackName]}>
                                {track.trackName || 'Unknown Track'}
                            </Text>
                            <View style={styles.trackMetadata}>
                                {renderRating(track.rating || 0)}
                                <Text style={styles.playCount}>
                                    Plays: {track.playCount || 0}
                                </Text>
                                <Text style={styles.dbIndicator}>
                                    Database Only
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>
            {showAlbumSelector && (
                <UniversalModal
                    isVisible={showAlbumSelector}
                    onClose={() => setShowAlbumSelector(false)}
                >
                    <Text style={[designs.modal.title, { marginBottom: 20 }]}>Select Matching Album</Text>
                    <View>
                        {searchResults.map((item) => (
                            <Pressable 
                                key={item.id}
                                style={styles.albumItem} 
                                onPress={() => handleAlbumSelection(item)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{ uri: item.images[0]?.url }} style={styles.albumImage} />
                                <View style={{ flexDirection: 'column'}}>
                                        <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{item.name}</Text>
                                        <Text style={designs.text.text}>{item.artists[0].name}</Text>
                                        <Text style={designs.text.text}>
                                            ({new Date(item.release_date).getFullYear()})
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                    {loadingTrack && renderLoadingIndicator()}
                </UniversalModal>
            )}
            <LinkTrackModal 
                isVisible={!!selectedSongForLinking}
                onClose={() => setSelectedSongForLinking(null)}
                fileName={selectedSongForLinking || ''}
                availableTracks={availableTracks}
                onLinkTrack={handleLinkTrack}
            />
            {alertModal.isVisible && (
                <AlertModal 
                    isVisible={alertModal.isVisible}
                    title={alertModal.title}
                    message={alertModal.message}
                    onConfirm={alertModal.onConfirm}
                    singleButton={true}
                />
            )}
        </>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: themeColors.textColorBold,
        marginBottom: 16,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    tracksContainer: {
        paddingHorizontal: 0,
    },
    trackItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: themeColors.backgroundSecondary,
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    trackItemPressed: {
        backgroundColor: themeColors.accentColor,
        transform: [{ scale: 0.98 }],
    },
    trackIconContainer: {
        width: 30,
        marginRight: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    trackDetails: {
        flex: 1,
        marginRight: 10,
    },  
    trackName: {
        fontSize: 16,
        color: themeColors.textColor,
        marginBottom: 4,
    },
    trackNumber: {
        fontSize: 14,
        color: themeColors.textColorItalic,
        fontFamily: 'monospace',
    },
    trackMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    playCount: {
        fontSize: 12,
        color: themeColors.textColorItalic,
    },
    duration: {
        fontSize: 12,
        color: themeColors.textColorItalic,
        fontFamily: 'monospace',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
    },
    linkText: {
        fontSize: 12,
        color: themeColors.textColorItalic,
    },
    dbTrackContainer: {
        opacity: 0.7,
        borderStyle: 'dashed',
    },
    dbTrackName: {
        fontStyle: 'italic',
    },
    dbIndicator: {
        fontSize: 10,
        color: themeColors.textColorItalic,
        backgroundColor: themeColors.borderColor,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    autoLinkButton: {
        zIndex: 1000,
    },
    autoLinkContainer: {
        // borderWidth: 1,
        alignSelf: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        gap: 30,
    },
    albumItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: themeColors.backgroundSecondary,
        borderBottomWidth: 1,
        borderColor: themeColors.borderColor,
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
        backgroundColor: themeColors.backgroundColor,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        margin: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColorBold,
    },
    loadingTrackName: {
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: 16,
        color: themeColors.textColor,
    },
});