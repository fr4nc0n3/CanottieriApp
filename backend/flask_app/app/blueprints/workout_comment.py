from flask import Blueprint, jsonify, request
from ..db import (execute_ops_db, get_db, query_db)
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
from .helpers import (bad_json, is_admin, missing_parameter, permission_denied)

api_workout_comment = Blueprint('workout_comment', __name__)

# ----------- CRUD Workout Comment ------------ 
@api_workout_comment.route('workout_comment', methods=["POST"])
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
        return missing_parameter('id_user_commentator')
    if id_workout is None:
        return missing_parameter('id_workout')
    if description is None:
        return missing_parameter('description')

    # controllo che il jwt combaci con l' id utente che si intende segnare
    if not is_admin(claims) or id_user_commentator != identity:
        return permission_denied()

    conn = None

    try:
        conn = get_db()
        cursor = conn.execute(
            "INSERT INTO WorkoutComment ("
            "id_user_commentator, id_workout, description"
            ") VALUES (?,?,?) ",
            tuple([id_user_commentator, id_workout, description])
        )
        conn.commit()
        new_id = cursor.lastrowid

        return jsonify({'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        if conn:
            conn.close()

# ritorna tutti i commenti di un workout passando nell' url l' id di quest' ultimo
@api_workout_comment.route('workout_comment/of_workout/<int:id_workout>', methods=['GET'])
@jwt_required()
def getWorkoutComment(id_workout):
    identity = get_jwt_identity()
    claims = get_jwt()

    print("request.args: ", request.args)

    #TODO non c'e' autenticazione utente (dovrebbe essere disponibile solo per allenatore ed atleta)
    #workout_comment = dbWorkoutComments(id_workout)
    try:
        workout_comments = query_db(
            "SELECT * FROM WorkoutComment WHERE id_workout = ?",
            tuple([id_workout])
        )

        return jsonify([dict(w) for w in workout_comments]), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api_workout_comment.route('workout_comment/<int:id>', methods=['PUT'])
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

    description = data.get('description', None)

    if(description is None):
        return missing_parameter('description')

    execute_ops_db([
        {
            "query": (
                "UPDATE WorkoutComment "
                "SET description = ? "
                "WHERE id = ?"
            ), 
            "args": tuple([description, id])
        }
    ])

    return jsonify({"status": "ok"})

'''@api_workout_comment.route('/workout_comment/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    deleteWorkoutComment(id)

    return jsonify({"status": "ok"})'''