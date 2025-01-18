import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { getFlaskServerURL } from '@/src/features/Database/helpers/databaseConfig';
import { ProjectExportResponse } from './types';
import { Project } from '../types/types';
import { projectsDir } from '../constants';

const TEMP_EXPORT_DIR = `${FileSystem.documentDirectory}temp_export/`;

export const exportProjects = async (): Promise<ProjectExportResponse> => {
    try {
        const flaskURL = await getFlaskServerURL();
        
        // Create temp directory if it doesn't exist
        await FileSystem.makeDirectoryAsync(TEMP_EXPORT_DIR, { intermediates: true });

        // Get all project files from the projects directory
        const files = await FileSystem.readDirectoryAsync(projectsDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        const exportedFiles: { name: string; uri: string; type: string }[] = [];

        // Process each markdown file
        for (const mdFile of mdFiles) {
            const filePath = `${projectsDir}${mdFile}`;
            const content = await FileSystem.readAsStringAsync(filePath);
            
            // Copy file to temp directory
            const tempFilePath = `${TEMP_EXPORT_DIR}${mdFile}`;
            await FileSystem.writeAsStringAsync(tempFilePath, content);
            
            exportedFiles.push({
                name: mdFile,
                uri: tempFilePath,
                type: 'text/markdown'
            });
        }

        // Create form data with all files
        const formData = new FormData();
        exportedFiles.forEach(file => {
            formData.append('files', {
                uri: file.uri,
                name: file.name,
                type: file.type
            } as any);
        });

        // Upload to server
        const response = await axios.post(`${flaskURL}/project/upload_projects`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        // Clean up temp directory
        await FileSystem.deleteAsync(TEMP_EXPORT_DIR, { idempotent: true });

        return {
            success: true,
            message: `Successfully exported ${exportedFiles.length} projects`
        };

    } catch (error: any) {
        console.error('Export projects error:', error);
        // Clean up temp directory on error
        try {
            await FileSystem.deleteAsync(TEMP_EXPORT_DIR, { idempotent: true });
        } catch {}
        
        return {
            success: false,
            message: `Export failed: ${error.message}`
        };
    }
};