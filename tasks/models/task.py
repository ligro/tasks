from sqlalchemy import Column, String, UnicodeText
from sqlalchemy import ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship

from .models import Base, TBase, DictableBase

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


