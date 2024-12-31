from datetime import datetime
from app.services.summaries.data_processing.data_cleaning import clean_data
from app.services.route_services.fetch_pillars import fetch_pillars
from app.services.summaries.ai_helpers import Claude, GPT

Claude = Claude()  # Create an instance of Claude
GPT = GPT()

def get_week_number(date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    week_number = date_obj.isocalendar()[1]
    year = date_obj.isocalendar()[0]
    return f"{year}-W{week_number}"

def process_weekly_summary(data):
    cleaned_data = clean_data(data)
    
    note_data = cleaned_data["dailyNoteData"]
    mood_data = cleaned_data["moodData"]

    week_date = data["currentDate"]
    
    data_to_send = {
        "note_data": note_data,
        "mood_data": mood_data,
    }
    
    claude_response = Claude.generate_weekly_summary(data_to_send)
    mood_summary = claude_response.content[0].text
    
    data_to_give_gpt = {
        "successes": [note["success"] for note in note_data],
        "beBetters": [note["beBetter"] for note in note_data],
        "claude_summary": mood_summary
    }
    
    pillars = fetch_pillars()
    gpt_response = GPT.create_thoughts(data_to_give_gpt, pillars)
    
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
    
    claude_response = Claude.generate_monthly_summary(data_to_send)
    mood_summary = claude_response.content[0].text
    
    pillars = fetch_pillars()
    
    data_to_give_gpt = {
        "successes": [note["success"] for note in note_data],
        "beBetters": [note["beBetter"] for note in note_data],
        "claude_summary": mood_summary
    }
    
    # gpt_response = GPT.create_thoughts(data_to_give_gpt, pillars)
    
    return {
        "id": None,
        "date": data["currentDate"],
        "type": "Mood Summary",
        "claude_summary": mood_summary,
        # "gpt_summary": gpt_response
    } 

def process_quarterly_summary(data):
    cleaned_data = clean_data(data)

    mood_data = cleaned_data["moodData"]
    monthly_AI_summaries = data["monthlyAISummaries"]

    data_to_send = {
        "monthly_AI_summaries": monthly_AI_summaries,
        "mood_data": mood_data,
    }

    claude_response = Claude.generate_quarterly_summary(data_to_send)
    mood_summary = claude_response.content[0].text

    pillars = fetch_pillars()

    data_to_give_gpt = {
        "mood_data": mood_data,
        "claude_summary": mood_summary
    }

    gpt_response = GPT.create_thoughts(data_to_give_gpt, pillars)

    return {
        "id": None,
        "date": data["currentDate"],
        "type": "Mood Summary",
        "claude_summary": mood_summary,
        "gpt_summary": gpt_response
    }

def process_yearly_summary(data):
    cleaned_data = clean_data(data)

    mood_data = cleaned_data["moodData"]
    quarterly_AI_summaries = data["quarterlyAISummaries"]   

    data_to_send = {
        "quarterly_AI_summaries": quarterly_AI_summaries,
        "mood_data": mood_data,
    }

    claude_response = Claude.generate_yearly_summary(data_to_send)
    mood_summary = claude_response.content[0].text

    pillars = fetch_pillars()

    data_to_give_gpt = {
        "mood_data": mood_data,
        "claude_summary": mood_summary
    }

    gpt_response = GPT.create_thoughts(data_to_give_gpt, pillars)

    return {
        "id": None,
        "date": data["currentDate"],
        "type": "Mood Summary",
        "claude_summary": mood_summary,
        "gpt_summary": gpt_response
    }
