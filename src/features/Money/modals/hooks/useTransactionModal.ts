import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

import { databaseManagers } from '@/database/tables';
import { MoneyData } from '@/src/types/Money';

export const useTransactionModal = (closeTransactionModal: () => void, initialTransaction?: MoneyData) => {
    const [accounts, setAccounts] = useState<Array<{ label: string; value: string }>>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>(initialTransaction?.account || 'Revolut');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleAddTransaction = async (transaction: MoneyData) => {
        try {
            await databaseManagers.money.upsert(transaction);
            closeTransactionModal();
            Toast.show({
                text1: '💰 Transaction saved',
            });
        } catch (error: any) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    };

    const fetchAccounts = async () => {
        try {
            const fetchedAccounts = await databaseManagers.money.listAccounts();
            setAccounts([
                { label: 'Select an account', value: '' },
                ...fetchedAccounts.map(account => ({ label: account.account, value: account.account }))
            ]);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    return {
        handleAddTransaction,
        accounts,
        selectedAccount,
        setSelectedAccount,
        fetchAccounts
    };
};