import { View } from 'react-native';

import Homepage from '../../src/features/Home/Homepage';

export default function Home() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Homepage />
		</View>
	);
}