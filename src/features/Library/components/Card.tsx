import React from 'react';
import { View, Text, Image, Pressable, Dimensions, Platform, StyleSheet } from 'react-native';

import { getStarRating } from '@/src/features/Library/helpers/getStarRating';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

import { LibraryData } from '@/src/types/Library';

interface CardProps {
    item: LibraryData;
    onPress: (item: LibraryData) => void;
}

const Card: React.FC<CardProps> = ({ item, onPress }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const ensureHttpsUrl = (url: string) => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            return `https:${url}`;
        }
        return url;
    };

    const getActionText = (mediaType: string): string => {
        switch (mediaType) {
            case 'book':
                return 'Read';
            case 'movie':
            case 'series':
                return 'Seen';
            case 'videogame':
                return 'Played';
            default:
                return 'Consumed';
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
                    <Text style={styles.rating}>{getStarRating(item.rating)}</Text>
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
        }
    });
};

export default Card;