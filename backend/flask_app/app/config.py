import os
from datetime import timedelta

class Config:
    def __init__(self):
        self.DATABASE_PATH = os.getenv("DATABASE_PATH", "")
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
        self.IMG_FOLDER = os.getenv("IMG_FOLDER", "")
        self.IMG_MAX_WIDTH = 1000
        self.IMG_MAX_HEIGHT = 1000

        # imposta la scadenza dei jwt emessi ad 1 giorni
        # di default invece flask_jwt_extended fa solo 15 minuti
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1) 
