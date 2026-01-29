from backend.flask_app.app.extensions import DB
from backend.flask_app.app.models_sqlalchemy import (
    UserNews, News, User, AccountType, UserAccountType, Workout, Image, t_WorkoutImage
)
from datetime import datetime
from sqlalchemy import func

# ------------------ helper ------------------

def model_to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

def getUserNewsRx(idUser: int, limit: int, offset: int):
    rows = (
        DB.session.query(
            UserNews.id.label("id_user_news"),
            News.title,
            News.message,
            News.data_publish,
            News.target_name,
            UserNews.is_read,
            User.name.label("sender_name"),
            UserNews.id_news
        )
        .join(News, UserNews.id_news == News.id)
        .join(User, User.id == News.id_user_sender)
        .filter(UserNews.id_user == idUser, News.is_deleted == False)
        .order_by(News.data_publish.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    return [dict(r._mapping) for r in rows]

def getCountUserNewsRx(id_user: int, is_read: bool | None = None):
    query = DB.session.query(DB.func.count(UserNews.id)) \
        .filter(UserNews.id_user == id_user)

    if is_read is not None:
        query = query.filter(UserNews.is_read == is_read)

    return query.scalar()

# ------------------ account types ------------------

def getUserAccountTypes(idUser: int):
    rows = (
        DB.session.query(AccountType.type)
        .join(UserAccountType, UserAccountType.id_account_type == AccountType.id)
        .filter(UserAccountType.id_user == idUser)
        .all()
    )
    return [r[0] for r in rows]


# ------------------ news inviate ------------------

def getUserNewsTx(idUser: int, limit: int, offset: int):
    rows = (
        DB.session.query(News)
        .filter(
            News.id_user_sender == idUser,
            News.is_deleted == False
        )
        .limit(limit)
        .offset(offset)
        .all()
    )
    return [model_to_dict(n) for n in rows]


# ------------------ workouts ------------------

def getUserWorkouts(idUser: int, startDate: str, endDate: str):
    rows = (
        DB.session.query(Workout)
        .filter(
            Workout.id_user == idUser,
            Workout.date >= startDate,
            Workout.date < endDate
        )
        .all()
    )
    return [model_to_dict(w) for w in rows]


def getUserWorkout(id_workout: int):
    w = (
        DB.session.query(Workout)
        .filter(Workout.id == id_workout)
        .first()
    )
    return model_to_dict(w) if w else None


# ------------------ workout images ------------------

def getWorkoutImages(id_workout: int):
    rows = (
        DB.session.query(Image)
        .join(t_WorkoutImage, t_WorkoutImage.c.id_image == Image.id)
        .filter(t_WorkoutImage.c.id_workout == id_workout)
        .all()
    )

    return [model_to_dict(img) for img in rows]


def getIdUserOfWorkoutImage(img_name: str):
    row = (
        DB.session.query(Workout.id_user)
        .join(t_WorkoutImage, t_WorkoutImage.c.id_workout == Workout.id)
        .join(Image, Image.id == t_WorkoutImage.c.id_image)
        .filter(Image.name == img_name)
        .first()
    )

    return row[0] if row else None


# ------------------ update/delete workout ------------------

def updateUserWorkout_(idWorkout: int, idUser: int, description: str):
    (
        DB.session.query(Workout)
        .filter(
            Workout.id == idWorkout,
            Workout.id_user == idUser
        )
        .update({"description": description})
    )
    DB.session.commit()


def deleteUserWorkout_(idWorkout: int, idUser: int):
    (
        DB.session.query(Workout)
        .filter(
            Workout.id == idWorkout,
            Workout.id_user == idUser
        )
        .delete()
    )
    DB.session.commit()


# ------------------ news ------------------

def insertNews_(idUser: int, message: str, title: str, groups: list[str]):
    news = News(
        id_user_sender=idUser,
        message=message,
        title=title,
        data_publish=datetime.utcnow(),
        is_deleted=False,
        target_name=",".join(groups)
    )

    DB.session.add(news)
    DB.session.commit()


def notifyUserForWorkoutComment_(id_workout: int):
    workout = getUserWorkout(id_workout)
    if not workout:
        raise Exception("Workout non trovato")

    workout_date = workout.get("date", "<errore>")
    workout_id_user = workout.get("id_user")

    message = f"E' stato commentato il tuo allenamento del {workout_date}"
    title = f"Commento allenamento del {workout_date}"

    news = News(
        id_user_sender=1,
        message=message,
        title=title,
        data_publish=datetime.utcnow(),
        is_deleted=False,
        target_name=""
    )

    DB.session.add(news)
    DB.session.flush()

    user_news = UserNews(
        id_news=news.id,
        id_user=workout_id_user,
        is_read=False
    )

    DB.session.add(user_news)
    DB.session.commit()

def deleteNews_(id: int):
    (
        DB.session.query(News)
        .filter(News.id == id)
        .update({"is_deleted": True})
    )
    DB.session.commit()

# ------------------ images ------------------

def deleteImg_(name: str):
    (
        DB.session.query(Image)
        .filter(Image.name == name)
        .delete()
    )
    DB.session.commit()

# ------------------ user news ------------------

def queryInsertUserNews_(idNews: int, idUser: int):
    user_news = UserNews(
        id_news=idNews,
        id_user=idUser,
        is_read=False
    )

    DB.session.add(user_news)
    DB.session.commit()


def updateUserNewsRead_(id_news: int, id_user: int, is_read: bool):
    (
        DB.session.query(UserNews)
        .filter(
            UserNews.id_news == id_news,
            UserNews.id_user == id_user
        )
        .update({"is_read": is_read})
    )
    DB.session.commit()


def updateAllUserNewsRead_(id_user: int):
    (
        DB.session.query(UserNews)
        .filter(UserNews.id_user == id_user)
        .update({"is_read": True})
    )
    DB.session.commit()


# ------------------ insert workout ------------------

def insertWorkout_(idUser: int, date: str, description: str):
    w = Workout(
        id_user=idUser,
        date=date,
        description=description
    )

    DB.session.add(w)
    DB.session.commit()


def insertWorkoutImage_(id_workout: int, image_name: str):
    img = Image(name=image_name)
    DB.session.add(img)
    DB.session.flush()  # otteniamo img.id

    DB.session.execute(
        t_WorkoutImage.insert().values(
            id_workout=id_workout,
            id_image=img.id
        )
    )

    DB.session.commit()
