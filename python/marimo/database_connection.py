import sqlite3
import os
from typing import List, Tuple, Any, Optional
from types import SimpleNamespace
import pandas as pd
import uuid
from datetime import datetime, timezone

class DatabaseManager:
    def __init__(self, db_path: str = '/home/stefano/Github/LoSMinimal/python/database_files/LocalDB.db'):
        """Initialize database connection"""
        self.db_path = os.path.abspath(db_path)
        self.connection = None
        self.cursor = None

    def connect(self) -> None:
        """Establish database connection"""
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.cursor = self.connection.cursor()
            print(f"✅ Successfully connected to database at: `{self.db_path}`")
        except sqlite3.Error as e:
            print(f"❌ Error connecting to database: {str(e)}")
            
    def disconnect(self) -> None:
        """Close database connection"""
        if self.connection:
            self.connection.close()
            print("📤 Database connection closed")
            
    def execute_query(self, query: str, params: tuple = ()) -> Optional[List[Tuple]]:
        """Execute a query and return results"""
        try:
            self.cursor.execute(query, params)
            if query.strip().upper().startswith(('SELECT', 'PRAGMA')):
                return self.cursor.fetchall()
            else:
                self.connection.commit()
                return None
        except sqlite3.Error as e:
            print(f"❌ Query execution error: {str(e)}")
            return None
            
    def get_tables(self) -> SimpleNamespace:
        """Get list of all tables as a namespace with table contents as DataFrames"""
        query = "SELECT name FROM sqlite_master WHERE type='table'"
        tables = self.execute_query(query)
        if tables:
            # Filter out unwanted tables
            filtered_tables = [table[0] for table in tables if table[0] not in ('android_metadata', 'sqlite_sequence')]
            # Fetch the contents of each table and convert to DataFrame
            tables_data = {}
            for table in filtered_tables:
                try:
                    df = pd.read_sql_query(f"SELECT * FROM {table}", self.connection)
                    tables_data[table] = df
                except Exception as e:
                    print(f"❌ Error fetching data for table `{table}`: {e}")
                    tables_data[table] = None
            # Convert the dictionary to a namespace
            return SimpleNamespace(**tables_data)
        return SimpleNamespace()

    def get_table_schema(self, table_name: str) -> None:
        """Display schema for a specific table"""
        query = f"PRAGMA table_info({table_name})"
        schema = self.execute_query(query)
        if schema:
            print(f"### Schema for table: `{table_name}`")
            for col in schema:
                print(f"- **{col[1]}** ({col[2]})")

    def check_table_constraints(self) -> None:
        """Check existing table constraints"""
        for table_name in self.table_configs.keys():
            # Check table info
            table_info = self.execute_query(f"PRAGMA table_info({table_name})")
            print(f"\n=== {table_name} Structure ===")
            print("Columns:", table_info)
            
            # Check indexes and unique constraints
            index_info = self.execute_query(f"PRAGMA index_list({table_name})")
            print("Indexes:", index_info)
            
            for idx in index_info or []:
                idx_name = idx[1]
                idx_columns = self.execute_query(f"PRAGMA index_info({idx_name})")
                print(f"Index {idx_name} columns:", idx_columns)
                
    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.disconnect()

    def generateUuid(self) -> str:
        import uuid
        return str(uuid.uuid4())

    def upsert(self, table_name: str, data: dict, in_transaction: bool = False) -> dict:
        try:

            # Different existence checks based on table
            if table_name == 'DailyNotes':
                existing = self.execute_query(
                    "SELECT date FROM {} WHERE date = ?".format(table_name),
                    (data['date'],)
                )
                if existing:
                    print(f"⏩ Skipping existing date: {data['date']}")
                    return None
            elif table_name == 'QuantifiableHabits':
                existing = self.execute_query(
                    "SELECT date FROM {} WHERE date = ? AND habitKey = ?".format(table_name),
                    (data['date'], data['habitKey'])
                )
                if existing:
                    print(f"⏩ Skipping existing habit {data['habitKey']} for date: {data['date']}")
                    return None

            # Ensure uuid exists
            if 'uuid' not in data or not data['uuid']:
                data['uuid'] = self.generateUuid()
            
            # Handle timestamps
            now = datetime.now(timezone.utc).isoformat()
            if 'createdAt' not in data:
                data['createdAt'] = now
            data['updatedAt'] = now
            
            columns = list(data.keys())
            placeholders = ','.join(['?' for _ in columns])
            values = tuple(data.values())
            
            # Use format instead of f-strings for the SQL query
            query = "INSERT INTO {} ({}) VALUES ({})".format(
                table_name,
                ','.join(columns),
                placeholders
            )
            
            if not in_transaction:
                self.connection.execute('BEGIN')
                
            self.execute_query(query, values)
            
            # Fetch and return the inserted row
            if table_name == 'QuantifiableHabits':
                result = self.execute_query(
                    "SELECT * FROM {} WHERE date = ? AND habitKey = ?".format(table_name),
                    (data['date'], data['habitKey'])
                )
            else:
                result = self.execute_query(
                    "SELECT * FROM {} WHERE date = ?".format(table_name),
                    (data['date'],)
                )
            
            if not in_transaction:
                self.connection.commit()
            
            if result and len(result) > 0:
                columns = [description[0] for description in self.cursor.description]
                return dict(zip(columns, result[0]))
            return None
                
        except Exception as e:
            if not in_transaction:
                self.connection.rollback()
            print(f"❌ Insert error: {str(e)}")
            print(f"Data causing error: {data}")
            return None
        
    def bulk_upsert(self, table_name: str, df: pd.DataFrame) -> None:
        """
        Bulk upsert a pandas DataFrame into a table
        """
        success_count = 0
        error_count = 0
        
        try:
            # Convert DataFrame to list of dictionaries
            records = df.to_dict('records')
            
            # Close and reopen connection to ensure clean state
            self.disconnect()
            self.connect()
            
            # Start a single transaction for the entire operation
            self.connection.execute('BEGIN EXCLUSIVE')
            
            # Upsert each record
            for i, record in enumerate(records, 1):
                try:
                    result = self.upsert(table_name, record, in_transaction=True)
                    if result:
                        success_count += 1
                    else:
                        error_count += 1
                except Exception as row_error:
                    error_count += 1
                    print(f"⚠️ Skipping row {i}: {str(row_error)}")
                    continue
                
                if i % 100 == 0:  # Progress update every 100 records
                    print(f"Processed {i}/{len(records)} records...")
            
            # Commit all changes at once
            self.connection.commit()
            print(f"✅ Completed: {success_count} successful, {error_count} failed out of {len(records)} total records")
            
        except Exception as e:
            self.connection.rollback()
            print(f"❌ Bulk upsert error: {str(e)}")
        finally:
            # Ensure we're back in autocommit mode
            self.connection.rollback()