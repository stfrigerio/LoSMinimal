from pathlib import Path

class MusicSync:
    def __init__(self, music_library_path):
        self.music_library_path = Path(music_library_path)
        self.initialize()

    def initialize(self):
        self.ensure_folder_exists()

    def ensure_folder_exists(self):
        self.music_library_path.mkdir(parents=True, exist_ok=True)

    def get_album_list(self):
        return [album.name for album in self.music_library_path.iterdir() 
                if album.is_dir() and not album.name.startswith('.')]

    def get_album_files(self, album_name):
        album_path = self.music_library_path / album_name
        if not album_path.exists():
            raise FileNotFoundError(f"Album not found: {album_name}")
        
        return [
            {
                "name": file.name,
                "path": str(file)
            }
            for file in album_path.iterdir()
            if file.is_file()
        ]

    def get_file_path(self, album_name, file_name):
        file_path = self.music_library_path / album_name / file_name
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        return file_path