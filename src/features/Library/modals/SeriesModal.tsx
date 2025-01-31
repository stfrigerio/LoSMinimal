import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';

import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

import { fetchSeries, isImdbId, getByImdbId, Series } from '../api/seriesFetcher';
import { useThemeStyles } from '../../../styles/useThemeStyles';

import { LibraryData } from '../../../types/Library';

interface SeriesSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveToLibrary: (series: LibraryData) => void;
    showWantToList: boolean;
}       

const SeriesSearchModal: React.FC<SeriesSearchModalProps> = ({ isOpen, onClose, onSaveToLibrary, showWantToList }) => {
    const [query, setQuery] = useState('');
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [personalRating, setPersonalRating] = useState(0);
    const [showSearch, setShowSearch] = useState(true); 
    const [showSeriesList, setShowSeriesList] = useState(false);
    const [showRatingInput, setShowRatingInput] = useState(false);
    const [detailedSeries, setDetailedSeries] = useState<LibraryData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const handleSearch = async () => {
        try {
            const fetchedSeries = await fetchSeries(query);

            // Check if fetchedSeries is falsy OR empty array
            if (!fetchedSeries || !Array.isArray(fetchedSeries) || fetchedSeries.length === 0) {
                setError('No series found. Please try a different search.');
                setSeriesList([]); // Clear the list
                return;
            }
            
            setError(null);
            setSeriesList(fetchedSeries);
            setShowSearch(false);
            setShowSeriesList(true);
        } catch (err) {
            setError('Failed to search for series. Please try again.');
            setSeriesList([]); // Clear the list
        }
    };

    const handleSelectSeries = async (series: Series) => {
        try {
            if (series.imdbID && isImdbId(series.imdbID)) {
                const detailedData = await getByImdbId(series.imdbID);
                setDetailedSeries(detailedData);
                setShowSeriesList(false);
                setShowRatingInput(true);
            }
        } catch (err) {
            setError('Failed to fetch series details. Please try again.');
        }
    };

    const handleSave = () => {
        if (detailedSeries) {
            if (showWantToList) {
                onSaveToLibrary({
                    ...detailedSeries,
                    seen: '',
                    rating: personalRating,
                    finished: 0,
                });
            } else {
                const today = new Date()
                const todayString = today.toISOString().slice(0, 10);
                onSaveToLibrary({
                    ...detailedSeries,
                    seen: todayString,
                    rating: personalRating,
                    finished: 1,
                });
            }

            // reset everything
            setQuery('');
            setSeriesList([]);
            setPersonalRating(0);
            setShowSearch(true);
            setShowSeriesList(false);
            setShowRatingInput(false);
            setDetailedSeries(null);

            Toast.show({
                text1: `Series "${detailedSeries.title}" saved to ${showWantToList ? 'want to list' : 'library'}`,
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
                        <Text style={designs.modal.title}>Search for a Series</Text>
                        <TextInput
                            style={[designs.text.input, { marginBottom: 40, marginTop: 10 }]}
                            value={query}
                            onChangeText={setQuery}
                            onEndEditing={(e) => setQuery(e.nativeEvent.text.trim())}
                            placeholder="Enter series title"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={handleSearch}
                        />
                        <PrimaryButton
                            text="Search"
                            onPress={handleSearch}
                        />
                    </>
                )}
                {showSeriesList && (
                    <View>
                        {seriesList.map((item) => (
                            <Pressable 
                                key={item.imdbID.toString()}
                                style={styles.seriesItem} 
                                onPress={() => handleSelectSeries(item)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.Poster }} style={styles.serieImage} />
                                    <View style={{ flexDirection: 'column'}}>
                                        <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{item.Title}</Text>
                                        <Text style={designs.text.text}>({item.Year})</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
                {showRatingInput && detailedSeries && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={designs.modal.title}>Rate this series</Text>
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
                {error && 
                    <AlertModal
                        isVisible={!!error}
                        title="Error"
                        message={error}
                        onConfirm={() => {
                            setError(null);
                            setShowSearch(true);
                            setShowSeriesList(false);
                        }}
                        singleButton
                    />
                }
            </UniversalModal>
        </>
    );
};

export default SeriesSearchModal;

const getStyles = (theme: any) => StyleSheet.create({
    seriesItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 5,
    },
    serieImage: {
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
