import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

interface ProjectMetadata {
    id: string;
    title: string;
    description: string;
}

export async function loadProjectFiles() {
    try {
        // This path would point to your projects directory
        const projectsDir = FileSystem.documentDirectory + 'projects/';
        const files = await FileSystem.readDirectoryAsync(projectsDir);
        
        const projects = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async (file) => {
                    const content = await FileSystem.readAsStringAsync(
                        projectsDir + file
                    );
                    
                    // Parse the markdown front matter for metadata
                    const metadata = parseProjectMetadata(content);
                    
                    return {
                        id: file.replace('.md', ''),
                        title: metadata.title,
                        description: metadata.description,
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

function parseProjectMetadata(content: string): ProjectMetadata {
    // This is a simple example - you might want to use a proper front matter parser
    const lines = content.split('\n');
    const metadata: any = {};
    
    let i = 0;
    if (lines[0] === '---') {
        i++;
        while (i < lines.length && lines[i] !== '---') {
            const [key, value] = lines[i].split(':').map(s => s.trim());
            metadata[key] = value;
            i++;
        }
    }

    return {
        id: metadata.id || 'unknown',
        title: metadata.title || 'Untitled Project',
        description: metadata.description || 'No description provided',
    };
}