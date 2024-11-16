from flask import Flask, jsonify
from flask_cors import CORS
from app.routes import summary_routes, journal_routes, database_routes, music_routes

def create_app():
    app = Flask(__name__)

    # Configure upload settings (set to 10MB for testing)
    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

    # Enable CORS
    CORS(app)

    @app.route('/config')
    def config_route():
        return jsonify({"MAX_CONTENT_LENGTH": app.config.get('MAX_CONTENT_LENGTH')})
    
    # Register blueprints
    app.register_blueprint(summary_routes.bp)
    app.register_blueprint(journal_routes.bp)
    app.register_blueprint(database_routes.bp)
    app.register_blueprint(music_routes.music_bp)

    return app