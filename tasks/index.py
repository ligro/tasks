import os, glob
import cherrypy
from tasks.controller import admin, auth, api
from tasks.config import config

class Tasks:

    _cp_config = {
        'tools.sessions.on': True,
        'tools.sessions.timeout': 60*24*30,
        'tools.sessions.storage_type': "file",
        # todo move that in config file
        # todo check this dir exists or create it
        'tools.sessions.storage_path': "/tmp/sessions/dev_tasks",
        'tools.auth.on': True
    }

    def __init__(self):
        if not os.path.isdir(self._cp_config['tools.sessions.storage_path']):
            os.makedirs(self._cp_config['tools.sessions.storage_path'])

        self.tplDir = os.path.dirname(os.path.abspath(__file__))

        self.admin = admin.Controller()
        self.auth = auth.Controller()
        self.api = api.Controller()

    @cherrypy.expose
    def index(self):
        if auth.is_loggued()():
            tpl = 'views/loggued_index.html'
        else:
            tpl = 'views/index.html'

        tpl = os.path.join(self.tplDir, tpl)
        with open(tpl, 'r') as f:
            lines = f.readlines()
        return lines

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def templates(self):
        templates = {}
        tplDir = os.path.dirname(os.path.abspath(__file__))
        for tpl in glob.glob(os.path.join(self.tplDir, 'views/*.dust.html')):
            tplName = os.path.basename(tpl)[0:-10]
            templates[tplName] = ''
            with open(tpl, 'r') as f:
                templates[tplName] = ' '.join(f.readlines())
        return templates
