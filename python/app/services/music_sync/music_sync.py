from pathlib import Path

class MusicSync:
    def __init__(self, music_library_path):
        self.music_library_path = Path(music_library_path).resolve()
        self.initialize()

    def initialize(self):
        self.ensure_folder_exists()

    def ensure_folder_exists(self):
        self.music_library_path.mkdir(parents=True, exist_ok=True)

    def get_album_list(self):
        """
        Retrieves a list of all album directories in the music library.
        """
        try:
            albums = [
                album.name for album in self.music_library_path.iterdir()
                if album.is_dir() and not album.name.startswith('.')
            ]
            return albums
        except Exception as e:
            raise e

    def get_album_files(self, album_name):
        """
        Retrieves a list of all files within the specified album.
        Each file is represented as a dictionary with 'name' and 'path'.
        """
        album_path = self.music_library_path / album_name
        if not album_path.exists() or not album_path.is_dir():
            raise FileNotFoundError(f"Album not found: {album_name}")

        try:
            files = [
                {
                    "name": file.name,
                    "path": str(file.resolve())
                }
                for file in album_path.iterdir()
                if file.is_file()
            ]
            return files
        except Exception as e:
            raise e

    def get_file_path(self, album_name, file_name):
        """
        Constructs and returns the absolute path to the specified file within an album.
        """
        album_path = self.music_library_path / album_name
        file_path = album_path / file_name

        if not file_path.exists() or not file_path.is_file():
            raise FileNotFoundError(f"File not found: {file_path}")

        return file_path.resolve()
