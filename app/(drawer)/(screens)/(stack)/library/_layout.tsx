import { Stack } from 'expo-router';

export default function LibraryLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* This is "/library" */}
            <Stack.Screen name="index" />
            {/* This is "/library/[type]" */}
            <Stack.Screen name="[type]" />
        </Stack>
    );
}
