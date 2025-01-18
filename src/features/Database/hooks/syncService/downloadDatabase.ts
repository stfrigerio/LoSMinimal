import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import { UploadResponse } from './types';
import { LOCAL_DB_PATH, TEMP_DB_PATH } from './constants';
import { getFlaskServerURL } from '../../helpers/databaseConfig';
import { capitalizedTableNames } from '@/src/constants/tableNames';

const validateDownloadedDB = async (dbPath: string): Promise<void> => {
    const fileContent = await FileSystem.readAsStringAsync(dbPath, { length: 16 });
    if (!fileContent.startsWith('SQLite format')) {
        throw new Error('Downloaded file is not a valid SQLite database');
    }

    const tempDB = await SQLite.openDatabaseAsync(dbPath);
    
    try {
        for (const tableName of [...capitalizedTableNames]) {
            const result = await tempDB.getFirstAsync<{ count: number }>(
                `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name=?;`,
                [tableName]
            );
            
            if (result?.count === 0) {
                throw new Error(`Downloaded database is missing required table: ${tableName}`);
            }
        }
    } finally {
        await tempDB.closeAsync();
    }
};

export const downloadDatabase = async (): Promise<UploadResponse> => {
    try {
        const flaskURL = await getFlaskServerURL();
        
        // Check if database exists on server
        await axios.get(`${flaskURL}/download_db`, {
            responseType: 'blob'
        });

        // Download to temporary location
        const { uri } = await FileSystem.downloadAsync(
            `${flaskURL}/download_db`,
            TEMP_DB_PATH
        );

        if (!uri) {
            throw new Error('Download failed');
        }

        await validateDownloadedDB(TEMP_DB_PATH);

        // Move validated file to final location
        await FileSystem.moveAsync({
            from: TEMP_DB_PATH,
            to: LOCAL_DB_PATH
        });

        return { success: true, message: 'Database downloaded and validated successfully' };
    } catch (error: any) {
        // Clean up temp file if it exists
        try {
            await FileSystem.deleteAsync(TEMP_DB_PATH, { idempotent: true });
        } catch {}

        console.error('Download error:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Download failed';
        return { success: false, message: `Download failed: ${errorMessage}` };
    }
}; 