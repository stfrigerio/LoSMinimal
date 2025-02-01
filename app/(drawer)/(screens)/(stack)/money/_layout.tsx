import { Stack } from 'expo-router';

export default function MoneyLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="list" />
            <Stack.Screen name="graph" />
        </Stack>
    );
}