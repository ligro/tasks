import cherrypy
import os, glob

import pprint

import Task

class App:
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
    def tasks(self, kind=None):
        # retrieve tasks
        # return it json encoded
        pass

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def task(self, id=None):
        # retrieve tasks
        # return it json encoded
        pass

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def savetask(self, task=None):
        if task == None:
            # fixme do a better handler
            return False

        ts = Task.Task()
        return ts.insert(task)

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    conf = {
        '/scripts': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'scripts'),
            'tools.staticdir.content_types': {'js': 'application/javascript'}
        },
        '/styles': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'styles'),
            'tools.staticdir.content_types': {
                'css': 'text/css',
                'png': 'image/png',
            }
        }
    }

    cherrypy.server.socket_port = 8081
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.quickstart(App(), '/', config=conf)
