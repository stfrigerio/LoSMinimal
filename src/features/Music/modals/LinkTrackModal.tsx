import React from 'react';
import { View, Text, Modal, FlatList, Pressable, StyleSheet } from 'react-native';
import { TrackData } from '@/src/types/Library';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { UniversalModal } from '@/src/components/modals/UniversalModal';

interface LinkTrackModalProps {
    isVisible: boolean;
    onClose: () => void;
    fileName: string;
    availableTracks: ExtendedTrackData[];
    onLinkTrack: (track: ExtendedTrackData) => void;
}

interface ExtendedTrackData extends TrackData {
    artistName: string;
}

const LinkTrackModal = ({ 
    isVisible, 
    onClose, 
    fileName, 
    availableTracks, 
    onLinkTrack 
}: LinkTrackModalProps) => {
    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        <UniversalModal
            isVisible={isVisible}
            onClose={onClose}
        >
            <Text style={styles.modalTitle}>Link File to Track</Text>
            <Text style={styles.modalSubtitle}>File: {fileName}</Text>
            
            <View>
                {availableTracks.length > 0 ? (
                    availableTracks.map((track) => (
                        <Pressable
                            key={track.uuid}
                            style={styles.trackOption}
                            onPress={() => onLinkTrack(track)}
                        >
                            <Text style={styles.trackOptionTitle}>{track.trackName}</Text>
                            <Text style={styles.trackOptionDetails}>
                                {track.artistName} • {Math.floor(track.durationMs / 1000 / 60)}:
                                {String(Math.floor((track.durationMs / 1000) % 60)).padStart(2, '0')}
                            </Text>
                        </Pressable>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No available tracks to link</Text>
                )}
            </View>
            
            <Pressable
                style={styles.closeButton}
                onPress={onClose}
            >
                <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
        </UniversalModal>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: theme.borderRadius.lg,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textColorBold,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: theme.colors.textColorItalic,
        marginBottom: 20,
    },
    trackOption: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: theme.colors.backgroundColor,
        marginBottom: 8,
    },
    trackOptionTitle: {
        fontSize: 16,
        color: theme.colors.textColor,
        marginBottom: 4,
    },
    trackOptionDetails: {
        fontSize: 12,
        color: theme.colors.textColorItalic,
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: theme.colors.textColor,
        fontSize: 16,
    },
    emptyText: {
        color: theme.colors.textColorItalic,
        textAlign: 'center',
        padding: 20,
    },
});

export default LinkTrackModal;