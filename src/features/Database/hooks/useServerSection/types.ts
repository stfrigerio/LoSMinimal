import { AlertConfig } from '@/src/components/modals/AlertModal';

export type BackupFormat = 'json' | 'sqlite';
export type BackupAction = 'export' | 'import' | 'share';

export interface BackupActionsProps {
    showAlert: (config: AlertConfig) => void;
    setIsImporting: (value: boolean) => void;
    setIsExporting: (value: boolean) => void;
} 