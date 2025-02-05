import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle, Text, Line, Path, Rect } from 'react-native-svg';
import * as d3 from 'd3';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { MoodNoteData } from '@/src/types/Mood';

interface MoodChartProps {
	moodData: MoodNoteData[];
	width: number;
	height: number;
}

type ProcessedMoodData = Omit<MoodNoteData, 'date'> & { date: Date };

const MoodChart: React.FC<MoodChartProps> = ({ moodData, width, height }) => {
	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);
	const [chartDimensions, setChartDimensions] = useState<{
		x: d3.ScaleTime<number, number>;
		y: d3.ScaleLinear<number, number>;
	} | null>(null);

	const [selectedMood, setSelectedMood] = useState<ProcessedMoodData | null>(null);

	const margin = { top: 20, right: 20, bottom: 30, left: 20 };
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	// Process and filter out any invalid dates or ratings (NaN/infinite)
	const processedData = useMemo(() => {
		return moodData
			.map(mood => ({
				...mood,
				date: new Date(mood.date),
				tag: mood.tag || 'untagged'
			}))
			.filter(mood => 
				!isNaN(mood.date.getTime()) && 
				isFinite(mood.rating)
			) as ProcessedMoodData[];
	}, [moodData]);

	useEffect(() => {
		const extentDates = d3.extent(processedData, d => d.date) as [Date, Date];
		// If we don't have valid extent, avoid setting dimensions.
		if (!extentDates[0] || !extentDates[1] || isNaN(extentDates[0].getTime()) || isNaN(extentDates[1].getTime())) {
			return;
		}

		const x = d3.scaleTime()
			.domain(extentDates)
			.range([0, chartWidth]);
	
		const y = d3.scaleLinear()
			.domain([1, 10]) // Fixed range 1-10
			.range([chartHeight, 0]);
	
		setChartDimensions({ x, y });
	}, [processedData, chartWidth, chartHeight]);

	const line = useMemo(() => {
		return d3.line<ProcessedMoodData>()
			.x(d => chartDimensions ? chartDimensions.x(d.date) : 0)
			.y(d => chartDimensions ? chartDimensions.y(d.rating) : 0)
			.defined(d => !isNaN(d.date.getTime()) && isFinite(d.rating))
			.curve(d3.curveMonotoneX); // Smooth curve interpolation
	}, [chartDimensions]);

	const colorScale = useMemo(() => {
		return d3.scaleLinear<string>()
			.domain([1, 5, 10])
			.range(['#FF6B6B', '#FFD93D', '#6BCB77'])
			.clamp(true);
	}, []);

	if (!chartDimensions) return null;

	const handleSelectMood = (mood: ProcessedMoodData) => {
		console.log('Pressed');
		setSelectedMood(mood);
	};

	return (
		<View style={{ width, height }}>
			<Svg width={width} height={height}>
				<G transform={`translate(${margin.left},${margin.top})`}>
					{/* Background Touchable Area */}
					<Rect
						x={0}
						y={0}
						width={chartWidth}
						height={chartHeight}
						fill="transparent"
						onPress={() => setSelectedMood(null)}
					/>

					{/* Horizontal grid lines */}
					{chartDimensions.y.ticks(5).map((tick, i) => (
						<Line
							key={`gridY-${i}`}
							x1={0}
							y1={chartDimensions.y(tick)}
							x2={chartWidth}
							y2={chartDimensions.y(tick)}
							stroke={themeColors.textColor}
							strokeOpacity={0.08}
							strokeDasharray="4,4"
						/>
					))}

					{/* Connecting lines between data points */}
					<Path
						d={line(processedData) ?? undefined}
						fill="none"
						stroke={themeColors.textColor}
						strokeWidth={1}
						strokeOpacity={0.7}
					/>

					{/* Y-axis */}
					<Line
						x1={0}
						y1={0}
						x2={0}
						y2={chartHeight}
						stroke={themeColors.borderColor}
						strokeOpacity={0.3}
					/>
					{chartDimensions.y.ticks(10).map((tick, i) => (
						<G key={i} transform={`translate(0,${chartDimensions.y(tick)})`}>
							<Text
								x={-9}
								dy=".32em"
								textAnchor="end"
								fill={themeColors.textColor}
								fontSize={10}
							>
								{tick}
							</Text>
						</G>
					))}

					{/* X-axis (dates) */}
					<G transform={`translate(0,${chartHeight})`}>
						{chartDimensions.x.ticks(6).map((tick, i) => (
							<G key={i} transform={`translate(${chartDimensions.x(tick)},0)`}>
								<Text
									y={12}
									dy=".71em"
									textAnchor="middle"
									fill={themeColors.textColor}
									fontSize={10}
									opacity={0.7}
									transform="rotate(45)"
								>
									{tick.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
								</Text>
							</G>
						))}
					</G>

					{/* Interactive Circles */}
					<G>
						{processedData.map((mood, index) => (
							<G key={index}>
								{/* Shadow Circle */}
								<Circle
									cx={chartDimensions.x(mood.date)}
									cy={chartDimensions.y(mood.rating)}
									r={6}
									fill={colorScale(mood.rating)}
									opacity={0.3}
								/>

								{/* Main Circle */}
								<Circle
									cx={chartDimensions.x(mood.date)}
									cy={chartDimensions.y(mood.rating)}
									r={4}
									fill={colorScale(mood.rating)}
									stroke="white"
									strokeWidth={1}
								/>

								{/* Invisible Larger Circle for Touch */}
								<Circle
									cx={chartDimensions.x(mood.date)}
									cy={chartDimensions.y(mood.rating)}
									r={10}
									fill="transparent"
									onPress={() => handleSelectMood(mood)}
								/>
							</G>
						))}
					</G>

					{/* Tooltip */}
					{selectedMood && (
						<G>
							<Rect
								x={chartDimensions.x(selectedMood.date) - 80}
								y={chartDimensions.y(selectedMood.rating) - 70}
								width={160}
								height={70}
								rx={5}
								fill={themeColors.backgroundSecondary}
								stroke={themeColors.borderColor}
								strokeWidth={1}
							/>
							<Text
								x={chartDimensions.x(selectedMood.date)}
								y={chartDimensions.y(selectedMood.rating) - 55}
								fontSize={12}
								fill={themeColors.textColor}
								textAnchor="middle"
							>
								{selectedMood.date.toLocaleDateString()}
							</Text>
							<Text
								x={chartDimensions.x(selectedMood.date)}
								y={chartDimensions.y(selectedMood.rating) - 45}
								fontSize={12}
								fill={themeColors.textColor}
								textAnchor="middle"
							>
								{`Rating: ${selectedMood.rating}`}
							</Text>
							<Text
								x={chartDimensions.x(selectedMood.date)}
								y={chartDimensions.y(selectedMood.rating) - 30}
								fontSize={12}
								fill={themeColors.textColor}
								textAnchor="middle"
							>
								{`Tag: ${selectedMood.tag}`}
							</Text>
							{selectedMood.comment && (
								<Text
									x={chartDimensions.x(selectedMood.date)}
									y={chartDimensions.y(selectedMood.rating) - 15}
									fontSize={12}
									fill={themeColors.textColor}
									textAnchor="middle"
								>
									{`Note: ${selectedMood.comment.substring(0, 20)}${selectedMood.comment.length > 20 ? '...' : ''}`}
								</Text>
							)}
						</G>
					)}
				</G>
			</Svg>
		</View>
	);
};

const getStyles = (theme: any) => StyleSheet.create({});

export default MoodChart;