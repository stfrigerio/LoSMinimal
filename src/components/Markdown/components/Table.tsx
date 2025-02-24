import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface TableProps {
    content: string;
}

const Table: React.FC<TableProps> = ({ content }) => {
    const { markdownStyles, theme } = useThemeStyles();
    const screenWidth = Dimensions.get('window').width;
    const defaultColumnWidth = Math.min(150, screenWidth / 3); // Responsive column width

    const parseTable = (tableContent: string) => {
        const rows = tableContent.split('\n').filter(row => row.trim());
        const headers = rows[0]
            .split('|')
            .map(cell => cell.trim())
            .filter(cell => cell); // Remove empty cells
    
        const data = rows.slice(2).map(row =>
            row
                .split('|')
                .map(cell => cell.trim())
                .filter(cell => cell) // Remove empty cells
        );
    
        return { headers, data };
    };

    const { headers, data } = parseTable(content);

    const cellStyle = {
        padding: 8,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        width: defaultColumnWidth,
        justifyContent: 'center' as const,
    };

    const textStyle = {
        ...markdownStyles.body,
        fontSize: 14,
        flexShrink: 1,
    };

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            style={{ marginVertical: 10 }}
        >
            <View>
                {/* Render Table Headers */}
                <View style={{ flexDirection: 'row' }}>
                    {headers.map((header, index) => (
                        <View
                            key={`header-${index}`}
                            style={[
                                cellStyle,
                                {
                                    backgroundColor: theme.colors.backgroundSecondary,
                                }
                            ]}
                        >
                            <Text 
                                style={[textStyle, { fontWeight: 'bold' }]} 
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {header.replace(/\*\*/g, '')}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Render Table Rows */}
                {data.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={{ flexDirection: 'row' }}>
                        {row.map((cell, cellIndex) => (
                            <View
                                key={`cell-${rowIndex}-${cellIndex}`}
                                style={cellStyle}
                            >
                                <Text 
                                    style={textStyle}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {cell.replace(/\*\*/g, '')}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Table;