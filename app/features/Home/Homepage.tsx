import { StyleSheet, View, Text, ImageBackground, Pressable, Dimensions } from 'react-native';

import CustomCalendar from './components/Calendar/Calendar';

import { useThemeStyles } from '@/src/styles/useThemeStyles';

const Homepage = () => {
	const { designs } = useThemeStyles();

	return (
	<View style={styles.container}>
		<ImageBackground 
			source={require('@/assets/images/evening.jpg')}
			style={styles.backgroundImage}
			resizeMode="cover"
		>
			<View style={styles.overlay}>
				<View style={styles.content}>
					<CustomCalendar />
				</View>
			</View>
		</ImageBackground>
	</View>
  );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		width: Dimensions.get('window').width,
		height: '100%',
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	content: {
		alignItems: 'center',
		padding: 20,
	},
});

export default Homepage;