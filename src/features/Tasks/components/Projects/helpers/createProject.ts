import * as FileSystem from 'expo-file-system';
import { Project } from '../types/types';

export async function createProject() {
    const project: Omit<Project, 'id'> = {
        title: 'New Project',
        description: 'This is a new project',
        markdown: `---
title: New Project
description: This is a new project
status: active
started: ${new Date().toISOString()}
---

# New Project

## Overview
Start writing your project details here...

## Tasks
- [ ] First task
- [ ] Second task

## Notes
Additional information...`
    };

    try {
        const projectsDir = `${FileSystem.documentDirectory}projects/`;
        
        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(projectsDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(projectsDir, { intermediates: true });
        }

        // Get existing projects to determine next ID
        const files = await FileSystem.readDirectoryAsync(projectsDir);
        const projectIds = files
            .filter(file => file.endsWith('.md'))
            .map(file => parseInt(file.replace('.md', ''), 10))
            .filter(id => !isNaN(id));

        // Get next ID (max + 1, or 1 if no projects exist)
        const nextId = projectIds.length > 0 ? Math.max(...projectIds) + 1 : 1;
        
        // Create the new project file
        const projectPath = `${projectsDir}${nextId}.md`;
        const content = `---
title: ${project.title}
description: ${project.description}
---

${project.markdown}`;

        await FileSystem.writeAsStringAsync(projectPath, content);
        console.log('Project created:', projectPath);
        
        return {
            ...project,
            id: nextId.toString()
        };
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
}