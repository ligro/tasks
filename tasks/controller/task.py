import cherrypy

from tasks import models, search
from . import auth

class Controller:

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, dashboardId=None, offset=0, limit=20, query=''):
        if dashboardId == '':
            dashboardId = None

        if not isinstance(offset, int):
            offset = int(offset)
        if not isinstance(limit, int):
            limit = int(limit)

        results = search.query(query, auth.userAuth.id, dashboardId, limit, offset)

        return results

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def save(self, **kw):
        # remove empty field
        if 'task' not in kw:
            return {'msgs': {'task': 'this can not be empty'}}

        if 'id' in kw:
            task = models.session.query(models.Task).get(kw['id'])
            if (task.userId != auth.userAuth.id):
                return {'success': False, 'msg': 'Forbidden'}

            task.dashboardId = kw['dashboardId']
            task.task = kw['task']
            # TODO enhance this
            for tag in task.tags:
                models.session.delete(tag)
        else:
            task = models.Task(userId=auth.userAuth.id, dashboardId=kw['dashboardId'], task=kw['task'])

        if 'tag' in kw:
            for tag in kw['tag'].split(','):
                tag.strip()
                task.tags.append(models.TaskTag(name=tag))

        task.save()
        models.commit()

        # move that code into task.save
        search.index(task)
        search.flush()
        return {'success': True, 'datas': task.toDict()}

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def rm(self, id):
        task = models.session.query(models.Task).get(id)

        if not task or task.userId != auth.userAuth.id:
            # return 403 ?
            return {'success': False}

        search.delete(task)
        search.flush()
        models.session.delete(task)
        models.commit()
        return {'success': True}

    @auth.require(auth.is_loggued())
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def reindex(self):
        return search.reindex()


