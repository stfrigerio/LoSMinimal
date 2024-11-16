import { useState, useEffect } from 'react';

import { databaseManagers } from '@/database/tables';
import { autoLinkTracks } from '../helpers/autoLinkTracks';

import { ExtendedTrackData, Album, TrackDetailsState } from '../types';
import { TrackData } from '@/src/types/Library';

export const useTrackManagement = (selectedAlbum: Album | null) => {
    const [trackDetails, setTrackDetails] = useState<TrackDetailsState>({
        details: {},
        orderedSongs: []
    });
    const [selectedSongForLinking, setSelectedSongForLinking] = useState<string | null>(null);
    const [availableTracks, setAvailableTracks] = useState<ExtendedTrackData[]>([]);
    const [alertModal, setAlertModal] = useState<{
        isVisible: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isVisible: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    useEffect(() => {
        if (selectedAlbum) {
            loadTrackDetails();
            loadAvailableTracks();
        }
    }, [selectedAlbum]);

    const loadTrackDetails = async () => {
        if (!selectedAlbum?.uuid) return;
        
        try {
            // Start with the actual files from the folder
            const filesInFolder = selectedAlbum.songs;
    
            // Get DB tracks for additional data
            const dbTracks = await databaseManagers.music.getMusicTracks({ 
                libraryUuid: selectedAlbum.uuid 
            });
    
            // Create details mapping from filename to trackData
            const details: { [key: string]: TrackData } = {};
            dbTracks.forEach(track => {
                if (track.fileName) {
                    details[track.fileName] = track;
                }
            });
    
            // Separate linked and unlinked files
            const linkedFiles = filesInFolder.filter(filename => details[filename]);
            const unlinkedFiles = filesInFolder.filter(filename => !details[filename]);
    
            // Sort linked files by track number
            const sortedLinkedFiles = linkedFiles.sort((a, b) => {
                const trackA = details[a];
                const trackB = details[b];
                return (trackA?.trackNumber || 0) - (trackB?.trackNumber || 0);
            });
    
            // Combine sorted linked files with unlinked files at the bottom
            const orderedSongs = [...sortedLinkedFiles, ...unlinkedFiles];
    
            setTrackDetails({
                details,
                orderedSongs
            });
        } catch (error) {
            console.error('Error loading track details:', error);
        }
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
                setAlertModal({
                    isVisible: true,
                    title: 'Auto-link Complete',
                    message: `Successfully linked ${result.linkedCount} tracks.`,
                    onConfirm: () => {
                        setAlertModal(prev => ({ ...prev, isVisible: false }));
                        loadTrackDetails();
                        loadAvailableTracks();
                    }
                });
            } else {
                setAlertModal({
                    isVisible: true,
                    title: 'Auto-link Failed',
                    message: result.errors?.join('\n') || 'Unknown error occurred',
                    onConfirm: () => setAlertModal(prev => ({ ...prev, isVisible: false }))
                });
            }
        } catch (error) {
            console.error('Error during auto-link:', error);
            setAlertModal({
                isVisible: true,
                title: 'Error',
                message: 'Failed to auto-link tracks',
                onConfirm: () => setAlertModal(prev => ({ ...prev, isVisible: false }))
            });
        }
    };

    const handleUnlinkAll = async () => {
        if (!selectedAlbum?.uuid) return;

        try {
            const tracks = await databaseManagers.music.getMusicTracks({ 
                libraryUuid: selectedAlbum.uuid 
            });

            // Update all tracks to remove their fileName
            for (const track of tracks) {
                await databaseManagers.music.upsert({
                    ...track,
                    fileName: null
                });
            }

            setAlertModal({
                isVisible: true,
                title: 'Unlink Complete',
                message: `Successfully unlinked ${tracks.length} tracks.`,
                onConfirm: () => {
                    setAlertModal(prev => ({ ...prev, isVisible: false }));
                    loadTrackDetails();
                    loadAvailableTracks();
                }
            });
        } catch (error) {
            console.error('Error unlinking tracks:', error);
            setAlertModal({
                isVisible: true,
                title: 'Error',
                message: 'Failed to unlink tracks',
                onConfirm: () => setAlertModal(prev => ({ ...prev, isVisible: false }))
            });
        }
    };

    return {
        trackDetails,
        selectedSongForLinking,
        setSelectedSongForLinking,
        availableTracks,
        loadAvailableTracks,
        loadTrackDetails,
        handleAutoLink,
        alertModal,
        handleUnlinkAll
    };
};
