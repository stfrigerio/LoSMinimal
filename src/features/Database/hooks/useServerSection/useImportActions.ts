import * as FileSystem from 'expo-file-system';
import { databaseManagers } from '@/database/tables';
import { downloadDatabase } from '../syncService';
import { AlertConfig } from '@/src/components/modals/AlertModal';

interface ImportActionsProps {
    showAlert: (config: AlertConfig) => void;
    setIsImporting: (value: boolean) => void;
}

export const useImportActions = ({ showAlert, setIsImporting }: ImportActionsProps) => {
    const importDatabaseJson = async () => {
        const path = FileSystem.documentDirectory + 'database_backup.json';
        showAlert({
            title: 'Confirm Import',
            message: `Are you sure you want to import the JSON backup from:\n${path}?`,
            onConfirm: async () => {
                setIsImporting(true);
                try {
                    const jsonString = await FileSystem.readAsStringAsync(path);
                    const data = JSON.parse(jsonString);
                    
                    for (const table in data) {
                        for (const item of data[table]) {
                            const manager = databaseManagers[table as keyof typeof databaseManagers];
                            if (manager) {
                                try {
                                    if (table === 'userSettings') {
                                        const existingItem = await databaseManagers.userSettings.getByKey(item.settingKey);
                                        if (!existingItem) {
                                            await databaseManagers.userSettings.upsert(item);
                                        }
                                    } else {
                                        await manager.upsert(item);
                                    }
                                } catch (itemError) {
                                    console.warn(`Failed to upsert item in ${table}:`, itemError);
                                }
                            }
                        }
                    }
                    showAlert({
                        title: 'Success',
                        message: 'Database imported successfully',
                        onConfirm: () => {}
                    });
                } catch (error) {
                    console.error('Failed to import database:', error);
                    showAlert({
                        title: 'Error',
                        message: 'Failed to import database.',
                        onConfirm: () => {}
                    });
                } finally {
                    setIsImporting(false);
                }
            }
        });
    };

    const importDatabaseSqlite = async () => {
        showAlert({
            title: 'Confirm Import',
            message: 'Are you sure you want to import the SQLite database?',
            onConfirm: async () => {
                setIsImporting(true);
                try {
                    const result = await downloadDatabase();
                    if (result.success) {
                        showAlert({
                            title: 'Success',
                            message: 'SQLite database imported successfully',
                            onConfirm: () => {}
                        });
                    } else {
                        throw new Error(result.message);
                    }
                } catch (error) {
                    console.error('Failed to import SQLite database:', error);
                    showAlert({
                        title: 'Error',
                        message: `Failed to import SQLite database: ${error}`,
                        onConfirm: () => {}
                    });
                } finally {
                    setIsImporting(false);
                }
            }
        });
    };

    return { importDatabaseJson, importDatabaseSqlite };
}; 