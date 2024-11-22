import { openDatabaseAsync, SQLiteDatabase, SQLiteOpenOptions } from 'expo-sqlite';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import { capitalizedTableNames } from '../src/constants/tableNames';

class DatabaseManager {
    private db: SQLiteDatabase | null;
    private initializePromise: Promise<SQLiteDatabase> | null;

    constructor() {
        this.db = null;
        this.initializePromise = this.checkAndRequestPermissions()
            .then(() => this.initializeDatabase())
            .catch((error) => {
                console.log('Error initializing database: ', error);
                return Promise.reject(error);
            });
    }

    /**
     * Requests necessary permissions.
     */
    private async checkAndRequestPermissions(): Promise<void> {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission not granted');
        }
    }

    /**
     * Initializes the database using the new expo-sqlite API.
     */
    public async initializeDatabase(): Promise<SQLiteDatabase> {
        try {
            const options: SQLiteOpenOptions = {
                enableChangeListener: true, // Enable change listeners if needed
                // Add other options if necessary
            };
            this.db = await openDatabaseAsync('LocalDB.db', options);
            console.log('Database initialized successfully');
            return this.db;
        } catch (error) {
            console.error('Error opening database:', error);
            throw error;
        }
    }

    /**
     * Performs a hard reset of the database by deleting the file and reinitializing.
     */
    public async hardResetDatabase(): Promise<void> {
        try {
            // Close the current database connection
            if (this.db) {
                await this.db.closeAsync();
                this.db = null;
            }

            // Delete the database file
            const dbPath = `${FileSystem.documentDirectory}SQLite/LocalDB.db`;
            await FileSystem.deleteAsync(dbPath, { idempotent: true });

            console.log('Database file deleted successfully');

            // Reinitialize the database
            this.initializePromise = this.checkAndRequestPermissions()
                .then(() => this.initializeDatabase())
                .catch((error) => {
                    console.log('Error reinitializing database: ', error);
                    return Promise.reject(error);
                });

            await this.initializePromise;
            console.log('Database reinitialized successfully');
        } catch (error) {
            console.error('Error during hard reset:', error);
            throw error;
        }
    }

    /**
     * Drops all specified tables from the database.
     */
    public async dropAllTables(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const tables = [...capitalizedTableNames, "QuantifiableHabits", "BooleanHabits"];
        
        try {
            await this.db.withExclusiveTransactionAsync(async (txn) => {
                for (const table of tables) {
                    await txn.execAsync(`DROP TABLE IF EXISTS ${table};`);
                    console.log(`${table} table dropped`);
                }
            });
            console.log('All tables dropped successfully');
        } catch (error) {
            console.error('Error dropping tables:', error);
            throw error;
        }
    }

    /**
     * Drops a specific table from the database.
     * @param tableName The name of the table to drop.
     */
    public async dropTable(tableName: string): Promise<void> {
        if (!this.db) {
            console.error('Database not initialized');
            return Promise.reject('Database not initialized');
        }

        try {
            await this.db.execAsync(`DROP TABLE IF EXISTS ${tableName};`);
            console.log(`${tableName} table dropped successfully`);
        } catch (error) {
            console.error(`Error dropping ${tableName} table:`, error);
            throw error;
        }
    }

    /**
     * Checks the database connection by verifying the existence of all tables.
     */
    public async checkDatabaseConnection(): Promise<SQLiteDatabase> {
        if (!this.db) {
            this.db = await this.initializeDatabase();
        }

        console.log('Database opened... Testing connection for all tables...');

        try {
            for (const tableName of [...capitalizedTableNames]) {
                const result = await this.db.getFirstAsync<{ count: number }>(
                    `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name=?;`,
                    [tableName]
                );
                if (result?.count === 0) {
                    throw new Error(`Table ${tableName} does not exist`);
                }
            }
            console.log('Database connection successful');
            return this.db;
        } catch (error) {
            console.error('Error checking database tables:', error);
            throw error;
        }
    }

    /**
     * Retrieves the initialized database instance.
     */
    public getDatabase(): Promise<SQLiteDatabase> {
        if (!this.db) {
            this.initializePromise = this.initializeDatabase();
        }
        return this.initializePromise as Promise<SQLiteDatabase>;
    }

    /**
     * Executes a SQL statement asynchronously.
     * @param sql The SQL query to execute.
     * @param params Optional parameters for the SQL query.
     */
    public async executeSqlAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            return await this.db.getAllAsync<T>(sql, params);
        } catch (error) {
            console.error('Error executing SQL:', error);
            throw error;
        }
    }
    
    public async withTransactionAsync(callback: () => Promise<void>): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            await this.db.withExclusiveTransactionAsync(async (txn) => {
                await callback();
            });
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }


    /**
     * Generates a UUID.
     */
    public generateUuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export const databaseManager = new DatabaseManager();
