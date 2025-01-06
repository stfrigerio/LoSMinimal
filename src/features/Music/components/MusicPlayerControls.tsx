import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faPlay, 
    faPause, 
    faStepForward, 
    faStepBackward, 
    faTimes, 
    faStar,
    faMusic
} from '@fortawesome/free-solid-svg-icons';
import Slider from '@react-native-community/slider';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useMusicPlayer } from '../../../contexts/MusicPlayerContext';
import { useNavigationComponents } from '../../LeftPanel/helpers/useNavigation';

interface MusicPlayerControlsProps {
    screen?: 'home' | 'music';
}

const MusicPlayerControls: React.FC<MusicPlayerControlsProps> = ({ screen = 'home' }) => {
    const {
        currentSong,
        currentTrackData,
        isPlaying,
        duration,
        position,
        pauseSound,
        resumeSound,
        playNextSong,
        playPreviousSong,
        seekTo,
        stopSound,
        updateTrackRating,
    } = useMusicPlayer();

    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { openMusic } = useNavigationComponents();

    const handleRatingChange = useCallback((rating: number) => {
        if (updateTrackRating) {
            updateTrackRating(rating).catch(console.error);
        }
    }, [updateTrackRating]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderRating = () => {
        if (!currentTrackData) return null;
        const currentRating = currentTrackData.rating || 0;
        
        return (
            <View style={[styles.ratingContainer]}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                        key={star}
                        onPress={() => handleRatingChange(star)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <FontAwesomeIcon 
                            icon={faStar} 
                            size={18} 
                            color={star <= currentRating ? themeColors.textColor : themeColors.borderColor} 
                        />
                    </Pressable>
                ))}
            </View>
        );
    };

    if (!currentSong) {
        if (screen === 'music') return null;
        
        return (
            <Pressable onPress={openMusic} style={[styles.emptyStateButton]}>
                {({pressed}) => (
                    <FontAwesomeIcon icon={faMusic} color={pressed ? themeColors.accentColor : themeColors.textColor} size={22} />
                )}
            </Pressable>
        );
    }

    const songName = currentSong.split('.').slice(0, -1).join('.');

    return (
        <View style={styles.playerControls}>
            <Text style={styles.nowPlaying} numberOfLines={1} ellipsizeMode="tail">
                {songName}
            </Text>
            
            {renderRating()}

            <Pressable onPress={stopSound} style={styles.closeButton}>
                {({pressed}) => (
                    <FontAwesomeIcon icon={faTimes} color={pressed ? themeColors.accentColor : themeColors.textColor} size={20} />
                )}
            </Pressable>

            <View style={styles.sliderContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    onSlidingComplete={seekTo}
                    minimumTrackTintColor={themeColors.accentColorShade}
                    maximumTrackTintColor={themeColors.borderColor}
                    thumbTintColor={themeColors.accentColor}
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.controlButtons}>
                <Pressable onPress={playPreviousSong} style={[styles.controlButton]}>
                    {({pressed}) => (
                        <FontAwesomeIcon icon={faStepBackward} color={pressed ? themeColors.accentColor : themeColors.textColor} size={24} />
                    )}
                </Pressable>
                <Pressable onPress={isPlaying ? pauseSound : resumeSound} style={styles.controlButton}>
                    {({pressed}) => (
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} color={pressed ? themeColors.accentColor : themeColors.textColor} size={24} />
                    )}
                </Pressable>
                <Pressable onPress={playNextSong} style={styles.controlButton}>
                    {({pressed}) => (
                        <FontAwesomeIcon icon={faStepForward} color={pressed ? themeColors.accentColor : themeColors.textColor} size={24} />
                    )}
                </Pressable>
            </View>
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    playerControls: {
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 15,
        alignItems: 'center',

    },
    nowPlaying: {
        fontSize: 16,
        color: themeColors.textColorItalic,
        textAlign: 'center',
        marginBottom: 4,
        fontFamily: 'serif'
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    timeText: {
        fontSize: 12,
        color: themeColors.textColor,
    },
    controlButtons: {
        zIndex: 1000,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButton: {
        padding: 10,
        marginHorizontal: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        height: 30,
        gap: 20
    },
    emptyStateButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 20,
    },
});

export default MusicPlayerControls;