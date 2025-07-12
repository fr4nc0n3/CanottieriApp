from app import create_app
from dotenv import load_dotenv
from waitress import serve
from pathlib import Path
import os

this_dir = Path(__file__).resolve().parent

load_dotenv(this_dir / '.env')

app = create_app()

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)
