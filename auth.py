# -*- encoding: UTF-8 -*-
#
# Form based authentication for CherryPy. Requires the
# Session tool to be loaded.
#

import cherrypy
import pprint

SESSION_KEY = '_cp_username'

def check_credentials(username, password):
    """Verifies credentials for username and password.
    Returns None on success or a string describing the error on failure"""
    # Adapt to your needs
    # FIXME
    if username in ('joe', 'steve') and password == 'secret':
        return None
    else:
        return u"Incorrect username or password."

    # An example implementation which uses an ORM could be:
    # u = User.get(username)
    # if u is None:
    #     return u"Username %s is unknown to me." % username
    # if u.password != md5.new(password).hexdigest():
    #     return u"Incorrect password"

def check_auth(*args, **kwargs):
    """A tool that looks in config for 'auth.require'. If found and it
    is not None, a login is required and the entry is evaluated as a list of
    conditions that the user must fulfill"""
    username = cherrypy.session.get(SESSION_KEY)
    if username:
        cherrypy.request.login = username

    conditions = cherrypy.request.config.get('auth.require', None)
    if conditions is not None:
        if cherrypy.request.login:
            for condition in conditions:
                # A condition is just a callable that returns true or false
                if not condition():
                    raise cherrypy.HTTPError(403)
        else:
            raise cherrypy.HTTPError(403)

cherrypy.tools.auth = cherrypy.Tool('before_handler', check_auth)

def require(*conditions):
    """A decorator that appends conditions to the auth.require config
    variable."""
    def decorate(f):
        if not hasattr(f, '_cp_config'):
            f._cp_config = dict()
        if 'auth.require' not in f._cp_config:
            f._cp_config['auth.require'] = []
        f._cp_config['auth.require'].extend(conditions)
        return f
    return decorate

# Conditions are callables that return True
# if the user fulfills the conditions they define, False otherwise
#
# They can access the current username as cherrypy.request.login
#
# Define those at will however suits the application.

def is_loggued():
    """condition to check if a user is connected"""
    return lambda: cherrypy.session.get(SESSION_KEY) is not None


# These might be handy

def any_of(*conditions):
    """Returns True if any of the conditions match"""
    def check():
        for c in conditions:
            if c():
                return True
        return False
    return check

# By default all conditions are required, but this might still be
# needed if you want to use it inside of an any_of(...) condition
def all_of(*conditions):
    """Returns True if all of the conditions match"""
    def check():
        for c in conditions:
            if not c():
                return False
        return True
    return check


# Controller to provide login and logout actions

class controller(object):

    def on_login(self, username):
        """Called on successful login"""
        # TODO stats

    def on_logout(self, username):
        """Called on logout"""
        # TODO stats

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def login(self, login=None, password=None):
        if login is None or password is None:
            return {'success': False}

        error_msg = check_credentials(login, password)
        if error_msg:
            return {'success': False, 'error': error_msg}
        else:
            cherrypy.session[SESSION_KEY] = cherrypy.request.login = login
            self.on_login(login)
            return {'success': True}

    @cherrypy.expose
    def logout(self):
        sess = cherrypy.session
        username = sess.get(SESSION_KEY, None)
        sess[SESSION_KEY] = None
        if username:
            cherrypy.request.login = None
            self.on_logout(username)
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def create(self):
        return False
