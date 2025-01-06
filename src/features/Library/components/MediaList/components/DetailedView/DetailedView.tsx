import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView, BackHandler, Switch, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faTrash, faMusic } from '@fortawesome/free-solid-svg-icons';

import { LibraryData } from '@/src/types/Library';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { DetailedMusicView } from './DetailedMusic/DetailedMusic';
import { databaseManagers } from '@/database/tables';
import { Album } from '@/src/features/Music/types';

interface DetailedViewProps {
    item: LibraryData;
    onClose: () => void;
    onDelete: (item: LibraryData) => void;
    onToggleDownload?: (item: LibraryData) => Promise<void>;
    updateItem: (item: LibraryData) => Promise<void>;
    album?: Album;
}

const DetailedView: React.FC<DetailedViewProps> = ({ item, onClose, onDelete, onToggleDownload, updateItem, album }) => {
    const { themeColors, designs } = useThemeStyles();
    const [currentRating, setCurrentRating] = useState(item.rating);
    const styles = getStyles(themeColors, designs);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.title);

    const handleDelete = async () => {
        onDelete(item);
        onClose();
    };

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

    const cleanText = (text: string) => {
        return text ? text.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '') : '';
    };

    const getActionText = (mediaType: string): string => {
        switch (mediaType) {
            case 'book': return 'Read';
            case 'movie':
            case 'series': return 'Seen';
            case 'videogame': return 'Played';
            case 'music': return 'Listened';
            default: return 'Consumed';
        }
    };

    const handleRatingChange = async (newRating: number) => {
        setCurrentRating(newRating);
        const updatedItem = { ...item, rating: newRating };
        await databaseManagers.library.upsert(updatedItem);
        updateItem(updatedItem);
    };

    const handleTitleEdit = async () => {
        if (isEditingTitle) {
            const updatedItem = { ...item, title: editedTitle };
            await databaseManagers.library.upsert(updatedItem);
            updateItem(updatedItem);
        }
        setIsEditingTitle(!isEditingTitle);
    };

    const renderRating = (rating: number) => (
        <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                    key={star}
                    onPress={() => handleRatingChange(star)}
                    style={{ padding: 5 }}
                >
                    <FontAwesomeIcon 
                        icon={faStar} 
                        size={20} 
                        color={star <= rating ? 'gold' : 'gray'} 
                    />
                </Pressable>
            ))}
        </View>
    );

    const renderDetail = (label: string, value: string | number | undefined) => (
        <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );

    const renderCommonDetails = () => (
        <>
            {renderDetail(`Date ${getActionText(item.type)}`, formatDate(item.seen))}
            {renderDetail(item.type === 'book' ? 'Author' : 'Creator', item.creator)}
            {renderDetail('Genre', item.genre)}
            {renderDetail(item.type === 'book' ? 'Publish Year' : 'Release Year', 
                typeof item.releaseYear === 'string' ? new Date(item.releaseYear).getFullYear() : item.releaseYear)}
        </>
    );
    
    const renderSpecificDetails = () => {
        switch (item.type) {
            case 'book':
                return (
                    <>
                        {renderDetail('Pages', item.pages)}
                        {renderDetail('Description', cleanText(item.plot!))}
                    </>
                );
            case 'movie':
                return (
                    <>
                        {renderDetail('Box Office', item.boxOffice)}
                        {renderDetail('Runtime', item.runtime)}
                        {renderDetail('Cast', item.cast)}
                        {renderDetail('Plot', cleanText(item.plot!))}
                        <View style={styles.ratings}>
                            <View style={styles.ratingItem}>
                                <Text style={styles.ratingLabel}>Rotten Tomatoes</Text>
                                <Text style={styles.ratingValue}>{item.tomato}%</Text>
                            </View>
                            <View style={styles.ratingItem}>
                                <Text style={styles.ratingLabel}>IMDB</Text>
                                <Text style={styles.ratingValue}>{item.ratingImdb}</Text>
                            </View>
                            <View style={styles.ratingItem}>
                                <Text style={styles.ratingLabel}>Metascore</Text>
                                <Text style={styles.ratingValue}>{item.metascore}</Text>
                            </View>
                        </View>
                    </>
                );
            case 'series':
                return (
                    <>
                        {renderDetail('Total Seasons', item.seasons)}
                        {renderDetail('Runtime', item.runtime)}
                        {renderDetail('Cast', item.cast)}
                        {renderDetail('Plot', cleanText(item.plot!))}
                        <View style={styles.ratings}>
                            <Text style={styles.details}>Imdb: {item.ratingImdb}</Text>
                        </View>
                    </>
                );
            case 'music':
                return <DetailedMusicView item={item} album={album!} updateItem={updateItem} />;
            default:
                return null;
        }
    };

    const handleMarkAsFinished = async () => {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const updatedItem = { 
            ...item, 
            finished: 1, 
            seen: today 
        };
        await databaseManagers.library.upsert(updatedItem);
        updateItem(updatedItem);
    };

    const renderFinishButton = () => {
        if (item.finished === 0) {
            return (
                <Pressable 
                    onPress={handleMarkAsFinished} 
                    style={styles.finishButton}
                >
                    <Text style={styles.finishButtonText}>
                        Mark as Finished
                    </Text>
                </Pressable>
            );
        }
        return null;
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <Image source={{ uri: ensureHttpsUrl(item.mediaImage) }} style={styles.poster} />
                <View style={styles.details}>
                    <Pressable onPress={handleTitleEdit}>
                        {isEditingTitle ? (
                            <TextInput
                                style={[styles.title, styles.titleInput]}
                                value={editedTitle}
                                onChangeText={setEditedTitle}
                                onBlur={handleTitleEdit}
                                autoFocus
                            />
                        ) : (
                            <Text style={styles.title}>{item.title}</Text>
                        )}
                    </Pressable>
                    {renderRating(currentRating)}
                    <View style={styles.divider} />
                    {renderCommonDetails()}
                    <View style={styles.divider} />
                    {renderSpecificDetails()}
                    {renderFinishButton()}
                    <Pressable onPress={handleDelete} style={styles.deleteButton}>
                        <FontAwesomeIcon icon={faTrash} size={20} color={themeColors.redOpacity} />
                        <Text style={styles.deleteButtonText}>{`Delete ${item.type}`}</Text>
                    </Pressable>
                </View>
                <View style={{ height: 80 }} />
            </ScrollView>
        </>
    );
};

const getStyles = (theme: any, designs: any) => StyleSheet.create({
    titleInput: {
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor,
        paddingBottom: 5,
    },
    ratings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        backgroundColor: theme.backgroundSecondary,
        padding: 15,
        borderRadius: 12,
    },
    ratingItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
        height: 50, // Fixed height for consistent alignment
        justifyContent: 'space-between', // Evenly space label and value
    },
    ratingLabel: {
        color: theme.textColorItalic,
        fontSize: 12,
        textAlign: 'center', // Center text if it wraps
    },
    ratingValue: {
        color: theme.textColorBold,
        fontSize: 16,
        fontWeight: '600',
    },
    details: {
        flex: 1,
        padding: 20,
        color: theme.textColor,
        fontSize: 14,
    },  
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.textColorBold,
        marginBottom: 5,
        marginTop: 15,
    },
    // Update existing container styles
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    poster: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    title: {
        ...designs.text.title,
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.textColorBold,
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    ratingContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        justifyContent: 'center',
    },
    divider: {
        height: 2,
        backgroundColor: theme.borderColor,
        marginVertical: 20,
        opacity: 0.5,
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        backgroundColor: theme.backgroundSecondary,
        padding: 15,
        borderRadius: 12,
    },
    detailLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: theme.textColorBold,
    },
    detailValue: {
        flex: 2,
        fontSize: 16,
        color: theme.textColor,
        textAlign: 'right',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 30,
        borderWidth: 1,
        borderColor: theme.redOpacity,
    },
    deleteButtonText: {
        color: theme.redOpacity,
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.borderColor,
        marginTop: 30,
        backgroundColor: theme.backgroundColor,
    },
    finishButtonText: {
        color: theme.textColorBold,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DetailedView;