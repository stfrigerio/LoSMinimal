import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { getFlaskServerURL } from '@/src/features/Database/helpers/databaseConfig';
import { ProjectExportResponse } from './types';
import { Project } from '../types/types';

import { projectsDir } from '../constants';

const TEMP_IMPORT_DIR = `${FileSystem.documentDirectory}temp_import/`;

export const importProjects = async (): Promise<ProjectExportResponse> => {
    try {
        const flaskURL = await getFlaskServerURL();

        // Ensure the projects directory exists
        const dirInfo = await FileSystem.getInfoAsync(projectsDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(projectsDir, { intermediates: true });
        }

        // Download projects from server
        const response = await axios.get(`${flaskURL}/project/download_projects`, {
            responseType: 'json'
        });

        const projects: Project[] = response.data;
        let importedCount = 0;

        // Process each project
        for (const project of projects) {
            try {
                if (!project.id || !project.markdown) {
                    console.warn('Invalid project data:', project);
                    continue;
                }

                const fileName = `${project.id}.md`;
                const filePath = `${projectsDir}/${fileName}`; // Fixed path separator

                // Write project content to file
                await FileSystem.writeAsStringAsync(filePath, project.markdown);
                console.log(`Successfully wrote file: ${filePath}`);
                importedCount++;
            } catch (error) {
                console.warn(`Failed to import project ${project.title}:`, error);
            }
        }

        // Verify files were written
        try {
            const files = await FileSystem.readDirectoryAsync(projectsDir);
        } catch (error) {
            console.warn('Error reading directory:', error);
        }

        return {
            success: true,
            message: `Successfully imported ${importedCount} projects`
        };

    } catch (error: any) {
        console.error('Import projects error:', error);
        return {
            success: false,
            message: `Import failed: ${error.message}`
        };
    }
};