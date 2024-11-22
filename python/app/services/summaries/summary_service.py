from datetime import datetime
from app.services.summaries.data_processing.data_cleaning import clean_data
from app.services.route_services.fetch_pillars import fetch_pillars
from app.services.summaries.ai_helpers.claude import generate_mood_recap, generate_monthly_mood_recap
from app.services.summaries.ai_helpers.gpt import create_thoughts

def get_week_number(date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    week_number = date_obj.isocalendar()[1]
    year = date_obj.isocalendar()[0]
    return f"{year}-W{week_number}"

def process_weekly_summary(data):
    cleaned_data = clean_data(data)
    
    note_data = cleaned_data["dailyNoteData"]
    mood_data = cleaned_data["moodData"]
    
    most_recent_date = max(mood_entry['date'].split('T')[0] for mood_entry in mood_data)
    week_date = get_week_number(most_recent_date)
    
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
    
    return {
        "id": None,
        "date": week_date,
        "type": "Mood Summary",
        "claude_summary": mood_summary,
        "gpt_summary": gpt_response
    }

def process_monthly_summary(data):
    cleaned_data = clean_data(data)
    
    note_data = cleaned_data["dailyNoteData"]
    mood_data = cleaned_data["moodData"]
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
    
    return {
        "id": None,
        "date": data["currentDate"],
        "type": "Mood Summary",
        "claude_summary": mood_summary,
        "gpt_summary": gpt_response
    } 