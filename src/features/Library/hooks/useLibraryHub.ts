import { useState, useEffect, useMemo } from 'react';
import { databaseManagers } from '@/database/tables';
import { LibraryData } from '@/src/types/Library';

interface LibraryStats {
    totalItems: number;
    inProgress: number;
    thisMonth: number;
}

interface WeeklyActivityData {
    movies: number[];
    series: number[];
    books: number[];
    videogames: number[];
    music: number[];
}

export const useLibraryHub = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<LibraryStats>({
        totalItems: 0,
        inProgress: 0,
        thisMonth: 0
    });
    const [recentActivity, setRecentActivity] = useState<LibraryData[]>([]);
    const [mediaTypeCounts, setMediaTypeCounts] = useState<Record<string, number>>({
        movie: 0,
        series: 0,
        book: 0,
        videogame: 0,
        music: 0
    });

    const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityData>({
        movies: Array(52).fill(0),
        series: Array(52).fill(0),
        books: Array(52).fill(0),
        videogames: Array(52).fill(0),
        music: Array(52).fill(0)
    });

    const fetchLibraryData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get total items
            const allItems = await databaseManagers.library.getLibrary({});

            // Calculate weekly activity
            const weeklyData = calculateWeeklyActivity(allItems);
            setWeeklyActivity(weeklyData);
            
            // Calculate stats
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            
            const stats: LibraryStats = {
                totalItems: allItems.length,
                inProgress: allItems.filter(item => item.leftAt && !item.finished).length,
                thisMonth: allItems.filter(item => {
                    const itemDate = new Date(item.updatedAt!);
                    return itemDate >= firstDayOfMonth;
                }).length
            };

            // Calculate media type counts
            const counts: Record<string, number> = {
                movie: 0,
                series: 0,
                book: 0,
                videogame: 0,
                music: 0
            };

            allItems.forEach(item => {
                if (counts.hasOwnProperty(item.type)) {
                    counts[item.type]++;
                }
            });

            // Get recent activity
            const recent = await databaseManagers.library.getLibrary({
                limit: 10,
                sort: 'seen'
            });

            setStats(stats);
            setMediaTypeCounts(counts);
            setRecentActivity(recent);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching library data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLibraryData();
    }, []);

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        
        return Math.floor(seconds) + ' seconds ago';
    };

    const formattedRecentActivity = useMemo(() => 
        recentActivity.map(item => ({
            ...item,
            timeAgo: getTimeAgo(item.updatedAt!)
        }))
    , [recentActivity]);

    const getWeekNumber = (date: Date): number => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.floor(days / 7);
        return Math.min(weekNumber, 51); // Ensure we don't exceed 51 (52 weeks - 1 for zero-based index)
    };

    const calculateWeeklyActivity = (items: LibraryData[]) => {
        const weeklyData: WeeklyActivityData = {
            movies: Array(52).fill(0),
            series: Array(52).fill(0),
            books: Array(52).fill(0),
            videogames: Array(52).fill(0),
            music: Array(52).fill(0)
        };

        items.forEach(item => {
            if (item.seen) {
                const itemDate = new Date(item.seen);
                const currentYear = new Date().getFullYear();
                
                // Only count items from the current year
                if (itemDate.getFullYear() === currentYear) {
                    const weekNumber = getWeekNumber(itemDate);
                    
                    switch (item.type) {
                        case 'movie':
                            weeklyData.movies[weekNumber]++;
                            break;
                        case 'series':
                            weeklyData.series[weekNumber]++;
                            break;
                        case 'book':
                            weeklyData.books[weekNumber]++;
                            break;
                        case 'videogame':
                            weeklyData.videogames[weekNumber]++;
                            break;
                        case 'music':
                            weeklyData.music[weekNumber]++;
                            break;
                    }
                }
            }
        });

        return weeklyData;
    };


    return {
        isLoading,
        error,
        stats,
        mediaTypeCounts,
        recentActivity: formattedRecentActivity,
        weeklyActivity,
        refreshData: fetchLibraryData
    };
};