import React from 'react';
import { View } from 'react-native';

import { stripFrontmatter } from './utils/markdownParser';
import renderLine from './helpers/renderLine';

interface MarkdownProps {
    children: string;
    style?: any;
    onChange?: (content: string) => void;
    activeChecklists?: boolean;
    onCreateTask?: (title: string) => void;
}

const MobileMarkdown: React.FC<MarkdownProps> = ({ children, style, onChange, activeChecklists, onCreateTask }) => {
    const contentWithoutFrontmatter = stripFrontmatter(children);
    const lines = contentWithoutFrontmatter.split('\n');
    let insideCodeFence = false;

    return (
        <View>
            {lines.map((line, index) => {
                const { element, newInsideCodeFence } = renderLine(
                    line,
                    index,
                    lines,
                    insideCodeFence,
                    onChange,
                    activeChecklists,
                    onCreateTask,
                    children
                );
                insideCodeFence = newInsideCodeFence;
                return <View key={`line-${index}`}>{element}</View>;
            })}
        </View>
    );
};

export default MobileMarkdown;