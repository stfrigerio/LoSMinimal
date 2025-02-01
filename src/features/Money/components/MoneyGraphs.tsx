import React, { useMemo, useState } from 'react';
import { View, Dimensions, StyleSheet, Text, ScrollView } from 'react-native';

import SunburstChart from '@/src/components/charts/Sunburst/SunburstChart';
import EntriesList from '@/src/features/PeriodicNote/components/atoms/EntriesList';

import { formatMoneyEntries } from '@/src/features/PeriodicNote/helpers/dataTransformer';
import { processMoneySunburstData } from '@/src/features/PeriodicNote/helpers/dataProcessing';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useColors } from '@/src/utils/useColors';
import { useTransactionData } from '../hooks/useTransactionData';
import MobileNavbar from '@/src/components/NavBar';
import FilterAndSort, { FilterOptions, SortOption } from '@/src/components/FilterAndSort';
import { useTransactionFilters } from './MoneyList/helpers/useTransactionFilters';
import { navItems } from '../constants/navItems';

const MoneyGraphs: React.FC = () => {
    // Maintain filter and sort states
    const [filters, setFilters] = useState<FilterOptions>({
        dateRange: { start: null, end: null },
        tags: [],
        searchTerm: '',
    });

    const [showFilter, setShowFilter] = useState(false);
    const [sortOption, setSortOption] = useState<SortOption>('recent');

    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { colors: tagColors} = useColors();

    const { transactions } = useTransactionData();
    const { filteredTransactions, validTransactions, tags } = useTransactionFilters(transactions, filters, sortOption);
    const moneySunburstData = useMemo(() => processMoneySunburstData(filteredTransactions), [filteredTransactions]);
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
        <View style={styles.container}>
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
            <FilterAndSort
                onFilterChange={(newFilters) => setFilters(newFilters)}
                onSortChange={(newSortOption) => setSortOption(newSortOption)}
                tags={tags}
                searchPlaceholder="Search by description"
                isActive={showFilter}
            />
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === 'Graph')} 
                showFilter={true}
                onFilterPress={() => setShowFilter(!showFilter)}
                quickButtonFunction={undefined}
                screen="money"
            />
        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            paddingTop: 60,
            flex: 1,
            backgroundColor: theme.backgroundColor,
            position: 'relative',
        },
    });
};

export default MoneyGraphs;