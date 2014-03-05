import cherrypy

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

        userModel = User()
        if 'pseudo' not in errors:
            if userModel.findOne({'pseudo': kw['pseudo']}) is not None:
                errors['pseudo'] = "pseudo already exists"

        if 'email' not in errors:
            if userModel.findOne({'email': kw['email']}) is not None:
                errors['email'] = "email already exists"

        if len(errors) > 0:
            return {'error': True, 'msgs' : errors}

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
