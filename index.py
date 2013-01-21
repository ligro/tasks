import cherrypy
import os

import Task

class App:
    @cherrypy.expose
    def index(self):
        # should return index.html
        return """<!DOCTYPE html>
<html>
    <head>
        <title>Tasks Manager</title>
        <link href="/styles/ui-darkness/jquery-ui-1.9.2.custom.min.css" rel="stylesheet" type="text/css" />
        <script type="application/javascript" src="/scripts/jquery-1.8.3.min.js"></script>
        <script type="application/javascript" src="/scripts/jquery-ui.js"></script>
        <script type="application/javascript" src="/scripts/dust-full-0.3.0.min.js"></script>
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
        <footer>
            Powered by Ligro
            <ul>
                <li>cherrypy</li>
                <li>jquery.ui</li>
                <li>dust.js</li>
            </ul>
        </footer>
    </body>
</html>"""

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def templates(self):
        tpl = {
                "addTask" : """<div>
                    <h1>Formulaire d'ajout de tache</h1>
                    <form action="javascript:void(0)">
                        <label>Name</label><input type="text" name="name" />
                        <label>Description</label><input type="text" name="desc" />
                        <!--
                        <label>Project</label><input type="text" name="project" />
                        <label>Feature</label><input type="text" name="feature" />
                        -->
                    </form>
                </div>"""
                }
        return tpl

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
