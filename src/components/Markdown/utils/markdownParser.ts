export const stripFrontmatter = (content: string) => {
    const match = content.match(/^---[\s\S]+?---\n([\s\S]*)/);
    return match ? match[1].trim() : content;
};

export const isChecklistItem = (line: string) => {
    return line.match(/- \[[x ]\] /);
};