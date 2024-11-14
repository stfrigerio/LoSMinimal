from flask import Blueprint, jsonify, request
from app.services.summary_service import process_weekly_summary, process_monthly_summary
from logger import logger

bp = Blueprint('summary', __name__)

@bp.route('/weekly_summary', methods=['POST'])
def weekly_summary():
    try:
        data = request.json
        logger.info('Data received')
        
        result = process_weekly_summary(data)
        return jsonify({"message": "Data processed successfully", "mood_summary": result}), 200
        
    except Exception as e:
        logger.error(f"Error in weekly_summary: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@bp.route('/monthly_summary', methods=['POST'])
def monthly_summary():
    try:
        data = request.json
        logger.info('Data received')
        
        result = process_monthly_summary(data)
        return jsonify({"message": "Data processed successfully", "mood_summary": result}), 200
        
    except Exception as e:
        logger.error(f"Error in monthly_summary: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500 