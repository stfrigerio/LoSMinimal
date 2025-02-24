import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, BackHandler } from 'react-native';

import { LibraryData } from '@/src/types/Library';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { Album } from '@/src/features/Music/types';
import { ensureHttpsUrl, handleMarkAsFinished, handleRatingChange } from './helpers';
import { RenderRating, RenderFinishButton, RenderCommonDetails, RenderSpecificDetails, EditableTitle, DeleteButton } from './components';

interface DetailedViewProps {
    item: LibraryData;
    onClose: () => void;
    onDelete: (item: LibraryData) => void;
    onToggleDownload?: (item: LibraryData) => Promise<void>;
    updateItem: (item: LibraryData) => Promise<void>;
    album?: Album;
}

const DetailedView: React.FC<DetailedViewProps> = ({ item, onClose, onDelete, onToggleDownload, updateItem, album }) => {
    const { theme } = useThemeStyles();
    const [currentRating, setCurrentRating] = useState(item.rating);
    const styles = getStyles(theme);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.title);

    return (
        <>
            <ScrollView style={styles.container}>
                <Image source={{ uri: ensureHttpsUrl(item.mediaImage) }} style={styles.poster} />
                <View style={styles.details}>
                    <EditableTitle 
                        isEditingTitle={isEditingTitle}
                        item={item}
                        editedTitle={editedTitle}
                        setEditedTitle={setEditedTitle}
                        updateItem={updateItem}
                        setIsEditingTitle={setIsEditingTitle}
                    />
                    {RenderRating(
                        currentRating, 
                        (newRating) => handleRatingChange(
                            newRating, 
                            item, 
                            updateItem, 
                            setCurrentRating
                        )
                    )}                   
                    <View style={styles.divider} />
                    {RenderCommonDetails(item)}
                    <View style={styles.divider} />
                    <RenderSpecificDetails item={item} album={album} updateItem={updateItem} />
                    {RenderFinishButton(item, () => handleMarkAsFinished(item, updateItem))}
                    <DeleteButton onDelete={onDelete} onClose={onClose} item={item} />
                </View>
                <View style={{ height: 80 }} />
            </ScrollView>
        </>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
        paddingTop: 40
    },
    details: {
        flex: 1,
        padding: 20,
        color: theme.colors.textColor,
        fontSize: 14,
    }, 
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textColorBold,
        marginBottom: 5,
        marginTop: 15,
    },
    poster: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
    },
    divider: {
        height: 2,
        backgroundColor: theme.colors.borderColor,
        marginVertical: 20,
        opacity: 0.5,
    },
});

export default DetailedView;