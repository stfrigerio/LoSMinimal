import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import { Audio, AVPlaybackStatus, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import { databaseManagers } from '@/database/tables';
import { TrackData } from '@/src/types/Library';
import { usePlaybackStatus } from './PlaybackStatusContext';

interface MusicPlayerContextType {
    currentSong: string | null;
    currentTrackData: TrackData | null;
    albumName: string | null;
    songs: string[];
    updateTrackRating: (rating: number) => Promise<void>;
    playSound: (albumName: string, songName: string, albumSongs: string[]) => void;
    pauseSound: () => void;
    resumeSound: () => void;
    playNextSong: () => void;
    playPreviousSong: () => void;
    seekTo: (value: number) => void;
    stopSound: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [albumName, setAlbumName] = useState<string | null>(null);
    const [songs, setSongs] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentTrackData, setCurrentTrackData] = useState<TrackData | null>(null);

    // Import the setter from PlaybackStatusContext
    const { setPlaybackStatus } = usePlaybackStatus();

    // Refs for state management
    const songsRef = useRef<string[]>([]);
    const albumNameRef = useRef<string | null>(null);
    const currentIndexRef = useRef<number>(0);
    const playNextSongRef = useRef<() => Promise<void>>();
    const isLoadingRef = useRef<boolean>(false);

    useEffect(() => {
        const initAudio = async () => {
            try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            } catch (error) {
                console.error('Failed to initialize audio:', error);
            }
        };

        initAudio();
    }, []);

    // Update refs when state changes
    useEffect(() => {
        songsRef.current = songs;
        albumNameRef.current = albumName;
        currentIndexRef.current = currentIndex;
    }, [songs, albumName, currentIndex]);

    const stopSound = useCallback(async () => {
        if (!sound) return;

        try {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            // Reset playback status
            setPlaybackStatus({ isPlaying: false, duration: 0, position: 0 });
            setCurrentSong(null);
            setAlbumName(null);
            setSongs([]);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error stopping sound:', error);
        }
    }, [sound, setPlaybackStatus]);

    const loadSound = useCallback(
        async (albumName: string, songName: string): Promise<void> => {
            try {
                const songUri = `${FileSystem.documentDirectory}Music/${albumName}/${songName}`;
                const fileInfo = await FileSystem.getInfoAsync(songUri);
                if (!fileInfo.exists) {
                    console.error(`File does not exist: ${songUri}`);
                    setTimeout(() => playNextSongRef.current?.(), 1000);
                    return;
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: songUri },
                    {
                        shouldPlay: true,
                        progressUpdateIntervalMillis: 100, // high-frequency updates
                        positionMillis: 0,
                        volume: 1.0,
                        rate: 1.0,
                        shouldCorrectPitch: true,
                    },
                    onPlaybackStatusUpdate
                );
    
                if (sound) {
                    await sound.unloadAsync();
                }
    
                setSound(newSound);
                setCurrentSong(songName);
            } catch (error) {
                console.error('Failed to load sound:', error);
                setTimeout(() => playNextSongRef.current?.(), 1000);
            }
        },
        [sound]
    );

    const updateTrackRating = useCallback(
        async (rating: number) => {
            if (!currentTrackData) return;
            try {

                const updatedTrack = {
                    ...currentTrackData,
                    rating,
                    updatedAt: new Date().toISOString(),
                };

                await databaseManagers.music.upsert(updatedTrack);
                setCurrentTrackData(updatedTrack);

            } catch (error) {
                console.error('Error updating track rating:', error);
                throw error;
            }
        },
        [currentTrackData]
    );

    const incrementPlayCount = useCallback(async () => {
        if (!currentTrackData) return;
        try {
            let tracks = await databaseManagers.music.getMusicTracks({ fileName: currentTrackData.fileName });
            const latestTrackData = tracks?.[0] || currentTrackData;
            const updatedTrack = {
                ...latestTrackData,
                playCount: (latestTrackData.playCount || 0) + 1,
                updatedAt: new Date().toISOString(),
            };
            await databaseManagers.music.upsert(updatedTrack);
            setCurrentTrackData(updatedTrack);
        } catch (error) {
            console.error('Error updating play count:', error);
        }
    }, [currentTrackData]);

    const fetchTrackData = useCallback(async (songName: string) => {
        try {
            let tracks = await databaseManagers.music.getMusicTracks({ fileName: songName });
            if (!tracks?.length) {
                const trackName = songName.split('.').slice(0, -1).join('.');
                tracks = await databaseManagers.music.getMusicTracks({ trackName });
            }
            setCurrentTrackData(tracks?.[0] || null);
        } catch (error) {
            console.error('Error fetching track data:', error);
            setCurrentTrackData(null);
        }
    }, []);

    const playNextSong = useCallback(async () => {
        if (isLoadingRef.current || songsRef.current.length === 0) return;
        const nextIndex = (currentIndexRef.current + 1) % songsRef.current.length;
        const nextSong = songsRef.current[nextIndex];
        setCurrentIndex(nextIndex);
        setCurrentSong(nextSong);
        if (albumNameRef.current) {
            isLoadingRef.current = true;
            await fetchTrackData(nextSong);
            await loadSound(albumNameRef.current, nextSong);
            isLoadingRef.current = false;
        } else {
            console.error('Album name is null');
            stopSound();
        }
    }, [loadSound, stopSound, fetchTrackData]);

    useEffect(() => {
        playNextSongRef.current = playNextSong;
    }, [playNextSong]);

    const playPreviousSong = useCallback(async () => {
        if (isLoadingRef.current || currentIndexRef.current === 0) return;
        const prevIndex = currentIndexRef.current - 1;
        const prevSong = songsRef.current[prevIndex];
        setCurrentIndex(prevIndex);
        setCurrentSong(prevSong);
        if (albumNameRef.current) {
            isLoadingRef.current = true;
            await fetchTrackData(prevSong);
            await loadSound(albumNameRef.current, prevSong);
            isLoadingRef.current = false;
        } else {
            console.error('Album name is null');
            stopSound();
        }
    }, [loadSound, stopSound, fetchTrackData]);

    const onPlaybackStatusUpdate = useCallback(
        (status: AVPlaybackStatus) => {
            if (!status.isLoaded) {
                if (status.error) {
                    console.error('Playback error:', status.error);
                    playNextSongRef.current?.();
                }
                return;
            }
            // Update the playback status via the separate context
            setPlaybackStatus({
                isPlaying: status.isPlaying,
                duration: status.durationMillis || 0,
                position: status.positionMillis || 0,
            });

            if (status.didJustFinish && !status.isLooping) {
                incrementPlayCount().then(() => {
                    playNextSongRef.current?.();
                });
            }
        },
        [incrementPlayCount, setPlaybackStatus]
    );

    const playSoundHandler = useCallback(
        async (newAlbumName: string, songName: string, newAlbumSongs: string[]) => {
            const newIndex = newAlbumSongs.indexOf(songName);
            if (newIndex === -1) return;
            setCurrentSong(songName);
            setAlbumName(newAlbumName);
            setSongs(newAlbumSongs);
            setCurrentIndex(newIndex);
            await fetchTrackData(songName);
            await loadSound(newAlbumName, songName);
        },
        [loadSound, fetchTrackData]
    );

    const pauseSound = useCallback(async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
                // The playback status will be updated in onPlaybackStatusUpdate
            }
        } catch (error) {
            console.error('Error pausing sound:', error);
        }
    }, [sound]);

    const resumeSound = useCallback(async () => {
        try {
            if (sound) {
                await sound.playAsync();
                // onPlaybackStatusUpdate will update status
            }
        } catch (error) {
            console.error('Error resuming sound:', error);
        }
    }, [sound]);

    const seekTo = useCallback(async (value: number) => {
        try {
            if (sound) {
                await sound.setPositionAsync(value);
            }
        } catch (error) {
            console.error('Error seeking sound:', error);
        }
    }, [sound]);

    const contextValue = useMemo(
        () => ({
            currentSong,
            albumName,
            songs,
            playSound: playSoundHandler,
            pauseSound,
            resumeSound,
            playNextSong,
            playPreviousSong,
            seekTo,
            stopSound,
            currentTrackData,
            updateTrackRating,
        }),
        [
            currentSong,
            albumName,
            songs,
            playSoundHandler,
            pauseSound,
            resumeSound,
            playNextSong,
            playPreviousSong,
            seekTo,
            stopSound,
            currentTrackData,
            updateTrackRating,
        ]
    );

    return (
        <MusicPlayerContext.Provider value={contextValue}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};
