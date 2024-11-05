import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { QuantifiableHabitsData } from '../../src/types/QuantifiableHabits';

const quantifiableHabitsTableStructure: TableStructure = {
	name: 'QuantifiableHabits',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		date: 'TEXT NOT NULL',
		habitKey: 'TEXT NOT NULL',
		value: 'INTEGER NOT NULL',
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

class QuantifiableHabitsManager extends BaseTableManager<QuantifiableHabitsData> {
	constructor() {
		super(quantifiableHabitsTableStructure);
	}

    async getHabitByDateAndKey(date: string, habitKey: string): Promise<QuantifiableHabitsData | null> {
        try {
            const results = await databaseManager.executeSqlAsync<QuantifiableHabitsData>(
                `SELECT * FROM ${this.tableStructure.name} 
                 WHERE date = ? AND habitKey = ? 
                 LIMIT 1;`,
                [date, habitKey]
            );

            if (results.length > 0) {
                return results[0];
            }
            return null;
        } catch (error) {
            console.error('Error fetching habit by date and key:', error);
            throw error;
        }
    }

    async listOrderedByDate(): Promise<QuantifiableHabitsData[]> {
        try {
            const results = await databaseManager.executeSqlAsync<QuantifiableHabitsData>(
                `SELECT * FROM ${this.tableStructure.name} 
                 ORDER BY date(date) DESC, datetime(createdAt) DESC;`
            );

            return results;
        } catch (error) {
            console.error('Error listing habits ordered by date:', error);
            throw error;
        }
    }
}

export const quantifiableHabitsManager = new QuantifiableHabitsManager();