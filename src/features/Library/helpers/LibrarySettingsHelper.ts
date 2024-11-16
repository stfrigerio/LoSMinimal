import * as FileSystem from 'expo-file-system';
import { useState } from 'react';

import { databaseManagers } from '@/database/tables';
import { getFlaskServerURL } from '@/src/features/Database/helpers/databaseConfig';
import { AlertConfig } from '@/src/components/modals/AlertModal';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const musicFolderPath = `${FileSystem.documentDirectory}Music`;

export const syncMarkedAlbums = async (
    setIsSyncing: (isSyncing: boolean) => void,
    setAlertConfig: (config: AlertConfig | null) => void
) => {
    setIsSyncing(true);
    let syncErrors: string[] = [];

    try {
        const markedAlbums = await databaseManagers.library.getLibrary({ 
            type: 'music', 
            isMarkedForDownload: 1 
        });

        const allMusicAlbums = await databaseManagers.library.getLibrary({
            type: 'music'
        });

        const SERVER_URL = await getFlaskServerURL();

        // Remove unmarked albums
        for (let album of allMusicAlbums) {
            if (!markedAlbums.some(markedAlbum => markedAlbum.title === album.title)) {
                try {
                    await removeAlbum(album.title);
                    //todo ideally i should show some kind of message with the album removed
                } catch (error) {
                    syncErrors.push(`Failed to remove ${album.title}`);
                }
            }
        }

        // Sync marked albums
        for (let album of markedAlbums) {
            try {
                await syncAlbum(album, SERVER_URL);
            } catch (error) {
                syncErrors.push(`Failed to sync ${album.title}`);
                console.error(`Failed to sync album ${album.title}:`, error);
            }
        }

        if (syncErrors.length > 0) {
            setAlertConfig({
                title: 'Sync Completed with Errors',
                message: `Some albums failed to sync:\n${syncErrors.join('\n')}`,
                onConfirm: () => {},
                singleButton: true
            });
            return { success: false, message: 'Sync completed with errors' };
        }

        return { 
            success: true, 
            message: 'All marked albums have been synced successfully' 
        };

    } catch (error) {
        console.error('Failed to sync albums:', error);
        setAlertConfig({
            title: 'Sync Error',
            message: 'Failed to sync albums. Please check the logs for details.',
            onConfirm: () => {},
            singleButton: true
        });
        return { success: false, message: 'Sync failed' };
    } finally {
        setIsSyncing(false);
    }
};

const syncAlbum = async (album: any, SERVER_URL: string) => {
    // First, check if the album exists on the server
    const response = await fetch(`${SERVER_URL}/music/sync/${encodeURIComponent(album.title)}`, { 
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const files = await response.json();
    if (!Array.isArray(files)) {
        throw new Error('Invalid response format from server');
    }

    const albumPath = `${musicFolderPath}/${album.title}`;
    await FileSystem.makeDirectoryAsync(albumPath, { intermediates: true });

    for (let file of files) {
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                await downloadFile(album.title, file.name, albumPath);
                break;
            } catch (error) {
                console.error(`Failed to download ${file.name}, attempt ${retries + 1}:`, error);
                if (retries === MAX_RETRIES - 1) {
                    throw error;
                }
                retries++;
                await wait(RETRY_DELAY);
            }
        }
    }
};

const removeAlbum = async (albumTitle: string) => {
    try {
        const albumPath = `${musicFolderPath}/${albumTitle}`;
        await FileSystem.deleteAsync(albumPath, { idempotent: true });
    } catch (error) {
        console.error(`Failed to remove album ${albumTitle}:`, error);
        throw error; // Propagate the error to handle it in the calling function
    }
};

const downloadFile = async (albumTitle: string, fileName: string, albumPath: string) => {
    const SERVER_URL = await getFlaskServerURL();
    const fileUrl = `${SERVER_URL}/music/file/${encodeURIComponent(albumTitle)}/${encodeURIComponent(fileName)}`;
    const fileUri = `${albumPath}/${fileName}`;

    try {
        // Check if file exists and has content
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists && fileInfo.size > 0) {
            console.log(`File already exists and is not empty: ${fileName}`);
            return;
        }
        
        // Use Expo FileSystem's downloadAsync with proper headers
        const downloadResult = await FileSystem.downloadAsync(
            fileUrl,
            fileUri,
            {
                headers: {
                    'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
                },
                cache: false // Disable caching to ensure fresh download
            }
        );

        // More thorough download verification
        if (downloadResult.status !== 200) {
            throw new Error(`Download failed with status: ${downloadResult.status}`);
        }

        const downloadedFile = await FileSystem.getInfoAsync(fileUri);
        if (!downloadedFile.exists) {
            throw new Error(`File does not exist after download: ${fileName}`);
        }
        
        if (downloadedFile.size === 0) {
            throw new Error(`Downloaded file is empty: ${fileName}`);
        }

        if (downloadedFile.size < 1024) { // Less than 1KB
            throw new Error(`Downloaded file suspiciously small (${downloadedFile.size} bytes): ${fileName}`);
        }
    } catch (error) {
        console.error(`Error downloading ${fileName}:`, error);
        // Delete the potentially partially downloaded file
        try {
            await FileSystem.deleteAsync(fileUri, { idempotent: true });
        } catch (deleteError) {
            console.error('Failed to delete partial file:', deleteError);
        }
        throw error;
    }
};

export const clearMusicFolder = async () => {
    try {
        // Check if directory exists
        const dirInfo = await FileSystem.getInfoAsync(musicFolderPath);

        const musicFolderContents = await FileSystem.readDirectoryAsync(musicFolderPath);

        for (const item of musicFolderContents) {
            const itemPath = `${musicFolderPath}/${item}`;
            const itemInfo = await FileSystem.getInfoAsync(itemPath);
            console.log(`Item ${item}:`, itemInfo);
            await FileSystem.deleteAsync(itemPath, { idempotent: true });
        }

        return { success: true };
    } catch (error: any) {
        console.error('Failed to clear Music folder:', error);
        throw new Error(`Failed to clear Music folder: ${error.message}`);
    }
};

export const fetchAPIKeys = async () => {
    try {
        const keys = await Promise.all([
            databaseManagers.userSettings.getByKey('booksApiKey'),
            databaseManagers.userSettings.getByKey('moviesApiKey'),
            databaseManagers.userSettings.getByKey('spotifyClientId'),
            databaseManagers.userSettings.getByKey('spotifyClientSecret'),
            databaseManagers.userSettings.getByKey('igdbClientId'),
            databaseManagers.userSettings.getByKey('igdbClientSecret'),
        ]);

        return {
            booksApiKey: keys[0]?.value || '',
            moviesApiKey: keys[1]?.value || '',
            spotifyClientId: keys[2]?.value || '',
            spotifyClientSecret: keys[3]?.value || '',
            igdbClientId: keys[4]?.value || '',
            igdbClientSecret: keys[5]?.value || '',
        };
    } catch (error) {
        console.error('Failed to fetch API keys:', error);
        return {};
    }
};

export const saveAPIKey = async (key: string, value: string) => {
    try {
        const existingSetting = await databaseManagers.userSettings.getByKey(key);
        let newSetting: any = {
            settingKey: key,
            value: value.trim(),
            type: 'apiKey'
        };

        if (existingSetting && existingSetting.uuid) {
            newSetting.uuid = existingSetting.uuid;
        }

        await databaseManagers.userSettings.upsert(newSetting);
    } catch (error) {
        console.error(`Failed to save ${key}:`, error);
    }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};