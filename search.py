# -*- encoding: UTF-8 -*-
import os
import xapian
import json

import auth
from taskconfig import config
from task import Task

lang = 'en'

def index(task):

    doc = xapian.Document()

    doc.set_data(task['task'])
    indexer = _index.get_indexer()
    indexer.set_document(doc)

    # index text
    indexer.index_text(task['task'])

    # index tag as value for facet
    if 'tags' in task:
        # this is not the best way to do that
        doc.add_value(2, ' '.join(task['tags']))

    # store data
    doc.set_data(json.dumps(task))

    # add id
    idterm = u"Q" + task['_id']
    doc.add_boolean_term(idterm)

    # add author
    doc.add_boolean_term(u'XA' + task['authorId'])

    # add tags for filtering
    if 'tags' in task:
        for tag in task['tags']:
            doc.add_boolean_term(u'XT' + tag.lower())

    _index.add_doc(idterm, doc)

def flush():
    _index.flush()

def query(query, limit, offset=0):
    if len(query):
        q = _index.query_parser.parse_query(query)
    else:
        q = xapian.Query.MatchAll

    if auth.userAuth is not None:
        fq = xapian.Query(u'XA' + auth.userAuth['_id'])
        q = xapian.Query(xapian.Query.OP_FILTER, q, fq)

    enquire = _index.get_enquire()
    enquire.set_query(q)

    # facet
    spy = xapian.ValueCountMatchSpy(2)
    enquire.add_matchspy(spy)

    tasks = {}
    matches = enquire.get_mset(offset, limit)
    for match in matches:
        tasks[match.docid] = json.loads(match.document.get_data())

    # facet
    tags = []
    for facet in spy.values():
        tags.append(facet.term)

    return {
        'tasks': tasks,
        'nbTasks':matches.get_matches_estimated(),
        'tags': tags
    }

def reindex():
    T = Task()
    offset = 0
    limit = 50

    logs = []
    while True:
        logs.append("get tasks from {} to {}".format(offset, limit))
        tasks = T.find({}, limit=limit, skip=offset)
        if len(tasks) == 0:
            break

        logs.append( "begin to index {} tasks".format(len(tasks)))
        for task in tasks:
            if 'tags' in tasks[task]:
                tasks[task]['tag'] = tasks[task]['tags']
            index(tasks[task])

        flush()
        if len(tasks) < limit:
            break

        offset += limit

    return {'msg' : logs}

class Index:
    _sdb = None
    _idb = None
    query_parser = None

    def __init__(self):
        self.open_index(config['index']['path'])

    def __del__(self):
        if self._sdb:
            self._sdb.close()
        if self._idb:
            self._idb.flush()
            self._idb.close()

    def open_index(self, dbpath):
        """Open an existing index. """
        self._idb = xapian.WritableDatabase(dbpath, xapian.DB_CREATE_OR_OPEN)
        self._sdb = xapian.Database(dbpath)

        self.query_parser = xapian.QueryParser()
        self.query_parser.set_database(self._sdb)
        self.query_parser.set_stemmer(xapian.Stem(lang))
        self.query_parser.add_boolean_prefix("tag", "XT")

    def get_enquire(self):
        return xapian.Enquire(self._sdb)

    def get_indexer(self):
        indexer = xapian.TermGenerator()
        stemmer = xapian.Stem("english")
        indexer.set_stemmer(stemmer)
	return indexer


    def flush(self):
        self._idb.flush()
        # todo close the db connection

    def add_doc(self, id, doc):
        self._idb.replace_document(id, doc)

_index = Index()
