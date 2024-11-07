import { Platform } from 'react-native';

export const darkTheme = {
	backgroundColor: '#212121',
	backgroundSecondary: '#333232',
	textColor: '#d3c6aa',
	textColorBold: '#c79428',
	textColorItalic: '#CBA95F',
	opaqueTextColor: 'rgba(211, 198, 170, 0.5)',
	borderColor: '#333232',
	accentColor: '#CC5359',
	accentColorShade: '#e66c72',
	hoverColor: '#ffffff',

	shadowColor: 'rgba(0, 0, 0, 1)',

	red: 'rgb(250, 37, 37)',
	redOpacity: 'rgba(250, 37, 37, 0.8)',
	yellow: 'rgb(204, 197, 20)',
	yellowOpacity: 'rgba(204, 197, 20, 0.9)',
	green: 'rgb(61, 247, 52)',
	greenOpacity: 'rgba(61, 247, 52, 0.5)',
	blue: 'rgb(0, 122, 255)',
	blueOpacity: 'rgba(0, 122, 255, 0.5)',
};

export const lightTheme = {
	primaryColor: '#800020',
	backgroundColor: '#fdf6e3',
	backgroundSecondary: '#efebd4',
	textColor: '#5c6a72',
	textColorBold: '#c79428',
	textColorItalic: '#CBA95F',
	opaqueTextColor: 'rgba(92, 106, 114, 0.5)',
	borderColor: '#dee2e6',
	accentColor: '#f8f9fa',
	accentColorShade: '#CD535B',
	hoverColor: '#4a5962',
	disabledColor: '#b0b8be',

	shadowColor: 'rgba(0, 0, 0, 0.75)',

	red: 'rgb(219, 0, 0)',
	redOpacity: 'rgba(219, 0, 0, 0.6)',
	yellow: 'rgb(156, 150, 0)',
	yellowOpacity: 'rgba(156, 150, 0, 0.6)',
	green: 'rgb(8, 153, 0)',
	greenOpacity: 'rgba(8, 153, 0, 0.6)',
	blue: 'rgb(136, 30, 217)',
	blueOpacity: 'rgba(136, 30, 217, 0.6)',
};

export const markdownStyles = (theme) => {
	const isDesktop = Platform.OS === 'web';
	// https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
	return {
		body: {
			color: theme.textColor,
		},
		heading1: {
			fontSize: 24,
			fontWeight: '700',
		},
		heading2: {
			fontSize: 20,
			fontWeight: '600',
		},
		body: {
			fontSize: 16,
			fontFamily: 'serif',
			color: theme.textColor,
		},
		blockquote: isDesktop ? {
			backgroundColor: theme.backgroundSecondary,
			borderLeftWidth: 4,
			borderLeftColor: theme.hoverColor,
			paddingLeft: 10,
			marginLeft: 10,
			marginBottom: 10,
			marginTop: 10,
			opacity: 0.8,
		} : {
			backgroundColor: theme.backgroundSecondary,
			borderColor: theme.hoverColor,
			paddingLeft: 10,
			marginLeft: 10,
			marginBottom: 10,
			opacity: 0.8,
			borderRadius: 10,
		},
		hr: {
			marginVertical: 10,
			backgroundColor: theme.borderColor,
		},
		list_item: {
			marginBottom: 5,
		},
		bullet_list: {
			marginBottom: 10,
		},
		ordered_list: {
			marginBottom: 10,
		},
		strong: {
			fontWeight: 'bold',
			color: theme.textColorBold
		},
		em: {
			fontStyle: 'italic',  
			color: theme.textColorItalic
		},
	};  
};

export const lightNavigationTheme = {
	...lightTheme,
	dark: false,
	colors: {
		...lightTheme,
		primary: '#800020',
		background: lightTheme.backgroundColor,
		card: lightTheme.backgroundColor,
		text: lightTheme.textColor,
		border: 'gray',
		notification: lightTheme.backgroundColor,
	},
};
	
export const darkNavigationTheme = {
	...darkTheme,
	dark: true,
	colors: {
		...darkTheme,
		primary: '#800020',
		background: darkTheme.backgroundColor,
		card: darkTheme.backgroundColor,
		text: darkTheme.textColor,
		border: 'gray',
		notification: darkTheme.backgroundColor,
	},
};

export const lightCalendar = {
	backgroundColor: 'transparent',
	calendarBackground: 'transparent',
	dayTextColor: lightTheme.textColor,
	textDisabledColor: lightTheme.disabledColor,
	todayTextColor: lightTheme.textColorItalic,
	monthTextColor: lightTheme.textColorItalic,
	arrowColor: 'gray',
	textSectionTitleColor: 'gray',
}

export const darkCalendar = {
	backgroundColor: 'transparent',
	calendarBackground: 'transparent',
	dayTextColor: darkTheme.textColor,
	textDisabledColor: darkTheme.opaqueTextColor,
	todayTextColor: darkTheme.textColorItalic,
	monthTextColor: darkTheme.textColorItalic,
	arrowColor: '#808080',
	textSectionTitleColor: '#808080',
}