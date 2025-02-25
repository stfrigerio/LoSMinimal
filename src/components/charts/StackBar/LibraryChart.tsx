import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';

import { colorRainbow } from '@/src/styles/theme';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface WeeklyData {
    movies: number[];
    series: number[];
    books: number[];
    videogames: number[];
    music: number[];
}

interface LibraryChartProps {
    weeklyData: WeeklyData;
    width?: number;
    height?: number;
}

export const LibraryChart: React.FC<LibraryChartProps> = ({ 
    weeklyData, 
    width = Dimensions.get('window').width - 32,
    height = 220 
}) => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

    const stackedData = useMemo(() => {
        const categories = Object.keys(weeklyData) as (keyof WeeklyData)[];
        const weeks = Array.from({ length: 52 }, (_, i) => i);
        
        const data = weeks.map(week => ({
            week: `W${week + 1}`,
            ...categories.reduce((acc, category) => ({
                ...acc,
                [category]: weeklyData[category][week] || 0
            }), {})
        }));

        const stack = d3.stack()
            .keys(categories)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        return stack(data as any);
    }, [weeklyData]);

    const scales = useMemo(() => {
        const xScale = d3.scaleBand()
            .domain(Array.from({ length: 52 }, (_, i) => `W${i + 1}`))
            .range([0, chartWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1])) || 0])
            .range([chartHeight, 0]);

        return { xScale, yScale };
    }, [stackedData, chartWidth, chartHeight]);

    const colors = {
        movies: colorRainbow[7],
        series: colorRainbow[6],
        books: colorRainbow[15],
        videogames: colorRainbow[1],
        music: colorRainbow[14],
    };

    return (
        <View style={styles.container}>
            <Svg width={width} height={height}>
                <G transform={`translate(${margin.left},${margin.top})`}>
                    {stackedData.map((layer, i) => (
                        <G key={layer.key}>
                            {layer.map((d, j) => {
                                const height = scales.yScale(d[0]) - scales.yScale(d[1]);
                                const y = scales.yScale(d[1]);
                                const x = scales.xScale(`W${j + 1}`);
                                const width = scales.xScale.bandwidth();

                                return (
                                    <Rect
                                        key={`${layer.key}-${j}`}
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={colors[layer.key as keyof typeof colors]}
                                        opacity={0.8}
                                    />
                                );
                            })}
                        </G>
                    ))}
                    
                    {/* X-axis */}
                    {scales.xScale.domain().filter((_, i) => i % 4 === 0).map((week) => (
                        <G key={`x-${week}`} transform={`translate(${scales.xScale(week)},${chartHeight})`}>
                            <SvgText
                                x={scales.xScale.bandwidth() / 2}
                                y={20}
                                fontSize={12}
                                fill={theme.colors.textColor}
                                textAnchor="middle"
                                fontFamily={theme.typography.fontFamily.secondary}
                            >
                                {week.toString().slice(1)} {/* Remove the 'W' prefix */}
                            </SvgText>
                        </G>
                    ))}

                    {/* Y-axis */}
                    {scales.yScale.ticks(5).map((tick) => (
                        <G key={`y-${tick}`} transform={`translate(0,${scales.yScale(tick)})`}>
                            <SvgText
                                x={-10}
                                fontSize={12}
                                fill={theme.colors.textColor}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fontFamily={theme.typography.fontFamily.secondary}
                            >
                                {tick}
                            </SvgText>
                        </G>
                    ))}
                </G>
            </Svg>
        </View>
    );
};

const getStyles = (theme: any, design: any) => StyleSheet.create({
    container: {
        marginTop: 16,
        paddingHorizontal: 24,
    },
});