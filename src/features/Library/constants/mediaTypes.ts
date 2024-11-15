import { 
    faFilm, 
    faTv, 
    faBook, 
    faGamepad, 
    faMusic,
    IconDefinition
} from '@fortawesome/free-solid-svg-icons';

import MovieSearchModal from '../modals/MovieModal';
import BookSearchModal from '../modals/BookModal';
import VideoGameSearchModal from '../modals/VideoGameModal';
import MusicSearchModal from '../modals/MusicModal';
import SeriesSearchModal from '../modals/SeriesModal';

// Define the media type interface
interface MediaType {
    type: 'movie' | 'series' | 'book' | 'videogame' | 'music';
    icon: IconDefinition;
    SearchModalComponent: React.ComponentType<any>;
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: () => void;
}

export const mediaTypes: MediaType[] = [
    { 
        type: 'movie', 
        icon: faFilm, 
        SearchModalComponent: MovieSearchModal, 
        modalVisible: false, 
        setModalVisible: () => {}, 
        openModal: () => {} 
    },
    { 
        type: 'series', 
        icon: faTv, 
        SearchModalComponent: SeriesSearchModal, 
        modalVisible: false, 
        setModalVisible: () => {}, 
        openModal: () => {} 
    },
    { 
        type: 'book', 
        icon: faBook, 
        SearchModalComponent: BookSearchModal, 
        modalVisible: false, 
        setModalVisible: () => {}, 
        openModal: () => {} 
    },
    { 
        type: 'videogame', 
        icon: faGamepad, 
        SearchModalComponent: VideoGameSearchModal, 
        modalVisible: false, 
        setModalVisible: () => {}, 
        openModal: () => {} 
    },
    { 
        type: 'music', 
        icon: faMusic, 
        SearchModalComponent: MusicSearchModal, 
        modalVisible: false, 
        setModalVisible: () => {}, 
        openModal: () => {} 
    },
]; 