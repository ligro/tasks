from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, validates

from sqlalchemy import Sequence, Column, Integer, String, UnicodeText, DateTime


Base = declarative_base()

# TODO add this in config
engine = create_engine('sqlite:///:memory:', echo=True)
Session = sessionmaker(bind=engine)
session = Session()
# TODO use event (find the good one) to handle createdAt and updatedAt column

class TBase:
    # FIXME use uuids ?
    id = Column(String(24), Sequence('user_id_seq'), primary_key=True)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)

class User(Base, TBase):
    __tablename__ = 'user'

    pseudo = Column(String(32))
    email = Column(String(100))
    password = Column(String(61))

    # TODO add other validates

    @validates('email')
    def validate_email(self, key, address):
        assert '@' in address
        return address

class Dashboard(Base, TBase):
    __tablename__ = 'dashboard'

    userId = Column(String(24))
    name = Column(String(32))

class Task(Base, TBase):
    __tablename__ = 'task'

    userId = Column(String(24))
    dashboardId = Column(String(24))
    task = Column(UnicodeText())

