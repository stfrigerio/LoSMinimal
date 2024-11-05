import { StyleSheet, View, Text, ImageBackground, Pressable, Dimensions } from 'react-native';

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
					<Text style={designs.text.title}>Welcome to LoS</Text>
					<Text style={designs.text.subtitle}>I need to do everything</Text>
					<Text style={designs.text.text}>Jesus f. Christ</Text>
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
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		alignItems: 'center',
		padding: 20,
	},
});

export default Homepage;