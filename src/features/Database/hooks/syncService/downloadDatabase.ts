import * as FileSystem from 'expo-file-system';
import axios from 'axios';

import { 
    LOCAL_DB_PATH, 
    TEMP_DB_NAME, 
    TEMP_DB_SQLITE_PATH, 
    DOWNLOAD_TEMP_PATH 
} from './constants';
import { getFlaskServerURL } from '../../helpers/databaseConfig';
import { validateDBInSQLiteFolder } from './validateDB';

export async function downloadDatabase() {
    try {
        const flaskURL = await getFlaskServerURL();
    
        // 1) Check remote DB availability (optional, can skip if sure the endpoint is valid)
        await axios.get(`${flaskURL}/download_db`, { responseType: 'blob' });
    
        // 2) Download to a normal temp path (not in the SQLite folder)
        const { uri } = await FileSystem.downloadAsync(
            `${flaskURL}/download_db`,
            DOWNLOAD_TEMP_PATH
        );
        if (!uri) throw new Error('Download failed: no URI');
    
        // 3) Move/copy from the normal temp file -> docDir/SQLite/temp_download.db
        //    so we can open it with expo-sqlite by filename only.
        // First, delete any leftover 'temp_download.db' if it exists
        await FileSystem.deleteAsync(TEMP_DB_SQLITE_PATH, { idempotent: true }).catch(() => {});
        await FileSystem.moveAsync({
            from: DOWNLOAD_TEMP_PATH,
            to: TEMP_DB_SQLITE_PATH,
        });
    
        // 4) Validate by opening "temp_download.db" in docDir/SQLite
        await validateDBInSQLiteFolder(TEMP_DB_NAME);

        // 5) If valid, remove old 'LocalDB.db' and rename the temp file to 'LocalDB.db'
        await FileSystem.deleteAsync(LOCAL_DB_PATH, { idempotent: true }).catch(() => {});
        await FileSystem.moveAsync({
            from: TEMP_DB_SQLITE_PATH,
            to: LOCAL_DB_PATH,
        });
    
        return { success: true, message: 'Database downloaded and validated successfully' };
    } catch (error: any) {
        console.error('Download error:', error);
    
        // Cleanup
        try {
            await FileSystem.deleteAsync(DOWNLOAD_TEMP_PATH, { idempotent: true });
            await FileSystem.deleteAsync(TEMP_DB_SQLITE_PATH, { idempotent: true });
        } catch {}
    
        return {
            success: false,
            message: `Failed to download or validate DB: ${error.message || error}`
        };
    }
}