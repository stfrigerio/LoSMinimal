import { Drawer } from 'expo-router/drawer';

import LeftPanel from '../../src/features/LeftPanel/LeftPanel';
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
		>
            <Drawer.Screen 
                name="home" 
                options={{
                    drawerLabel: "Home"
                }} 
            />
            <Drawer.Screen 
                name="daily-note" 
                options={{
                    drawerLabel: "Daily Note",
                }}
				initialParams={{ date: undefined }}
            />
            <Drawer.Screen 
                name="tasks" 
                options={{
                    drawerLabel: "Tasks"
                }} 
            />
			<Drawer.Screen 
				name="mood" 
				options={{
					drawerLabel: "Mood"
				}} 
			/>
			<Drawer.Screen 
				name="user-settings" 
				options={{
					drawerLabel: "Settings"
				}} 
			/>
			<Drawer.Screen 
				name="database" 
				options={{
					drawerLabel: "Database"
				}} 
			/>
			<Drawer.Screen 
				name="periodic-note" 
				options={{
					drawerLabel: "Periodic Note"
				}} 
				initialParams={{ startDate: undefined, endDate: undefined }}
			/>
			<Drawer.Screen 
				name="money" 
				options={{
					drawerLabel: "Money"
				}} 
			/>
        </Drawer>
	);
}