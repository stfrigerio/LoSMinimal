import { Redirect } from 'expo-router';
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function Index() {
    console.log('Index rendering');
    return <Redirect href="/(drawer)" />;
}