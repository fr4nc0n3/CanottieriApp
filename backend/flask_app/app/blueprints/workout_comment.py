from flask import Blueprint, jsonify, request

from backend.flask_app.app.query import (
    db_get_workout_comments_,
    db_insert_workout_comment_,
    db_update_workout_comment_,
    getUserWorkout_,
    model_to_dict,
    notifyUserForWorkoutComment_,
)
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from .helpers import (
    bad_json,
    is_admin,
    missing_parameter,
    permission_denied,
    resource_not_found,
)
import traceback

api_workout_comment = Blueprint("workout_comment", __name__)


# ----------- CRUD Workout Comment ------------
@api_workout_comment.route("workout_comment", methods=["POST"])
@jwt_required()
def createWorkoutComment():
    identity = get_jwt_identity()
    claims = get_jwt()

    data = request.json

    print("data json: ", data)
    if data is None:
        return bad_json()

    id_user_commentator = data.get("id_user_commentator", None)
    id_workout = data.get("id_workout", None)
    description = data.get("description", None)

    # controllo che tutti i campi siano stati passati
    if id_user_commentator is None:
        return missing_parameter("id_user_commentator")
    if id_workout is None:
        return missing_parameter("id_workout")
    if description is None:
        return missing_parameter("description")

    # controllo che il jwt combaci con l' id utente che si intende segnare
    if not is_admin(claims) or str(id_user_commentator) != identity:
        return permission_denied()

    try:
        # inserimento notifica commento
        id_comment = db_insert_workout_comment_(
            id_user_commentator, id_workout, description
        )
        notifyUserForWorkoutComment_(id_workout)

        return jsonify({"id": id_comment}), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400


# ritorna tutti i commenti di un workout passando nell' url l' id di quest' ultimo
@api_workout_comment.route(
    "workout_comment/of_workout/<int:id_workout>", methods=["GET"]
)
@jwt_required()
def getWorkoutComment(id_workout: int):
    identity = get_jwt_identity()
    claims = get_jwt()

    print("request.args: ", request.args)

    id_user = int(identity)
    workout = getUserWorkout_(id_workout)

    # id del jwt deve corrispondere all' id dell' utente che ha creato il workout
    # oppure se il jwt e' di un admin (allenatore)
    if workout is None:
        return resource_not_found("workout with id = " + str(id_workout))

    if id_user != workout.id_user and not is_admin(claims):
        return permission_denied()

    try:
        workout_comments = db_get_workout_comments_(id_workout)

        return jsonify([model_to_dict(w) for w in workout_comments]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@api_workout_comment.route("workout_comment/<int:id>", methods=["PUT"])
@jwt_required()
def update_user(id):
    identity = get_jwt_identity()
    claims = get_jwt()

    print("request URL:", request.url)

    data = request.json
    if data is None:
        return bad_json()

    if not is_admin(claims):
        return permission_denied()

    description = data.get("description", None)

    if description is None:
        return missing_parameter("description")

    db_update_workout_comment_(id, description)

    return jsonify({"status": "ok"})
