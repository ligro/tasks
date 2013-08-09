import cherrypy
from model import Model

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
<<<<<<< HEAD
            if field['name'] not in kw:
                errors[field['name']] = "{0} field missing".format(field['name'])

        if 'password' not in errors and kw['password'] != kw['password_conf']:
            errors['password_conf'] = "passwords are different"

        userModel = User()
        if 'pseudo' not in errors:
            if userModel.findOne({'pseudo': kw['pseudo']}) is not None:
                errors['pseudo'] = "pseudo already exists"

        if 'email' not in errors:
            if userModel.findOne({'email': kw['email']}) is not None:
                errors['email'] = "email already exists"

        if len(errors) > 0:
            return {'error': True, 'msgs' : errors}
=======
            if field['name'] not in kw or kw[field['name']] == '':
                errors[field['name']] = "can not be empty"

        if len(errors) > 0:
            return {'error': True, 'msgs' : errors}

        if kw['password'] != kw['password_conf']:
            return {'error': True, 'msgs': ["passwords are different"]}

        userModel = User()
        if userModel.findOne({'email': kw['email']}) is not None:
            return {'error': True, 'msgs': "email already exists"}
>>>>>>> develop

        datas = {
            'email': kw['email'],
            'pseudo': kw['pseudo']
        }
        userId = userModel.save(datas)
        user = userModel.findById(userId)

        datas = {
                '_id': userId,
                'password': kw['password']
                }
        pwdModel = Password()
        pwdModel.save(datas)

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

