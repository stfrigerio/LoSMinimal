import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMagicWandSparkles, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { LibraryData } from '@/src/types/Library';

interface SectionHeaderProps {
    section: string;
    onBack: () => void;
}

export const SectionHeader = ({ section, onBack }: SectionHeaderProps) => {
    const { themeColors } = useThemeStyles();
    const styles = getStyles(themeColors);

    const getTitle = () => {
        if (section === 'music') return '🎧 Music';
        if (section === 'videogame') return '🎮 Videogames';
        if (section === 'book') return '📚 Books';
        if (section === 'series') return '📺 Series';
        if (section === 'movie') return '🎥 Movies';

        return section;
    }

    return (
        <>
            <View style={styles.header}>
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
                <Text style={styles.title}>{getTitle()}</Text>
            </View>
        </>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    header: {
        flexDirection: 'row',
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
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.textColorBold,
        textAlign: 'center',
    },
}); 