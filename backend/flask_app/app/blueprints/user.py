from flask import Blueprint, jsonify, request

from backend.flask_app.app.models_sqlalchemy import AccountType
from backend.flask_app.app.query import (
    db_get_user,
    db_get_users,
    get_dict_without_field,
    db_get_user_account_types,
    model_to_dict,
)
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .helpers import is_admin, permission_denied

api_user = Blueprint("user", __name__)

USER_PSW_FIELD = "password_hash"


# --------- GET DATA ------------
@api_user.route("/get-users", methods=["GET"])
@jwt_required()
def get_users():
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    users = db_get_users()

    # ATTENZIONE:
    # rimuovo il campo psw
    users_no_psw = [get_dict_without_field(user, USER_PSW_FIELD) for user in users]

    return jsonify(users_no_psw)


@api_user.route("/get-user-info", methods=["GET"])
@jwt_required()
def get_user_info():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get("id-user", "-1")

    if idUser != identity and not is_admin(claims):
        return permission_denied()

    user = db_get_user(int(idUser))
    if user is not None:
        user_dict = model_to_dict(user)
        user_no_psw = get_dict_without_field(user_dict, USER_PSW_FIELD)

        return jsonify(user_no_psw)
    else:
        return jsonify({"message": "user not found"}), 404


# NOTA:
# Non e' utilizzato nel frontend al momento
@api_user.route("/get-user-account-types", methods=["GET"])
@jwt_required()
def get_user_account_types():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get("id-user", "-1")

    if idUser != identity and not is_admin(claims):
        return permission_denied()

    accountTypes = db_get_user_account_types(int(idUser))

    return jsonify(accountTypes)
