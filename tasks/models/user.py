from sqlalchemy import Column, String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import validates

from .models import Base, TBase

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


