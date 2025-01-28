export const stripFrontmatter = (content: string) => {
    const match = content.match(/^---[\s\S]+?---\n([\s\S]*)/);
    return match ? match[1].trim() : content;
};

export const isChecklistItem = (line: string) => {
    return line.match(/- \[[x ]\] /);
};

export const isTable = (line: string, nextLine?: string): boolean => {
    if (!nextLine) return false;
    return (
        line.trim().startsWith('|') && // Current line starts with '|'
        nextLine.trim().startsWith('|') && // Next line starts with '|'
        nextLine.includes('-') // Next line contains '-' (table divider)
    );
};