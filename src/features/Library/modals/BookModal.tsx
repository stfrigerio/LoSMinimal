import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';

import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { UniversalModal } from '@/src/components/modals/UniversalModal';
import AlertModal from '@/src/components/modals/AlertModal';

import { searchBooks, getBookDetails, SearchResult, DetailedBook } from '../api/bookFetcher';
import { useThemeStyles } from '../../../styles/useThemeStyles';
import { LibraryData } from '../../../types/Library';

interface BookSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveToLibrary: (book: LibraryData) => void;
    showWantToList: boolean;
}

const BookSearchModal: React.FC<BookSearchModalProps> = ({ 
    isOpen, 
    onClose, 
    onSaveToLibrary, 
    showWantToList 
}) => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<SearchResult[]>([]);
    const [personalRating, setPersonalRating] = useState(0);
    const [showSearch, setShowSearch] = useState(true);
    const [showBooksList, setShowBooksList] = useState(false);
    const [showRatingInput, setShowRatingInput] = useState(false);
    const [detailedBook, setDetailedBook] = useState<DetailedBook | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { themeColors, designs } = useThemeStyles();
    const styles = getStyles(themeColors);

    const handleSearch = async () => {
        try {
            const fetchedBooks = await searchBooks(query);
            if (!fetchedBooks || fetchedBooks.length === 0) {
                setError('No books found. Please try a different search.');
                return;
            }
            setBooks(fetchedBooks);
            setShowSearch(false);
            setShowBooksList(true);
        } catch (err) {
            setError('Failed to search for books. Please try again.');
        }
    };

    const handleSelectBook = async (book: SearchResult) => {
        try {
            const bookDetails = await getBookDetails(book.id);
            if (bookDetails) {
                setDetailedBook(bookDetails);
                setShowBooksList(false);
                setShowRatingInput(true);
            }
        } catch (err) {
            setError('Failed to fetch book details. Please try again.');
        }
    };

    const handleSave = () => {
        if (detailedBook) {
            
            if (showWantToList) {
                onSaveToLibrary({
                    id: detailedBook.ISBN_13,
                    title: detailedBook.title,
                    seen: '',
                    type: 'book',
                    genre: detailedBook.categories.join(', '),
                    creator: detailedBook.authors.join(', '),
                    releaseYear: detailedBook.publishedDate,
                    mediaImage: detailedBook.mediaImage,
                    plot: detailedBook.description,
                    pages: detailedBook.pageCount,
                    comments: '',
                    rating: personalRating,
                    finished: 0,
                });
            } else {
                const today = new Date();
                const todayString = today.toISOString().slice(0, 10);
                onSaveToLibrary({
                    id: detailedBook.ISBN_13,
                    title: detailedBook.title,
                    seen: todayString,
                    type: 'book',
                    genre: detailedBook.categories.join(', '),
                    creator: detailedBook.authors.join(', '),
                    releaseYear: detailedBook.publishedDate,
                    mediaImage: detailedBook.mediaImage,
                    plot: detailedBook.description,
                    pages: detailedBook.pageCount,
                    comments: '',
                    rating: personalRating,
                    finished: 1,
                });
            }

            // reset everything
            setQuery('');
            setBooks([]);
            setPersonalRating(0);
            setShowSearch(true);
            setShowBooksList(false);
            setShowRatingInput(false);
            setDetailedBook(null);

            Toast.show({
                text1: `Book "${detailedBook.title}" saved to ${showWantToList ? 'want to list' : 'library'}`,
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
                        <Text style={designs.modal.title}>Search for a Book</Text>
                        <TextInput
                            style={[designs.text.input, { marginBottom: 40, marginTop: 10 }]}
                            value={query}
                            onChangeText={setQuery}
                            onEndEditing={(e) => setQuery(e.nativeEvent.text.trim())}
                            placeholder="Enter book title"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={handleSearch}
                        />
                        <PrimaryButton
                            text="Search"
                            onPress={handleSearch}
                        />
                    </>
                )}
                {showBooksList && (
                    <View>
                        {books.map((item) => (
                            <Pressable 
                                key={item.id.toString()}
                                style={styles.bookItem} 
                                onPress={() => handleSelectBook(item)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={{ uri: item.mediaImage }} style={styles.bookImage} />
                                    <View style={{ flexDirection: 'column'}}>
                                        <Text style={[designs.text.text, {fontWeight: 'bold'}]}>{item.title}</Text>
                                        <Text style={designs.text.text}>{item.authors} ({new Date(item.publishedDate).getFullYear()})</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
                {showRatingInput && detailedBook && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Text style={designs.modal.title}>Rate this Book</Text>
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
                        message={error || ''}
                            onConfirm={() => setError(null)}
                            singleButton
                        />
                    }
            </UniversalModal>
        </>
    );
};

export default BookSearchModal;

const getStyles = (theme: any) => StyleSheet.create({
    bookItem: {
        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 0,
        backgroundColor: theme.backgroundColor,
        borderBottomWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 5,
    },
    bookImage: {
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