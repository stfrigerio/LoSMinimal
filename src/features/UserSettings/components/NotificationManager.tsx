import React, { useEffect, useState } from 'react';
import { View, ScrollView, Switch, StyleSheet, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { ScheduledNotificationItem } from './atoms/ScheduledNotificationItem';
import { useSettings } from '@/src/features/UserSettings/hooks/useSettings';

export const NotificationManager: React.FC = () => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);
    const { settings, updateSetting } = useSettings();

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        if (settings && settings.NotificationEnabled) {
            const currentValue = settings.NotificationEnabled.value;
            setNotificationsEnabled(currentValue === 'true');
        }
    }, [settings]);

    const [scheduledNotifications, setScheduledNotifications] = useState<
        Notifications.NotificationRequest[]
    >([]);

    const fetchScheduledNotifications = async () => {
        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        setScheduledNotifications(notifications);
    };

    useEffect(() => {
        // Fetch scheduled notifications when the component mounts.
        fetchScheduledNotifications();
    }, []);

    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            setNotificationsEnabled(status === 'granted');
        };

        checkPermissions();
        fetchScheduledNotifications();
    }, []);


    const toggleNotifications = async () => {
        try {
            if (notificationsEnabled) {
                // When disabling notifications, cancel scheduled ones...
                await Notifications.cancelAllScheduledNotificationsAsync();
                setScheduledNotifications([]);
                
                if (settings && settings.NotificationEnabled) {
                    await updateSetting({ ...settings.NotificationEnabled, value: 'false' });
                }
            } else {
                // When enabling, request permissions
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== 'granted') {
                    // Handle permission denied
                    return;
                }
                // Update the persistent setting to "true"
                if (settings && settings.NotificationEnabled) {
                    await updateSetting({ ...settings.NotificationEnabled, value: 'true' });
                }
            }
            // Toggle the local state
            setNotificationsEnabled(!notificationsEnabled);
        } catch (error) {
            console.error('Failed to toggle notifications:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await Notifications.cancelScheduledNotificationAsync(id);
            await fetchScheduledNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            setScheduledNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { textAlign: 'center' }]}>Notification Settings</Text>
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>Enable Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{ false: theme.colors.backgroundColor, true: theme.colors.backgroundColor }}
                        thumbColor={notificationsEnabled ? theme.colors.accentColor : theme.colors.backgroundSecondary}
                    />
                </View>
            </View>

            {scheduledNotifications.length > 0 ? (
                <>
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionTitle}>Scheduled Notifications</Text>
                        <PrimaryButton
                            text="Clear All"
                            onPress={clearAllNotifications}
                        />
                    </View>
                    {scheduledNotifications.map((notification) => (
                        <ScheduledNotificationItem
                            key={notification.identifier}
                            notification={notification}
                            onDelete={deleteNotification}
                        />
                    ))}
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No scheduled notifications
                    </Text>
                </View>
            )}
            <View style={{ marginBottom: 80 }}/>
        </ScrollView>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.textColor,
        marginBottom: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 16,
        borderRadius: 8,
    },
    toggleText: {
        fontSize: 16,
        color: theme.colors.textColor,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textColor,
    },
    clearButton: {
        minWidth: 100,
    },
    emptyState: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 8,
        marginTop: 16,
    },
    emptyStateText: {
        color: theme.colors.textColor,
        fontSize: 16,
    },
});