import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Platform, Dimensions, Text, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import Journal from './components/Journal';
import JournalEntry from './components/JournalEntry';
import Navbar from '@/src/components/NavBar';
import createTimePicker from '@/src/components/DateTimePicker';
import { UniversalModal } from '@/src/components/modals/UniversalModal';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { getFlaskServerURL } from '@/src/features/Database/helpers/databaseConfig';

import { JournalData } from '@/src/types/Journal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { useJournal } from './hooks/useJournal';

const JournalHub: React.FC = () => {
    const [journalEntries, setJournalEntries] = useState<JournalData[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalData | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const startDatePicker = createTimePicker();
    const endDatePicker = createTimePicker();
    const { fetchAllJournal, saveAIJournalEntry } = useJournal();

    useEffect(() => {
        const loadJournalEntries = async () => {
            const journals = await fetchAllJournal();
            setJournalEntries(journals);
        };

        loadJournalEntries();
    }, [refreshTrigger]);
    
    // sort the journal entries by date
    journalEntries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    const generateAIJournalEntry = async () => {
        setIsGeneratingAI(true);
        try {
            const flaskURL = await getFlaskServerURL();
    
            const relevantEntries = journalEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= startDate && entryDate <= endDate;
            });
        
            if (relevantEntries.length === 0) {
                throw new Error("No journal entries found in the selected date range");
            }
    
            const response = await axios.post(`${flaskURL}/generate_journal`, {
                journalEntries: relevantEntries,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });
        
            if (response.data && response.data.generated_entry) {
                const generatedText = response.data.generated_entry;
                const generatedPlace = '🤖';

                const journalData: JournalData = {
                    date: new Date().toISOString(),
                    text: generatedText,
                    place: generatedPlace,
                    updatedAt: new Date().toISOString(),
                };
    
                await saveAIJournalEntry(journalData);
    
                setRefreshTrigger(prev => prev + 1);
                setIsModalVisible(false);
            } else {
                throw new Error("Failed to generate AI journal entry: " + JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Error generating AI journal entry:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
                alert(`Error: ${error.response?.data?.error || error.message}`);
            } else if (error instanceof Error) {
                console.error(error.message);
                alert(`Error: ${error.message}`);
            } else {
                console.error('Unknown error:', error);
                alert('An unknown error occurred');
            }
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const renderJournalItem = ({ item }: { item: JournalData }) => (
        <JournalEntry
            item={item}
            onSelect={() => setSelectedEntry({ date: item.date, uuid: item.uuid!, text: item.text })}
        />
    );

    const handleEntryClose = () => {
        setSelectedEntry(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const renderDatePickerContent = () => (
        <View style={styles.datePickerContainer}>
            <Text style={{ color: 'gray', fontSize: 14, marginBottom: 20, paddingHorizontal: 5}}>
                Generate AI Journal Entry, using your previous entries as context
            </Text>
            <Text style={styles.labels}>Start Date:</Text>
            <Pressable style={styles.dateTimeButton} onPress={() => startDatePicker.showPicker({ mode: 'date', value: startDate }, (date) => date && setStartDate(date))}>
                <Text style={styles.dateTimeText}>{startDate.toLocaleDateString()}</Text>
            </Pressable>
            {startDatePicker.picker}

            <Text style={styles.labels}>End Date:</Text>
            <Pressable style={styles.dateTimeButton} onPress={() => endDatePicker.showPicker({ mode: 'date', value: endDate }, (date) => date && setEndDate(date))}>
                <Text style={styles.dateTimeText}>{endDate.toLocaleDateString()}</Text>
            </Pressable>
            {endDatePicker.picker}

            <View style={{ height: 20 }} />
            <PrimaryButton
                text={isGeneratingAI ? 'Generating...' : 'Generate AI Entry'}
                onPress={generateAIJournalEntry}
            />
        </View>
    );

    if (selectedEntry) {
        return (
            <Journal
                date={selectedEntry.date}
                uuid={selectedEntry.uuid!}
                onClose={handleEntryClose}
            />
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <FlatList
                    data={journalEntries}
                    renderItem={renderJournalItem}
                    keyExtractor={(item) => item.uuid!}
                    style={styles.list}
                />
            </View>
            <Pressable style={styles.AINavbarButton} onPress={() => setIsModalVisible(true)}>
                <FontAwesomeIcon icon={faRobot} color={themeColors.backgroundColor} size={24} />
            </Pressable>
            <Navbar
                items={[]}
                activeIndex={-1}
                quickButtonFunction={() => setSelectedEntry({ date: new Date().toISOString(), uuid: '', text: ''})}
                screen="journal"
            />
            {isModalVisible && (
                <UniversalModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                >
                    {renderDatePickerContent()}
                </UniversalModal>
            )}
        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        mainContainer: {
            paddingTop: 37,
            backgroundColor: theme.backgroundColor,
            flex: 1,
        },
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.backgroundColor,
            marginBottom: 80
        },
        title: {
            marginBottom: 20,
        },
        journalItem: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        floatingButton: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.accentColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        list: {
            flex: 1,
        },
        datePickerContainer: {
            padding: 20,
            backgroundColor: theme.cardBackgroundColor,
            borderRadius: 8,
        },
        dateTimeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 20,
        },
        dateTimeButton: {
            flex: 1,
            padding: 10,
            borderColor: theme.borderColor,
            borderWidth: 1,
            borderRadius: 5,
            marginHorizontal: 5,
            alignItems: 'center',
        },
        dateTimeText: {
            color: theme.textColor,
        },
        labels: {
            color: 'gray',
            marginBottom: 10,
        },
        generateButton: {
            backgroundColor: theme.primaryColor,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 20,
        },
        AINavbarButton: {
            position: 'absolute',
            bottom: 15,
            right: 100,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#CD535B',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            zIndex: 9999
        }
    });
}

export default JournalHub;