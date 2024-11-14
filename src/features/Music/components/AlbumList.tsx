import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

import { Album } from '../types';
import { useThemeStyles } from '@/src/styles/useThemeStyles';

interface AlbumListProps {
    albums: Album[];
    onSelectAlbum: (album: Album) => void;
}

export const AlbumList = ({ albums, onSelectAlbum }: AlbumListProps) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const renderAlbumItem = ({ item }: { item: Album }) => (
        <Pressable 
            style={({ pressed }) => [
                styles.albumItem,
                pressed && styles.albumItemPressed
            ]} 
            onPress={() => onSelectAlbum(item)}
        >
            <View style={styles.albumIconContainer}>
                <FontAwesomeIcon 
                    icon={faMusic} 
                    size={20} 
                    color={themeColors.textColorItalic} 
                />
            </View>
            <Text style={styles.albumTitle}>{item.name}</Text>
            <Text style={styles.songCount}>{item.songs.length} tracks</Text>
        </Pressable>
    );

    return (
        <FlatList
            data={albums}
            renderItem={renderAlbumItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.albumList}
        />
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    albumList: {
        padding: 20,
    },
    albumItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.cardColor,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: themeColors.borderColor,
    },
    albumItemPressed: {
        backgroundColor: themeColors.accentColor,
        transform: [{ scale: 0.98 }],
    },
    albumIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: themeColors.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    albumTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColorBold,
    },
    songCount: {
        fontSize: 14,
        color: themeColors.textColorItalic,
    },
}); 