import React, { useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import AlertModal from '@/src/components/modals/AlertModal';
import { AlbumList } from './components/AlbumList';
import { SongList } from './components/SongList';
import { MusicHeader } from './components/MusicHeader';
import MusicPlayerControls from './components/MusicPlayerControls';
import LinkTrackModal from './modals/LinkTrackModal';

import { databaseManagers } from '@/database/tables';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMusicPlayer } from '@/src/contexts/MusicPlayerContext';
import { useAlbumManagement } from './hooks/useAlbumManagement';
import { useTrackManagement } from './hooks/useTrackManagement';

import { ExtendedTrackData } from './types';
import { TrackData } from '@/src/types/Library';

const Music = () => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { playSound } = useMusicPlayer();
    
    const { 
        albums, 
        selectedAlbum, 
        setSelectedAlbum 
    } = useAlbumManagement();

    const {
        trackDetails,
        selectedSongForLinking,
        setSelectedSongForLinking,
        availableTracks,
        loadAvailableTracks,
        handleAutoLink,
        loadTrackDetails,
        handleUnlinkAll,
        alertModal
    } = useTrackManagement(selectedAlbum);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (selectedAlbum) {
                    setSelectedAlbum(null);
                    return true;
                }
                return false;
            };
        
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [selectedAlbum])
    );

    const handleLinkTrack = async (selectedTrack: ExtendedTrackData) => {
        if (!selectedSongForLinking) return;
        
        try {
            const { artistName, ...trackDataToSave } = selectedTrack;
            
            const dataToSave = {
                ...trackDataToSave,
                fileName: selectedSongForLinking
            } as TrackData & { fileName: string };
            
            await databaseManagers.music.upsert(dataToSave);
            setSelectedSongForLinking(null);
            loadTrackDetails();
        } catch (error) {
            console.error('Error linking track:', error);
            Alert.alert('Error', 'Failed to link track to file');
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={[designs.text.title, { marginTop: 20 }]}>🎵 Music Library</Text>
                
                {selectedAlbum ? (
                    <>
                        <MusicHeader 
                            album={selectedAlbum}
                            onBack={() => setSelectedAlbum(null)}
                            onAutoLink={handleAutoLink}
                            onUnlinkAll={handleUnlinkAll}
                        />
                        <SongList 
                            album={selectedAlbum}
                            trackDetails={trackDetails}
                            onPlaySound={playSound}
                            onLinkTrack={(song) => {
                                loadAvailableTracks();
                                setSelectedSongForLinking(song);
                            }}
                        />
                    </>
                ) : (
                    <AlbumList 
                        albums={albums}
                        onSelectAlbum={setSelectedAlbum}
                    />
                )}

                <View style={styles.playerControlsContainer}>
                    <MusicPlayerControls screen='music'/>
                </View>

                <LinkTrackModal 
                    isVisible={!!selectedSongForLinking}
                    onClose={() => setSelectedSongForLinking(null)}
                    fileName={selectedSongForLinking || ''}
                    availableTracks={availableTracks}
                    onLinkTrack={handleLinkTrack}
                />
            </View>
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
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroundColor,
        paddingTop: 37,
    },
    playerControlsContainer: {
        padding: 20,
        paddingBottom: 30,
    },
});

export default Music;