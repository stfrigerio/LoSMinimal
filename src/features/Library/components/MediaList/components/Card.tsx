import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Switch, StyleSheet } from 'react-native';

import { getStarRating } from '@/src/features/Library/helpers/getStarRating';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { getActionText, ensureHttpsUrl } from '@/src/features/Library/components/MediaList/components/DetailedView/helpers';

import { LibraryData } from '@/src/types/Library';

interface CardProps {
    item: LibraryData;
    onPress: (item: LibraryData) => void;
    onToggleDownload?: (item: LibraryData) => Promise<void>; // Update return type to Promise<void>
}

const Card: React.FC<CardProps> = ({ item, onPress, onToggleDownload }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
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
        <Pressable style={styles.card} onPress={() => onPress(item)}>
            <View style={styles.flexContainer}>
                {item.mediaImage && (
                    <Image source={{ uri: ensureHttpsUrl(item.mediaImage) }} style={styles.poster} />
                )}
                <View style={{ flexDirection: 'column', flexShrink: 1 }}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
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
                        {item.type === 'music' || item.type === 'book' && onToggleDownload && (
                            <View style={styles.downloadToggleContainer}>
                                <Switch
                                    trackColor={{ false: themeColors.backgroundColor, true: themeColors.accentColor }}
                                    thumbColor={isDownloading ? themeColors.textColorBold : themeColors.textColor}
                                    onValueChange={handleToggleDownload}
                                    value={isDownloading}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        card: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 10,
            padding: 10,
            marginVertical: 5,
            marginHorizontal: 10,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 3,
            elevation: 12,
            borderWidth: 1,
            borderColor: theme.backgroundColor
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
            color: theme.textColorBold
        },
        rating: {
            fontSize: 14,
            color: theme.textColor,
            marginTop: 10,
        },
        poster: {
            width: 100,
            height: 100,
            borderRadius: 10,
            marginRight: 10,
        },
        creator: {
            fontSize: 12,
            color: theme.textColor,
            marginTop: 5,
            width: 150,
            marginRight: 10,
            fontStyle: 'italic'
        },
        year: {
            marginTop: 5,
            fontSize: 12,
            color: theme.textColor,
            flexGrow: 1,
        },
        text: {
            color: theme.textColor,
            fontSize: 10,
            marginTop: 5
        },
        seenText: {
            color: theme.gray,
            fontSize: 10,
            marginTop: 5
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