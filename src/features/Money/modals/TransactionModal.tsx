// TransactionModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format } from 'date-fns';

import TagModal from '@/src/components/modals/TagModal';
import DescriptionModal from '@/src/components/modals/DescriptionModal';
import TagDescriptionSelector from '@/src/components/atoms/TagDescriptionSelector';
import { FormInput, RepeatFrequencySelector, SwitchInput } from '@/src/components/FormComponents';
import createTimePicker from '@/src/components/DateTimePicker';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import AlertModal from '@/src/components/modals/AlertModal';
import { UniversalModal } from '@/src/components/modals/UniversalModal';

import { MoneyData } from '@/src/types/Money';
import { SelectionData } from '@/src/features/Home/components/TimerComponent';
import { TagData } from '@/src/types/TagsAndDescriptions';
import { useTransactionModal } from './hooks/useTransactionModal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

interface TransactionModalProps {
    isOpen: boolean;
    closeTransactionModal: () => void;
    initialTransaction?: MoneyData;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, closeTransactionModal, initialTransaction }) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);
    const { showPicker, picker } = createTimePicker();

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [amountInput, setAmountInput] = useState(initialTransaction?.amount.toString() || '');
    const [selectedTag, setSelectedTag] = useState<TagData | undefined>(undefined);
    const [selectedDescription, setSelectedDescription] = useState<TagData | undefined>(undefined);
    const [isExpense, setIsExpense] = useState(initialTransaction ? initialTransaction.type !== 'Income' : true);
    const [showAlert, setShowAlert] = useState(false);

    const [repeat, setRepeat] = useState<string>(initialTransaction?.due ? 'true' : '');
    const [frequency, setFrequency] = useState<string>(initialTransaction?.due || '');

    const handleTypeChange = (value: boolean) => {
        setIsExpense(value);
        setTransaction(prev => ({
            ...prev,
            type: prev.due 
                ? (value ? 'RepeatedExpense' : 'RepeatedIncome')
                : (value ? 'Expense' : 'Income')
        }));
    };

    const [transaction, setTransaction] = useState<MoneyData>({
        amount: 0,
        type: 'Expense',
        tag: '',
        description: '',
        date: new Date().toISOString(),
        synced: 0,
    });

    const updateTagInSelectionData = () => {
        return (updateFunc: (prevData: SelectionData) => SelectionData) => {
            const updatedData = updateFunc({} as SelectionData);
            const newSelectedTag = updatedData.selectedTag;
            if (newSelectedTag) {
                setSelectedTag(newSelectedTag);
                setTransaction(prevTransaction => ({ 
                    ...prevTransaction, 
                    tag: newSelectedTag.text
                }));
                setIsTagModalOpen(false);
                setIsDescriptionModalOpen(true);
            } else {
                setSelectedTag(undefined);
                setTransaction(prevTransaction => ({ 
                    ...prevTransaction, 
                    tag: ''
                }));
                setIsTagModalOpen(false);
            }
        };
    };     
    
    const updateDescriptionInSelectionData = () => {
        return (updateFunc: (prevData: SelectionData) => SelectionData) => {
            const updatedData = updateFunc({} as SelectionData);
            const newSelectedDescription = updatedData.selectedDescription;
            if (newSelectedDescription) {
                setSelectedDescription(newSelectedDescription);
                setTransaction(prevTransaction => ({
                    ...prevTransaction,
                    description: newSelectedDescription.text
                }));
            } else {
                setSelectedDescription(undefined);
                setTransaction(prevTransaction => ({
                    ...prevTransaction,
                    description: ''
                }));
            }
            setIsDescriptionModalOpen(false);
        };
    };   

    const {
        handleAddTransaction,
        accounts,
        selectedAccount,
        setSelectedAccount,
        fetchAccounts
    } = useTransactionModal(closeTransactionModal, initialTransaction);

    const showDatePicker = () => {
        showPicker({
            mode: 'date',
            value: new Date(transaction.date),
            is24Hour: true,
        }, (selectedDate) => {
            if (selectedDate) {
                handleDateChange(selectedDate);
            }
        });
    };

    const handleDateChange = (selectedDate: Date) => {
        setTransaction({...transaction, date: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss")});
    };

    useEffect(() => {
        if (initialTransaction) {
            setTransaction(initialTransaction);
        }
    }, [initialTransaction]);

    const handleAccountChange = (account: string) => {
        setSelectedAccount(account);
        setTransaction(prev => ({
            ...prev,
            account: account
        }));
    };

    const handleSubmit = () => {
        if (!transaction.amount) {
            setShowAlert(true);
        } else {
            handleAddTransaction(transaction).catch((error: any) => alert(error.message));
        }
    };
    
    const handleAmountChange = (text: string) => {
        // Replace any commas with dots
        const transformedText = text.replace(/,/g, '.');
        // Allow decimal point and numbers
        if (/^\d*\.?\d*$/.test(transformedText)) {
            setAmountInput(transformedText);
        }
    };

    const handleAmountBlur = () => {
        const transformedText = amountInput.replace(/,/g, '.');
        setTransaction(prev => ({
            ...prev,
            amount: parseFloat(transformedText) || 0
        }));
    };

    const handleRepeatChange = (value: string) => {
        setRepeat(value);
        setTransaction(prev => ({
            ...prev,
            due: value ? frequency : undefined,
            // Update type when turning repeat on/off
            type: value 
                ? (isExpense ? 'RepeatedExpense' : 'RepeatedIncome')
                : (isExpense ? 'Expense' : 'Income')
        }));
    };
    
    const handleFrequencyChange = (value: string) => {
        setFrequency(value);
        setTransaction(prev => ({
            ...prev,
            due: value || undefined,
            // Ensure type is set to repeated when frequency is selected
            type: value 
                ? (isExpense ? 'RepeatedExpense' : 'RepeatedIncome')
                : (isExpense ? 'Expense' : 'Income')
        }));
    };

    //todo the keystrokes on the amount input are slow af
    
    return (
        <>
            {isOpen && (
                <UniversalModal
                    isVisible={isOpen}
                    onClose={closeTransactionModal}
                >
                    <Text style={designs.modal.title}>💸 New transaction</Text>
                    <Pressable onPress={showDatePicker} style={styles.datePickerButton}>
                        <FormInput
                            label="Date"
                            value={transaction.date.split('T')[0]}
                            editable={false}
                            isNumeric={false}
                        />
                    </Pressable>
                    <View style={{ width: '100%', marginBottom: -15 }}>
                        <FormInput
                            label="Amount"
                            value={amountInput}
                            onChangeText={handleAmountChange}
                            onBlur={handleAmountBlur}
                            isNumeric={true}
                        />
                    </View>
                    <SwitchInput
                        value={isExpense}
                        onValueChange={handleTypeChange}
                        trueLabel="Expense"
                        falseLabel="Income"
                        trackColorFalse={theme.colors.greenOpacity}
                        trackColorTrue={theme.colors.redOpacity}
                    />  

                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <RepeatFrequencySelector
                            repeat={repeat}
                            frequency={frequency}
                            onRepeatChange={handleRepeatChange}
                            onFrequencyChange={handleFrequencyChange}
                            leftLabelOff={false}
                        />
                    </View>

                    {/* <PickerInput
                        label="Account"
                        selectedValue={selectedAccount}
                        onValueChange={handleAccountChange}
                        items={accounts}
                    /> */}
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <TagDescriptionSelector
                            tag={transaction.tag}
                            description={transaction.description}
                            onPress={() => setIsTagModalOpen(true)}
                        />
                    </View>
                    <PrimaryButton
                        text={initialTransaction ? 'Update Transaction' : 'Add Transaction'}
                        onPress={handleSubmit}
                    />
                    {isTagModalOpen && (
                        <TagModal
                            isOpen={isTagModalOpen}
                            setSelectionData={updateTagInSelectionData()}
                            sourceTable="MoneyTable"
                        />
                    )}
                    {isDescriptionModalOpen && (
                        <DescriptionModal
                            isOpen={isDescriptionModalOpen}
                            selectedTag={selectedTag!}
                            setSelectionData={updateDescriptionInSelectionData()}
                            sourceTable="MoneyTable"
                        />
                    )}
                    {picker}
                </UniversalModal>
            )}
            {showAlert && (
                <AlertModal
                    isVisible={showAlert}
                    title="Error"
                    message="Please enter an amount"
                    onConfirm={() => setShowAlert(false)}
                    singleButton={true}
                />
            )}
        </>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundColor,
        borderColor: theme.colors.borderColor,
        width: '100%',
    },
});

export default TransactionModal;
