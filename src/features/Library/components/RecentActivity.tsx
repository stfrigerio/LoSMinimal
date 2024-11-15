import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

import { LibraryData } from '@/src/types/Library';
import { formatDistanceToNow } from 'date-fns';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface RecentActivityProps {
    recentActivity: LibraryData[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ recentActivity }) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors, designs);

    const getTimeAgo = (date: string) => {
        if (!date) return '';

        try {
            const itemDate = new Date(date);
            if (isNaN(itemDate.getTime())) {
                console.warn('Invalid date format:', date);
                return '';
            }
            return formatDistanceToNow(itemDate, { addSuffix: true });
        } catch (error) {
            console.warn('Invalid date format:', date);
            return '';
        }
    };

    return (
        <>
            <View style={[styles.separator, { marginTop: 16 }]} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={[styles.separator, { marginBottom: 28 }]} />
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.recentContainer}
            >
                {recentActivity.map((item) => (
                    <View key={item.id} style={styles.recentCard}>
                        {item.mediaImage ? (
                            item.type === 'videogame' ? (
                                <Image 
                                    source={{ uri: `https://${item.mediaImage}` }} 
                                    style={styles.recentImage}
                                />
                            ) : (
                                <Image 
                                    source={{ uri: item.mediaImage }} 
                                    style={styles.recentImage}
                                />
                            )
                        ) : (
                            <View style={styles.recentImagePlaceholder} />
                        )}
                        <Text style={styles.recentTitle}>{item.title}</Text>
                        <Text style={styles.recentSubtitle}>{getTimeAgo(item.seen!)}</Text>
                    </View>
                ))}
            </ScrollView>
        </>
    );
};

const getStyles = (theme: any, design: any) => StyleSheet.create({
    sectionTitle: {
        ...design.text.title,
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.textColorItalic,
        textAlign: 'center',
        padding: 16,
        marginBottom: 0,
    },
    separator: {
        height: 1,
        backgroundColor: theme.borderColor,
        marginHorizontal: 16,
    },
    recentContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    recentCard: {
        width: 120,
        marginRight: 16,
    },
    recentImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 3,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recentImagePlaceholder: {
        width: 120,
        height: 180,
        backgroundColor: theme.backgroundSecondary,
        borderRadius: 8,
        marginBottom: 8,
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.textColor,
    },
    recentSubtitle: {
        fontSize: 12,
        color: theme.textColor + '99',
    },
}); 