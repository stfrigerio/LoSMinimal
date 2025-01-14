import { Drawer } from 'expo-router/drawer';
import { useDrawerState } from '../../../src/contexts/DrawerState';
import RightPanel from '../../../src/features/RightPanel/RightPanel';

export default function ScreensLayout() {
    const { isRightDrawerSwipeEnabled } = useDrawerState();

    return (
        <Drawer
            drawerContent={props => <RightPanel {...props} />}
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
        >
            <Drawer.Screen name="index" options={{ drawerLabel: "Home" }} />
            <Drawer.Screen 
                name="daily-note" 
                options={{ drawerLabel: "Daily Note" }}
                initialParams={{ date: undefined }}
            />
            <Drawer.Screen name="tasks" options={{ drawerLabel: "Tasks" }} />
            <Drawer.Screen name="mood" options={{ drawerLabel: "Mood" }} />
            <Drawer.Screen name="user-settings" options={{ drawerLabel: "Settings" }} />
            <Drawer.Screen name="database" options={{ drawerLabel: "Database" }} />
            <Drawer.Screen 
                name="periodic-note" 
                options={{ drawerLabel: "Periodic Note" }}
                initialParams={{ startDate: undefined, endDate: undefined }}
            />
            <Drawer.Screen name="money" options={{ drawerLabel: "Money" }} />
            <Drawer.Screen name="journal" options={{ drawerLabel: "Journal" }} />
            <Drawer.Screen name="people" options={{ drawerLabel: "People" }} />
            <Drawer.Screen name="library" options={{ drawerLabel: "Library" }} />
            <Drawer.Screen name="time" options={{ drawerLabel: "Time" }} />
        </Drawer>
    );
}