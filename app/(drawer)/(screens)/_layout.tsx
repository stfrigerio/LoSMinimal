import { Stack } from 'expo-router/stack';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

export default function ScreensLayout() {
    const { themeColors } = useThemeStyles();

    return (
        <Stack
            screenOptions={{
                // Smooth fade + slide animation
                animation: 'fade_from_bottom',
                animationDuration: 3000,
                
                // // Nice presentation style
                // presentation: 'card',
                
                // // Enable gestures
                // gestureEnabled: true,
                // fullScreenGestureEnabled: true,
                // gestureDirection: 'horizontal',
                
                // // Match gesture with animation
                // animationMatchesGesture: true,
                // fullScreenGestureShadowEnabled: true,
                
                // Style options
                headerShown: false,
                contentStyle: {
                    backgroundColor: themeColors.backgroundColor,
                },
                
                // Smooth transition when replacing screens
                animationTypeForReplace: 'push',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="daily-note" />
            <Stack.Screen name="tasks" />
            <Stack.Screen name="mood" />
            <Stack.Screen name="user-settings" />
            <Stack.Screen name="database" />
            <Stack.Screen name="periodic-note" />
            <Stack.Screen name="money" />
            <Stack.Screen name="journal" />
            <Stack.Screen name="people" />
            <Stack.Screen name="library" />
            <Stack.Screen name="time" />
        </Stack>
    );
}