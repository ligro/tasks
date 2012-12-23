import cherrypy
import os
from simplejson import JSONEncoder

import Task

encoder = JSONEncoder()

def jsonify_tool_callback(*args, **kwargs):
    response = cherrypy.response
    response.headers['Content-Type'] = 'application/json'
    response.body = encoder.iterencode(response.body)

cherrypy.tools.jsonify = cherrypy.Tool('before_finalize', jsonify_tool_callback, priority=30)

class App:
    @cherrypy.expose
    def index(self):
        # should return index.html
        return """<!DOCTYPE html>
<html>
    <head>
        <title>Tasks Manager</title>
        <script type="application/javascript" src="/scripts/jquery-1.8.3.min.js"></script>
        <script type="application/javascript" src="/scripts/tasks.js"></script>
    </head>
    <body>
        <header>
            <a href="/" class="logo">Tasks Manager</a>
            <ul>
                <li><a href="javascript:void(0);" class="jLink" data-func="backlog">Backlog</a></li>
                <li><a href="javascript:void(0);" class="jLink" data-func="addtask">Create task</a></li>
            </ul>
        </header>
        <footer></footer>
    </body>
</html>"""

    @cherrypy.expose
    @cherrypy.tools.jsonify()
    def tasks(self, kind=None):
        # retrieve tasks
        # return it json encoded
        pass

    @cherrypy.expose
    @cherrypy.tools.jsonify()
    def task(self, id=None):
        # retrieve tasks
        # return it json encoded
        pass

    @cherrypy.expose
    @cherrypy.tools.jsonify()
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
        }
    }

    cherrypy.server.socket_port = 8081
    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.quickstart(App(), '/', config=conf)
