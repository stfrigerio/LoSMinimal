from flask import Blueprint, jsonify, send_file, make_response, abort, request
import os
from pathlib import Path
from urllib.parse import unquote  # Add this import at the top

from app.services.book_sync.book_sync import BookSync
from app.config import BOOK_LIBRARY_PATH
from logger import logger

book_bp = Blueprint('book', __name__)

# Initialize MusicSync
book_sync = BookSync(BOOK_LIBRARY_PATH)

@book_bp.route('/', methods=['GET'])
def get_book_list():
    """
    Retrieves a list of all books.
    """
    try:
        books = book_sync.get_book_list()
        return jsonify(books)
    except Exception as e:
        logger.error(f"Failed to get book list: {str(e)}")
        return jsonify({"error": "Failed to get book list"}), 500

@book_bp.route('/<book_name>/files', methods=['GET'])
def get_book_files(book_name):
    try:
        files = book_sync.get_book_files(book_name)
        return jsonify(files)
    except FileNotFoundError:
        logger.error(f"Book not found: {book_name}")
        return jsonify({"error": "Book not found"}), 404  # Changed from "Album not found"
    except Exception as e:
        logger.error(f"Failed to get book files for {book_name}: {str(e)}")
        return jsonify({"error": "Failed to get book files"}), 500

@book_bp.route('/sync/<book_name>', methods=['POST'])
def prepare_book_for_sync(book_name):
    try:
        # Add debug logging
        logger.info(f"Endpoint hit: /sync/{book_name}")
        logger.info(f"Raw book name received: {book_name}")
        logger.info(f"Request path: {request.path}")
        
        # Properly decode the URL-encoded book name
        book_name = unquote(book_name)
        logger.info(f"Decoded book name: {book_name}")
        
        if not book_sync.book_exists(book_name):
            logger.error(f"Book not found during sync: {book_name}")
            return jsonify({"error": "Book not found"}), 404
            
        files = book_sync.get_book_files(book_name)
        logger.info(f"Prepared book '{book_name}' for sync with {len(files)} files.")
        return jsonify(files), 200
    except Exception as e:
        logger.error(f"Failed to prepare book for sync: {book_name}: {str(e)}")
        return jsonify({"error": "Failed to prepare book for sync"}), 500
    
@book_bp.route('/file/<book_name>/<file_name>', methods=['GET'])
def get_file(book_name, file_name):
    """
    Serves an individual book file.
    """

    try:
        # Construct the file path without altering the filename
        file_path = book_sync.get_file_path(book_name, file_name)

        # Ensure the file path is within the MUSIC_LIBRARY_PATH
        if not file_path.resolve().is_file() or not str(file_path.resolve()).startswith(str(Path(BOOK_LIBRARY_PATH).resolve())):
            logger.error(f"Attempted path traversal detected: {file_path}")
            return jsonify({"error": "Invalid file path"}), 400

        # Serve the file
        response = make_response(send_file(
            file_path,
            mimetype='application/epub+zip',
            as_attachment=True,
            download_name=file_name
        ))

        # Add headers with ASCII-compatible filename
        safe_filename = file_name.encode('ascii', 'replace').decode('ascii')
        response.headers['Content-Disposition'] = f'attachment; filename="{safe_filename}"'
        response.headers['Content-Length'] = os.path.getsize(file_path)

        return response

    except FileNotFoundError:
        logger.error(f"File not found: {book_name}/{file_name}")
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Failed to get file {book_name}/{file_name}: {str(e)}")
        return jsonify({"error": "Failed to get file", "details": str(e)}), 500