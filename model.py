#from pymongo import MongoClient
import pymongo

class Storage(object):
    def __init__(self):
        # retrieve these datas from config
        self.connection = pymongo.Connection()
        self.db = self.connection.tasks

class Model(Storage):
    def __init__(self):
        super(Model, self).__init__()
        self.collection = self.db.task

    def _validate(self, datas):
        return datas

    def save(self, datas):
        datas = self._validate(datas)
        return self.collection.save(datas)

    def delete(self, spec):
        return self.collection.remove(spec)

    def find(self, specs={}):
        return self.collection.find(specs)

    def findById(self, id):
        return self.collection.find_one(ObjectId(id))

