from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import create_engine
from sqlalchemy import Sequence, Column, Integer, String, UnicodeText, DateTime
from sqlalchemy import ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import sessionmaker, validates, relationship
from sqlalchemy.sql import func


import uuid

import logging
logging.basicConfig()
# TODO add this in config
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

Base = declarative_base()

# TODO add this in config
# TODO force to use only one connection per thread with sqlite
engine = create_engine('sqlite:///task.db', connect_args={'check_same_thread':False})
Session = sessionmaker(bind=engine)
session = Session()

class TBase(object):
    id = Column(String(36), primary_key=True)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, nullable=True)

    def genId(self):
        if self.id is not None:
            raise 'id already defined'
        self.id = str(uuid.uuid1())


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

    # FIXME check cascade works
    userId = Column(String(24), ForeignKey('user.id', onupdate="CASCADE", ondelete="CASCADE"))
    name = Column(String(32))

class Task(Base, TBase):
    __tablename__ = 'task'

    userId = Column(String(24), ForeignKey('user.id', onupdate="CASCADE", ondelete="CASCADE"))
    dashboardId = Column(String(24), ForeignKey('dashboard.id', onupdate="CASCADE", ondelete="CASCADE"))
    task = Column(UnicodeText())

    dashboard = relationship('Dashboard')
    tags = relationship('TaskTag', order_by='TaskTag.name')

class TaskTag(Base):
    __tablename__ = 'task_tag'

    taskId = Column(String(24), ForeignKey('task.id', onupdate="CASCADE", ondelete="CASCADE"))
    name = Column(String(30))

    __table_args__ = (
        PrimaryKeyConstraint('taskId', 'name'),
    )

from sqlalchemy import event
# standard decorator style
@event.listens_for(TBase, 'before_update')
def receive_before_update(mapper, connection, target):
    "listen for the 'before_update' event"
    target.updatedAt = func.now()

# FIXME needed ?
# FIXME can do alter table (otherwise store the db dump somewhere else).
#       may use this to generate the dump
Base.metadata.create_all(engine)

