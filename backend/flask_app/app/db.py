import sqlite3
from flask import g, current_app
from typing import List, Tuple, TypedDict

class QueryOp(TypedDict):
    query: str
    args: tuple

def get_db():
    DATABASE = current_app.config['DATABASE_PATH']

    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row 
        db.execute('PRAGMA foreign_keys = ON;')

        fk = db.execute('PRAGMA foreign_keys;').fetchone()
        print("get new db connection with foreign_keys = ", 
            fk[0] if fk else "<error_fk_status_fetch>")

    return db

#DA USARE SOLO CON FLASK ROUTES
def query_db(query, args=()):
    db = get_db()

    print("execute query: ", query)
    print("with args: ", args)

    cur = db.execute(query, args)
    rv = cur.fetchall()
    cur.close()

    return rv 

#DA USARE SOLO CON FLASK ROUTES
# se una delle operazioni fallisce non viene effettuato alcun commit (nessuna modifica al DB)
def execute_ops_db(querys: List[QueryOp]):
    db = get_db()

    try:
        for query_op in querys:
            print("execute operation query: ", query_op['query'])
            print("with args: ", query_op['args'])

            cur = db.execute(query_op['query'], query_op['args'])

        db.commit()
    except Exception as e:
        db.rollback()
        print("error db query: ", e)
        raise

#Binding con flask
def close_connection(exception):
    db = getattr(g, '_database', None)

    if db is not None:
        db.close()
        print("db connection closed successfully.")