import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { getFlaskServerURL } from '../helpers/databaseConfig';
import axios from 'axios';
import { capitalizedTableNames } from '@/src/constants/tableNames';

const LOCAL_DB_PATH = `${FileSystem.documentDirectory}SQLite/LocalDB.db`;

export const uploadDatabase = async (
    data?: string,
    format: 'sqlite' | 'json' = 'sqlite'
): Promise<{ success: boolean; message: string }> => {
    try {
        const flaskURL = await getFlaskServerURL();
        console.log('Uploading to URL:', flaskURL); // Debug log

        const formData = new FormData();

        if (format === 'sqlite') {
            // Handle SQLite file upload
            const fileInfo = await FileSystem.getInfoAsync(LOCAL_DB_PATH);
            const fileContent = await FileSystem.readAsStringAsync(LOCAL_DB_PATH, { length: 16 });
            
            if (!fileInfo.exists) {
                throw new Error(`Database file not found at: ${LOCAL_DB_PATH}`);
            }
            if (!fileContent.startsWith('SQLite format')) {
                throw new Error('This is not a valid SQLite database file');
            }

            formData.append('file', {
                uri: fileInfo.uri,
                name: 'LocalDB.db',
                type: 'application/x-sqlite3'
            } as any);

            const response = await axios.post(`${flaskURL}/upload_${format}`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            return { 
                success: true, 
                message: `${format.toUpperCase()} data uploaded successfully` 
            };
        } else {
            if (!data) {
                throw new Error('No JSON data provided');
            }
            
            const tempPath = `${FileSystem.documentDirectory}temp_upload.json`;
            const formattedJson = JSON.stringify(JSON.parse(data), null, 2);
            await FileSystem.writeAsStringAsync(tempPath, formattedJson);

            const fileInfo = await FileSystem.getInfoAsync(tempPath);
            console.log('Temp file info:', fileInfo);

            if (!fileInfo.exists) {
                throw new Error('Failed to create temporary file');
            }

            formData.append('file', {
                uri: `file://${tempPath}`,
                name: 'database_backup.json',
                type: 'application/json'
            } as any);

            try {
                const response = await axios.post(`${flaskURL}/upload_${format}`, formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Response status:', response.status);
                console.log('Response data:', response.data);

                await FileSystem.deleteAsync(tempPath, { idempotent: true });
                return { 
                    success: true, 
                    message: `${format.toUpperCase()} data uploaded successfully` 
                };
            } finally {
                await FileSystem.deleteAsync(tempPath, { idempotent: true });
            }
        }
    } catch (error: any) {
        console.error('Upload error details:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
        return { success: false, message: `Upload failed: ${errorMessage}` };
    }
};

export const downloadDatabase = async (): Promise<{ success: boolean; message: string }> => {
    const tempDBPath = `${FileSystem.documentDirectory}temp_download.db`;

    try {
        const flaskURL = await getFlaskServerURL();
        
        // First check if the database exists on server
        await axios.get(`${flaskURL}/download_db`, {
            responseType: 'blob'
        });

        // Download to temporary location first
        const { uri } = await FileSystem.downloadAsync(
            `${flaskURL}/download_db`,
            tempDBPath
        );

        if (!uri) {
            throw new Error('Download failed');
        }

        // Validate that it's a SQLite file
        const fileContent = await FileSystem.readAsStringAsync(tempDBPath, { length: 16 });
        if (!fileContent.startsWith('SQLite format')) {
            await FileSystem.deleteAsync(tempDBPath, { idempotent: true });
            throw new Error('Downloaded file is not a valid SQLite database');
        }

        // Validate database structure
        const tempDB = await SQLite.openDatabaseAsync(tempDBPath);
        
        // Check for required tables
        for (const tableName of [...capitalizedTableNames, 'DeletionLog']) {
            const result = await tempDB.getFirstAsync<{ count: number }>(
                `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name=?;`,
                [tableName]
            );
            
            if (result?.count === 0) {
                await tempDB.closeAsync();
                await FileSystem.deleteAsync(tempDBPath, { idempotent: true });
                throw new Error(`Downloaded database is missing required table: ${tableName}`);
            }
        }

        // Close the temporary database connection
        await tempDB.closeAsync();

        // If all validations pass, move the temp file to final location
        await FileSystem.moveAsync({
            from: tempDBPath,
            to: LOCAL_DB_PATH
        });

        return { success: true, message: 'Database downloaded and validated successfully' };
    } catch (error: any) {
        // Clean up temp file if it exists
        try {
            await FileSystem.deleteAsync(tempDBPath, { idempotent: true });
        } catch {}

        console.error('Download error:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Download failed';
        return { success: false, message: `Download failed: ${errorMessage}` };
    }
};