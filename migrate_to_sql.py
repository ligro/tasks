# prevent cycle import
import auth

from task import Task
from user import User, Password
from dashboard import Dashboard
import models

from pprint import pprint

users = User().find()
for id in users:
    users[id]['password'] = Password().findById(id)['password']
    user = models.User(users[id])
    models.session.add(user)
    del users[id]

tasks = Task().find()
for id in tasks:
    tasks[id]['tasks[id]Id'] = tasks[id]['authorId']
    del tasks[id]['authorId']
    models.session.add(models.Task(tasks[id]))
    del tasks[id]

dashboards = Dashboard().find()
for id in dashboards:
    models.session.add(models.Dashboard(dashboards[id]))

