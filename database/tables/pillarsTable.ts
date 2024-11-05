import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { PillarData } from '../../src/types/Pillar';

const pillarsTableStructure: TableStructure = {
	name: 'Pillars',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		name: 'TEXT NOT NULL UNIQUE',
		description: 'TEXT',
		emoji: 'TEXT',
		synced: 'INTEGER DEFAULT 0',
		createdAt: 'TEXT NOT NULL',
		updatedAt: 'TEXT NOT NULL',
	},
	primaryKey: 'id',
	conflictResolutionKey: [
		'uuid'
	]
};

class PillarsTableManager extends BaseTableManager<PillarData> {
	constructor() {
		super(pillarsTableStructure);
	}

	async getPillars(): Promise<PillarData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} ORDER BY name;`;
		const result = await databaseManager.executeSqlAsync(query);
		return result as PillarData[];
	}

	async getPillarByName(name: string): Promise<PillarData | null> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE name = ?;`;
		const result = await databaseManager.executeSqlAsync(query, [name]);
		return result.length > 0 ? result[0] as PillarData : null;
	}

	async getPillarById(id: number): Promise<PillarData | null> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE id = ?;`;
		const result = await databaseManager.executeSqlAsync(query, [id]);
		return result.length > 0 ? result[0] as PillarData : null;
	}
}

export const pillarsTableManager = new PillarsTableManager();