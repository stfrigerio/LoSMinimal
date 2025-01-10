import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { clearMusicFolder } from '../../../helpers/LibrarySettingsHelper';

export const handleClearMusicFolder = async () => {
    try {
        await clearMusicFolder();
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Music folder cleared successfully'
        });
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to clear music folder'
        });
    }
};