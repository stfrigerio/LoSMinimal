
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagicWandSparkles, faUnlink, faRefresh } from '@fortawesome/free-solid-svg-icons';

import { 
    onPressAutoLink, 
    handleRefetchTracks, 
    onPressUnlinkAll 
} from '../helpers';

import { Theme, useThemeStyles } from "@/src/styles/useThemeStyles";
import { LibraryData } from '@/src/types/Library';
import { Album, useSpotifyFetcher } from '@/src/features/Library/api/musicFetcher';

interface TracksHeaderProps {
    handleAutoLink: () => Promise<void>;
    refresh: () => void;
    handleUnlinkAll: () => Promise<void>;
    item: LibraryData;
    setSearchResults: (albums: Album[]) => void;
    setShowAlbumSelector: (show: boolean) => void;
    fetcher: ReturnType<typeof useSpotifyFetcher>;
}

const TracksHeader = ({ 
    handleAutoLink, 
    refresh, 
    handleUnlinkAll, 
    item, 
    setSearchResults, 
    setShowAlbumSelector,
    fetcher
}: TracksHeaderProps) => {
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <View style={styles.autoLinkContainer}>
            <Pressable 
                style={styles.autoLinkButton}
                onPress={() => onPressAutoLink(handleAutoLink, refresh)}
            >
                {({ pressed }) => (
                    <FontAwesomeIcon 
                        icon={faMagicWandSparkles} 
                        size={18} 
                        color={pressed ? theme.colors.accentColor : theme.colors.textColorItalic} 
                    />
                )}
            </Pressable>
            <Pressable 
                onPress={() => onPressUnlinkAll(handleUnlinkAll, refresh)}
            >
                {({ pressed }) => (
                    <FontAwesomeIcon 
                        icon={faUnlink} 
                        size={18} 
                        color={pressed ? theme.colors.accentColor : theme.colors.textColorItalic} 
                    />
                )}
            </Pressable>
            <Pressable 
                onPress={() => handleRefetchTracks({ item, setSearchResults, setShowAlbumSelector, fetcher })}
            >
                {({ pressed }) => (
                    <FontAwesomeIcon 
                        icon={faRefresh} 
                        size={18} 
                        color={pressed ? theme.colors.accentColor : theme.colors.textColorItalic} 
                    />
                )}
            </Pressable>
        </View>
    );
};


const getStyles = (theme: Theme) => StyleSheet.create({
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.textColorBold,
        marginBottom: 16,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    autoLinkButton: {
        zIndex: 1000,
    },
    autoLinkContainer: {
        // borderWidth: 1,
        alignSelf: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        gap: 30,
    },
}); 

export default TracksHeader;
