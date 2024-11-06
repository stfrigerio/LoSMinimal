import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { lightTheme, darkTheme } from './theme';

export interface ModalStyles {
	modalContainer: ViewStyle;
	modalView: ViewStyle;
	closeButton: ViewStyle;
	closeButtonText: TextStyle;
	scrollView: ViewStyle;
	scrollViewContent: ViewStyle;
	tagsDescriptionModalView: ViewStyle;
}

export const modalStyles = (themeName: 'light' | 'dark'): ModalStyles => {
	const theme = themeName === 'light' ? lightTheme : darkTheme;
	return StyleSheet.create({
		modalContainer: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			justifyContent: 'center',
			alignItems: 'center',
		},
		modalView: {
			backgroundColor: theme.backgroundColor,
			borderRadius: 12,
			padding: 20,
			width: '90%',
			maxHeight: '80%',
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
		},
		closeButton: {
			position: 'absolute',
			top: 8,
			right: 8,
			padding: 8,
			zIndex: 1,
			borderRadius: 20,
		},
		closeButtonText: {
			fontSize: 20,
			color: theme.textColor,
			lineHeight: 20,
		},
		scrollView: {
			width: '100%',
		},
		scrollViewContent: {
			flexGrow: 1,
			paddingTop: 16,
		},
		tagsDescriptionModalView: {
			flex: 1,
			maxHeight: '90%',
			width: '80%',  
			backgroundColor: theme.backgroundColor,
			borderRadius: 20,
			borderWidth: 1,
			padding: 30,
			alignItems: 'center',
			shadowColor: '#000',
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