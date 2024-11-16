from flask import Blueprint, jsonify, request
from app.services.summaries.ai_helpers.claude import generate_journal_entry
from logger import logger

bp = Blueprint('journal', __name__)

@bp.route('/generate_journal', methods=['POST'])
def generate_journal():
    try:
        logger.info('generate_journal called')
        data = request.json
        journal_entries = data['journalEntries']
        start_date = data['startDate']
        end_date = data['endDate']

        logger.info(f'len journal entries: {len(journal_entries)}, start date: {start_date}, end date: {end_date}')

        if not journal_entries:
            return jsonify({"error": "No journal entries found in the specified date range"}), 400

        generated_entry = generate_journal_entry(journal_entries)
        logger.info(f'generated_entry: {generated_entry}')

        return jsonify({"message": "Journal entry generated successfully", "generated_entry": generated_entry}), 200
    except Exception as e:
        logger.error(f"Error in generate_journal: {str(e)}")
        return jsonify({"error": str(e)}), 500 