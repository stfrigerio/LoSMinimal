import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TransactionModal from './modals/TransactionModal';
import MobileNavbar from '@/src/components/NavBar';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useTransactionData } from './hooks/useTransactionData';

import { router } from 'expo-router';
import Banner from '@/src/components/Banner';

const MoneyHub: React.FC = () => {
    const { themeColors, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { 
        transactions,
        refreshTransactions 
    } = useTransactionData();

    const closeAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        refreshTransactions();
    }, [refreshTransactions]);

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + t.amount, 0);
    
        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
        };
    }, [transactions]);

    const navItems = [
        { label: 'Dashboard', onPress: () => router.push('/money') },
        { label: 'List', onPress: () => router.push('/money/list') },
        { label: 'Graph', onPress: () => router.push('/money/graph') }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Banner imageSource={require('@/assets/images/money.webp')} />
                <Text style={styles.title}>
                    Moneyz
                </Text>
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Income</Text>
                        <Text style={styles.summaryValue}>{totalIncome.toFixed(2)} €</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Expenses</Text>
                        <Text style={styles.summaryValue}>{totalExpenses.toFixed(2)} €</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Balance</Text>
                        <Text style={[styles.summaryValue, { color: balance >= 0 ? 'green' : 'red' }]}>
                            {balance.toFixed(2)} €
                        </Text>
                    </View>
                </View>
            </View>
            {isAddModalOpen && (   
                <TransactionModal
                    isOpen={isAddModalOpen}
                    closeTransactionModal={closeAddModal}
                />
            )}
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === 'Dashboard')} 
                quickButtonFunction={() => setIsAddModalOpen(true)}
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
            paddingTop: 20,
        },
        title: {
            ...designs.text.title,
            marginBottom: 20,
        },
        summaryContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        summaryItem: {
            alignItems: 'center',
        },
        summaryLabel: {
            ...designs.text.text,
            color: 'gray',
            marginBottom: 5,
        },
        summaryValue: {
            ...designs.text.text,
            fontWeight: 'bold',
        },
        subtitle: {
            ...designs.text.title,
            marginBottom: 10,
        },
    });
};