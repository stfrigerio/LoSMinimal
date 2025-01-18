from flask import Blueprint, jsonify, request, send_file
import os
from werkzeug.utils import secure_filename
from app.config import PROJECTS_PATH

project_routes = Blueprint('project_routes', __name__)

@project_routes.route('/upload_projects', methods=['POST'])
def upload_projects():
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'message': 'No files provided'}), 400

        files = request.files.getlist('files')
        saved_files = []

        # Clear existing files in upload folder
        for existing_file in os.listdir(PROJECTS_PATH):
            file_path = os.path.join(PROJECTS_PATH, existing_file)
            if os.path.isfile(file_path):
                os.remove(file_path)

        # Save new files
        for file in files:
            if file.filename.endswith('.md'):
                filename = secure_filename(file.filename)
                file_path = os.path.join(PROJECTS_PATH, filename)
                file.save(file_path)
                saved_files.append(filename)

        return jsonify({
            'success': True,
            'message': f'Successfully uploaded {len(saved_files)} projects',
            'files': saved_files
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Upload failed: {str(e)}'
        }), 500

@project_routes.route('/download_projects', methods=['GET'])
def download_projects():
    try:
        projects = []
        
        # Read all markdown files from the upload folder
        for filename in os.listdir(PROJECTS_PATH):
            if filename.endswith('.md'):
                file_path = os.path.join(PROJECTS_PATH, filename)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract ID from filename (removing .md extension)
                project_id = filename.replace('.md', '')
                
                # Add title from content if possible (parse from markdown frontmatter)
                title = "Untitled Project"
                try:
                    # Simple frontmatter parsing
                    if '---' in content:
                        frontmatter = content.split('---')[1]
                        if 'title:' in frontmatter:
                            title = frontmatter.split('title:')[1].split('\n')[0].strip()
                except:
                    pass

                projects.append({
                    'id': project_id,
                    'title': title,
                    'markdown': content  # Changed from 'content' to 'markdown' to match Project type
                })

        print(f"Sending {len(projects)} projects with data: {projects}")  # Debug log
        return jsonify(projects)

    except Exception as e:
        print(f"Error in download_projects: {str(e)}")  # Debug log
        return jsonify({
            'success': False,
            'message': f'Download failed: {str(e)}'
        }), 500