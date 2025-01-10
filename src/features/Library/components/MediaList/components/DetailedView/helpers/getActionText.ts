export const getActionText = (mediaType: string): string => {
    switch (mediaType) {
        case 'book': return 'Read';
        case 'movie':
        case 'series': return 'Seen';
        case 'videogame': return 'Played';
        case 'music': return 'Listened';
        default: return 'Consumed';
    }
};