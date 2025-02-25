import { View, Text, StyleSheet } from 'react-native';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
interface FetchedTracksModalProps {     
    progress: {
        current: number;
        total: number;
    };
    loadingTrack: string | null;
}

const FetchedTracksModal = ({ progress, loadingTrack }: FetchedTracksModalProps) => {        
    const { theme, designs } = useThemeStyles();
    const styles = getStyles(theme);

    return (
        loadingTrack && (
            <View style={styles.loadingContainer}>
                <Text style={[designs.text.text, styles.loadingText]}>
                    Fetching track {progress.current} of {progress.total}
                </Text>
                <Text style={[designs.text.text, styles.loadingTrackName]}>
                    "{loadingTrack}"
                </Text>
            </View>
        )
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundColor,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderColor,
        margin: 20,
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textColorBold,
    },
    loadingTrackName: {
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: 16,
        color: theme.colors.textColor,
    },
});

export default FetchedTracksModal;