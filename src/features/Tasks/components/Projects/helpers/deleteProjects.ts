import * as FileSystem from 'expo-file-system';

export async function deleteProject(projectId: string) {
    try {
        const projectsDir = `${FileSystem.documentDirectory}projects/`;
        const filePath = `${projectsDir}${projectId}.md`;
        
        await FileSystem.deleteAsync(filePath);
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}