import { View, Pressable, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMusic, faLink, faPlay, faStar } from "@fortawesome/free-solid-svg-icons";

import { Theme, useThemeStyles } from "@/src/styles/useThemeStyles";

interface TracksContainerProps {
    trackDetails: any;
    handlePlaySound: (fileName: string) => void;
    setSelectedSongForLinking: (fileName: string) => void;
    dbOnlyTracks: any;
}

const TracksContainer = ({ 
    trackDetails, 
    handlePlaySound, 
    setSelectedSongForLinking, 
    dbOnlyTracks 
}: TracksContainerProps) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    const renderRating = (rating: number = 0) => (
        <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon 
                    key={star}
                    icon={faStar} 
                    size={14} 
                    color={star <= rating ? theme.colors.textColor : theme.colors.borderColor} 
                />
            ))}
        </View>
    );

    return (
        <View style={styles.tracksContainer}>
            {trackDetails.orderedSongs.map((fileName: string, index: number) => {
                const trackData = trackDetails.details[fileName];
                const songName = fileName.split('.').slice(0, -1).join('.');

                return (
                    <Pressable 
                        key={fileName}
                        style={({ pressed }) => [
                            styles.trackItemContainer,
                            pressed && styles.trackItemPressed
                        ]}
                        onPress={() => handlePlaySound(fileName)}
                    >
                        <View style={styles.trackIconContainer}>
                            <FontAwesomeIcon 
                                icon={faMusic} 
                                size={16} 
                                color={theme.colors.textColorItalic} 
                            />
                            <Text style={styles.trackNumber}>
                                {trackData?.trackNumber?.toString().padStart(2, '0') || '--'}
                            </Text>
                        </View>
                        <View style={styles.trackDetails}>
                            <Text style={styles.trackName}>{songName}</Text>
                            {trackData ? (
                                <View style={styles.trackMetadata}>
                                    {renderRating(trackData.rating || 0)}
                                    <Text style={styles.playCount}>
                                        Plays: {trackData.playCount || 0}
                                    </Text>
                                </View>
                            ) : (
                                <Pressable 
                                    style={styles.linkButton}
                                    onPress={() => setSelectedSongForLinking(fileName)}
                                >
                                    <FontAwesomeIcon 
                                        icon={faLink} 
                                        size={14} 
                                        color={theme.colors.textColorItalic} 
                                    />
                                    <Text style={styles.linkText}>Link to track</Text>
                                </Pressable>
                            )}
                        </View>
                        <FontAwesomeIcon 
                            icon={faPlay} 
                            size={16} 
                            color={theme.colors.textColorItalic} 
                        />
                    </Pressable>
                );
            })}
            {dbOnlyTracks.map((track: any) => (
                <Pressable 
                    key={`db_${track.uuid}`}
                    style={[
                        styles.trackItemContainer,
                        styles.dbTrackContainer
                    ]}
                >
                    <View style={styles.trackIconContainer}>
                        <FontAwesomeIcon 
                            icon={faMusic} 
                            size={16} 
                            color={theme.colors.textColorItalic} 
                        />
                        <Text style={styles.trackNumber}>
                            {track.trackNumber?.toString().padStart(2, '0') || '--'}
                        </Text>
                    </View>
                    <View style={styles.trackDetails}>
                        <Text style={[styles.trackName, styles.dbTrackName]}>
                            {track.trackName || 'Unknown Track'}
                        </Text>
                        <View style={styles.trackMetadata}>
                            {renderRating(track.rating || 0)}
                            <Text style={styles.playCount}>
                                Plays: {track.playCount || 0}
                            </Text>
                            <Text style={styles.dbIndicator}>
                                Database Only
                            </Text>
                        </View>
                    </View>
                </Pressable>
            ))}
        </View>
    )
}

const getStyles = (theme: Theme) => StyleSheet.create({
    tracksContainer: {
        paddingHorizontal: 0,
    },
    trackItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 15,
        borderRadius: theme.borderRadius.lg,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
    },
    trackItemPressed: {
        backgroundColor: theme.colors.accentColor,
        transform: [{ scale: 0.98 }],
    },
    trackIconContainer: {
        width: 30,
        marginRight: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    trackDetails: {
        flex: 1,
        marginRight: 10,
    },  
    trackName: {
        fontSize: 16,
        color: theme.colors.textColor,
        marginBottom: 4,
        ...(theme.name === 'signalis' && {
            fontSize: 20,
            fontFamily: theme.typography.fontFamily.secondary,
            fontStyle: 'normal',
            fontWeight: 'normal',
        })
    },
    trackNumber: {
        fontSize: 14,
        color: theme.colors.textColorItalic,
        fontFamily: 'monospace',
        ...(theme.name === 'signalis' && {
            fontSize: 16,
            fontFamily: theme.typography.fontFamily.primary,
            // textShadowColor: theme.colors.accentColor,
            // textShadowOffset: { width: 1, height: 1 },
            // textShadowRadius: 6,
            fontStyle: 'normal',
            fontWeight: 'normal',
        })
    },
    trackMetadata: {
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
        color: theme.colors.textColorItalic,
        ...(theme.name === 'signalis' && {
            fontSize: 16,
            fontFamily: theme.typography.fontFamily.secondary,
            fontStyle: 'normal',
            fontWeight: 'normal',
        })
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
    },
    linkText: {
        fontSize: 12,
        color: theme.colors.textColorItalic,
    },
    dbTrackContainer: {
        opacity: 0.7,
        borderStyle: 'dashed',
    },
    dbTrackName: {
        fontStyle: 'italic',
        ...(theme.name === 'signalis' && {
            fontSize: 20,
            fontFamily: theme.typography.fontFamily.secondary,
            fontStyle: 'normal',
            fontWeight: 'normal',
        })
    },
    dbIndicator: {
        fontSize: 10,
        color: theme.colors.textColorItalic,
        backgroundColor: theme.colors.borderColor,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});

export default TracksContainer;