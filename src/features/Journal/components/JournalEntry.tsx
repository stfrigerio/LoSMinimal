import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Theme, useThemeStyles } from '../../../styles/useThemeStyles';
import { JournalData } from '../../../types/Journal';

interface JournalEntryProps {
    item: JournalData;
    onSelect: () => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ item, onSelect }) => {
    const { theme, designs } = useThemeStyles();
    const styles = useMemo(() => getStyles(theme, designs), [theme, designs]);

    const formatDateTime = (date: string | number | Date) => {
        const d = new Date(date);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <Pressable onPress={onSelect} style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.date}>{formatDateTime(item.date)}</Text>
                <Text style={styles.preview} numberOfLines={2} ellipsizeMode="tail">
                    {item.text}
                </Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} color={theme.colors.textColor} size={16} />
        </Pressable>
    );
};

const getStyles = (theme: Theme, designs: any) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    contentContainer: {
        flex: 1,
        marginRight: 10,
    },
    date: {
        ...designs.text.text,
        color: 'gray',
        marginBottom: 5,
    },
    preview: {
        ...designs.text.text,
    },
});

export default JournalEntry;