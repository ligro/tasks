import os, glob

import cherrypy

import pprint

from admin import Admin
import auth
import user
from task import Task

# TODO make it RESTful http://docs.cherrypy.org/stable/progguide/REST.html
class App:

    _cp_config = {
        'tools.sessions.on': True,
        'tools.auth.on': True
    }

    def __init__(self):
        self.auth = auth.controller()
        self.admin = Admin()
        self.user = user.Controller()

    @cherrypy.expose
    def index(self):
        if auth.is_loggued()() is not None:
            tpl = 'views/loggued_index.html'
        else:
            tpl = 'views/index.html'

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

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def state(self):
        t = Task()
        return t.collection.distinct('state')

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def tasks(self):
        tasks = {}
        t = Task()
        return t.find()

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def task(self, id=None):
        t = Task();
        return t.findById(id)

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def savetask(self, **kw):
        if kw == {}:
            # fixme do a better handler
            return False

        ts = Task()
        objId = ts.save(kw)
        taskObj = ts.findById(objId)
        return taskObj

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    conf = {
        '/js': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'js'),
            'tools.staticdir.content_types': {'js': 'application/javascript'}
        },
        '/css': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'css'),
            'tools.staticdir.content_types': {
                'css': 'text/css',
                'png': 'image/png',
            }
        }
    }

    cherrypy.server.socket_port = 8081
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.quickstart(App(), '/', config=conf)
