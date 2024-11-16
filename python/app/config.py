import os
from logger import logger
from pathlib import Path

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Goes up two levels from config.py

DB_DIRECTORY = os.path.join(PROJECT_ROOT, 'database_files')
DB_FILENAME = 'LocalDB.db'
DB_PATH = os.path.join(DB_DIRECTORY, DB_FILENAME)

# Define the path to the imageLibrary folder
IMAGE_LIBRARY_PATH = os.path.join(PROJECT_ROOT, '../imageLibrary')
Path(IMAGE_LIBRARY_PATH).mkdir(parents=True, exist_ok=True)

# Define the path to the musicLibrary folder
MUSIC_LIBRARY_PATH = os.path.join(PROJECT_ROOT, '../musicLibrary')
Path(MUSIC_LIBRARY_PATH).mkdir(parents=True, exist_ok=True)

# Create database directory if it doesn't exist
os.makedirs(DB_DIRECTORY, exist_ok=True)