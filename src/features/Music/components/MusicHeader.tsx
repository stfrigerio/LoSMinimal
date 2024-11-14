import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMagicWandSparkles, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { Album } from '../types';
import DetailedView from '../../Library/components/DetailedView';
import { databaseManagers } from '@/database/tables';
import { LibraryData } from '@/src/types/Library';

interface MusicHeaderProps {
    album: Album;
    onBack: () => void;
    onAutoLink: () => void;
}

export const MusicHeader = ({ album, onBack, onAutoLink }: MusicHeaderProps) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);
    const [selectedItem, setSelectedItem] = useState<LibraryData | null>(null);

    const handleItemSelect = async () => {
        const libraryItem = await databaseManagers.library.getByUuid(album.uuid);
        setSelectedItem(libraryItem);
    };

    const handleCloseDetail = () => {
        setSelectedItem(null);
    };

    const handleDelete = async (item: LibraryData) => {
        try {
            await databaseManagers.library.removeByUuid(item.uuid!);
            setSelectedItem(null);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const updateItem = async (item: LibraryData) => {
        try {
            await databaseManagers.library.upsert(item);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <>
            <View style={styles.albumHeader}>
                <Pressable 
                    style={styles.backButton} 
                    onPress={onBack}
                >
                    <FontAwesomeIcon 
                        icon={faArrowLeft} 
                        color={themeColors.textColor} 
                        size={20} 
                    />
                </Pressable>
                <Text style={styles.albumTitle}>{album.name}</Text>
                <Pressable 
                    onPress={handleItemSelect}
                    style={styles.iconButton}
                >
                    {({ pressed }) => (
                        <FontAwesomeIcon 
                            icon={faInfoCircle} 
                            size={18} 
                            color={pressed ? themeColors.accentColor : themeColors.textColorItalic} 
                        />
                    )}
                </Pressable>
                <Pressable 
                    style={styles.autoLinkButton}
                    onPress={onAutoLink}
                >
                    {({ pressed }) => (
                        <FontAwesomeIcon 
                            icon={faMagicWandSparkles} 
                            size={18} 
                            color={pressed ? themeColors.accentColor : themeColors.textColorItalic} 
                        />
                    )}
                </Pressable>
            </View>

            {selectedItem && (
                <View style={styles.detailViewContainer}>
                    <DetailedView
                        item={selectedItem}
                        onClose={handleCloseDetail}
                        onDelete={handleDelete}
                        updateItem={updateItem}
                    />
                </View>
            )}
        </>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    albumHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: themeColors.cardColor,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    detailViewContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        elevation: 5, // for Android
    },
    backButton: {
        padding: 10,
        backgroundColor: themeColors.cardColor,
        borderRadius: 12,
        marginRight: 15,
    },
    albumTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColorBold,
    },
    iconButton: {
        padding: 8,
        marginRight: 20,
    },
    autoLinkButton: {
        zIndex: 1000,
    },
}); 