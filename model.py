import pymongo, bson
from taskconfig import config

class Storage(object):
    def __init__(self):
        # retrieve these datas from config
        self.connection = pymongo.Connection(config['database']['host'], config['database']['port'])
        self.db = self.connection[config['database']['db_name']]

class Model(Storage):
    def __init__(self):
        super(Model, self).__init__()

    def _validate(self, datas):
        if isinstance(datas, dict):
            return self._validateOne(datas)

        for data in datas:
            data = self._validateOne(data)
        return datas

    def _validateOne(self, data):
        if '_id' in data:
            data['_id'] = bson.objectid.ObjectId(data['_id'])
        return data

    def _processAfterFind(self, data):
        data['_id'] = str(data['_id'])
        return data

    def save(self, datas):
        datas = self._validate(datas)
        return self.collection.save(datas)

    def delete(self, spec):
        spec['_id'] = bson.objectid.ObjectId(spec['_id'])
        return self.collection.remove(spec)

    def find(self, specs={}, limit=None):
        objs = {}
        for obj in self.collection.find(specs):
            objs[obj['_id']] = self._processAfterFind(obj)
        return objs

    def findOne(self, specs):
        obj = self.collection.find_one(specs)
        if obj is None:
            return None
        return self._processAfterFind(obj)

    def findById(self, id):
        obj = self.collection.find_one(bson.objectid.ObjectId(id))
        if obj is None:
            return None
        return self._processAfterFind(obj)

