import DetailedView from '@/src/features/Library/components/MediaList/components/DetailedView/DetailedView';
import { useLocalSearchParams, router } from 'expo-router';
import { useMediaList } from '@/src/features/Library/hooks/useMediaList';
import { useAlbumManagement } from '@/src/features/Music/hooks/useAlbumManagement';

export default function DetailPage() {
    const { type, title } = useLocalSearchParams<{ type: string; title: string }>();
    
    // Convert plural to singular for mediaType
    const mediaTypeMap = {
        movies: 'movie',
        series: 'series',
        books: 'book',
        videogames: 'videogame',
        music: 'music'
    } as const;
    
    const mediaType = mediaTypeMap[type as keyof typeof mediaTypeMap];
    const { items, handleDelete, handleToggleDownload, updateItem } = useMediaList(mediaType, false);
    
    // Add album management
    const { albums } = useAlbumManagement();
    const album = mediaType === 'music' 
        ? albums.find(album => album.name === title) || undefined
        : undefined;
    
    const item = items.find(i => i.title === title);
    
    if (!item) return null;

    return (
        <DetailedView
            item={item}
            onClose={() => router.back()}
            onDelete={handleDelete}
            onToggleDownload={(mediaType === 'music' || mediaType === 'book') ? handleToggleDownload : undefined}
            updateItem={updateItem}
            album={album}
        />
    );
}