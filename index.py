import os, glob

import cherrypy

from admin import Admin
import auth
import user
from task import Task

# TODO make it RESTful http://docs.cherrypy.org/stable/progguide/REST.html
class App:

    _cp_config = {
        'tools.sessions.on': True,
        'tools.sessions.timeout': 60*24*30,
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
    def tasks(self):
        T = Task()
        tasks = T.collection.find({'authorId' : auth.userAuth['_id']})
        datas = { 'tags': {}, 'state': {}, 'projects': {} }
        if (tasks is not None):
            datas['tags'] = tasks.distinct('tags')
            datas['state'] = tasks.distinct('state')
            datas['projects'] = tasks.distinct('project')
        #for k in tasks:
        #    datas['tasks'][k] = T._processAfterFind(tasks[k])
        datas['tasks'] = T.find({'authorId' : auth.userAuth['_id']})
        return datas

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
    cherrypy.server.socket_port = 8081
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.quickstart(App(), '/', conf)

