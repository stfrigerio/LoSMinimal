import { StyleSheet, TextStyle } from 'react-native';
import { lightTheme, darkTheme } from './theme';

export interface TextStyles {
	title: TextStyle;
	subtitle: TextStyle;
	input: TextStyle;
	text: TextStyle;
}

export const textStyles = (themeName: any): TextStyles => {
	const theme = themeName === 'light' ? lightTheme : darkTheme;

	return StyleSheet.create({
		title: {
			fontSize: 36,
			fontWeight: 'bold',
			color: theme.textColorBold,
			textAlign: 'center',
			marginBottom: 10,
			textShadowColor: theme.shadowColor,
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
		},
		subtitle: {
			fontSize: 18,
			color: theme.textColor,
			textAlign: 'center',
			marginBottom: 30,
			textShadowColor: theme.shadowColor,
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
		},
		text: {
			color: theme.textColor
		},
		input: {
			flexDirection: 'row',
			width: '100%',
			marginBottom: 15,
			padding: 12,
			borderWidth: 1,
			borderColor: theme.borderColor,
			borderRadius: 5,
			color: theme.textColor,
		},
	});
};