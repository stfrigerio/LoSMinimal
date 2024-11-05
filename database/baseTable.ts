import { databaseManager } from './databaseManager';

export interface TableStructure {
    name: string;
    columns: {
        [key: string]: string;
    };
    primaryKey: string;
    foreignKeys?: string[];
    uniqueConstraints?: string[];
    conflictResolutionKey?: string | string[];
}

export interface BaseEntry {
    uuid?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class BaseTableManager<T> {
    protected tableStructure: TableStructure;

    constructor(tableStructure: TableStructure) {
        this.tableStructure = tableStructure;
    }

    async initialize(): Promise<void> {
        await this.createTable();
    }

    async getByUniqueConstraint(constraintKey: string, value: any): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableStructure.name} WHERE ${constraintKey} = ? LIMIT 1;`;
        try {
            const result = await databaseManager.executeSqlAsync<T>(query, [value]);
            return result[0] || null;
        } catch (error) {
            console.error(`Error fetching by unique constraint (${constraintKey} = ${value}):`, error);
            return null;
        }
    }

    async upsert<T extends BaseEntry>(data: T, isSync = false): Promise<T> {
        try {
            const now = new Date().toISOString();
            
            // Ensure uuid is assigned
            if (!data.uuid) {
                data.uuid = databaseManager.generateUuid();
            }
            
            // Handling timestamps
            if (!data.createdAt) {
                data.createdAt = now;
            }
            if (!isSync) {
                data.updatedAt = now;
            }

            // Special handling for UserSettings table
            if (this.tableStructure.name === 'UserSettings' && 'settingKey' in data) {
                const existingRecord = await this.getByUniqueConstraint('settingKey', data.settingKey);
                if (existingRecord) {
                    const updateColumns = Object.keys(data)
                        .filter(col => col !== 'uuid' && col !== 'createdAt')
                        .map(col => `${col} = ?`)
                        .join(', ');
                    const updateValues = Object.keys(data)
                        .filter(col => col !== 'uuid' && col !== 'createdAt')
                        .map(col => data[col as keyof T]);
                    
                    await databaseManager.withTransactionAsync(async () => {
                        await databaseManager.executeSqlAsync(
                            `UPDATE ${this.tableStructure.name} SET ${updateColumns} WHERE settingKey = ?;`,
                            [...updateValues, data.settingKey]
                        );
                    });

                    const updatedRecord = await this.getByUniqueConstraint('settingKey', data.settingKey);
                    if (updatedRecord) {
                        return updatedRecord as T;
                    }
                    throw new Error(`Failed to retrieve updated record for ${this.tableStructure.name}`);
                }
            }

            const columns = Object.keys(data);
            const placeholders = columns.map(() => '?').join(', ');
            const values = Object.values(data);
            const conflictKeys = ['uuid'];
            const updateClauses = columns
                .filter(col => !['uuid', 'createdAt'].includes(col))
                .map(col => `${col} = EXCLUDED.${col}`)
                .join(', ');

            const query = `
                INSERT INTO ${this.tableStructure.name} (${columns.join(', ')})
                VALUES (${placeholders})
                ON CONFLICT(${conflictKeys.join(', ')})
                DO UPDATE SET
                    ${updateClauses},
                    updatedAt = EXCLUDED.updatedAt;
            `;

            await databaseManager.withTransactionAsync(async () => {
                await databaseManager.executeSqlAsync(query, values);
            });

            const upsertedRow = await databaseManager.executeSqlAsync<T>(
                `SELECT * FROM ${this.tableStructure.name} WHERE uuid = ? LIMIT 1;`,
                [data.uuid]
            );

            if (upsertedRow[0]) {
                return upsertedRow[0];
            }
            throw new Error(`Failed to upsert ${this.tableStructure.name}`);
        } catch (error) {
            console.error('Error in upsert:', error);
            console.error('Data causing error:', JSON.stringify(data, null, 2));
            throw error;
        }
    }

    async list(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableStructure.name};`;
        return await databaseManager.executeSqlAsync<T>(query);
    }

    protected async logDeletion(tableName: string, recordUuid: string): Promise<void> {
        await databaseManager.executeSqlAsync(
            `INSERT INTO DeletionLog (tableName, recordUuid, deletedAt, synced) VALUES (?, ?, ?, ?);`,
            [tableName, recordUuid, new Date().toISOString(), 0]
        );
    }

    async remove(id: any): Promise<void> {
        console.log(`Removing ${this.tableStructure.name} with id ${id}`);

        const uuidResult = await databaseManager.executeSqlAsync<{ uuid: string }>(
            `SELECT uuid FROM ${this.tableStructure.name} WHERE ${this.tableStructure.primaryKey} = ?;`,
            [id]
        );

        if (uuidResult.length > 0) {
            const uuid = uuidResult[0].uuid;

            await databaseManager.withTransactionAsync(async () => {
                if (this.tableStructure.name === 'DailyNotes') {
                    const dateResult = await databaseManager.executeSqlAsync<{ date: string }>(
                        `SELECT date FROM ${this.tableStructure.name} WHERE ${this.tableStructure.primaryKey} = ?;`,
                        [id]
                    );

                    if (dateResult.length > 0) {
                        const date = dateResult[0].date;
                        await databaseManager.executeSqlAsync(
                            `DELETE FROM BooleanHabits WHERE date = ?;`,
                            [date]
                        );
                        await this.logDeletion(this.tableStructure.name, uuid);

                        await databaseManager.executeSqlAsync(
                            `DELETE FROM QuantifiableHabits WHERE date = ?;`,
                            [date]
                        );
                        await this.logDeletion('QuantifiableHabits', `${date}`);
                    }
                }

                await databaseManager.executeSqlAsync(
                    `DELETE FROM ${this.tableStructure.name} WHERE ${this.tableStructure.primaryKey} = ?;`,
                    [id]
                );
                await this.logDeletion(this.tableStructure.name, uuid);
            });

            console.log(`Logged deletion for ${this.tableStructure.name} with uuid ${uuid}`);
        } else {
            console.warn(`No record found with id ${id} in ${this.tableStructure.name}`);
        }
    }

    async removeByUuid(uuid: string): Promise<void> {
        await databaseManager.withTransactionAsync(async () => {
            await databaseManager.executeSqlAsync(
                `DELETE FROM ${this.tableStructure.name} WHERE uuid = ?;`,
                [uuid]
            );
            await this.logDeletion(this.tableStructure.name, uuid);
        });
        console.log(`Logged deletion for ${this.tableStructure.name} with uuid ${uuid}`);
    }

    async createTable(): Promise<void> {
        const columns = Object.entries(this.tableStructure.columns)
            .map(([name, type]) => `${name} ${type}`)
            .join(', ');

        const constraints = [];

        if (!columns.includes('PRIMARY KEY')) {
            constraints.push(`PRIMARY KEY (${this.tableStructure.primaryKey})`);
        }

        if (this.tableStructure.foreignKeys) {
            constraints.push(...this.tableStructure.foreignKeys);
        }

        if (this.tableStructure.conflictResolutionKey) {
            const conflictKeys = Array.isArray(this.tableStructure.conflictResolutionKey)
                ? this.tableStructure.conflictResolutionKey
                : [this.tableStructure.conflictResolutionKey];
            constraints.push(`UNIQUE (${conflictKeys.join(', ')})`);
        }

        const constraintsClause = constraints.length > 0 ? `, ${constraints.join(', ')}` : '';

        await databaseManager.executeSqlAsync(`
            CREATE TABLE IF NOT EXISTS ${this.tableStructure.name} (
                ${columns}${constraintsClause}
            );
        `);
        console.log(`${this.tableStructure.name} table created successfully`);
    }

    async getById(id: any): Promise<T> {
        const result = await databaseManager.executeSqlAsync<T>(
            `SELECT * FROM ${this.tableStructure.name} WHERE ${this.tableStructure.primaryKey} = ?;`,
            [id]
        );

        if (result.length > 0) {
            return result[0];
        }
        throw new Error(`No record found with id ${id}`);
    }

    async getByDate(date: string): Promise<T[]> {
        return await databaseManager.executeSqlAsync<T>(
            `SELECT * FROM ${this.tableStructure.name} WHERE date = ?;`,
            [date]
        );
    }

    async getByUuid(uuid: any): Promise<T> {
        const result = await databaseManager.executeSqlAsync<T>(
            `SELECT * FROM ${this.tableStructure.name} WHERE uuid = ?;`,
            [uuid]
        );

        if (result.length > 0) {
            return result[0];
        }
        throw new Error(`No record found with uuid ${uuid}`);
    }

    async getByDateRange(startDate: string, endDate: string): Promise<T[]> {
        return await databaseManager.executeSqlAsync<T>(
            `SELECT * FROM ${this.tableStructure.name} WHERE date BETWEEN ? AND ? ORDER BY date ASC;`,
            [startDate, endDate]
        );
    }
}