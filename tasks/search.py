# -*- encoding: UTF-8 -*-
import os
import xapian
import json
from collections import OrderedDict
import threading

from tasks.config import config
import models

lang = 'en'
# for facet query
checkatlist = 10000

def query(query, userId, dashboardId, limit, offset=0):
    if len(query):
        q = _index.query_parser.parse_query(query)
    else:
        q = xapian.Query.MatchAll

    if userId:
        fq = xapian.Query(u'XA' + userId)
        q = xapian.Query(xapian.Query.OP_FILTER, q, fq)

    if dashboardId is not None:
        fq = xapian.Query(u'XD' + dashboardId)
        q = xapian.Query(xapian.Query.OP_FILTER, q, fq)

    try:
        [matches, spy1, spy2, spy3] = _index.query(q, offset, limit)
    except xapian.DatabaseModifiedError:
        # reopen
        _index.reopen()
        [matches, spy1, spy2, spy3] = _index.query(q, offset, limit)

    tasks = {}
    for match in matches:
        task = json.loads(match.document.get_data())
        tasks[task['id']] = task

    # facet
    tags = {}
    for spy in [spy1, spy2, spy3]:
        for facet in spy.values():
            if facet.term not in tags:
                tags[facet.term] = 0
            tags[facet.term] += facet.termfreq

    # sort facets
    tags = OrderedDict(sorted(tags.items(), key=lambda t: t[1], reverse=True))

    return {
        'tasks': tasks,
        'nbTasks':matches.get_matches_estimated(),
        'tags': tags
    }

def _emptyDir(directory):
    for file in os.listdir(directory):
        if os.path.isfile(os.path.join(directory, file)):
            os.remove(os.path.join(directory, file))
        else:
            _emptyDir(os.path.join(directory, file))
            os.rmdir(os.path.join(directory, file))

def reindex():
    offset = 0
    limit = 50

    _index.close_index()
    _emptyDir(config['index']['path'])
    _index.open_index()

    logs = []
    from datetime import datetime
    start = datetime.now()
    while True:
        logs.append("get tasks from {} to {} [{}]".format(offset, limit, datetime.now() - start))
        tasks = models.session.query(models.Task).limit(limit).offset(offset).all()
        if len(tasks) == 0:
            break

        logs.append( "begin to index {} tasks [{}]".format(len(tasks), datetime.now() - start))
        for task in tasks:
            index(task)

        flush()
        if len(tasks) < limit:
            break

        offset += limit

    return {'msg' : logs}

def index(task):

    doc = xapian.Document()

    doc.set_data(task.task)
    indexer = _index.get_indexer()
    indexer.set_document(doc)

    # index text
    indexer.index_text(task.task)

    if task.createdAt is not None:
        doc.add_value(2, task.createdAt.isoformat())

    # index tag as value for facet
    # this is not the best way to do that
    i = 3
    for tag in task.tags:
        doc.add_value(i, tag.name)
        i += 1

    # store data
    doc.set_data(json.dumps(task.toDict()))

    # add id
    idterm = _getDocId(task.id)
    doc.add_boolean_term(idterm)

    # add author
    doc.add_boolean_term(u'XA' + task.userId)

    # add dashboard
    if task.dashboardId is not None:
        doc.add_boolean_term(u'XD' + task.dashboardId)

    # add tags for filtering
    for tag in task.tags:
        doc.add_boolean_term(u'XT' + tag.name.lower())

    _index.add_doc(idterm, doc)

def delete(taskId):
    idterm = _getDocId(taskId)
    _index.del_doc(idterm)

def flush():
    _index.flush()

def _getDocId(id):
    return u"Q" + id

class Index:
    _sdb = None
    query_parser = None
    _semaphore = None

    def __init__(self):
        self.open_index()
        self._semaphore = threading.Semaphore(1)

    def __del__(self):
        self.close_index()

    def open_index(self):
        """Open an existing index. """
        dbpath = config['index']['path']
        try:
            self._sdb = xapian.Database(dbpath)
        except xapian.DatabaseOpeningError:
            # create the db
            self._openWritableIndex()
            self._sdb = xapian.Database(dbpath)

        self.query_parser = xapian.QueryParser()
        self.query_parser.set_database(self._sdb)
        self.query_parser.set_stemmer(xapian.Stem(lang))
        self.query_parser.add_boolean_prefix("tag", "XT")

    def close_index(self):
        if self._sdb:
            self._sdb.close()

    def reopen(self):
        self._sdb.reopen()
        #self.close_index()
        #self.open_index()

    def get_enquire(self):
        return xapian.Enquire(self._sdb)

    def get_indexer(self):
        indexer = xapian.TermGenerator()
        stemmer = xapian.Stem("english")
        indexer.set_stemmer(stemmer)
        return indexer

    def flush(self):
        self.reopen()

    def _openWritableIndex(self):
        dbpath = config['index']['path']
        return xapian.WritableDatabase(dbpath, xapian.DB_CREATE_OR_OPEN)

    def _closeWritableIndex(self, idb):
        idb.flush()
        idb.close()

    def add_doc(self, id, doc):
        with self._semaphore:
            idb = self._openWritableIndex()
            idb.replace_document(id, doc)
            self._closeWritableIndex(idb)

    def del_doc(self, id):
        with self._semaphore:
            idb = self._openWritableIndex()
            idb.delete_document(id)
            self._closeWritableIndex(idb)

    def query(self, query, offset, limit):
        enquire = _index.get_enquire()
        enquire.set_query(query)

        # facet
        spy1 = xapian.ValueCountMatchSpy(3)
        enquire.add_matchspy(spy1)
        spy2 = xapian.ValueCountMatchSpy(4)
        enquire.add_matchspy(spy2)
        spy3 = xapian.ValueCountMatchSpy(5)
        enquire.add_matchspy(spy3)

        return [enquire.get_mset(offset, limit, min(checkatlist, _index._sdb.get_doccount())), spy1, spy2, spy3]



_index = Index()
