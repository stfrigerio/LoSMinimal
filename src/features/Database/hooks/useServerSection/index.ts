import { useState } from 'react';
import { useServerURL } from './useServerURL';
import { useBackupActions } from './useBackupActions';
import { useAlerts } from './useAlerts';

export const useServerSection = () => {
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    
    const { serverURL, setServerURL, saveServerURL } = useServerURL();
    const { alertConfig, setAlertConfig, showAlert } = useAlerts();
    const { showFormatSelector, handleBackupAction } = useBackupActions({ 
        showAlert, 
        setIsImporting,
        setIsExporting
    });

    return {
        serverURL,
        setServerURL,
        isImporting,
        isExporting,
        alertConfig,
        setAlertConfig,
        saveServerURL,
        showFormatSelector,
        handleBackupAction
    };
};

export type { BackupFormat, BackupAction } from './types'; 