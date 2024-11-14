import os
from logger import logger

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Goes up two levels from config.py

DB_DIRECTORY = os.path.join(PROJECT_ROOT, 'database_files')
DB_FILENAME = 'LocalDB.db'
DB_PATH = os.path.join(DB_DIRECTORY, DB_FILENAME)

# Create database directory if it doesn't exist
os.makedirs(DB_DIRECTORY, exist_ok=True)