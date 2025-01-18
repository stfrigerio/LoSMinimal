import React from 'react';
import { Pressable, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { ChecklistItem } from './components/ChecklistItem';
import { stripFrontmatter, isChecklistItem } from './utils/markdownParser';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationPin, faTrash } from '@fortawesome/free-solid-svg-icons';

interface MarkdownProps {
    children: string;
    style?: any;
    onChange?: (content: string) => void;
    activeChecklists?: boolean;
    onCreateTask?: (title: string) => void;
}

const MobileMarkdown: React.FC<MarkdownProps> = ({ children, style, onChange, activeChecklists, onCreateTask }) => {
    const { markdownStyles, themeColors } = useThemeStyles();

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
                <View 
                    key={`line-${index}`}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <ChecklistItem
                        text={line}
                        isChecked={line.includes('- [x]')}
                        onToggle={() => toggleChecklistItem(index, line)}
                    />
                    {activeChecklists && (
                        <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                            <Pressable
                                style={{ padding: 10 }}
                                onPress={() => {
                                    const cleanText = line.replace(/- \[(x| )\] /, '');
                                    onCreateTask?.(cleanText);
                                }}
                            >
                                <FontAwesomeIcon icon={faLocationPin} color={themeColors.gray} />
                            </Pressable>
                            <Pressable
                                style={{ padding: 10 }}
                                onPress={() => {
                                    const lines = children.split('\n');
                                    // Find the actual index of this line in the full content
                                    const actualIndex = lines.findIndex(l => l === line);

                                    if (actualIndex !== -1) {
                                        const newLines = lines.filter((_, i) => i !== actualIndex);
                                        onChange?.(newLines.join('\n'));
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} color={themeColors.gray} />
                            </Pressable>
                        </View>
                    )}
                </View>
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