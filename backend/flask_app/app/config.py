import os
from datetime import timedelta

class Config:
    DATABASE_PATH = os.getenv("DATABASE_PATH", "")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")

    # imposta la scadenza dei jwt emessi ad 1 giorni
    # di default invece flask_jwt_extended fa solo 15 minuti
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1) 
