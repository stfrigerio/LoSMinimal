export const stripFrontmatter = (content: string) => {
    const match = content.match(/^---[\s\S]+?---\n([\s\S]*)/);
    return match ? match[1].trim() : content;
};

export const isChecklistItem = (line: string): { isChecklist: boolean, indentLevel: number } => {
    const match = line.match(/^(\t|\s{2,})*- \[[x ]\] /);
    if (!match) return { isChecklist: false, indentLevel: 0 };
    
    // Count the number of tab characters or double spaces for indentation
    const indentMatch = line.match(/^(\t|\s{2})*/);
    const indentStr = indentMatch?.[0] || '';
    
    // Calculate indent level by counting tabs or pairs of spaces
    const indentLevel = indentStr.replace(/\s{2}/g, '\t').length;
    
    console.log('line:', line, 'indentLevel:', indentLevel, 'indentStr:', JSON.stringify(indentStr));
    return { isChecklist: true, indentLevel };
};

export const isTable = (line: string, nextLine?: string): boolean => {
    if (!nextLine) return false;
    return (
        line.trim().startsWith('|') && // Current line starts with '|'
        nextLine.trim().startsWith('|') && // Next line starts with '|'
        nextLine.includes('-') // Next line contains '-' (table divider)
    );
};