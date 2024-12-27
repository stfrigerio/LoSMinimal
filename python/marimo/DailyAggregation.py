import marimo

__generated_with = "0.10.5"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from database_connection import DatabaseManager
    from data_processing import DataProcessing
    import pandas as pd

    db = DatabaseManager()
    dp = DataProcessing()
    db.connect()
    tables = db.get_tables()
    print(list(vars(tables).keys()))
    return DataProcessing, DatabaseManager, db, dp, mo, pd, tables


@app.cell
def _(dp):
    added_quantifiable = dp.merge_quantifiable_habits()
    added_boolean = dp.merge_boolean_habits(added_quantifiable)
    added_time = dp.merge_time_data(added_boolean)
    added_mood = dp.merge_mood_data(added_time)
    added_task = dp.merge_task_data(added_mood)

    daily_df = added_task[["date", "morningComment", "energy", "wakeHour", "success", "beBetter", "dayRating", "sleepTime", "Denti", "Meditate", "Sex", "Alcohols", "Cigarettes", "Coffees", "Herbs", "time_breakdown", "mood_data", "task_data"]]
    return (
        added_boolean,
        added_mood,
        added_quantifiable,
        added_task,
        added_time,
        daily_df,
    )


@app.cell
def _(mo, tables):
    mo.ui.dataframe(tables.Library)
    return


@app.cell
def _(mo):
    # Step 1: Create a date range picker
    date_range_picker = mo.ui.date_range(
        start="2024-01-01",  # Earliest date
        stop="2024-12-31",   # Latest date
        value=("2024-01-01", "2024-12-10"),  # Initial range
        label="Select Date Range"  # Label for the picker
    )

    # Display the date range picker
    date_range_picker
    return (date_range_picker,)


@app.cell
def _(daily_df, date_range_picker, pd):
    # Function to filter the DataFrame based on selected date range
    def filter_dataframe_by_date(df, date_range_picker):
        # Convert string dates from picker to Timestamps
        start_date, end_date = map(pd.to_datetime, date_range_picker.value)
        # Filter the DataFrame
        return df[(df["date"] >= start_date) & (df["date"] <= end_date)]

    daily_df["date"] = pd.to_datetime(daily_df["date"])

    # Apply the filter
    filtered_days = filter_dataframe_by_date(daily_df, date_range_picker)

    # Display the filtered DataFrame
    filtered_days
    return filter_dataframe_by_date, filtered_days


if __name__ == "__main__":
    app.run()
