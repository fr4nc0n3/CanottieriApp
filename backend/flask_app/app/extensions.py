from flask import current_app, g
from flask.app import Flask
from flask_sqlalchemy import SQLAlchemy

from backend.flask_app.app.models_sqlalchemy import Base

DB = SQLAlchemy(model_class=Base)

def initSQLAlchemyDatabase(app: Flask):
    DB.init_app(app)