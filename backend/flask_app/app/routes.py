from flask import Blueprint, jsonify, request, current_app, send_from_directory
from .db import (query_db, execute_ops_db, dbUserAccountTypes, dbUserNewsRx, 
    dbUserNewsTx, insertNews, queryInsertUserNews, deleteNews as dbDeleteNews,
    insertWorkout, dbUserWorkouts, updateUserWorkout, deleteUserWorkout, insertWorkoutImage,
    dbWorkoutImages, dbIdUserOfWorkoutImage, deleteImg, get_db )
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (create_access_token, jwt_required, get_jwt_identity, get_jwt)
import json
import datetime
import os
from PIL import Image
import io

api = Blueprint('main', __name__)

@api.route('/')
def index():
    return jsonify({"message": "Service available"})

#--------- GET DATA ------------
@api.route('/get-users', methods=['GET'])
@jwt_required()
def getUsers():
    identity = get_jwt_identity()
    claims = get_jwt()

    if(not is_admin(claims)):
        return permission_denied()

    # TODO in futuro non dovrei dare tutte le colonne di user
    # nemmeno all' admin siccome ci sono delle colonne sensibili come 
    # la password hashata
    users = query_db('SELECT * FROM User')
    return jsonify([dict(u) for u in users])

@api.route('/get-user-info', methods=['GET'])
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

@api.route('/get-user-account-types', methods=['GET'])
@jwt_required()
def getUserAccountTypes():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get('id-user', '-1')

    if(idUser != identity and not is_admin(claims)):
        return permission_denied()

    accountTypes = dbUserAccountTypes(idUser)

    return jsonify(accountTypes)

@api.route('/get-user-news-received', methods=['GET'])
@jwt_required()
def getUserNews():
    identity = get_jwt_identity()

    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset-sql', '0')
    limit = 10

    #autenticazione
    if(idUser != identity):
        return permission_denied()

    news = dbUserNewsRx(idUser, limit, offset)

    return jsonify(news)

@api.route('/get-user-news-sended', methods=['GET'])
@jwt_required()
def getUserNewsSended():
    identity = get_jwt_identity()

    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset-sql', '0')
    limit = 10

    if(identity != idUser):
        return permission_denied()

    news = dbUserNewsTx(idUser, limit, offset)

    return jsonify(news)

#-------------- PROCEDURES ---------------
@api.route('/send-news-to-groups', methods=['POST'])
@jwt_required()
def sendNewsToGroup():
    identity = get_jwt_identity()

    data = request.json

    # group e' un array di account type, se contiene "all" allora invia a tutti utenti
    groups = data.get('groups', None)
    idUser = data.get('id-user', None) # id user sender
    title = data.get('title', '')
    message = data.get('message', None)

    if(idUser != identity):
        return permission_denied()

    if (groups is None or idUser is None or message is None):
        return jsonify({"error": "Bad request"}), 400

    #estraggo utenti target
    query = "SELECT u.id FROM User u, UserAccountType uat, AccountType at " + \
        "WHERE at.id = uat.id_account_type AND uat.id_user = u.id "
    
    targetIdUsers = None 

    if ("all" not in groups):
        placeholders = ','.join(['?'] * len(groups))
        query += f"AND at.type in ({placeholders}) "
        query += "GROUP BY u.id "
        targetIdUsers = query_db(query, tuple(groups))
    else:
        query += "GROUP BY u.id "
        targetIdUsers = query_db(query)

    targetIdUsers = [t[0] for t in targetIdUsers]

    print("Send to userIds:", targetIdUsers)

    insertNews(idUser, message, title, groups)

    #get last id news
    lastIdNews = query_db("SELECT seq FROM sqlite_sequence WHERE name = 'News'")
    lastIdNews = lastIdNews[0][0]

    print("last id news: ", lastIdNews)

    #inserimento DB UserNews
    for id in targetIdUsers:
        execute_ops_db([queryInsertUserNews(lastIdNews, id)])

    return jsonify({"status": "ok"})

#soft delete di una news
@api.route('/delete-news', methods=['POST'])
@jwt_required()
def deleteNews():
    identity = get_jwt_identity()
    claims = get_jwt()

    # solo admin puo' eliminare news
    if(not is_admin(claims)):
        return permission_denied()

    data = request.json

    id = data.get('id', None)

    if (id is None):
        return jsonify({"error": "Bad request"}), 400

    #eliminazione DB News by id
    dbDeleteNews(id)

    return jsonify({"status": "ok"})

# ----------- CRUD Workout ------------ 
@api.route('workout', methods=["POST"])
@jwt_required()
def createWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    data = request.json

    print("data json: ", data)

    idUser = data.get("id_user", None)
    date = data.get("date", None)
    description = data.get("description", None)

    # controllo che il jwt combaci con l' id utente del workout
    if(idUser != identity):
        return permission_denied()

    try:
        # TODO penso che le altre chiamate al db siano un po' limitate
        conn = get_db()
        cursor = conn.execute(
            "INSERT INTO Workout ("
            "id_user, date, description"
            ") VALUES (?,?,?) ",
            tuple([idUser, date, description])
        )
        conn.commit()
        new_id = cursor.lastrowid

        return jsonify({'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        if conn:
            conn.close()

@api.route('workout', methods=['GET'])
@jwt_required()
def getWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    idUser = request.args.get("id_user", None)
    year = request.args.get('year', None)
    month = request.args.get('month', None) # indice tra 0 e 11

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

    workouts = dbUserWorkouts(idUser, startDate, endDate)
    return jsonify(workouts)

@api.route('workout/<int:workout_id>', methods=['PUT'])
@jwt_required()
def update_user(workout_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    print("request URL:", request.url)

    data = request.json

    description = data.get('description', None)

    if(description is None):
        return jsonify({"error": "Bad request"}), 400

    # aggiorno la descrizione controllando anche che l' identity del JWT
    # combaci con l' id_user del workout
    updateUserWorkout(workout_id, identity, description)

    return jsonify({"status": "ok"})

@api.route('/workout/<int:workout_id>', methods=['DELETE'])
@jwt_required()
def delete_user(workout_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    deleteUserWorkout(workout_id, identity)

    return jsonify({"status": "ok"})

#--- CRD Workout images ---
@api.route('/img_workout', methods=['GET'])
@jwt_required()
def getImagesWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)

    folder = current_app.config['IMG_FOLDER']

    id_workout = request.args.get("id", None)

    if(id_workout is None):
        return jsonify({'message': "Bad request workout id missing"}), 400

    images = dbWorkoutImages(id_workout)
    #urls = [("image/" + img) for img in images]

    print("images for workout id = ", id_workout, ": ", images)

    return jsonify(images)

@api.route('/img_workout', methods=['POST'])
@jwt_required()
def createImageWorkout():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)
    print("request form:", request.form)
    print("request files:", request.files)

    upload_folder = current_app.config['IMG_FOLDER']

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

    img_name = datetime.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + image.filename + ".jpg"

    # salvataggio su filesystem con immagine compressa
    save_path = os.path.join(upload_folder, img_name)
    imagePIL.save(save_path, format="JPEG", quality=15, optimize=True)

    # registrazione nel database
    insertWorkoutImage(id_workout, img_name)

    return jsonify({"status": "ok", "img_name": img_name})
    
@api.route('/img_workout/<string:name>', methods=['DELETE'])
@jwt_required()
def deleteImageWorkout(name):
    identity = get_jwt_identity()
    claims = get_jwt()

    upload_folder = current_app.config['IMG_FOLDER']

    #controllo che l' immagine del workout sia del jwt identity
    #che effettua la richiesta
    id_user = dbIdUserOfWorkoutImage(name)
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

    deleteImg(name) 

    return jsonify({"status": "ok"})

@api.route('/image/<path:name>')
def getImage(name):
    folder = current_app.config["IMG_FOLDER"]

    print(request.url)
    print("Trying to serve:", os.path.join(folder, name))

    return send_from_directory(folder, name)

# -- TODO bisogna fare una route per prendere l' allenamento di un singolo giorno 
# o del giorno corrente
# Promem: TESTARE GLI ALTRI
# ----------- CRUD planning -------------
@api.route('/plannings', methods=['GET'])
@jwt_required()
def get_plannings():
    identity = get_jwt_identity()
    claims = get_jwt()

    year = request.args.get('year', None)
    month = request.args.get('month', None) # indice tra 0 e 11

    print("request.args: ", request.args)

    year = int(year)
    month = int(month)

    month = month + 1 # converto l' indice tra 1 e 12 per lib datetime 

    #TODO dovrei fare funzioni/e per prendere startDate e endDate
    startDate = datetime.date(year, month, 1).isoformat()

    endDate = None
    if(month == 12):
        endDate = datetime.date(year + 1, 1, 1).isoformat()
    else:
        endDate = datetime.date(year, month + 1, 1).isoformat()

    #TODO mettere in file .db
    month_plannings = query_db(
        "SELECT * FROM Planning WHERE date >= ? AND date < ?",
        tuple([startDate, endDate])
    )

    return jsonify([dict(p) for p in month_plannings])

@api.route('/plannings', methods=['POST'])
@jwt_required()
def create_planning():
    identity = get_jwt_identity()
    claims = get_jwt()

    print(request.url)

    if not is_admin(claims):
        return permission_denied()

    data = request.get_json()
    date = data.get('date')
    description = data.get('description')

    print("json: ", data)

    if not date or not description:
        return jsonify({'error': 'date and description are required'}), 400

    try:
        # TODO penso che le altre chiamate al db siano un po' limitate
        conn = get_db()
        cursor = conn.execute(
            'INSERT INTO Planning (date, description) VALUES (?, ?)',
            tuple([date, description])
        )
        conn.commit()
        new_id = cursor.lastrowid

        return jsonify({'id': new_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        if conn:
            conn.close()

@api.route('/plannings/<int:planning_id>', methods=['PUT'])
@jwt_required()
def update_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    data = request.get_json()
    date = data.get('date')
    description = data.get('description')

    if not date or not description:
        return jsonify({'error': 'date and description are required'}), 400

    #TODO fare query in .db
    execute_ops_db([{
        'query': 'UPDATE Planning SET date = ?, description = ? WHERE id = ?',
        'args': tuple([date, description, planning_id])
        }]
    )

    return jsonify({'message': 'Updated successfully'})

@api.route('/plannings/<int:planning_id>', methods=['DELETE'])
@jwt_required()
def delete_planning(planning_id):
    identity = get_jwt_identity()
    claims = get_jwt()

    if not is_admin(claims):
        return permission_denied()

    # TODO fare funzione query in db.py
    execute_ops_db({'query': 'DELETE FROM Planning WHERE id = ?', 'args': tuple([planning_id])})

    return jsonify({'status': 'ok'})

# -------------- AUTENTICATIONS -----------
@api.route('/login', methods=['POST'])
def login():
    data = request.json

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

# -------------------- HELPERS -----------------
def is_admin(claims):
    return "admin" in claims.get("accountTypes", [])

def permission_denied():
    return jsonify({"message": "Permission denied"}), 403