import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface ScheduledNotificationItemProps {
    notification: Notifications.NotificationRequest;
    onDelete?: (id: string) => void;
}

export const ScheduledNotificationItem: React.FC<ScheduledNotificationItemProps> = ({ 
    notification, 
    onDelete 
}) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const triggerTime = React.useMemo(() => {
        if (
            notification.trigger && 
            'value' in notification.trigger &&
            typeof notification.trigger.value === 'number'
        ) {
            return new Date(notification.trigger.value).toLocaleString();
        }
        return 'Not scheduled';
    }, [notification.trigger]);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                    {notification.content.title}
                </Text>
                {onDelete && (
                    <Pressable 
                        onPress={() => onDelete(notification.identifier)}
                        style={styles.deleteButton}
                        hitSlop={8}
                    >
                        <Text style={styles.deleteText}>✕</Text>
                    </Pressable>
                )}
            </View>
            <Text style={styles.body} numberOfLines={2}>
                {notification.content.body}
            </Text>
            <View style={styles.timeContainer}>
                <Text style={styles.scheduleText}>
                    Scheduled for: {triggerTime}
                </Text>
            </View>
        </View>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textColorItalic,
        flex: 1,
        marginRight: 8,
    },
    body: {
        fontSize: 14,
        color: theme.colors.textColor,
        marginBottom: 8,
    },
    deleteButton: {
        padding: 4,
    },
    deleteText: {
        color: theme.colors.textColor,
        fontSize: 16,
        fontWeight: '500',
    },
    timeContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.borderColor,
    },
    scheduleText: {
        fontSize: 12,
        color: theme.colors.gray,
        marginTop: 4,
    },
});