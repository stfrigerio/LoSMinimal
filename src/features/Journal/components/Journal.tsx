// Libraries
import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet, Alert, Platform, BackHandler, Dimensions, TextInput, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faCheck, faMapMarkerAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

import Navbar from '@/src/components/NavBar';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { useNavbarDrawer } from '@/src/contexts/NavbarContext';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import { useJournal } from '../hooks/useJournal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import MobileMarkdown from '@/src/components/Markdown/Markdown';

const Journal: React.FC<{ date: string; uuid: string, onClose?: () => void }> = ({ date, uuid, onClose }) => {
    const { journalEntry, loadJournalEntry, saveJournalEntry, deleteJournalEntry, place, setPlace } = useJournal(date, uuid);
    const [localJournalEntry, setLocalJournalEntry] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [placeModalVisible, setPlaceModalVisible] = useState(false);
    const [newPlace, setNewPlace] = useState(place || '');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const { setKeyboardVisible } = useNavbarDrawer();

    const { themeColors, designs, markdownStyles } = useThemeStyles();
    const styles = getStyles(themeColors);

    const handleSave = useCallback(async () => {
        if (localJournalEntry !== journalEntry) {
            try {
                await saveJournalEntry(localJournalEntry);
                // Ensure localJournalEntry is updated with the latest saved entry
                setLocalJournalEntry(localJournalEntry);
            } catch (error) {
                console.error('Error saving journal entry:', error);
                Alert.alert('Error', 'Failed to save journal entry. Please try again.');
            }
        }
    }, [localJournalEntry, journalEntry, saveJournalEntry, loadJournalEntry]);

    //? Custom back action for Android to prevent closing the Journal when editing
    const handleBackPress = useCallback(() => {
        if (isEditing) {
            setIsEditing(false);
            return true; // Prevent default back behavior
        } else {
            handleClose();
            return true; // Prevent default back behavior
        }
    }, [isEditing, handleSave, onClose]);

    useEffect(() => {
        loadJournalEntry();

        // Add back button handler for Android
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup function
        return () => backHandler.remove();
    }, [loadJournalEntry, handleBackPress]);

    useEffect(() => {
        if (journalEntry !== localJournalEntry) {
            setLocalJournalEntry(journalEntry);
        }
    }, [journalEntry]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleStopEditing = async () => {
        setIsEditing(false);
    };

    const handleClose = async () => {
        await handleSave();
        onClose && onClose();
    };

    const handleDelete = async () => {
        await deleteJournalEntry();
        onClose && onClose();
    };

    const handleSetPlace = async () => {
        try {
            const savedEntry = await saveJournalEntry(localJournalEntry, newPlace);
            setPlace(newPlace); // Update the place state in the hook
            setNewPlace(newPlace); // Keep newPlace in sync
            setPlaceModalVisible(false);
        } catch (error) {
            console.error('Error saving place:', error);
            Alert.alert('Error', 'Failed to save place. Please try again.');
        }
    };

    const formatDateTime = (date: string | number | Date) => {
        const d = new Date(date);
        const formattedDate = d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
        // const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate}`;
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [setKeyboardVisible]);

    return (
        <View style={styles.container}>
            <Text style={[designs.text.title, styles.title]}>{formatDateTime(date)}</Text>
            <Text style={[styles.place]}>{place}</Text>
            {isEditing ? (
                <TextInput
                    multiline
                    editable={true}
                    value={localJournalEntry}
                    onChangeText={setLocalJournalEntry}
                    style={styles.textInput}
                />
            ) : (
                <ScrollView style={{ marginHorizontal: 10 }}>
                    <MobileMarkdown style={markdownStyles}>
                        {localJournalEntry}
                    </MobileMarkdown>
                </ScrollView>
            )}

            {/* Icon Container */}
            {!isKeyboardVisible && (
                <View style={styles.iconContainer}>
                    <Pressable onPress={handleDelete}>
                    <FontAwesomeIcon 
                        icon={faTrash} 
                        size={24} 
                        color={'gray'} />
                </Pressable>
                <Pressable onPress={() => setPlaceModalVisible(true)} style={{ marginHorizontal: 40 }}>
                    <FontAwesomeIcon 
                        icon={faMapMarkerAlt} 
                        size={24} 
                        color={'gray'} />
                </Pressable>
                <Pressable onPress={isEditing ? handleStopEditing : handleEdit}>
                    <FontAwesomeIcon 
                        icon={isEditing ? faCheck : faEdit} 
                        size={24} 
                        color={isEditing ? themeColors.accentColor : themeColors.gray} 
                        style={{ marginRight: 10 }}
                    />
                    </Pressable>
                </View>
            )}

            {/* Navbar */}
            <Navbar
                items={[]}
                activeIndex={-1}
                quickButtonFunction={undefined}
                screen="journal"

            />

            {/* Place Modal */}
            {placeModalVisible &&   
                <UniversalModal isVisible={placeModalVisible} onClose={() => setPlaceModalVisible(false)}>
                    <TextInput
                        style={[
                            designs.text.input,
                            { marginTop: 40 }
                        ]}
                        placeholder="Enter place"
                        placeholderTextColor="gray"
                        value={newPlace}
                        onChangeText={setNewPlace}
                        onSubmitEditing={handleSetPlace}
                    />
                    <PrimaryButton
                        text="Save"
                        onPress={handleSetPlace}
                    />
                </UniversalModal>
            }
        </View>
    );
};

const getStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.backgroundColor,
        },
        textInput: {
            flex: 1,
            padding: 10,
            marginBottom: 10,
            fontSize: 16,
            fontFamily: 'serif',
            color: theme.textColor,
            borderColor: theme.borderColor,
            borderRadius: 5,
            textAlignVertical: 'top',
        },
        iconContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 10,
            paddingBottom: 15,
            marginTop: 30,
            zIndex: 10000
        },
        readOnlyInput: {
            backgroundColor: theme.backgroundColor,
        },
        title: {
            fontFamily: 'serif',
            fontSize: 28,
            marginTop: 70,
            color: theme.textColorBold
        },
        journalText: {
            fontSize: 16,
            fontFamily: 'serif',
            color: theme.textColor,
        },
        place: {
            fontFamily: 'serif',
            fontStyle: 'italic',
            color: theme.textColorItalic,
            alignSelf: 'center',
            marginTop: 0,
            marginBottom: 20,
            fontSize: 22,
        },
        backIcon: {
            position: 'absolute',
            top: 10,
            left: 20, 
            // marginLeft: 30,
        },
    });
};
export default Journal;
