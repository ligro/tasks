from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from sqlalchemy import Column, Integer, String, UnicodeText, DateTime

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(Unicode, length=32)
    email = Column(Unicode, length=64)
    password = Column(Unicode, length=64)

    def _encodePwd(self, raw_pwd):
        import random

        algo = 'sha1'
        salt = ''.join(random.sample('abcdefghijklmnopqrstuvwxyz', 15))
        hsh = self._enc(algo, salt, raw_pwd)
        return '%s$%s$%s' % (algo, salt, hsh)

    def check_pwd(self, enc_pwd, raw_pwd):
        try:
            algo, salt, hsh = enc_pwd.split('$')
        except:
            return False

        return hsh == self._enc(algo, salt, raw_pwd)

    def _enc(self, algo, salt, pwd):
        import hashlib

        hl = hashlib.new(algo)
        hl.update('{0}{1}'.format(salt, pwd))
        return hl.hexdigest()

