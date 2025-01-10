import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { syncMarkedAlbums } from '../../../helpers/LibrarySettingsHelper';
import { AlertConfig } from '@/src/components/modals/AlertModal';

export const handleSyncMusic = async (setIsSyncing: (isSyncing: boolean) => void, setAlertConfig: (alertConfig: AlertConfig | null) => void) => {
    try {
        const result = await syncMarkedAlbums(setIsSyncing, setAlertConfig);
        if (result?.success) {
            Toast.show({
                type: 'success',
                text1: 'Sync Complete',
                text2: result.message
            });
        }
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Sync Error',
            text2: 'Failed to sync albums'
        });
    }
};