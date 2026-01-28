from flask import Blueprint, jsonify, request
from ..db import (query_db, execute_ops_db, get_db)
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
import datetime
from .helpers import (is_admin, missing_parameter, permission_denied)
from ..config import APP_CONFIG
import os
from werkzeug.utils import secure_filename

api_training_card = Blueprint("training_card", __name__)

# ----------- CRUD training card -------------
@api_training_card.route('/training_card', methods=['GET'])
@jwt_required()
def get_training_cards():
    identity = get_jwt_identity()
    claims = get_jwt()

    training_cards = query_db(
        'SELECT c.id, c.name_card, c.description, f.file_name, f.created_at, mime.mime_type '
        'FROM TrainingCard AS c JOIN File AS f ON f.id = c.id_file '
        'JOIN MimeType AS mime ON mime.id = f.id_mime_type '
        'WHERE c.deleted_at IS NULL'
    )

    return jsonify([dict(c) for c in training_cards])

@api_training_card.route('/training_card', methods=['POST'])
@jwt_required()
def create_planning():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)
    print("request form:", request.form)
    print("request files:", request.files)

    file_folder = APP_CONFIG.FILE_FOLDER

    if not is_admin(claims):
        return permission_denied()

    name = request.form.get('name')
    description = request.form.get('description')
    #file_name = request.form.get('file_name')
    #mime_type = request.form.get('mime_type')

    if not name:
        return jsonify({'error': 'name required'}), 400

    if description is None:
        return jsonify({'error': 'description required'}), 400

    if 'file' not in request.files:
        return jsonify({'error': 'file required'}), 400

    file = request.files['file']

    if file.mimetype != "application/pdf":
        return jsonify({'error': 'file must be an application/pdf'}), 400

    file_name = ""
    if file.filename is not None:
        file_name = file.filename

    store_file_name = datetime.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + file_name 
    store_file_name = secure_filename(store_file_name)

    #TODO bisognerebbe mettere anche un controllo sulla dimensione del pdf

    #TODO testare
    save_path = os.path.join(file_folder, store_file_name)
    file.save(save_path)

    conn = None
    try:
        conn = get_db()
        cursor = conn.execute(
            'INSERT INTO File '
            ' (file_name, id_mime_type) '
            'VALUES(?, 1);', # 1 = application/pdf
            tuple([store_file_name])
        )

        new_file_id = cursor.lastrowid

        cursor = conn.execute(
            'INSERT INTO TrainingCard '
            '(id_file, name_card, description)'
            'VALUES(?, ?, ?);',
            tuple([new_file_id, name, description])
        )

        conn.commit()

        return jsonify({'store_file_name': store_file_name}), 201
    except Exception as e:
        if conn:
            conn.rollback()

        return jsonify({'error': str(e)}), 400
    finally:
        if conn:
            conn.close()

@api_training_card.route('/training_card/<int:card_id>', methods=['DELETE'])
@jwt_required()
def delete_planning(card_id: int):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    execute_ops_db([{
        'query':   
            'UPDATE TrainingCard SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
            'args': tuple([card_id])
    }])

    return jsonify({'status': 'ok'})