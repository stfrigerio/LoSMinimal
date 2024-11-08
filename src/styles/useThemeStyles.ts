import { useTheme } from '@/src/contexts/ThemeContext';
import { lightTheme, darkTheme, markdownStyles as createMarkdownStyles } from '@/src/styles/theme';
import { modalStyles, ModalStyles } from '@/src/styles/modal';
import { textStyles, TextStyles } from '@/src/styles/text';
import { StyleSheet, TextStyle } from 'react-native';

type StylesType = {
	modal: ModalStyles;
	text: TextStyles;
};

type MarkdownStylesType = {
	body: TextStyle;
	heading1: TextStyle;
	heading2: TextStyle;
};

export const useThemeStyles = () => {
	const themeContext = useTheme();
	const theme = themeContext?.theme || 'dark';
	const isDark = theme === 'dark';
	const themeColors = isDark ? darkTheme : lightTheme;

	const designs: StylesType = {
		modal: modalStyles(isDark ? 'dark' : 'light'),
		text: textStyles(isDark ? 'dark' : 'light'),
	};

	const markdownStyles = StyleSheet.create<MarkdownStylesType>(
		createMarkdownStyles(themeColors) as MarkdownStylesType
	);
	
	return {
		theme,
		themeColors,
		designs,
		markdownStyles
	};
};
