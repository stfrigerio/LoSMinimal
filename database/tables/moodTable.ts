import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { MoodNoteData } from '../../src/types/Mood';

const moodTableStructure: TableStructure = {
	name: 'Mood',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		date: 'TEXT',
		rating: 'INTEGER',
		comment: 'TEXT',
		tag: 'TEXT',
		description: 'TEXT',
		createdAt: 'TEXT NOT NULL',
		updatedAt: 'TEXT NOT NULL',
		synced: 'INTEGER DEFAULT 0',
	},
	primaryKey: 'id',
	conflictResolutionKey: [
		'uuid'
	]
};

class MoodNoteTableManager extends BaseTableManager<MoodNoteData> {
	constructor() {
		super(moodTableStructure);
	}

	async fetchTags(): Promise<string[]> {
		const query = `SELECT DISTINCT tag FROM ${this.tableStructure.name} ORDER BY tag;`;
		const result = await databaseManager.executeSqlAsync(query);
		return result.rows._array.map((row: { tag: string }) => row.tag);
	}

	async fetchDescriptions(tag: string): Promise<string[]> {
		const query = `SELECT DISTINCT description FROM ${this.tableStructure.name} WHERE tag = ? ORDER BY description;`;
		const result = await databaseManager.executeSqlAsync(query, [tag]);
		return result.rows._array.map((row: { description: string }) => row.description);
	}
}

export const moodNoteTableManager = new MoodNoteTableManager();