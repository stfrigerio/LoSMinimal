import json

def create_thoughts(client, model, data, pillars):    
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