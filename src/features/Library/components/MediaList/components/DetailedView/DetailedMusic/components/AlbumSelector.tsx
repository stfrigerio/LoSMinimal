import { Pressable, Text, View, Image, StyleSheet } from "react-native";
import { UniversalModal } from "@/src/components/modals/UniversalModal";
import { Album, useSpotifyFetcher } from "@/src/features/Library/api/musicFetcher";

import { useThemeStyles } from "@/src/styles/useThemeStyles";
import FetchedTracksModal from "./FetchedTracksModal";
import { LibraryData } from "@/src/types/Library";
import { AlbumSelectionProps } from "../helpers/refetchTracks";

interface AlbumSelectorProps {
    showAlbumSelector: boolean;
    setShowAlbumSelector: (show: boolean) => void;
    searchResults: Album[];
    handleAlbumSelection: (props: AlbumSelectionProps) => void;
    progress: {
        current: number;
        total: number;
    };
    loadingTrack: string | null;
    // Add the remaining props needed for AlbumSelectionProps
    item: LibraryData;
    setLoadingTrack: (track: string | null) => void;
    setProgress: (progress: { current: number; total: number }) => void;
    refresh: () => void;
    fetcher: ReturnType<typeof useSpotifyFetcher>;
}

const AlbumSelector = ({ 
    showAlbumSelector, 
    setShowAlbumSelector, 
    searchResults, 
    handleAlbumSelection, 
    progress, 
    loadingTrack,
    item,
    setLoadingTrack,
    setProgress,
    refresh,
    fetcher
}: AlbumSelectorProps) => {
    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    return (
        <UniversalModal
            isVisible={showAlbumSelector}
            onClose={() => setShowAlbumSelector(false)}
        >
            <Text style={[designs.modal.title, { marginBottom: 20 }]}>Select Matching Album</Text>
            <View>
                {searchResults.map((album) => (
                    <Pressable 
                        key={album.id}
                        style={styles.albumItem} 
                        onPress={() => handleAlbumSelection({
                            selectedAlbum: album,
                            setLoadingTrack,
                            setProgress,
                            refresh,
                            setShowAlbumSelector,
                            item,  // this is the LibraryData item from props
                            fetcher
                        })}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: album.images[0]?.url }} style={styles.albumImage} />
                            <View style={{ flexDirection: 'column'}}>
                                <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{album.name}</Text>
                                <Text style={designs.text.text}>{album.artists[0].name}</Text>
                                <Text style={designs.text.text}>
                                    ({new Date(album.release_date).getFullYear()})
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>
            <FetchedTracksModal 
                progress={progress}
                loadingTrack={loadingTrack}
            />
        </UniversalModal>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    albumItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: themeColors.backgroundSecondary,
        borderBottomWidth: 1,
        borderColor: themeColors.borderColor,
        borderRadius: 5,
    },
    albumImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
});

export default AlbumSelector;