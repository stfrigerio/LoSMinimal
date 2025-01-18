import { useState } from 'react';
import { AlertConfig } from '@/src/components/modals/AlertModal';

export const useAlerts = () => {
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

    const showAlert = (config: AlertConfig) => {
        setAlertConfig(config);
    };

    return { alertConfig, setAlertConfig, showAlert };
}; 