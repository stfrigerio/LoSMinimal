import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import AlertModal from '@/src/components/modals/AlertModal';
import { AddObjectivesModal } from '@/src/features/PeriodicNote/modals/ObjectivesModal';
import ImageSlideShow from '../ImageSlideShow';
import { PrimaryButton } from '@/src/components/atoms/PrimaryButton';
import { ObjectiveCard } from '../atoms/ObjectiveCard';

import { useThemeStyles, Theme } from '@/src/styles/useThemeStyles';
import { useObjectives } from '@/src/features/PeriodicNote/hooks/useObjectives';
import { getDateRangeForPeriod } from '@/src/utils/timezoneBullshit';

import { ExtendedObjectiveData } from '../../types/ObjectivesSection';
import { GlitchText } from '@/src/styles/GlitchText';

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
                <View style={styles.titleContainer}>
                    <GlitchText
                        glitch={theme.name === 'signalis'}
                        style={styles.title}
                >
                        {getTitle()}
                    </GlitchText>
                </View>
                {objectives.map((objective: ExtendedObjectiveData) => (
                    <ObjectiveCard
                        key={objective.uuid}
                        objective={objective}
                        theme={theme}
                        onEdit={handleEditObjective}
                        onToggleCompletion={toggleObjectiveCompletion}
                        onPostpone={postponeObjective}
                        onDelete={handleDelete}
                    />
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: theme.name === 'signalis' ? 'normal' : 'bold',
        color: theme.colors.textColorBold,
        fontFamily: theme.typography.fontFamily.primary,
        ...(theme.name === 'signalis' && {
            textShadowColor: theme.colors.accentColor,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 6,
        }),
    },
});