import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { MoodNoteData } from '@/src/types/Mood';
import MoodEntry from './components/MoodEntry';
import MoodModal from '@/src/features/Mood/modals/MoodModal';

import { useMoodData } from '../../hooks/useMoodData';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { navItems } from '../../constants/navItems';
import MobileNavbar from '@/src/components/NavBar';

export const MoodList = () => { 
    const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());
    const { theme, designs } = useThemeStyles();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

    const { entries, isLoading, error, deleteMood, refreshMoods } = useMoodData();

    const sortedEntries = React.useMemo(() => {
        return [...entries].sort((a: MoodNoteData, b: MoodNoteData) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [entries]);
    
    const toggleExpand = (id: number) => {
        setExpandedEntries(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleMoodModalClose = useCallback(() => {
        setIsMoodModalOpen(false);
        refreshMoods();
    }, [refreshMoods]);

    const renderMoodEntry = React.useCallback(({ item }: { item: MoodNoteData }) => (
        <MoodEntry
            item={item}
            isExpanded={expandedEntries.has(item.id!)}
            toggleExpand={toggleExpand}
            deleteMood={deleteMood}
            refreshMoods={refreshMoods}
        />
    ), [expandedEntries, toggleExpand]);

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedEntries}
                renderItem={renderMoodEntry}
                keyExtractor={(item) => item.id!.toString()}
                style={styles.list}
                initialNumToRender={10}
                maxToRenderPerBatch={20}
                windowSize={21}
            />
            <MobileNavbar 
                items={navItems} 
                activeIndex={navItems.findIndex(item => item.label === 'List')} 
                quickButtonFunction={() => setIsMoodModalOpen(true)}
                screen="mood"
            />
            {isMoodModalOpen && (
                <MoodModal
                    isOpen={isMoodModalOpen}
                    closeMoodModal={handleMoodModalClose}
                />
            )}
        </View>
    );
};

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.backgroundColor,
            paddingTop: 30
        },
        list: {
            flex: 1,
        },
    });
};