import task, task_mongo
import user, user_mongo

# TODO create Db session in config ?

U = UserMongo()
T = TaskMongo()

offset = 0
limit = 50
while True:
    print("get user from {} to {}".format(offset, limit))
    users = U.find({}, limit=limit, skip=offset)
    print( "begin to index {} users".format(len(users)))
    for user in users:
        sqlUser = user.User()
        sqlUser.name = user['pseudo']
        sqlUser.email = user['email']

        pwd = Password().findById(user['_id'])
        if pwd is not None:
            sqlUser.password = pwd['password']
        else:
            print("pwd not found for {}".format(user['_id']))

        taskoffset = 0
        tasklimit = 50
        while True:
            print("get tasks from {} to {}".format(taskoffset, tasklimit))
            tasks = T.find({}, limit=tasklimit, skip=taskoffset)
            print( "begin to index {} tasks".format(len(tasks)))
            for task in tasks:
                if 'tags' in tasks[task]:
                    tasks[task]['tag'] = tasks[task]['tags']

            if len(tasks) < tasklimit:
                break

            taskoffset += tasklimit

    if len(users) < limit:
        break

    offset += limit

