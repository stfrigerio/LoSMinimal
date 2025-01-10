import { databaseManagers } from '@/database/tables';
import { LibraryData } from '@/src/types/Library';

export const handleMarkAsFinished = async (item: LibraryData, updateItem: (item: LibraryData) => Promise<void>) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const updatedItem = { 
        ...item, 
        finished: 1, 
        seen: today 
    };
    await databaseManagers.library.upsert(updatedItem);
    updateItem(updatedItem);
};