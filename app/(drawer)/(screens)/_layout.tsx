import { Drawer } from 'expo-router/drawer';
import { useDrawerState } from '../../../src/contexts/DrawerState';
import RightPanel from '../../../src/features/RightPanel/RightPanel';
import { MusicPlayerProvider } from '@/src/contexts/MusicPlayerContext';
// import { PlaybackStatusProvider } from '@/src/contexts/PlaybackStatusContext';

export default function ScreensLayout() {
    const { isRightDrawerSwipeEnabled } = useDrawerState();

    return (
        // <PlaybackStatusProvider>
            <MusicPlayerProvider>
                <Drawer
                    drawerContent={props => <RightPanel {...props} />}
                    screenOptions={{
                        drawerType: 'front',
                        swipeEnabled: isRightDrawerSwipeEnabled,
                        swipeEdgeWidth: 30,
                        drawerStyle: {
                            width: 300,
                            backgroundColor: 'transparent',
                        },
                        headerShown: false,
                        drawerPosition: 'right',
                    }}
                >
                    <Drawer.Screen 
                        name="(stack)" 
                        options={{
                            headerShown: false,
                            swipeEdgeWidth: 30,
                        }}
                    />
                </Drawer>
            </MusicPlayerProvider>
        // </PlaybackStatusProvider>

    );
}