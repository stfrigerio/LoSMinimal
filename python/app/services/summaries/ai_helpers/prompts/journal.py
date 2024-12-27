def generate_journal_entry(client, model, PERSON_NAME, INTERESTS, LANGUAGE, journal_entries):
    try:
        
        # Combine all journal entries into a single string
        all_entries = "\n\n".join([f"Date: {entry['date']}\nEntry: {entry['text']}" for entry in journal_entries])
        
        prompt = f"""As an AI assistant, your task is to analyze and reflect on {PERSON_NAME}'s journal entries from a specific period. Here are all the entries:

{'-' * 40}
{all_entries}
{'-' * 40}

Based on these entries, please provide an AI-generated recap and reflection. Your response should include:

1. A comprehensive summary of the main themes, events, and emotions expressed across all of {PERSON_NAME}'s journal entries.
2. Your perspective on {PERSON_NAME}'s reflections over this period, including potential insights, patterns, or developments that {PERSON_NAME} might not have noticed.
3. Thoughtful questions or suggestions that might help {PERSON_NAME} gain deeper insights into their experiences and thoughts during this time.
4. If relevant, incorporate {PERSON_NAME}'s interests in {INTERESTS} into your analysis, but only if it naturally fits the context of the journal entries.
5. Any observations on how {PERSON_NAME}'s thoughts or feelings might have evolved over the period covered by these entries.

Remember, this is an YOUR reflection, not {PERSON_NAME}'s direct words.

Write your response in {LANGUAGE}."""

        # Make the API call to Claude
        message = client.messages.create(
            model=model,
            max_tokens=2000,
            temperature=0.7,
            system="You are an AI assistant tasked with analyzing and reflecting on a series of personal journal entries.",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract and return the generated entry
        return message.content[0].text

    except Exception as e:
        print(f"Error in generate_journal_entry: {str(e)}")
        return f"An error occurred while generating the AI reflection: {str(e)}"