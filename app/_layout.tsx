import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DrawerStateProvider, useDrawerState } from '../src/contexts/DrawerState';
import { NavbarDrawerProvider } from '../src/contexts/NavbarContext';
import { ChecklistProvider } from '../src/contexts/checklistContext';
// import { MusicPlayerProvider } from '../src/contexts/MusicPlayerContext';
import LeftPanel from './components/LeftPanel/LeftPanel';
import RightPanel from './components/RightPanel/RightPanel';

// Create a component for the nested drawer navigation
function DrawerNavigator() {
  const { isLeftDrawerSwipeEnabled, isRightDrawerSwipeEnabled } = useDrawerState();
  
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DrawerStateProvider>
        <NavbarDrawerProvider>
          <ChecklistProvider>
            {/* <MusicPlayerProvider> */}
              <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar 
                  barStyle="dark-content" 
                  translucent 
                  backgroundColor="rgba(0, 0, 0, 0.1)" 
                />
                <DrawerNavigator />
              </GestureHandlerRootView>
            {/* </MusicPlayerProvider> */}
          </ChecklistProvider>
        </NavbarDrawerProvider>
      </DrawerStateProvider>
    </ThemeProvider>
  );
}