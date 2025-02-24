import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text, Pressable } from 'react-native';

import TransactionEntry from './components/TransactionEntry';
import FilterAndSort, { FilterOptions, SortOption } from '@/src/components/FilterAndSort';
import BatchTransactionModal from '../../modals/BatchTransactionModal';

import { useTransactionData } from '@/src/features/Money/hooks/useTransactionData';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { MoneyData } from '@/src/types/Money';
import { useTransactionFilters } from './helpers/useTransactionFilters';
import { useTransactionSelection } from './helpers/useTransactionSelection';
import { useMoneyColors } from './helpers/useColors';
import MobileNavbar from '@/src/components/NavBar';
import TransactionModal from '../../modals/TransactionModal';
import { navItems } from '../../constants/navItems';

const MoneyList: React.FC = () => {
    const { 
        transactions, 
        deleteTransaction,
        refreshTransactions,
        batchUpdateTransactions
    } = useTransactionData();

    const [showFilter, setShowFilter] = useState(false);
    const [sortOption, setSortOption] = useState<SortOption>('recent');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const { theme, designs } = useThemeStyles();
    const { isSelectionMode, selectedUuids, toggleSelect, clearSelection } = useTransactionSelection();
    const styles = React.useMemo(() => getStyles(theme, designs, showFilter, isSelectionMode), [theme, designs, showFilter, isSelectionMode]);

    // Maintain filter and sort states
    const [filters, setFilters] = useState<FilterOptions>({
        dateRange: { start: null, end: null },
        tags: [],
        searchTerm: '',
    });

    const { filteredTransactions, validTransactions, tags } = useTransactionFilters(transactions, filters, sortOption);
    const { entryColors } = useMoneyColors(validTransactions);

    const closeAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        refreshTransactions();
    }, [refreshTransactions]);

    const handleBatchModalClose = () => {
        setIsBatchModalOpen(false);
        clearSelection();
        refreshTransactions();
    };
    
    const handleBatchUpdate = (updatedFields: Partial<MoneyData>) => {
        batchUpdateTransactions(Array.from(selectedUuids), updatedFields);
        handleBatchModalClose();
    };

    const renderItem = ({ item }: { item: MoneyData }) => (
        <TransactionEntry
            transaction={item}
            deleteTransaction={deleteTransaction}
            refreshTransactions={refreshTransactions}
            tagColor={entryColors[item.id!] || theme.colors.textColor}
            isSelectionMode={isSelectionMode}
            isSelected={selectedUuids.has(item.uuid!)}
            toggleSelect={toggleSelect}
        />
    );

    return (
        <View style={styles.container}>
            {isSelectionMode && (
                <View style={styles.selectionHeader}>
                    <Text style={styles.selectionText}>{selectedUuids.size} Selected</Text>
                    <Pressable onPress={() => setIsBatchModalOpen(true)} style={styles.batchButton}>
                        <Text style={styles.batchButtonText}>Batch Edit</Text>
                    </Pressable>
                    <Pressable onPress={clearSelection} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                </View>
            )}
            <FlatList
                data={filteredTransactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.uuid!}
                style={styles.list}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews={true}
            />
            {!isSelectionMode && (
                <FilterAndSort
                    onFilterChange={(newFilters) => setFilters(newFilters)}
                    onSortChange={(newSortOption) => setSortOption(newSortOption)}
                    tags={tags}
                    searchPlaceholder="Search by description"
                    isActive={showFilter}
                />
            )}
            {isBatchModalOpen && (
                <BatchTransactionModal
                    isOpen={isBatchModalOpen}
                    closeBatchModal={handleBatchModalClose}
                    selectedTransactions={Array.from(selectedUuids).map(uuid => filteredTransactions.find(t => t.uuid === uuid)!)}
                    onBatchUpdate={handleBatchUpdate}
                />
            )}
            {isAddModalOpen && (   
                <TransactionModal
                    isOpen={isAddModalOpen}
                    closeTransactionModal={closeAddModal}
                />
            )}
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === 'List')} 
                showFilter={true}
                onFilterPress={() => setShowFilter(!showFilter)}
                quickButtonFunction={() => setIsAddModalOpen(true)}
                screen="money"
            />
        </View>
    );
};

const getStyles = (theme: Theme, designs: any, showFilter: boolean, isSelectionMode: boolean) => {
    const { width } = Dimensions.get('window');

    return StyleSheet.create({
        container: {
            paddingTop: 20,
            flex: 1,
            backgroundColor: theme.colors.backgroundColor,
            position: 'relative',
        },
        list: {
            marginTop: isSelectionMode ? 80 : 30, // Adjust margin if selection header is visible
            marginBottom: showFilter ? 80 : 0,
            flex: 1,
        },
        selectionHeader: {
            position: 'absolute',
            top: 35,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: theme.colors.backgroundSecondary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderColor,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            zIndex: 1,
        },
        selectionText: {
            color: 'gray',
        },
        batchButton: {
            padding: 10,
            borderRadius: 5,
            marginRight: 10,
        },
        batchButtonText: {
            color: theme.colors.textColor,
            fontWeight: 'bold',
        },
        cancelButton: {
            padding: 10,
            borderRadius: 5,
        },
        cancelButtonText: {
            color: 'gray',
        },
    });
};

export default MoneyList;
