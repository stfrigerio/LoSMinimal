import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeName } from '../styles/theme';
import { Theme } from '../styles/types';

interface ThemeContextType {
	themeName: ThemeName;
	theme: Theme;
	setTheme: (newTheme: ThemeName) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [themeName, setThemeName] = useState<ThemeName>('dark'); // Changed default to 'dark'

	useEffect(() => {
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem('theme') as ThemeName;
			if (savedTheme && savedTheme in themes) {
				setThemeName(savedTheme);
			}
		} catch (error) {
			console.error('Failed to load theme', error);
		}
	};

	const setTheme = async (newTheme: ThemeName) => {
		try {
			await AsyncStorage.setItem('theme', newTheme);
			setThemeName(newTheme);
		} catch (error) {
			console.error('Failed to save theme', error);
		}
	};

	// Memoize the context value to prevent unnecessary re-renders
	const value = useMemo(() => ({
		themeName,
		theme: themes[themeName],
		setTheme,
	}), [themeName]);

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};