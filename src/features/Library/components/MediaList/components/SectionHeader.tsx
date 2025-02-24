import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { LibraryData } from '@/src/types/Library';

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
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

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
                        color={theme.colors.textColor} 
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
                                trackColor={{ false: theme.colors.gray, true: theme.colors.accentColor }}
                                thumbColor={theme.colors.accentColor}
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
                                trackColor={{ false: theme.colors.gray, true: theme.colors.accentColor }}
                                thumbColor={theme.colors.accentColor}
                            />
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: theme.colors.backgroundSecondary,
        marginHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
    },
    backButton: {
        padding: 10,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 12,
        marginRight: 15,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textColorBold,
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
        color: theme.colors.textColor,
        marginRight: 8,
        fontSize: 12,
    },
}); 