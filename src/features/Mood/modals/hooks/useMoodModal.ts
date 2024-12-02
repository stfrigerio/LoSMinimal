import { databaseManagers } from '@/database/tables';
import { MoodNoteData } from '@/src/types/Mood';

export const useMoodNoteModal = (closeMoodModal: () => void) => {
    const handleSave = async (moodNote: MoodNoteData) => {
        try {
            await databaseManagers.mood.upsert(moodNote);
        } catch (error: any) {
            console.log(`Failed to save mood note: ${error.message}`);
            throw error;
        }
    };

    return {
        handleSave,
    };
};