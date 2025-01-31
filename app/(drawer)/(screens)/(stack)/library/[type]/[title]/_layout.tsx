import { Stack } from 'expo-router';

export default function BookDetailLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* The detail screen for /library/books/[title] */}
            <Stack.Screen name="index" />
            {/* The markdown viewer for /library/books/[title]/markdown-viewer */}
            <Stack.Screen name="markdown-viewer" />
        </Stack>
    );
}
