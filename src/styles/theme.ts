import { Platform } from 'react-native';
import { Theme, FontWeight } from './types';

// Design tokens
export const tokens = {
	spacing: {
		xxs: 2,
		xs: 4,
		sm: 8,
		md: 12,
		lg: 24,
		xl: 32,
		xxl: 48,
	},
	borderRadius: {
		none: 0,
		sm: 4,
		md: 8,
		lg: 16,
		pill: 999,
		circular: 9999,
	},
	typography: {
		fontFamily: {
			primary: 'System',
			secondary: 'serif',
			mono: 'monospace',
		},
		fontSize: {
			xs: 12,
			sm: 14,
			md: 16,
			lg: 20,
			xl: 24,
			xxl: 32,
		},
		fontWeight: {
			regular: 'normal' as FontWeight,
			medium: '600' as FontWeight,
			bold: 'bold' as FontWeight,
		},
		lineHeight: {
			tight: 1.25,
			normal: 1.5,
			relaxed: 1.75,
		},
	},
	elevation: {
		none: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
		},
		sm: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.15,
			shadowRadius: 3,
			elevation: 2,
		},
		md: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.25,
			shadowRadius: 5,
			elevation: 5,
		},
	},
};


export const darkTheme: Theme = {
	name: 'dark',
	colors: {
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
	},
	...tokens,
	typography: {
        ...tokens.typography,
        fontFamily: {
            primary: 'system',
            secondary: 'serif',
            mono: 'SpaceMono',
        },
    }
};

export const lightTheme: Theme = {
	name: 'light',
	colors: {
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
	},
	...tokens,
};

export const signalisTheme: Theme = {
	name: 'signalis',
	colors: {
		backgroundColor: 'rgb(12, 12, 12)',
		backgroundSecondary: '#1a1a1a',
		textColor: '#ffffff',
		textColorBold: '#c79428',
		textColorItalic: '#CBA95F',
		opaqueTextColor: 'rgba(255, 255, 255, 0.5)',
		borderColor: '#1c1c1c',
		accentColor: '#FF0000',
		accentColorShade: '#7f0000',
		hoverColor: '#ffffff',

		shadowColor: 'rgba(0, 0, 0, 1)',

		red: 'rgb(255, 0, 0)',
		redOpacity: 'rgba(250, 37, 37, 0.8)',
		yellow: 'rgb(204, 197, 20)',
		yellowOpacity: 'rgba(204, 197, 20, 0.9)',
		green: 'rgb(61, 247, 52)',
		greenOpacity: 'rgba(61, 247, 52, 0.5)',
		blue: 'rgb(0, 122, 255)',
		blueOpacity: 'rgba(0, 122, 255, 0.5)',
		gray: 'gray',
	},
	...tokens,
	typography: {
        ...tokens.typography,
        fontFamily: {
            primary: 'BigBlueTerm437NerdFont',
            secondary: 'PokemonDP',
            mono: 'SpaceMono',
        },
    },
	borderRadius: {
		...tokens.borderRadius,
		sm: 0,
		md: 0,
		lg: 0,
		pill: 0
	},
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

export const markdownStyles = (theme: Theme) => {
	const isDesktop = Platform.OS === 'web';
	// https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
	return {
		heading1: {
			fontSize: theme.typography.fontSize.xl,
			color: theme.colors.accentColor,
			fontWeight: theme.typography.fontWeight.bold,
			marginVertical: theme.spacing.lg,
			alignSelf: 'center',
		},
		heading2: {
			fontSize: theme.typography.fontSize.lg,
			fontWeight: theme.typography.fontWeight.medium,
			color: theme.colors.textColorBold,
			marginVertical: theme.spacing.md,
		},
		heading3: {
			fontSize: theme.typography.fontSize.md,
			fontWeight: theme.typography.fontWeight.medium,
			color: theme.colors.accentColor,
			marginVertical: theme.spacing.md,
		},
		body: {
			fontSize: theme.typography.fontSize.md,
			fontFamily: 'serif',
			color: theme.colors.textColor,
		},
		blockquote: {
			backgroundColor: theme.colors.backgroundColor,
			borderColor: theme.colors.accentColor,
			paddingLeft: theme.spacing.md,
			marginVertical: theme.spacing.md,
			opacity: 0.8,
			borderRadius: theme.borderRadius.md,
			fontSize: theme.typography.fontSize.sm,
		},
		code_inline: {
			backgroundColor: theme.colors.backgroundSecondary,
			color: theme.colors.textColorBold,
			fontSize: theme.typography.fontSize.sm,
		},
		fence: {
			backgroundColor: theme.colors.backgroundSecondary,
			borderColor: theme.colors.borderColor,
			paddingLeft: theme.spacing.md,
			marginVertical: theme.spacing.md,
			opacity: 0.8,
			borderRadius: theme.borderRadius.md,
		},
		hr: {
			marginVertical: theme.spacing.md,
			backgroundColor: theme.colors.borderColor,
		},
		list_item: {
			marginBottom: theme.spacing.xs,
		},
		bullet_list: {
			marginBottom: theme.spacing.md,
		},
		ordered_list: {
			marginBottom: theme.spacing.md,
		},
		strong: {
			fontWeight: 'bold',
			color: theme.colors.textColorBold
		},
		em: {
			fontStyle: 'italic',  
			color: theme.colors.textColorItalic
		},
	};  
};

export const lightNavigationTheme = {
	...lightTheme,
	dark: false,
	colors: {
		...lightTheme,
		primary: '#800020',
		background: lightTheme.colors.backgroundColor,
		card: lightTheme.colors.backgroundColor,
		text: lightTheme.colors.textColor,
		border: 'gray',
		notification: lightTheme.colors.backgroundColor,
	},
};
	
export const darkNavigationTheme = {
	...darkTheme,
	dark: true,
	colors: {
		...darkTheme,
		primary: '#800020',
		background: darkTheme.colors.backgroundColor,
		card: darkTheme.colors.backgroundColor,
		text: darkTheme.colors.textColor,
		border: 'gray',
		notification: darkTheme.colors.backgroundColor,
	},
};

export const themes = {
	light: lightTheme,
	dark: darkTheme,
	signalis: signalisTheme,
} as const;

export type ThemeName = keyof typeof themes;