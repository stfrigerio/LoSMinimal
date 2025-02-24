export interface Spacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

export interface BorderRadius {
    none: number;
    sm: number;
    md: number;
    lg: number;
    pill: number;
    circular: number;
}

export type FontWeight = 
	| 'normal' | 'bold' 
	| '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
	| 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface Typography {
    fontSize: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    fontWeight: {
        regular: FontWeight;
        medium: FontWeight;
        bold: FontWeight;
    };
    lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
    };
}

export interface Elevation {
    none: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    sm: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    md: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
}

export interface theme {
    backgroundColor: string;
    backgroundSecondary: string;
    textColor: string;
    textColorBold: string;
    textColorItalic: string;
    opaqueTextColor: string;
    borderColor: string;
    accentColor: string;
    accentColorShade: string;
    hoverColor: string;
    shadowColor: string;
    red: string;
    redOpacity: string;
    yellow: string;
    yellowOpacity: string;
    green: string;
    greenOpacity: string;
    blue: string;
    blueOpacity: string;
    gray: string;
}

export type ThemeName = 'light' | 'dark' | 'signalis';

export interface Theme {
    name: ThemeName;
    colors: theme;
    spacing: Spacing;
    borderRadius: BorderRadius;
    typography: Typography;
    elevation: Elevation;
}