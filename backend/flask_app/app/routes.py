from flask import Blueprint, jsonify, request
from .db import query_db

api = Blueprint('main', __name__)

@api.route('/')
def index():
    return jsonify({"message": "Service available"})

#--------- GET DATA ------------
@api.route('/get-users', methods=['GET'])
def getUsers():
        users = query_db('SELECT * FROM User')
        return jsonify([dict(u) for u in users])

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

    news = query_db('SELECT * FROM News ' +
        'WHERE id_user_recipient = ? ' +
        'LIMIT ? OFFSET ?', tuple([idUser, limit, offset]))

    return jsonify([dict(n) for n in news])

@api.route('get-user-news-sended', methods=['GET'])
def getUserNewsSended():
    idUser = request.args.get('id-user', '-1')
    offset = request.args.get('offset-sql', '0')
    limit = 10

    news = query_db('SELECT * FROM News ' +
        'WHERE id_user_sender = ? ' +
        'LIMIT ? OFFSET ?', tuple([idUser, limit, offset]))

    return jsonify([dict(n) for n in news])

#-------------- PROCEDURES ---------------