import { Stack } from 'expo-router';

export default function MoodLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="list" />
            <Stack.Screen name="graph" />
        </Stack>
    );
}