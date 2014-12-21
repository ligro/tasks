# prevent cycle import
import auth

from task import Task
from user import User, Password
from dashboard import Dashboard
import models

from pprint import pprint

users = User().find()
for userId in users:
    oldUser = users[userId]
    oldUser['password'] = Password().findById(userId)['password']
    user = models.User(pseudo=oldUser['pseudo'], email=oldUser['email'], password=oldUser['password'])
    user.save()

    pprint(user.id)

    dashboards = Dashboard().find({'userId':userId})
    dashboardIdMapping = {}
    for dashboardId in dashboards:
        dashboard = models.Dashboard(userId=user.id, name=dashboards[dashboardId]["name"])
        dashboard.save()
        dashboardIdMapping[dashboardId] = dashboard.id
        pprint(dashboard.id)

    tasks = Task().find({'authorId':userId})
    for id in tasks:
        if tasks[id]['dashboardId'] in dashboardIdMapping:
            dashboardId = dashboardIdMapping[tasks[id]['dashboardId']]
        else:
            dashboardId = None
        #task = models.Task(userId=userId, dashboardId=dashboardId, task=tasks[id]['task'])
        task = models.Task(userId=user.id, dashboardId=dashboardId, task=tasks[id]['task'])
        for tag in tasks[id]['tag']:
            task.tags.append(models.TaskTag(name=tag))
        task.save()
        pprint(task.id)

models.session.commit()
