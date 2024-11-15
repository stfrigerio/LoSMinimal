import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faClock, faListCheck } from '@fortawesome/free-solid-svg-icons';

interface StatsProps {
    stats: {
        totalItems: number;
        inProgress: number;
        thisMonth: number;
    };
    themeColors: any;
}

export const Stats: React.FC<StatsProps> = ({ stats, themeColors }) => {
    const styles = getStyles(themeColors);

    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <FontAwesomeIcon icon={faChartLine} size={24} color={themeColors.accentColor} />
                <Text style={styles.statNumber}>{stats.totalItems}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statCard}>
                <FontAwesomeIcon icon={faClock} size={24} color={themeColors.accentColor} />
                <Text style={styles.statNumber}>{stats.inProgress}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.statCard}>
                <FontAwesomeIcon icon={faListCheck} size={24} color={themeColors.accentColor} />
                <Text style={styles.statNumber}>{stats.thisMonth}</Text>
                <Text style={styles.statLabel}>This Month</Text>
            </View>
        </View>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    statCard: {
        backgroundColor: theme.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '30%',
        elevation: 2,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.textColor,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: theme.textColor + '99',
        marginTop: 4,
    },
}); 