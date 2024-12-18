import marimo

__generated_with = "0.10.5"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from database_connection import DatabaseManager
    import pandas as pd

    db = DatabaseManager()
    db.connect()
    tables = db.get_tables()
    print(list(vars(tables).keys()))
    return DatabaseManager, db, mo, pd, tables


@app.cell
def _(pd, tables):
    # merge daily notes with their respective habits

    # Step 1: Pivot habits to create dynamic columns for each habitKey
    boolean_pivot = tables.BooleanHabits.pivot_table(
        index="date",  # Use date as the index
        columns="habitKey",  # Make each habitKey a column
        values="value",  # Use the value for the column data
        aggfunc="first"  # Take the first value (if duplicates exist for the same date and habitKey)
    ).reset_index()

    quantifiable_pivot = tables.QuantifiableHabits.pivot_table(
        index="date",
        columns="habitKey",
        values="value",
        aggfunc="first"
    ).reset_index()

    # Step 2: Merge pivoted habits with DailyNotes
    intermediate_df = pd.merge(
        tables.DailyNotes,
        boolean_pivot,
        on="date",
        how="left"  # Left join to retain all dates from DailyNotes
    )

    result_df = pd.merge(
        intermediate_df,
        quantifiable_pivot,
        on="date",
        how="left"
    )

    # Fill missing values with null (or NaN, which Pandas uses for missing data)
    # result_df = result_df.fillna(value=None)

    result_df_next = result_df
    merged_daily = result_df_next[["date", "morningComment", "energy", "wakeHour", "success", "beBetter", "dayRating", "sleepTime", "Denti", "Meditate", "Sex", "Alcohols", "Cigarettes", "Coffees", "Herbs"]]

    return (
        boolean_pivot,
        intermediate_df,
        merged_daily,
        quantifiable_pivot,
        result_df,
        result_df_next,
    )


@app.cell
def _(mo, tables):
    mo.ui.dataframe(tables.Time)
    return


@app.cell
def _(merged_daily, pd, tables):
    # create a time breakdown for every single day and merge it to the df

    def time_to_seconds(time_str):
        try:
            # Ignore fractions of a second by splitting at the dot
            if '.' in time_str:
                time_str = time_str.split('.')[0]  # Keep only the part before the dot
            
            # Handle `hh:mm:ss` format
            h, m, s = map(int, time_str.split(':'))
            return h * 3600 + m * 60 + s
        except ValueError:
            print(f"Invalid time format: {time_str}")
            return 0  # Return 0 or another default value for invalid formats


    time_table_df = tables.Time

    time_table_df["time_spent_seconds"] = time_table_df["duration"].apply(time_to_seconds)

    # Step 2: Aggregate total time spent per activity per day
    aggregated_df = (
        time_table_df.groupby(["date", "tag"])["time_spent_seconds"]
        .sum()
        .reset_index()
    )

    # Step 3: Calculate total time spent per day
    total_time_per_day = (
        aggregated_df.groupby("date")["time_spent_seconds"]
        .sum()
        .reset_index()
        .rename(columns={"time_spent_seconds": "total_time_seconds"})
    )

    # Merge to get total time in the same DataFrame
    aggregated_df = pd.merge(aggregated_df, total_time_per_day, on="date")

    # Calculate percentage for each activity
    aggregated_df["percentage"] = (
        round(aggregated_df["time_spent_seconds"] / aggregated_df["total_time_seconds"] * 100, 2)
    )

    # Create the time breakdown as a dictionary for each day
    time_breakdown = (
        aggregated_df.groupby("date")[["tag", "percentage"]]
        .apply(lambda x: dict(zip(x["tag"], x["percentage"])))
        .reset_index(name="time_breakdown")
    )

    daily_time_df = pd.merge(merged_daily, time_breakdown, on="date", how="left")

    return (
        aggregated_df,
        daily_time_df,
        time_breakdown,
        time_table_df,
        time_to_seconds,
        total_time_per_day,
    )


@app.cell
def _():



    return


@app.cell
def _(daily_time_df, pd, tables):
    mood_df = tables.Mood

    def create_mood_data(group):
        mood_dict = {}
        for i, row in enumerate(group.itertuples(), 1):
            mood_dict[f"mood_{i}"] = {
                "tag": row.tag,
                "rating": row.rating,
                "comment": row.comment
            }
        return mood_dict

    mood_df["date"] = mood_df["date"].str.split("T").str[0]

    # Group moods by date and create the `mood_data` structure
    mood_summary = (
        mood_df.groupby("date", group_keys=False)
        .apply(create_mood_data)
        .reset_index(name="mood_data")
    )

    daily_time_mood_df = pd.merge(daily_time_df, mood_summary, on="date", how="left")
    return create_mood_data, daily_time_mood_df, mood_df, mood_summary


@app.cell
def _(mo):
    # Step 1: Create a date range picker
    date_range_picker = mo.ui.date_range(
        start="2024-01-01",  # Earliest date
        stop="2024-04-10",   # Latest date
        value=("2024-01-01", "2024-04-10"),  # Initial range
        label="Select Date Range"  # Label for the picker
    )

    # Display the date range picker
    date_range_picker

    return (date_range_picker,)


@app.cell
def _(daily_time_mood_df, date_range_picker, pd):
    # Function to filter the DataFrame based on selected date range
    def filter_dataframe_by_date(df, date_range_picker):
        # Convert string dates from picker to Timestamps
        start_date, end_date = map(pd.to_datetime, date_range_picker.value)
        # Filter the DataFrame
        return df[(df["date"] >= start_date) & (df["date"] <= end_date)]

    daily_time_mood_df["date"] = pd.to_datetime(daily_time_mood_df["date"])

    # Apply the filter
    filtered_days = filter_dataframe_by_date(daily_time_mood_df, date_range_picker)

    # Display the filtered DataFrame
    filtered_days

    return filter_dataframe_by_date, filtered_days


@app.cell
def _(tables):
    tables.Text
    return


if __name__ == "__main__":
    app.run()
