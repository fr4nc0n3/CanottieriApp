from flask import Flask, request
from .config import Config
from .db import close_connection
from flask_cors import CORS
import os
from flask_jwt_extended import JWTManager
from .blueprints.user import api_user
from .blueprints.news import api_news
from .blueprints.planning import api_planning
from .blueprints.workout import api_workout
from .blueprints.main import api
from .blueprints.workout_comment import api_workout_comment
from datetime import datetime

def log_request():
    print("------ LOG REQUEST ------")
    print(f"Timestamp: {datetime.now()}")
    print(f"Metodo: {request.method}")
    print(f"URL: {request.url}")
    print(f"IP: {request.remote_addr}")
    # rischio di loggare la password e JWT utente in chiaro
    #print(f"Headers: {dict(request.headers)}") 
    #print(f"Dati: {request.get_data(as_text=True)}")
    print("-------------------------\n")

def create_app():
    app = Flask(__name__)

    FLASK_ENV = os.getenv("FLASK_ENV", "prod") 

    print("FLASK_ENV:")
    print(FLASK_ENV)

    #-------- IMPOSTAZIONE CORS ----------
    #per sviluppo
    if(FLASK_ENV == "dev"):
        CORS(app)

    # TODO: 
    #per produzione 
    elif(FLASK_ENV == "prod"): 
     CORS(app, resources={
        r"/api/*": {
            "origins": ["https://tuo-sito.com"], 
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"],
        }
     })
    else:
        print("Errore: FLASK_ENV non valido, FLASK_ENV = " + FLASK_ENV)
        exit(1)

    # ---------- SETUP App configs ----------
    config = Config()

    print("config flask: ")
    for key, value in config.__dict__.items():
        print(f"{key}: {value}")

    app.config.from_object(config)

    #creazione della cartella per le immagini
    img_folder = app.config['IMG_FOLDER']
    os.makedirs(img_folder, exist_ok=True)

    #configurazione JWT
    jwt = JWTManager(app) 

    # Blueprint registration
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(api_user, url_prefix='/api')
    app.register_blueprint(api_planning, url_prefix='/api')
    app.register_blueprint(api_workout, url_prefix='/api')
    app.register_blueprint(api_workout_comment, url_prefix='/api')
    app.register_blueprint(api_news, url_prefix='/api')

    # In questo modo alla fine di ogni api viene chiamato automaticamente
    # close_connection
    app.teardown_appcontext(close_connection)

    # logging ad ogni route API
    app.before_request(log_request)

    return app