from flask import Blueprint, jsonify, request, current_app
from sqlalchemy.orm import exc

from backend.flask_app.app.query import db_delete_img_, db_get_id_user_of_workout_image_, db_get_user_workout_, db_get_workout_images_, db_insert_workout_, db_insert_workout_image_, model_to_dict, updateUserWorkout_

from ..config import APP_CONFIG
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
import datetime
import os
from PIL import Image
from .helpers import (bad_json, is_admin, missing_parameter, permission_denied)

api_workout = Blueprint('workout', __name__)

# ----------- CRUD Workout ------------ 
@api_workout.route('workout', methods=["POST"])
@jwt_required()
def createWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    data = request.json

    print("data json: ", data)
    if data is None:
        return bad_json()

    idUser = data.get("id_user", None)
    date = data.get("date", None)
    description = data.get("description", None)

    # controllo che il jwt combaci con l' id utente del workout
    if(idUser != identity):
        return permission_denied()

    date = datetime.date.fromisoformat(date)

    try:
        id_wk = db_insert_workout_(int(idUser), date, description)
        return jsonify({'id': id_wk}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api_workout.route('workout', methods=['GET'])
@jwt_required()
def getWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get("id_user", None)
    year = request.args.get('year', None)
    month = request.args.get('month', None) # indice tra 0 e 11

    # controllo che i parametri siano stati passati
    if idUser is None:
        return missing_parameter('id_user')

    if year is None:
        return missing_parameter('year')

    if month is None:
        return missing_parameter('month')

    print("request.args: ", request.args)

    year = int(year)
    month = int(month)

    month = month + 1 # converto l' indice tra 1 e 12 per lib datetime 

    if(idUser != identity and not is_admin(claims)):
        return permission_denied()

    startDate = datetime.date(year, month, 1).isoformat()

    endDate = None
    if(month == 12):
        endDate = datetime.date(year + 1, 1, 1).isoformat()
    else:
        endDate = datetime.date(year, month + 1, 1).isoformat()

    workouts = db_get_user_workout_(int(idUser), startDate, endDate)

    return jsonify([model_to_dict(wk) for wk in workouts])

@api_workout.route('workout/<int:workout_id>', methods=['PUT'])
@jwt_required()
def update_user(workout_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    print("request URL:", request.url)

    data = request.json
    if data is None:
        return bad_json()

    description = data.get('description', None)

    if(description is None):
        return jsonify({"error": "Bad request"}), 400

    # aggiorno la descrizione controllando anche che l' identity del JWT
    # combaci con l' id_user del workout
    updateUserWorkout_(workout_id, identity, description)

    return jsonify({"status": "ok"})

#TODO controllo che la richiesta provenga da un utente oppure da un allenatore
#--- CRD Workout images ---
@api_workout.route('/img_workout', methods=['GET'])
@jwt_required()
def getImagesWorkout():
    print(request.url)

    id_workout = request.args.get("id", None)

    if(id_workout is None):
        return jsonify({'message': "Bad request workout id missing"}), 400

    images = db_get_workout_images_(int(id_workout))

    return jsonify([model_to_dict(img) for img in images])

@api_workout.route('/img_workout', methods=['POST'])
@jwt_required()
def createImageWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)
    print("request form:", request.form)
    print("request files:", request.files)

    upload_folder = APP_CONFIG.IMG_FOLDER
    img_max_width = APP_CONFIG.IMG_MAX_WIDTH
    img_max_height = APP_CONFIG.IMG_MAX_HEIGHT

    id_workout = request.form.get('id_workout', None)

    if(id_workout is None):
        return jsonify({'message': "Bad request workout id missing"}), 400

    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    # TODO fare controllo se il workout appartiene ad identity jwt

    image = request.files['image']
    imagePIL = Image.open(image.stream)

    # forzo ad RGB
    if imagePIL.mode in ("RGBA", "P"):
        imagePIL = imagePIL.convert("RGB")

    max_size = (img_max_width, img_max_height)
    imagePIL.thumbnail(max_size, Image.Resampling.LANCZOS) 

    if image.filename is None:
        image.filename = ""

    img_name = datetime.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + image.filename + ".jpg"

    # salvataggio su filesystem con immagine compressa
    save_path = os.path.join(upload_folder, img_name)
    imagePIL.save(save_path, format="JPEG", quality=15, optimize=True)

    # registrazione nel database
    db_insert_workout_image_(int(id_workout), img_name)

    return jsonify({"status": "ok", "img_name": img_name})
    
@api_workout.route('/img_workout/<string:name>', methods=['DELETE'])
@jwt_required()
def deleteImageWorkout(name):
    identity = get_jwt_identity()
    claims = get_jwt()

    upload_folder = APP_CONFIG.IMG_FOLDER

    #controllo che l' immagine del workout sia del jwt identity
    #che effettua la richiesta
    id_user = db_get_id_user_of_workout_image_(name)
    id_user = str(id_user)

    print("id_user:", id_user)
    print("identity:", identity)

    if(id_user != identity):
        return permission_denied()

    img_path = os.path.join(upload_folder, name)
    if os.path.exists(img_path):
        os.remove(img_path)
    else:
        print("Il file immagine da eliminare non esiste")

    db_delete_img_(name)

    return jsonify({"status": "ok"})