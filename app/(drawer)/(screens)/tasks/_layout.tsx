import { Stack } from 'expo-router';

export default function TasksLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="checklist" />
            <Stack.Screen name="tasklist" />
            <Stack.Screen name="projects" />
        </Stack>
    );
}