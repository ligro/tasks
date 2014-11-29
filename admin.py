import os
import cherrypy
from models import session, User, Dashboard, Task

# admin area
class Admin:

    # all methods in this controller (and subcontrollers) is
    # open only to members of the admin group

    _cp_config = {
        #'auth.require': [member_of('admin')]
    }

    @cherrypy.expose
    def index(self):
        tpl = 'views/admin.html'

        tpl = os.path.join(os.path.dirname(os.path.abspath(__file__)), tpl)
        with open(tpl, 'r') as f:
            lines = f.readlines()
        return lines

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def user(self, offset=0, limit=10, email=None, pseudo=None):
        users = []
        for row in session.query(User).order_by(User.createdAt).limit(limit).offset(offset).all():
            user = {
                'id' : row.id,
                'pseudo' : row.pseudo,
                'email' : row.email,
            }
            users.append(user)

        return {'users' : users}

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def usertasks(self, offset=0, limit=10, userId=None):
        tasks = []
        from pprint import pprint
        for row in session.query(Task).filter(Task.userId == userId).order_by(Task.createdAt).limit(limit).offset(offset).all():
            task = {
                'id' : row.id,
                'task' : row.task,
                'tag' : [tag.name for tag in row.tags],
                'dashboard' : row.dashboard.name if row.dashboard is not None else None,
            }
            tasks.append(task)

        return {'tasks' : tasks}

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def dashboard(self, userId, offset=0, limit=10):
        dashboards = []
        query = session.query(Dashboard)
        query.filter(Dashboard.userId == userId)

        query.order_by(Dashboard.id).limit(limit).offset(offset)

        for row in query.all():
            dashboard = {
                'id' : row.id,
                'name' : row.name,
            }
            dashboards.append(dashboard)

        return {'dashboards' : dashboards}


