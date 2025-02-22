import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { UploadFormat, UploadResponse } from './types';
import { LOCAL_DB_PATH } from './constants';
import { getFlaskServerURL } from '../../helpers/databaseConfig';
import { uploadAllImages } from './imageUpload';

const uploadSqliteDatabase = async (flaskURL: string): Promise<UploadResponse> => {
    const dbFormData = new FormData();
    const fileInfo = await FileSystem.getInfoAsync(LOCAL_DB_PATH);
    const fileContent = await FileSystem.readAsStringAsync(LOCAL_DB_PATH, { length: 16 });

    if (!fileInfo.exists) {
        throw new Error(`Database file not found at: ${LOCAL_DB_PATH}`);
    }
    if (!fileContent.startsWith('SQLite format')) {
        throw new Error('This is not a valid SQLite database file');
    }

    dbFormData.append('file', {
        uri: fileInfo.uri,
        name: 'LocalDB.db',
        type: 'application/x-sqlite3'
    } as any);

    await axios.post(`${flaskURL}/upload_sqlite`, dbFormData, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });

    let imageResults = { totalImages: 0, totalSaved: 0, totalDuplicates: 0 };
    try {
        imageResults = await uploadAllImages(flaskURL);
    } catch (error) {
        console.error('Image upload failed:', error);
        // Continue execution - database upload was successful
    }

    const { totalImages, totalSaved, totalDuplicates } = imageResults;
    const successMessage = totalImages > 0 
        ? `Database uploaded successfully. Processed ${totalImages} images (${totalSaved} saved, ${totalDuplicates} duplicates skipped)`
        : 'Database uploaded successfully';

    return { success: true, message: successMessage };
};

const uploadJsonDatabase = async (flaskURL: string, data: string): Promise<UploadResponse> => {
    const tempPath = `${FileSystem.documentDirectory}temp_upload.json`;
    const formattedJson = JSON.stringify(JSON.parse(data), null, 2);
    await FileSystem.writeAsStringAsync(tempPath, formattedJson);

    try {
        const fileInfo = await FileSystem.getInfoAsync(tempPath);
        if (!fileInfo.exists) {
            throw new Error('Failed to create temporary file');
        }

        const formData = new FormData();
        formData.append('file', {
            uri: `file://${tempPath}`,
            name: 'database_backup.json',
            type: 'application/json'
        } as any);

        await axios.post(`${flaskURL}/upload_json`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        return { 
            success: true, 
            message: 'JSON data uploaded successfully' 
        };
    } finally {
        await FileSystem.deleteAsync(tempPath, { idempotent: true });
    }
};

export const uploadDatabase = async (
    data?: string,
    format: UploadFormat = 'sqlite'
): Promise<UploadResponse> => {
    try {
        const flaskURL = await getFlaskServerURL();

        if (format === 'sqlite') {
            return await uploadSqliteDatabase(flaskURL);
        } else {
            if (!data) {
                throw new Error('No JSON data provided');
            }
            return await uploadJsonDatabase(flaskURL, data);
        }
    } catch (error: any) {
        console.error('Upload error details:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
        return { success: false, message: `Upload failed: ${errorMessage}` };
    }
}; 