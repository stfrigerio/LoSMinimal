from flask import Flask, jsonify
from flask_cors import CORS
from app.routes import (
    summary_routes, 
    journal_routes, 
    database_routes, 
    music_routes, 
    book_routes, 
    project_routes
)

def create_app():
    app = Flask(__name__)

    # Configure upload settings (set to 10MB for testing)
    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

    # Enable CORS
    CORS(app)

    @app.route('/config')
    def config_route():
        return jsonify({"MAX_CONTENT_LENGTH": app.config.get('MAX_CONTENT_LENGTH')})
    
    @app.route('/status')
    def status_route():
        return jsonify({"status": "online", "message": "Project sync server is running"})
    
    # Register blueprints
    app.register_blueprint(summary_routes.bp)
    app.register_blueprint(journal_routes.bp)
    app.register_blueprint(database_routes.bp)
    app.register_blueprint(book_routes.book_bp, url_prefix='/book')
    app.register_blueprint(music_routes.music_bp, url_prefix='/music')
    app.register_blueprint(project_routes.project_routes, url_prefix='/project')

    return app