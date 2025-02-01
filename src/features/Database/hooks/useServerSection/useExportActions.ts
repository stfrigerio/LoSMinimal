import { databaseManagers } from '@/database/tables';
import { uploadDatabase } from '../syncService';
import { AlertConfig } from '@/src/components/modals/AlertModal';

interface ExportActionsProps {
    showAlert: (config: AlertConfig) => void;
    setIsExporting: (isExporting: boolean) => void;
}

export const useExportActions = ({ showAlert, setIsExporting }: ExportActionsProps) => {
    const exportDatabaseJson = async () => {
        setIsExporting(true);
        try {
            const data: Record<string, any> = {};
            for (const table in databaseManagers) {
                if (Object.prototype.hasOwnProperty.call(databaseManagers, table)) {
                    data[table] = await databaseManagers[table as keyof typeof databaseManagers].list();
                }
            }
            const jsonString = JSON.stringify(data);
            
            const result = await uploadDatabase(jsonString, 'json');
            if (result.success) {
                showAlert({
                    title: 'Success',
                    message: 'JSON backup uploaded successfully',
                    onConfirm: () => {}
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Failed to export JSON backup:', error);
            showAlert({
                title: 'Error',
                message: `Failed to export JSON backup: ${error}`,
                onConfirm: () => {}
            });
        } finally {
            setIsExporting(false);
        }
    };

    const exportDatabaseSqlite = async () => {
        setIsExporting(true);
        try {
            const result = await uploadDatabase();
            if (result.success) {
                showAlert({
                    title: 'Success',
                    message: result.message,
                    singleButton: true,
                    onConfirm: () => {}
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Failed to export SQLite database:', error);
            showAlert({
                title: 'Error',
                message: `Failed to export SQLite database: ${error}`,
                onConfirm: () => {},
                singleButton: true
            });
        } finally {
            setIsExporting(false);
        }
    };

    return { exportDatabaseJson, exportDatabaseSqlite };
}; 