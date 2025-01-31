import { Drawer } from 'expo-router/drawer';
import { useDrawerState } from '@/src/contexts/DrawerState';
import RightPanel from '@/src/features/RightPanel/RightPanel';

export default function RightDrawerLayout() {
    const { isRightDrawerSwipeEnabled } = useDrawerState();

    return (
        <Drawer
            drawerContent={props => <RightPanel {...props} />}
            screenOptions={{
                drawerType: 'front',
                swipeEnabled: isRightDrawerSwipeEnabled,
                swipeEdgeWidth: 15,
                drawerStyle: {
                    width: 300,
                    backgroundColor: 'transparent',
                },
                headerShown: false,
                drawerPosition: 'right',
            }}
        >
            <Drawer.Screen name="index" />
        </Drawer>
    );
}