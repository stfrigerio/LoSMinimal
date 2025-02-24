import { Drawer } from 'expo-router/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast, { BaseToast } from 'react-native-toast-message';

import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DrawerStateProvider } from '../src/contexts/DrawerState';
import { NavbarDrawerProvider } from '../src/contexts/NavbarContext';
import { ChecklistProvider } from '../src/contexts/checklistContext';
import { MusicPlayerProvider } from '../src/contexts/MusicPlayerContext';
import { InitializeDatabasesWrapper } from '@/database/databaseInitializer';
import { AppInitializer } from '../src/AppInitializer';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
// Create a separate component for the theme-dependent content
function AppContent() {
    const { theme } = useThemeStyles();
    const isDarkMode = theme.name === 'dark';
    const pathname = usePathname();
    const isHomepage = pathname === '/' || pathname === '/features/Home/Homepage';

    const toastConfig = {
        success: (internalState: any) => (
            theme && (
                <BaseToast
                    {...internalState}
                    style={{ 
                        borderLeftColor: theme.colors.accentColor, 
                        backgroundColor: theme.colors.backgroundSecondary 
                    }}
                    text1Style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: theme.colors.textColorBold
                    }}
                    text2Style={{
                        fontSize: 13,
                        color: theme.colors.textColor
                    }}
                />
            )
        )
    };

    return (
        <>
            <StatusBar 
                style={isHomepage ? 'light' : (isDarkMode ? 'light' : 'dark')}
                backgroundColor="transparent"
            />
            <ChecklistProvider>
                <DrawerStateProvider>
                    <NavbarDrawerProvider>
                        <AppInitializer />
                        <InitializeDatabasesWrapper />
                        <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
                            <Slot />
                        </SafeAreaView>
                    </NavbarDrawerProvider>
                </DrawerStateProvider>
                <Toast config={toastConfig} />
            </ChecklistProvider>
        </>
    );
}

function ThemedRootLayout() {
    const { theme } = useThemeStyles();
    
    return (
        <SafeAreaProvider
            style={{ 
                flex: 1, 
                backgroundColor: theme.colors.backgroundColor 
            }}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <AppContent />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

function RootLayout() {
    return (
        <ThemeProvider>
            <ThemedRootLayout />
        </ThemeProvider>
    );
}


export default RootLayout;