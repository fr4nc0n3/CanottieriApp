from flask import config
from app import create_app
from dotenv import load_dotenv
from waitress import serve
from pathlib import Path

prev_dir = Path(__file__).resolve().parent.parent
config_file_name = 'flask_app_config.env'

config_loaded = load_dotenv(prev_dir / config_file_name)

if not config_loaded:
    print("Attenzione il file: " + config_file_name + " non e' stato trovato o non e' leggibile!!")
    print("IMPOSSIBILE AVVIARE L' APPLICAZIONE")
    exit(1)

app = create_app()

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)
