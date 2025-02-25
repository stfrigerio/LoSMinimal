import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TransactionModal from './modals/TransactionModal';
import { GlitchText } from '@/src/styles/GlitchText';
import MobileNavbar from '@/src/components/NavBar';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { useTransactionData } from './hooks/useTransactionData';
import { navItems } from './constants/navItems';
import Banner from '@/src/components/Banner';

const MoneyHub: React.FC = () => {
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);
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
            .filter(t => t.type === 'Income' || t.type === 'RepeatedIncome')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'Expense' || t.type === 'RepeatedExpense')
            .reduce((sum, t) => sum + t.amount, 0);
    
        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
        };
    }, [transactions]);

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Banner imageSource={require('@/assets/images/money.webp')} />
                <View style={styles.titleContainer}>
                    <GlitchText style={styles.title} glitch={theme.name === 'signalis'}>
                        Moneyz
                    </GlitchText>
                </View>
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

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.backgroundColor,
            paddingHorizontal: 10,
            paddingTop: 20,
        },
        titleContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            ...designs.text.title,
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
            fontSize: 14,
            color: theme.colors.textColorItalic,
            marginBottom: 5,
            ...(theme.name === 'signalis' && {  
                fontFamily: theme.typography.fontFamily.secondary,
                fontSize: 18,
            })
        },
        summaryValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.textColor,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.secondary,
                fontSize: 24,
                fontWeight: 'normal',
            })
        },
    });
};