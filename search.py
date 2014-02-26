# -*- encoding: UTF-8 -*-
import os
import xapian
import json

import auth
from taskconfig import config
from task import Task

lang = 'en'
# for facet query
checkatlist = 10000

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
    spy1 = xapian.ValueCountMatchSpy(3)
    enquire.add_matchspy(spy1)
    spy2 = xapian.ValueCountMatchSpy(4)
    enquire.add_matchspy(spy2)
    spy3 = xapian.ValueCountMatchSpy(5)
    enquire.add_matchspy(spy3)

    tasks = {}
    matches = enquire.get_mset(offset, limit, min(checkatlist, _index._sdb.get_doccount()))
    for match in matches:
        tasks[match.docid] = json.loads(match.document.get_data())

    # facet
    tags = {}
    for spy in [spy1, spy2, spy3]:
        for facet in spy.values():
            if facet.term not in tags:
                tags[facet.term] = 0
            tags[facet.term] += facet.termfreq

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

def index(task):

    doc = xapian.Document()

    doc.set_data(task['task'])
    indexer = _index.get_indexer()
    indexer.set_document(doc)

    # index text
    indexer.index_text(task['task'])

    if 'created_at' in task:
        doc.add_value(2, task['created_at'])

    # index tag as value for facet
    if 'tag' in task:
        if isinstance(task['tag'], list):
            # this is not the best way to do that
            i = 3
            for tag in task['tag']:
                doc.add_value(i, tag)
                i += 1
        else:
            doc.add_value(3, task['tag'])

    # store data
    doc.set_data(json.dumps(task))

    # add id
    idterm = u"Q" + task['_id']
    doc.add_boolean_term(idterm)

    # add author
    doc.add_boolean_term(u'XA' + task['authorId'])

    # add tags for filtering
    if 'tag' in task:
        if isinstance(task['tag'], list):
            for tag in task['tag']:
                doc.add_boolean_term(u'XT' + tag.lower())
        else:
            doc.add_boolean_term(u'XT' + task['tag'].lower())

    _index.add_doc(idterm, doc)

def flush():
    _index.flush()


class Index:
    _sdb = None
    _idb = None
    query_parser = None

    def __init__(self):
        self.open_index()

    def __del__(self):
        self.close_index()

    def open_index(self):
        """Open an existing index. """
        dbpath = config['index']['path']
        self._idb = xapian.WritableDatabase(dbpath, xapian.DB_CREATE_OR_OPEN)
        self._sdb = xapian.Database(dbpath)

        self.query_parser = xapian.QueryParser()
        self.query_parser.set_database(self._sdb)
        self.query_parser.set_stemmer(xapian.Stem(lang))
        self.query_parser.add_boolean_prefix("tag", "XT")

    def close_index(self):
        if self._sdb:
            self._sdb.close()
        if self._idb:
            self._idb.flush()
            self._idb.close()

    def reopen(self):
        self.close_index()
        self.open_index()

    def get_enquire(self):
        return xapian.Enquire(self._sdb)

    def get_indexer(self):
        indexer = xapian.TermGenerator()
        stemmer = xapian.Stem("english")
        indexer.set_stemmer(stemmer)
	return indexer


    def flush(self):
        self.reopen()


    def add_doc(self, id, doc):
        self._idb.replace_document(id, doc)

_index = Index()
