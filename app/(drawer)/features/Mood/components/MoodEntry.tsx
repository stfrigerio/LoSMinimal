import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Color from 'color';

import AlertModal from '@/app/components/modals/AlertModal';
import MoodModal from '@/app/(drawer)/features/Mood/modals/MoodModal';
import Collapsible from '@/app/components/Collapsible';

import { useThemeStyles } from '@/src/styles/useThemeStyles';
import { MoodNoteData } from '@/src/types/Mood';
import { useColors } from '@/src/utils/useColors';
import EditButton from '@/app/components/atoms/EditButton';
import DeleteButton from '@/app/components/atoms/DeleteButton';

interface MoodEntryProps {
    item: MoodNoteData;
    isExpanded: boolean;
    toggleExpand: (id: number) => void;
    deleteMood: (id: number) => void;
    refreshMoods: () => void;
}

const MoodEntry: React.FC<MoodEntryProps> = ({ item, isExpanded, toggleExpand, deleteMood, refreshMoods }) => {
    const { themeColors, designs } = useThemeStyles();
    const { colors: tagColors, loading, error } = useColors();
    const styles = React.useMemo(() => getStyles(themeColors, designs), [themeColors, designs]);
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
                    const tagColor = tagColors[tag] || themeColors.backgroundColor;
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

const getStyles = (themeColors: any, designs: any) => {
    return StyleSheet.create({
        entryContainer: {
            flexDirection: 'row',
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.borderColor,
            paddingBottom: 15,
            paddingHorizontal: 10,
        },
        ratingContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 20,
            padding: 10,
            borderRadius: 12,
            minWidth: 60,
        },
        rating: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeColors.accentColor,
            marginBottom: 4,
        },
        dateText: {
            fontSize: 11,
            color: themeColors.opaqueTextColor,
            marginBottom: 2,
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
            fontSize: 15,
            color: themeColors.textColor,
            lineHeight: 20,
            marginTop: 6,
        },
        actionIcons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            justifyContent: 'flex-end',
            marginTop: 15,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: `${themeColors.borderColor}50` || '#F0F0F0',
        },
        actionIcon: {
            padding: 8,
            borderRadius: 8,
            backgroundColor: `${themeColors.backgroundColor}80`,
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
        },
    });
};

export default React.memo(MoodEntry);