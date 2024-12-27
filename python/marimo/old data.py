import marimo

__generated_with = "0.10.5"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    import pandas as pd

    from database_connection import DatabaseManager

    db = DatabaseManager()
    db.connect()
    old_daily = pd.read_csv('daily-notes-2023.csv')
    tables = db.get_tables()

    rename_mapping = {
        "Unnamed: 0": None,  # Drop this column as it's unnecessary
        "morning_comment": "morningComment",
        "wake_hour": "wakeHour",
        "be_better": "beBetter",
        "day_rating": "dayRating",
        "sleep_time": "sleepTime",
        "created_at": "createdAt",
        "updated_at": "updatedAt",
    }

    old_daily = old_daily.drop(columns=['Unnamed: 0', 'id', 'uuid'])
    old_daily = old_daily.rename(columns=rename_mapping)
    return DatabaseManager, db, mo, old_daily, pd, rename_mapping, tables


@app.cell
def _(db, old_daily):
    # Get the first row as a dictionary
    single_row = old_daily.iloc[0].to_dict()

    # Upsert the single row
    result = db.bulk_upsert('DailyNotes', old_daily)
    result
    return result, single_row


@app.cell
def _(pd):
    old_quantifiables = pd.read_csv('quantifiables-2023.csv')

    rename_mapping_2 = {
        'habit_key': 'habitKey',
        "created_at": "createdAt",
        "updated_at": "updatedAt"
    }

    old_quantifiables = old_quantifiables.drop(columns=['Unnamed: 0', 'id', 'uuid'])
    old_quantifiables = old_quantifiables.rename(columns=rename_mapping_2)
    return old_quantifiables, rename_mapping_2


@app.cell
def _(db, old_quantifiables):
    old_quantifiables

    result2 = db.bulk_upsert('QuantifiableHabits', old_quantifiables)
    result2
    return (result2,)


@app.cell
def _(pd):
    old_time = pd.read_csv('time-2022-2024.csv')

    old_time = old_time.drop(columns=['Unnamed: 0', 'id', 'uuid'])

    rename_mapping_3 = {
        'start_time': 'startTime',
        'end_time': 'endTime',
        'created_at': 'createdAt',
        'updated_at': 'updatedAt'
    }

    old_time = old_time.rename(columns=rename_mapping_3)

    # Define default date
    DEFAULT_DATE = '1970-01-01 00:00:00.000Z'

    # Fill null values in startTime and endTime
    old_time['startTime'] = old_time['startTime'].fillna(DEFAULT_DATE)
    old_time['endTime'] = old_time['endTime'].fillna(DEFAULT_DATE)
    return DEFAULT_DATE, old_time, rename_mapping_3


@app.cell
def _(old_time):
    old_time
    return


@app.cell
def _(db, old_time):

    result3 = db.bulk_upsert('Time', old_time)
    result3
    return (result3,)


if __name__ == "__main__":
    app.run()
