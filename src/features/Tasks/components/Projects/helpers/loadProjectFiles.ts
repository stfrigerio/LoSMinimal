import * as FileSystem from 'expo-file-system';
import { Project } from '../types/types';

export async function loadProjectFiles() {
    try {
        const projectsDir = `${FileSystem.documentDirectory}projects/`;
        const dirInfo = await FileSystem.getInfoAsync(projectsDir);

        if (!dirInfo.exists) {
            try {
                await FileSystem.makeDirectoryAsync(projectsDir, { intermediates: true });
            } catch (error) {
                console.error('Failed to create directory:', error);
            }
        }

        const files = await FileSystem.readDirectoryAsync(projectsDir);

        const projects = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async (file) => {
                    const content = await FileSystem.readAsStringAsync(
                        projectsDir + file
                    );
                    
                    // Parse the markdown content to extract metadata
                    const { metadata } = parseMarkdown(content);
                    
                    return {
                        id: file.replace('.md', ''),
                        title: metadata.title || 'Untitled Project',
                        status: metadata.status || 'active',
                        description: metadata.description || 'No description provided',
                        markdown: content,
                    };
                })
        );

        return projects;
    } catch (error) {
        console.error('Error loading project files:', error);
        return [];
    }
}

function parseMarkdown(content: string) {
    const lines = content.split('\n');
    const metadata: Record<string, string> = {};
    let markdownContent = '';
    
    if (lines[0] === '---') {
        let i = 1;
        while (i < lines.length && lines[i] !== '---') {
            const [key, value] = lines[i].split(':').map(s => s.trim());
            if (key) metadata[key] = value;
            i++;
        }
        markdownContent = lines.slice(i + 1).join('\n');
    } else {
        markdownContent = content;
    }

    return {
        metadata,
        content: markdownContent,
    };
}