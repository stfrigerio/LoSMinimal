import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { ChecklistItem } from '../components/ChecklistItem';
import { HeaderComponent } from '../components/Headers';
import Table from '../components/Table';

import { isChecklistItem, isTable } from '../utils/markdownParser';
import { useCollapsibleHeaders } from './useCollapsibleheaders';
import { toggleChecklistItem } from '../helpers/useChecklistItem';
import { deleteChecklistItem } from '../helpers/useChecklistItem';

const renderLine = (
    line: string,
    index: number,
    lines: string[],
    insideCodeFence: boolean,
    onChange: ((content: string) => void) | undefined,
    activeChecklists: boolean | undefined,
    onCreateTask: ((title: string) => void) | undefined,
    children: string
) => {
    const { markdownStyles } = useThemeStyles();
    // todo this was breaking the journal
    // const { 
    //     isHeader, 
    //     toggleSection, 
    //     getIsCollapsed, 
    //     collapsedSections 
    // } = useCollapsibleHeaders();

    // Handle code fence blocks
    if (line.startsWith('```')) {
        if (!insideCodeFence) {
            // Start of a new code block
            let codeEnd = index + 1;
            while (codeEnd < lines.length) {
                if (lines[codeEnd].startsWith('```')) {
                    break;
                }
                codeEnd++;
            }
            
            // Extract code block content including the fence markers
            const codeContent = lines.slice(index, codeEnd + 1).join('\n');
            return { element: <Markdown key={`code-${index}`} style={markdownStyles}>{codeContent}</Markdown>, newInsideCodeFence: true };
        } else {
            // End of a code block
            return { element: null, newInsideCodeFence: false };
        }
    }

    // If we're inside a code block, skip rendering this line
    if (insideCodeFence) {
        return { element: null, newInsideCodeFence: true };
    }

    // Handle headers
    // if (isHeader(line)) {
    //     return {
    //         element: (
    //             <HeaderComponent
    //                 key={`header-${index}`}
    //                 line={line}
    //                 isCollapsed={!!collapsedSections[index]}
    //                 onToggle={() => toggleSection(index)}
    //                 markdownStyles={markdownStyles}
    //             />
    //         ),
    //         newInsideCodeFence: false
    //     };
    // }

    // Handle tables
    if (isTable(line, lines[index + 1])) {
        let tableEnd = index;
        while (tableEnd < lines.length && lines[tableEnd].trim().startsWith('|')) {
            tableEnd++;
        }

        const tableContent = lines.slice(index, tableEnd).join('\n');
        return {
            element: (
                <View key={`table-${index}`}>
                    <Table content={tableContent} />
                </View>
            ),
            newInsideCodeFence: false
        };
    }

    // Handle checklist items
    const checklistInfo = isChecklistItem(line);
    if (checklistInfo.isChecklist) {
        return {
            element: (
                <ChecklistItem
                    key={`line-${index}`}
                    text={line}
                    isChecked={line.includes('- [x]')}
                    onToggle={() => onChange && toggleChecklistItem(index, line, children, onChange)}
                    showActions={activeChecklists}
                    onCreateTask={onCreateTask}
                    onDelete={() => onChange && deleteChecklistItem(index, line, children, onChange)}
                    indentLevel={checklistInfo.indentLevel}
                />
            ),
            newInsideCodeFence: false
        };
    }

    // Default rendering for regular lines
    return { element: <Markdown key={index} style={markdownStyles}>{line}</Markdown>, newInsideCodeFence: false };
};

export default renderLine;