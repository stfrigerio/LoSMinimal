from flask import Blueprint, jsonify, request, send_file
import os
from datetime import datetime
import shutil

from app.services.images.images import save_images
from app.services.route_services.database_services import cleanup_old_backups
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
        
        # Create backups directory if it doesn't exist
        backup_dir = os.path.join(DB_DIRECTORY, 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generate timestamp for backup file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'LocalDB_{timestamp}.db'
        backup_path = os.path.join(backup_dir, backup_filename)
        
        # Save the current file
        file.save(DB_PATH)
        logger.info("Database saved to: %s", DB_PATH)
        
        # Create backup copy
        shutil.copy2(DB_PATH, backup_path)
        logger.info("Backup created at: %s", backup_path)
        
        # Handle images if they're included in the request
        saved_images = []
        duplicates = 0

        logger.info("Request size: %s bytes", request.content_length)
        
        if 'images' in request.form and 'date' in request.form:
            try:
                images = request.form.getlist('images')
                date_str = request.form['date']
                saved_images, duplicates = save_images(date_str, images)
                logger.info(f"Saved {len(saved_images)} images, {duplicates} duplicates skipped")
            except Exception as e:
                logger.error(f"Error processing images: {str(e)}")
                # Continue with the response even if image processing fails
        
        # Optional: Maintain only last N backups
        cleanup_old_backups(backup_dir, keep_last=10)
        
        return jsonify({
            "message": "SQLite database uploaded successfully",
            "backup_path": backup_path,
            "saved_images": saved_images,
            "duplicates": duplicates
        }), 200
        
    except Exception as e:
        logger.error("Error in upload_sqlite: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500

@bp.route('/upload_images', methods=['POST'])
def upload_images():
    try:
        if 'images' not in request.files:
            logger.error("No images found in request")
            return jsonify({"error": "No images in request"}), 400

        if 'date' not in request.form:
            logger.error("No date found in request")
            return jsonify({"error": "No date provided"}), 400

        date_str = request.form['date']
        images = request.files.getlist('images')

        saved_images, duplicates = save_images(date_str, images)

        return jsonify({
            "message": "Images uploaded successfully",
            "saved_images": saved_images,
            "duplicates": duplicates
        }), 200

    except Exception as e:
        logger.error("Error in upload_images: %s", str(e), exc_info=True)
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