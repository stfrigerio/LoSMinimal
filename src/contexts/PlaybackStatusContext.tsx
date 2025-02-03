// PlaybackStatusContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PlaybackStatusContextType {
    isPlaying: boolean;
    duration: number;
    position: number;
    setPlaybackStatus: (status: { isPlaying: boolean; duration: number; position: number }) => void;
}

const PlaybackStatusContext = createContext<PlaybackStatusContextType | undefined>(undefined);

export const PlaybackStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    const setPlaybackStatus = ({ isPlaying, duration, position }: { isPlaying: boolean; duration: number; position: number }) => {
        setIsPlaying(isPlaying);
        setDuration(duration);
        setPosition(position);
    };

    return (
        <PlaybackStatusContext.Provider value={{ isPlaying, duration, position, setPlaybackStatus }}>
            {children}
        </PlaybackStatusContext.Provider>
    );
};

export const usePlaybackStatus = () => {
    const context = useContext(PlaybackStatusContext);
    if (!context) {
        throw new Error('usePlaybackStatus must be used within a PlaybackStatusProvider');
    }
    return context;
};
