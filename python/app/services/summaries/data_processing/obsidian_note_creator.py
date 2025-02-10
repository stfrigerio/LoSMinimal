import datetime
import os
from pathlib import Path


PERIODIC_NOTES_PATH = '/home/stefano/Github/LoSMinimal/Lossidian/06 Periodic Notes'
Path(PERIODIC_NOTES_PATH).mkdir(parents=True, exist_ok=True)

def create_periodic_note(date):    
    # Compute the start and end dates of the ISO week (Monday to Sunday)
    # Python's weekday() returns 0 for Monday
    start_date = date - datetime.timedelta(days=date.weekday())
    end_date = start_date + datetime.timedelta(days=6)
    
    # Get the ISO year and week number (ISO week might not match the calendar year)
    iso_year, iso_week, _ = date.isocalendar()
    current_period = f"{iso_year}-W{iso_week:02d}"
    
    # Format dates as strings "YYYY-MM-DD"
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
    
    # Build the note content
    note_content = f"""---
currentPeriod: {current_period}
startDate: {start_date_str}
endDate: {end_date_str}
---

# {current_period}

## Objectives

```sql
table: Objectives
columns: objective, completed
filterColumn: period
filterValue: {current_period}
```

## Habits

>[!Summary]- Habit Chart
>```sql-chart
>table: QuantifiableHabits
>chartType: line
>xColumn: date
>yColumns: value
>categoryColumn: habitKey
>dateColumn: date
>startDate: {start_date_str}
>endDate: {end_date_str}
>
>chartOptions: {{
>  fill: false,
>  tension: 0.5,
>  pointRadius: 4,
>  showLegend: true,
>  animations: true,
>  yAxisMin: 0,
>  yAxisMax: 14
>}}
>```

## Money

>[!success]- Money Chart
>```sql-chart
>table: Money
>chartType: pie
>
>categoryColumn: tag
>valueColumn: amount
>
>dateColumn: date
>startDate: {start_date_str}
>endDate: {end_date_str}
>
>chartOptions: {{
>  showLegend: true,
>  isDoughnut: true
>}}

## Time

>[!question]- Time Chart
>```sql-chart
>table: Time
>chartType: pie
>
categoryColumn: tag
valueColumn: duration
>
>dateColumn: date
>startDate: {start_date_str}
>endDate: {end_date_str}
>
>chartOptions: {{
>  showLegend: true,
>  isDoughnut: false
>}}
>```

## Sleep

## Summaries

>[!cite]- Claude
>```sql
>table: GPT
>filterColumn: date
>filterValue: {current_period}
>columns: summary
>```

## Text Inputs

### Successes

```sql
table: Text
filterColumn: period, key
filterValue: {current_period}, success
columns: text
```

### Improvemets

```sql
table: Text
filterColumn: period, key
filterValue: {current_period}, beBetter
columns: text
```

### Thoughts

```sql
table: Text
filterColumn: period, key
filterValue: {current_period}, think
columns: text
```

"""
    
    # Create the file name based on the current period (e.g., "2025-W03.md")
    file_name = f"{current_period}.md"
    file_path = os.path.join(PERIODIC_NOTES_PATH, file_name)

    print(f"Creating periodic note: {file_path}")

    # Write the content to the file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(note_content)


if __name__ == "__main__":
    create_periodic_note(date=datetime.date(2025, 2, 9))