def generate_monthly_mood_recap(client, model, PERSON_NAME, INTERESTS, mood_data):
    original_prompt = f"""
Here is the summary of the daily notes and mood data for the month, also included are the weekly summaries for the month:
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


def generate_monthly_mood_recap_v2(client, model, PERSON_NAME, INTERESTS, mood_data):
    original_prompt = f"""
As a thoughtful mentor and confidant, analyze {PERSON_NAME}'s month through their daily notes, mood data, and weekly summaries:
<data>
{mood_data}
</data>

Write a deep, personal reflection that weaves together the key themes and patterns observed. Your response should feel like an intimate letter that explores:

The Emotional Journey
- How have emotions evolved throughout the month? Look for deeper patterns and what they reveal about {PERSON_NAME}'s inner state.
- Connect the dots between different experiences - how do they influence each other?
- What underlying themes or recurring thoughts seem to be driving their experiences?

Growth and Challenges
- What meaningful progress or insights emerged this month?
- Which challenges keep resurfacing, and what might they be trying to teach {PERSON_NAME}?
- How are their current experiences shaping their path forward?

Looking Forward
- Based on these observations, what wisdom or guidance would be most meaningful?
- What subtle shifts or adjustments could create positive ripple effects?
- Which strengths could they lean into more?

Write in a warm, personal tone that shows deep understanding of {PERSON_NAME}'s context, including their interests in {INTERESTS}. Focus on crafting a cohesive narrative that helps them see the deeper meaning in their experiences, rather than just listing observations.
"""
    
    mood_user_message = original_prompt

    message = client.messages.create(
        model=model,
        max_tokens=3000,
        temperature=0.5,
        system=f"You are an assistant tasked with analyzing and reflecting on {PERSON_NAME}'s data.",
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