from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import create_engine
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, validates, relationship, class_mapper
from sqlalchemy.exc import DatabaseError

import uuid, datetime

import logging

from tasks.config import config

logging.basicConfig()
# TODO add this in config
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

Base = declarative_base()

# TODO force to use only one connection per thread with sqlite
engine = create_engine(config['database']['dsn'], connect_args={'check_same_thread':False})
Session = sessionmaker(bind=engine)
session = Session()

def commit():
    try:
        session.commit()
    except DatabaseError as e:
        session.rollback()
        import pprint
        pprint.pprint(e)

class DictableBase(object):
    def toDict(self, found=None):
        if found is None:
            found = []
        mapper = class_mapper(self.__class__)
        columns = [column.key for column in mapper.columns]
        get_key_value = lambda c: (c, getattr(self, c).isoformat()) if isinstance(getattr(self, c), datetime.datetime) else (c, getattr(self, c))
        out = dict(list(map(get_key_value, columns)))
        for name, relation in list(mapper.relationships.items()):
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
            raise Exception('id already defined')
        self.id = str(uuid.uuid1())

    def save(self):
        if self.id is None:
            self.genId()
        session.add(self)


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

