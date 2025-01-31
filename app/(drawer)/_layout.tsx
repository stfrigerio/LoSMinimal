import { Drawer } from 'expo-router/drawer';
import { useDrawerState } from '../../src/contexts/DrawerState';
import LeftPanel from '../../src/features/LeftPanel/LeftPanel';
import RightPanel from '../../src/features/RightPanel/RightPanel';

export default function DrawerLayout() {
    const { isLeftDrawerSwipeEnabled, isRightDrawerSwipeEnabled } = useDrawerState();

    return (
        <Drawer
            drawerContent={props => <LeftPanel {...props} />}
            screenOptions={{
                drawerType: 'front',
                swipeEnabled: isLeftDrawerSwipeEnabled,
                swipeEdgeWidth: 30,
                drawerStyle: {
                    width: 300,
                    backgroundColor: 'transparent',
                },
                headerShown: false,
                drawerPosition: 'left',
            }}
        >
            <Drawer.Screen 
                name="(screens)" 
                options={{
                    headerShown: false,
                    swipeEdgeWidth: 30,
                }}
            />
        </Drawer>
    );
}