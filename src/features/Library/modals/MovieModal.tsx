import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, FlatList, StyleSheet, Image } from 'react-native';

import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal';
import Toast from 'react-native-toast-message';

import { fetchMovies, isImdbId, getByImdbId, Movie } from '../api/movieFetcher';
import { useThemeStyles } from '../../../styles/useThemeStyles';

import { LibraryData } from '../../../types/Library';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface MovieSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveToLibrary: (movie: LibraryData) => void;
    showWantToList: boolean;
}

const MovieSearchModal: React.FC<MovieSearchModalProps> = ({ 
    isOpen, 
    onClose, 
    onSaveToLibrary, 
    showWantToList 
}) => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [personalRating, setPersonalRating] = useState(0);
    const [showSearch, setShowSearch] = useState(true); // Show search initially
    const [showMoviesList, setShowMoviesList] = useState(false);
    const [showRatingInput, setShowRatingInput] = useState(false);
    const [detailedMovie, setDetailedMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const handleSearch = async () => {
        try {
            const fetchedMovies = await fetchMovies(query);
            if (!fetchedMovies || fetchedMovies.length === 0) {
                setError('No movies found. Please try a different search.');
                return;
            }
            setMovies(fetchedMovies);
            setShowSearch(false); 
            setShowMoviesList(true);
        } catch (err) {
            setError('Failed to search for movies. Please try again.');
        }
    };

    const handleSelectMovie = async (movie: Movie) => {
        try {
            if (movie.imdbID && isImdbId(movie.imdbID)) {
                const detailedData = await getByImdbId(movie.imdbID);
                setDetailedMovie(detailedData);
                setShowMoviesList(false); 
                setShowRatingInput(true); 
            }
        } catch (err) {
            setError('Failed to fetch movie details. Please try again.');
        }
    };

    const handleSave = () => {
        if (detailedMovie) {
            if (showWantToList) {
                const libraryData: LibraryData = {
                    id: parseInt(detailedMovie.imdbID.replace('tt', '')),
                    title: detailedMovie.Title,
                    seen: '',
                    type: 'movie',
                    genre: detailedMovie.Genre,
                    creator: detailedMovie.Director,
                    releaseYear: detailedMovie.Year,
                    rating: personalRating,
                    comments: '', // You might want to add a field for comments in your modal
                    mediaImage: detailedMovie.Poster,
                    boxOffice: detailedMovie.BoxOffice,
                    plot: detailedMovie.Plot,
                    cast: detailedMovie.Actors,
                    writer: detailedMovie.Writer,
                    metascore: detailedMovie.Metascore ? detailedMovie.Metascore : undefined,
                    ratingImdb: detailedMovie.imdbRating ? detailedMovie.imdbRating : undefined,
                    tomato: detailedMovie.tomato,
                    runtime: detailedMovie.Runtime,
                    awards: detailedMovie.Awards,
                    finished: 0
                };

                onSaveToLibrary(libraryData);
            } else {
                const today = new Date()
                const todayString = today.toISOString().slice(0, 10);
        
                const libraryData: LibraryData = {
                    id: parseInt(detailedMovie.imdbID.replace('tt', '')),
                    title: detailedMovie.Title,
                    seen: todayString,
                    type: 'movie',
                    genre: detailedMovie.Genre,
                    creator: detailedMovie.Director,
                    releaseYear: detailedMovie.Year,
                    rating: personalRating,
                    comments: '', // You might want to add a field for comments in your modal
                    mediaImage: detailedMovie.Poster,
                    boxOffice: detailedMovie.BoxOffice,
                    plot: detailedMovie.Plot,
                    cast: detailedMovie.Actors,
                    writer: detailedMovie.Writer,
                    metascore: detailedMovie.Metascore ? detailedMovie.Metascore : undefined,
                    ratingImdb: detailedMovie.imdbRating ? detailedMovie.imdbRating : undefined,
                    tomato: detailedMovie.tomato,
                    runtime: detailedMovie.Runtime,
                    awards: detailedMovie.Awards,
                    finished: 1
                };

                onSaveToLibrary(libraryData);
            }

            // reset everything
            setQuery('');
            setMovies([]);
            setPersonalRating(0);
            setShowSearch(true);
            setShowMoviesList(false);
            setShowRatingInput(false);
            setDetailedMovie(null);

            Toast.show({
                text1: `Movie "${detailedMovie.Title}" saved to ${showWantToList ? 'want to list' : 'library'}`,
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
                        <Text style={designs.modal.title}>Search for a Movie</Text>
                        <TextInput
                            style={[designs.text.input, { marginBottom: 40, marginTop: 10 }]}
                            value={query}
                            onChangeText={setQuery}
                            onEndEditing={(e) => setQuery(e.nativeEvent.text.trim())}
                            placeholder="Enter movie title"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={handleSearch}
                        />
                        <PrimaryButton
                            text="Search"
                            onPress={handleSearch}
                        />
                    </>
                )}
                {showMoviesList && (
                    <View>
                        {movies.map((item) => (
                            <Pressable 
                                key={item.imdbID.toString()}
                                style={styles.movieItem} 
                                onPress={() => handleSelectMovie(item)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.Poster }} style={styles.movieImage} />
                                    <View style={{ flexDirection: 'column'}}>
                                        <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{item.Title}</Text>
                                        <Text style={designs.text.text}>({new Date(item.Year).getFullYear()})</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
                {showRatingInput && detailedMovie && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={designs.modal.title}>Rate this movie</Text>
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
};

export default MovieSearchModal;

const getStyles = (theme: any) => StyleSheet.create({
    movieItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 5,
    },
    movieImage: {
        width: 50,
        height: 70,
        marginRight: 10,
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