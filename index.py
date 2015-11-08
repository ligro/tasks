import os, glob

import cherrypy

from admin import Admin
import auth
import user
import dashboard
import search
from taskconfig import config

import models

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
        if not os.path.isdir(self._cp_config['tools.sessions.storage_path']):
            os.makedirs(self._cp_config['tools.sessions.storage_path'])

        self.auth = auth.controller()
        self.admin = Admin()
        self.user = user.Controller()
        self.dashboard = dashboard.Controller()

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

    @cherrypy.expose
    @auth.require(auth.is_loggued())
    @cherrypy.tools.json_out()
    def dashboards(self):
        dashboards = []
        while dashboards == []:
            dashboards = models.session.query(models.Dashboard).filter(models.Dashboard.userId == auth.userAuth.id).limit(20).all()
            if dashboards == []:
                models.Dashboard.addDefault(auth.userAuth)

        return {d.id: d.toDict() for d in dashboards}

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def tasks(self, dashboardId=None, offset=0, limit=20, query=''):
        if dashboardId == '':
            dashboardId = None

        if not isinstance(offset, int):
            offset = int(offset)
        if not isinstance(limit, int):
            limit = int(limit)

        results = search.query(query, dashboardId, limit, offset)

        return results

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def task(self, id=None):
        task = models.session.query(models.Task).get(id)
        if not task or task.userId != auth.userAuth.id:
            # return 403 ?
            return {}

        return task.toDict()

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def savetask(self, **kw):
        # remove empty field
        if 'task' not in kw:
            return {'msgs': {'task': 'this can not be empty'}}

        if 'id' in kw:
            task = models.session.query(models.Task).get(kw['id'])
            if (task.userId != auth.userAuth.id):
                return {'success': False, 'msg': 'Forbidden'}

            task.dashboardId = kw['dashboardId']
            task.task = kw['task']
            # TODO enhance this
            for tag in task.tags:
                models.session.delete(tag)
        else:
            task = models.Task(userId=auth.userAuth.id, dashboardId=kw['dashboardId'], task=kw['task'])

        if 'tag' in kw:
            for tag in kw['tag'].split(','):
                tag.strip()
                task.tags.append(models.TaskTag(name=tag))

        task.save()
        models.commit()

        # move that code into task.save
        search.index(task)
        search.flush()
        return {'success': True, 'datas': task.toDict()}

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def rmtask(self, id):
        task = models.session.query(models.Task).get(id)

        if not task or task.userId != auth.userAuth.id:
            # return 403 ?
            return {'success': False}

        search.delete(task)
        search.flush()
        models.session.delete(task)
        models.commit()
        return {'success': True}

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

