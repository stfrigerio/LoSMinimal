import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { databaseManagers } from '@/database/tables';
import { autoLinkTracks } from '../helpers/autoLinkTracks';

import { ExtendedTrackData, Album } from '../types';
import { TrackData } from '@/src/types/Library';

export const useTrackManagement = (selectedAlbum: Album | null) => {
    const [trackDetails, setTrackDetails] = useState<{ [key: string]: TrackData }>({});
    const [selectedSongForLinking, setSelectedSongForLinking] = useState<string | null>(null);
    const [availableTracks, setAvailableTracks] = useState<ExtendedTrackData[]>([]);

    useEffect(() => {
        if (selectedAlbum) {
            loadTrackDetails();
        }
    }, [selectedAlbum]);

    const loadTrackDetails = async () => {
        if (!selectedAlbum) return;
        
        const details: { [key: string]: TrackData } = {};
        for (const song of selectedAlbum.songs) {
            try {
                let tracks = await databaseManagers.music.getMusicTracks({ fileName: song });
                
                if (!tracks || tracks.length === 0) {
                    const trackName = song.split('.').slice(0, -1).join('.');
                    tracks = await databaseManagers.music.getMusicTracks({ trackName });
                }

                if (tracks && tracks.length > 0) {
                    const trackName = song.split('.').slice(0, -1).join('.');
                    details[trackName] = tracks[0];
                }
            } catch (error) {
                console.error('Error loading track details:', error);
            }
        }
        setTrackDetails(details);
    };

    const loadAvailableTracks = async () => {
        if (!selectedAlbum?.uuid) return;
        
        try {
            const tracks = await databaseManagers.music.getMusicTracks({ 
                libraryUuid: selectedAlbum.uuid
            });
            
            const albumDetails = await databaseManagers.library.getLibrary({
                uuid: tracks[0]?.libraryUuid
            });

            const tracksWithArtist = tracks.map(track => ({
                ...track,
                artistName: albumDetails[0]?.creator || 'Unknown Artist'
            }));

            const unlinkedTracks = tracksWithArtist.filter(track => !track.fileName);
            setAvailableTracks(unlinkedTracks);
        } catch (error) {
            console.error('Error loading available tracks:', error);
        }
    };

    const handleAutoLink = async () => {
        if (!selectedAlbum?.uuid) return;

        try {
            const result = await autoLinkTracks(
                selectedAlbum.uuid, 
                selectedAlbum.songs,
                { 
                    similarityThreshold: 0.8,
                    ignoreTrackNumbers: true,
                    ignoreCase: true
                }
            );

            if (result.success) {
                Alert.alert(
                    'Auto-link Complete', 
                    `Successfully linked ${result.linkedCount} tracks.`
                );
                loadTrackDetails();
            } else {
                Alert.alert(
                    'Auto-link Failed',
                    result.errors?.join('\n') || 'Unknown error occurred'
                );
            }
        } catch (error) {
            console.error('Error during auto-link:', error);
            Alert.alert('Error', 'Failed to auto-link tracks');
        }
    };

    return {
        trackDetails,
        selectedSongForLinking,
        setSelectedSongForLinking,
        availableTracks,
        loadAvailableTracks,
        loadTrackDetails,
        handleAutoLink
    };
}; 