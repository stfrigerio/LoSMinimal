import { router } from "expo-router";

export const navItems = [
    { label: 'Dashboard', onPress: () => router.push('/tasks') },
    { label: 'List', onPress: () => router.push('/tasks/list') },
    { label: 'Checklist', onPress: () => router.push('/tasks/checklist') },
    { label: 'Projects', onPress: () => router.push('/tasks/projects') }
];