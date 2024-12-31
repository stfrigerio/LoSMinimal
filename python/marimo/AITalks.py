import marimo

__generated_with = "0.10.5"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from database_connection import DatabaseManager
    from data_processing import DataProcessing
    import pandas as pd
    import os
    import sys

    project_root = os.path.abspath(os.path.join(os.getcwd(), "../"))
    sys.path.insert(0, project_root)
    return DataProcessing, DatabaseManager, mo, os, pd, project_root, sys


@app.cell
def _():
    from app.services.summaries.ai_helpers import GPT, Claude
    from app.services.summaries.data_processing.data_cleaning import clean_data
    return Claude, GPT, clean_data


@app.cell
def _(DataProcessing, DatabaseManager):
    db = DatabaseManager()
    dp = DataProcessing()
    db.connect()
    tables = db.get_tables()
    print(list(vars(tables).keys()))
    return db, dp, tables


@app.cell
def _(tables):
    tables.GPT.loc[tables.GPT['date'] == '2024-11']
    return


@app.cell
def _(pd, tables):
    df = tables.GPT

    # Convert the week strings to datetime objects
    def iso_week_to_date(week_str):
        try:
            if '-W' in week_str:
                year, week = week_str.split('-W')
                return pd.to_datetime(f"{year}-01-01") + pd.Timedelta(weeks=int(week)-1)
            else:
                # For non-week format dates, just return as is
                return pd.to_datetime(week_str)
        except:
            # Return NaT (Not a Time) for any parsing errors
            return pd.NaT

    # Apply the conversion
    df['week_date'] = df['date'].apply(iso_week_to_date)

    # Let's see what we're working with
    print("Unique date formats in the dataset:")
    print(df['date'].unique())

    # Filter for December
    december_summaries = df[
        (df['week_date'].dt.month == 12) &
        (df['type'] == 'Mood Summary')
    ].sort_values('week_date')
    return december_summaries, df, iso_week_to_date


@app.cell
def _(pd, tables):
    mood_df = tables.Mood
    mood_df['date'] = pd.to_datetime(mood_df['date'])
    december_moods = mood_df.loc[mood_df['date'].dt.month == 12]
    return december_moods, mood_df


@app.cell
def _(pd, tables):
    df_days = tables.DailyNotes
    df_days['date'] = pd.to_datetime(df_days['date'])

    december_days = df_days.loc[(df_days['date'].dt.month == 12) & (df_days['date'].dt.year == 2024)]
    return december_days, df_days


@app.cell
def _(december_days, december_moods):
    data_to_send = {
        'dailyNoteData': december_days.astype(str).to_dict('records'),
        'moodData': december_moods.astype(str).to_dict('records'),
        'currentDate': '2024-12'
    }
    return (data_to_send,)


@app.cell
def _(clean_data, data_to_send):
    cleaned_data = clean_data(data_to_send)

    cleaned_data
    return (cleaned_data,)


@app.cell
def _():
    import requests
    import json

    # Assuming your API is running locally on port 5000
    BASE_URL = "http://localhost:5050"

    # Sample data structure for weekly summary

    # Function to call any summary endpoint
    def get_summary(summary_type, data):
        """
        summary_type: 'weekly', 'monthly', 'quarterly', or 'yearly'
        data: dictionary containing the required data
        """
        endpoint = f"/{summary_type}_summary"

        try:
            response = requests.post(
                f"{BASE_URL}{endpoint}",
                json=data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error calling API: {e}")
            return None
    return BASE_URL, get_summary, json, requests


@app.cell
def _(cleaned_data, december_summaries):
    data_for_claude = {
            "weeklyAISummaries": december_summaries.astype(str).to_dict('records'),
            "note_data": cleaned_data["dailyNoteData"],
            "mood_data": cleaned_data["moodData"],
            "currentDate": '2024-12'
    }

    data_for_claude
    return (data_for_claude,)


@app.cell
def _(data_for_claude, get_summary):
    summary = get_summary('monthly', data_for_claude)
    summary
    return (summary,)


if __name__ == "__main__":
    app.run()
