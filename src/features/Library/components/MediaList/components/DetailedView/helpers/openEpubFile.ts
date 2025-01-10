import { Platform, Linking } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { booksFolderPath } from '@/src/features/Library/helpers/BooksHelper';

const openEpubFile = async (item: any) => {
    try {
        const bookPath = `${booksFolderPath}/${item.title}`;
        const files = await FileSystem.readDirectoryAsync(bookPath);
        const epubFile = files.find((file: string) => file.toLowerCase().endsWith('.epub'));
        
        if (epubFile) {
            const filePath = `${bookPath}/${epubFile}`;
            
            if (Platform.OS === 'ios') {
                await Linking.openURL(`file://${filePath}`);
            } else {
                // For Android, use Sharing
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(filePath, {
                        UTI: 'com.apple.ibooks.epub', // for iOS
                        mimeType: 'application/epub+zip', // for Android
                        dialogTitle: 'Open with...'
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error opening EPUB file:', error);
        // You might want to show an error message to the user
    }
};

export default openEpubFile;