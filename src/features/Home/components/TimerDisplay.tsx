import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { formatSecondsToHMS } from '@/src/utils/timeUtils';
import { databaseManagers } from '@/database/tables';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { GlitchText } from '@/src/styles/GlitchText';
interface TimerDisplayProps {
	initialSeconds: number;
	tagName?: string;
	description?: string;
	registerTimer: (timerFunction: () => number) => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ initialSeconds, tagName, description, registerTimer }) => {
	const [seconds, setSeconds] = useState(initialSeconds);
	const secondsRef = useRef(initialSeconds);
	const [emoji, setEmoji] = useState<string>('');
	const [descriptionEmoji, setDescriptionEmoji] = useState<string>('');

	const { theme, designs } = useThemeStyles();
	const styles = getStyles(theme);

	useEffect(() => {
		setSeconds(initialSeconds); // Reset seconds state when initialSeconds changes
		secondsRef.current = initialSeconds; // Update the ref to the new initial value

		const intervalId = setInterval(() => {
				setSeconds(prevSeconds => {
						const newSeconds = prevSeconds + 1;
						secondsRef.current = newSeconds;
						return newSeconds;
				});
		}, 1000);

		registerTimer(() => secondsRef.current);

		return () => {
				clearInterval(intervalId);
				registerTimer(() => 0);
		};
	}, [initialSeconds, registerTimer]);

	useEffect(() => {
		const fetchEmojis = async () => {
			const emojiMapping: { [key: string]: string } = {};

			const defaultTags = await databaseManagers.tags.getTagsByType('timeTag');
			defaultTags.forEach(tag => {
				emojiMapping[tag.text] = tag.emoji;
			});
			const defaultDescription = await databaseManagers.tags.getTagsByType('timeDescription');
			defaultDescription.forEach(desc => {
				emojiMapping[desc.text] = desc.emoji;
			});

			const tagEmoji = emojiMapping[tagName || ''] || '';
			const descEmoji = emojiMapping[description || ''] || tagEmoji;
			setEmoji(tagEmoji);
			setDescriptionEmoji(descEmoji);
		};

		fetchEmojis();
	}, [tagName, description]);

	return (
		<View style={[
			styles.timerFlexContainer,
			{
				left: 0,
				right: 0,
				bottom: 5,
			}
		]}>
			<View style={[
				styles.timerContentWrapper, 
				{ 
					flexDirection: 'column', 
					gap: 6,
				}
			]}>
				<View style={styles.tagContainer}>
					<Text style={[styles.timerTag]} numberOfLines={1} ellipsizeMode="tail">
						{emoji} {tagName}
					</Text>
				</View>
				<View style={styles.descriptionContainer}>
					<Text style={[styles.timerDescription]} numberOfLines={1} ellipsizeMode="tail">
						{descriptionEmoji} {description}
					</Text>
				</View>
				<View>
					<GlitchText
						style={styles.timer}
						glitch={theme.name === 'signalis'}
					>
						{formatSecondsToHMS(seconds)}
					</GlitchText>
				</View>
			</View>
		</View>
	);
};


const getStyles = (theme: Theme) => StyleSheet.create({
	timerFlexContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	timerContentWrapper: {
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	tagContainer: {
		flex: 3.4,
		marginRight: 2,
	},
	descriptionContainer: {
		flex: 3,
		marginRight: 2,
	},
	timerTag: {
		fontWeight: 'bold',
		color: theme.name === 'light' ? '#d3c6aa': theme.colors.textColor,
		fontFamily: theme.typography.fontFamily.secondary,
		fontSize: 10,
		...(theme.name === 'signalis' && {
			fontSize: 10,
			fontFamily: theme.typography.fontFamily.primary,
			fontWeight: 'normal',
			color: theme.colors.textColorItalic,
			textShadowColor: theme.colors.accentColor,
			textShadowOffset: { width: 1, height: 1 },
			textShadowRadius: 6,
		})
	},
	timerDescription: {
		color: theme.name === 'light' ? '#d3c6aa': theme.colors.textColor,
		fontFamily: theme.typography.fontFamily.secondary,
		fontSize: 10,
		opacity: 0.8,
		...(theme.name === 'signalis' && {
			fontSize: 12,
			fontFamily: theme.typography.fontFamily.secondary,
			fontWeight: 'normal',
			color: theme.colors.textColor,
			textShadowColor: theme.colors.accentColor,
			textShadowOffset: { width: 1, height: 1 },
			textShadowRadius: 6,
		})
	},
	timer: {
		color: theme.name === 'light' ? '#d3c6aa': theme.colors.textColor,
		fontFamily: theme.typography.fontFamily.secondary,
		fontWeight: theme.name === 'signalis' ? 'normal' : 'bold',
		fontSize: theme.name === 'signalis' ? 14 : 10,
		minWidth: 30,
		textAlign: 'right',
	},
});

export default TimerDisplay;
