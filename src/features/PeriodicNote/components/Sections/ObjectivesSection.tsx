import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faCircle, faRotateRight, faTrash, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

import AlertModal from '@/src/components/modals/AlertModal';
import { AddObjectivesModal } from '@/src/features/PeriodicNote/modals/ObjectivesModal';
import ImageSlideShow from '../ImageSlideShow';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';import { useObjectives } from '@/src/features/PeriodicNote/hooks/useObjectives';
import { getDateRangeForPeriod, formatDate } from '@/src/utils/timezoneBullshit';

import { ExtendedObjectiveData } from '../../types/ObjectivesSection';

interface ObjectivesSectionProps {       
    currentDate: string;
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean) => void;
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({ currentDate, isModalVisible, setIsModalVisible }) => {
    const { 
        objectives, 
        addObjective, 
        toggleObjectiveCompletion, 
        pillars, 
        deleteObjective, 
        refreshObjectives,
        updateObjective,
        postponeObjective
    } = useObjectives(currentDate);

    const { startDate, endDate } = getDateRangeForPeriod(currentDate);

    const { theme } = useThemeStyles();
    const styles = getStyles(theme);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ExtendedObjectiveData | null>(null);
    const [selectedObjective, setSelectedObjective] = useState<ExtendedObjectiveData | null>(null);

    const closeModal = () => setIsModalVisible(false);

    const handleAddObjective = async (newObjective: Omit<ExtendedObjectiveData, "uuid">) => {
        await addObjective(newObjective);
        closeModal();
    };
    
    const handleUpdateObjective = async (updatedObjective: ExtendedObjectiveData) => {
        await updateObjective(updatedObjective);
        setIsModalVisible(false);
        setSelectedObjective(null);
        refreshObjectives();
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteObjective(itemToDelete.uuid!);
            setDeleteModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
    };

    const handleDelete = (objective: ExtendedObjectiveData) => {
        setItemToDelete(objective);
        setDeleteModalVisible(true);
    };

    const handleEditObjective = (objective: ExtendedObjectiveData) => {
        setSelectedObjective(objective);
        setIsModalVisible(true);
    };

    const getTitle = () => {
        const dateRegex = /^(\d{4})(?:-(?:(\d{2})|W(\d{1,2})|Q(\d)))?$/;
        const match = currentDate.match(dateRegex);
    
        if (match) {
            const [, year, month, week, quarter] = match;
            if (week) return '🎯 Weekly Objectives';
            if (month) return '🎯 Monthly Objectives';
            if (quarter) return '🎯 Quarterly Objectives';
            if (year) return '🎯 Yearly Objectives';
        }
    
        return 'Objectives';
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>{getTitle()}</Text>
                {objectives.map((objective: ExtendedObjectiveData) => (
                    <Pressable
                        key={objective.uuid}
                        onPress={() => handleEditObjective(objective)}
                    >
                        <View key={objective.uuid} style={styles.objectiveItem}>
                            <Text style={styles.pillarEmoji}>{objective.pillarEmoji}</Text>

                            <Text style={[
                                styles.objectiveText,
                                objective.completed === 1 && styles.completedObjectiveText,
                                objective.completed === 2 && styles.failedObjectiveText
                            ]}>
                                {objective.objective}
                            </Text>

                            <View style={styles.actions}>
                                <Pressable 
                                    onPress={() => toggleObjectiveCompletion(objective.uuid!)} 
                                    style={styles.completionToggle}
                                >
                                    <FontAwesomeIcon 
                                        icon={
                                            objective.completed === 0 ? faCircle :
                                            objective.completed === 1 ? faCheckCircle :
                                            faXmarkCircle
                                        } 
                                        color={
                                            objective.completed === 0 ? theme.colors.gray :
                                            objective.completed === 1 ? theme.colors.accentColor :
                                            theme.colors.redOpacity
                                        } 
                                        size={20} 
                                    /> 
                                </Pressable>
                                <Pressable 
                                    onPress={() => postponeObjective(objective.uuid!)} 
                                    style={styles.actionButton}
                                >
                                    {({ pressed }) => (
                                        <FontAwesomeIcon icon={faRotateRight} color={pressed ? theme.colors.accentColor : theme.colors.gray} size={20} />
                                    )}
                                </Pressable>
                                <Pressable 
                                    onPress={() => handleDelete(objective)} 
                                    style={styles.actionButton}
                                >
                                    {({ pressed }) => (
                                        <FontAwesomeIcon icon={faTrash} color={pressed ? theme.colors.accentColor : theme.colors.gray} size={20} />
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                ))}
                <View style={{ height: 20 }} />
                <PrimaryButton
                    onPress={() => setIsModalVisible(true)}
                    text="Add Objective"
                />  
            </View>
            <ImageSlideShow startDate={startDate.toString()} endDate={endDate.toString()} />
            {deleteModalVisible && (
                <AlertModal
                    isVisible={deleteModalVisible}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this item?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            {isModalVisible && (
                <AddObjectivesModal
                    isVisible={isModalVisible}
                    pillars={pillars}
                    onClose={() => {
                        setIsModalVisible(false);
                        setSelectedObjective(null);
                    }}
                    onAdd={selectedObjective ? handleUpdateObjective : handleAddObjective}
                    objective={selectedObjective!}
                    currentDate={currentDate}
                />
            )}
        </>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        // paddingTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: theme.name === 'signalis' ? 'normal' : 'bold',
        marginBottom: 16,
        color: theme.colors.textColorBold,
        alignSelf: 'center',
        fontFamily: theme.typography.fontFamily.primary,
        ...(theme.name === 'signalis' && {
            textShadowColor: theme.colors.accentColor,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 6,
        }),
    },
    objectiveItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        padding: 12,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 8,
    },
    pillarEmoji: {
        fontSize: 18,
        marginRight: 16,
    },
    objectiveText: {
        flex: 1,
        fontSize: 12,
        color: theme.colors.textColor,
    },
    completedObjectiveText: {
        color: theme.colors.greenOpacity,
    },
    failedObjectiveText: {
        color: theme.colors.redOpacity,
        textDecorationLine: 'line-through',
    },
    completionToggle: {
        width: '10%',
        alignItems: 'center',
        marginRight: '8%',
        marginLeft: '2%',
        padding: 5,
        zIndex: 100,
    },
    completionStatus: {
        fontSize: 18,
    },
    actions: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // gap: 0
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
    },
    fakeIcon: {
        width: 20,
        height: 20,
    }
});