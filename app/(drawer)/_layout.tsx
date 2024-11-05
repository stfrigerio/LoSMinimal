import { Drawer } from 'expo-router/drawer';
import LeftPanel from '../components/LeftPanel/LeftPanel';
import { useDrawerState } from '../../src/contexts/DrawerState';

export default function DrawerLayout() {
	const { isLeftDrawerSwipeEnabled } = useDrawerState();

	return (
		<Drawer
			drawerContent={props => <LeftPanel {...props} />}
			screenOptions={{
				drawerType: 'front',
				swipeEnabled: isLeftDrawerSwipeEnabled,
				swipeEdgeWidth: 100,
				drawerStyle: {
				width: 300,
				backgroundColor: 'transparent',
				},
				headerShown: false,
				drawerPosition: 'left'
			}}
		/>
	);
}