import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';
import { UserSettingData } from '../../src/types/UserSettings';

const userSettingsTableStructure: TableStructure = {
	name: 'UserSettings',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		settingKey: 'TEXT NOT NULL',
		value: 'TEXT NOT NULL',
		type: 'TEXT NOT NULL',
		color: 'TEXT',
		createdAt: 'TEXT NOT NULL',
		updatedAt: 'TEXT NOT NULL',
	},
	primaryKey: 'id',
	conflictResolutionKey: [
		'uuid'
	]
};

class UserSettingsTableManager extends BaseTableManager<UserSettingData> {
	constructor() {
		super(userSettingsTableStructure);
	}

	async getByKey(settingKey: string): Promise<UserSettingData | null> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE settingKey = ? LIMIT 1;`;
		const result = await databaseManager.executeSqlAsync(query, [settingKey]);

		if (result.length > 0) {
			return result[0] as UserSettingData;
		} else {
			return null;
		}
	}

	async getByType(type: string): Promise<UserSettingData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE type = ?;`;
		const result = await databaseManager.executeSqlAsync(query, [type]);
		return result as UserSettingData[];
	}
}

export const userSettingsTableManager = new UserSettingsTableManager();