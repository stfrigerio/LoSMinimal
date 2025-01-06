import { TrackData } from '@/src/types/Library';
import { databaseManagers } from '@/database/tables';
import { ExtendedTrackData } from '@/src/features/Music/types';

export const onPressAutoLink = async (handleAutoLink: () => Promise<void>, refresh: () => void) => {
    await handleAutoLink();
    refresh();
};

export const onPressUnlinkAll = async (handleUnlinkAll: () => Promise<void>, refresh: () => void) => {
    await handleUnlinkAll();
    refresh();
};

export const handleLinkTrack = async (
    track: ExtendedTrackData, 
    selectedSongForLinking: string | null, 
    setSelectedSongForLinking: (song: string | null) => void, 
    loadTrackDetails: () => void,
    refresh: () => void
) => {
    if (!selectedSongForLinking) return;

    // remove artistName from track
    const { artistName, ...trackWithoutArtist } = track;
    
    try {
        const dataToSave = {
            ...trackWithoutArtist,
            fileName: selectedSongForLinking
        };
        
        await databaseManagers.music.upsert(dataToSave);
        setSelectedSongForLinking(null);
        loadTrackDetails();
        refresh();
    } catch (error) {
        console.error('Error linking track:', error);
    }
};
