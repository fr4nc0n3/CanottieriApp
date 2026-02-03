import os
from datetime import timedelta


# Campi necessari da passare a flask per sua gestione
class FlaskConfig:
    def __init__(self):
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")

        # serve a limitare le dimensioni delle richieste da servire
        # ad esempio se l' utente prova a caricare un PDF di 100MB
        self.MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB

        # imposta la scadenza dei jwt emessi ad 1 giorni
        # di default invece flask_jwt_extended fa solo 15 minuti
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
        self.SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.getenv("DATABASE_PATH", "")}"
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False


class AppConfig:
    ENV: str
    DATABASE_PATH: str
    IMG_FOLDER: str
    FILE_FOLDER: str
    IMG_MAX_HEIGHT: int
    IMG_MAX_WIDTH: int

    def __init__(self) -> None:
        self.ENV = ""
        self.DATABASE_PATH = ""
        self.IMG_FOLDER = ""
        self.FILE_FOLDER = ""
        self.IMG_MAX_WIDTH = 0
        self.IMG_MAX_HEIGHT = 0


APP_CONFIG = AppConfig()


def initAppConfig():
    APP_CONFIG.ENV = os.getenv("ENV", "")
    APP_CONFIG.DATABASE_PATH = os.getenv("DATABASE_PATH", "")
    APP_CONFIG.IMG_FOLDER = os.getenv("IMG_FOLDER", "")
    APP_CONFIG.FILE_FOLDER = os.getenv("FILE_FOLDER", "")
    APP_CONFIG.IMG_MAX_WIDTH = 1000
    APP_CONFIG.IMG_MAX_HEIGHT = 1000
