from flask import Blueprint, jsonify, request, current_app, send_from_directory
from ..db import (query_db, dbUserAccountTypes)
from werkzeug.security import check_password_hash
from flask_jwt_extended import (create_access_token) 
import os
from .helpers import (bad_json)

api = Blueprint('main', __name__)

@api.route('/')
def index():
    return jsonify({"message": "Service available"})

# route per servire immagini tramite il nome,
# prendendole dalla cartella di sistema
@api.route('/image/<path:name>')
def getImage(name):
    folder = current_app.config["IMG_FOLDER"]

    print(request.url)
    print("Trying to serve:", os.path.join(folder, name))

    return send_from_directory(folder, name)

# -------------- AUTENTICATIONS -----------
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if data is None:
        return bad_json()

    username = data.get('username', "")
    password = data.get('password', "")
    
    #Ottenere utente tramite nome
    user = query_db("SELECT id, password_hash FROM User WHERE name = ?", tuple([username]))

    if(len(user) <= 0):
        return jsonify({"message": "user_not_found"})

    id = user[0][0]
    psw_db = user[0][1] #e' hashata nel DB

    #get user account types
    accountTypes = dbUserAccountTypes(id)

    #verificare che combaci la password hashata
    if(check_password_hash(psw_db, password)):
        access_token = create_access_token(
            identity=str(id),
            additional_claims={"username": username, "accountTypes": accountTypes}
        )

        return jsonify({"message": "loggedIn", "token": access_token })
    else:
        return jsonify({"message": "login_failed", "token": ""}), 401

