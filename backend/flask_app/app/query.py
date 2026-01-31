from typing import Any, Dict, List
from backend.flask_app.app.extensions import DB
from backend.flask_app.app.models_sqlalchemy import (
    File, MimeType, Planning, TrainingCard, UserNews, News, User, AccountType, UserAccountType, Workout, Image, t_WorkoutImage
)
from datetime import datetime
from sqlalchemy import func

# ------------------ helper ------------------

def model_to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

def getUserNewsRx_(idUser: int, limit: int, offset: int):
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

def getCountUserNewsRx_(id_user: int, is_read: bool | None = None):
    query = DB.session.query(DB.func.count(UserNews.id)) \
        .filter(UserNews.id_user == id_user)

    if is_read is not None:
        query = query.filter(UserNews.is_read == is_read)

    return query.scalar()

# ------------------ account types ------------------

def getUserAccountTypes_(idUser: int):
    rows = (
        DB.session.query(AccountType.type)
        .join(UserAccountType, UserAccountType.id_account_type == AccountType.id)
        .filter(UserAccountType.id_user == idUser)
        .all()
    )
    return [r[0] for r in rows]


# ------------------ news inviate ------------------

def getUserNewsTx_(idUser: int, limit: int, offset: int):
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

def getUserWorkouts_(idUser: int, startDate: str, endDate: str):
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


def getUserWorkout_(id_workout: int):
    w = (
        DB.session.query(Workout)
        .filter(Workout.id == id_workout)
        .first()
    )
    return model_to_dict(w) if w else None


# ------------------ workout images ------------------

def getWorkoutImages_(id_workout: int):
    rows = (
        DB.session.query(Image)
        .join(t_WorkoutImage, t_WorkoutImage.c.id_image == Image.id)
        .filter(t_WorkoutImage.c.id_workout == id_workout)
        .all()
    )

    return [model_to_dict(img) for img in rows]


def getIdUserOfWorkoutImage_(img_name: str):
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
    workout = getUserWorkout_(id_workout)
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

def get_target_id_users_(groups):
    stmt = (
       DB.select(User.id)
        .join(User.UserAccountType)
        .join(UserAccountType.AccountType_)
    )

    if "all" not in groups:
        stmt = stmt.where(AccountType.type.in_(groups))

    stmt = stmt.distinct()

    return DB.session.execute(stmt).scalars().all()

def get_month_plannings_(startDate, endDate):
    stmt = (
        DB.select(Planning)
        .where(Planning.date >= startDate)
        .where(Planning.date < endDate)
    )

    result = DB.session.execute(stmt).scalars().all()
    return [model_to_dict(p) for p in result]

def create_planning_(date, description):
    planning = Planning(
        date=date,
        description=description
    )

    DB.session.add(planning)
    DB.session.commit()

    return planning.id

def update_planning_(planning_id, description):
    stmt = (
        DB.update(Planning)
        .where(Planning.id == planning_id)
        .values(description=description)
    )

    DB.session.execute(stmt)
    DB.session.commit()

def delete_planning_(planning_id):
    planning = DB.session.get(Planning, planning_id)

    if planning is None:
        return False

    DB.session.delete(planning)
    DB.session.commit()
    return True

def get_training_cards_():
    stmt = (
        DB.select(
            TrainingCard.id,
            TrainingCard.name_card,
            TrainingCard.description,
            File.file_name,
            File.created_at,
            MimeType.mime_type,
        )
        .join(File, File.id == TrainingCard.id_file)
        .join(MimeType, MimeType.id == File.id_mime_type)
        .where(TrainingCard.deleted_at.is_(None))
    )

    result = DB.session.execute(stmt).mappings().all()

    return [dict(row) for row in result]

def db_create_training_card_(store_file_name: str, name: str, description: str) -> int | None:
    try:
        file = File(
            file_name=store_file_name,
            id_mime_type=1  # application/pdf
        )

        DB.session.add(file)
        DB.session.flush()  # ottiene file.id SENZA commit

        training_card = TrainingCard(
            id_file=file.id,
            name_card=name,
            description=description
        )

        DB.session.add(training_card)
        DB.session.commit()

        return training_card.id
    except Exception as e:
        DB.session.rollback()
        raise 

def db_soft_delete_training_card_(card_id: int) -> None:
    stmt = (
        DB.update(TrainingCard)
        .where(TrainingCard.id == card_id)
        .values(deleted_at=func.current_timestamp())
    )

    DB.session.execute(stmt)
    DB.session.commit()

def deleteNews_(id: int):
    (
        DB.session.query(News)
        .filter(News.id == id)
        .update({"is_deleted": True})
    )
    DB.session.commit()

def db_get_users_() -> List[Dict[str, Any]]:
    stmt = DB.select(User)
    users = DB.session.execute(stmt).scalars().all()

    return [model_to_dict(u) for u in users]

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
