import { useState } from 'react';

export const useTransactionSelection = () => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedUuids, setSelectedUuids] = useState<Set<string>>(new Set());
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    const toggleSelect = (uuid: string) => {
        const newSelectedUuids = new Set(selectedUuids);
        if (newSelectedUuids.has(uuid)) {
            newSelectedUuids.delete(uuid);
        } else {
            newSelectedUuids.add(uuid);
        }
        setSelectedUuids(newSelectedUuids);
        setIsSelectionMode(newSelectedUuids.size > 0);
    };

    const clearSelection = () => {
        setSelectedUuids(new Set());
        setIsSelectionMode(false);
    };

    return {
        isSelectionMode,
        selectedUuids,
        isBatchModalOpen,
        setIsBatchModalOpen,
        toggleSelect,
        clearSelection
    };
};