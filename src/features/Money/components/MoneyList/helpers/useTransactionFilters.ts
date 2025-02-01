import { useMemo } from 'react';
import { MoneyData } from '@/src/types/Money';
import { FilterOptions, SortOption } from '@/src/components/FilterAndSort';

export const useTransactionFilters = (
    transactions: MoneyData[],
    filters: FilterOptions,
    sortOption: SortOption
) => {
    // Filter valid transactions
    const validTransactions = useMemo(() => {
        return transactions.filter(transaction => 
            transaction.type === 'Income' || transaction.type === 'Expense'
        );
    }, [transactions]);

    // Get unique tags
    const tags = useMemo(() => {
        return Array.from(new Set(validTransactions.map(t => t.tag)));
    }, [validTransactions]);

    // Apply filters and sorting
    const filteredTransactions = useMemo(() => {
        let filtered = validTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const inDateRange = (!filters.dateRange.start || transactionDate >= filters.dateRange.start) &&
                            (!filters.dateRange.end || transactionDate <= filters.dateRange.end);
            const matchesTags = filters.tags.length === 0 || filters.tags.includes(transaction.tag);
            const matchesSearch = transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
            return inDateRange && matchesTags && matchesSearch;
        });

        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'recent':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'highestValue':
                    return b.amount - a.amount;
                case 'lowestValue':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [validTransactions, filters, sortOption]);

    return { filteredTransactions, validTransactions, tags };
};