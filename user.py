import cherrypy
from model import Model

import models
import auth

class Controller:
    """User controller"""

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def create(self, **kw):

        formFields = [
                {'name': 'pseudo'},
                {'name': 'email'},
                {'name': 'password'},
                {'name': 'password_conf'}
        ]
        errors = {}
        for field in formFields:
            if field['name'] not in kw or kw[field['name']] == '':
                errors[field['name']] = "can not be empty"

        if 'password' not in errors and kw['password'] != kw['password_conf']:
            errors['password_conf'] = "passwords are different"

        if 'pseudo' not in errors:
            if session.query(User).filter(pseudo=User.pseudo).limit(1).one() is not None:
                errors['pseudo'] = "pseudo already exists"

        if 'email' not in errors:
            if session.query(User).filter(email=User.email).limit(1).one() is not None:
                errors['email'] = "email already exists"

        if len(errors) > 0:
            return {'error': True, 'msgs' : errors}

        user = models.User(pseudo=kw['pseudo'], email=kw['email'], password=kw['password'])
        user.save()

        auth.logIn(user)
        return {'success': True}

class User(Model):
    """user object"""
    def __init__(self):
        super(User, self).__init__()
        self.collection = self.db.user

    def _validate(self, datas):
        datas = super(User, self)._validate(datas)
        # todo
        return datas

class Password(Model):
    def __init__(self):
        super(Password, self).__init__()
        self.collection = self.db.password

    def _validateOne(self, data):
        data = super(Password, self)._validateOne(data)
        data['password'] = self._encodePwd(data['password'])
        return data

    def findOne(self, specs):
        return self.findOne(specs)

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

