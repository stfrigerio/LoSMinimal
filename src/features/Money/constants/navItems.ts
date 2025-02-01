import { router } from "expo-router";

export const navItems = [
    { label: 'Dashboard', onPress: () => router.push('/money') },
    { label: 'List', onPress: () => router.push('/money/list') },
    { label: 'Graph', onPress: () => router.push('/money/graph') }
];