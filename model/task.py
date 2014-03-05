from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from sqlalchemy import Column, Integer, String, UnicodeText, DateTime

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    description = Column(UnicodeText)
    tag = Column(Unicode, length=256)
    authorId = Column(Integer)
    creationDate = Column(DateTime)

