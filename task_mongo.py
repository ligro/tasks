from model_mongo import Model

class TaskMongo(Model):
    def __init__(self):
        super(Task, self).__init__()
        self.collection = self.db.task

