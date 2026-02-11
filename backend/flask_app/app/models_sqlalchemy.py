from typing import Optional
import datetime

from sqlalchemy import CheckConstraint, Column, Date, DateTime, ForeignKey, Integer, Table, Text, UniqueConstraint, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class AccountType(Base):
    __tablename__ = 'AccountType'

    type: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    UserAccountType: Mapped[list['UserAccountType']] = relationship('UserAccountType', back_populates='AccountType_')


class Image(Base):
    __tablename__ = 'Image'

    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    Workout: Mapped[list['Workout']] = relationship('Workout', secondary='WorkoutImage', back_populates='Image_')


class MimeType(Base):
    __tablename__ = 'MimeType'

    mime_type: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    File: Mapped[list['File']] = relationship('File', back_populates='MimeType_')


class Planning(Base):
    __tablename__ = 'Planning'

    date: Mapped[datetime.date] = mapped_column(Date, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)


class User(Base):
    __tablename__ = 'User'

    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    enable: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('1'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    email_verified: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)
    birthday: Mapped[Optional[datetime.date]] = mapped_column(Date, server_default=text('NULL'))
    last_sub_date: Mapped[Optional[datetime.date]] = mapped_column(Date, server_default=text('NULL'))
    expiration_sub_date: Mapped[Optional[datetime.date]] = mapped_column(Date, server_default=text('NULL'))
    phone: Mapped[Optional[str]] = mapped_column(Text, server_default=text('NULL'))
    email: Mapped[Optional[str]] = mapped_column(Text, server_default=text('NULL'))
    profile_img_url: Mapped[Optional[str]] = mapped_column(Text, server_default=text('NULL'))

    News: Mapped[list['News']] = relationship('News', back_populates='User_')
    UserAccountType: Mapped[list['UserAccountType']] = relationship('UserAccountType', back_populates='User_')
    Workout: Mapped[list['Workout']] = relationship('Workout', back_populates='User_')
    UserNews: Mapped[list['UserNews']] = relationship('UserNews', back_populates='User_')
    WorkoutComment: Mapped[list['WorkoutComment']] = relationship('WorkoutComment', back_populates='User_')


class DbSchemaVersion(Base):
    __tablename__ = 'db_schema_version'

    version: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    installed_on: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)


class File(Base):
    __tablename__ = 'File'

    file_name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    id_mime_type: Mapped[int] = mapped_column(ForeignKey('MimeType.id'), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    MimeType_: Mapped['MimeType'] = relationship('MimeType', back_populates='File')
    TrainingCard: Mapped['TrainingCard'] = relationship('TrainingCard', uselist=False, back_populates='File_')


class News(Base):
    __tablename__ = 'News'

    message: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    data_publish: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    is_deleted: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)
    id_user_sender: Mapped[Optional[int]] = mapped_column(ForeignKey('User.id', ondelete='CASCADE'))
    deleted_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('NULL'))
    target_name: Mapped[Optional[str]] = mapped_column(Text, server_default=text('NULL'))

    User_: Mapped[Optional['User']] = relationship('User', back_populates='News')
    UserNews: Mapped[list['UserNews']] = relationship('UserNews', back_populates='News_')


class PlanningRace(Planning):
    __tablename__ = 'PlanningRace'

    planning_id: Mapped[Optional[int]] = mapped_column(ForeignKey('Planning.id', ondelete='CASCADE'), primary_key=True)


class PlanningTraining(Planning):
    __tablename__ = 'PlanningTraining'
    __table_args__ = (
        CheckConstraint('intensity_percentage BETWEEN 0 AND 100'),
    )

    intensity_percentage: Mapped[int] = mapped_column(Integer, nullable=False)
    planning_id: Mapped[Optional[int]] = mapped_column(ForeignKey('Planning.id', ondelete='CASCADE'), primary_key=True)


class UserAccountType(Base):
    __tablename__ = 'UserAccountType'
    __table_args__ = (
        UniqueConstraint('id_user', 'id_account_type'),
    )

    id_user: Mapped[int] = mapped_column(ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    id_account_type: Mapped[int] = mapped_column(ForeignKey('AccountType.id'), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    AccountType_: Mapped['AccountType'] = relationship('AccountType', back_populates='UserAccountType')
    User_: Mapped['User'] = relationship('User', back_populates='UserAccountType')


class Workout(Base):
    __tablename__ = 'Workout'
    __table_args__ = (
        UniqueConstraint('id_user', 'date'),
    )

    id_user: Mapped[int] = mapped_column(ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    Image_: Mapped[list['Image']] = relationship('Image', secondary='WorkoutImage', back_populates='Workout')
    User_: Mapped['User'] = relationship('User', back_populates='Workout')
    WorkoutComment: Mapped[list['WorkoutComment']] = relationship('WorkoutComment', back_populates='Workout_')


class TrainingCard(Base):
    __tablename__ = 'TrainingCard'

    id_file: Mapped[int] = mapped_column(ForeignKey('File.id'), nullable=False, unique=True)
    name_card: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("''"))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)
    deleted_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('NULL'))

    File_: Mapped['File'] = relationship('File', back_populates='TrainingCard')


class UserNews(Base):
    __tablename__ = 'UserNews'
    __table_args__ = (
        UniqueConstraint('id_news', 'id_user'),
    )

    id_news: Mapped[int] = mapped_column(ForeignKey('News.id', ondelete='CASCADE'), nullable=False)
    id_user: Mapped[int] = mapped_column(ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    is_read: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    News_: Mapped['News'] = relationship('News', back_populates='UserNews')
    User_: Mapped['User'] = relationship('User', back_populates='UserNews')


class WorkoutComment(Base):
    __tablename__ = 'WorkoutComment'

    id_user_commentator: Mapped[int] = mapped_column(ForeignKey('User.id'), nullable=False)
    id_workout: Mapped[int] = mapped_column(ForeignKey('Workout.id', ondelete='CASCADE'), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True)

    User_: Mapped['User'] = relationship('User', back_populates='WorkoutComment')
    Workout_: Mapped['Workout'] = relationship('Workout', back_populates='WorkoutComment')


t_WorkoutImage = Table(
    'WorkoutImage', Base.metadata,
    Column('id_workout', ForeignKey('Workout.id', ondelete='CASCADE'), primary_key=True),
    Column('id_image', ForeignKey('Image.id', ondelete='CASCADE'), primary_key=True, unique=True)
)
