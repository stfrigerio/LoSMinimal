import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { Album } from '../types';

interface MusicHeaderProps {
    album: Album;
    onBack: () => void;
    onAutoLink: () => void;
}

export const MusicHeader = ({ album, onBack, onAutoLink }: MusicHeaderProps) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
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
                style={styles.autoLinkButton}
                onPress={onAutoLink}
                android_ripple={{ color: themeColors.accentColorShade, borderless: true }}
            >
                <FontAwesomeIcon 
                    icon={faMagicWandSparkles} 
                    size={14} 
                    color={themeColors.textColorItalic} 
                />
            </Pressable>
        </View>
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
    autoLinkButton: {
        zIndex: 1000,
    },
}); 