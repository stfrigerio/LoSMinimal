import { Stack } from 'expo-router';

export default function TimeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="timeline" />
            <Stack.Screen name="list" />
        </Stack>
    );
}