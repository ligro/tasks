import cherrypy

class HelloWorld:
    def index(self):
        # should return index.html
        return "Hello world!"

    index.exposed = True

cherrypy.quickstart(HelloWorld())

