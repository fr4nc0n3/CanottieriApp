from flask import Blueprint, jsonify, request, send_from_directory

from flask_app.app.extensions import DB
from flask_app.app.models_sqlalchemy import User

from ..config import APP_CONFIG
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
import os
from .helpers import bad_json

api = Blueprint("main", __name__)


@api.route("/")
def index():
    return jsonify({"message": "Service available"})


# route per servire immagini tramite il nome,
# prendendole dalla cartella di sistema
@api.route("/image/<path:name>")
def get_image(name: str):
    folder = APP_CONFIG.IMG_FOLDER

    print(request.url)
    print("Trying to serve:", os.path.join(folder, name))

    return send_from_directory(folder, name)


# route per servire file tramite il nome,
# prendendole dalla cartella di sistema
@api.route("/file/<path:name>")
def get_file(name: str):
    folder = APP_CONFIG.FILE_FOLDER

    print(request.url)
    print("Trying to serve:", os.path.join(folder, name))

    return send_from_directory(folder, name)


# -------------- AUTENTICATIONS -----------
@api.route("/login", methods=["POST"])
def login():
    data = request.json
    if data is None:
        return bad_json()

    username = data.get("username", "")
    password = data.get("password", "")

    # Ottenere utente tramite nome
    user = DB.session.query(User).filter_by(name=username).first()

    if user is None:
        return jsonify({"message": "user_not_found"})

    id = user.id
    psw_db = user.password_hash

    # get user account types
    accountTypes = [at.AccountType_.type for at in user.UserAccountType]

    # verificare che combaci la password hashata
    if check_password_hash(psw_db, password):
        access_token = create_access_token(
            identity=str(id),
            additional_claims={"username": username, "accountTypes": accountTypes},
        )

        return jsonify({"message": "loggedIn", "token": access_token})
    else:
        return jsonify({"message": "login_failed", "token": ""}), 401
