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
	accentColorShade: '#f0868b',
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
	gray: 'gray',
};

export const colorRainbow = {
	1: '#f8538f',
	2: '#5e4699',
	3: '#c45597',
	4: '#3c853a',
	5: '#aca14f',
	6: '#289f90',
	7: '#826ae0',
	8: '#9d95ac',
	9: '#3fabbe',
	10: '#324288',
	11: '#897d9a',
	12: '#c45597',
	13: '#897d9a',
	14: '#ac1639',
	15: '#e2ab15',
};

export const lightTheme = {
	backgroundColor: '#f7f2e4',
	backgroundSecondary: '#efebd4',
	textColor: '#808080',
	textColorBold: '#ebaf31',
	textColorItalic: '#cc8f0e',
	opaqueTextColor: 'rgba(92, 106, 114, 0.5)',
	borderColor: '#c7c7c7',
	accentColor: '#3fabbe',
	accentColorShade: '#7ad9eb',
	hoverColor: '#4a5962',

	shadowColor: 'rgba(250, 250, 250, 0.75)',

	red: 'rgb(250, 37, 37)',
	redOpacity: 'rgba(250, 37, 37, 0.8)',
	yellow: 'rgb(204, 197, 20)',
	yellowOpacity: 'rgba(204, 197, 20, 0.9)',
	green: 'rgb(61, 247, 52)',
	greenOpacity: 'rgba(61, 247, 52, 0.5)',
	blue: 'rgb(0, 122, 255)',
	blueOpacity: 'rgba(0, 122, 255, 0.5)',
	gray: 'gray',
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
			color: theme.accentColor,
			fontWeight: '700',
			marginVertical: 20,
			alignSelf: 'center',
		},
		heading2: {
			fontSize: 20,
			fontWeight: '600',
			color: theme.textColorBold,
			marginVertical: 10,
		},
		heading3: {
			fontSize: 16,
			fontWeight: '500',
			color: theme.accentColor,
			marginVertical: 10,
		},
		body: {
			fontSize: 16,
			fontFamily: 'serif',
			color: theme.textColor,
		},
		blockquote: {
			backgroundColor: theme.backgroundColor,
			borderColor: theme.accentColor,
			paddingLeft: 10,
			marginVertical: 10,
			opacity: 0.8,
			borderRadius: 10,
			fontSize: 14,
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
