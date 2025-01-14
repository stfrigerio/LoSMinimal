import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import MediaList from '@/src/features/Library/components/MediaList/MediaList';
import Navbar from '@/src/components/NavBar';
import Card from '@/src/features/Library/components/MediaList/components/Card';
import DetailedView from '@/src/features/Library/components/MediaList/components/DetailedView/DetailedView';
import { mediaTypes } from '@/src/features/Library/constants/mediaTypes';

export default function MediaTypePage() {
    const { type } = useLocalSearchParams<{ type: string }>();
    const [modalVisible, setModalVisible] = useState(false);

    // Map route types to section numbers
    const sectionMap = {
        movies: 0,
        series: 1,
        books: 2,
        videogames: 3,
        music: 4
    } as const;

    const section = sectionMap[type as keyof typeof sectionMap];

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const mediaTypesWithState = mediaTypes.map(type => ({
        ...type,
        modalVisible,
        setModalVisible,
        openModal: handleOpenModal
    }));

    const navItems = ['Movies', 'Series', 'Books', 'Videogames', 'Music', 'Settings'].map((title, index) => ({
        label: title,
        onPress: () => router.push(`/library/${type}`)
    }));
    
    return (
        <>
            <MediaList
                key={`media-list-${section}`}
                mediaType={mediaTypesWithState[section!].type}
                CardComponent={Card}
                DetailedViewComponent={DetailedView}
                SearchModalComponent={mediaTypesWithState[section!].SearchModalComponent}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <Navbar
                items={navItems}
                activeIndex={section + 1}
                screen={mediaTypesWithState[section].type}
                quickButtonFunction={handleOpenModal}
            />
        </>
    )
}