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
            if field['name'] not in kw:
                errors[field['name']] = "%s field missing".format(field['name'])

        if len(errors) > 0:
            return {'error': True, 'msgs' : errors}

        if kw['password'] != kw['password_conf']:
            return {'error': True, 'msg': "passwords are different"}

        userModel = User()
        if userModel.findOne({'email': kw['email']}) is not None:
            return {'error': True, 'msg': "email already exists"}

        datas = {
            'email': kw['email'],
            'pseudo': kw['pseudo']
        }
        userId = userModel.save(datas)
        user = userModel.findById(userId)

        datas = {
                '_id': userId,
                'email': kw['email'],
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
        if 'password' in specs:
            specs['password'] = self._encodePwd(specs['password'])
        return self.findOne(specs)

    def _encodePwd(self, password):
        # todo encode it
        return password

