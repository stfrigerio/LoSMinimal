import { createProject } from './createProject';
import { loadProjectFiles } from './loadProjectFiles';
import { deleteProject } from './deleteProjects';
import { updateProject } from './updateProject';
import { calculateProjectCompletion } from './calculateCompletion';

export const projectsHelpers = {
    create: createProject as any,
    load: loadProjectFiles as any,
    delete: deleteProject as any,
    update: updateProject as any,
    calculateCompletion: calculateProjectCompletion as any,
};