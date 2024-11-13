import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

import RightPanel from '../src/features/RightPanel/RightPanel';

import { useDrawerState } from '../src/contexts/DrawerState';

function RightDrawerNavigator() {
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
 
 export default function DrawerLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<StatusBar 
				barStyle="dark-content" 
				translucent 
				backgroundColor="rgba(0, 0, 0, 0.1)" 
			/>
			<RightDrawerNavigator />
		</GestureHandlerRootView>
	);
 }