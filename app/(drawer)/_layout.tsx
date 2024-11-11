import { Drawer } from 'expo-router/drawer';

import LeftPanel from './features/LeftPanel/LeftPanel';
import { useDrawerState } from '../../src/contexts/DrawerState';

export default function DrawerLayout() {
	const { isLeftDrawerSwipeEnabled } = useDrawerState();

	return (
		<Drawer
			drawerContent={props => <LeftPanel {...props} />}
			screenOptions={{
				drawerType: 'front',
				swipeEnabled: isLeftDrawerSwipeEnabled,
				swipeEdgeWidth: 50,
				drawerStyle: {
					width: 300,
					backgroundColor: 'transparent',
				},
				headerShown: false,
				drawerPosition: 'left',
			}}
			id="root-drawer"
		>
            <Drawer.Screen 
                name="features/Home/Homepage" 
                options={{
                    drawerLabel: "Home"
                }} 
            />
            <Drawer.Screen 
                name="features/DailyNote/DailyNote" 
                options={{
                    drawerLabel: "Daily Note",
					unmountOnBlur: true,
                }} 
            />
            <Drawer.Screen 
                name="features/Tasks/Tasks" 
                options={{
                    drawerLabel: "Tasks"
                }} 
            />
			<Drawer.Screen 
				name="features/Mood/Mood" 
				options={{
					drawerLabel: "Mood"
				}} 
			/>
			<Drawer.Screen 
				name="features/UserSettings/UserSettings" 
				options={{
					drawerLabel: "Settings"
				}} 
			/>
        </Drawer>
	);
}