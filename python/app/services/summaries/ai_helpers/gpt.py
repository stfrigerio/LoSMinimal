import json
import os
import openai
from dotenv import load_dotenv
from logger import logger

load_dotenv('./.env')

EMBED_MODEL = "text-embedding-ada-002"
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Define the variables
PERSON_NAME = "Stefano"
language = "English"
interests = "philosophy, technology and neuroscience"

def generate_mood_recap(mood_data):    
    system_message = f"""
Here is the summary of the daily notes and mood data for the week:
<data>
{mood_data}
</data>

Please carefully analyze this data. Based on your analysis, write a thoughtful <reflection> with the following sections:

- 'Nice' (A nice verbose summary of what went well in all areas)
- 'Not so nice' (A nice verbose summary of what didn't go so well in all areas)

After the reflection, please add a <questions_to_ponder> section with 4 insightful questions the person could ask themselves to further reflect on their habits progress and challenges, based solely on the provided data. Single questions and please smart questions that a behavioural psychologist would ask.
    
Please begin your response with the <reflection> and end with the <questions_to_ponder>. Always address the user directly in second person.
"""

    user_message = f"You are an assistant tasked with analyzing and reflecting on {PERSON_NAME}'s data. He likes {interests} so keep that in mind when reflecting."

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.8,
        )

        answer = json.loads(response.choices[0].message.content.strip()) 

        return answer

    except Exception as e:
        print(f"An error occurred: {e}")

def create_thoughts(data, pillars, model="gpt-4o"):    
    system_message = '''
You are an AI assistant with expertise in behavioral psychology and neuroscience. Your task is to analyze the user's data and provide insightful feedback.

You will be provided with a data structure containing:
1. The user's daily successes
2. Areas where the user feels they could improve (beBetters)
3. A summary created by another AI

Carefully analyze this data and return a JSON object with the following structure:

{
    "successes": [
        "A list of 3 significant successes the user had"
    ],
    "areas_for_improvement": [
        "A list of 3 areas where the user could improve, including actionable advice"
    ],
    "insights": [
        "A list of 3 insights about the user"
    ],
    "next_week_goals": [ 
        {
            "goal": "A goal based on the user's data and the pillars",
            "pillar_uuid": "uuid of the associated pillar",
            "pillar_name": "Name of the associated pillar",
            "pillar_emoji": "🔵"
        },
        {
            "goal": "A goal based on the user's data and the pillars",
            "pillar_uuid": "uuid of the associated pillar",
            "pillar_name": "Name of the associated pillar",
            "pillar_emoji": "🔵"
        },
        {
            "goal": "A goal based on the user's data and the pillars",
            "pillar_uuid": "uuid of the associated pillar",
            "pillar_name": "Name of the associated pillar",
            "pillar_emoji": "🔵"
        }
    ]
}

Ensure your analysis is empathetic and constructive.
'''
    
    user_message = f'''Please create the summary based on this data: {data}

The user's life pillars are:
{pillars}

Please use these pillars when creating the next_week_goals.'''

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.8,
            response_format={'type': "json_object"}
        )

        answer = json.loads(response.choices[0].message.content.strip()) 

        return answer

    except Exception as e:
        print(f"An error occurred: {e}")



