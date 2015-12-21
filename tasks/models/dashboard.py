from sqlalchemy import Column, String
from sqlalchemy import ForeignKey

from models import Base, TBase

class Dashboard(Base, TBase):
    __tablename__ = 'dashboard'

    # FIXME check cascade works
    userId = Column(String(24), ForeignKey('user.id', onupdate="CASCADE", ondelete="CASCADE"))
    name = Column(String(32))

    @staticmethod
    def addDefault(user):
        dashboard = Dashboard(userId=user.id, name='default')
        dashboard.save()

