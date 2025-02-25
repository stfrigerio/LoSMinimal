import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from 'react-native';

import { LibraryData } from '@/src/types/Library';
import { formatDistanceToNow } from 'date-fns';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { router } from 'expo-router';
import { GlitchText } from '@/src/styles/GlitchText';

interface RecentActivityProps {
    recentActivity: LibraryData[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ recentActivity }) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme, designs);

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

    const handleItemPress = (item: LibraryData) => {
        router.push({
            pathname: `/(drawer)/(screens)/library/${item.type}/${item.title}`,
            params: { selectedItemId: item.id }
        });
    };

    return (
        <>
            <View style={[styles.separator, { marginTop: 16 }]} />
            <View style={{ alignSelf: 'center' }}>
                <GlitchText
                    style={styles.sectionTitle}
                    glitch={theme.name === 'signalis'}
                >
                    Recent Activity
                </GlitchText>
            </View>
            <View style={[styles.separator, { marginBottom: 28 }]} />
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.recentContainer}
            >
                {recentActivity.map((item) => (
                    <Pressable 
                        key={item.id} 
                        style={styles.recentCard}
                        onPress={() => handleItemPress(item)}
                    >
                        <View key={item.id} style={styles.recentCard}>
                            {item.mediaImage ? (
                                item.type === 'videogame' ? (
                                    <Image 
                                        source={{ uri: `https:${item.mediaImage}` }} 
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
                    </Pressable>
                ))}
            </ScrollView>
        </>
    );
};

const getStyles = (theme: Theme, design: any) => StyleSheet.create({
    sectionTitle: {
        ...design.text.title,
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textColorItalic,
        textAlign: 'center',
        padding: 16,
        marginBottom: 0,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.borderColor,
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
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recentImagePlaceholder: {
        width: 120,
        height: 180,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 8,
        marginBottom: 8,
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textColor,
        ...(theme.name === 'signalis' && {
            fontSize: 16,
            fontFamily: theme.typography.fontFamily.secondary,
            fontStyle: 'normal',
            fontWeight: 'normal',
        })
    },
    recentSubtitle: {
        fontSize: 12,
        color: theme.colors.textColor + '99',
        ...(theme.name === 'signalis' && {
            fontSize: 14,
            fontFamily: theme.typography.fontFamily.secondary,
            fontStyle: 'normal',
            fontWeight: 'normal',
        })
    },
}); 