from flask import Flask, request

from .config import APP_CONFIG, FlaskConfig
from flask_cors import CORS
import os
from flask_jwt_extended import JWTManager
from .blueprints.user import api_user
from .blueprints.news import api_news
from .blueprints.planning import api_planning
from .blueprints.workout import api_workout
from .blueprints.main import api
from .blueprints.workout_comment import api_workout_comment
from .blueprints.training_card import api_training_card
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from .models_sqlalchemy import (
    Base,
    User as SQLAUser,
    AccountType as SQLAAccountType,
    Image as SQLAImage,
)


def log_request():
    print("------ LOG REQUEST ------")
    print(f"Timestamp: {datetime.now()}")
    print(f"Metodo: {request.method}")
    print(f"URL: {request.url}")
    print(f"IP: {request.remote_addr}")
    # rischio di loggare la password e JWT utente in chiaro
    # print(f"Headers: {dict(request.headers)}")
    # print(f"Dati: {request.get_data(as_text=True)}")
    print("-------------------------\n")


def create_app():
    app = Flask(__name__)

    print("---------- CONFIG APP ---------- ")
    for key, value in APP_CONFIG.__dict__.items():
        print(f"{key}: {value}")

    ENV = APP_CONFIG.ENV

    # -------- IMPOSTAZIONE CORS ----------
    # per sviluppo
    if ENV == "dev":
        CORS(app)

    # TODO:
    # per produzione
    elif ENV == "prod":
        CORS(
            app,
            resources={
                r"/api/*": {
                    "origins": ["https://tuo-sito.com"],
                    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                    "allow_headers": ["Authorization", "Content-Type"],
                }
            },
        )
    else:
        print("Errore: ENV non valido, ENV = " + ENV)
        exit(1)

    # ---------- SETUP Flask configs ----------
    config = FlaskConfig()

    print("------------- CONFIG FLASK ------------")
    for key, value in config.__dict__.items():
        print(f"{key}: {value}")

    app.config.from_object(config)

    # creazione della cartella per le immagini
    img_folder = APP_CONFIG.IMG_FOLDER
    os.makedirs(img_folder, exist_ok=True)

    # creazione della cartella per i files
    file_folder = APP_CONFIG.FILE_FOLDER
    os.makedirs(file_folder, exist_ok=True)

    # configurazione JWT
    jwt = JWTManager(app)

    # Blueprint registration
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(api_user, url_prefix="/api")
    app.register_blueprint(api_planning, url_prefix="/api")
    app.register_blueprint(api_workout, url_prefix="/api")
    app.register_blueprint(api_workout_comment, url_prefix="/api")
    app.register_blueprint(api_news, url_prefix="/api")
    app.register_blueprint(api_training_card, url_prefix="/api")

    # In questo modo alla fine di ogni api viene chiamato automaticamente
    # close_connection
    # app.teardown_appcontext(close_db_ORM)

    # logging ad ogni route API
    app.before_request(log_request)

    return app
