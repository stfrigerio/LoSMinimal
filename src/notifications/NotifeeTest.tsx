import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import notifee, { AndroidColor, AndroidImportance, AndroidStyle } from '@notifee/react-native';

const NotifeeTest = () => {
  // Function to create a notification channel
	const createChannel = async () => {
		await notifee.createChannel({
			id: 'default',
			name: 'Default Channel',
			importance: AndroidImportance.HIGH, // High importance for heads-up notifications
		});
	};

	// Function to display the notification
	const displayNotification = async () => {
		console.log('Requesting permissions...');
		const permissionGranted = await notifee.requestPermission();
		console.log('Permissions granted:', permissionGranted);
	
		console.log('Creating notification channel...');
		await createChannel();
	
		console.log('Displaying notification...');
		await notifee.displayNotification({
			title: '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
			subtitle: 'Personalized Experience',
			body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
			android: {
				channelId: 'default',
				smallIcon: 'ic_launcher',
				largeIcon: 'https://picsum.photos/200/200', // Add a large icon on the right
				autoCancel: false, // keeps the notification in the notification tray
				style: {
					type: AndroidStyle.BIGPICTURE,
					picture: 'https://picsum.photos/800/400', // Use a real image URL
				},
				color: '#4caf50',
			},
		});
	
		console.log('Notification displayed!');
	};
	
	return (
		<View style={styles.container}>
			<Button title="Show Test Notification" onPress={displayNotification} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default NotifeeTest;
