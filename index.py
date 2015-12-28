import os
import cherrypy

from tasks import Tasks
from tasks.config import config


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

# needed for uwsgi
def application(environ, start_response):
    cherrypy.tree.mount(Tasks(), '/', conf)
    return cherrypy.tree(environ, start_response)

# if we don't use uwsgi
if __name__ == '__main__':
    cherrypy.server.socket_port = config['httpserver']['port']
    cherrypy.server.socket_host = config['httpserver']['host']
    cherrypy.quickstart(Tasks(), '/', conf)

