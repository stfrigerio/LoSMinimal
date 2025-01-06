import React, { useEffect, useState } from 'react';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMusicPlayer } from '@/src/contexts/MusicPlayerContext';
import { useTrackManagement } from '@/src/features/Music/hooks/useTrackManagement';
import { musicFolderPath } from '@/src/features/Library/helpers/LibrarySettingsHelper';
import { LibraryData, TrackData } from '@/src/types/Library';
import { databaseManagers } from '@/database/tables';
import { Album } from '@/src/features/Music/types';
import { useSpotifyFetcher } from '@/src/features/Library/api/musicFetcher';

import AlertModal from '@/src/components/modals/AlertModal';
import LinkTrackModal from '@/src/features/Music/modals/LinkTrackModal';

import { 
    TracksHeader, 
    AlbumSelector,
    TracksContainer
} from './components';

import { 
    handleLinkTrack, 
    handleAlbumSelection,
} from './helpers';

interface DetailedMusicViewProps {
    item: LibraryData;
    album: Album;
    updateItem: (item: LibraryData) => Promise<void>;
}

export const DetailedMusicView = ({ item, album, updateItem }: DetailedMusicViewProps) => {
    const { playSound } = useMusicPlayer();
    // const { themeColors, designs } = useThemeStyles();
    // const styles = getStyles(themeColors);
    const [dbOnlyTracks, setDbOnlyTracks] = React.useState<TrackData[]>([]);
    const [showAlbumSelector, setShowAlbumSelector] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loadingTrack, setLoadingTrack] = useState<string | null>(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [selectedSongForLinking, setSelectedSongForLinking] = useState<string | null>(null);
    const fetcher = useSpotifyFetcher();

    const { 
        trackDetails, 
        availableTracks, 
        loadTrackDetails, 
        loadAvailableTracks, 
        handleAutoLink,
        handleUnlinkAll, 
        alertModal
    } = useTrackManagement(album);

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
        playSound(album.name, songName, trackDetails.orderedSongs);
    };

    return (
        <>
            <TracksHeader 
                handleAutoLink={handleAutoLink}
                refresh={refresh}
                handleUnlinkAll={handleUnlinkAll}
                item={item}
                setSearchResults={setSearchResults}
                setShowAlbumSelector={setShowAlbumSelector}
                fetcher={fetcher}
            />
            <TracksContainer 
                trackDetails={trackDetails}
                handlePlaySound={handlePlaySound}
                setSelectedSongForLinking={setSelectedSongForLinking}
                dbOnlyTracks={dbOnlyTracks}
            />
            <AlbumSelector 
                fetcher={fetcher}
                showAlbumSelector={showAlbumSelector}
                setShowAlbumSelector={setShowAlbumSelector}
                searchResults={searchResults}
                handleAlbumSelection={handleAlbumSelection}
                progress={progress}
                loadingTrack={loadingTrack}
                item={item}
                setLoadingTrack={setLoadingTrack}
                setProgress={setProgress}
                refresh={refresh}
            />
            <LinkTrackModal 
                isVisible={!!selectedSongForLinking}
                onClose={() => setSelectedSongForLinking(null)}
                fileName={selectedSongForLinking || ''}
                availableTracks={availableTracks}
                onLinkTrack={(track) => handleLinkTrack(track, selectedSongForLinking, setSelectedSongForLinking, loadTrackDetails)}
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