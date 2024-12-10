import * as FileSystem from 'expo-file-system';
import { Project } from '../types/types';

export async function updateProject(project: Project) {
    try {
        const projectDir = `${FileSystem.documentDirectory}projects/${project.id}.md`;
        
        // Save the content exactly as it is, without modifying or adding frontmatter
        await FileSystem.writeAsStringAsync(projectDir, project.markdown);
        
        return project;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
}