# -*- encoding: UTF-8 -*-
#
# Form based authentication for CherryPy. Requires the
# Session tool to be loaded.
#

import cherrypy

from user import User, Password

SESSION_KEY = '_cp_id'
userAuth = None

def check_credentials(pseudo, password):
    """Verifies credentials for pseudo and password.
    Returns None on success or a string describing the error on failure"""
    user = User().findOne({'$or':[{'pseudo' : pseudo},{'email' : pseudo}]})
    if user is None:
        return None
    pwd = Password().findById(user['_id'])
    if pwd is None or pwd['password'] != password:
        return None
    return user

    # An example implementation which uses an ORM could be:
    # u = User.get(pseudo)
    # if u is None:
    #     return u"pseudo %s is unknown to me." % pseudo
    # if u.password != md5.new(password).hexdigest():
    #     return u"Incorrect password"

def check_auth(*args, **kwargs):
    """A tool that looks in config for 'auth.require'. If found and it
    is not None, a login is required and the entry is evaluated as a list of
    conditions that the user must fulfill"""
    global userAuth
    id = cherrypy.session.get(SESSION_KEY)
    cherrypy.request.id = id
    if id is not None:
        userAuth = User().findById(id)

    conditions = cherrypy.request.config.get('auth.require', None)
    if conditions is not None:
        if cherrypy.request.id:
            for condition in conditions:
                # A condition is just a callable that returns true or false
                if not condition():
                    raise cherrypy.HTTPError(403)
        else:
            raise cherrypy.HTTPError(403)

cherrypy.tools.auth = cherrypy.Tool('before_handler', check_auth)

def logIn(user):
    cherrypy.session[SESSION_KEY] = user['_id']
    cherrypy.request.id = user['_id']

def logOut():
    sess = cherrypy.session
    pseudo = sess.get(SESSION_KEY, None)
    sess[SESSION_KEY] = None
    if pseudo:
        cherrypy.request.id = None

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
# They can access the current pseudo as cherrypy.request.id
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

    def on_login(self, pseudo):
        """Called on successful login"""
        # TODO stats

    def on_logout(self, pseudo):
        """Called on logout"""
        # TODO stats

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def login(self, login=None, password=None):
        if login is None or password is None:
            return {'success': False}

        user = check_credentials(login, password)
        if user is None:
            return {'success': False, 'msgs': [u"Incorrect pseudo or password."]}

        logIn(user)
        return {'success': True}

    @cherrypy.expose
    def logout(self):
        logOut()
        raise cherrypy.HTTPRedirect("/")

