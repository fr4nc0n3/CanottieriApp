from re import I
from flask import Blueprint
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
from flask import Blueprint, jsonify, request

from backend.flask_app.app.extensions import DB
from backend.flask_app.app.query import get_target_id_users_, getCountUserNewsRx_, getUserNewsRx_, getUserNewsTx_, insertNews_, updateAllUserNewsRead_, updateUserNewsRead_
from .helpers import bad_json, missing_parameter, permission_denied, is_admin
import traceback

api_news = Blueprint("news", __name__)

@api_news.route('/get-user-news-received', methods=['GET'])
@jwt_required()
def getUserNews():
    identity = get_jwt_identity()

    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset', '0')
    limit = request.args.get('limit', '10') 

    #autenticazione
    if(idUser != identity):
        return permission_denied()

    news = getUserNewsRx_(int(idUser), int(limit), int(offset))

    return jsonify(news)

@api_news.route('/get-count-user-news', methods=['GET'])
@jwt_required()
def getCountUserNews():
    identity = get_jwt_identity()

    idUser = request.args.get('id-user', '-1')
    only_not_read = request.args.get('only-not-read', 'false')

    #autenticazione
    if(idUser != identity):
        return permission_denied()

    count = 0
    if only_not_read == "false":
       count = getCountUserNewsRx_(int(idUser))
    elif only_not_read == "true":
        count = getCountUserNewsRx_(int(idUser), is_read=False)
    else:
        return jsonify({"Status": "Bad request"}), 400

    return jsonify({"count": count})

@api_news.route('/get-user-news-sended', methods=['GET'])
@jwt_required()
def getUserNewsSended():
    identity = get_jwt_identity()

    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset-sql', '0')
    limit = 10

    if(identity != idUser):
        return permission_denied()

    news = getUserNewsTx_(int(idUser), limit, int(offset))

    return jsonify(news)

#-------------- PROCEDURES ---------------
# imposta la/e news dell' utente come lette/non lette
@api_news.route('/set-user-news-read', methods=['PUT'])
@jwt_required()
def setNewsRead():
    identity = get_jwt_identity()

    data = request.json

    if data is None:
        return bad_json()

    id_user = data.get('id_user', None)
    id_news = data.get('id_news', None)
    read = data.get('read', None)
    # se true allora id_news e read non vengono utilizzate
    all_readed = data.get('all_readed', None) 

    # controllo utente
    if id_user is None:
        return missing_parameter("id_user")
    elif type(id_user) is not int:
        return bad_json()

    if int(id_user) != int(identity):
        return permission_denied()

    if all_readed is not None and bool(all_readed):
        #segna tutte come lette e ritorna
        try:
            updateAllUserNewsRead_(id_user=id_user)
        except Exception:
            return jsonify({"error": traceback.format_exc()}), 500

        return jsonify({
            "operation": "set all user news read. id_user=" + str(id_user),
            "status": "ok"
            }), 200

    if id_news is None:
        return missing_parameter("id_news")
    elif type(id_news) is not int:
        return bad_json()
    
    if read is None:
        return missing_parameter("read")
    elif type(read) is not bool:
        return bad_json()

    # aggiorno la news letta/non letta
    try:
        updateUserNewsRead_(id_news=id_news, id_user=id_user, is_read=read)
    except Exception as e:
        return jsonify({"error": traceback.format_exc()}), 500

    return jsonify({
        "operation": "set user news read. id_user="
         + str(id_user) + ", id_news=" + str(id_news),
        "status": "ok"
        }), 200