import pandas as pd
from database_connection import DatabaseManager

class DataProcessing:
    def __init__(self):
        self.db = DatabaseManager()
        self.db.connect()
        self.tables = self.db.get_tables()

    def merge_quantifiable_habits(self):
        quantifiable_pivot = self.tables.QuantifiableHabits.pivot_table(
            index="date",
            columns="habitKey",
            values="value",
            aggfunc="first"
        ).reset_index()

        merged_df = pd.merge(
            self.tables.DailyNotes,
            quantifiable_pivot,
            on="date",
            how="left"  # Left join to retain all dates from DailyNotes
        )
        
        return merged_df
    
    def merge_boolean_habits(self, quantifiable_df):
        boolean_pivot = self.tables.BooleanHabits.pivot_table(
            index="date",
            columns="habitKey",
            values="value",
            aggfunc="first"
        ).reset_index()

        merged_df = pd.merge(
            quantifiable_df,
            boolean_pivot,
            on="date",
            how="left"
        )

        return merged_df    
    
    def merge_time_data(self, merged_df):
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

        time_table_df = self.tables.Time
        time_table_df["time_spent_seconds"] = time_table_df["duration"].apply(time_to_seconds)

        aggregated_df = (
            time_table_df.groupby(["date", "tag"])["time_spent_seconds"]
            .sum()
            .reset_index()
        )

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

        daily_time_df = pd.merge(merged_df, time_breakdown, on="date", how="left")

        return daily_time_df
    
    def merge_mood_data(self, merged_df):
        def create_mood_data(group):
            mood_dict = {}
            for i, row in enumerate(group.itertuples(), 1):
                mood_dict[f"mood_{i}"] = {
                    "tag": row.tag,
                    "rating": row.rating,
                    "comment": row.comment
                }
            return mood_dict

        mood_df = self.tables.Mood
        mood_df["date"] = mood_df["date"].str.split("T").str[0]

        # Group moods by date and create the `mood_data` structure
        mood_summary = (
            mood_df.groupby("date", group_keys=False)
            .apply(create_mood_data)
            .reset_index(name="mood_data")
        )

        daily_mood_df = pd.merge(merged_df, mood_summary, on="date", how="left")

        return daily_mood_df
    
    def merge_task_data(self, merged_df):
        def create_task_data(group):
            task_dict = {}
            for i, row in enumerate(group.itertuples(), 1):
                task_dict[f"task_{i}"] = {
                    "title": row.text,
                    "completed": row.completed,
                    "description": row.description if hasattr(row, 'description') else None
                }
            return task_dict

        tasks_df = self.tables.Tasks
        
        # Ensure merged_df date is datetime
        merged_df['date'] = pd.to_datetime(merged_df['date'])
        
        # Convert tasks dates to datetime
        tasks_df["date"] = pd.to_datetime(tasks_df["due"].str.split("T").str[0])

        # Group tasks by date and create the task_data structure
        task_summary = (
            tasks_df.groupby("date", group_keys=False)
            .apply(create_task_data)
            .reset_index(name="task_data")
        )
        
        # Ensure task_summary date is datetime
        task_summary['date'] = pd.to_datetime(task_summary['date'])

        # Merge with the existing DataFrame
        daily_time_mood_task_df = pd.merge(
            merged_df, 
            task_summary, 
            on="date", 
            how="left"
        )

        return daily_time_mood_task_df


