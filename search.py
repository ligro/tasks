# -*- encoding: UTF-8 -*-
import os
import xapian

import auth
from taskconfig import config

def index(task):

    doc = xapian.Document()

    doc.set_data(task['task'])
    indexer = _index.get_indexer()
    indexer.set_document(doc)
    indexer.index_text(task['task'])
    
    doc.add_value(0, task['_id'])
    doc.add_value(1, task['authorId'])
    if 'tag' in task:
        doc.add_value(2, ' '.join(task['tag']))

    _index.add_doc(doc)

def flush():
    _index.flush()

def query(query, limit, offset=0):
    #q = _index.query_parser.parse_query(query, default_op=_index._sconn.OP_OR)
    q = _index.query_parser.parse_query(query)
    enquire = _index.get_enquire()
    enquire.set_query(q)
    #if auth.userAuth is not None:
    #    fq = _index._sconn.query_field('authorId', auth.userAuth['_id'])
    #q = _index._sconn.query_filter(q, fq)
    return enquire.get_mset(offset, limit)
    #return enquire.get_mset(offset, limit, checkatleast=1000, getfacets=True)

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

    def get_enquire(self):
        return xapian.Enquire(self._sdb)

    def get_indexer(self):
        indexer = xapian.TermGenerator()
        stemmer = xapian.Stem("english")
        indexer.set_stemmer(stemmer)
	return indexer


    def flush(self):
        self._idb.flush()

    def add_doc(self, doc):
        self._idb.add_document(doc)

_index = Index()
