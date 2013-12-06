# -*- encoding: UTF-8 -*-
import os
import xappy

import auth
from taskconfig import config

def index(task):
    doc = xappy.UnprocessedDocument()
    doc.fields.append(xappy.Field('id', task['_id']))
    doc.fields.append(xappy.Field('authorId', task['authorId']))
    doc.fields.append(xappy.Field('task', task['task']))
    if 'tags' in task:
        for tag in task['tags']:
            if len(tag):
                doc.fields.append(xappy.Field('tag', tag))

    _index.add_doc(doc)

def flush():
    _index.flush()

def query(query, limit, offset=0):
    _index._conn.reopen()
    q = _index._conn.query_parse(query, default_op=_index._conn.OP_OR)
    if auth.userAuth is not None:
        fq = _index._conn.query_field('authorId', auth.userAuth['_id'])
    q = _index._conn.query_filter(q, fq)

    results = _index._conn.search(q, offset, limit)
    return results

class Index:
    _sconn = None

    def __init__(self):
        if os.path.isdir(config['index']['path']):
            self.open_index(config['index']['path'])
        else:
            self.create_index(config['index']['path'])

    def __del__(self):
        if self._sconn:
            self._sconn.flush()
            self._sconn.close()

    def create_index(self, dbpath):
        """Create a new index, and set up its field structure.
        """
        print "create_index"
        self._sconn = xappy.IndexerConnection(dbpath)

        self._sconn.add_field_action('id', xappy.FieldActions.INDEX_EXACT)
        self._sconn.add_field_action('authorId', xappy.FieldActions.INDEX_EXACT)

        self._sconn.add_field_action('tag', xappy.FieldActions.INDEX_EXACT)
        self._sconn.add_field_action('tag', xappy.FieldActions.FACET, type='string')

        self._sconn.add_field_action('task', xappy.FieldActions.INDEX_FREETEXT, language='en')

        self._sconn.close()

    def open_index(self, dbpath):
        """Open an existing index. """
        self._sconn = xappy.IndexerConnection(dbpath)

    def flush(self):
        self._sconn.flush()

    def add_doc(self, doc):
        self._sconn.add(doc)

_index = Index()
