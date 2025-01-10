import marimo

__generated_with = "0.10.5"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    from database_connection import DatabaseManager
    import pandas as pd
    return DatabaseManager, mo, pd


@app.cell
def _():
    import re

    def transform_to_markdown(content):
        # Split content into lines
        lines = content.split('\n')
        
        markdown_content = []
        current_chapter = ""
        
        for line in lines:
            # Skip empty lines and metadata lines
            if not line.strip() or line.startswith('- Data:') or line.startswith('- Colore:') or line.startswith('- Avanzamento:'):
                continue
                
            # Handle chapter headers
            if line.startswith('# Chapter'):
                current_chapter = line
                markdown_content.append(f"\n{line}\n")
            # Handle quotes
            elif line.startswith('>'):
                markdown_content.append(f"\n{line}\n")
            # Handle horizontal rules
            elif line.startswith('---'):
                markdown_content.append(line + '\n')
            # Handle title (first line)
            elif 'Starting Somewhere:' in line:
                markdown_content.append(f"{line}\n\n")
                
        # Join all lines and clean up multiple newlines
        result = re.sub(r'\n{3,}', '\n\n', '\n'.join(markdown_content))
        return result

    file_path = r"/home/stefano/Github/LoSMinimal/bookLibrary/Starting Somewhere, Community Organizing for Socially Awkward People Who've Had Enough.txt"
    with open(file_path, 'r') as file:
        content = file.read()
        
    markdown_content = transform_to_markdown(content)

    # Write the transformed content
    with open('output.md', 'w', encoding='utf-8') as file:
        file.write(markdown_content)
    return (
        content,
        file,
        file_path,
        markdown_content,
        re,
        transform_to_markdown,
    )


if __name__ == "__main__":
    app.run()
