import os, glob
import cherrypy
from controller import admin, auth, api
from taskconfig import config

class App:

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

        self.admin = admin.Controller()
        self.auth = auth.Controller()
        self.api = api.Controller()

    @cherrypy.expose
    def index(self):
        if auth.is_loggued()():
            tpl = 'views/loggued_index.html'
        else:
            tpl = 'views/index.html'

        tpl = os.path.join(os.path.dirname(os.path.abspath(__file__)), tpl)
        with open(tpl, 'r') as f:
            lines = f.readlines()
        return lines

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def templates(self):
        templates = {}
        for tpl in glob.glob('views/*.dust.html'):
            tplName = tpl[6:-10]
            templates[tplName] = ''
            with open(tpl, 'r') as f:
                templates[tplName] = ' '.join(f.readlines())
        return templates

current_dir = os.path.dirname(os.path.abspath(__file__))
conf = {
    '/static': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.path.join(current_dir, 'static'),
        'tools.staticdir.content_types': {
            'js': 'application/javascript',
            'css': 'text/css',
            'png': 'image/png',
            'woff': 'application/font-woff',
        }
    },
}

def application(environ, start_response):
    cherrypy.tree.mount(App(), '/', conf)
    return cherrypy.tree(environ, start_response)

if __name__ == '__main__':
    cherrypy.server.socket_port = config['httpserver']['port']
    cherrypy.server.socket_host = config['httpserver']['host']
    cherrypy.quickstart(App(), '/', conf)

