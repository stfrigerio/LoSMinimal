import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { TagData } from '../../src/types/TagsAndDescriptions';

const tagsTableStructure: TableStructure = {
	name: 'Tags',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		text: 'TEXT NOT NULL',
		type: 'TEXT', // moneyTag, moneyDescription, timeTag, timeDescription, moodTag
		category: 'TEXT', //(income, expense) : money
		emoji: 'TEXT',
		linkedTag: 'TEXT',
		color: 'TEXT',
		createdAt: 'TEXT',
		updatedAt: 'TEXT',
	},
	primaryKey: 'id',
	conflictResolutionKey: [
		'uuid'
	]
};

class TagsTableManager extends BaseTableManager<TagData> {
	constructor() {
		super(tagsTableStructure);
	}

	async getTagsByType(type: string): Promise<TagData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE type = ?;`;
		const result = await databaseManager.executeSqlAsync(query, [type]);
		return result as TagData[];
	}

	async getDescriptionsByTag(tag: string): Promise<TagData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE linkedTag = ?;`;
		const result = await databaseManager.executeSqlAsync(query, [tag]);
		return result as TagData[];
	}
}

export const tagsTableManager = new TagsTableManager();