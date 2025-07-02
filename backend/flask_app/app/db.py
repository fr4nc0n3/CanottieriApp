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

# Viene usato da flask per chiudere la connessione alla fine di ogni chiamata
def close_connection(exception):
    db = getattr(g, '_database', None)

    if db is not None:
        db.close()
        print("db connection closed successfully.")

# --------------------- QUERYS -----------------
# accetta id utente e restituisce list di stringhe
def dbUserAccountTypes(idUser):
    accountTypes = query_db(
        'SELECT type FROM UserAccountType, AccountType ' +
        'WHERE id_account_type = AccountType.id and id_user = ?',
        tuple([idUser])
    )
    
    return [a['type'] for a in accountTypes]

# ritorna list di dict
def dbUserNewsRx(idUser, limit, offset):
    news = query_db(
        'SELECT n.title, n.message, n.data_publish, n.target_name ' +
        'FROM UserNews un, News n ' +
        'WHERE un.id_news = n.id AND un.id_user = ? AND n.is_deleted = 0 ' +
        'LIMIT ? OFFSET ?',
        tuple([idUser, limit, offset])
    )
    
    return [dict(n) for n in news]

#ritorna list dict
def dbUserNewsTx(idUser, limit, offset):
    news = query_db('SELECT * FROM News ' +
        'WHERE id_user_sender = ? AND is_deleted = 0 ' +
        'LIMIT ? OFFSET ?', tuple([idUser, limit, offset]))

    return [dict(n) for n in news]

def insertNews(idUser, message, title, groups):
    query_ops = []
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

def deleteNews(id):
    execute_ops_db([
        {
            "query": (
                "UPDATE News "
                "SET is_deleted = 1 "
                "WHERE id = ?"
            ),
            "args": tuple([id])
        }])

#restituisce un queryOp 
def queryInsertUserNews(idNews, idUser) -> QueryOp:
    query = (
        "INSERT INTO UserNews ("
        "id_news, id_user, created_at"
        ") VALUES ("
        "?,"
        "?,"
        "datetime('now')"
        ")"
    )

    return {"query": query, "args": tuple([lastIdNews, id])}