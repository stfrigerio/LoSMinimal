import * as SQLite from 'expo-sqlite';
import { capitalizedTableNames } from '@/src/constants/tableNames';

export async function validateDBInSQLiteFolder(tempDBName: string) {
	// On iOS, you must pass just the filename (not a full path)
	const db = await SQLite.openDatabaseAsync(tempDBName);

	try {
		// List out all tables (for debug)
		const tablesResult = await db.execAsync(
			"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
		);

		// Check each required table
		for (const tableName of capitalizedTableNames) {
			const row = await db.getFirstAsync<{ count: number }>(
				`SELECT COUNT(*) as count
					FROM sqlite_master
					WHERE type='table' AND name=?;`,
				[tableName]
			);
			if (!row || row.count === 0) {
				throw new Error(`Missing table: ${tableName}`);
			}
		}
	} finally {
		await db.closeAsync();
	}
}
