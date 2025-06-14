import sqlite3
from flask import g, current_app

def get_db():
    DATABASE = current_app.config['DATABASE_PATH']

    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row 
        db.execute('PRAGMA foreign_keys = ON;')
        print("get new db connection")

    return db

def query_db(query, args=()):
    db = get_db()

    print("execute query: ", query)
    print("with args: ", args)

    cur = db.execute(query, args)
    rv = cur.fetchall()
    cur.close()

    return rv 

def close_connection(exception):
    db = getattr(g, '_database', None)

    if db is not None:
        db.close()
        print("db connection closed successfully.")