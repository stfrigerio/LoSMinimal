import { Stack } from 'expo-router';

export default function LibraryTypeLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="[title]" />
        </Stack>
    );
}