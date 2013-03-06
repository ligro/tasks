import cherrypy
import os, glob
import pprint

from Model import Model

# TODO move that to Model
import bson

from auth import AuthController, require, member_of

# admin area
class RestrictedArea:

    # all methods in this controller (and subcontrollers) is
    # open only to members of the admin group

    _cp_config = {
        'auth.require': [member_of('admin')]
    }

    @cherrypy.expose
    def index(self):
        return """This is the admin only area."""

# TODO make it RESTful http://docs.cherrypy.org/stable/progguide/REST.html
class App:

    _cp_config = {
        'tools.sessions.on': True,
        'tools.auth.on': True
    }

    auth = AuthController()
    restricted = RestrictedArea()

    @cherrypy.expose
    def index(self):
        with open('views/index.html', 'r') as f:
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

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def state(self):
        t = Model()
        return t.collection.distinct('state')

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def tasks(self):
        tasks = {}
        t = Model()
        for task in t.find():
            task['_id'] = str(task['_id'])
            tasks[task['_id']] = task
        return tasks

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def task(self, id=None):
        t = Model();
        return t.findById(id)

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def savetask(self, **kw):
        if kw == {}:
            # fixme do a better handler
            return False

        data = kw
        if '_id' in data:
            data['_id'] = bson.objectid.ObjectId(data['_id'])

        ts = Model()
        objId = ts.save(data)
        taskObj = ts.collection.find_one(objId)
        taskObj['_id'] = str(taskObj['_id'])
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
