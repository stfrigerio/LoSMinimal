import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faStar, faLink } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { Album, TrackDetailsState } from '../types';

interface SongListProps {
    album: Album;
    trackDetails: TrackDetailsState;
    onPlaySound: (albumName: string, songName: string, songList: string[]) => void;
    onLinkTrack: (song: string) => void;
}

export const SongList = ({ 
    album, 
    trackDetails, 
    onPlaySound, 
    onLinkTrack 
}: SongListProps) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const renderRating = (rating: number = 0) => (
        <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon 
                    key={star}
                    icon={faStar} 
                    size={14} 
                    color={star <= rating ? themeColors.textColor : themeColors.borderColor} 
                />
            ))}
        </View>
    );

    const renderSongItem = ({ item, index }: { item: string; index: number }) => {
        const isMp3 = item.toLowerCase().endsWith('.mp3');
        const trackName = isMp3 ? item.slice(0, -4) : item; // Remove .mp3 if present
        const trackData = trackDetails.details[item]; // Use filename as key

        return (
            <Pressable 
                style={({ pressed }) => [
                    styles.songItem,
                    pressed && styles.songItemPressed
                ]} 
                onPress={() => onPlaySound(album.name, item, trackDetails.orderedSongs)}
            >
                <View style={styles.songMainInfo}>
                    <View style={styles.songIconContainer}>
                        {trackData ? (
                            <Text style={styles.trackNumber}>
                                {trackData.trackNumber.toString().padStart(2, '0')}
                            </Text>
                        ) : (
                            <Text style={styles.trackNumber}>
                                --
                            </Text>
                        )}
                    </View>
                    <View style={styles.songDetails}>
                        <Text style={styles.songTitle}>
                            {trackName}
                        </Text>
                        {trackData ? (
                            <View style={styles.songMetadata}>
                                {renderRating(trackData.rating)}
                                <Text style={styles.playCount}>
                                    Plays: {trackData.playCount || 0}
                                </Text>
                                <Text style={styles.duration}>
                                    {Math.floor(trackData.durationMs / 1000 / 60)}:
                                    {String(Math.floor((trackData.durationMs / 1000) % 60)).padStart(2, '0')}
                                </Text>
                            </View>
                        ) : (
                            <Pressable 
                                style={styles.linkButton}
                                onPress={() => onLinkTrack(item)}
                            >
                                <FontAwesomeIcon 
                                    icon={faLink} 
                                    size={14} 
                                    color={themeColors.textColorItalic} 
                                />
                                <Text style={styles.linkText}>Link to track</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
                <FontAwesomeIcon 
                    icon={faPlay} 
                    size={16} 
                    color={themeColors.textColorItalic} 
                />
            </Pressable>
        );
    };

    return (
        <FlatList
            data={trackDetails.orderedSongs} 
            renderItem={renderSongItem}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.songList}
        />
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    songList: {
        padding: 20,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: themeColors.cardColor,
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    songItemPressed: {
        backgroundColor: themeColors.accentColor,
        transform: [{ scale: 0.98 }],
    },
    songMainInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    songIconContainer: {
        width: 30,
        marginRight: 15,
        justifyContent: 'center',
    },
    songDetails: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        color: themeColors.textColor,
        marginBottom: 4,
    },
    trackNumber: {
        fontSize: 14,
        color: themeColors.textColorItalic,
        fontFamily: 'monospace',
    },
    songMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    playCount: {
        fontSize: 12,
        color: themeColors.textColorItalic,
    },
    duration: {
        fontSize: 12,
        color: themeColors.textColorItalic,
        fontFamily: 'monospace',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
    },
    linkText: {
        fontSize: 12,
        color: themeColors.textColorItalic,
    },
}); 
