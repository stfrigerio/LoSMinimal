from flask import Blueprint, jsonify, request, send_file
import os
from app.config import DB_PATH, DB_DIRECTORY, DB_FILENAME
from logger import logger

bp = Blueprint('database', __name__)

@bp.route('/upload_sqlite', methods=['POST'])
def upload_sqlite():
    try:
        if 'file' not in request.files:
            logger.error("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        file.save(DB_PATH)
        logger.info("Database saved to: %s", DB_PATH)
        return jsonify({"message": "SQLite database uploaded successfully"}), 200
        
    except Exception as e:
        logger.error("Error in upload_sqlite: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500

@bp.route('/upload_json', methods=['POST'])
def upload_json():
    try:
        if 'file' not in request.files:
            logger.error("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        json_path = os.path.join(DB_DIRECTORY, 'database_backup.json')
        file.save(json_path)
        logger.info("JSON backup saved to: %s", json_path)
        return jsonify({"message": "JSON backup uploaded successfully"}), 200
        
    except Exception as e:
        logger.error("Error in upload_json: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500

@bp.route('/download_db', methods=['GET'])
def download_db():
    try:
        if not os.path.exists(DB_PATH):
            logger.error(f"Database file not found at {DB_PATH}")
            return jsonify({"error": "Database file not found"}), 404
            
        return send_file(
            DB_PATH,
            mimetype='application/octet-stream',
            as_attachment=True,
            download_name=DB_FILENAME,
            # Add cache prevention headers
            etag=None,
            last_modified=None,
            max_age=0
        )
    except Exception as e:
        logger.error(f"Error in download_db: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500