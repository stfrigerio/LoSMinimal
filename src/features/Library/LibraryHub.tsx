import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

import Navbar from '@/src/components/NavBar';
import Card from './components/Card';
import DetailedView from './components/DetailedView';

import MovieSearchModal from './modals/MovieModal';
import BookSearchModal from './modals/BookModal';
import VideoGameSearchModal from './modals/VideoGameModal'
import MusicSearchModal from './modals/MusicModal';
import SeriesSearchModal from './modals/SeriesModal';

import { useThemeStyles } from '../../styles/useThemeStyles';
import MediaList from '@/src/features/Library/components/MediaList';

const LibraryHub: React.FC = () => {
    const [currentSection, setCurrentSection] = useState<number | null>(null);
    const [isDashboard, setIsDashboard] = useState(true);

	const [movieModalVisible, setMovieModalVisible] = useState(false);
	const [seriesModalVisible, setSeriesModalVisible] = useState(false);
	const [bookModalVisible, setBookModalVisible] = useState(false);
	const [videogameModalVisible, setVideogameModalVisible] = useState(false);
	const [musicModalVisible, setMusicModalVisible] = useState(false);

	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

    const navigateToSection = (index: number) => {
        setCurrentSection(index);
        setIsDashboard(false);
    };

	const openMovieModal = () => setMovieModalVisible(true);
	const openSeriesModal = () => setSeriesModalVisible(true);
	const openBookModal = () => setBookModalVisible(true);
	const openVideogameModal = () => setVideogameModalVisible(true);
	const openMusicModal = () => setMusicModalVisible(true);

	const mediaTypes: Array<{
		type: 'movie' | 'series' | 'book' | 'videogame' | 'music';
		SearchModalComponent: React.ComponentType<any>;
		modalVisible: boolean;
		setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
		openModal: () => void;
	}> = [
		{ type: 'movie', SearchModalComponent: MovieSearchModal, modalVisible: movieModalVisible, setModalVisible: setMovieModalVisible, openModal: openMovieModal },
		{ type: 'series', SearchModalComponent: SeriesSearchModal, modalVisible: seriesModalVisible, setModalVisible: setSeriesModalVisible, openModal: openSeriesModal },
		{ type: 'book', SearchModalComponent: BookSearchModal, modalVisible: bookModalVisible, setModalVisible: setBookModalVisible, openModal: openBookModal },
		{ type: 'videogame', SearchModalComponent: VideoGameSearchModal, modalVisible: videogameModalVisible, setModalVisible: setVideogameModalVisible, openModal: openVideogameModal },
		{ type: 'music', SearchModalComponent: MusicSearchModal, modalVisible: musicModalVisible, setModalVisible: setMusicModalVisible, openModal: openMusicModal },
	];

	const returnToDashboard = () => {
        setIsDashboard(true);
        setCurrentSection(null);
    };

	const renderCurrentSection = () => {
        if (currentSection === null) return null;
        
        const media = mediaTypes[currentSection];
        return (
            <View style={styles.pageWrapper} key={currentSection}>
                <MediaList
                    key={`media-list-${currentSection}`}
                    mediaType={media.type}
                    CardComponent={Card}
                    DetailedViewComponent={DetailedView}
                    SearchModalComponent={media.SearchModalComponent}
                    modalVisible={media.modalVisible}
                    setModalVisible={media.setModalVisible}
					onBackPress={returnToDashboard}
                />
            </View>
        );
    };

    const navItems = ['Movies', 'Series', 'Books', 'Videogames', 'Music'].map((title, index) => ({
        label: title,
        onPress: () => navigateToSection(index)
    }));

    const Dashboard = () => (
        <View style={styles.dashboardContainer}>
            <View style={styles.gridContainer}>
                {mediaTypes.slice(0, 4).map((media, index) => (
                    <Pressable
                        key={index}
                        style={styles.gridCard}
                        onPress={() => navigateToSection(index)}
                    >
                        <Text style={styles.gridCardText}>
                            {navItems[index].label}
                        </Text>
                    </Pressable>
                ))}
            </View>
            <Pressable
                style={styles.musicCard}
                onPress={() => navigateToSection(4)}
            >
                <Text style={styles.gridCardText}>Music</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                {isDashboard ? (
                    <Dashboard />
                ) : (
                    renderCurrentSection()
                )}
            </View>
            {!isDashboard && currentSection !== null && (
                <Navbar
                    items={navItems}
                    activeIndex={currentSection + 1}
                    screen={mediaTypes[currentSection].type}
                    quickButtonFunction={mediaTypes[currentSection].openModal}
                />
            )}
        </View>
    );
};

export default LibraryHub;

const getStyles = (theme: any) => {
	return StyleSheet.create({
		mainContainer: {
			paddingTop: 37,
			flex: 1,
			backgroundColor: theme.backgroundColor,
		},
		container: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			marginBottom: 80  // Space for navbar
		},
		dashboardContainer: {
			flex: 1,
			padding: 16,
		},
		gridContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 16,
			marginBottom: 16,
		},
		gridCard: {
			width: '45%',
			height: 200,
			backgroundColor: theme.cardBackground || theme.backgroundColor,
			borderRadius: 12,
			justifyContent: 'center',
			alignItems: 'center',
			elevation: 3,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
		},
		musicCard: {
			width: '100%',
			height: 200,
			backgroundColor: theme.cardBackground || theme.backgroundColor,
			borderRadius: 12,
			justifyContent: 'center',
			alignItems: 'center',
			elevation: 3,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
		},
		gridCardText: {
			color: theme.textColor,
			fontSize: 18,
			fontWeight: 'bold',
		},
		pageWrapper: {
			flex: 1,
		}
	});
}