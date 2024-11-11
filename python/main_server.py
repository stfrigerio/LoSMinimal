from flask import Flask, jsonify, request, send_file
import json
from datetime import datetime
import os
import sqlite3
import base64

from data_processing.data_cleaning import clean_data
from database.database_functions import fetch_pillars
from ai_helpers.claude import generate_mood_recap, generate_journal_entry, generate_monthly_mood_recap
from ai_helpers.gpt import create_thoughts
from logger import logger

app = Flask(__name__)

DB_DIRECTORY = 'database_files'
DB_FILENAME = 'app_database.db'
DB_PATH = os.path.join(DB_DIRECTORY, DB_FILENAME)

# Create database directory if it doesn't exist
os.makedirs(DB_DIRECTORY, exist_ok=True)

# Initialize empty database if it doesn't exist
def init_empty_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        conn.close()
        logger.info(f"Created empty database at {DB_PATH}")

def get_week_number(date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    week_number = date_obj.isocalendar()[1]
    year = date_obj.isocalendar()[0]

    week_date = f"{year}-W{week_number}"

    return week_date

@app.route('/weekly_summary', methods=['POST'])
def weekly_summary():
    try:
        # Load data from request instead of file
        data = request.json
        logger.info('Data recieved')

        cleaned_data = clean_data(data)
        logger.info('Data cleaned')

        # Unpack cleaned_data
        boolean_habits = cleaned_data["booleanHabits"]
        quantifiable_habits = cleaned_data["quantifiableHabits"]
        note_data = cleaned_data["dailyNoteData"]
        time_data = cleaned_data["timeData"]
        mood_data = cleaned_data["moodData"]
        journal_data = cleaned_data["journalData"]

        del cleaned_data["booleanHabits"]
        del cleaned_data["quantifiableHabits"]

        most_recent_date = max(mood_entry['date'].split('T')[0] for mood_entry in mood_data)
        week_date = get_week_number(most_recent_date)
        logger.info(f'Week date: {week_date}')

        data_to_send = {
            "note_data": note_data,
            "mood_data": mood_data,
        }
        
        claude_response = generate_mood_recap(data_to_send)
        mood_summary = claude_response.content[0].text

        data_to_give_gpt = {
            "successes": [note["success"] for note in note_data],
            "beBetters": [note["beBetter"] for note in note_data],
            "claude_summary": mood_summary
        }

        pillars = fetch_pillars()

        gpt_response = create_thoughts(data_to_give_gpt, pillars)

        data = {
            "id": None,
            "date": week_date,
            "type": "Mood Summary",
            "claude_summary": mood_summary,
            "gpt_summary": gpt_response
        }

        return jsonify({"message": "Data processed successfully", "mood_summary": data}), 200
    except Exception as e:
        logger.error(f"Error in process_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/monthly_summary', methods=['POST'])
def monthly_summary():
    try:
        data = request.json
        logger.info('Data recieved')

        cleaned_data = clean_data(data)
        logger.info('Data cleaned')

        # Unpack cleaned_data
        boolean_habits = cleaned_data["booleanHabits"]
        quantifiable_habits = cleaned_data["quantifiableHabits"]
        note_data = cleaned_data["dailyNoteData"]
        time_data = cleaned_data["timeData"]
        mood_data = cleaned_data["moodData"]
        journal_data = cleaned_data["journalData"]

        del cleaned_data["booleanHabits"]
        del cleaned_data["quantifiableHabits"]

        weekly_AI_summaries = data["weeklyAISummaries"]

        data_to_send = {
            "weekly_AI_summaries": weekly_AI_summaries,
            "note_data": note_data,
            "mood_data": mood_data,
        }

        claude_response = generate_monthly_mood_recap(data_to_send)
        mood_summary = claude_response.content[0].text

        pillars = fetch_pillars()

        data_to_give_gpt = {
            "successes": [note["success"] for note in note_data],
            "beBetters": [note["beBetter"] for note in note_data],
            "claude_summary": mood_summary
        }

        gpt_response = create_thoughts(data_to_give_gpt, pillars)

        data = {
            "id": None,
            "date": data["currentDate"],
            "type": "Mood Summary",
            "claude_summary": mood_summary,
            "gpt_summary": gpt_response
        }

        return jsonify({"message": "Data processed successfully", "mood_summary": data}), 200
    except Exception as e:
        logger.error(f"Error in monthly_summary: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/generate_journal', methods=['POST'])
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

        # Generate AI entry using Claude
        generated_entry = generate_journal_entry(journal_entries)
        logger.info(f'generated_entry: {generated_entry}')

        return jsonify({"message": "Journal entry generated successfully", "generated_entry": generated_entry}), 200
    except Exception as e:
        logger.error(f"Error in generate_journal: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/upload_sqlite', methods=['POST'])
def upload_sqlite():
    try:
        logger.info("Headers: %s", dict(request.headers))
        logger.info("Files: %s", request.files)
        logger.info("Form: %s", request.form)
        logger.info("Data length: %d", len(request.data) if request.data else 0)
        
        os.makedirs(DB_DIRECTORY, exist_ok=True)
        
        if 'file' not in request.files:
            logger.error("No file part in the request")
            logger.error("Available files: %s", list(request.files.keys()))
            return jsonify({"error": "No file part in the request"}), 400
            
        file = request.files['file']
        logger.info("Received file: %s", file.filename)
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        file.save(DB_PATH)
        logger.info("Database saved to: %s", DB_PATH)
        return jsonify({"message": "SQLite database uploaded successfully"}), 200
        
    except Exception as e:
        logger.error("Error in upload_sqlite: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500
    
@app.route('/upload_json', methods=['POST'])
def upload_json():
    try:
        logger.info("Headers: %s", dict(request.headers))
        logger.info("Files: %s", request.files)
        
        if 'file' not in request.files:
            logger.error("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400
            
        file = request.files['file']
        logger.info("Received file: %s", file.filename)
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        # Save JSON file in the database directory
        json_path = os.path.join(DB_DIRECTORY, 'database_backup.json')
        file.save(json_path)
        logger.info("JSON backup saved to: %s", json_path)
        return jsonify({"message": "JSON backup uploaded successfully"}), 200
        
    except Exception as e:
        logger.error("Error in upload_json: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/download_db', methods=['GET'])
def download_db():
    try:
        if not os.path.exists(DB_PATH):
            logger.error(f"Database file not found at {DB_PATH}")
            return jsonify({"error": "Database file not found"}), 404
            
        return send_file(
            DB_PATH,
            mimetype='application/octet-stream',
            as_attachment=True,
            download_name=DB_FILENAME  # Updated from attachment_filename
        )
    except Exception as e:
        logger.error(f"Error in download_db: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)


