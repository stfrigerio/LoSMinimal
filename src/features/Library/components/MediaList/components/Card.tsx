import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Switch, StyleSheet } from 'react-native';

import { getStarRating } from '@/src/features/Library/helpers/getStarRating';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { getActionText, ensureHttpsUrl } from '@/src/features/Library/components/MediaList/components/DetailedView/helpers';

import { LibraryData } from '@/src/types/Library';

interface CardProps {
    item: LibraryData;
    onPress: (item: LibraryData) => void;
    onToggleDownload?: (item: LibraryData) => Promise<void>; // Update return type to Promise<void>
}

const Card: React.FC<CardProps> = ({ item, onPress, onToggleDownload }) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    const [isDownloading, setIsDownloading] = useState(item.isMarkedForDownload === 1);

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Update local state when item prop changes
    useEffect(() => {
        setIsDownloading(item.isMarkedForDownload === 1);
    }, [item.isMarkedForDownload]);

    // Handle the toggle with local state
    const handleToggleDownload = async () => {
        if (onToggleDownload) {
            setIsDownloading(!isDownloading); // Update local state immediately
            await onToggleDownload(item); // Then update database
        }
    };

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed
            ]} 
            onPress={() => onPress(item)}
        >
            <View style={styles.flexContainer}>
                {item.mediaImage && (
                    <Image source={{ uri: ensureHttpsUrl(item.mediaImage) }} style={styles.poster} />
                )}
                <View style={{ flexDirection: 'column', flexShrink: 1 }}>
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                        {item.title}
                    </Text>
                    <View style={styles.descriptionContainer}>
                    <Text style={styles.creator}>
                            {item.creator && item.creator.length > 20 
                                ? `${item.creator.substring(0, 20)}...` 
                                : item.creator || 'Unknown Creator'}
                        </Text>
                        <Text style={styles.year}>
                            {typeof item.releaseYear === 'string' 
                                ? new Date(item.releaseYear).getFullYear() 
                                : item.releaseYear}
                        </Text>
                    </View>
                    <Text style={styles.seenText}>
                        {`${getActionText(item.type)}: ${formatDate(item.seen)}`}
                    </Text>
                    <View style={styles.ratingSwitchContainer}>
                        <Text style={styles.rating}>{getStarRating(item.rating)}</Text>
                        {(item.type === 'music' || item.type === 'book') ? (
                            onToggleDownload && (
                                <View style={styles.downloadToggleContainer}>
                                    <Switch
                                        trackColor={{ false: theme.colors.backgroundColor, true: theme.colors.accentColor }}
                                        thumbColor={isDownloading ? theme.colors.textColorBold : theme.colors.textColor}
                                        onValueChange={handleToggleDownload}
                                        value={isDownloading}
                                    />
                                </View>
                            )
                        ) : null}
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const getStyles = (theme: Theme) => {
    return StyleSheet.create({
        card: {
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.borderRadius.sm,
            padding: 10,
            marginVertical: 5,
            marginHorizontal: 10,
            shadowColor: theme.colors.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 12,
            borderWidth: 1,
            borderColor: theme.colors.backgroundColor
        },
        cardPressed: {
            opacity: 0.7,
            transform: [{ scale: 0.98 }]
        },
        flexContainer: {
            flexDirection: 'row',
        },
        descriptionContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.textColorBold,
            ...(theme.name === 'signalis' && {
                fontSize: 15,
                fontFamily: theme.typography.fontFamily.primary,
                fontStyle: 'normal',
                fontWeight: 'normal',
                textShadowColor: theme.colors.accentColor,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 6,
            })
        },
        rating: {
            marginTop: 10,
        },
        poster: {
            width: 100,
            height: 100,
            borderRadius: theme.borderRadius.sm,
            marginRight: 10,
        },
        creator: {
            fontSize: 12,
            color: theme.colors.textColor,
            marginTop: 5,
            width: 150,
            marginRight: 10,
            fontStyle: 'italic',
            ...(theme.name === 'signalis' && {
                fontSize: 16,
                color: theme.colors.textColor,
                fontFamily: theme.typography.fontFamily.secondary,
                fontStyle: 'normal',
                fontWeight: 'normal',
            })
        },
        year: {
            marginTop: 5,
            fontSize: 12,
            color: theme.colors.textColor,
            flexGrow: 1,
            ...(theme.name === 'signalis' && {
                fontSize: 10,
                color: theme.colors.textColorItalic,
                fontFamily: theme.typography.fontFamily.primary,
                fontStyle: 'normal',
                fontWeight: 'normal',
            })
        },
        seenText: {
            color: theme.colors.gray,
            fontSize: 10,
            marginTop: 5,
            ...(theme.name === 'signalis' && {
                fontSize: 14,
                fontFamily: theme.typography.fontFamily.secondary,
                fontStyle: 'normal',
                fontWeight: 'normal',
            })
        },
        ratingSwitchContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 5
        },
        downloadToggleContainer: {
            marginTop: 12,
            alignSelf: 'flex-start'
        }
    });
};

export default Card;