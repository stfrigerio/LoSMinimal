import { booksFolderPath } from '@/src/features/Library/helpers/BooksHelper';
import * as FileSystem from 'expo-file-system';
import { NavigationProp } from '@react-navigation/native';
import { router } from 'expo-router';

export const openMarkdownViewer = async (
    item: any, 
    navigation: NavigationProp<any>
) => {
    try {
        const bookPath = `${booksFolderPath}/${item.title}`;
        const files = await FileSystem.readDirectoryAsync(bookPath);
        const mdFile = files.find(file => file.toLowerCase().endsWith('.md'));
        
        if (mdFile) {
            const filePath = `${bookPath}/${mdFile}`;
            const content = await FileSystem.readAsStringAsync(filePath);
            
            // Use router.push instead of navigation.navigate
            router.push({
                pathname: '/markdown-viewer',
                params: { 
                    title: item.title,
                    content: content
                }
            });
        }
    } catch (error) {
        console.error('Error opening markdown file:', error);
    }
};