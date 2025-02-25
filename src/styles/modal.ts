import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { themes } from './theme';  // Import themes
import { Theme, ThemeName } from './types';

export interface ModalStyles {
	modalContainer: ViewStyle;
	modalView: ViewStyle;
	title: TextStyle;
	closeButton: ViewStyle;
	closeButtonText: TextStyle;
	scrollView: ViewStyle;
	scrollViewContent: ViewStyle;
	tagsDescriptionModalView: ViewStyle;
}

export const modalStyles = (themeName: ThemeName): ModalStyles => {
    const theme = themes[themeName];  // Get the theme using themeName

	return StyleSheet.create({
		modalContainer: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			justifyContent: 'center',
			alignItems: 'center',
		},
		modalView: {
			backgroundColor: theme.colors.backgroundColor,
			borderRadius: theme.borderRadius.md,
			padding: theme.spacing.md,
			width: '90%',
			maxHeight: '80%',
			borderWidth: 1,
			borderColor: theme.colors.borderColor,
			shadowColor: theme.colors.shadowColor,
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
		},
		title: {
			fontSize: theme.typography.fontSize.xl,
			fontWeight: theme.typography.fontWeight.bold,
			color: `${theme.colors.textColorBold}DD`,
			textAlign: 'center',
			marginBottom: theme.spacing.md,
			textShadowColor: theme.colors.shadowColor,
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
			fontFamily: theme.typography.fontFamily.primary,
			...(theme.name === 'signalis' && {
				fontSize: 24,
				fontWeight: 'normal',
				color: theme.colors.textColorBold,
				textShadowColor: theme.colors.accentColor,
				textShadowOffset: { width: 1, height: 1 },
				textShadowRadius: 6,
			})
		},
		closeButton: {
			position: 'absolute',
			top: 12,
			right: 12,
			padding: 8,
			zIndex: 100,
			borderRadius: 20,
		},
		closeButtonText: {
			fontSize: theme.typography.fontSize.md,
			fontWeight: theme.typography.fontWeight.bold,
			color: theme.colors.gray,
			lineHeight: 20,
		},
		scrollView: {
			width: '100%',
		},
		scrollViewContent: {
			flexGrow: 1,
			paddingTop: theme.spacing.md,
		},
		tagsDescriptionModalView: {
			flex: 1,
			maxHeight: '90%',
			width: '80%',  
			backgroundColor: theme.colors.backgroundColor,
			borderRadius: theme.borderRadius.md,
			borderWidth: 1,
			padding: theme.spacing.md,
			alignItems: 'center',
			shadowColor: theme.colors.shadowColor,
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
	});
};