import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { ChecklistItem } from './components/ChecklistItem';
import { stripFrontmatter, isChecklistItem } from './utils/markdownParser';
import { useMarkdownContent } from './hooks/useMarkdownContent';

interface MarkdownProps {
    children: string;
    style?: any;
}

const MobileMarkdown: React.FC<MarkdownProps> = ({ children, style }) => {
    const { markdownStyles } = useThemeStyles();
    const { content, toggleChecklistItem } = useMarkdownContent(children);

    const renderLine = (line: string, index: number) => {
        if (isChecklistItem(line)) {
            return (
                <ChecklistItem
                    key={index}
                    text={line}
                    isChecked={line.includes('- [x]')}
                    onToggle={() => toggleChecklistItem(index)}
                />
            );
        }
        return <Markdown key={index} style={markdownStyles}>{line}</Markdown>;
    };

    return (
        <View>
            {stripFrontmatter(content).split('\n').map(renderLine)}
        </View>
    );
};

export default MobileMarkdown;