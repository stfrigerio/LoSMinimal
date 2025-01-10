from pathlib import Path

class BookSync:
    def __init__(self, book_library_path):
        self.book_library_path = Path(book_library_path).resolve()
        self.initialize()

    def initialize(self):
        self.ensure_folder_exists()

    def ensure_folder_exists(self):
        self.book_library_path.mkdir(parents=True, exist_ok=True)

    def get_book_list(self):
        """
        Retrieves a list of all book directories in the book library.
        """
        try:
            books = [
                book.name for book in self.book_library_path.iterdir()
                if book.is_dir() and not book.name.startswith('.')
            ]
            return books
        except Exception as e:
            raise e

    def book_exists(self, book_name):
        """
        Check if a book exists in the library.
        """
        book_path = self.book_library_path / book_name
        return book_path.exists() and book_path.is_dir()
    
    def get_book_files(self, book_name):
        """
        Retrieves a list of all files within the specified book.
        Each file is represented as a dictionary with 'name' and 'path'.
        """
        book_path = self.book_library_path / book_name
        if not book_path.exists() or not book_path.is_dir():
            raise FileNotFoundError(f"Book not found: {book_name}")

        try:
            files = [
                {
                    "name": file.name,
                    "path": str(file.resolve())
                }
                for file in book_path.iterdir()
                if file.is_file()
            ]

            # exclude the .txt files
            return [file for file in files if not file["name"].endswith(".txt")]
        except Exception as e:
            raise e

    def get_file_path(self, book_name, file_name):
        """
        Constructs and returns the absolute path to the specified file within a book.
        """
        book_path = self.book_library_path / book_name
        file_path = book_path / file_name

        if not file_path.exists() or not file_path.is_file():
            raise FileNotFoundError(f"File not found: {file_path}")

        return file_path.resolve()
