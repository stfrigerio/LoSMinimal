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

interface MusicPlayerContextType {
    currentSong: string | null;
    currentTrackData: TrackData | null;
    albumName: string | null;
    songs: string[];
    isPlaying: boolean;
    duration: number;
    position: number;
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [currentTrackData, setCurrentTrackData] = useState<TrackData | null>(null);

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
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);
            setCurrentSong(null);
            setAlbumName(null);
            setSongs([]);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error stopping sound:', error);
        }
    }, [sound]);

    const loadSound = useCallback(async (albumName: string, songName: string): Promise<void> => {
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
                    progressUpdateIntervalMillis: 100, // More frequent updates
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
            setIsPlaying(true);
            setCurrentSong(songName);
        } catch (error) {
            console.error('Failed to load sound:', error);
            setTimeout(() => playNextSongRef.current?.(), 1000);
        }
    }, [sound]);

    const updateTrackRating = useCallback(async (rating: number) => {
        if (!currentTrackData) return;
        
        try {
            const updatedTrack = { 
                ...currentTrackData, 
                rating,
                updatedAt: new Date().toISOString()
            };
            await databaseManagers.music.upsert(updatedTrack);
            setCurrentTrackData(updatedTrack);
        } catch (error) {
            console.error('Error updating track rating:', error);
            throw error;
        }
    }, [currentTrackData]);

    const incrementPlayCount = useCallback(async () => {
        if (!currentTrackData) return;
    
        try {
            // Fetch the latest data first to ensure we have the most recent rating
            let tracks = await databaseManagers.music.getMusicTracks({ fileName: currentTrackData.fileName });
            const latestTrackData = tracks?.[0] || currentTrackData;
    
            const updatedTrack = {
                ...latestTrackData,
                playCount: (latestTrackData.playCount || 0) + 1,
                updatedAt: new Date().toISOString()
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
            await fetchTrackData(nextSong);  // This line fetches fresh data and overwrites any recent changes
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
            await fetchTrackData(prevSong);  // Add this line
            await loadSound(albumNameRef.current, prevSong);
            isLoadingRef.current = false;
        } else {
            console.error('Album name is null');
            stopSound();
        }
    }, [loadSound, stopSound, fetchTrackData]);

    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.error('Playback error:', status.error);
                playNextSongRef.current?.();
            }
            return;
        }

        setDuration(status.durationMillis || 0);
        setPosition(status.positionMillis || 0);
        setIsPlaying(status.isPlaying);
        
        if (status.didJustFinish && !status.isLooping) {
            incrementPlayCount().then(() => {
                playNextSongRef.current?.();
            });
        }
    }, [incrementPlayCount]);

    const playSoundHandler = useCallback(async (
        newAlbumName: string,
        songName: string,
        newAlbumSongs: string[]
    ) => {
        const newIndex = newAlbumSongs.indexOf(songName);
        if (newIndex === -1) return;

        setCurrentSong(songName);
        setAlbumName(newAlbumName);
        setSongs(newAlbumSongs);
        setCurrentIndex(newIndex);

        await fetchTrackData(songName);
        loadSound(newAlbumName, songName);
    }, [loadSound, fetchTrackData]);

    const pauseSound = useCallback(async () => {
        try {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error pausing sound:', error);
        }
    }, [sound]);

    const resumeSound = useCallback(async () => {
        try {
            if (sound) {
                await sound.playAsync();
                setIsPlaying(true);
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

	// Memoize the context value to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			currentSong,
			albumName,
			songs,
			isPlaying,
			duration,
			position,
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
			isPlaying,
			duration,
			position,
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
