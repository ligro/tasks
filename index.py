import cherrypy
import os

class HelloWorld:
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
        </header>
        <footer>
        </footer>
    </body>
</html>"""

    index.exposed = True

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
    cherrypy.quickstart(HelloWorld(), '/', config=conf)
