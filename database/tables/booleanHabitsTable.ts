import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { BooleanHabitsData } from '../../src/types/BooleanHabits';

const booleanHabitsTableStructure: TableStructure = {
    name: 'BooleanHabits',
    columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        uuid: 'TEXT NOT NULL UNIQUE',
        date: 'TEXT NOT NULL',
        habitKey: 'TEXT NOT NULL',
        value: 'INTEGER NOT NULL', // Changed from BOOLEAN to INTEGER
        createdAt: 'TEXT NOT NULL',
        updatedAt: 'TEXT NOT NULL',
    },
    primaryKey: 'id',
    foreignKeys: [
        'FOREIGN KEY(date) REFERENCES DailyNotes(date) ON DELETE CASCADE'
    ],
    conflictResolutionKey: [
        'uuid'
    ]
};

class BooleanHabitsManager extends BaseTableManager<BooleanHabitsData> {
    constructor() {
        super(booleanHabitsTableStructure);
    }

    async getHabitByDateAndKey(date: string, habitKey: string): Promise<BooleanHabitsData | null> {
        try {
            const results = await databaseManager.executeSqlAsync<BooleanHabitsData>(
                `SELECT * FROM ${this.tableStructure.name} 
                 WHERE date = ? AND habitKey = ? 
                 LIMIT 1;`,
                [date, habitKey]
            );

            if (results.length > 0) {
                return results[0]; // No need to convert, keeping as number
            }
            return null;
        } catch (error) {
            console.error('Error fetching habit by date and key:', error);
            throw error;
        }
    }

    async listOrderedByDate(): Promise<BooleanHabitsData[]> {
        try {
            const results = await databaseManager.executeSqlAsync<BooleanHabitsData>(
                `SELECT * FROM ${this.tableStructure.name} 
                 ORDER BY date(date) DESC, datetime(createdAt) DESC;`
            );

            return results; // No need to convert, keeping as number
        } catch (error) {
            console.error('Error listing habits ordered by date:', error);
            throw error;
        }
    }

    /**
     * Creates or updates a boolean habit entry
     */
    async upsertHabit(data: Partial<BooleanHabitsData>): Promise<BooleanHabitsData> {
        try {
            // Convert boolean to number if value is boolean
            const processedData = {
                ...data,
                value: typeof data.value === 'boolean' ? Number(data.value) : data.value
            };
            
            return await super.upsert(processedData as BooleanHabitsData);
        } catch (error) {
            console.error('Error upserting boolean habit:', error);
            throw error;
        }
    }

    /**
     * Gets all habits for a specific date
     */
    async getHabitsByDate(date: string): Promise<BooleanHabitsData[]> {
        try {
            return await databaseManager.executeSqlAsync<BooleanHabitsData>(
                `SELECT * FROM ${this.tableStructure.name} 
                 WHERE date = ? 
                 ORDER BY datetime(createdAt) DESC;`,
                [date]
            );
        } catch (error) {
            console.error('Error fetching habits by date:', error);
            throw error;
        }
    }

    /**
     * Helper method to convert database number to boolean
     */
    static toBoolean(value: number): boolean {
        return Boolean(value);
    }

    /**
     * Helper method to convert boolean to database number
     */
    static toNumber(value: boolean): number {
        return Number(value);
    }
}

export const booleanHabitsManager = new BooleanHabitsManager();