import { useState, useEffect } from 'react';

import { databaseManagers } from '@/database/tables';
import { formatDate, navigateDate, parseDate } from '@/src/utils/timezoneBullshit';

import { ExtendedObjectiveData, UseObjectivesReturn } from '@/src/features/PeriodicNote/types/ObjectivesSection';
import { ObjectiveData } from '@/src/types/Objective';
import { PillarData } from '@/src/types/Pillar';

export const useObjectives = (currentDate: string): UseObjectivesReturn => {
    const [objectives, setObjectives] = useState<ExtendedObjectiveData[]>([]);
    const [pillars, setPillars] = useState<PillarData[]>([]);

    const fetchData = async () => {
        const fetchedObjectives = await databaseManagers.objectives.getObjectives({ period: currentDate });
        const fetchedPillars = await databaseManagers.pillars.list();
        
        const extendedObjectives = fetchedObjectives.map(objective => ({
            ...objective,
            pillarEmoji: fetchedPillars.find(pillar => pillar.uuid === objective.pillarUuid)?.emoji || ''
        }));

        setObjectives(extendedObjectives);
        setPillars(fetchedPillars);
    };

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const addObjective = async (newObjective: Omit<ExtendedObjectiveData, 'uuid'>) => {
        try {
            const { pillarEmoji, ...objectiveData } = newObjective;
            const addedObjective = await databaseManagers.objectives.upsert(objectiveData);
            
            if (!addedObjective || typeof addedObjective !== 'object' || !('uuid' in addedObjective)) {
                throw new Error('Invalid or missing UUID in response');
            }

            const extendedAddedObjective: ExtendedObjectiveData = {
                ...(addedObjective as ObjectiveData),
                pillarEmoji
            };

            setObjectives(prevObjectives => [...prevObjectives, extendedAddedObjective]);
            return extendedAddedObjective;
        } catch (error) {
            console.error('Failed to add objective:', error);
            throw error;
        }
    };

    const updateObjective = async (updatedObjective: ExtendedObjectiveData) => {
        try {
            const { pillarEmoji, ...objectiveData } = updatedObjective;
            const result = await databaseManagers.objectives.upsert(objectiveData);
            
            if (!result) {
                throw new Error('Failed to update objective');
            }

            setObjectives(prevObjectives =>
                prevObjectives.map(obj =>
                    obj.uuid === updatedObjective.uuid
                        ? { ...updatedObjective }
                        : obj
                )
            );
            
            return updatedObjective;
        } catch (error) {
            console.error('Failed to update objective:', error);
            throw error;
        }
    };

    const toggleObjectiveCompletion = async (uuid: string) => {
        const objectiveToUpdate = objectives.find(obj => obj.uuid === uuid);
        if (objectiveToUpdate) {
            // Cycle through states: 0 (incomplete) -> 1 (completed) -> 2 (failed) -> 0 (incomplete)
            const nextStatus = (objectiveToUpdate.completed + 1) % 3;
            
            const updatedObjective: ExtendedObjectiveData = {
                ...objectiveToUpdate,
                completed: nextStatus as 0 | 1 | 2,
                updatedAt: new Date().toISOString()
            };
    
            // Remove pillarEmoji before upsert
            const { pillarEmoji, ...objectiveDataToUpsert } = updatedObjective;
    
            await databaseManagers.objectives.upsert(objectiveDataToUpsert);
    
            setObjectives(prevObjectives =>
                prevObjectives.map(obj =>
                    obj.uuid === uuid ? { ...updatedObjective, pillarEmoji } : obj
                )
            );
        }
    };

    const deleteObjective = async (uuid: string) => {
        await databaseManagers.objectives.removeByUuid(uuid);
        setObjectives(prevObjectives => prevObjectives.filter(obj => obj.uuid !== uuid));
    };

    const getNextPeriod = (currentPeriod: string): string => {
        // Handle week format (e.g., 2024-W42)
        if (currentPeriod.includes('-W')) {
            const [year, week] = currentPeriod.split('-W').map(Number);
            if (week === 52) {
                return `${year + 1}-W01`;
            }
            return `${year}-W${String(week + 1).padStart(2, '0')}`;
        }
    
        // Handle quarter format (e.g., 2024-Q2)
        if (currentPeriod.includes('-Q')) {
            const [year, quarter] = currentPeriod.split('-Q').map(Number);
            if (quarter === 4) {
                return `${year + 1}-Q1`;
            }
            return `${year}-Q${quarter + 1}`;
        }
    
        // Handle month format (e.g., 2024-01)
        if (currentPeriod.match(/^\d{4}-\d{2}$/)) {
            const date = parseDate(currentPeriod + '-01');
            const nextMonth = navigateDate(date, 31); // Safely navigate to next month
            return formatDate(nextMonth, 'yyyy-MM');
        }
    
        // Handle year format (e.g., 2024)
        if (currentPeriod.match(/^\d{4}$/)) {
            return String(Number(currentPeriod) + 1);
        }
    
        throw new Error(`Invalid period format: ${currentPeriod}`);
    };
    
    const postponeObjective = async (uuid: string) => {
        const objectiveToPostpone = objectives.find(obj => obj.uuid === uuid);
        if (objectiveToPostpone) {
            const updatedObjective: ExtendedObjectiveData = {
                ...objectiveToPostpone,
                period: getNextPeriod(objectiveToPostpone.period),
                updatedAt: new Date().toISOString()
            };
    
            const { pillarEmoji, ...objectiveDataToUpsert } = updatedObjective;
            await databaseManagers.objectives.upsert(objectiveDataToUpsert);
    
            // Remove the objective from the current list since it's been moved to a different period
            setObjectives(prevObjectives =>
                prevObjectives.filter(obj => obj.uuid !== uuid)
            );
        }
    };

    return { 
        objectives, 
        pillars, 
        addObjective, 
        updateObjective,
        toggleObjectiveCompletion, 
        deleteObjective, 
        refreshObjectives: fetchData,
        postponeObjective
    };
};