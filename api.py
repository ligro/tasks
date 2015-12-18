import cherrypy
import auth, user, dashboard, task
from taskconfig import config

import models

class Controller:

    def __init__(self):
        self.user = user.Controller()
        self.dashboard = dashboard.Controller()
        self.task = task.Controller()


