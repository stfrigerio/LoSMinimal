import { useState } from 'react';

export const useCollapsibleHeaders = () => {
    const [collapsedSections, setCollapsedSections] = useState<{ [key: number]: boolean }>({});

    const isHeader = (line: string) => /^#{1,6}\s/.test(line);

    const toggleSection = (index: number) => {
        setCollapsedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getIsCollapsed = (index: number, content: string) => {
        const lines = content.split('\n');
        const previousHeaderIndex = [...lines]
            .slice(0, index)
            .reverse()
            .findIndex(l => isHeader(l));
        
        return previousHeaderIndex !== -1 && 
            collapsedSections[index - previousHeaderIndex - 1];
    };

    return {
        isHeader,
        toggleSection,
        getIsCollapsed,
        collapsedSections,
    };
};