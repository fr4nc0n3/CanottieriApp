import os

class Config:
    DATABASE_PATH = os.getenv("DATABASE_PATH", "")
