import sqlite3
from pathlib import Path

def fetch_pillars():
    """
    Fetches all pillars from the local SQLite database.
    Returns a list of dictionaries containing pillar data.
    """
    # Get the absolute path to the database file
    db_path = Path(__file__).parent.parent.parent.parent / 'database_files' / 'LocalDB.db'
    
    try:
        # Connect to the database
        conn = sqlite3.connect(str(db_path))
        # Create a cursor that returns rows as dictionaries
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Execute the query
        cursor.execute('SELECT * FROM pillars')
        
        # Fetch all rows and convert them to dictionaries
        pillars = [dict(row) for row in cursor.fetchall()]
        
        return pillars
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return []
        
    finally:
        # Make sure to close the connection
        if 'conn' in locals():
            conn.close()