import { useMemo } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { markdownStyles as createMarkdownStyles, ThemeName } from '@/src/styles/theme';
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
	const { theme, themeName } = useTheme();

	// Memoize the designs so that they are only recalculated when themeName changes.
	const designs: StylesType = useMemo(() => ({
		modal: modalStyles(themeName as ThemeName),
		text: textStyles(themeName as ThemeName),
	}), [themeName]);

	// Memoize the markdown styles so they are only recalculated when the theme changes.
	const markdownStyles = useMemo<MarkdownStylesType>(() => 
		StyleSheet.create<MarkdownStylesType>(
			createMarkdownStyles(theme) as MarkdownStylesType
		),
	[theme]);

	// Bundle the theme properties into one object and memoize them.
	const bundledTheme = useMemo(() => ({
		name: themeName,
		colors: theme.colors,
		spacing: theme.spacing,
		typography: theme.typography,
		borderRadius: theme.borderRadius,
		elevation: theme.elevation,
	}), [theme, themeName]);

	const output = useMemo(() => ({
		theme: bundledTheme,
		designs,
		markdownStyles,
	}), [bundledTheme, designs, markdownStyles]);

	return output;
};