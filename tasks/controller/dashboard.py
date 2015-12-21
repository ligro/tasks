import cherrypy

from tasks import models
import auth

class Controller:
    """Dashboard controller"""

    @cherrypy.expose
    @auth.require(auth.is_loggued())
    @cherrypy.tools.json_out()
    def index(self):
        dashboards = []
        while dashboards == []:
            dashboards = models.session.query(models.Dashboard).filter(models.Dashboard.userId == auth.userAuth.id).limit(20).all()
            if dashboards == []:
                models.Dashboard.addDefault(auth.userAuth)

        return {d.id: d.toDict() for d in dashboards}

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

