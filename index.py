import os
import cherrypy

from tasks import Tasks
from tasks.config import config


#def application(environ, start_response):
#    cherrypy.tree.mount(Tasks(), '/', conf)
#    return cherrypy.tree(environ, start_response)

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

cherrypy.server.socket_port = config['httpserver']['port']
cherrypy.server.socket_host = config['httpserver']['host']
cherrypy.quickstart(Tasks(), '/', conf)

