import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, BackHandler } from 'react-native';

import AlertModal, { AlertConfig } from '@/src/components/modals/AlertModal';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { fetchAPIKeys, saveAPIKey } from '../../helpers/LibrarySettingsHelper';
import { handleSyncMusic, handleClearMusicFolder, handleSyncBooks, handleClearBooksFolder } from './helpers';
import { renderAPIKeyInput, renderSection } from './components';

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
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

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

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.pageTitle}>Library Settings</Text>
                {renderSection('Books', 'books',
                    <>
                        {renderAPIKeyInput('Books API Key', booksApiKey, setBooksApiKey, () => saveAPIKey('booksApiKey', booksApiKey))}
                        <Text style={styles.subtitle}>Sync Books</Text>
                        <Pressable
                            style={[styles.syncButton, isSyncing && styles.syncingButton]}
                            onPress={() => handleSyncBooks(setIsSyncing, setAlertConfig)}
                            disabled={isSyncing}
                        >
                            <Text style={styles.syncButtonText}>
                                {isSyncing ? 'Syncing...' : 'Sync Marked Books'}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={styles.syncButton}
                            onPress={handleClearBooksFolder}
                        >
                            {({ pressed }) => (
                                <Text style={[styles.syncButtonText, pressed && { opacity: 0.5, transform: [{ scale: 0.98 }] }]}>
                                    Clear Books Folder
                                </Text>
                            )}
                        </Pressable>
                    </>
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
                            onPress={() => handleSyncMusic(setIsSyncing, setAlertConfig)}
                            disabled={isSyncing}
                        >
                            <Text style={styles.syncButtonText}>
                                {isSyncing ? 'Syncing...' : 'Sync Marked Albums'}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={styles.syncButton}
                            onPress={handleClearMusicFolder}
                        >
                            {({ pressed }) => (
                                <Text style={[styles.syncButtonText, pressed && { opacity: 0.5, transform: [{ scale: 0.98 }] }]}>
                                    Clear Music Folder
                                </Text>
                            )}
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
            {alertConfig && (
                <AlertModal
                    isVisible={!!alertConfig}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onConfirm={() => {
                        alertConfig.onConfirm?.();
                        setAlertConfig(null);
                    }}
                    onCancel={() => {
                        alertConfig.onCancel?.();
                        setAlertConfig(null);
                    }}
                    singleButton={alertConfig.singleButton}
                />
            )}
        </>
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