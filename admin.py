import cherrypy

# admin area
class Admin:

    # all methods in this controller (and subcontrollers) is
    # open only to members of the admin group

    _cp_config = {
        #'auth.require': [member_of('admin')]
    }

    @cherrypy.expose
    def index(self):
        return """This is the admin only area."""


