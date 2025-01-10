import { useThemeStyles } from '@/src/styles/useThemeStyles';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { formatDate, getActionText, cleanText, openEpubFile } from '../helpers';
import { hasMarkdownFile, hasEpubFile } from '@/src/features/Library/helpers/BooksHelper';
import { DetailedMusicView } from '../DetailedMusic/DetailedMusic';
import { LibraryData } from '@/src/types/Library';
import { Album } from '@/src/features/Music/types';
import { openMarkdownViewer } from '../helpers';
import { useNavigation } from 'expo-router';

export const RenderDetail = (label: string, value: string | number | undefined) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    return (
        <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
};

export const RenderCommonDetails = (item: any) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    return (
        <>
            {RenderDetail(`Date ${getActionText(item.type)}`, formatDate(item.seen))}
            {RenderDetail(item.type === 'book' ? 'Author' : 'Creator', item.creator)}
            {RenderDetail('Genre', item.genre)}
            {RenderDetail(item.type === 'book' ? 'Publish Year' : 'Release Year', 
                typeof item.releaseYear === 'string' ? new Date(item.releaseYear).getFullYear() : item.releaseYear)}
        </>
    );
}

interface RenderSpecificDetailsProps {
    item: any;
    album: Album | undefined;
    updateItem: (item: LibraryData) => Promise<void>;
}

export const RenderSpecificDetails: React.FC<RenderSpecificDetailsProps> = ({ 
    item, 
    album, 
    updateItem 
}) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);
    const navigation = useNavigation();
    const [hasMarkdown, setHasMarkdown] = useState(false);
    const [hasEpub, setHasEpub] = useState(false);

    useEffect(() => {
        const checkFiles = async () => {
            const [mdExists, epubExists] = await Promise.all([
                hasMarkdownFile(item.title),
                hasEpubFile(item.title)
            ]);
            setHasMarkdown(mdExists);
            setHasEpub(epubExists);
        };
        
        checkFiles();
    }, [item.title]);

    switch (item.type) {
        case 'book':
            return (
                <>
                    {RenderDetail('Pages', item.pages)}
                    {RenderDetail('Description', cleanText(item.plot!))}
                    {hasEpub && (
                        <Pressable 
                            style={styles.openButton}
                            onPress={() => openEpubFile(item)}
                        >
                            <Text style={styles.openButtonText}>Open Book</Text>
                        </Pressable>
                    )}
                    {hasMarkdown && (
                        <Pressable 
                            style={[styles.openButton, styles.openButton]}
                            onPress={() => openMarkdownViewer(item, navigation)}
                        >
                            <Text style={styles.openButtonText}>View Notes</Text>
                        </Pressable>
                    )}
                </>
            );
        case 'movie':
            return (
                <>
                    {RenderDetail('Box Office', item.boxOffice)}
                    {RenderDetail('Runtime', item.runtime)}
                    {RenderDetail('Cast', item.cast)}
                    {RenderDetail('Plot', cleanText(item.plot!))}
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
                    {RenderDetail('Total Seasons', item.seasons)}
                    {RenderDetail('Runtime', item.runtime)}
                    {RenderDetail('Cast', item.cast)}
                    {RenderDetail('Plot', cleanText(item.plot!))}
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

const getStyles = (themeColors: any, designs: any) => StyleSheet.create({
    ratings: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        backgroundColor: themeColors.backgroundSecondary,
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
        color: themeColors.textColorItalic,
        fontSize: 12,
        textAlign: 'center', // Center text if it wraps
    },
    ratingValue: {
        color: themeColors.textColorBold,
        fontSize: 16,
        fontWeight: '600',
    },
    details: {
        flex: 1,
        padding: 20,
        color: themeColors.textColor,
        fontSize: 14,
    }, 
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        backgroundColor: themeColors.backgroundSecondary,
        padding: 15,
        borderRadius: 12,
    },
    detailLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: themeColors.textColorBold,
    },
    detailValue: {
        flex: 2,
        fontSize: 16,
        color: themeColors.textColor,
        textAlign: 'right',
    },
    openButton: {
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        backgroundColor: themeColors.backgroundColor,
        padding: 15,
        borderRadius: 12,
        marginTop: 12,
        alignItems: 'center',
    },
    openButtonText: {
        color: themeColors.textColorBold,
        fontSize: 16,
        fontWeight: '600',
    },
});