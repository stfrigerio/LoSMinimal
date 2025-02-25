import { useMemo } from 'react';
import { StyleSheet, TextStyle } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { markdownStyles as createMarkdownStyles, ThemeName } from '@/src/styles/theme';
import { modalStyles, ModalStyles } from '@/src/styles/modal';
import { textStyles, TextStyles } from '@/src/styles/text';
import { Theme } from '@/src/styles/types';
export type { Theme };

type StylesType = {
	modal: ModalStyles;
	text: TextStyles;
};

type MarkdownStylesType = {
	body: TextStyle;
	heading1: TextStyle;
	heading2: TextStyle;
	heading3: TextStyle;
	blockquote: TextStyle;
	code_inline: TextStyle;
	fence: TextStyle;
	hr: TextStyle;
	list_item: TextStyle;
	bullet_list: TextStyle;
	ordered_list: TextStyle;
	strong: TextStyle;
	em: TextStyle;
};


export const useThemeStyles = () => {
	const { theme, themeName } = useTheme();

	// Memoize the designs so that they are only recalculated when themeName changes.
	const modalStyle = useMemo(() => modalStyles(theme.name), [theme.name]);
	const textStyle = useMemo(() => textStyles(theme), [theme]);
	
	const designs: StylesType = useMemo(() => ({
		modal: modalStyle,
		text: textStyle,
	}), [modalStyle, textStyle]);

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