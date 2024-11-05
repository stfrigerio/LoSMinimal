import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

export interface TestEntry {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

class DatabaseManager {
  private db: SQLiteDatabase | null = null;

  /**
   * Opens and initializes the database
   */
  async initialize(): Promise<void> {
    try {
      this.db = await openDatabaseAsync('testdb.db');
      await this.initializeDatabase();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Initializes the database and creates the TestTable if it doesn't exist
   */
  private async initializeDatabase(): Promise<void> {
    try {
      await this.db!.execAsync(
        `CREATE TABLE IF NOT EXISTS TestTable (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );`
      );
      console.log('TestTable created or already exists');
    } catch (error) {
      console.error('Error creating TestTable:', error);
      throw error;
    }
  }

  /**
   * Inserts a new row or updates an existing one based on the unique name
   */
  async upsertTestEntry(name: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      await this.db!.runAsync(
        `INSERT INTO TestTable (name, createdAt, updatedAt)
         VALUES (?, ?, ?)
         ON CONFLICT(name) DO UPDATE SET
           updatedAt=excluded.updatedAt;`,
        [name, now, now]
      );
      console.log(`Upserted entry with name: ${name}`);
    } catch (error) {
      console.error('Error upserting entry:', error);
      throw error;
    }
  }

  /**
   * Fetches all entries from TestTable
   */
  async fetchTestEntries(): Promise<TestEntry[]> {
    try {
      const entries = await this.db!.getAllAsync<TestEntry>(
        'SELECT * FROM TestTable;'
      );
      return entries;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  }

  /**
   * Closes the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Export a singleton instance
export const databaseManager = new DatabaseManager();