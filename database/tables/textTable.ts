import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { TextNotesData } from '../../src/types/TextNotes';

const textNotesTableStructure: TableStructure = {
	name: 'Text',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		period: 'TEXT NOT NULL',
		key: 'TEXT',
		text: 'TEXT NOT NULL',
		synced: 'INTEGER DEFAULT 0',
		createdAt: 'TEXT NOT NULL',
		updatedAt: 'TEXT NOT NULL',
	},
	primaryKey: 'id',
	conflictResolutionKey: [
		'uuid'
	]
};

class TextNotesManager extends BaseTableManager<TextNotesData> {
	constructor() {
		super(textNotesTableStructure);
	}

	async getByPeriod(period: string): Promise<TextNotesData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE period = ?;`;
		const results = await databaseManager.executeSqlAsync(query, [period]);
		return results as TextNotesData[];
	}

	async getByPeriodAndKey(period: string, key: string): Promise<TextNotesData | null> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE period = ? AND key = ? LIMIT 1;`;
		const results = await databaseManager.executeSqlAsync(query, [period, key]);
		if (results.length > 0) {
			return results[0] as TextNotesData;
		} else {
			return null;
		}
	}
}

export const textNotesManager = new TextNotesManager();
