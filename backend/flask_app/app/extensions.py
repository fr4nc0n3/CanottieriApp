from flask import current_app, g
from flask.app import Flask
from flask_sqlalchemy import SQLAlchemy

from flask_app.app.models_sqlalchemy import Base

DB = SQLAlchemy(model_class=Base)


def init_sqlalchemy_database(app: Flask):
    DB.init_app(app)
