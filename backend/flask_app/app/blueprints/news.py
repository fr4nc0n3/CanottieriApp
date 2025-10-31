from re import I
from flask import Blueprint
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)
from flask import Blueprint, jsonify, request
from .helpers import bad_json, missing_parameter, permission_denied, is_admin
from ..db import (dbCountUserNewsRx, query_db, execute_ops_db, dbUserNewsRx, 
    dbUserNewsTx, insertNews, queryInsertUserNews, deleteNews as dbDeleteNews, updateAllUserNewsRead, updateUserNewsRead)
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

    news = dbUserNewsRx(int(idUser), int(limit), int(offset))

    return jsonify(news)

@api_news.route('/get-count-user-news', methods=['GET'])
@jwt_required()
def getCountUserNews():
    identity = get_jwt_identity()

    idUser = request.args.get('id-user', '-1')
    only_read = request.args.get('only-read', 'false')

    #autenticazione
    if(idUser != identity):
        return permission_denied()

    count = 0
    if only_read == "false":
        count = dbCountUserNewsRx(int(idUser)) 
    elif only_read == "true":
        count = dbCountUserNewsRx(int(idUser), is_read=True)
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

    news = dbUserNewsTx(int(idUser), limit, int(offset))

    return jsonify(news)

#-------------- PROCEDURES ---------------
# imposta la/e news dell' utente come lette/non lette
@api_news.route('/set-user-news-read', methods=['UPDATE'])
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

    if(id_user != identity):
        return permission_denied()

    if all_readed is not None and bool(all_readed):
        #segna tutte come lette e ritorna
        try:
            updateAllUserNewsRead(id_user=id_user)
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
        updateUserNewsRead(id_news=id_news, id_user=id_user, is_read=read)
    except Exception as e:
        return jsonify({"error": traceback.format_exc()}), 500

    return jsonify({
        "operation": "set user news read. id_user="
         + str(id_user) + ", id_news=" + str(id_news),
        "status": "ok"
        }), 200

@api_news.route('/send-news-to-groups', methods=['POST'])
@jwt_required()
def sendNewsToGroup():
    identity = get_jwt_identity()

    data = request.json

    if data is None:
        return bad_json()

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
@api_news.route('/delete-news', methods=['POST'])
@jwt_required()
def deleteNews():
    identity = get_jwt_identity()
    claims = get_jwt()

    # solo admin puo' eliminare news
    if(not is_admin(claims)):
        return permission_denied()

    data = request.json
    if data is None:
        return bad_json()

    id = data.get('id', None)

    if (id is None):
        return jsonify({"error": "Bad request"}), 400

    #eliminazione DB News by id
    dbDeleteNews(id)

    return jsonify({"status": "ok"})