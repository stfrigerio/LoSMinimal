import { Drawer } from 'expo-router/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNavigationState } from '@react-navigation/native';

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
import { BackHandler } from 'react-native';
import { useEffect } from 'react';

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
    const navState = useNavigationState(state => state);

    useEffect(() => {
        const onBackPress = () => {
            if (isHomepage) {
                // Exit the app if on the root screen
                BackHandler.exitApp();
                return true;
            }
            return false; // Allow default back navigation otherwise
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => subscription.remove();
    }, [navState]);

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
                {/* Move AppInitializer and InitializeDatabasesWrapper outside of the DrawerNavigator */}
                <AppInitializer />
                <InitializeDatabasesWrapper />
                <DrawerStateProvider>
                    <NavbarDrawerProvider>
                        <DrawerNavigator />
                    </NavbarDrawerProvider>
                </DrawerStateProvider>
                <Toast config={toastConfig} />
            </GestureHandlerRootView>
        </>
    );
}

export default function Layout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <ChecklistProvider>
                    <MusicPlayerProvider>
                        <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                            <App />
                        </SafeAreaView>
                    </MusicPlayerProvider>
                </ChecklistProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

