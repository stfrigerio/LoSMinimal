import { useState } from 'react';

export const useMarkdownContent = (initialContent: string) => {
    const [content, setContent] = useState(initialContent);

    const toggleChecklistItem = (index: number) => {
        setContent(prevContent => {
            const lines = prevContent.split('\n');
            lines[index] = lines[index].includes('- [ ]')
                ? lines[index].replace('- [ ]', '- [x]')
                : lines[index].replace('- [x]', '- [ ]');
            return lines.join('\n');
        });
    };

    return {
        content,
        setContent,
        toggleChecklistItem
    };
};