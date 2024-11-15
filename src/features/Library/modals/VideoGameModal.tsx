import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

import { searchGames, GameSearchResult } from '../api/videogameFetcher';
import { useThemeStyles } from '../../../styles/useThemeStyles';
import { LibraryData } from '../../../types/Library';

interface GameSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveToLibrary: (game: LibraryData) => void;
}

const VideoGameSearchModal: React.FC<GameSearchModalProps> = ({ isOpen, onClose, onSaveToLibrary }) => {
    const [query, setQuery] = useState('');
    const [games, setGames] = useState<GameSearchResult[]>([]);
    const [personalRating, setPersonalRating] = useState(0);
    const [showSearch, setShowSearch] = useState(true);
    const [showGamesList, setShowGamesList] = useState(false);
    const [showRatingInput, setShowRatingInput] = useState(false);
    const [detailedGame, setDetailedGame] = useState<GameSearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const handleSearch = async () => {
        try {
            const fetchedGames = await searchGames(query);
            if (!fetchedGames || fetchedGames.length === 0) {
                setError('No games found. Please try a different search.');
                return;
            }
            setGames(fetchedGames);
            setShowSearch(false);
            setShowGamesList(true);
        } catch (err) {
            setError('Failed to search for games. Please try again.');
        }
    };

    const handleSelectGame = (game: GameSearchResult) => {
        try {
            setDetailedGame(game);
            setShowGamesList(false);
            setShowRatingInput(true);
        } catch (err) {
            setError('Failed to fetch game details. Please try again.');
        }
    };

    const handleSave = () => {
        if (detailedGame) {
            const today = new Date();
            const todayString = today.toISOString().slice(0, 10);
            const genreNames = detailedGame.genres ? detailedGame.genres.map(genre => genre.name).join(', ') : '';
            const companyNames = detailedGame.involved_companies ? detailedGame.involved_companies.map(ic => ic.company.name).join(', ') : '';

            onSaveToLibrary({
                id: detailedGame.id,
                title: detailedGame.name,
                seen: todayString,
                type: 'videogame',
                genre: genreNames,
                creator: companyNames,
                releaseYear: detailedGame.first_release_date ? detailedGame.first_release_date.toString() : 'Unknown',
                mediaImage: detailedGame.cover.url.replace('thumb', 'cover_big'),
                plot: detailedGame.summary,
                metascore: detailedGame.igdbRating,
                comments: '',
                rating: personalRating,
                finished: 1,
            });

            // reset everything
            setQuery('');
            setGames([]);
            setPersonalRating(0);
            setShowSearch(true);
            setShowGamesList(false);
            setShowRatingInput(false);
            setDetailedGame(null);

            Toast.show({
                text1: `Game "${detailedGame.name}" saved to library`,
                type: 'success',
            });

            onClose();
        }
    };

    return (
        <>
            <UniversalModal
                isVisible={isOpen}
                onClose={onClose}
            >
                {showSearch && (
                    <>
                        <Text style={designs.modal.title}>Search for a Game</Text>
                        <TextInput
                            style={[designs.text.input, { marginBottom: 40, marginTop: 10 }]}
                            value={query}
                            onChangeText={setQuery}
                            onEndEditing={(e) => setQuery(e.nativeEvent.text.trim())}
                            placeholder="Enter game title"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={handleSearch}
                        />
                        <PrimaryButton
                            text="Search"
                            onPress={handleSearch}
                        />
                    </>
                )}
                {showGamesList && (
                    <View>
                        {games.map((item) => (
                            <Pressable 
                                key={item.id.toString()}
                                style={styles.gameItem} 
                                onPress={() => handleSelectGame(item)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.cover && item.cover.url && (
                                        <Image 
                                            source={{ uri: `https:${item.cover.url}` }} 
                                            style={styles.gameImage} 
                                        />
                                    )}
                                    <View style={{ flexDirection: 'column'}}>
                                        <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{item.name}</Text>
                                        <Text style={designs.text.text}>{item.first_release_date}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
                {showRatingInput && detailedGame && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={designs.modal.title}>Rate this game</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable
                                    key={star}
                                    onPress={() => setPersonalRating(star)}
                                    style={{ padding: 5 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faStar} 
                                        size={20} 
                                        color={star <= personalRating ? themeColors.textColor : 'gray'} 
                                    />
                                </Pressable>
                            ))}
                        </View>
                        <PrimaryButton
                            text="Save to Library"
                            onPress={handleSave}
                        />
                    </View>
                )}
            </UniversalModal>
            {error && 
                <AlertModal
                    isVisible={!!error}
                    title="Error"
                    message={error || ''}
                    onConfirm={() => setError(null)}
                    singleButton
                />
            }
        </>
    );
}

export default VideoGameSearchModal

const getStyles = (theme: any) => StyleSheet.create({
    gameItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 5,
    },
    gameImage: {
        width: 50,
        height: 70,
        marginRight: 10,
    },
    loadingText: {
        color: theme.textColor,
        marginTop: 10
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: theme.cardColor,
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
    },
});