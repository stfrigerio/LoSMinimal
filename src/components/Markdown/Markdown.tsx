import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { ChecklistItem } from './components/ChecklistItem';
import { stripFrontmatter, isChecklistItem } from './utils/markdownParser';

interface MarkdownProps {
    children: string;
    style?: any;
    onChange?: (content: string) => void;
}

const MobileMarkdown: React.FC<MarkdownProps> = ({ children, style, onChange }) => {
    const { markdownStyles } = useThemeStyles();

    const toggleChecklistItem = (index: number, originalLine: string) => {
        const lines = children.split('\n');
        // Find the actual index of this line in the full content
        const actualIndex = lines.findIndex(line => line === originalLine);
        
        if (actualIndex !== -1) {
            const newLines = [...lines];
            if (newLines[actualIndex].includes('- [ ]')) {
                newLines[actualIndex] = newLines[actualIndex].replace('- [ ]', '- [x]');
            } else if (newLines[actualIndex].includes('- [x]')) {
                newLines[actualIndex] = newLines[actualIndex].replace('- [x]', '- [ ]');
            }
            onChange?.(newLines.join('\n'));
        }
    };

    const renderLine = (line: string, index: number) => {
        if (isChecklistItem(line)) {
            return (
                <ChecklistItem
                    key={index}
                    text={line}
                    isChecked={line.includes('- [x]')}
                    onToggle={() => toggleChecklistItem(index, line)}
                />
            );
        }
        return <Markdown key={index} style={markdownStyles}>{line}</Markdown>;
    };

    const contentWithoutFrontmatter = stripFrontmatter(children);

    return (
        <View>
            {contentWithoutFrontmatter.split('\n').map(renderLine)}
        </View>
    );
};

export default MobileMarkdown;