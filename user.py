import cherrypy
from model import Model

import pprint

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
            pprint.pprint(field)
            if field['name'] not in kw:
                # TODO return error msg
                return False

        datas = kw
        objId = User.save(datas)
        user = ts.collection.find_one(objId)
        return user

class User(Model):
    """user object"""
    def __init__(self):
        super(User, self).__init__()
        self.collection = self.db.user

    def _validate(self, datas):
        datas = super(User, self)._validate(datas)
        # todo
        return datas
