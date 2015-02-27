import cherrypy
from model import Model

import models
import auth

class Controller:
    """Dashboard controller"""

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def add(self, name):
        if name == '':
            return {'error': True, 'msgs' : errors}

        dashboard = models.Dashboard(userId=auth.userAuth.id, name=name)
        dashboard.save();
        models.session.commit();

        return {'success': True, 'datas': dashboard.toDict()}

# deprecated
class Dashboard(Model):
    def __init__(self):
        super(Dashboard, self).__init__()
        self.collection = self.db.dashboard

    def addDefault(self):
        dashboard = {
            'name': 'Default',
            'userId': auth.userAuth.id
        }
        self.save(dashboard)

