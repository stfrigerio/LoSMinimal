
export const toggleChecklistItem = (index: number, originalLine: string, children: string, onChange: (content: string) => void) => {
    const lines = children.split('\n');
    const actualIndex = lines.findIndex(line => line === originalLine);
    
    if (actualIndex !== -1) {
        const newLines = [...lines];
        let movedLine = newLines[actualIndex];
        
        // Remove the line from its current position
        newLines.splice(actualIndex, 1);
        
        // Toggle the checkbox state
        if (movedLine.includes('- [ ]')) {
            movedLine = movedLine.replace('- [ ]', '- [x]');
            // Find "Done" section and add item after it
            const doneIndex = newLines.findIndex(line => line.trim() === '### Done');
            if (doneIndex !== -1) {
                newLines.splice(doneIndex + 1, 0, movedLine);
            }
        } else if (movedLine.includes('- [x]')) {
            movedLine = movedLine.replace('- [x]', '- [ ]');
            // Find "Active" section and add item after it
            const activeIndex = newLines.findIndex(line => line.trim() === '### Active');
            if (activeIndex !== -1) {
                newLines.splice(activeIndex + 1, 0, movedLine);
            }
        }
        
        onChange?.(newLines.join('\n'));
    }
};

export const deleteChecklistItem = (index: number, originalLine: string, children: string, onChange: (content: string) => void) => {
    const lines = children.split('\n');
    const actualIndex = lines.findIndex(line => line === originalLine);
    if (actualIndex !== -1) {
        const newLines = lines.filter((_, i) => i !== actualIndex);
        onChange?.(newLines.join('\n'));
    }
};