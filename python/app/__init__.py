from flask import Flask
from app.routes import summary_routes, journal_routes, database_routes

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(summary_routes.bp)
    app.register_blueprint(journal_routes.bp)
    app.register_blueprint(database_routes.bp)
    
    return app 