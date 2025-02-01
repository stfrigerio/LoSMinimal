import { router } from "expo-router";

export const navItems = [
    { label: 'Dashboard', onPress: () => router.push('/time') },
    { label: 'List', onPress: () => router.push('/time/list') },
    { label: 'Timeline', onPress: () => router.push('/time/timeline') },
    { label: 'Graphs', onPress: () => router.push('/time/graph') }
];