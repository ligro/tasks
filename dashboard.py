import cherrypy
from model import Model

import auth

class Controller:
    """Dashboard controller"""

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def add(self, name):
        if name == '':
            return {'error': True, 'msgs' : errors}

        dashboard = {
            'name': name,
            'userId': auth.userAuth['_id']
        }

        D = Dashboard()
        id = D.save(dashboard)
        dashboard = D.findById(id)
        dashboard['id'] =  dashboard['_id']
        del dashboard['_id']
        del dashboard['userId']

        return {'success': True, 'datas': dashboard}

class Dashboard(Model):
    def __init__(self):
        super(Dashboard, self).__init__()
        self.collection = self.db.dashboard

    def addDefault(self):
        dashboard = {
            'name': 'Default',
            'userId': auth.userAuth['_id']
        }
        D.save(dashboard)

