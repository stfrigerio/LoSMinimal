import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Color from 'color';

import AlertModal from '@/src/components/modals/AlertModal';
import MoodModal from '@/src/features/Mood/modals/MoodModal';
import Collapsible from '@/src/components/Collapsible';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { MoodNoteData } from '@/src/types/Mood';
import { useColors } from '@/src/utils/useColors';
import EditButton from '@/src/components/atoms/EditButton';
import DeleteButton from '@/src/components/atoms/DeleteButton';

interface MoodEntryProps {
    item: MoodNoteData;
    isExpanded: boolean;
    toggleExpand: (id: number) => void;
    deleteMood: (id: number) => void;
    refreshMoods: () => void;
}

const MoodEntry: React.FC<MoodEntryProps> = ({ item, isExpanded, toggleExpand, deleteMood, refreshMoods }) => {
    const { theme, designs } = useThemeStyles();
    const { colors: tagColors, loading, error } = useColors();
    const styles = React.useMemo(() => getStyles(theme, designs), [theme, designs]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const handleEditPress = () => {
        setIsEditModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsEditModalVisible(false);
    };

    const getContrastColor = (bgColor: string) => {
        const color = Color(bgColor);
        return color.isLight() ? '#000000' : '#FFFFFF';
    };

    const handleDeletePress = () => {
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        deleteMood(item.id!);
        setIsDeleteModalVisible(false);
    };

    const renderTags = () => {
        if (!item.tag) return null;
        const tags = item.tag.split(',');

        return (
            <View style={styles.tagContainer}>
                {tags.map((tag, index) => {
                    const tagColor = tagColors[tag] || theme.colors.backgroundColor;
                    return (
                        <View 
                            key={`${tag}-${index}`} 
                            style={[styles.tag, { backgroundColor: `${tagColor}99` }]}
                        >
                            <Text 
                                style={[styles.tagText, { color: getContrastColor(tagColor) }]}
                            >
                                {tag}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.entryContainer}>
            <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{item.rating}</Text>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</Text>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View style={styles.entryContent}>
            <Pressable onPress={() => toggleExpand(item.id!)}>
                    <View style={styles.entryHeader}>
                        {renderTags()}
                        <View style={styles.actionIcon}>
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                size={16} 
                                color="gray" 
                                style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                            />
                        </View>
                    </View>
                </Pressable>
                <Collapsible collapsed={!isExpanded}>
                    <Text style={styles.comment}>{item.comment}</Text>
                    <View style={styles.actionIcons}>
                        <EditButton onEdit={handleEditPress} />
                        <DeleteButton onDelete={handleDeletePress} />
                    </View>
                </Collapsible>
            </View>
            {isEditModalVisible && (
                <MoodModal
                    isOpen={isEditModalVisible}
                    closeMoodModal={handleCloseModal}
                    initialMoodNote={item}
                    tagColors={tagColors}
                    refreshMoods={refreshMoods}
                    isEdit={true}
                />
            )}
            {isDeleteModalVisible && (
                <AlertModal
                    isVisible={isDeleteModalVisible}
                    title="Delete Mood"
                    message="Are you sure you want to delete this mood entry?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsDeleteModalVisible(false)}
                />
            )}
        </View>
    );
};

const getStyles = (theme: Theme, designs: any) => {
    return StyleSheet.create({
        entryContainer: {
            flexDirection: 'row',
            marginVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderColor,
            paddingBottom: 15,
        },
        ratingContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 20,
            padding: 10,
            borderRadius: theme.borderRadius.lg,
            minWidth: 60,
        },
        rating: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.accentColor,
            marginBottom: 4,
            ...(theme.name === 'signalis' && {
                fontSize: 20,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: 'normal',
                color: theme.colors.textColorBold,
                textShadowColor: theme.colors.accentColor,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 6,
            }),
        },
        dateText: {
            fontSize: 11,
            color: theme.colors.opaqueTextColor,
            marginBottom: 2,
            ...(theme.name === 'signalis' && {
                fontSize: 12,
                fontFamily: theme.typography.fontFamily.secondary,
                color: theme.colors.textColor,
                textShadowColor: theme.colors.accentColor,
                textShadowOffset: { width: 0.5, height: 0.5 },
                textShadowRadius: 3,
            }),
        },
        entryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        entryContent: {
            flex: 1,
            justifyContent: 'center',
        },
        comment: {
            ...designs.text.text,
            fontSize: 15,
            color: theme.colors.textColor,
            marginRight: 10,
            lineHeight: 20,
            marginTop: 6,
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.secondary,
                fontSize: 16,
            })
        },
        actionIcons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            justifyContent: 'flex-end',
            marginTop: 15,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: `${theme.colors.borderColor}50` || '#F0F0F0',
        },
        actionIcon: {
            padding: 8,
            borderRadius: 8,
            backgroundColor: `${theme.colors.backgroundColor}80`,
        },
        tagContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
            gap: 6,
        },
        tag: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 16,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        tagText: {
            fontSize: 12,
            fontWeight: '600',
            ...(theme.name === 'signalis' && {
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: 'normal',
                // textShadowColor: theme.colors.accentColor,
                // textShadowOffset: { width: 1, height: 1 },
                // textShadowRadius: 4,
            }),
        },
    });
};

export default React.memo(MoodEntry);