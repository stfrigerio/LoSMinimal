import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { databaseManagers } from '@/database/tables';
import { Album } from '../types';

export const useAlbumManagement = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        const musicDir = `${FileSystem.documentDirectory}Music`;
        try {
            const albumDirs = await FileSystem.readDirectoryAsync(musicDir);
            const libraryAlbums = await databaseManagers.library.getLibrary({ 
                type: 'music' 
            });
    
            const loadedAlbums: Album[] = await Promise.all(
                albumDirs.map(async (albumName) => {
                    const albumPath = `${musicDir}/${albumName}`;
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