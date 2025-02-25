import { StyleSheet, TextStyle } from 'react-native';
import { Theme } from './types';

export interface TextStyles {
	title: TextStyle;
	subtitle: TextStyle;
	input: TextStyle;
	text: TextStyle;
}

export const textStyles = (theme: Theme): TextStyles => {
	return StyleSheet.create({
		title: {
			fontSize: 36,
			fontWeight: 'bold',
			color: theme.colors.textColorBold,
			textAlign: 'center',
			marginBottom: 10,
			textShadowColor: theme.colors.shadowColor,
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
			...(theme.name === 'signalis' && {
				fontFamily: theme.typography.fontFamily.primary,
				fontSize: 36,
				fontWeight: 'normal',
				color: theme.colors.accentColor,
				textShadowColor: theme.colors.accentColor,
				textShadowOffset: { width: 1, height: 1 },
				textShadowRadius: 6,
			})
		},
		subtitle: {
			fontSize: 18,
			color: theme.colors.textColor,
			textAlign: 'center',
			marginBottom: 30,
			textShadowColor: theme.colors.shadowColor,
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
		},
		text: {
			color: theme.colors.textColor,
            fontFamily: theme.name === 'signalis' ? theme.typography.fontFamily.secondary : theme.typography.fontFamily.primary,
			fontSize: theme.name === 'signalis' ? 18 : undefined,
		},
		input: {
			flexDirection: 'row',
			width: '100%',
			marginBottom: 15,
			padding: 12,
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			borderRadius: 5,
			color: theme.colors.textColor,
			fontFamily: theme.name === 'signalis' ? theme.typography.fontFamily.secondary : theme.typography.fontFamily.primary,
			...(theme.name === 'signalis' && {
				fontSize: theme.typography.fontSize.lg,
			}),
		},
	});
};