import cherrypy

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
        models.commit();

        return {'success': True, 'datas': dashboard.toDict()}

