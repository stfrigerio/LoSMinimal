import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { TagData } from '@/src/types/TagsAndDescriptions';

interface TagDescriptionSelectorProps {
    tag?: TagData | string;
    description?: TagData | string;
    onPress: () => void;
}

const TagDescriptionSelector: React.FC<TagDescriptionSelectorProps> = ({ tag, description, onPress }) => {
    const { designs, theme } = useThemeStyles();
    const styles = getStyles(theme);

    const renderTagOrDescription = (item: TagData | string | undefined, defaultText: string) => {
        if (!item) return defaultText;
        if (typeof item === 'string') return item;
        
        return (
            <Text style={[styles.tagText, { color: item.color }]}>
                {item.emoji} {item.text}
            </Text>
        );
    };

    return (
        <Pressable onPress={onPress}>
            <View style={styles.displayView}>
                <Text style={styles.displayText}>
                    {tag ? renderTagOrDescription(tag, "No Tag Selected") : "No Tag Selected"}
                    {" - "}
                    {description ? renderTagOrDescription(description, "No Description") : "No Description"}
                </Text>
            </View>
        </Pressable>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    displayView: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.backgroundColor,
    },
    displayText: {
        color: theme.colors.gray,
        textAlign: 'center',
        fontSize: 16,
        ...(theme.name === 'signalis' && {
            fontSize: 18,
            fontFamily: theme.typography.fontFamily.secondary,
            fontWeight: 'normal',
            color: theme.colors.textColorBold,
            textShadowColor: theme.colors.accentColor,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 6,
        })
    },
    tagText: {
        padding: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    descriptionText: {
        padding: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
});

export default TagDescriptionSelector;