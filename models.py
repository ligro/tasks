from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import create_engine
from sqlalchemy import Sequence, Column, Integer, String, UnicodeText, DateTime
from sqlalchemy import ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import sessionmaker, validates, relationship, class_mapper
from sqlalchemy.sql import func

import uuid, datetime

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

class DictableBase(object):
    def toDict(self, found=None):
        if found is None:
            found = []
        mapper = class_mapper(self.__class__)
        columns = [column.key for column in mapper.columns]
        get_key_value = lambda c: (c, getattr(self, c).isoformat()) if isinstance(getattr(self, c), datetime.datetime) else (c, getattr(self, c))
        out = dict(map(get_key_value, columns))
        for name, relation in mapper.relationships.items():
            if relation not in found:
                found.append(relation)
                related_obj = getattr(self, name)
                if related_obj is not None:
                    if relation.uselist:
                        out[name] = [child.toDict(found) for child in related_obj]
                    else:
                        out[name] = related_obj.toDict(found)
        return out

class TBase(DictableBase):
    id = Column(String(36), primary_key=True)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, nullable=True)

    def genId(self):
        if self.id is not None:
            raise 'id already defined'
        self.id = str(uuid.uuid1())

    def save(self):
        self.genId()
        session.add(self)

class User(Base, TBase):
    __tablename__ = 'user'

    pseudo = Column(String(32))
    email = Column(String(100))
    password = Column(String(61))

    # TODO add validates
    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email
        return email

    def encodePwd(self):
        import random

        algo = 'sha1'
        salt = ''.join(random.sample('abcdefghijklmnopqrstuvwxyz', 15))
        hsh = self._enc(algo, salt, self.password)
        self.password = '%s$%s$%s' % (algo, salt, hsh)

    def check_pwd(self, raw_pwd):
        algo, salt, hsh = self.password.split('$')
        try:
            algo, salt, hsh = self.password.split('$')
        except:
            return False

        return hsh == self._enc(algo, salt, raw_pwd)

    def _enc(self, algo, salt, pwd):
        import hashlib

        hl = hashlib.new(algo)
        hl.update('{0}{1}'.format(salt, pwd))
        return hl.hexdigest()

class Dashboard(Base, TBase):
    __tablename__ = 'dashboard'

    # FIXME check cascade works
    userId = Column(String(24), ForeignKey('user.id', onupdate="CASCADE", ondelete="CASCADE"))
    name = Column(String(32))

    @staticmethod
    def addDefault(user):
        dashboard = Dashboard(userId=user.id, name='default')
        dashboard.save()


class Task(Base, TBase):
    __tablename__ = 'task'

    userId = Column(String(24), ForeignKey('user.id', onupdate="CASCADE", ondelete="CASCADE"))
    dashboardId = Column(String(24), ForeignKey('dashboard.id', onupdate="CASCADE", ondelete="CASCADE"))
    task = Column(UnicodeText())

    dashboard = relationship('Dashboard')
    tags = relationship('TaskTag', order_by='TaskTag.name', cascade="save-update, merge, delete, delete-orphan")

    def toDict(self, found=None):
        data = super(TBase, self).toDict(found)
        if 'tags' in data:
            for i, tag in enumerate(data['tags']):
                data['tags'][i] = tag['name']
        return data

class TaskTag(Base, DictableBase):
    __tablename__ = 'task_tag'

    taskId = Column(String(24), ForeignKey('task.id', ondelete="CASCADE"))
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

