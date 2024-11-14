import React, { useMemo } from 'react';
import { View, Dimensions, StyleSheet, Text, ScrollView } from 'react-native';

import SunburstChart from '@/src/components/charts/Sunburst/SunburstChart';
import EntriesList from '@/src/features/PeriodicNote/components/atoms/EntriesList';

import { formatMoneyEntries } from '@/src/features/PeriodicNote/helpers/dataTransformer';
import { processMoneySunburstData } from '@/src/features/PeriodicNote/helpers/dataProcessing';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { MoneyData } from '@/src/types/Money';
import { useColors } from '@/src/utils/useColors';

interface ChartSectionProps {
    transactions: MoneyData[];
}

const MoneyGraphs: React.FC<ChartSectionProps> = ({ transactions }) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { colors: tagColors} = useColors();

    const moneySunburstData = useMemo(() => processMoneySunburstData(transactions), [transactions]);

    const moneyEntries = formatMoneyEntries(moneySunburstData, tagColors);

    const { width } = Dimensions.get('window');
    const chartWidth = width * 0.8;
    const chartHeight = Dimensions.get('window').height * 0.3;

    if (!moneySunburstData || !moneyEntries) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'gray' }}>No Money data available.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ marginBottom: 50 }}>
            <View style={{ alignItems: 'center' }}>
                <SunburstChart
                    data={moneySunburstData}
                    width={chartWidth}
                    height={chartHeight}
                />      
            </View>
            {moneyEntries.length > 0 && (
                <EntriesList entries={moneyEntries} title="Money Entries" valueLabel="€" />
            )}
        </ScrollView>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};

export default MoneyGraphs;