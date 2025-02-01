import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right',
                fullScreenGestureEnabled: true,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen 
                name="daily-note" 
                initialParams={{ date: undefined }}
            />
            <Stack.Screen name="tasks" />
            <Stack.Screen name="mood" />
            <Stack.Screen name="user-settings" />
            <Stack.Screen name="database" />
            <Stack.Screen 
                name="periodic-note" 
                initialParams={{ startDate: undefined, endDate: undefined }}
            />
            <Stack.Screen name="money" />
            <Stack.Screen name="journal" />
            <Stack.Screen name="people" />
            <Stack.Screen name="library" />
            <Stack.Screen name="time" />
        </Stack>
    );
}