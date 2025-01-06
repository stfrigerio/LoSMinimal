import { TrackData, LibraryData } from "@/src/types/Library";

import { Album } from '@/src/features/Library/api/musicFetcher';
import { useSpotifyFetcher } from '@/src/features/Library/api/musicFetcher';
import { databaseManagers } from '@/database/tables';

export interface AlbumSelectionProps {
    selectedAlbum: Album;
    setLoadingTrack: (track: string | null) => void;
    setProgress: (progress: { current: number; total: number }) => void;
    refresh: () => void;
    setShowAlbumSelector: (show: boolean) => void;
    item: LibraryData;
    fetcher: ReturnType<typeof useSpotifyFetcher>;
}

interface RefetchTracksProps {
    item: LibraryData;
    setSearchResults: (albums: Album[]) => void;
    setShowAlbumSelector: (show: boolean) => void;
    fetcher: ReturnType<typeof useSpotifyFetcher>;
}

export const handleRefetchTracks = async ({ 
    item, 
    setSearchResults, 
    setShowAlbumSelector,
    fetcher
}: RefetchTracksProps) => {
    try {
        const albums = await fetcher.fetchAlbums(item.title);
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

export const handleAlbumSelection = async ({
    selectedAlbum, 
    setLoadingTrack, 
    setProgress, 
    refresh, 
    setShowAlbumSelector, 
    item,
    fetcher
}: AlbumSelectionProps) => {
    try {
        const token = await fetcher.getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }

        const albumRes = await fetcher.apiGet(`albums/${selectedAlbum.id}`, {}, token);

        if (albumRes && albumRes.tracks && albumRes.tracks.items) {
            setProgress({ current: 0, total: albumRes.tracks.items.length });
            const tracksToSave: TrackData[] = [];

            for (let i = 0; i < albumRes.tracks.items.length; i++) {
                const track = albumRes.tracks.items[i];
                setLoadingTrack(track.name);
                setProgress({ current: i + 1, total: albumRes.tracks.items.length });
                
                const trackDetails = await fetcher.getTrackDetails(track.id);
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
                const trackDetails = await fetcher.getTrackDetails(track.id);
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