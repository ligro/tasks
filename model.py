#from pymongo import MongoClient
import pymongo, bson

class Storage(object):
    def __init__(self):
        # retrieve these datas from config
        self.connection = pymongo.Connection()
        self.db = self.connection.tasks

class Model(Storage):
    def __init__(self):
        super(Model, self).__init__()

    def _validate(self, datas):
        for data in datas:
            if '_id' in data:
                data['_id'] = bson.objectid.ObjectId(data['_id'])
        return datas

    def save(self, datas):
        datas = self._validate(datas)
        return self.collection.save(datas)

    def delete(self, spec):
        return self.collection.remove(spec)

    def find(self, specs={}):
        objs = {}
        for obj in self.collection.find(specs):
            obj['_id'] = str(obj['_id'])
            objs[obj['_id']] = obj
        return objs

    def findById(self, id):
        obj = self.collection.find_one(ObjectId(id))
        if '_id' in obj:
            obj['_id'] = str(obj['_id'])
        return obj

