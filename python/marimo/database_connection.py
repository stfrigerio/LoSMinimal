import sqlite3
import os
from typing import List, Tuple, Any, Optional
from types import SimpleNamespace
import pandas as pd

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
                
    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.disconnect()