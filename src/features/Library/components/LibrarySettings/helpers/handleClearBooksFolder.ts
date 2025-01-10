import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { clearBooksFolder } from '../../../helpers/BooksHelper';

export const handleClearBooksFolder = async () => {
    try {
        await clearBooksFolder();
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Books folder cleared successfully'
        });
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to clear books folder'
        });
    }
};