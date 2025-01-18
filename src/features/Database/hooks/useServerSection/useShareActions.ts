import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { databaseManagers } from '@/database/tables';
import { AlertConfig } from '@/src/components/modals/AlertModal';

interface ShareActionsProps {
    showAlert: (config: AlertConfig) => void;
}

export const useShareActions = ({ showAlert }: ShareActionsProps) => {
    const shareBackupJson = async () => {
        try {
            const data: Record<string, any> = {};
            for (const table in databaseManagers) {
                if (Object.prototype.hasOwnProperty.call(databaseManagers, table)) {
                    data[table] = await databaseManagers[table as keyof typeof databaseManagers].list();
                }
            }
            
            const formattedJson = JSON.stringify(data, null, 2);
            
            const tempPath = FileSystem.documentDirectory + 'formatted_backup.json';
            await FileSystem.writeAsStringAsync(tempPath, formattedJson);
            await Sharing.shareAsync(tempPath, { UTI: '.json', mimeType: 'application/json' });
            await FileSystem.deleteAsync(tempPath, { idempotent: true });
        } catch (error) {
            console.error('Failed to share backup file:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to share backup file.',
                onConfirm: () => {}
            });
        }
    };

    const shareBackupSqlite = async () => {
        try {
            const dbPath = `${FileSystem.documentDirectory}SQLite/LocalDB.db`;
            await Sharing.shareAsync(dbPath, { 
                UTI: '.db',
                mimeType: 'application/x-sqlite3'
            });
        } catch (error) {
            console.error('Failed to share SQLite database:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to share SQLite database.',
                onConfirm: () => {}
            });
        }
    };

    return { shareBackupJson, shareBackupSqlite };
}; 