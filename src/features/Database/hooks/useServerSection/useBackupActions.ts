import { BackupActionsProps, BackupAction, BackupFormat } from './types';
import { useExportActions } from './useExportActions';
import { useImportActions } from './useImportActions';
import { useShareActions } from './useShareActions';

export const useBackupActions = ({ showAlert, setIsImporting }: BackupActionsProps) => {
    const { exportDatabaseJson, exportDatabaseSqlite } = useExportActions({ showAlert });
    const { importDatabaseJson, importDatabaseSqlite } = useImportActions({ showAlert, setIsImporting });
    const { shareBackupJson, shareBackupSqlite } = useShareActions({ showAlert });

    const showFormatSelector = (action: BackupAction) => {
        showAlert({
            title: 'Select Format',
            message: 'Which format would you like to use?',
            onConfirm: () => {},
            customButtons: [
                {
                    text: 'JSON',
                    onPress: () => handleBackupAction(action, 'json')
                },
                {
                    text: 'SQLite',
                    onPress: () => handleBackupAction(action, 'sqlite')
                }
            ]
        });
    };

    const handleBackupAction = async (action: BackupAction, format: BackupFormat) => {
        const actions = {
            export: { json: exportDatabaseJson, sqlite: exportDatabaseSqlite },
            import: { json: importDatabaseJson, sqlite: importDatabaseSqlite },
            share: { json: shareBackupJson, sqlite: shareBackupSqlite }
        };

        await actions[action][format]();
    };

    return { showFormatSelector, handleBackupAction };
}; 