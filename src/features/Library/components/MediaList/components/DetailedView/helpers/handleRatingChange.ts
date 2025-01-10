import { databaseManagers } from "@/database/tables";
import { LibraryData } from "@/src/types/Library";

export const handleRatingChange = async (
    newRating: number, 
    item: LibraryData, 
    updateItem: (item: LibraryData) => Promise<void>,
    setCurrentRating: (rating: number) => void
) => {
    setCurrentRating(newRating);
    const updatedItem = { ...item, rating: newRating };
    await databaseManagers.library.upsert(updatedItem);
    updateItem(updatedItem);
};