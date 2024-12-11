// Add this new function
export const calculateProjectCompletion = (content: string): number => {
    // Find the Tasks section
    const tasksMatch = content.match(/## Tasks\n([\s\S]*?)(?=\n#|$)/);
    if (!tasksMatch) return 0;
    
    const tasksSection = tasksMatch[1];
    
    // Match all checklist items
    const checklistItems = tasksSection.match(/- \[[ x]\]/g) || [];
    if (checklistItems.length === 0) return 0;
    
    // Count completed items
    const completedItems = tasksSection.match(/- \[x\]/g)?.length || 0;
    
    return Math.round((completedItems / checklistItems.length) * 100);
};