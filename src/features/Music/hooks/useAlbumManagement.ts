import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

import { databaseManagers } from '@/database/tables';
import { Album } from '../types';
import { musicFolderPath } from '../../Library/helpers/LibrarySettingsHelper';

export const useAlbumManagement = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        try {
            const albumDirs = await FileSystem.readDirectoryAsync(musicFolderPath);
            const libraryAlbums = await databaseManagers.library.getLibrary({ 
                type: 'music' 
            });
    
            const loadedAlbums: Album[] = await Promise.all(
                albumDirs.map(async (albumName) => {
                    const albumPath = `${musicFolderPath}/${albumName}`;
                    const songs = await FileSystem.readDirectoryAsync(albumPath);
                    const libraryEntry = libraryAlbums.find(album => album.title === albumName);
                    return { 
                        name: albumName, 
                        songs,
                        uuid: libraryEntry?.uuid
                    };
                })
            );
            setAlbums(loadedAlbums);
        } catch (error) {
            console.error('Failed to load albums:', error);
        }
    };

    return {
        albums,
        selectedAlbum,
        setSelectedAlbum,
        loadAlbums
    };
}; 