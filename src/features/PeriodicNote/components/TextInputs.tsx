// Libraries
import React, { useState, useEffect } from 'react';
import { Platform, View, Text, Pressable, StyleSheet, Dimensions, Keyboard, TextInput } from 'react-native';
import { omit } from 'lodash'; 
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

import DeleteButton from '@/src/components/atoms/DeleteButton';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import AlertModal from '@/src/components/modals/AlertModal';

import { AggregateTextData, TextNotesData } from '@/src/types/TextNotes';
import { useNavbarDrawer } from '@/src/contexts/NavbarContext';

import { useTextSection } from '../hooks/useTextSection';

const generateUUID = () => {
    if (Platform.OS === 'web') {
        return uuidv4();
    } else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

export interface TextSectionProps {
    periodType: string;
    startDate: string;
    endDate: string;
}

const TextInputs: React.FC<TextSectionProps> = ({ periodType, startDate, endDate }) => {
    const { theme, themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);
    const { setKeyboardVisible } = useNavbarDrawer();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [setKeyboardVisible]);

    const { 
        textData, 
        handleInputChange, 
        handleAddNewItem, 
        handleDeleteItem, 
        refetchData, 
        editingStates,
        toggleEditing 
    } = useTextSection({ periodType, startDate, endDate });

    const [localTextData, setLocalTextData] = useState<AggregateTextData>(textData);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ section: typeof sections[number], index: number } | null>(null);

    useEffect(() => {
        setLocalTextData(textData);
    }, [textData]);

    const sections: Array<keyof Pick<AggregateTextData, 'successes' | 'beBetters' | 'thinks'>> = ['successes', 'beBetters', 'thinks'];
    const sectionLabels: Record<typeof sections[number], string> = {
        successes: '🏆 Success',
        beBetters: '🦾 Be Better',
        thinks: '🧠 Think'
    };

    const handleLocalInputChange = (text: string, section: typeof sections[number], index: number) => {
        setLocalTextData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => i === index ? { ...item, text } : item)
        }));
    };

    const handleSave = async (section: typeof sections[number], index: number) => {
        const item = localTextData[section][index];
        const key = section === 'successes' ? 'success' : section === 'beBetters' ? 'beBetter' : 'think';
        const completeItem: TextNotesData = {
            ...omit(item, ['createdAt', 'updatedAt', 'tempId']),
            text: item.text || '',
            period: localTextData.date,
            key: key,
        };

        handleInputChange(completeItem);
        refetchData(); // Re-fetch data after saving
        toggleEditing(section, index);
    };

    const handleDelete = (section: typeof sections[number], index: number) => {
        setItemToDelete({ section, index });
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            const { section, index } = itemToDelete;
            const item = localTextData[section][index];
            if (item.uuid) {
                handleDeleteItem(item.uuid, section);
            } else {
                console.warn(`Deleting unsaved item in ${section}:`, item);
            }
            setLocalTextData(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index)
            }));
        }
        setDeleteModalVisible(false);
        setItemToDelete(null);
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setItemToDelete(null);
    };

    const handleAddNewItemWithTempId = (section: typeof sections[number]) => {
        const newItem = {
            text: '',
            tempId: generateUUID(), // Generate a temporary unique ID
        };
        setLocalTextData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
        handleAddNewItem(section);
    };

    return (
        <View style={styles.textSummaries}>
            {sections.map((section) => (
            <View style={styles.formSection} key={section}>
                <Text style={styles.sectionLabel}>{sectionLabels[section]}</Text>
                {localTextData[section].map((item: any, index: number) => {
                    const isEditing = editingStates[`${section}-${index}`];
                    return (
                        <View style={styles.inputContainer} key={item.uuid || item.tempId || `${section}-${index}`}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[designs.text.input, isEditing ? styles.editingInput : styles.readOnlyInput]}
                                    value={item.text}
                                    onChangeText={(text) => handleLocalInputChange(text, section, index)}
                                    editable={isEditing}
                                    onFocus={() => setKeyboardVisible(true)}
                                    onBlur={() => setKeyboardVisible(false)}
                                    onSubmitEditing={() => {
                                        if (isEditing) {
                                            handleSave(section, index);
                                        }
                                    }}
                                    multiline={true}
                                />
                            </View>
                            <View style={styles.iconContainer}>
                                <Pressable onPress={() => isEditing ? handleSave(section, index) : toggleEditing(section, index)}>
                                    <FontAwesomeIcon 
                                        icon={isEditing ? faSave : faEdit} 
                                        color={isEditing ? themeColors.accentColor : themeColors.gray} 
                                        size={20} 
                                        style={styles.icon}
                                    />
                                </Pressable>
                                <DeleteButton onDelete={() => handleDelete(section, index)} />
                            </View>
                        </View>
                    );
                })}
                <Pressable style={styles.addButton} onPress={() => handleAddNewItemWithTempId(section)}>
                    <Text style={styles.addButtonText}>Add +</Text>
                </Pressable>
            </View>
            ))}
            {deleteModalVisible && (
                <AlertModal
                    isVisible={deleteModalVisible}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this item?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </View>
    );
}

const getStyles = (theme: any) => {
    const { width } = Dimensions.get('window');
    const isSmall = width < 1920;
    const isDesktop = Platform.OS === 'web';

    return StyleSheet.create({
        textSummaries: {
            display: 'flex',
            flexDirection: isSmall ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isDesktop ? 20 : 10,
            borderRadius: 10,
            borderColor: theme.borderColor,
            padding: isDesktop ? 20 : 10,
            margin: isDesktop ? 20 : 15,
            justifyContent: 'space-between',
        },
        sectionLabel: {
            marginBottom: 15,
            fontSize: isDesktop ? 20 : 18,
            color: theme.accentColor,
            fontWeight: 'bold',
            textAlign: 'left',
        },
        addButton: {
            padding: 12,
            paddingHorizontal: 20,
            marginTop: 15,
            borderRadius: 5,
            alignSelf: 'center',
        },
        addButtonText: {
            color: 'gray',
            fontWeight: 'bold',
        },
        formSection: {
            flex: isSmall ? 0 : 1,
            width: isSmall ? '100%' : isDesktop ? '30%' : '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            marginBottom: isDesktop ? 0 : 20,
        },
        inputContainer: {
            flexDirection: 'column',
            marginBottom: 10
        },
        inputWrapper: {
            width: '100%',
        },
        editingInput: {
            minHeight: 50,
            borderRadius: 5,
            padding: 10,
            width: '100%',
        },
        readOnlyInput: {
            backgroundColor: 'transparent',
            minHeight: 50,
            borderRadius: 5,
            padding: 10,
            marginBottom: 0,
            width: '100%',
        },
        iconContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 5,
        },
        icon: {
            marginHorizontal: 10,
        },
    });
}

export default TextInputs