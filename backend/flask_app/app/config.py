import os
from datetime import timedelta

class Config:
    def __init__(self):
        self.DATABASE_PATH = os.getenv("DATABASE_PATH", "")
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
        self.IMG_FOLDER = os.getenv("IMG_FOLDER", "")

        # imposta la scadenza dei jwt emessi ad 1 giorni
        # di default invece flask_jwt_extended fa solo 15 minuti
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1) 
