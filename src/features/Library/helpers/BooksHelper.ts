import * as FileSystem from 'expo-file-system';
import { databaseManagers } from '@/database/tables';
import { getFlaskServerURL } from '@/src/features/Database/helpers/databaseConfig';
import { AlertConfig } from '@/src/components/modals/AlertModal';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const booksFolderPath = `${FileSystem.documentDirectory}Books`;

export const syncMarkedBooks = async (
    setIsSyncing: (isSyncing: boolean) => void,
    setAlertConfig: (config: AlertConfig | null) => void
) => {
    setIsSyncing(true);
    let syncErrors: string[] = [];

    try {
        const markedBooks = await databaseManagers.library.getLibrary({ 
            type: 'book', 
            isMarkedForDownload: 1 
        });

        const allBooks = await databaseManagers.library.getLibrary({
            type: 'book'
        });

        const SERVER_URL = await getFlaskServerURL();

        // Remove unmarked books
        for (let book of allBooks) {
            if (!markedBooks.some(markedBook => markedBook.title === book.title)) {
                try {
                    await removeBook(book.title);
                } catch (error) {
                    syncErrors.push(`Failed to remove ${book.title}`);
                }
            }
        }

        // Sync marked books
        for (let book of markedBooks) {
            try {
                await syncBook(book, SERVER_URL);
            } catch (error) {
                syncErrors.push(`Failed to sync ${book.title}`);
                console.error(`Failed to sync book ${book.title}:`, error);
            }
        }

        if (syncErrors.length > 0) {
            setAlertConfig({
                title: 'Sync Completed with Errors',
                message: `Some books failed to sync:\n${syncErrors.join('\n')}`,
                onConfirm: () => {},
                singleButton: true
            });
            return { success: false, message: 'Sync completed with errors' };
        }

        return { success: true, message: 'All marked books have been synced successfully' };
    } catch (error) {
        console.error('Failed to sync books:', error);
        setAlertConfig({
            title: 'Sync Error',
            message: 'Failed to sync books. Please check the logs for details.',
            onConfirm: () => {},
            singleButton: true
        });
        return { success: false, message: 'Sync failed' };
    } finally {
        setIsSyncing(false);
    }
};

const syncBook = async (book: any, SERVER_URL: string) => {
    const response = await fetch(`${SERVER_URL}/book/sync/${encodeURIComponent(book.title)}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const files = await response.json();
    if (!Array.isArray(files)) {
        throw new Error('Invalid response format from server');
    }

    const bookPath = `${booksFolderPath}/${book.title}`;
    await FileSystem.makeDirectoryAsync(bookPath, { intermediates: true });

    for (let file of files) {
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                await downloadFile(book.title, file.name, bookPath);
                break;
            } catch (error) {
                console.error(`Failed to download ${file.name}, attempt ${retries + 1}:`, error);
                if (retries === MAX_RETRIES - 1) {
                    throw error;
                }
                retries++;
                await wait(RETRY_DELAY);
            }
        }
    }
};

const downloadFile = async (bookTitle: string, fileName: string, bookPath: string) => {
    const SERVER_URL = await getFlaskServerURL();
    const fileUrl = `${SERVER_URL}/book/file/${encodeURIComponent(bookTitle)}/${encodeURIComponent(fileName)}`;
    const fileUri = `${bookPath}/${fileName}`;

    try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists && fileInfo.size > 0) {
            console.log(`File already exists and is not empty: ${fileName}`);
            return;
        }

        const downloadResult = await FileSystem.downloadAsync(
            fileUrl,
            fileUri,
            {
                headers: {
                    'Accept': 'application/epub+zip,application/*;q=0.9,*/*;q=0.8',
                },
                cache: false
            }
        );

        if (downloadResult.status !== 200) {
            throw new Error(`Download failed with status: ${downloadResult.status}`);
        }

        const downloadedFile = await FileSystem.getInfoAsync(fileUri);
        if (!downloadedFile.exists || downloadedFile.size === 0) {
            throw new Error(`Downloaded file is invalid: ${fileName}`);
        }
    } catch (error) {
        console.error(`Error downloading ${fileName}:`, error);
        try {
            await FileSystem.deleteAsync(fileUri, { idempotent: true });
        } catch (deleteError) {
            console.error('Failed to delete partial file:', deleteError);
        }
        throw error;
    }
};

const removeBook = async (bookTitle: string) => {
    try {
        const bookPath = `${booksFolderPath}/${bookTitle}`;
        await FileSystem.deleteAsync(bookPath, { idempotent: true });
    } catch (error) {
        console.error(`Failed to remove book ${bookTitle}:`, error);
        throw error;
    }
};

export const clearBooksFolder = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(booksFolderPath);
        const booksFolderContents = await FileSystem.readDirectoryAsync(booksFolderPath);

        for (const item of booksFolderContents) {
            const itemPath = `${booksFolderPath}/${item}`;
            await FileSystem.deleteAsync(itemPath, { idempotent: true });
        }

        return { success: true };
    } catch (error: any) {
        console.error('Failed to clear Books folder:', error);
        throw new Error(`Failed to clear Books folder: ${error.message}`);
    }
};

export const hasMarkdownFile = async (title: string): Promise<boolean> => {
    try {
        const bookPath = `${booksFolderPath}/${title}`;
        const files = await FileSystem.readDirectoryAsync(bookPath);
        return files.some(file => file.toLowerCase().endsWith('.md'));
    } catch (error) {
        // console.error('Error checking for markdown file:', error);
        return false;
    }
};

export const hasEpubFile = async (title: string): Promise<boolean> => {
    try {
        const bookPath = `${booksFolderPath}/${title}`;
        const files = await FileSystem.readDirectoryAsync(bookPath);
        return files.some(file => file.toLowerCase().endsWith('.epub'));
    } catch (error) {
        // console.error('Error checking for epub file:', error);
        return false;
    }
};