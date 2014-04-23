import pymongo, bson

from taskconfig import config
from task import Task

T = Task()
offset = 0
limit = 50

logs = []
while True:
    print("get tasks from {} to {}".format(offset, limit))
    tasks = T.find({}, limit=limit, skip=offset)

    for id in tasks:
        task = tasks[id]
        if 'tag' not in task:
            task['tag'] = []

        if 'tags' in task:
            task['tag'] = task['tags']
            del task['tags']
        if 'state' in task:
            task['tag'].append(task['state'])
            del task['state']

        if 'project' in task:
            if not task['project'] == 'default':
                task['tag'].append(task['project'])
            del task['project']

        T.save(task)

    if len(tasks) < limit:
        break

    offset += limit


