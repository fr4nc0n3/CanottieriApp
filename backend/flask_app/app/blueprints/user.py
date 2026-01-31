from flask import Blueprint, jsonify, request

from backend.flask_app.app.query import db_get_users_ 
from ..db import (query_db, dbUserAccountTypes)
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
from .helpers import (is_admin, permission_denied)

api_user = Blueprint("user", __name__)

#--------- GET DATA ------------
@api_user.route('/get-users', methods=['GET'])
@jwt_required()
def getUsers():
    identity = get_jwt_identity()
    claims = get_jwt()

    if(not is_admin(claims)):
        return permission_denied()

    users = db_get_users_()

    # ATTENZIONE: 
    # rimuovo il campo 'password_hash' 
    key_to_remove = "password_hash"

    users_no_psw = [
        {k: v for k, v in item.items() if k != key_to_remove}
        for item in users
    ]

    return jsonify(users_no_psw)

#TODO: riprendere da qui refactoring per ORM (ELIMINARE QUESTO TODO)

@api_user.route('/get-user-info', methods=['GET'])
@jwt_required()
def getUserInfo():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get("id-user", "-1")

    if(idUser != identity and not is_admin(claims)):
        return permission_denied()
    
    user = query_db("SELECT * FROM User WHERE id = ?", tuple([idUser]))

    if(len(user) > 0):
        return jsonify(dict(user[0]))
    else:
        return jsonify({"message": "user not found"}), 404 

@api_user.route('/get-user-account-types', methods=['GET'])
@jwt_required()
def getUserAccountTypes():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get('id-user', '-1')

    if(idUser != identity and not is_admin(claims)):
        return permission_denied()

    accountTypes = dbUserAccountTypes(int(idUser))

    return jsonify(accountTypes)