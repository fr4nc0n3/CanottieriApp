from typing import Any, Dict, List, Sequence
from backend.flask_app.app.extensions import DB
from backend.flask_app.app.models_sqlalchemy import (
    File,
    MimeType,
    Planning,
    TrainingCard,
    UserNews,
    News,
    User,
    AccountType,
    UserAccountType,
    Workout,
    Image,
    WorkoutComment,
    t_WorkoutImage,
)
from datetime import date, datetime
from sqlalchemy import func

# ------------------ helper ------------------


def model_to_dict(obj: Any) -> Dict[Any, Any]:
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


def get_dict_without_field(dictionary: dict, field: str) -> Dict[Any, Any]:
    result = {k: v for k, v in dictionary.items() if k != field}
    return result


def db_get_user_news_rx(id_user: int, limit: int, offset: int) -> Any:
    news_rx = (
        DB.session.query(
            UserNews.id.label("id_user_news"),
            News.title,
            News.message,
            News.data_publish,
            News.target_name,
            UserNews.is_read,
            User.name.label("sender_name"),
            UserNews.id_news,
        )
        .join(News, UserNews.id_news == News.id)
        .join(User, User.id == News.id_user_sender)
        .filter(UserNews.id_user == id_user, News.is_deleted == False)
        .order_by(News.data_publish.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )

    return [dict(n._mapping) for n in news_rx]


def db_get_count_user_news_rx(id_user: int, is_read: bool | None = None) -> Any:
    query = DB.session.query(DB.func.count(UserNews.id)).filter(
        UserNews.id_user == id_user
    )

    if is_read is not None:
        query = query.filter(UserNews.is_read == is_read)

    return query.scalar()


# ------------------ account types ------------------


def db_get_user_account_types(id_user: int) -> List[str]:
    rows = (
        DB.session.query(AccountType.type)
        .join(UserAccountType, UserAccountType.id_account_type == AccountType.id)
        .filter(UserAccountType.id_user == id_user)
        .all()
    )
    return [r[0] for r in rows]


# ------------------ news inviate ------------------


def db_get_user_news_tx(id_user: int, limit: int, offset: int) -> List[Dict[Any, Any]]:
    rows = (
        DB.session.query(News)
        .filter(News.id_user_sender == id_user, News.is_deleted == False)
        .limit(limit)
        .offset(offset)
        .all()
    )
    return [model_to_dict(n) for n in rows]


# ------------------ workouts ------------------


def db_get_user_workouts(id_user: int, start_date: str, end_date: str) -> List[Workout]:
    workouts = (
        DB.session.query(Workout)
        .filter(
            Workout.id_user == id_user,
            Workout.date >= start_date,
            Workout.date < end_date,
        )
        .all()
    )

    return workouts


def db_get_user_workout(id_workout: int) -> Workout | None:
    w = DB.session.query(Workout).filter(Workout.id == id_workout).first()
    return w


# ------------------ workout images ------------------


def db_get_workout_images(id_workout: int) -> List[Image]:
    images = (
        DB.session.query(Image)
        .join(t_WorkoutImage, t_WorkoutImage.c.id_image == Image.id)
        .filter(t_WorkoutImage.c.id_workout == id_workout)
        .all()
    )

    return images


def db_get_id_user_of_workout_image(img_name: str) -> int:
    workout = (
        DB.session.query(Workout)
        .join(t_WorkoutImage, t_WorkoutImage.c.id_workout == Workout.id)
        .join(Image, Image.id == t_WorkoutImage.c.id_image)
        .filter(Image.name == img_name)
        .first()
    )

    if workout is None:
        raise RuntimeError("workout is None")

    if workout.id_user is None:
        raise RuntimeError("workout.id_user is None")

    return workout.id_user


# ------------------ update/delete workout ------------------


def db_update_user_workout(id_workout: int, id_user: int, description: str) -> None:
    (
        DB.session.query(Workout)
        .filter(Workout.id == id_workout, Workout.id_user == id_user)
        .update({"description": description})
    )
    DB.session.commit()


def db_delete_user_workout(id_workout: int, id_user: int) -> None:
    (
        DB.session.query(Workout)
        .filter(Workout.id == id_workout, Workout.id_user == id_user)
        .delete()
    )
    DB.session.commit()


# ------------------ news ------------------


def db_insert_news(id_user: int, message: str, title: str, groups: list[str]) -> None:
    news = News(
        id_user_sender=id_user,
        message=message,
        title=title,
        data_publish=datetime.utcnow(),
        is_deleted=False,
        target_name=",".join(groups),
    )

    DB.session.add(news)
    DB.session.commit()


def db_notify_user_for_workout_comment(id_workout: int) -> None:
    workout = db_get_user_workout(id_workout)
    if not workout:
        raise Exception("Workout non trovato")

    workout_date = str(workout.date)
    workout_id_user = str(workout.id_user)

    message = f"E' stato commentato il tuo allenamento del {workout_date}"
    title = f"Commento allenamento del {workout_date}"

    news = News(
        id_user_sender=1,
        message=message,
        title=title,
        data_publish=datetime.utcnow(),
        is_deleted=False,
        target_name="",
    )

    DB.session.add(news)
    DB.session.flush()

    user_news = UserNews(id_news=news.id, id_user=workout_id_user, is_read=False)

    DB.session.add(user_news)
    DB.session.commit()


def db_get_target_id_users(groups: List[str]) -> Sequence[Any]:
    stmt = (
        DB.select(User.id).join(User.UserAccountType).join(UserAccountType.AccountType_)
    )

    if "all" not in groups:
        stmt = stmt.where(AccountType.type.in_(groups))

    stmt = stmt.distinct()

    return DB.session.execute(stmt).scalars().all()


def db_get_month_plannings(start_date: str, end_date: str) -> List[Dict[Any, Any]]:
    stmt = (
        DB.select(Planning)
        .where(Planning.date >= start_date)
        .where(Planning.date < end_date)
    )

    result = DB.session.execute(stmt).scalars().all()
    return [model_to_dict(p) for p in result]


def db_create_planning(date: date, description: str) -> int:
    planning = Planning(date=date, description=description)

    DB.session.add(planning)
    DB.session.commit()

    if planning.id is None:
        raise RuntimeError("planning.id is None")

    return planning.id


def db_update_planning(planning_id: int, description: str) -> None:
    stmt = (
        DB.update(Planning)
        .where(Planning.id == planning_id)
        .values(description=description)
    )

    DB.session.execute(stmt)
    DB.session.commit()


def db_delete_planning(planning_id: int) -> bool:
    planning = DB.session.get(Planning, planning_id)

    if planning is None:
        return False

    DB.session.delete(planning)
    DB.session.commit()
    return True


def db_get_training_cards() -> List[Dict[Any, Any]]:
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


def db_create_training_card(store_file_name: str, name: str, description: str) -> int:
    try:
        file = File(file_name=store_file_name, id_mime_type=1)  # application/pdf

        DB.session.add(file)
        DB.session.flush()  # ottiene file.id SENZA commit

        training_card = TrainingCard(
            id_file=file.id, name_card=name, description=description
        )

        DB.session.add(training_card)
        DB.session.commit()

        if training_card.id is None:
            raise RuntimeError("training_card.id is None")

        return training_card.id
    except Exception as e:
        DB.session.rollback()
        raise


def db_soft_delete_training_card(card_id: int) -> None:
    stmt = (
        DB.update(TrainingCard)
        .where(TrainingCard.id == card_id)
        .values(deleted_at=func.current_timestamp())
    )

    DB.session.execute(stmt)
    DB.session.commit()


def db_delete_news(id: int) -> None:
    (DB.session.query(News).filter(News.id == id).update({"is_deleted": True}))
    DB.session.commit()


def db_get_users() -> List[Dict[str, Any]]:
    stmt = DB.select(User)
    users = DB.session.execute(stmt).scalars().all()

    return [model_to_dict(u) for u in users]


def db_get_user(id: int) -> User | None:
    user = DB.session.query(User).filter(User.id == id).first()

    return user


# ------------------ images ------------------


def db_delete_img(name: str) -> None:
    (DB.session.query(Image).filter(Image.name == name).delete())
    DB.session.commit()


# ------------------ user news ------------------


def db_insert_user_news(id_news: int, id_user: int) -> int:
    user_news = UserNews(id_news=id_news, id_user=id_user, is_read=False)

    DB.session.add(user_news)
    DB.session.commit()

    if user_news.id is None:
        raise RuntimeError("user_news.id is None")

    return user_news.id


def db_update_user_news_read(id_news: int, id_user: int, is_read: bool) -> None:
    (
        DB.session.query(UserNews)
        .filter(UserNews.id_news == id_news, UserNews.id_user == id_user)
        .update({"is_read": is_read})
    )
    DB.session.commit()


def db_update_all_user_news_read(id_user: int) -> None:
    (
        DB.session.query(UserNews)
        .filter(UserNews.id_user == id_user)
        .update({"is_read": True})
    )
    DB.session.commit()


# ------------------ insert workout ------------------


def db_insert_workout_image(id_workout: int, image_name: str) -> None:
    img = Image(name=image_name)
    DB.session.add(img)
    DB.session.flush()

    DB.session.execute(
        t_WorkoutImage.insert().values(id_workout=id_workout, id_image=img.id)
    )

    DB.session.commit()


def db_insert_workout_comment(
    id_user_commentator: int, id_workout: int, description: str
) -> int:
    comment = WorkoutComment(
        id_user_commentator=id_user_commentator,
        id_workout=id_workout,
        description=description,
    )

    DB.session.add(comment)
    DB.session.commit()

    if comment.id is None:
        raise RuntimeError("comment.id is None")

    return comment.id


def db_get_workout_comments(id_workout: int) -> Sequence[Any]:
    stmt = DB.select(WorkoutComment)

    stmt = stmt.where(WorkoutComment.id_workout == id_workout)

    return DB.session.execute(stmt).scalars().all()


def db_update_workout_comment(id_wk_comment: int, description: str) -> None:
    stmt = (
        DB.update(WorkoutComment)
        .where(WorkoutComment.id == id_wk_comment)
        .values(description=description)
    )

    DB.session.execute(stmt)
    DB.session.commit()


def db_insert_workout(id_user: int, date: date, description: str) -> int:
    wk = Workout(id_user=id_user, date=date, description=description)

    DB.session.add(wk)
    DB.session.commit()

    if wk.id is None:
        raise RuntimeError("workout.id non valorizzato dopo commit")

    return wk.id
