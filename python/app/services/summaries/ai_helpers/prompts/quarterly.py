
def generate_quarterly_mood_recap(client, model, PERSON_NAME, INTERESTS, mood_data):
    original_prompt = f"""
Here is the summary of the daily notes and mood data for the quarter, also included are the monthly summaries for the quarter:
<data>
{mood_data}
</data>

Please carefully analyze this data. Based on your analysis, write a thoughtful <reflection> with the following sections:

- 'Nice' (A nice verbose summary of what went well in all areas)
- 'Not so nice' (A nice verbose summary of what didn't go so well in all areas)
    
Always address the user directly in second person.
"""

    mood_user_message = original_prompt

    message = client.messages.create(
        model=model,
        max_tokens=3000,
        temperature=0.5,
        system=f"You are an assistant tasked with analyzing and reflecting on {PERSON_NAME}'s data. He likes {INTERESTS} so keep that in mind when reflecting.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": mood_user_message
                    }
                ]
            }
        ]
    )

    return message