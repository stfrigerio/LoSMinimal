export const calculateProjectCompletion = (content: string): number => {
    // Use greedy quantifier to capture entire Tasks section until next H2 or file end
    const tasksMatch = content.match(/## Tasks\s*([\s\S]*)(?=\n##|$)/);
    if (!tasksMatch) return 0;

    const tasksSection = tasksMatch[1]; // Extract the Tasks section content

    // Match all checklist items (- [ ] and - [x])
    const allChecklistItems = tasksSection.match(/^- \[[ x]\]/gm) || [];
    if (allChecklistItems.length === 0) return 0;

    // Match completed checklist items (- [x])
    const completedItems = tasksSection.match(/^- \[x\]/gm) || [];

    // Calculate completion percentage
    const percentage = Math.round((completedItems.length / allChecklistItems.length) * 100);

    return percentage;
};
