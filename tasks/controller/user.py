import cherrypy

from tasks import models
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
            try:
                models.session.query(models.User).filter(models.User.pseudo == kw['pseudo']).limit(1).one()
                errors['pseudo'] = "pseudo already exists"
            except:
                pass

        if 'email' not in errors:
            try:
                models.session.query(models.User).filter(models.User.email == kw['email']).limit(1).one()
                errors['email'] = "email already exists"
            except:
                pass

        if len(errors) > 0:
            return {'error': True, 'msgs' : errors}

        user = models.User(pseudo=kw['pseudo'], email=kw['email'], password=kw['password'])
        user.encodePwd()
        user.save()
        models.commit()

        auth.logIn(user)
        return {'success': True}

