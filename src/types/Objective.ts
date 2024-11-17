export type ObjectiveStatus = 0 | 1 | 2; // 0: incomplete, 1: completed, 2: failed

export interface ObjectiveData {
    id?: number;
    uuid?: string;
    period: string;
    objective: string;
    pillarUuid?: string;
    completed: ObjectiveStatus;
    note?: string;
    synced?: number;
    createdAt: string;
    updatedAt: string;
}