import React from 'react';
import { View, Pressable } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { ChecklistItem } from './components/ChecklistItem';
import { stripFrontmatter, isChecklistItem } from './utils/markdownParser';

import { toggleChecklistItem } from './helpers/useChecklistItem';
import { deleteChecklistItem } from './helpers/useChecklistItem';
import { useCollapsibleHeaders } from './helpers/useCollapsibleheaders';
import { HeaderComponent } from './components/Headers';

interface MarkdownProps {
    children: string;
    style?: any;
    onChange?: (content: string) => void;
    activeChecklists?: boolean;
    onCreateTask?: (title: string) => void;
}

const MobileMarkdown: React.FC<MarkdownProps> = ({ children, style, onChange, activeChecklists, onCreateTask }) => {
    const { markdownStyles, themeColors } = useThemeStyles();
    const { isHeader, toggleSection, getIsCollapsed, collapsedSections } = useCollapsibleHeaders();

    const renderLine = (line: string, index: number) => {
        if (isHeader(line)) {
            return (
                <HeaderComponent
                    line={line}
                    isCollapsed={!!collapsedSections[index]}
                    onToggle={() => toggleSection(index)}
                    markdownStyles={markdownStyles}
                />
            );
        }

        const previousHeaderIndex = [...contentWithoutFrontmatter.split('\n')]
            .slice(0, index)
            .reverse()
            .findIndex(l => isHeader(l));
        
        const isCollapsed = previousHeaderIndex !== -1 && 
            collapsedSections[index - previousHeaderIndex - 1];

        if (isCollapsed) {
            return null;
        }

        if (isChecklistItem(line)) {
            return (
                <ChecklistItem
                    key={`line-${index}`}
                    text={line}
                    isChecked={line.includes('- [x]')}
                    onToggle={() => onChange && toggleChecklistItem(index, line, children, onChange)}
                    showActions={activeChecklists}
                    onCreateTask={onCreateTask}
                    onDelete={() => onChange && deleteChecklistItem(index, line, children, onChange)}
                />
            );
        }

        return <Markdown key={index} style={markdownStyles}>{line}</Markdown>;
    };

    const contentWithoutFrontmatter = stripFrontmatter(children);

    return (
        <View>
            {contentWithoutFrontmatter.split('\n').map((line, index) => (
                <View key={`line-${index}`}>
                    {renderLine(line, index)}
                </View>
            ))}
        </View>
    );
};

export default MobileMarkdown;