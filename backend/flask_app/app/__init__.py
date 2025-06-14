from flask import Flask
from .routes import api
from .config import Config
from .db import close_connection

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Blueprint registration
    app.register_blueprint(api, url_prefix='/api')

    app.teardown_appcontext(close_connection)

    return app