import os
from dotenv import load_dotenv
import anthropic
import openai

from .prompts.weekly import generate_mood_recap
from .prompts.monthly import generate_monthly_mood_recap, generate_monthly_mood_recap_v2
from .prompts.quarterly import generate_quarterly_mood_recap
from .prompts.yearly import generate_yearly_mood_recap
from .prompts.journal import generate_journal_entry
from .prompts.create_thoughts import create_thoughts

if not load_dotenv('./.env'):
    # Try alternative paths
    alt_paths = [
        '../.env',
        '../../.env',
        '../../../.env',
        '../../../../.env',
        os.path.join(os.path.dirname(__file__), '../../../../.env')
    ]
    
    for path in alt_paths:
        if load_dotenv(path):
            break
    else:  # This runs if no break occurred in the for loop
        raise RuntimeError("Could not find .env file in any of the expected locations")

PERSON_NAME = "Stefano"
LANGUAGE = "English"
INTERESTS = "philosophy, technology and neuroscience"
EMBED_MODEL = "text-embedding-ada-002"

class Claude:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY"),
        )
        self.model = "claude-3-5-sonnet-20240620"

    def generate_weekly_summary(self, mood_data):
        return generate_mood_recap(self.client, self.model, PERSON_NAME, INTERESTS, mood_data)
    
    def generate_monthly_summary(self, mood_data):
        return generate_monthly_mood_recap(self.client, self.model, PERSON_NAME, INTERESTS, mood_data)
    
    def generate_quarterly_summary(self, mood_data):
        return generate_quarterly_mood_recap(self.client, self.model, PERSON_NAME, INTERESTS, mood_data)

    def generate_yearly_summary(self, mood_data):
        return generate_yearly_mood_recap(self.client, self.model, PERSON_NAME, INTERESTS, mood_data)
    
    def generate_journal_entry(self, journal_entries):
        return generate_journal_entry(self.client, self.model, PERSON_NAME, INTERESTS, LANGUAGE, journal_entries)

class GPT:
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        self.model = "gpt-4o"

    def create_thoughts(self, data, pillars):
        return create_thoughts(self.client, self.model, data, pillars)