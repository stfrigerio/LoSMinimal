from flask import Blueprint, jsonify, send_file, make_response, abort
import os
from pathlib import Path
from logger import logger

from app.services.music_sync.music_sync import MusicSync
from app.config import MUSIC_LIBRARY_PATH

music_bp = Blueprint('music', __name__)

# Initialize MusicSync
music_sync = MusicSync(MUSIC_LIBRARY_PATH)

@music_bp.route('/albums', methods=['GET'])
def get_album_list():
    """
    Retrieves a list of all albums.
    """
    try:
        albums = music_sync.get_album_list()
        return jsonify(albums)
    except Exception as e:
        logger.error(f"Failed to get album list: {str(e)}")
        return jsonify({"error": "Failed to get album list"}), 500

@music_bp.route('/albums/<album_name>/files', methods=['GET'])
def get_album_files(album_name):
    """
    Retrieves a list of all files within a specified album.
    """

    try:
        files = music_sync.get_album_files(album_name)
        return jsonify(files)
    except FileNotFoundError:
        logger.error(f"Album not found: {album_name}")
        return jsonify({"error": "Album not found"}), 404
    except Exception as e:
        logger.error(f"Failed to get album files for {album_name}: {str(e)}")
        return jsonify({"error": "Failed to get album files"}), 500

@music_bp.route('/sync/<album_name>', methods=['POST'])
def prepare_album_for_sync(album_name):
    """
    Prepares the album for synchronization by retrieving its files.
    """

    try:
        files = music_sync.get_album_files(album_name)
        logger.info(f"Prepared album '{album_name}' for sync with {len(files)} files.")
        return jsonify(files), 200
    except FileNotFoundError:
        logger.error(f"Album not found during sync: {album_name}")
        return jsonify({"error": "Album not found"}), 404
    except Exception as e:
        logger.error(f"Failed to prepare album for sync: {album_name}: {str(e)}")
        return jsonify({"error": "Failed to prepare album for sync"}), 500

@music_bp.route('/file/<album_name>/<file_name>', methods=['GET'])
def get_file(album_name, file_name):
    """
    Serves an individual music file.
    """

    try:
        # Construct the file path without altering the filename
        file_path = music_sync.get_file_path(album_name, file_name)

        # Ensure the file path is within the MUSIC_LIBRARY_PATH
        if not file_path.resolve().is_file() or not str(file_path.resolve()).startswith(str(Path(MUSIC_LIBRARY_PATH).resolve())):
            logger.error(f"Attempted path traversal detected: {file_path}")
            return jsonify({"error": "Invalid file path"}), 400

        # Serve the file
        response = make_response(send_file(
            file_path,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=file_name
        ))

        # Add headers with ASCII-compatible filename
        safe_filename = file_name.encode('ascii', 'replace').decode('ascii')
        response.headers['Content-Disposition'] = f'attachment; filename="{safe_filename}"'
        response.headers['Content-Length'] = os.path.getsize(file_path)

        return response

    except FileNotFoundError:
        logger.error(f"File not found: {album_name}/{file_name}")
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Failed to get file {album_name}/{file_name}: {str(e)}")
        return jsonify({"error": "Failed to get file", "details": str(e)}), 500