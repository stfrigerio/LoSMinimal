// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark'); // Default while loading

    // Load theme when component mounts
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
        } catch (error) {
            console.error('Failed to load theme', error);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            await AsyncStorage.setItem('theme', newTheme);
            setTheme(newTheme);
        } catch (error) {
            console.error('Failed to save theme', error);
        }
    };

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('SHARED useTheme must be used within a ThemeProvider');
	}
	return context;
};