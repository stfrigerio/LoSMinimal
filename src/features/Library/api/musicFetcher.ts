import { useSpotifyAuth } from './spotifyAuth';

import { LibraryData } from '../../../types/Library';

const API_URL = "https://api.spotify.com/v1/";

export interface Album {
    id: string;
    name: string;
    artists: { name: string }[];
    release_date: string;
    total_tracks: number;
    images: { url: string }[];
    genres: string[];
}

export const useSpotifyFetcher = () => {
    const { getAccessToken, clearStoredTokens } = useSpotifyAuth();

    const fetchAlbums = async (query: string): Promise<Album[]> => {
        try {
            const token = await getAccessToken();
            if (!token) {
                console.log('No token available');
                return [];
            }

            const searchResults = await apiGet('search', { q: query, type: 'album' }, token);
            if (!searchResults || !searchResults.albums || !searchResults.albums.items.length) {
                return [];
            }

            return searchResults.albums.items;
        } catch (error) {
            console.error("Error fetching albums:", error);
            return [];
        }
    };

    const getAlbumById = async (id: string): Promise<LibraryData | null> => {
        try {
            const token = await getAccessToken();
            if (!token) {
                console.log('No token available');
                return null;
            }
    
            const albumRes = await apiGet(`albums/${id}`, {}, token);
            if (!albumRes) {
                return null;
            }

            const trackNames = albumRes.tracks?.items.map((track: { name: string }) => track.name).join(' | ');
    
            // Fetch the first artist's details
            const artistId = albumRes.artists[0]?.id;
            let genres: string[] = [];
            if (artistId) {
                const artistRes = await apiGet(`artists/${artistId}`, {}, token);
                if (artistRes && artistRes.genres) {
                    genres = artistRes.genres;
                }
            }
    
            //@ts-ignore we dont wanna save the id here as its a string
            return {
                // id: albumRes.id,
                seen: new Date().toISOString(),
                title: albumRes.name,
                type: 'music',
                genre: genres.join(', '), // Join all genres into a single string
                creator: albumRes.artists.map((artist: { name: string }) => artist.name).join(', '),
                releaseYear: new Date(albumRes.release_date).getFullYear().toString(),
                rating: 0, 
                comments: '',
                mediaImage: albumRes.images[0]?.url || '',
                finished: 1,
                cast: trackNames,
            };
        } catch (error) {
            console.error("Error fetching album:", error);
            return null;
        }
    };

    const apiGet = async (endpoint: string, params: Record<string, string>, token: string): Promise<any> => {
        let finalURL = new URL(API_URL + endpoint);
        Object.keys(params).forEach(key => finalURL.searchParams.append(key, params[key]));
        try {
            const response = await fetch(finalURL.href, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                // Add more detailed error logging
                const errorBody = await response.text();
                console.error("Spotify API Error:", {
                    status: response.status,
                    statusText: response.statusText,
                    endpoint: endpoint,
                    errorBody: errorBody,
                    headers: Object.fromEntries(response.headers.entries())
                });
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API Request Failed:", error);
            return null;
        }
    };

    const getTrackDetails = async (trackId: string) => {
        try {
            const token = await getAccessToken();
            if (!token) {
                console.log('No token available');
                return null;
            }

            const trackRes = await apiGet(`tracks/${trackId}`, {}, token);
            if (!trackRes) {
                console.log("Track not found");
                return null;
            }

            // Return comprehensive track data
            return {
                // Basic track info
                id: trackRes.id,
                name: trackRes.name,
                duration_ms: trackRes.duration_ms,
                popularity: trackRes.popularity,
                trackNumber: trackRes.track_number,
            };
        } catch (error) {
            console.error("Error fetching track:", error);
            return null;
        }
    };

    return {
        fetchAlbums,
        getAlbumById,
        getTrackDetails,
        apiGet,
        getAccessToken,
        clearStoredTokens
    };
};