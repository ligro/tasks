from model import Model

class Task(Model):
    def __init__(self):
        super(Task, self).__init__()
        self.collection = self.db.task

