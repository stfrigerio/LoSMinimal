import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

import MoneyGraphs from './components/MoneyGraphs';
import TransactionModal from './modals/TransactionModal';
import MobileNavbar from '@/src/components/NavBar';
import MoneyDashboard from './components/MoneyDashboard';
import MoneyList from './components/MoneyList';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useTransactionData } from './hooks/useTransactionData';

import { MoneyData } from '@/src/types/Money';
import { FilterOptions } from '@/src/components/FilterAndSort';
import { SortOption } from '@/src/components/FilterAndSort';

const MoneyHub: React.FC = () => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('List');
    const [showFilter, setShowFilter] = useState(false);

    // Maintain filter and sort states
    const [filters, setFilters] = useState<FilterOptions>({
        dateRange: { start: null, end: null },
        tags: [],
        searchTerm: '',
    });

    const [sortOption, setSortOption] = useState<SortOption>('recent');

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    const handleSortChange = (newSortOption: SortOption) => {
        setSortOption(newSortOption);
    };

    const { 
        transactions, 
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions 
    } = useTransactionData();

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        refreshTransactions();
    }, [refreshTransactions]);

    // Filter and sort the transactions
    const filteredAndSortedTransactions = useMemo(() => {
        return transactions
            .sort((a: MoneyData, b: MoneyData) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    const navItems = [
        // { label: 'Dashboard', onPress: () => setActiveView('Dashboard') },
        { label: 'List', onPress: () => setActiveView('List') },
        { label: 'Graph', onPress: () => setActiveView('Graph') }
    ];

    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    return (
        <View style={styles.container}>

            {/* {activeView === 'Dashboard' && (
                <MoneyDashboard 
                    transactions={filteredAndSortedTransactions} 
                    addTransaction={addTransaction}
                    updateTransaction={updateTransaction}
                    deleteTransaction={deleteTransaction}
                />
            )} */}
            {activeView === 'List' && (
                <MoneyList 
                    transactions={filteredAndSortedTransactions} 
                    deleteTransaction={deleteTransaction}
                    refreshTransactions={refreshTransactions}
                    showFilter={showFilter}
                    filters={filters}
                    sortOption={sortOption}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            )}
            {activeView === 'Graph' && (
                <MoneyGraphs transactions={filteredAndSortedTransactions}/>
            )}
            {isAddModalOpen && (   
                <TransactionModal
                    isOpen={isAddModalOpen}
                    closeTransactionModal={closeAddModal}
                />
            )}
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === activeView)} 
                showFilter={activeView === 'List'}
                onFilterPress={toggleFilter}
                quickButtonFunction={openAddModal}
                screen="money"
            />
        </View>
    );
};

export default MoneyHub;

const getStyles = (themeColors: any, designs: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.backgroundColor,
            paddingHorizontal: 10,
            paddingTop: 37,
        },
        floatingButton: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: themeColors.accentColor,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        },
    });
};