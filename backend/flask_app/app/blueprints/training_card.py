from flask import Blueprint, jsonify, request

from backend.flask_app.app.query import (
    db_create_training_card,
    db_soft_delete_training_card,
    db_get_training_cards,
)
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import datetime
from .helpers import is_admin, missing_parameter, permission_denied
from ..config import APP_CONFIG
import os
from werkzeug.utils import secure_filename

api_training_card = Blueprint("training_card", __name__)


# ----------- CRUD training card -------------
@api_training_card.route("/training_card", methods=["GET"])
@jwt_required()
def get_training_cards():
    identity = get_jwt_identity()
    claims = get_jwt()

    return jsonify(db_get_training_cards())


@api_training_card.route("/training_card", methods=["POST"])
@jwt_required()
def create_training_card():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)
    print("request form:", request.form)
    print("request files:", request.files)

    file_folder = APP_CONFIG.FILE_FOLDER

    if not is_admin(claims):
        return permission_denied()

    name = request.form.get("name")
    description = request.form.get("description")

    if not name:
        return jsonify({"error": "name required"}), 400

    if description is None:
        return jsonify({"error": "description required"}), 400

    if "file" not in request.files:
        return jsonify({"error": "file required"}), 400

    file = request.files["file"]

    if file.mimetype != "application/pdf":
        return jsonify({"error": "file must be an application/pdf"}), 400

    file_name = ""
    if file.filename is not None:
        file_name = file.filename

    store_file_name = (
        datetime.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + file_name
    )
    store_file_name = secure_filename(store_file_name)

    save_path = os.path.join(file_folder, store_file_name)
    file.save(save_path)

    try:
        id_card = db_create_training_card(store_file_name, name, description)
        return jsonify({"store_file_name": store_file_name}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@api_training_card.route("/training_card/<int:card_id>", methods=["DELETE"])
@jwt_required()
def delete_training_card(card_id: int):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    db_soft_delete_training_card(card_id)

    return jsonify({"status": "ok"})
