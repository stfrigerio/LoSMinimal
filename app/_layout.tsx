import { Drawer } from 'expo-router/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DrawerStateProvider, useDrawerState } from '../src/contexts/DrawerState';
import { NavbarDrawerProvider } from '../src/contexts/NavbarContext';
import { ChecklistProvider } from '../src/contexts/checklistContext';
import { MusicPlayerProvider } from '../src/contexts/MusicPlayerContext';

import { useThemeStyles } from '../src/styles/useThemeStyles';
import Toast, { BaseToast } from 'react-native-toast-message';
import RightPanel from '../src/features/RightPanel/RightPanel';
import { InitializeDatabasesWrapper } from '@/database/databaseInitializer';
import { AppInitializer } from '../src/AppInitializer';

function DrawerNavigator() {
	const { isRightDrawerSwipeEnabled } = useDrawerState();
	
	return (
        <Drawer
            screenOptions={{
                drawerType: 'front',
                swipeEnabled: isRightDrawerSwipeEnabled,
                swipeEdgeWidth: 50,
                drawerStyle: {
                    width: 300,
                    backgroundColor: 'transparent',
                },
                headerShown: false,
                drawerPosition: 'right'
            }}
            drawerContent={(props: DrawerContentComponentProps) => (
                <RightPanel {...props} />
            )}
        />
	);
}

function App() {
    const { themeColors, theme } = useThemeStyles();
    const isDarkMode = theme === 'dark';
    const pathname = usePathname();
    const isHomepage = pathname === '/' || pathname === '/features/Home/Homepage';

	const toastConfig = {
        success: (internalState: any) => (
            themeColors && (
                <BaseToast
                    {...internalState}
                    style={{ 
                        borderLeftColor: themeColors.accentColor, 
                        backgroundColor: themeColors.backgroundSecondary 
                    }}
                    text1Style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: themeColors.textColorBold
                    }}
                    text2Style={{
                        fontSize: 13,
                        color: themeColors.textColor
                    }}
                />
            )
        )
    };
    
    return (
        <>
            <StatusBar 
                key={`status-bar-${isHomepage}-${isDarkMode}`}
                style={isHomepage ? 'light' : (isDarkMode ? 'light' : 'dark')}
                backgroundColor="transparent"
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AppInitializer />
                <InitializeDatabasesWrapper />
                <DrawerNavigator />
                <Toast config={toastConfig} />
            </GestureHandlerRootView>
        </>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <DrawerStateProvider>
                <NavbarDrawerProvider>
                    <ChecklistProvider>
                        <MusicPlayerProvider>
                            <App />
                        </MusicPlayerProvider>
                    </ChecklistProvider>
                </NavbarDrawerProvider>
            </DrawerStateProvider>
        </ThemeProvider>
    );
}