from flask import Blueprint, jsonify, send_file, make_response
import os
from werkzeug.utils import secure_filename
from logger import logger

from app.services.music_sync.music_sync import MusicSync

music_bp = Blueprint('music', __name__)

# Initialize MusicSync
music_sync = MusicSync(os.path.join(os.path.dirname(__file__), '../../../../musicLibrary'))

@music_bp.route('/albums', methods=['GET'])
def get_album_list():
    try:
        albums = music_sync.get_album_list()
        return jsonify(albums)
    except Exception as e:
        logger.error(f"Failed to get album list: {str(e)}")
        return jsonify({"error": "Failed to get album list"}), 500

@music_bp.route('/albums/<album_name>/files', methods=['GET'])
def get_album_files(album_name):
    try:
        files = music_sync.get_album_files(album_name)
        return jsonify(files)
    except FileNotFoundError:
        return jsonify({"error": "Album not found"}), 404
    except Exception as e:
        logger.error(f"Failed to get album files for {album_name}: {str(e)}")
        return jsonify({"error": "Failed to get album files"}), 500

@music_bp.route('/sync/<album_name>', methods=['POST'])
def prepare_album_for_sync(album_name):
    try:
        files = music_sync.get_album_files(album_name)
        return jsonify(files)
    except FileNotFoundError:
        return jsonify({"error": "Album not found"}), 404
    except Exception as e:
        logger.error(f"Failed to prepare album for sync: {album_name}: {str(e)}")
        return jsonify({"error": "Failed to prepare album for sync"}), 500

@music_bp.route('/file/<album_name>/<file_name>')
def get_file(album_name, file_name):
    try:
        file_path = music_sync.get_file_path(album_name, secure_filename(file_name))
        
        response = make_response(send_file(
            file_path,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=file_name
        ))
        
        # Add headers
        response.headers['Content-Disposition'] = f'attachment; filename="{file_name}"'
        response.headers['Content-Length'] = os.path.getsize(file_path)
        
        return response
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Failed to get file {album_name}/{file_name}: {str(e)}")
        return jsonify({"error": "Failed to get file", "details": str(e)}), 500