from flask import Blueprint, jsonify, request
from .db import query_db, execute_ops_db

api = Blueprint('main', __name__)

@api.route('/')
def index():
    return jsonify({"message": "Service available"})

#--------- GET DATA ------------
@api.route('/get-users', methods=['GET'])
def getUsers():
        users = query_db('SELECT * FROM User')
        return jsonify([dict(u) for u in users])

@api.route('/get-user-info', methods=['GET'])
def getUserInfo():
    idUser = request.args.get("id-user", "-1")
    
    user = query_db("SELECT * FROM User WHERE id = ?", tuple([idUser]))

    if(len(user) > 0):
        return jsonify(dict(user[0]))
    else:
        return ""

@api.route('/get-user-account-types', methods=['GET'])
def getUserAccountTypes():
    idUser = request.args.get('id-user', '-1')

    accountTypes = query_db('SELECT type FROM UserAccountType, AccountType ' +
        'WHERE id_account_type = AccountType.id and id_user = ?', tuple([idUser]))

    return jsonify([a['type'] for a in accountTypes])

@api.route('/get-user-news-received', methods=['GET'])
def getUserNews():
    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset-sql', '0')
    limit = 10

    news = query_db('SELECT n.title, n.message, n.data_publish, n.target_name ' +
        'FROM UserNews un, News n ' +
        'WHERE un.id_news = n.id AND un.id_user = ? AND n.is_deleted = 0 ' +
        'LIMIT ? OFFSET ?', tuple([idUser, limit, offset]))

    return jsonify([dict(n) for n in news])

@api.route('/get-user-news-sended', methods=['GET'])
def getUserNewsSended():
    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset-sql', '0')
    limit = 10

    news = query_db('SELECT * FROM News ' +
        'WHERE id_user_sender = ? AND is_deleted = 0' +
        'LIMIT ? OFFSET ?', tuple([idUser, limit, offset]))

    return jsonify([dict(n) for n in news])

#-------------- PROCEDURES ---------------
#TODO qui bisogna anche mettere una notifica ai vari account
#potrei dover aggiungere una colonna per i token expo-notifications agli utenti
@api.route('/send-news-to-groups', methods=['POST'])
def sendNewsToGroup():
    data = request.json

    # group e' un array di account type, se contiene "all" allora invia a tutti utenti
    groups = data.get('groups', None)
    idUser = data.get('id-user', None) # id user sender
    title = data.get('title', '')
    message = data.get('message', None)

    if (groups is None or idUser is None or message is None):
        return jsonify({"error": "Bad request"}), 400

    #estraggo utenti target
    query = "SELECT u.id FROM User u, UserAccountType uat, AccountType at " + \
        "WHERE at.id = uat.id_account_type AND uat.id_user = u.id "
    
    targetIdUsers = None 

    if ("all" not in groups):
        placeholders = ','.join(['?'] * len(groups))
        query += f"AND at.type in ({placeholders})"
        targetIdUsers = query_db(query, tuple(groups))
    else:
        targetIdUsers = query_db(query)

    targetIdUsers = [t[0] for t in targetIdUsers]

    print("Send to userIds:", targetIdUsers)

    query_ops = []

    #inserimento DB News
    query_ops.append(
        {
            "query": (
                "INSERT INTO News ("
                "id_user_sender, "
                "message, "
                "title, "
                "data_publish, "
                "created_at, "
                "updated_at, "
                "deleted_at, "
                "is_deleted, "
                "target_name"
                ") VALUES ("
                "?, ?, ?, date('now'), datetime('now'), datetime('now'), NULL, 0, ?"
                ")"
            ),
            "args": tuple([idUser, message, title, ','.join(groups)])
        })

    execute_ops_db(query_ops)

    query_ops = [] #resetto lista query operazionali

    #get last id news
    lastIdNews = query_db("SELECT seq FROM sqlite_sequence WHERE name = 'News'")
    lastIdNews = lastIdNews[0][0]

    print("last id news: ", lastIdNews)

    #inserimento DB UserNews
    query = (
        "INSERT INTO UserNews ("
        "id_news, id_user, created_at"
        ") VALUES ("
        "?,"
        "?,"
        "datetime('now')"
        ")"
    )

    for id in targetIdUsers:
        execute_ops_db([{"query": query, "args": tuple([lastIdNews, id])}])

    #invio notifiche

    return jsonify({"status": "ok"})

#TODO api anche per soft delete della news