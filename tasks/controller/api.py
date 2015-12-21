import user, dashboard, task

class Controller:

    def __init__(self):
        self.user = user.Controller()
        self.dashboard = dashboard.Controller()
        self.task = task.Controller()


