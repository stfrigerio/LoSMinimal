import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faClock, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface StatsProps {
    stats: {
        totalItems: number;
        thisMonth: number;
        thisYear: number;
        topGenres: {
            movie?: string;
            series?: string;
            book?: string;
            videogame?: string;
            music?: string;
        }
    };
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
    const { designs, theme } = useThemeStyles();
    const styles = getStyles(theme, designs);

    return (
        <>
            <View style={[styles.separator, { marginTop: 8 }]} />
            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={[styles.separator, { marginBottom: 16 }]} />
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <FontAwesomeIcon icon={faChartLine} size={24} color={theme.colors.accentColor} />
                    <Text style={styles.statNumber}>{stats.totalItems}</Text>
                    <Text style={styles.statLabel}>Total Items</Text>
                </View>
                <View style={styles.statCard}>
                    <FontAwesomeIcon icon={faClock} size={24} color={theme.colors.accentColor} />
                    <Text style={styles.statNumber}>{stats.thisYear}</Text>
                    <Text style={styles.statLabel}>This Year</Text>
                </View>
                <View style={styles.statCard}>
                    <FontAwesomeIcon icon={faListCheck} size={24} color={theme.colors.accentColor} />
                    <Text style={styles.statNumber}>{stats.thisMonth}</Text>
                    <Text style={styles.statLabel}>This Month</Text>
                </View>
            </View>

            <View style={styles.genreContainer}>
                <Text style={styles.genreHeader}>Top Genres</Text>
                {Object.entries(stats.topGenres).map(([type, genre]) => (
                    genre && (
                        <View key={type} style={styles.genreRow}>
                            <Text style={styles.mediaType}>{type}</Text>
                            <Text style={styles.genreText}>{genre}</Text>
                        </View>
                    )
                ))}
            </View>
        </>
    );
};

const getStyles = (theme: any, design: any) => StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    statCard: {
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '30%',
        elevation: 2,
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.textColor,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textColor + '99',
        marginTop: 4,
    },
    genreContainer: {
        backgroundColor: theme.colors.backgroundSecondary,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    genreHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textColorBold,
        marginBottom: 12,
        textAlign: 'center',
    },
    genreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.textColor + '20',
    },
    mediaType: {
        color: theme.colors.textColor,
        fontSize: 14,
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    genreText: {
        color: theme.colors.textColor + 'CC',
        fontSize: 14,
    },
    sectionTitle: {
        ...design.text.title,
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textColorItalic,
        padding: 8,
        paddingVertical: 16,
        textAlign: 'center',
        marginBottom: 0
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.borderColor,
        marginHorizontal: 16,
    },
}); 