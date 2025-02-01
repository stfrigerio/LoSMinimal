import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { LibraryData } from '@/src/types/Library';

interface SectionHeaderProps {
    section: string;
    onBack: () => void;
    showWantToList: boolean;
    setShowWantToList: (value: boolean) => void;
    showDownloadedOnly: boolean;
    setShowDownloadedOnly: (value: boolean) => void;
}

export const SectionHeader = ({ 
    section, 
    onBack, 
    showWantToList, 
    setShowWantToList,
    showDownloadedOnly,
    setShowDownloadedOnly,
}: SectionHeaderProps) => {
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

    // Add this helper function
    const getActionText = (mediaType: string): string => {
        switch (mediaType) {
            case 'movie':
            case 'series':
                return 'to watch';
            case 'book':
                return 'to read';
            case 'videogame':
                return 'to play';
            case 'music':
                return 'to listen';
            default:
                return 'gnam gnam';
        }
    };
    
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
                <View style={styles.switchesContainer}>
                    {(section === 'music' || section === 'book') && (
                        <View style={styles.switchWrapper}>
                            <Text style={styles.switchLabel}>
                                {showDownloadedOnly ? 'downloaded' : 'all'}
                            </Text>
                            <Switch
                                value={showDownloadedOnly}
                                onValueChange={setShowDownloadedOnly}
                                trackColor={{ false: themeColors.gray, true: themeColors.accentColor }}
                                thumbColor={themeColors.accentColor}
                            />
                        </View>
                    )}
                    {section !== 'music' && (
                        <View style={styles.switchWrapper}>
                            <Text style={styles.switchLabel}>
                                {showWantToList ? `${getActionText(section)}` : 'library'}
                            </Text>
                            <Switch
                                value={showWantToList}
                                onValueChange={setShowWantToList}
                                trackColor={{ false: themeColors.gray, true: themeColors.accentColor }}
                                thumbColor={themeColors.accentColor}
                            />
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: themeColors.cardColor,
        marginHorizontal: 20,
        borderRadius: 20,
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
    switchesContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        color: themeColors.textColor,
        marginRight: 8,
        fontSize: 12,
    },
}); 