from app import create_app
from dotenv import load_dotenv
from waitress import serve
import os

if __name__ == "__main__":
    load_dotenv()

    app = create_app()

    #TODO debug
    serve(app, host='0.0.0.0', port=5000)
