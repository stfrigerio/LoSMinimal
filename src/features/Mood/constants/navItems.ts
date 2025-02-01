import { router } from "expo-router";

export const navItems = [
    { label: 'Dashboard', onPress: () => router.push('/mood') },
    { label: 'List', onPress: () => router.push('/mood/list') },
    { label: 'Graph', onPress: () => router.push('/mood/graph') },
];