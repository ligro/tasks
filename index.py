import os, glob

import cherrypy

from admin import Admin
import auth
import user
from task import Task
import search
from taskconfig import config

# TODO make it RESTful http://docs.cherrypy.org/stable/progguide/REST.html
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
        self.auth = auth.controller()
        self.admin = Admin()
        self.user = user.Controller()

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

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def tasks(self, offset=0, limit=20, query=''):
        T = Task()
        if not isinstance(offset, int):
            offset = int(offset)
        if not isinstance(limit, int):
            limit = int(limit)

        if len(query) == 0:
            query = 'task:*'

        results = search.query(query, limit, offset)

        return results

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def task(self, id=None):
        t = Task();
        task = t.findById(id)
        if task['authorId'] == auth.userAuth['_id']:
            return task
        return None

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def savetask(self, **kw):
        # remove empty field
        task = {}
        for k in kw:
            if len(kw[k]) > 0:
                task[k] = kw[k]

        if 'task' not in task:
            return {'msgs': {'task': 'this can not be empty'}}

        ts = Task()
        task['authorId'] = auth.userAuth['_id']
        if 'tags' in task:
            task['tags'] = [x.strip() for x in task['tags'].split(',')]
        objId = ts.save(task)
        taskObj = ts.findById(objId)
        search.index(taskObj)
        search.flush()
        return {'success': True, 'datas': taskObj}

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def rmtask(self, id):
        task = {
            '_id': id,
            'authorId': auth.userAuth['_id']
        }
        # FIXME should we update with deleted state
        Task().delete(task)

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def reindex(self):
        return search.reindex()


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
        }
    },
    '/img': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.path.join(current_dir, 'img'),
        'tools.staticdir.content_types': {
            'png': 'image/png',
        }
    }
}

def application(environ, start_response):
    cherrypy.tree.mount(App(), '/', conf)
    return cherrypy.tree(environ, start_response)

if __name__ == '__main__':
    cherrypy.server.socket_port = config['httpserver']['port']
    cherrypy.server.socket_host = config['httpserver']['host']
    cherrypy.quickstart(App(), '/', conf)

