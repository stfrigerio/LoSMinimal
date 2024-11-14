import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Navbar from '@/src/components/NavBar';
import Card from './components/Card';
import DetailedView from './components/DetailedView';

import MovieSearchModal from './modals/MovieModal';
import BookSearchModal from './modals/BookModal';
import VideoGameSearchModal from './modals/VideoGameModal'
import MusicSearchModal from './modals/MusicModal';
import SeriesSearchModal from './modals/SeriesModal';

import { useThemeStyles } from '../../styles/useThemeStyles';
import Pager from '@/src/features/Library/components/MobilePager';
import MediaList from '@/src/features/Library/components/MediaList';

const LibraryHub: React.FC = () => {
	const [pageIndex, setPageIndex] = useState(0); // Use pageIndex as the source of truth
	const [movieModalVisible, setMovieModalVisible] = useState(false);
	const [seriesModalVisible, setSeriesModalVisible] = useState(false);
	const [bookModalVisible, setBookModalVisible] = useState(false);
	const [videogameModalVisible, setVideogameModalVisible] = useState(false);
	const [musicModalVisible, setMusicModalVisible] = useState(false);

	const { themeColors } = useThemeStyles();
	const styles = getStyles(themeColors);

	const pagerViewRef = useRef<any>(null);

	const onPageSelected = (e: any) => {
		const newIndex = e.nativeEvent.position;
		setPageIndex(newIndex); // Update the page index based on swipe
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

	const navItems = ['Movies', 'Series', 'Books', 'Videogames', 'Music'].map((title, index) => ({
		label: title,
		onPress: () => {
			setPageIndex(index);
			pagerViewRef.current?.setPage(index);
		},
	}));

	return (
		<View style={styles.mainContainer}>
			<View style={styles.container}>
				<Pager 
					style={styles.pagerView} 
					initialPage={0} 
					onPageSelected={onPageSelected} 
					ref={pagerViewRef}
				>
					{mediaTypes.map((media, index) => (
						<View key={index} style={styles.pageWrapper}>
							<MediaList
								mediaType={media.type}
								CardComponent={Card}
								DetailedViewComponent={DetailedView}
								SearchModalComponent={media.SearchModalComponent}
								modalVisible={media.modalVisible}
								setModalVisible={media.setModalVisible}
							/>
						</View>
					))}
				</Pager>
			</View>
			<Navbar
				items={navItems}
				activeIndex={pageIndex}
				screen={mediaTypes[pageIndex].type}
				quickButtonFunction={mediaTypes[pageIndex].openModal}
			/>
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
			height: '100%'
		},
		container: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			height: '100%',
			marginBottom: 80
		},
		button: {
			margin: 10,
			padding: 8,
			backgroundColor: theme.backgroundColor,
			borderRadius: 10,
			alignSelf: 'flex-start' 
		},
		text: {
			color: theme.textColor
		},
        pagerView: {
            flex: 1,
        },
        pageWrapper: {
            flex: 1,
            width: '100%',
        },
	});
}