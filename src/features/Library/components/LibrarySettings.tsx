import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, BackHandler } from 'react-native';

import Collapsible from '@/src/components/Collapsible';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { syncMarkedAlbums, fetchAPIKeys, saveAPIKey, clearMusicFolder } from '../helpers/LibrarySettingsHelper';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const LibrarySettings = ({ onBackPress }: { onBackPress: () => void }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const [booksApiKey, setBooksApiKey] = useState('');
    const [moviesApiKey, setMoviesApiKey] = useState('');
    const [spotifyClientId, setSpotifyClientId] = useState('');
    const [spotifyClientSecret, setSpotifyClientSecret] = useState('');
    const [igdbClientId, setIgdbClientId] = useState('');
    const [igdbClientSecret, setIgdbClientSecret] = useState('');

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onBackPress();
            return true;
        });

        return () => backHandler.remove();
    }, [onBackPress]);


    useEffect(() => {
        const loadAPIKeys = async () => {
            const apiKeys = await fetchAPIKeys();
            setBooksApiKey(apiKeys.booksApiKey || '');
            setMoviesApiKey(apiKeys.moviesApiKey || '');
            setSpotifyClientId(apiKeys.spotifyClientId || '');
            setSpotifyClientSecret(apiKeys.spotifyClientSecret || '');
            setIgdbClientId(apiKeys.igdbClientId || '');
            setIgdbClientSecret(apiKeys.igdbClientSecret || '');
        };
        loadAPIKeys();
    }, []);

    const [collapsedSections, setCollapsedSections] = useState({
        books: true,
        movies: true,
        music: true,
        games: true,
    });

    const renderAPIKeyInput = (label: string, value: string, onChangeText: (text: string) => void, onBlur: () => void) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={[designs.text.input, styles.input]}
                onChangeText={onChangeText}
                onBlur={onBlur}
                value={value}
                placeholder={`Enter ${label}`}
                placeholderTextColor={themeColors.gray}
                secureTextEntry={label.toLowerCase().includes('secret')}
            />
        </View>
    );

    const renderSection = (title: string, section: keyof typeof collapsedSections, children: React.ReactNode) => (
        <View style={styles.section}>
            <Pressable 
                onPress={() => toggleSection(section)} 
                style={[
                    styles.sectionHeader,
                    !collapsedSections[section] && styles.activeSectionHeader
                ]}
            >
                <Text style={styles.title}>{title}</Text>
                <FontAwesomeIcon 
                    icon={collapsedSections[section] ? faChevronDown : faChevronUp}
                    size={16}
                    color={themeColors.textColor}
                />
            </Pressable>
            <Collapsible collapsed={collapsedSections[section]}>
                <View style={styles.sectionContent}>
                    {children}
                </View>
            </Collapsible>
        </View>
    );

    const toggleSection = (section: keyof typeof collapsedSections) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Library Settings</Text>
            {renderSection('Books', 'books', 
                renderAPIKeyInput('Books API Key', booksApiKey, setBooksApiKey, () => saveAPIKey('booksApiKey', booksApiKey))
            )}
            {renderSection('Movies & Series', 'movies', 
                renderAPIKeyInput('Movies API Key', moviesApiKey, setMoviesApiKey, () => saveAPIKey('moviesApiKey', moviesApiKey))
            )}
            {renderSection('Music', 'music', 
                <>
                    {renderAPIKeyInput('Spotify Client ID', spotifyClientId, setSpotifyClientId, () => saveAPIKey('spotifyClientId', spotifyClientId))}
                    {renderAPIKeyInput('Spotify Client Secret', spotifyClientSecret, setSpotifyClientSecret, () => saveAPIKey('spotifyClientSecret', spotifyClientSecret))}
                    <Text style={styles.subtitle}>Sync Albums</Text>
                    <Pressable
                        style={[styles.syncButton, isSyncing && styles.syncingButton]}
                        onPress={() => syncMarkedAlbums(setIsSyncing)}
                        disabled={isSyncing}
                    >
                        <Text style={styles.syncButtonText}>
                            {isSyncing ? 'Syncing...' : 'Sync Marked Albums'}
                        </Text>
                    </Pressable>
                    <Pressable
                        style={styles.syncButton}
                        onPress={() => clearMusicFolder()}
                    >
                        <Text style={styles.syncButtonText}>
                            Clear Music Folder
                        </Text>
                    </Pressable>
                </>
            )}
            {renderSection('Video Games', 'games', 
                <>
                    {renderAPIKeyInput('IGDB Client ID', igdbClientId, setIgdbClientId, () => saveAPIKey('igdbClientId', igdbClientId))}
                    {renderAPIKeyInput('IGDB Client Secret', igdbClientSecret, setIgdbClientSecret, () => saveAPIKey('igdbClientSecret', igdbClientSecret))}
                </>
            )}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroundColor,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themeColors.textColor,
        marginBottom: 20,
        marginHorizontal: 30,
        marginTop: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: themeColors.textColorItalic,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: themeColors.backgroundColor,
        borderRadius: 12,
        padding: 12,
        backgroundColor: themeColors.backgroundColor,
        color: themeColors.textColor,
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColor,
    },
    section: {
        marginBottom: 16,
        backgroundColor: themeColors.backgroundSecondary,
        borderRadius: 16,
        marginHorizontal: 20,
        overflow: 'hidden',
        shadowColor: themeColors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: themeColors.backgroundSecondary,
    },
    activeSectionHeader: {
        borderBottomWidth: 1,
        borderBottomColor: themeColors.borderColor,
    },
    sectionContent: {
        padding: 16,
    },
    syncButton: {
        padding: 14,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        backgroundColor: themeColors.backgroundColor,
        shadowColor: themeColors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    syncingButton: {
        backgroundColor: themeColors.backgroundColor,
        opacity: 0.8,
    },
    syncButtonText: {
        color: themeColors.textColor,
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 16,
        color: themeColors.textColor,
    },
});

export default LibrarySettings;