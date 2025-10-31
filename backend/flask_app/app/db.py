import sqlite3
from flask import g, current_app
from typing import List, Optional, Tuple, TypedDict

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
def query_db(query: str, args: tuple=()):
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
def dbUserAccountTypes(idUser: int):
    accountTypes = query_db(
        'SELECT type FROM UserAccountType, AccountType ' +
        'WHERE id_account_type = AccountType.id and id_user = ?',
        tuple([idUser])
    )
    
    return [a['type'] for a in accountTypes]

# ritorna list di dict
def dbUserNewsRx(idUser: int, limit: int, offset: int):
    news = query_db(
        'SELECT un.id AS id_user_news, n.title, n.message, ' +
        'n.data_publish, n.target_name, un.is_read, u.name AS sender_name ' +
        'FROM UserNews un, News n, User u ' +
        'WHERE u.id = n.id_user_sender AND un.id_news = n.id AND un.id_user = ? AND n.is_deleted = 0 ' +
        'ORDER BY n.data_publish DESC '
        'LIMIT ? OFFSET ? ',
        tuple([idUser, limit, offset])
    )
    
    return [dict(n) for n in news]

# ritorna intero, ossia il conteggio
def dbCountUserNewsRx(id_user: int, is_read: Optional[bool] = None):
    count = 0

    if is_read is None:
        # [0][0] indica la prima colonna del primo record
        count = query_db(
            "SELECT COUNT(*) AS count_user_news " +
            "FROM UserNews un " +
            "WHERE id_user = ? ",
            tuple([id_user])
        )[0][0]
    else:
        sql_is_read = 1 if is_read else 0
        count = query_db(
            "SELECT COUNT(*) AS count_user_news " +
            "FROM UserNews un " +
            "WHERE is_read = ? AND id_user = ? ",
            tuple([sql_is_read, id_user])
        )[0][0]

    return count

#ritorna list dict
def dbUserNewsTx(idUser: int, limit: int, offset: int):
    news = query_db('SELECT * FROM News ' +
        'WHERE id_user_sender = ? AND is_deleted = 0 ' +
        'LIMIT ? OFFSET ?', tuple([idUser, limit, offset]))

    return [dict(n) for n in news]

#ritorna list dict
#endDate e' estremo escluso
#startDate e' estremo incluso
def dbUserWorkouts(idUser:int, startDate: str, endDate: str): 
    workouts = query_db('SELECT * FROM Workout ' +
        'WHERE id_user = ? AND date >= ? AND date < ?'
        , tuple([idUser, startDate, endDate]))

    return [dict(w) for w in workouts]

# ritorna list dict
def dbWorkoutImages(id_workout: int):
    images = query_db("SELECT img.* FROM WorkoutImage AS wImg JOIN " +
     "Image AS img ON img.id = wImg.id_image " +
        "WHERE wImg.id_workout = ? ", tuple([id_workout]))

    return [dict(img) for img in images]

def dbIdUserOfWorkoutImage(img_name: str):
    id = query_db(
        "SELECT wk.id_user "
        "FROM Image "
        "JOIN WorkoutImage AS wkImg ON wkImg.id_image = Image.id "
        "JOIN Workout AS wk ON wk.id = wkImg.id_workout "
        "WHERE Image.name = ?", 
        tuple([img_name])
    )

    return id[0][0]

# aggiorna il workout di un utente filtrando sia per id utente che per id workout
# in genere verra' passato l' identity del JWT come idUser in modo da verificare
# che l' utente sia autorizzato
def updateUserWorkout(idWorkout: int, idUser: int, description: str):
    execute_ops_db([
        {
            "query": (
                "UPDATE Workout "
                "SET description = ? "
                "WHERE id = ? AND id_user = ? "
            ),
            "args": tuple([description, idWorkout, idUser])
        }])

def deleteUserWorkout(idWorkout: int, idUser: int):
    execute_ops_db([
        {
            "query": (
                "DELETE FROM Workout "
                "WHERE id = ? AND id_user = ? "
            ),
            "args": tuple([idWorkout, idUser])
        }])

def insertNews(idUser: int, message: str, title: str, groups: list[str]):
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

def deleteNews(id: int):
    execute_ops_db([
        {
            "query": (
                "UPDATE News "
                "SET is_deleted = 1 "
                "WHERE id = ?"
            ),
            "args": tuple([id])
        }])

def deleteImg(name: str):
    execute_ops_db([
        {
            "query": (
                "DELETE FROM Image WHERE name = ?"
            ), 
            "args": tuple([name])
        }
    ])

#restituisce un queryOp 
def queryInsertUserNews(idNews: int, idUser: int) -> QueryOp:
    query = (
        "INSERT INTO UserNews ("
        "id_news, id_user, created_at"
        ") VALUES ("
        "?,"
        "?,"
        "datetime('now')"
        ")"
    )

    return {"query": query, "args": tuple([idNews, idUser])}

#imposta una notifica utente come letta/non letta
def updateUserNewsRead(id_news: int, id_user: int, is_read: bool):
    is_read_int = 1 if is_read else 0

    execute_ops_db([
        {
            "query": (
                "UPDATE UserNews "
                "SET is_read = ? "
                "WHERE id_news = ? AND id_user = ? "
            ),
            "args": tuple([is_read_int, id_news, id_user])
        }])

#imposta tutte le user news di quell' utente come lette
def updateAllUserNewsRead(id_user: int):
    execute_ops_db([
        {
            "query": (
                "UPDATE UserNews "
                "SET is_read = 1 "
                "WHERE id_user = ? "
            ),
            "args": tuple([id_user])
        }])

def insertWorkout(idUser: int, date: str, description: str):
    query = (
        "INSERT INTO Workout ("
        "id_user, date, description"
        ") VALUES ("
        "?,"
        "?,"
        "?"
        ")"
    )

    execute_ops_db([{"query": query, "args": tuple([idUser, date, description])}])

def insertWorkoutImage(id_workout: int, image_name: str):
    query = (
        "INSERT INTO Image ("
        "name"
        ") VALUES ("
        "?"
        ")"
    )

    execute_ops_db([{"query": query, "args": tuple([image_name])}])

    id_image = query_db("SELECT id FROM Image WHERE name = ?", tuple([image_name]))
    id_image = id_image[0][0]

    query = (
        "INSERT INTO WorkoutImage ("
        "id_workout, id_image"
        ") VALUES (?, ?) "
    )

    execute_ops_db([{"query": query, "args": tuple([id_workout, id_image])}])
