import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { Tabs } from 'expo-router';

import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DrawerStateProvider, useDrawerState } from '../src/contexts/DrawerState';
import { NavbarDrawerProvider } from '../src/contexts/NavbarContext';
import { ChecklistProvider } from '../src/contexts/checklistContext';
// import { MusicPlayerProvider } from '../src/contexts/MusicPlayerContext';

import TasksHub from './features/Tasks/Tasks';
import Homepage from './features/Home/Homepage';

import { useThemeStyles } from '../src/styles/useThemeStyles';
import Toast, { BaseToast } from 'react-native-toast-message';
import RightPanel from './features/RightPanel/RightPanel';
import { InitializeDatabasesWrapper } from '@/database/databaseInitializer';
import { AppInitializer } from './AppInitializer';


function DrawerNavigator() {
	const { isRightDrawerSwipeEnabled } = useDrawerState();
	
	return (
		<Drawer
			drawerContent={props => <RightPanel {...props} />}
			screenOptions={{
				drawerType: 'front',
				swipeEnabled: isRightDrawerSwipeEnabled,
				swipeEdgeWidth: 100,
				drawerStyle: {
					width: 300,
					backgroundColor: 'transparent',
				},
				headerShown: false,
				drawerPosition: 'right'
			}}
		>
			<Drawer.Screen 
				name="(drawer)" 
				options={{
					drawerLabel: "Home"
				}} 
			/>
		</Drawer>
	);
}

function App() {
    const { themeColors } = useThemeStyles();

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppInitializer />
            <StatusBar 
                translucent 
                backgroundColor="rgba(0, 0, 0, 0.1)" 
            />
            <InitializeDatabasesWrapper />
            <DrawerNavigator />
            <Toast config={toastConfig} />
        </GestureHandlerRootView>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <DrawerStateProvider>
                <NavbarDrawerProvider>
                    <ChecklistProvider>
                        {/* <MusicPlayerProvider> */}
                            <App />
                        {/* </MusicPlayerProvider> */}
                    </ChecklistProvider>
                </NavbarDrawerProvider>
            </DrawerStateProvider>
        </ThemeProvider>
    );
}