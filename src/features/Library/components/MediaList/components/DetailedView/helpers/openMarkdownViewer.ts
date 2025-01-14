import { booksFolderPath } from '@/src/features/Library/helpers/BooksHelper';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';

export const saveMarkdownContent = async (title: string, content: string): Promise<void> => {
    try {
        const bookPath = `${booksFolderPath}/${title}`;
        const files = await FileSystem.readDirectoryAsync(bookPath);
        const mdFile = files.find(file => file.toLowerCase().endsWith('.md'));
        
        if (mdFile) {
            const filePath = `${bookPath}/${mdFile}`;
            await FileSystem.writeAsStringAsync(filePath, content);
        }
    } catch (error) {
        console.error('Error saving markdown file:', error);
        throw error;
    }
};

export const openMarkdownViewer = async (
    item: any, 
) => {
    try {
        const bookPath = `${booksFolderPath}/${item.title}`;
        const files = await FileSystem.readDirectoryAsync(bookPath);
        const mdFile = files.find(file => file.toLowerCase().endsWith('.md'));
        
        if (mdFile) {
            const filePath = `${bookPath}/${mdFile}`;
            const content = await FileSystem.readAsStringAsync(filePath);
            
            router.push({
                pathname: '/library/books/[title]/markdown-viewer',
                params: {
                    title: item.title,
                    content,
                }
            });
        }
    } catch (error) {
        console.error('Error opening markdown file:', error);
    }
};