import * as FileSystem from 'expo-file-system';

export const LOCAL_DB_PATH = `${FileSystem.documentDirectory}SQLite/LocalDB.db`;
export const TEMP_DB_PATH = `${FileSystem.documentDirectory}temp_download.db`;
export const CHUNK_SIZE = 5; 