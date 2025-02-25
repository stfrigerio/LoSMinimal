import { BaseTableManager, TableStructure } from '../baseTable';
import { databaseManager } from '../databaseManager';

import { MoneyData } from '../../src/types/Money';

const moneyTableStructure: TableStructure = {
	name: 'Money',
	columns: {
		id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
		uuid: 'TEXT NOT NULL UNIQUE',
		date: 'TEXT',
		amount: 'REAL',
		type: 'TEXT', // income, expense, recursive...
		account: 'TEXT', 
		tag: 'TEXT',
		description: 'TEXT',
		due: 'TEXT',
		synced: 'INTEGER DEFAULT 0',
		createdAt: 'TEXT NOT NULL',
		updatedAt: 'TEXT NOT NULL',
	},
	primaryKey: 'id',
	conflictResolutionKey: [
		'uuid'
	]
};

class MoneyTableManager extends BaseTableManager<MoneyData> {
	constructor() {
		super(moneyTableStructure);
	}

	async getMoney(filter: { date?: string, type?: string, tag?: string, dateRange?: string[] }): Promise<MoneyData[]> {
		let query = `SELECT * FROM ${this.tableStructure.name}`;
		const queryParams = [];
		const conditions = [];

		if (filter.date) {
			conditions.push('date = ?');
			queryParams.push(filter.date);
		}
		if (filter.type) {
			conditions.push('type = ?');
			queryParams.push(filter.type);
		}
		if (filter.tag) {
			conditions.push('tag = ?');
			queryParams.push(filter.tag);
		}
		if (filter.dateRange) {
			conditions.push(`date IN (${filter.dateRange.map(() => '?').join(', ')})`);
			queryParams.push(...filter.dateRange);
		}

		if (conditions.length > 0) {
			query += ' WHERE ' + conditions.join(' AND ');
		}

		query += ' ORDER BY date DESC';

		const result = await databaseManager.executeSqlAsync(query, queryParams);
		return result as MoneyData[];
	}

    async fetchTags(): Promise<string[]> {
        const query = `SELECT DISTINCT tag FROM ${this.tableStructure.name} ORDER BY tag;`;
        const result = await databaseManager.executeSqlAsync<{ tag: string }>(query);
        return (result as { tag: string }[]).map(row => row.tag);
    }

    async fetchDescriptions(tag: string): Promise<string[]> {
        const query = `SELECT DISTINCT description FROM ${this.tableStructure.name} WHERE tag = ? ORDER BY description;`;
        const result = await databaseManager.executeSqlAsync<{ description: string }>(query, [tag]);
        return (result as { description: string }[]).map(row => row.description);
    }

    async listAccounts(): Promise<{ account: string }[]> {
        const query = `SELECT DISTINCT account FROM ${this.tableStructure.name} WHERE account IS NOT NULL AND account != '' ORDER BY account;`;
        const result = await databaseManager.executeSqlAsync<{ account: string }>(query);
        return result;
    }

	async getRepeatingTransactions(): Promise<MoneyData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE due IS NOT NULL AND due != '' ORDER BY date DESC;`;
		const result = await databaseManager.executeSqlAsync<MoneyData>(query);
		return result;
	}

	async getRepeatedTransactionsByDescriptionAndAmount(description: string, amount: number): Promise<MoneyData[]> {
		const query = `SELECT * FROM ${this.tableStructure.name} WHERE description = ? AND amount = ? ORDER BY date DESC;`;
		const result = await databaseManager.executeSqlAsync<MoneyData>(query, [description, amount]);
		return result;
	}
}

export const moneyTableManager = new MoneyTableManager();