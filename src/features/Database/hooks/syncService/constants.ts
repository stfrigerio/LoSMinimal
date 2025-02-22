import * as FileSystem from 'expo-file-system';

// The special SQLite folder on iOS/Android:
export const SQLITE_DIR = `${FileSystem.documentDirectory}SQLite/`;

// The final database file that the app will use:
export const LOCAL_DB_NAME = 'LocalDB.db';
export const LOCAL_DB_PATH = `${SQLITE_DIR}${LOCAL_DB_NAME}`;

// Temporary filename (inside SQLite folder, for validation):
export const TEMP_DB_NAME = 'temp_download.db';
export const TEMP_DB_SQLITE_PATH = `${SQLITE_DIR}${TEMP_DB_NAME}`;

// Temporary download destination (before moving to SQLite folder):
export const DOWNLOAD_TEMP_PATH = `${FileSystem.cacheDirectory}temp_download.db`;

export const CHUNK_SIZE = 5; // Upload 5 images at a time

// Ensure the SQLite directory exists (needed for iOS compatibility)
FileSystem.makeDirectoryAsync(SQLITE_DIR, { intermediates: true })
    .catch(err => console.warn('Failed to create SQLite directory:', err));
