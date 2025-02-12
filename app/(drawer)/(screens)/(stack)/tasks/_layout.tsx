import { Stack } from 'expo-router';

export default function TasksLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="checklist" />
            <Stack.Screen name="list" />
            <Stack.Screen name="projects" />
        </Stack>
    );
}